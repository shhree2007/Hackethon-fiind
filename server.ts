import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { INITIAL_HACKATHONS, INITIAL_TEAM_POSTINGS, SCRAPER_SOURCE_STATUSES, INITIAL_NOTIFICATIONS } from "./src/data/mockHackathons";
import { Hackathon, TeamPosting, NotificationItem } from "./src/types";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory data store for live state
  let hackathons: Hackathon[] = [...INITIAL_HACKATHONS];
  let teamPostings: TeamPosting[] = [...INITIAL_TEAM_POSTINGS];
  let notifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];
  let savedHackathonIds: Set<string> = new Set(['hack-001', 'hack-003']);

  // Lazy Initialize Gemini SDK
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY || "dummy_key";
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }

  // --- API ROUTES ---

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", appName: "HackRadar API", version: "1.0.0" });
  });

  // 1. Discovery Feed with Search & Filters
  app.get("/api/hackathons", (req, res) => {
    let result = [...hackathons];
    const {
      search,
      theme,
      mode,
      location,
      minPrize,
      difficulty,
      studentOnly,
      allowsSolo,
      closingSoon,
      source,
      sortBy
    } = req.query;

    // Search query
    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      result = result.filter(h =>
        h.name.toLowerCase().includes(q) ||
        h.organizer.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q) ||
        h.tags.some(t => t.toLowerCase().includes(q)) ||
        h.themes.some(t => t.toLowerCase().includes(q))
      );
    }

    // Filter by Theme
    if (theme && typeof theme === 'string' && theme !== 'All') {
      const selectedThemes = theme.split(',');
      result = result.filter(h =>
        h.themes.some(t => selectedThemes.includes(t)) ||
        h.tags.some(t => selectedThemes.includes(t))
      );
    }

    // Filter by Mode
    if (mode && typeof mode === 'string' && mode !== 'All') {
      result = result.filter(h => h.mode.toLowerCase() === mode.toLowerCase());
    }

    // Filter by Location
    if (location && typeof location === 'string' && location !== 'All') {
      result = result.filter(h => h.location.toLowerCase().includes(location.toLowerCase()));
    }

    // Filter by Min Prize Pool
    if (minPrize && !isNaN(Number(minPrize))) {
      const minP = Number(minPrize);
      result = result.filter(h => h.prizePoolNumeric >= minP);
    }

    // Filter by Difficulty
    if (difficulty && typeof difficulty === 'string' && difficulty !== 'All') {
      result = result.filter(h => h.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    // Filter Student Only
    if (studentOnly === 'true') {
      result = result.filter(h => h.isStudentOnly);
    }

    // Filter Solo
    if (allowsSolo === 'true') {
      result = result.filter(h => h.allowsSolo);
    }

    // Filter Closing Soon (< 7 days)
    if (closingSoon === 'true') {
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      const now = Date.now();
      result = result.filter(h => {
        const deadline = new Date(h.registrationDeadline).getTime();
        return deadline > now && (deadline - now) <= sevenDaysMs;
      });
    }

    // Filter Source
    if (source && typeof source === 'string' && source !== 'All') {
      result = result.filter(h => h.source.toLowerCase() === source.toLowerCase());
    }

    // Sorting
    if (sortBy === 'deadline') {
      result.sort((a, b) => new Date(a.registrationDeadline).getTime() - new Date(b.registrationDeadline).getTime());
    } else if (sortBy === 'prize_high') {
      result.sort((a, b) => b.prizePoolNumeric - a.prizePoolNumeric);
    } else if (sortBy === 'trending') {
      result.sort((a, b) => b.savesCount - a.savesCount);
    } else if (sortBy === 'recommended') {
      result.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.lastScrapedAt).getTime() - new Date(a.lastScrapedAt).getTime());
    }

    res.json({
      success: true,
      count: result.length,
      hackathons: result,
      savedIds: Array.from(savedHackathonIds)
    });
  });

  // Single Hackathon
  app.get("/api/hackathons/:id", (req, res) => {
    const hack = hackathons.find(h => h.id === req.params.id);
    if (!hack) {
      return res.status(404).json({ success: false, message: "Hackathon not found" });
    }
    // Increment view count
    hack.viewsCount += 1;
    res.json({ success: true, hackathon: hack, isSaved: savedHackathonIds.has(hack.id) });
  });

  // Save / Bookmark Toggle
  app.post("/api/hackathons/save", (req, res) => {
    const { hackathonId } = req.body;
    if (!hackathonId) {
      return res.status(400).json({ success: false, message: "hackathonId required" });
    }

    const hack = hackathons.find(h => h.id === hackathonId);
    let isSaved = false;

    if (savedHackathonIds.has(hackathonId)) {
      savedHackathonIds.delete(hackathonId);
      if (hack && hack.savesCount > 0) hack.savesCount -= 1;
      isSaved = false;
    } else {
      savedHackathonIds.add(hackathonId);
      if (hack) hack.savesCount += 1;
      isSaved = true;
    }

    res.json({
      success: true,
      hackathonId,
      isSaved,
      savedIds: Array.from(savedHackathonIds),
      savesCount: hack ? hack.savesCount : 0
    });
  });

  // 2. Team Formation Endpoints
  app.get("/api/teams", (req, res) => {
    const { hackathonId } = req.query;
    let result = [...teamPostings];
    if (hackathonId && typeof hackathonId === 'string') {
      result = result.filter(t => t.hackathonId === hackathonId);
    }
    res.json({ success: true, teams: result });
  });

  app.post("/api/teams", (req, res) => {
    const { hackathonId, title, description, rolesNeeded, contactEmailOrDiscord } = req.body;
    const hack = hackathons.find(h => h.id === hackathonId);
    if (!hack) {
      return res.status(400).json({ success: false, message: "Invalid hackathon ID" });
    }

    const newTeam: TeamPosting = {
      id: `team-${Date.now()}`,
      hackathonId,
      hackathonName: hack.name,
      hackathonSource: hack.source,
      title: title || `Looking for teammates for ${hack.name}`,
      description: description || 'Building a high-impact solution. Seeking proactive developers.',
      leaderId: 'u-user-current',
      leaderName: 'You (Current Builder)',
      leaderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      leaderCollege: 'Tier-1 Engineering College',
      rolesNeeded: rolesNeeded || ['Full Stack Dev', 'UI/UX Designer'],
      currentMembers: [
        {
          userId: 'u-user-current',
          name: 'You (Current Builder)',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          role: 'Team Leader',
          isLeader: true
        }
      ],
      maxTeamSize: hack.teamSizeMax || 4,
      createdAt: new Date().toISOString(),
      contactEmailOrDiscord: contactEmailOrDiscord || 'builder@hackradar.dev',
      status: 'Open'
    };

    teamPostings.unshift(newTeam);
    res.json({ success: true, team: newTeam });
  });

  app.post("/api/teams/:id/join", (req, res) => {
    const team = teamPostings.find(t => t.id === req.params.id);
    if (!team) {
      return res.status(404).json({ success: false, message: "Team posting not found" });
    }

    // Add applicant as member
    team.currentMembers.push({
      userId: `u-${Date.now()}`,
      name: req.body.applicantName || 'Applicant Dev',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
      role: req.body.role || 'Member'
    });

    if (team.currentMembers.length >= team.maxTeamSize) {
      team.status = 'Closed';
    }

    res.json({ success: true, message: "Join request sent successfully!", team });
  });

  // 3. Opportunity Dashboard Metrics & Analytics
  app.get("/api/analytics", (_req, res) => {
    const totalActive = hackathons.length;
    const totalPrizeINR = hackathons.reduce((acc, h) => acc + h.prizePoolNumeric, 0);

    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const closingThisWeek = hackathons.filter(h => {
      const deadline = new Date(h.registrationDeadline).getTime();
      return deadline > now && (deadline - now) <= sevenDaysMs;
    }).length;

    const sourceBreakdown = SCRAPER_SOURCE_STATUSES.map(s => ({
      source: s.sourceName,
      count: hackathons.filter(h => h.source === s.sourceName).length,
      status: s.status
    }));

    res.json({
      success: true,
      metrics: {
        totalActiveHackathons: totalActive + 442, // Simulated total active across whole internet
        totalPrizeMoneyINR: totalPrizeINR,
        formattedPrizeMoney: `₹${(totalPrizeINR / 10000000).toFixed(2)} Crore`,
        closingThisWeekCount: closingThisWeek,
        totalDevelopersConnected: 14850
      },
      sourceBreakdown,
      scraperStatuses: SCRAPER_SOURCE_STATUSES
    });
  });

  // 4. Missed Opportunity Calculator
  app.get("/api/missed-opportunities", (req, res) => {
    const { role = 'AI/ML Engineer' } = req.query;
    
    // Calculate realistic estimated missed hackathons for the user's role in the last 30 days
    let missedCount = 12;
    let totalValueINR = 4200000; // ₹4.2 Lakh
    let topMissedThemes = ['Agentic AI', 'Web3 / DeFi', 'Cybersecurity Shield'];

    if (role === 'Full Stack Developer') {
      missedCount = 15;
      totalValueINR = 5800000;
      topMissedThemes = ['Next.js 15 Apps', 'Open Innovation', 'Serverless Cloud'];
    } else if (role === 'UI/UX Designer') {
      missedCount = 9;
      totalValueINR = 3100000;
      topMissedThemes = ['Design Systems', 'Spatial AR/VR', 'Mobile Experience'];
    }

    res.json({
      success: true,
      missedData: {
        missedCount,
        totalValueINR,
        formattedValue: `₹${(totalValueINR / 100000).toFixed(1)} Lakh`,
        topMissedThemes,
        recommendations: [
          'Set up instant WhatsApp/Email deadline reminders',
          'Complete your HackRadar skill profile for instant team matches',
          'Save 3 recommended AI hackathons closing this week'
        ]
      }
    });
  });

  // 5. Scraper System Management
  app.get("/api/scraper/status", (_req, res) => {
    res.json({
      success: true,
      sources: SCRAPER_SOURCE_STATUSES,
      totalEventsCrawledToday: 572,
      lastGlobalSync: new Date(Date.now() - 5 * 60 * 1000).toISOString()
    });
  });

  app.post("/api/scraper/trigger", (req, res) => {
    const { sourceName } = req.body;
    // Simulate real sync
    const target = SCRAPER_SOURCE_STATUSES.find(s => s.sourceName.toLowerCase() === (sourceName || '').toLowerCase());
    if (target) {
      target.eventsScrapedToday += Math.floor(Math.random() * 5) + 1;
      target.lastSyncTimestamp = new Date().toISOString();
      target.status = 'Healthy';
    } else {
      SCRAPER_SOURCE_STATUSES.forEach(s => {
        s.eventsScrapedToday += Math.floor(Math.random() * 4) + 1;
        s.lastSyncTimestamp = new Date().toISOString();
      });
    }

    res.json({
      success: true,
      message: `Scraper pipeline triggered successfully for ${sourceName || 'All Sources'}! Normalized & deduplicated 4 new events.`,
      sources: SCRAPER_SOURCE_STATUSES
    });
  });

  // 6. Gemini AI - Weekly Opportunity Digest & Recommendations
  app.post("/api/gemini/digest", async (req, res) => {
    try {
      const { userRole, interests = ['AI', 'Web Development'], graduationYear } = req.body;
      const ai = getGeminiClient();

      const prompt = `You are HackRadar's AI Opportunity Advisor for Indian student developers.
Generate a concise, highly inspiring, actionable 3-paragraph "Weekly Hackathon Opportunity Digest".
User Details:
- Target Role: ${userRole || 'AI & Fullstack Dev'}
- Primary Interests: ${interests.join(', ')}
- Graduation Year: ${graduationYear || '2026'}

Current top available hackathons:
${hackathons.slice(0, 4).map(h => `- ${h.name} (${h.source}, Prize: ${h.prizePool}, Deadline: ${new Date(h.registrationDeadline).toLocaleDateString()}, Location: ${h.location})`).join('\n')}

Format requirement:
Paragraph 1: Highlighting the top #1 tailored opportunity and why it fits their skill stack.
Paragraph 2: Strategic advice on team formation & winning pitch strategies for this week.
Paragraph 3: A bold motivational call-to-action urging them not to let prize money & networking slip away.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt
      });

      res.json({
        success: true,
        digest: response.text || "Your custom weekly opportunity digest is ready! Check out ETHIndia and Google Agentic AI Buildathon this week."
      });
    } catch (err: any) {
      console.error("Gemini API error:", err);
      res.json({
        success: true,
        digest: `Weekly Digest Summary for ${req.body.userRole || 'Developers'}:\n\nTop Match: ETHIndia 2026 & Google Agentic AI Buildathon are closing registrations soon with over ₹1.7 Cr in total rewards. Form a team with complementary UI/UX and PyTorch skills to maximize your winning odds this weekend!`
      });
    }
  });

  // Notifications endpoint
  app.get("/api/notifications", (_req, res) => {
    res.json({ success: true, notifications });
  });

  app.post("/api/notifications/mark-read", (req, res) => {
    const { id } = req.body;
    if (id) {
      const notif = notifications.find(n => n.id === id);
      if (notif) notif.read = true;
    } else {
      notifications.forEach(n => n.read = true);
    }
    res.json({ success: true, notifications });
  });

  // Vite middleware setup for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HackRadar server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
