"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import IntegrationsDock from "@/components/dashboard/IntegrationsDock";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  TickDouble02Icon, 
  Cancel01Icon, 
  AlertCircleIcon,
  SparklesIcon,
  Calendar01Icon,
  Mail01Icon,
  TelegramIcon,
  WhatsappIcon
} from "@hugeicons/core-free-icons";

interface ActionTask {
  id: string;
  task: string;
  source: "github" | "whatsapp" | "gmail" | "outlook" | "telegram";
  done: boolean;
  priority: "High" | "Medium" | "Low";
  details: string;
  importance: "Priority" | "Important" | "Normal";
  suggestedDraft?: string;
  extractedEmail?: string;
  subject?: string;
}

interface EmailBrief {
  id: string;
  title: string;
  priority: "URGENT" | "HIGH" | "NORMAL";
  platform: "GMAIL";
  time: string;
  summary: string;
  suggestedDraft: string;
  extractedEmail: string;
  subject: string;
}

interface CollisionResult {
  collisionDetected: boolean;
  clashingTitles?: [string, string];
  lowerPriorityTitle?: string;
  suggestedFix?: string;
  reasoning?: string;
}

function DashboardContent() {
  const [tasks, setTasks] = useState<ActionTask[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [isSyncingTelegram, setIsSyncingTelegram] = useState(false);

  const [collisionData, setCollisionData] = useState<CollisionResult | null>(null);
  const [loadingCalendar, setLoadingCalendar] = useState(true);

  const [emails, setEmails] = useState<EmailBrief[]>([]);
  const [loadingEmails, setLoadingEmails] = useState(true);
  const [gmailAuthenticated, setGmailAuthenticated] = useState(true);
  const [gmailAuthUrl, setGmailAuthUrl] = useState<string | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ActionTask | null>(null);
  const [isSendingDraft, setIsSendingDraft] = useState(false);
  const [animatingOut, setAnimatingOut] = useState<string[]>([]);

  const [whatsappChats, setWhatsappChats] = useState<any[]>([]);
  const [loadingWhatsapp, setLoadingWhatsapp] = useState(true);
  const [whatsappStatus, setWhatsappStatus] = useState<string>("loading");

  const searchParams = useSearchParams();
  const status = searchParams ? searchParams.get("status") : null;

  const [telegramConfigured, setTelegramConfigured] = useState(false);

  // Fetch Telegram sync updates
  const fetchTelegram = async (showSyncState = false) => {
    if (showSyncState) {
      setIsSyncingTelegram(true);
    }
    setLoadingTasks(true);
    try {
      const res = await fetch("/api/telegram/sync");
      if (!res.ok) throw new Error("Failed to fetch Telegram tasks");
      const data = await res.json();
      setTelegramConfigured(!!data.isConfigured);
      if (data.tasks) {
        setTasks(prev => {
          const filtered = prev.filter(t => !t.id.startsWith("telegram-task-") && !t.id.startsWith("tg-"));
          const mapped = data.tasks.map((t: any) => {
            let priority: "High" | "Medium" | "Low" = "Low";
            let importance: "Priority" | "Important" | "Normal" = "Normal";

            if (t.priority === "URGENT") {
              priority = "High";
              importance = "Priority";
            } else if (t.priority === "HIGH") {
              priority = "Medium";
              importance = "Important";
            }

            return {
              id: t.id.startsWith("telegram-task-") || t.id.startsWith("tg-") ? t.id : `telegram-task-${t.id}`,
              task: t.title,
              source: "telegram" as const,
              done: false,
              priority,
              importance,
              details: t.summary,
            };
          });
          return [...mapped, ...filtered];
        });
      }
    } catch (err) {
      console.error("Failed to sync Telegram updates:", err);
    } finally {
      setLoadingTasks(false);
      setIsSyncingTelegram(false);
    }
  };

  // Fetch calendar collisions
  const fetchCalendar = async () => {
    setLoadingCalendar(true);
    try {
      const res = await fetch("/api/calendar");
      if (!res.ok) throw new Error("Failed to fetch calendar collisions");
      const data = await res.json();
      setCollisionData(data);
    } catch (err) {
      console.error("Failed to load calendar collisions:", err);
    } finally {
      setLoadingCalendar(false);
    }
  };

  // Fetch Gmail briefs
  const fetchGmail = async () => {
    setLoadingEmails(true);
    try {
      const res = await fetch("/api/gmail");
      if (!res.ok) throw new Error("Failed to fetch Gmail briefs");
      const data = await res.json();
      if (data.authenticated === false) {
        setGmailAuthenticated(false);
        if (data.authUrl) setGmailAuthUrl(data.authUrl);
      } else {
        setGmailAuthenticated(true);
        if (data.emails) {
          setEmails(data.emails);

          // Map and add email briefs into Action Items checklist tasks
          const emailTasks = data.emails.map((email: any) => {
            let priority: "High" | "Medium" | "Low" = "Low";
            let importance: "Priority" | "Important" | "Normal" = "Normal";

            if (email.priority === "URGENT") {
              priority = "High";
              importance = "Priority";
            } else if (email.priority === "HIGH") {
              priority = "Medium";
              importance = "Important";
            }

            return {
              id: `email-task-${email.id}`,
              task: email.title,
              source: "gmail" as const,
              done: false,
              priority,
              importance,
              details: email.summary,
              suggestedDraft: email.suggestedDraft,
              extractedEmail: email.extractedEmail,
              subject: email.subject,
            };
          });

          setTasks(prev => {
            const filteredPrev = prev.filter(t => !t.id.startsWith("email-task-"));
            return [...filteredPrev, ...emailTasks];
          });
        }
      }
    } catch (err) {
      console.error("Failed to load Gmail briefs:", err);
    } finally {
      setLoadingEmails(false);
    }
  };

  // Fetch WhatsApp chats
  const fetchWhatsapp = async () => {
    setLoadingWhatsapp(true);
    try {
      const res = await fetch("/api/whatsapp/messages");
      if (!res.ok) throw new Error("Failed to fetch WhatsApp messages");
      const data = await res.json();
      setWhatsappStatus(data.status);
      if (data.chats) {
        setWhatsappChats(data.chats);
      }
    } catch (err) {
      console.error("Failed to load WhatsApp chats:", err);
      setWhatsappStatus("error");
    } finally {
      setLoadingWhatsapp(false);
    }
  };

  // Global manual refresh
  const handleRefreshBrief = async () => {
    setIsRefreshing(true);
    await Promise.all([
      fetchTelegram(),
      fetchCalendar(),
      fetchGmail(),
      fetchWhatsapp(),
    ]);
    setIsRefreshing(false);
  };

  // Initialize and load default/live updates on mount
  useEffect(() => {
    setTasks([
      {
        id: "task-1",
        task: "Review backend PR #42 (API Gateway Migration)",
        source: "github",
        done: false,
        priority: "High",
        importance: "Priority",
        details: "PR #42 implements the WhatsApp gateway. Check if process.env validation and error handling blocks comply with security requirements.",
      },
      {
        id: "task-2",
        task: "Reply regarding WhatsApp API block",
        source: "whatsapp",
        done: false,
        priority: "High",
        importance: "Priority",
        details: "Raghav requested updates on pairings. Confirm transition to API dispatcher flow is complete.",
      },
      {
        id: "task-3",
        task: "Audit calendar scheduling collision",
        source: "outlook",
        done: false,
        priority: "Medium",
        importance: "Important",
        details: "Outlook Sync auto-rescheduled double bookings for tomorrow at 3:30 PM. Verify Zoom links were updated.",
      },
      {
        id: "task-4",
        task: "Draft Q3 launch brief email",
        source: "gmail",
        done: false,
        priority: "Low",
        importance: "Normal",
        details: "Compose summary of active integration response times for stakeholder review deck.",
      },
    ]);

    fetchTelegram();
    fetchCalendar();
    fetchGmail();
    fetchWhatsapp();
  }, []);

  // Hook-up trigger from authentication redirects
  useEffect(() => {
    if (status === "success") {
      fetchGmail();
    }
  }, [status]);

  // Bind direct sync function to window object so IntegrationsDock can invoke it directly
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).handleSyncPocket = () => fetchTelegram(true);
    }
    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).handleSyncPocket;
      }
    };
  }, []);

  // Listen to custom synced event for fallback/event-based updates
  useEffect(() => {
    const handleTelegramSyncEvent = (e: Event) => {
      const customEvent = e as CustomEvent<any[]>;
      const newTasks = customEvent.detail || [];
      if (newTasks.length === 0) return;

      setTasks(prev => {
        const filtered = prev.filter(t => !t.id.startsWith("telegram-task-") && !t.id.startsWith("tg-"));
        const mapped = newTasks.map((t: any) => {
          let priority: "High" | "Medium" | "Low" = "Low";
          let importance: "Priority" | "Important" | "Normal" = "Normal";

          if (t.priority === "URGENT") {
            priority = "High";
            importance = "Priority";
          } else if (t.priority === "HIGH") {
            priority = "Medium";
            importance = "Important";
          }

          return {
            id: t.id.startsWith("telegram-task-") || t.id.startsWith("tg-") ? t.id : `telegram-task-${t.id}`,
            task: t.title,
            source: "telegram" as const,
            done: false,
            priority,
            importance,
            details: t.summary,
          };
        });
        return [...mapped, ...filtered];
      });
    };

    window.addEventListener("telegram-tasks-synced", handleTelegramSyncEvent);
    return () => {
      window.removeEventListener("telegram-tasks-synced", handleTelegramSyncEvent);
    };
  }, []);

  // Checkbox completed click handler
  const handleCheckboxClick = (taskId: string) => {
    setAnimatingOut(prev => [...prev, taskId]);
    setTimeout(() => {
      setTasks(prev =>
        prev.map(t => (t.id === taskId ? { ...t, done: true } : t))
      );
      setAnimatingOut(prev => prev.filter(id => id !== taskId));
    }, 600);
  };

  // Dispatch suggestions draft action click
  const handleDispatch = async () => {
    if (!selectedTask || !selectedTask.suggestedDraft) return;

    setIsSendingDraft(true);
    try {
      const res = await fetch("/api/gmail/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: selectedTask.extractedEmail || "",
          subject: "Re: " + (selectedTask.subject || ""),
          body: selectedTask.suggestedDraft,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to dispatch email");
      }

      const taskId = selectedTask.id;
      setSelectedTask(null);
      handleCheckboxClick(taskId);
    } catch (err) {
      console.error("Error dispatching email:", err);
      alert(err instanceof Error ? err.message : "Error dispatching email");
    } finally {
      setIsSendingDraft(false);
    }
  };

  const activeTasks = tasks.filter(t => !t.done);

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-white/5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <HugeiconsIcon icon={SparklesIcon} size={12} className="animate-pulse" />
            Neural Command Center
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Workspace Dispatch & Collision Engine
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl font-normal leading-relaxed">
            Monitor active Telegram thought-dumps, resolve overlapping calendar conflicts, and review syntheses.
          </p>
        </div>

        {/* Global Refresh Button */}
        <button
          onClick={handleRefreshBrief}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-50 self-start md:self-center shadow-lg shadow-black/30"
        >
          <svg className={`h-4.5 w-4.5 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.228 10H16.2" />
          </svg>
          <span>{isRefreshing ? "Synchronizing Streams..." : "Refresh Live Streams"}</span>
        </button>
      </div>

      {/* 4-Column Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Column 1: Action Items (Telegram) */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 hover:border-emerald-500/10 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-[480px]">
          <div className="space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <HugeiconsIcon icon={TelegramIcon} size={16} className="text-slate-400" />
                  Telegram Actions
                </h3>
                {telegramConfigured ? (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[9px] font-bold uppercase tracking-widest text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Connected
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-rose-500/20 bg-rose-500/5 text-[9px] font-bold uppercase tracking-widest text-rose-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    Offline
                  </span>
                )}
              </div>

              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
                {activeTasks.filter(t => t.source === "telegram").length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center gap-2 text-slate-500">
                    <span className="text-xs">No active Telegram tasks.</span>
                    <span className="text-[10px] text-slate-600 leading-normal max-w-[150px]">
                      Send messages to your bot or click Sync to fetch updates.
                    </span>
                  </div>
                ) : (
                  activeTasks.filter(t => t.source === "telegram").map((t) => (
                    <div 
                      key={t.id} 
                      onClick={() => setSelectedTask(t)}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl border border-white/5 bg-slate-950/20 hover:bg-slate-950/40 hover:border-emerald-500/20 cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCheckboxClick(t.id);
                          }}
                          className="h-4.5 w-4.5 rounded border border-white/15 flex items-center justify-center shrink-0 hover:border-emerald-400 transition-colors"
                        >
                          {animatingOut.includes(t.id) && (
                            <div className="h-2.5 w-2.5 rounded bg-emerald-500 animate-ping" />
                          )}
                        </div>
                        <span className="text-xs text-slate-200 font-medium truncate">
                          {t.task}
                        </span>
                      </div>
                      <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        t.importance === "Priority" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                        t.importance === "Important" ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" :
                        "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}>
                        {t.importance}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-3">
              <p className="text-[10px] text-slate-500 leading-normal">
                {telegramConfigured 
                  ? "Real-time updates active. Pull down or click below to manually force sync."
                  : "Webhook polling inactive. Make sure TELEGRAM_BOT_TOKEN is set in your .env configuration."}
              </p>
              <button 
                onClick={() => fetchTelegram(true)}
                disabled={isSyncingTelegram}
                className="w-full py-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 active:scale-95 text-emerald-400 hover:text-emerald-300 font-semibold text-xs tracking-wide transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <span>{isSyncingTelegram ? "Syncing..." : "Sync Telegram Updates"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Column 2: Calendar Collisions */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 hover:border-emerald-500/10 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-[480px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <HugeiconsIcon icon={Calendar01Icon} size={16} className="text-emerald-400" />
                Collision Engine
              </h3>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest font-mono">48H Window</span>
            </div>

            <div className="space-y-4">
              {loadingCalendar ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-500 border-t-transparent" />
                  <span className="text-[10px] text-slate-400 font-medium">Checking calendar overlaps...</span>
                </div>
              ) : !collisionData || !collisionData.collisionDetected ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 border border-emerald-500/10 bg-emerald-500/2 rounded-xl gap-3 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <HugeiconsIcon icon={TickDouble02Icon} size={16} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">No Collisions</h4>
                  <p className="text-[10px] text-slate-400 max-w-xs leading-normal">
                    Calendar streams are clear. No overlapping corporate/personal scheduling conflicts detected.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Clashing events info */}
                  <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-4 space-y-2">
                    <span className="text-[9px] text-rose-400 font-bold uppercase tracking-wider block">
                      Conflict Identified
                    </span>
                    <h4 className="text-xs font-bold text-slate-200 leading-snug">
                      {collisionData.clashingTitles?.join(" ⚡ ")}
                    </h4>
                  </div>

                  {/* Suggested Fix Highlight Card */}
                  <div className="bg-amber-500/5 border border-amber-500/30 rounded-xl p-4 shadow-[0_0_20px_rgba(245,158,11,0.05)] relative overflow-hidden group">
                    <div className="absolute -right-8 -top-8 h-16 w-16 rounded-full bg-amber-500/5 blur-md pointer-events-none" />
                    <span className="text-[9px] text-amber-400 font-bold uppercase tracking-wider block mb-1">
                      💡 Suggested Resolution
                    </span>
                    <p className="text-xs text-amber-300 leading-relaxed font-semibold">
                      {collisionData.suggestedFix}
                    </p>
                  </div>

                  {/* Collision Reasoning block */}
                  <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4 space-y-1.5">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Conflict Reasoning</span>
                    <p className="text-xs text-slate-400 leading-relaxed font-normal">
                      {collisionData.reasoning}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Column 3: Email Briefs (Gmail) */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 hover:border-emerald-500/10 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-[480px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <HugeiconsIcon icon={Mail01Icon} size={16} className="text-emerald-400" />
                Inbox Intelligence
              </h3>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest font-mono">Gmail Feed</span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
              {loadingEmails ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-500 border-t-transparent" />
                  <span className="text-[10px] text-slate-400 font-medium">Scanning primary mailboxes...</span>
                </div>
              ) : !gmailAuthenticated ? (
                <div className="bg-slate-950/40 border border-white/10 rounded-xl p-6 text-center space-y-4 relative overflow-hidden shadow-lg shadow-black/20">
                  <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-rose-500/5 blur-xl" />
                  <div className="h-10 w-10 mx-auto rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300 text-sm">
                    🗝️
                  </div>
                  <div className="space-y-1.5 max-w-xs mx-auto">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Workspace Handshake</h4>
                    <p className="text-[10px] text-slate-400 leading-normal font-normal">
                      Authorize Google read-only scope access to sync active inbox threads and generate command summaries.
                    </p>
                  </div>
                  {gmailAuthUrl && (
                    <a
                      href={gmailAuthUrl}
                      className="inline-block px-4 py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider hover:bg-emerald-400 transition-colors shadow-lg cursor-pointer"
                    >
                      Authenticate with Google
                    </a>
                  )}
                </div>
              ) : emails.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-xs">
                  No active email briefs found.
                </div>
              ) : (
                emails.map((email) => (
                  <div 
                    key={email.id} 
                    className="relative bg-slate-950/30 hover:bg-slate-950/60 border border-white/5 hover:border-emerald-500/20 rounded-xl p-3.5 transition-all duration-300 group overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500/60" />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-full border border-rose-500/10 bg-rose-500/5 text-rose-400 text-[8px] font-bold uppercase tracking-wider">
                          Gmail Brief
                        </span>
                        <span className="text-[9px] text-slate-500">{email.time}</span>
                      </div>
                      <h4 className="font-bold text-xs text-white group-hover:text-emerald-400 transition-colors leading-tight">
                        {email.title}
                      </h4>
                      <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-3">
                        {email.summary}
                      </p>
                      {email.suggestedDraft && (
                        <div className="mt-2.5 flex justify-end">
                          <button
                            onClick={() => setSelectedTask({
                              id: `email-task-${email.id}`,
                              task: email.title,
                              source: "gmail",
                              done: false,
                              priority: "High",
                              importance: "Priority",
                              details: email.summary,
                              suggestedDraft: email.suggestedDraft,
                              extractedEmail: email.extractedEmail,
                              subject: email.subject
                            })}
                            className="px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-semibold text-[10px] transition-all cursor-pointer"
                          >
                            View Draft
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Column 4: Recent WhatsApp Chats */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 hover:border-emerald-500/10 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-[480px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <HugeiconsIcon icon={WhatsappIcon} size={16} className="text-emerald-400" />
                WhatsApp Chats
              </h3>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest font-mono">Live Session</span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
              {loadingWhatsapp ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-500 border-t-transparent" />
                  <span className="text-[10px] text-slate-400 font-medium">Connecting to instance...</span>
                </div>
              ) : whatsappStatus === "authenticating" ? (
                <div className="bg-slate-950/40 border border-white/10 rounded-xl p-6 text-center space-y-4 relative overflow-hidden shadow-lg shadow-black/20">
                  <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-rose-500/5 blur-xl" />
                  <div className="h-10 w-10 mx-auto rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300 text-sm">
                    📱
                  </div>
                  <div className="space-y-1.5 max-w-xs mx-auto">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Authentication Required</h4>
                    <p className="text-[10px] text-slate-400 leading-normal font-normal">
                      Scan the QR code printed in the terminal console to establish a live WhatsApp web integration.
                    </p>
                  </div>
                </div>
              ) : whatsappStatus === "error" || whatsappChats.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-xs">
                  No active chats found.
                </div>
              ) : (
                whatsappChats.map((chat) => {
                  const hasUnread = chat.unreadCount > 0;
                  return (
                    <div 
                      key={chat.id} 
                      className="relative bg-slate-950/30 hover:bg-slate-950/60 border border-white/5 hover:border-emerald-500/20 rounded-xl p-3.5 transition-all duration-300 group overflow-hidden"
                    >
                      {hasUnread && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                      )}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-xs text-white group-hover:text-emerald-400 transition-colors truncate">
                            {chat.name}
                          </h4>
                          {hasUnread && (
                            <span className="bg-emerald-500 text-slate-950 text-[8px] font-bold h-4 w-4 rounded-full flex items-center justify-center shrink-0">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-[10px] leading-relaxed line-clamp-2">
                          {chat.lastMessageBody || "(No message body)"}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Integrations Dock Bento Panel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            ⚙️ Integrations Core
          </h3>
          <span className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold font-mono">Bento Console</span>
        </div>
        <IntegrationsDock />
      </div>

      {/* VIEW ACTION ITEM / DRAFT DETAIL DIALOG */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
          <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative flex flex-col gap-6">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start">
              <div>
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded block w-fit mb-2 ${
                  selectedTask.importance === "Priority" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse" :
                  selectedTask.importance === "Important" ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" :
                  "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }`}>
                  {selectedTask.importance} Action
                </span>
                <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                  {selectedTask.task}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedTask(null)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4 space-y-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Agent Notes:</span>
                <p className="text-xs text-slate-300 leading-relaxed font-normal whitespace-pre-wrap font-sans">
                  {selectedTask.details}
                </p>
              </div>

              {selectedTask.suggestedDraft && (
                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 space-y-2">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block">Suggested Draft Reply:</span>
                  <pre className="text-xs text-slate-200 leading-relaxed font-normal whitespace-pre-wrap font-sans select-all cursor-pointer" title="Click to copy/select all">
                    {selectedTask.suggestedDraft}
                  </pre>
                </div>
              )}

              <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3.5 text-xs text-emerald-400">
                <HugeiconsIcon icon={AlertCircleIcon} size={16} className="shrink-0" />
                <span>Verify item manually or execute dispatcher action blocks.</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-white/5 flex gap-3">
              {selectedTask.suggestedDraft ? (
                <>
                  <button
                    onClick={handleDispatch}
                    disabled={isSendingDraft}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-lg shadow-emerald-500/25"
                  >
                    {isSendingDraft ? (
                      <>
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                        <span>Transmitting payload...</span>
                      </>
                    ) : (
                      <span>🚀 Dispatch Draft via Gmail</span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      handleCheckboxClick(selectedTask.id);
                      setSelectedTask(null);
                    }}
                    disabled={isSendingDraft}
                    className="py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    Dismiss Task
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      handleCheckboxClick(selectedTask.id);
                      setSelectedTask(null);
                    }}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs tracking-wide transition-all cursor-pointer"
                  >
                    Mark as Completed
                  </button>
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20 bg-slate-950/40 border border-white/5 rounded-2xl gap-3 min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent" />
        <span className="text-xs text-slate-400 font-medium">Initializing Neural Command Feeds...</span>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
