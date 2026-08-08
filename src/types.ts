export type HackathonSource = 
  | 'Unstop' 
  | 'Devfolio' 
  | 'Devpost' 
  | 'Reskilll' 
  | 'HackerEarth' 
  | 'HackerRank' 
  | 'College Website' 
  | 'LinkedIn Community';

export type HackathonMode = 'Online' | 'Offline' | 'Hybrid';

export type DifficultyLevel = 'Beginner Friendly' | 'Intermediate' | 'Advanced' | 'All Levels';

export interface Hackathon {
  id: string;
  name: string;
  organizer: string;
  source: HackathonSource;
  sourceLogo?: string;
  bannerImage: string;
  prizePool: string; // e.g. "₹5,000,000" or "$25,000"
  prizePoolNumeric: number; // For sorting and filtering
  currency: 'INR' | 'USD';
  registrationDeadline: string; // ISO date string
  startDate: string;
  endDate: string;
  mode: HackathonMode;
  location: string; // e.g., "Delhi NCR", "Bengaluru", "Online", "Mumbai"
  teamSizeMin: number;
  teamSizeMax: number;
  themes: string[]; // e.g., ["AI", "Web Development", "Cybersecurity"]
  difficulty: DifficultyLevel;
  registrationUrl: string;
  isStudentOnly: boolean;
  allowsSolo: boolean;
  featured?: boolean;
  savesCount: number;
  viewsCount: number;
  matchScore?: number; // Calculated personalized percentage
  description: string;
  eligibility: string;
  tags: string[];
  verified: boolean;
  lastScrapedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  collegeOrCompany: string;
  graduationYear?: string;
  role: 'AI/ML Engineer' | 'Full Stack Developer' | 'UI/UX Designer' | 'Cybersecurity Specialist' | 'Web3 / Blockchain Dev' | 'Mobile Developer' | 'DevOps & Cloud';
  skills: string[];
  bio: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  interests: string[]; // E.g., ["AI", "Web Development", "Blockchain"]
  preferredLocations: string[];
  hackathonsWon: number;
  hackathonsParticipated: number;
  lookingForTeam: boolean;
  savedHackathonIds: string[];
}

export interface TeamMember {
  userId: string;
  name: string;
  avatarUrl: string;
  role: string;
  isLeader?: boolean;
}

export interface TeamPosting {
  id: string;
  hackathonId: string;
  hackathonName: string;
  hackathonSource: HackathonSource;
  title: string;
  description: string;
  leaderId: string;
  leaderName: string;
  leaderAvatar: string;
  leaderCollege: string;
  rolesNeeded: string[]; // e.g. ["PyTorch Dev", "Figma Designer"]
  currentMembers: TeamMember[];
  maxTeamSize: number;
  createdAt: string;
  contactEmailOrDiscord: string;
  status: 'Open' | 'Closed';
}

export interface HackathonFilterOptions {
  searchQuery: string;
  themes: string[];
  mode: HackathonMode | 'All';
  location: string;
  minPrizePool: number;
  difficulty: string;
  isStudentOnly: boolean;
  allowsSolo: boolean;
  isClosingSoon: boolean; // < 7 days
  source: string;
  sortBy: 'recommended' | 'deadline' | 'prize_high' | 'trending' | 'newest';
}

export interface ScraperSourceStatus {
  sourceName: HackathonSource;
  status: 'Healthy' | 'Syncing' | 'Degraded';
  eventsScrapedToday: number;
  totalActiveEvents: number;
  lastSyncTimestamp: string;
  latencyMs: number;
  scraperType: 'GraphQL API' | 'Puppeteer DOM Crawler' | 'REST Endpoint' | 'Playwright Engine';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'deadline' | 'recommendation' | 'team_request' | 'system';
  hackathonId?: string;
  read: boolean;
}

export interface MissedOpportunityData {
  missedCount: number;
  totalValueINR: number;
  topMissedThemes: string[];
  recommendations: string[];
}
