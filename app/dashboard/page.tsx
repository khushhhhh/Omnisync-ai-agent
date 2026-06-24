import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  WhatsappIcon, 
  TelegramIcon, 
  Mail01Icon, 
  Calendar01Icon,
  SparklesIcon,
  ArrowRight01Icon
} from "@hugeicons/core-free-icons";

// Hardcoded mock verified session for UI sprint (renders 100% statically without BaaS queries)
const user = { name: "Raghav (Lead Agent)", email: "raghav@omnisync.ai" };

/*
// SERVER-SIDE AUTHENTICATION LOGIC (COMMENTED OUT TO UNBLOCK SPRINT)
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAuthActions } from "@insforge/sdk/ssr";

const cookieStore = await cookies();
const auth = createAuthActions({ requestCookies: cookieStore });
const { data: { user: currentUser } } = await auth.getCurrentUser();
if (!currentUser) {
  redirect("/sign-in");
}
*/

export const metadata = {
  title: "Dashboard - Omnisync.ai",
  description: "Manage your AI personal agent integrations and webhooks.",
};

export default function DashboardPage() {
  const integrations = [
    {
      id: "whatsapp",
      name: "WhatsApp AI Dispatcher",
      description: "Smart suggested responses and quick reply streams for customer relation chats.",
      icon: WhatsappIcon,
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      status: "Disconnected",
      isActiveSprint: true,
    },
    {
      id: "telegram",
      name: "Telegram Webhook Bot",
      description: "Monitor chat support, extract action items, and broadcast summaries to channels.",
      icon: TelegramIcon,
      iconColor: "text-sky-400 bg-sky-500/10 border-sky-500/20",
      status: "Disconnected",
      isActiveSprint: false,
    },
    {
      id: "gmail",
      name: "Gmail Autonomous Reader",
      description: "Scan email threads, draft contextual replies, and flag high-priority messages.",
      icon: Mail01Icon,
      iconColor: "text-red-400 bg-red-500/10 border-red-500/20",
      status: "Disconnected",
      isActiveSprint: false,
    },
    {
      id: "outlook",
      name: "Outlook Calendar Sync",
      description: "Audit team calendars, auto-resolve conflicts, and schedule smart meetings.",
      icon: Calendar01Icon,
      iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      status: "Disconnected",
      isActiveSprint: false,
    },
  ];

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
          <HugeiconsIcon icon={SparklesIcon} size={12} className="animate-pulse" />
          Multi-App Hub
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Neural Dispatch Dock
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl font-normal leading-relaxed">
          Manage your autonomous integrations, check agent status, and connect communication loops.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              className={`relative bg-white/5 backdrop-blur-md rounded-2xl p-6 md:p-8 flex flex-col justify-between min-h-[240px] overflow-hidden group transition-all duration-300 border ${
                item.isActiveSprint
                  ? "border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.08)] ring-1 ring-emerald-500/20 hover:border-emerald-500/60"
                  : "border-white/10 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.02)]"
              }`}
            >
              {/* Glowing gradient background effects */}
              {item.isActiveSprint && (
                <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-emerald-500/10 blur-[40px] pointer-events-none group-hover:bg-emerald-500/15 transition-all duration-300" />
              )}

              {/* Card Header info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl border shadow-sm transition-transform duration-300 group-hover:scale-105 ${item.iconColor}`}>
                      <HugeiconsIcon icon={IconComponent} size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white tracking-tight">{item.name}</h3>
                      {item.isActiveSprint && (
                        <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase block">
                          Active Sprint Target
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/50 border border-red-500/10 text-[9px] font-bold text-red-400 uppercase tracking-widest shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500/80 animate-pulse" />
                    {item.status}
                  </div>
                </div>

                <p className="text-slate-400 text-xs leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              {/* Card Action footer */}
              <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                  Auth Mode: Insforge SDK
                </span>
                <button className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 active:scale-95 text-slate-300 hover:text-white font-semibold text-xs tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-1.5">
                  <span>Connect</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
