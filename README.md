<div align="center">
  <img src="public/globe.svg" alt="Omnisync.ai Logo" width="80" height="80">
  <h1 align="center">Omnisync.ai</h1>
  <p align="center">
    <strong>Agentic Executive OS for Cross-Platform Workflows</strong>
  </p>
  <p align="center">
    <a href="https://omnisync-ai.vercel.app"><strong>View Live Demo →</strong></a>
  </p>
</div>

---

## 🧠 Overview

Omnisync.ai is an intelligent, autonomous "Chief of Staff" built to unify your digital workspace. By sitting between the noise of your inbox and your execution layer, the Neural Core (powered by Gemini 2.0 Flash) extracts actionable tasks, flags calendar collisions, and drafts context-aware replies—all visible from a single, glassmorphic Neural Command Center.

## ✨ Features

- **Contextual Inbox Summaries:** The agent reads 50-message email threads via Google OAuth and outputs concise, 3-bullet action briefs.
- **Telegram Task Extraction:** Turn unstructured thoughts and support channel chatter into a clean, prioritized checklist using Telegram Webhooks.
- **WhatsApp Dispatcher:** A gateway (via Sent.dm) that lets the agent monitor conversations and draft perfect responses while you sleep.
- **Smart Calendar Resolution:** Detects meeting overlaps, analyzes participant seniority/urgency, and autonomously drafts reschedule suggestions.
- **Premium Glassmorphic UI:** Built with Next.js 15, Tailwind CSS, and Hugeicons, featuring dark-mode aesthetics, micro-animations, and dynamic real-time status indicators.

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router, Server Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Dark Mode, Glassmorphism)
- **AI Core:** Gemini 2.0 Flash API
- **Auth & DB:** Insurge BaaS (PostgreSQL, OAuth)
- **Integrations:** Google Workspace (Gmail/Calendar API), Telegram Bot API, WhatsApp (Sent.dm API)

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/khushhhhh/Omnisync-ai-agent.git
   cd Omnisync-ai-agent
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your keys (refer to the `.env.local` placeholders in the codebase):
   - `GEMINI_API_KEY` (from Google AI Studio)
   - `TELEGRAM_BOT_TOKEN` (from BotFather)
   - Add `credentials.json` for Gmail OAuth access.

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3002`.

## 🌐 Deployment

This project is optimized for deployment on Vercel. 
Simply push to GitHub and connect the repository in your Vercel Dashboard for instant CI/CD.

<p align="center">
  <i>Built with ❤️ by Khush Raghav</i>
</p>
