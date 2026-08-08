import React, { useState } from 'react';
import { 
  Cpu, 
  Database, 
  Globe, 
  Shield, 
  Calendar, 
  Layers, 
  Server, 
  Code, 
  Zap, 
  CheckCircle2, 
  FileCode, 
  GitBranch,
  Terminal,
  ChevronRight
} from 'lucide-react';

export const ScraperArchitectureModal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'schema' | 'scraper' | 'roadmap'>('architecture');

  return (
    <div className="space-y-6 text-slate-100">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-6 h-6 text-indigo-400" />
            <h2 className="text-2xl font-bold tracking-tight text-white">System Architecture & Technical Documentation</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Production blueprints for HackRadar: Scrapers, Database Schema, 7-Day MVP & 100,000+ User Scale Specs.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-950 p-1 border border-slate-800 rounded-xl gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'architecture' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            System Map
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'schema' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Database Schema
          </button>
          <button
            onClick={() => setActiveTab('scraper')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'scraper' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Scraper Engine
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'roadmap' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Roadmap (7D & 100k)
          </button>
        </div>
      </div>

      {/* Tab Content 1: System Architecture */}
      {activeTab === 'architecture' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-400" />
            <span>Complete Full-Stack Architecture</span>
          </h3>

          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-indigo-400 font-bold uppercase block">1. Frontend Layer</span>
              <p className="text-slate-300 font-medium">Next.js 15 App Router / React 19 + TypeScript</p>
              <ul className="text-slate-400 space-y-1 list-disc list-inside">
                <li>Tailwind CSS + Shadcn UI design components</li>
                <li>Framer Motion route transitions & animations</li>
                <li>Client-side state & instant filtering hooks</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-cyan-400 font-bold uppercase block">2. Backend & Scraper Engine</span>
              <p className="text-slate-300 font-medium">Node.js Express + Python Puppeteer Services</p>
              <ul className="text-slate-400 space-y-1 list-disc list-inside">
                <li>REST & GraphQL endpoint proxies</li>
                <li>Automated crawler workers (Unstop, Devfolio, Devpost, Reskilll)</li>
                <li>Gemini 3.5 Server-side SDK for AI scoring</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-emerald-400 font-bold uppercase block">3. Data & Storage Layer</span>
              <p className="text-slate-300 font-medium">PostgreSQL + Prisma ORM / Redis Cache</p>
              <ul className="text-slate-400 space-y-1 list-disc list-inside">
                <li>Normalized Hackathon & Source tables</li>
                <li>Deduplication pipeline via Fuzzy Levenshtein matching</li>
                <li>Redis in-memory caching for &lt;50ms discovery queries</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Database Schema */}
      {activeTab === 'schema' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" />
              <span>Prisma PostgreSQL Database Schema</span>
            </h3>
            <span className="text-xs font-mono text-slate-500">prisma/schema.prisma</span>
          </div>

          <pre className="bg-slate-950 p-4 border border-slate-800 rounded-xl text-xs font-mono text-indigo-200 overflow-x-auto leading-relaxed">
{`datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Hackathon {
  id                   String       @id @default(uuid())
  title                String
  organizer            String
  sourcePlatform       SourceType   // UNSTOP, DEVFOLIO, DEVPOST, RESKILLL, HACKEREARTH
  bannerUrl            String?
  prizePoolAmount      Decimal?     @db.Decimal(12, 2)
  currency             String       @default("INR")
  registrationDeadline DateTime
  startDate            DateTime
  endDate              DateTime
  mode                 EventMode    // ONLINE, OFFLINE, HYBRID
  location             String?
  teamSizeMin          Int          @default(1)
  teamSizeMax          Int          @default(4)
  difficulty           Difficulty   @default(ALL_LEVELS)
  registrationUrl      String       @unique
  isStudentOnly        Boolean      @default(false)
  allowsSolo           Boolean      @default(true)
  description          String       @db.Text
  eligibility          String?
  rawHash              String       @unique // Deduplication Hash
  verified             Boolean      @default(true)
  createdAt            DateTime     @default(now())
  updatedAt            DateTime     @updatedAt

  themes               HackathonTheme[]
  bookmarks            Bookmark[]
  teams                TeamPosting[]
}

model User {
  id                   String       @id @default(uuid())
  clerkId              String       @unique
  email                String       @unique
  name                 String
  role                 UserRole
  collegeOrCompany     String?
  graduationYear       Int?
  skills               String[]
  githubUrl            String?
  linkedinUrl          String?
  bio                  String?

  bookmarks            Bookmark[]
  teams                TeamPosting[] @relation("TeamLeader")
  teamMemberships      TeamMember[]
}`}
          </pre>
        </div>
      )}

      {/* Tab Content 3: Scraper Architecture */}
      {activeTab === 'scraper' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            <span>Crawler & Deduplication Architecture</span>
          </h3>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <h4 className="font-bold text-indigo-300">1. Modular Source Crawlers</h4>
              <p>Each platform uses a dedicated scraper adapter extending a common <code className="text-cyan-300 font-mono">BaseScraper</code> interface:</p>
              <ul className="list-disc list-inside text-slate-400 space-y-1">
                <li><strong>Devfolio:</strong> GraphQL Query endpoint to fetch active hackathons & prize pools.</li>
                <li><strong>Unstop:</strong> REST JSON API pipeline with pagination token handling.</li>
                <li><strong>Devpost:</strong> Cheerio / Puppeteer HTML DOM parser extracting cards & deadline timers.</li>
                <li><strong>Reskilll & HackerEarth:</strong> Daily API sync cron worker.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <h4 className="font-bold text-amber-300">2. Event Deduplication Engine</h4>
              <p>When the same hackathon is posted on multiple sites (e.g. SIH on Unstop & College Portals):</p>
              <pre className="p-2 bg-slate-900 rounded font-mono text-[11px] text-amber-200">
{`const normalizedTitle = title.toLowerCase().replace(/[^a-z0-0]/g, '');
const hashKey = md5(\`\${normalizedTitle}_\${startDate.toISOString().slice(0,10)}\`);
// Check if hashKey exists in Postgres before inserting.`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 4: Roadmaps */}
      {activeTab === 'roadmap' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h3 className="font-bold text-base text-emerald-400 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>7-Day MVP Build Roadmap</span>
            </h3>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <strong>Day 1-2:</strong> Setup Next.js 15, Prisma PostgreSQL schema & Clerk Auth.
              </li>
              <li className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <strong>Day 3-4:</strong> Write Unstop & Devfolio scraping adapters + deduplication hash pipeline.
              </li>
              <li className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <strong>Day 5:</strong> Build Discovery Feed UI with instant filters & theme chips.
              </li>
              <li className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <strong>Day 6:</strong> Implement Team Formation board & Save watchlist drawer.
              </li>
              <li className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <strong>Day 7:</strong> Integrate Gemini 3.5 AI Weekly Digest & deploy to Cloud Run / Vercel!
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h3 className="font-bold text-base text-purple-400 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>Future Scaling Roadmap (100,000+ Users)</span>
            </h3>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <strong>Infrastructure:</strong> Redis Cluster caching layer for feed endpoints (&lt;20ms latency).
              </li>
              <li className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <strong>Scraper Distributed Queue:</strong> BullMQ + Redis workers with Playwright headless browsers.
              </li>
              <li className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <strong>Smart Notifications:</strong> WhatsApp Cloud API + Telegram bot deadline alerts.
              </li>
              <li className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <strong>AI Vector Search:</strong> pgvector for semantic search ("Find AI hackathons with high prize money in NCR").
              </li>
            </ul>
          </div>
        </div>
      )}

    </div>
  );
};
