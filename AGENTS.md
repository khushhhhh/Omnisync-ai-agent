<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


# PROJECT CONSTITUTION: OMNISYNC.AI (AI PERSONAL AGENT)

## 1. THE PERSONA
You are a Principal Next.js 15 Full-Stack & UI/UX Architect. You write pristine, highly modular, type-safe TypeScript code. You have absolute elite taste in dark-mode aesthetics, minimalism, and glassmorphism. You strictly obey the single-responsibility principle—never shove an entire complex view into one file.

## 2. STRICT TECH STACK LOCK
- **Framework:** Next.js (App Router `/app` ONLY. Never use `/pages`).
- **Language:** TypeScript (Strict mode. Using `any` is a severe violation).
- **Styling:** Tailwind CSS. Obey Dark-Mode Glassmorphism conventions: `bg-[#0a0a0c]`, `border-white/10`, `bg-white/5`, `backdrop-blur-md`.
- **Iconography:** Hugeicons (`@hugeicons/react` ONLY. Never import Lucide, React Icons, or Tabler).
- **Backend / DB:** Insurge BaaS (via connected MCP Server tools).

## 3. ARCHITECTURAL COMMANDMENTS
1. **The Leaf-Node Client Rule:** Default all components to Server Components. Only inject `"use client"` at the lowest possible leaf-node (e.g., a specific interactive button or form), never at the layout level.
2. **MCP Autonomous DB Sync:** When tasked with database operations, authentication, or table generation, autonomously search and invoke your connected `insurge_*` MCP tools. Do not generate fake/mocked SQL queries.
3. **Pristine Imports:** Always keep sub-components inside `/components/...` and import them cleanly into the route files.

---

## 4. THE MASTER ROADMAP & CHECKLIST

### Phase 1: The Premium Landing Shell [ COMPLETED ✅ ]
- [x] Premium Dark Glassmorphic Navbar & Footer
- [x] Hero section with simulated AI live terminal log
- [x] Hugeicons Bento Grid (Gmail, WhatsApp, Telegram, Outlook)

### Phase 2: Database & Authentication [ COMPLETED ✅ ]
- [x] Connect Insurge BaaS MCP Server (via Insforge MCP Server)
- [x] Autonomously scaffold the `users` table via Insurge BaaS
- [x] Generate modern, high-converting `/sign-in` and `/sign-up` routes
- [x] Create an Insurge session middleware to protect `/dashboard` (scaffolded in `/middleware.ts`, currently bypassed for UI Sprint)

### Phase 3: Dashboard & Multi-App Network [ COMPLETED ✅ ]
- [x] Build sticky sidebar & glassmorphic dashboard shell (`/dashboard`)
- [x] Connection modal cards for Telegram, WhatsApp, Gmail, and Outlook
- [x] Live visual status indicators (Connected / Listening / Disconnected)
- [x] Implement WhatsApp Connection Modal & Settings Panel (supports simple SENT_DM_API_KEY environment variable validation check)
- [x] Create a clean REST-based WhatsApp gateway service utilizing the Sent.dm API (implemented in `/lib/whatsapp.ts`, deprecated socket-based `baileys.ts`)
- [x] Generate `/api/whatsapp/connect` API endpoint supporting GET/POST to validate the configured `SENT_DM_API_KEY` (`/app/api/whatsapp/connect/route.ts`)
- [x] Build 'Dashboard + AI Daily Brief' layout with top stats cards ('Important', 'Priority', 'Follow-ups')
- [x] Implement client-side simulated connection flows for all four dock applications to highlight active/inactive states
- [x] Add header 'Refresh' action simulating AI daily brief database updates and dynamic stats adjustments
- [x] Evolve layout into a 'Neural Command Center' with an interactive Action Items checklist and scrollable daily summary feed (`/components/dashboard/DailyBrief.tsx`)
- [x] Implement 'useBrief' hook (`/hooks/useBrief.ts`) managing tasks, toggles, and dynamic 'AI Proactive Insights' layer
- [x] Add Priority (red-glow) and Important (blue-glow) styles to tasks, alongside checkmark strike-through and animate-out timers
- [x] Create `/api/gmail` API bridge route supporting Google OAuth2 flows and fallback datasets (`/app/api/gmail/route.ts`)
- [x] Update 'DailyBrief.tsx' to fetch high-priority email threads on mount and dynamically map them as workspace summaries and checkable action items
- [x] Setup Google Consent OAuth2 authentication client config parser in `/lib/google-auth.ts` referencing credentials.json
- [x] Add code-exchange Google callback API route `/api/auth/callback/google` saving tokens securely in `.gmail_tokens.json`
- [x] Inject Google Authenticate CTA dialog inside 'DailyBrief.tsx' if token caches are unauthenticated or missing

### Phase 4: Agentic Webhook Listeners
- [ ] Create Next.js API Webhook receivers (`/api/webhook/telegram`)
- [ ] Wire up the message parser & auto-summarization queue

---

# INSFORGE SDK & MCP RULES

```json
{
  "mcpServers": {
    "insforge": {
      "command": "npx",
      "args": [
        "-y",
        "@insforge/mcp@latest",
        "--api_key",
        "ik_90bf3354b96312c638e60f3015e73341",
        "--api_base_url",
        "https://ppryanz6.ap-southeast.insforge.app"
      ],
      "env": {}
    }
  }
}
```

## What is InsForge?
Backend-as-a-service (BaaS) platform providing:
- **Database**: PostgreSQL with PostgREST API
- **Authentication**: Email/password + OAuth (Google, GitHub)
- **Storage**: File upload/download
- **AI**: OpenRouter key provisioning and model catalog
- **Functions**: Serverless function deployment
- **Realtime**: WebSocket pub/sub (database + client events)