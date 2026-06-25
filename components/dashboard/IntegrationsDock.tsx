"use client";

import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  WhatsappIcon, 
  TelegramIcon, 
  Mail01Icon, 
  Calendar01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  TickDouble02Icon
} from "@hugeicons/core-free-icons";

export default function IntegrationsDock() {
  // Client-side connection states (zero backend API calls)
  const [connections, setConnections] = useState<Record<string, boolean>>({
    whatsapp: true, // Mock WhatsApp as connected initially
    telegram: false,
    gmail: false,
    outlook: false,
  });

  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [telegramConfigured, setTelegramConfigured] = useState(false);
  const [isSyncingTelegram, setIsSyncingTelegram] = useState(false);

  // Check connection configurations on mount
  React.useEffect(() => {
    const checkGmailAuth = async () => {
      try {
        const res = await fetch("/api/gmail");
        const data = await res.json() as { authenticated?: boolean };
        if (data.authenticated) {
          setConnections(prev => ({ ...prev, gmail: true }));
        }
      } catch (err) {
        console.error("Failed to check Gmail connection status:", err);
      }
    };

    const checkTelegramConfig = async () => {
      try {
        const res = await fetch("/api/telegram/sync");
        const data = await res.json() as { isConfigured?: boolean };
        if (data.isConfigured) {
          setTelegramConfigured(true);
        }
      } catch (err) {
        console.error("Failed to check Telegram configuration:", err);
      }
    };

    checkGmailAuth();
    checkTelegramConfig();
  }, []);

  const handleSyncPocket = async () => {
    setIsSyncingTelegram(true);
    try {
      if (typeof window !== "undefined" && (window as any).handleSyncPocket) {
        await (window as any).handleSyncPocket();
      } else {
        const res = await fetch("/api/telegram/sync");
        const data = await res.json();
        if (data.tasks && data.tasks.length > 0) {
          // Dispatch custom browser event to notify DailyBrief checklist
          const event = new CustomEvent("telegram-tasks-synced", { detail: data.tasks });
          window.dispatchEvent(event);
        }
      }
    } catch (err) {
      console.error("Failed to sync Telegram tasks:", err);
    } finally {
      setIsSyncingTelegram(false);
    }
  };

  const apps = {
    whatsapp: {
      name: "WhatsApp AI Dispatcher",
      icon: WhatsappIcon,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      description: "Smart suggested responses and quick reply streams for customer relation chats.",
      instructions: "To link your WhatsApp Agent, scan the QR code or enter your API key configuration in .env.",
    },
    telegram: {
      name: "Telegram Webhook Bot",
      icon: TelegramIcon,
      color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
      description: "Monitor chat support, extract action items, and broadcast summaries to channels.",
      instructions: "To configure the Telegram bot webhook, set TELEGRAM_BOT_TOKEN and Webhook URLs.",
    },
    gmail: {
      name: "Gmail Autonomous Reader",
      icon: Mail01Icon,
      color: "text-red-400 bg-red-500/10 border-red-500/20",
      description: "Scan email threads, draft contextual replies, and flag high-priority messages.",
      instructions: "To authorize the Gmail reader agent, configure OAuth Credentials in Insforge Console.",
    },
    outlook: {
      name: "Outlook Calendar Sync",
      icon: Calendar01Icon,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      description: "Audit team calendars, auto-resolve conflicts, and schedule smart meetings.",
      instructions: "To sync your Outlook calendar, configure the Microsoft Graph OAuth scope keys.",
    },
  };

  const handleConnect = (appId: string) => {
    if (appId === "gmail") {
      window.location.href = "/api/auth/google";
      return;
    }
    setConnections(prev => ({ ...prev, [appId]: true }));
    setModalOpen(false);
  };

  const handleDisconnect = (appId: string) => {
    setConnections(prev => ({ ...prev, [appId]: false }));
    setSettingsOpen(false);
  };

  const integrations = [
    {
      id: "whatsapp",
      ...apps.whatsapp,
      status: connections.whatsapp ? "Connected" : "Disconnected",
      statusColor: connections.whatsapp ? "text-emerald-400 border-emerald-500/10" : "text-red-400 border-red-500/10",
      statusDot: connections.whatsapp ? "bg-emerald-500" : "bg-red-500",
      isActiveSprint: !connections.whatsapp,
    },
    {
      id: "telegram",
      ...apps.telegram,
      status: telegramConfigured ? "Connected (Live Sync)" : (connections.telegram ? "Connected" : "Disconnected"),
      statusColor: telegramConfigured 
        ? "text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)] bg-emerald-500/5" 
        : (connections.telegram ? "text-emerald-400 border-emerald-500/10" : "text-red-400 border-red-500/10"),
      statusDot: telegramConfigured || connections.telegram ? "bg-emerald-500" : "bg-red-500",
      isActiveSprint: false,
    },
    {
      id: "gmail",
      ...apps.gmail,
      status: connections.gmail ? "Connected" : "Disconnected",
      statusColor: connections.gmail ? "text-emerald-400 border-emerald-500/10" : "text-red-400 border-red-500/10",
      statusDot: connections.gmail ? "bg-emerald-500" : "bg-red-500",
      isActiveSprint: false,
    },
    {
      id: "outlook",
      ...apps.outlook,
      status: connections.outlook ? "Connected" : "Disconnected",
      statusColor: connections.outlook ? "text-emerald-400 border-emerald-500/10" : "text-red-400 border-red-500/10",
      statusDot: connections.outlook ? "bg-emerald-500" : "bg-red-500",
      isActiveSprint: false,
    },
  ];

  const capabilities = [
    { label: "Fetch recent messages", desc: "Retrieve active logs and trace threads." },
    { label: "Read chat history", desc: "Access conversations contextually for better memory." },
    { label: "Summarize unread blasts", desc: "Form digests of unread support group updates." },
    { label: "Autonomous Auto-reply", desc: "Draft replies or reply in autopilot mode." },
  ];

  return (
    <div className="w-full">
      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
        {integrations.map((item) => {
          const IconComponent = item.icon;
          const isConnected = connections[item.id] || (item.id === "telegram" && telegramConfigured);
          return (
            <div
              key={item.id}
              className={`relative bg-white/5 backdrop-blur-md rounded-2xl p-6 md:p-8 flex flex-col justify-between min-h-[220px] overflow-hidden group transition-all duration-300 border ${
                item.isActiveSprint
                  ? "border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.08)] ring-1 ring-emerald-500/20 hover:border-emerald-500/60"
                  : "border-white/10 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.02)]"
              }`}
            >
              {/* Glowing gradient background effects */}
              {isConnected && (
                <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-emerald-500/5 blur-[40px] pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-300" />
              )}

              {/* Card Header info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl border shadow-sm transition-transform duration-300 group-hover:scale-105 ${item.color}`}>
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
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/50 border text-[9px] font-bold uppercase tracking-widest shrink-0 ${item.statusColor}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${item.statusDot} ${isConnected ? "animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" : ""}`} />
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
                
                {item.id === "telegram" && telegramConfigured ? (
                  <button 
                    onClick={handleSyncPocket}
                    disabled={isSyncingTelegram}
                    className="px-4 py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 active:scale-95 text-emerald-400 hover:text-emerald-300 font-semibold text-xs tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <span>{isSyncingTelegram ? "Syncing..." : "🔄 Sync Pocket"}</span>
                  </button>
                ) : isConnected ? (
                  <button 
                    onClick={() => {
                      setSelectedApp(item.id);
                      setSettingsOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 active:scale-95 text-slate-300 hover:text-white font-semibold text-xs tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Settings</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={13} />
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setSelectedApp(item.id);
                      setModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 active:scale-95 text-emerald-400 hover:text-emerald-300 font-semibold text-xs tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Connect</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CONNECT DIALOG (Glassmorphic Modal) */}
      {modalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
          <div className="w-full max-w-md bg-[#0a0a0c]/95 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
            {/* Ambient glow */}
            <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-emerald-500/10 blur-[40px] pointer-events-none" />

            {/* Modal Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <HugeiconsIcon icon={apps[selectedApp as keyof typeof apps].icon} size={20} className="text-emerald-400" />
                  Connect {apps[selectedApp as keyof typeof apps].name}
                </h3>
                <p className="text-slate-400 text-xs mt-1">Configure client credentials to link integration</p>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={18} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Instructions:</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {apps[selectedApp as keyof typeof apps].instructions}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-white/5">
                <button
                  onClick={() => handleConnect(selectedApp)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>
                    {selectedApp === "gmail" ? "Connect Google Account" : "Simulate Stable Connection"}
                  </span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={15} />
                </button>
                
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-full py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-xs font-semibold hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS VIEW DIALOG (Glassmorphic Modal) */}
      {settingsOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
          <div className="w-full max-w-md bg-[#0a0a0c]/95 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
            {/* Ambient glow */}
            <div className="absolute -left-16 -top-16 h-36 w-36 rounded-full bg-emerald-500/10 blur-[40px] pointer-events-none" />

            {/* Modal Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <HugeiconsIcon icon={apps[selectedApp as keyof typeof apps].icon} size={20} className="text-emerald-400" />
                  {apps[selectedApp as keyof typeof apps].name} Settings
                </h3>
                <p className="text-slate-400 text-xs mt-1">Configure active capabilities for this connection</p>
              </div>
              <button 
                onClick={() => setSettingsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={18} />
              </button>
            </div>

            {/* Capabilities List */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                MCP Agent Capabilities
              </h4>
              
              <div className="space-y-2.5">
                {capabilities.map((cap, i) => (
                  <div 
                    key={i} 
                    className="flex items-start gap-3.5 p-3.5 bg-white/5 border border-white/5 rounded-xl transition-colors hover:bg-white/8 hover:border-white/10"
                  >
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <HugeiconsIcon icon={TickDouble02Icon} size={12} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-white">{cap.label}</span>
                      <span className="text-[10px] text-slate-400 leading-normal mt-0.5">{cap.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disconnect Action */}
            <div className="pt-5 border-t border-white/5 flex flex-col gap-3">
              <button
                onClick={() => setSettingsOpen(false)}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs tracking-wide transition-all cursor-pointer"
              >
                Save Settings
              </button>
              <button
                onClick={() => handleDisconnect(selectedApp)}
                className="w-full py-2.5 rounded-xl border border-red-500/20 hover:bg-red-500/10 text-red-400 hover:text-red-200 text-xs font-semibold transition-all cursor-pointer"
              >
                Disconnect Integration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
