"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  TickDouble02Icon, 
  Cancel01Icon, 
  AlertCircleIcon,
  SparklesIcon
} from "@hugeicons/core-free-icons";
import { useBrief, generateDailyInsights, ActionTask } from "@/hooks/useBrief";

interface Briefing {
  id: string;
  source: "gmail" | "outlook" | "whatsapp";
  title: string;
  summary: string;
  time: string;
  badge: string;
  badgeColor: string;
}

export default function DailyBrief() {
  const { tasks, setTasks, toggleTask } = useBrief();
  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [loadingBriefings, setLoadingBriefings] = useState(true);
  const [animatingOut, setAnimatingOut] = useState<string[]>([]);
  const [selectedAction, setSelectedAction] = useState<ActionTask | null>(null);
  
  // Google OAuth flow helper states
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [collisionData, setCollisionData] = useState<{
    collisionDetected: boolean;
    clashingTitles?: [string, string];
    lowerPriorityTitle?: string;
    suggestedFix?: string;
    reasoning?: string;
  } | null>(null);

  // Read status query parameter to trigger fetch instantly on redirect success
  const searchParams = useSearchParams();
  const status = searchParams ? searchParams.get("status") : null;

  // Fetch emails from /api/gmail on mount and map them dynamically
  useEffect(() => {
    const loadGmailData = async () => {
      setLoadingBriefings(true);
      try {
        const res = await fetch("/api/gmail");
        const data = await res.json() as { 
          emails?: Array<{
            id: string;
            title: string;
            priority: "URGENT" | "HIGH" | "NORMAL";
            platform: "GMAIL";
            time: string;
            summary: string;
            suggestedDraft: string;
            extractedEmail: string;
            subject: string;
          }>;
          authenticated?: boolean;
          authUrl?: string;
          error?: string;
        };

        if (data.authenticated === false) {
          setIsAuthenticated(false);
          if (data.authUrl) {
            setAuthUrl(data.authUrl);
          }
          setLoadingBriefings(false);
          return;
        }

        setIsAuthenticated(true);

        if (data.emails && data.emails.length > 0) {
          // 1. Map to briefings feed using AI-generated values
          const mappedBriefings = data.emails.map((email) => ({
            id: `gmail-brief-${email.id}`,
            source: "gmail" as const,
            title: email.title,
            summary: email.summary,
            time: email.time,
            badge: "Gmail Integration",
            badgeColor: "text-red-400 border-red-500/10 bg-red-500/5",
          }));
          setBriefings(mappedBriefings);

          // 2. Map to dynamic Action Items tasks
          const emailTasks: ActionTask[] = data.emails.map((email) => {
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

          // Avoid duplicating email tasks by filtering existing ones first
          setTasks(prev => {
            const filteredPrev = prev.filter(t => !t.id.startsWith("email-task-"));
            return [...filteredPrev, ...emailTasks];
          });
        }
      } catch (err) {
        console.error("Failed to load Gmail data:", err);
      } finally {
        setLoadingBriefings(false);
      }
    };

    loadGmailData();
  }, [setTasks, status]);

  // Audit Google Calendar overlaps on mount
  useEffect(() => {
    const checkCalendarCollisions = async () => {
      try {
        const res = await fetch("/api/calendar");
        const data = await res.json() as any;
        if (data && data.collisionDetected) {
          setCollisionData(data);
        }
      } catch (err) {
        console.error("Failed to fetch calendar collisions:", err);
      }
    };
    checkCalendarCollisions();
  }, []);

  const handleSyncPocket = async () => {
    try {
      const res = await fetch("/api/telegram/sync");
      if (!res.ok) {
        throw new Error(`Telegram API responded with status ${res.status}`);
      }
      const data = await res.json() as { tasks?: Array<{ id: string; title: string; priority: string; summary: string }> };
      if (data.tasks && data.tasks.length > 0) {
        setTasks(prev => {
          const filtered = prev.filter(t => !t.id.startsWith("telegram-task-") && !t.id.startsWith("tg-"));
          const mapped = data.tasks!.map((t) => {
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
      console.error("Failed to sync Telegram tasks inside DailyBrief:", err);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).handleSyncPocket = handleSyncPocket;
    }
    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).handleSyncPocket;
      }
    };
  }, [setTasks]);

  // Listen for synced Telegram updates and push them into the checklist
  useEffect(() => {
    const handleTelegramSync = (e: Event) => {
      const customEvent = e as CustomEvent<Array<{ id: string; title: string; priority: string; summary: string }>>;
      const newTasks = customEvent.detail || [];
      if (newTasks.length === 0) return;

      setTasks(prev => {
        // Avoid duplicate syncs by filtering existing telegram tasks
        const filtered = prev.filter(t => !t.id.startsWith("telegram-task-") && !t.id.startsWith("tg-"));
        
        const mapped = newTasks.map((t) => {
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

    window.addEventListener("telegram-tasks-synced", handleTelegramSync);
    return () => window.removeEventListener("telegram-tasks-synced", handleTelegramSync);
  }, [setTasks]);

  const handleCheckboxClick = (taskId: string) => {
    // Stage the item for animation
    setAnimatingOut(prev => [...prev, taskId]);

    // Perform the state change and remove from animation list after visual transition completes
    setTimeout(() => {
      toggleTask(taskId);
      setAnimatingOut(prev => prev.filter(id => id !== taskId));
    }, 600);
  };

  const handleDispatch = async () => {
    if (!selectedAction || !selectedAction.suggestedDraft) return;

    setIsSending(true);
    try {
      const res = await fetch("/api/gmail/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: selectedAction.extractedEmail || "",
          subject: "Re: " + (selectedAction.subject || ""),
          body: selectedAction.suggestedDraft,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to dispatch email");
      }

      // Close the modal
      const taskId = selectedAction.id;
      setSelectedAction(null);

      // Play the subtle checkmark animation and slide task out of queue
      handleCheckboxClick(taskId);
    } catch (err) {
      console.error("Error dispatching email:", err);
      alert(err instanceof Error ? err.message : "Error dispatching email");
    } finally {
      setIsSending(false);
    }
  };

  const insights = generateDailyInsights(tasks);

  // Filter out completed tasks so they disappear from active view after animating
  const activeTasks = tasks.filter(t => !t.done);

  return (
    <div className="space-y-8">
      {/* AI Proactive Analysis Section */}
      <div className="relative bg-[#0a0a0c] backdrop-blur-md border border-emerald-500/20 rounded-2xl p-6 overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.03)] ring-1 ring-emerald-500/5">
        {/* Glow effect */}
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-emerald-500/5 blur-[40px] pointer-events-none" />

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <HugeiconsIcon icon={SparklesIcon} size={14} className="animate-pulse" />
            </div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest">AI Proactive Insights</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {insights.map((insight, idx) => {
              if (idx === 2 && collisionData && collisionData.collisionDetected) {
                return (
                  <div 
                    key="calendar-collision-insight"
                    className="bg-amber-500/5 border border-amber-500/30 rounded-xl p-4 transition-all duration-300 hover:border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)] animate-pulse flex flex-col gap-1 relative overflow-hidden group"
                  >
                    <div className="absolute -right-8 -top-8 h-16 w-16 rounded-full bg-amber-500/5 blur-md pointer-events-none group-hover:bg-amber-500/10 transition-all duration-300" />
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                      ⚠️ Calendar Collision
                    </span>
                    <p className="text-[11px] text-slate-200 leading-relaxed font-semibold">
                      Clash: {collisionData.clashingTitles?.join(" vs ")}
                    </p>
                    <p className="text-[10px] text-amber-300 leading-relaxed font-normal mt-0.5">
                      Fix: {collisionData.suggestedFix}
                    </p>
                  </div>
                );
              }
              return (
                <div 
                  key={insight.id}
                  className="bg-white/2 border border-white/5 rounded-xl p-4 transition-all duration-300 hover:border-emerald-500/20"
                >
                  <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                    💡 {insight.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: Today's Summary */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Today's Summary</h3>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold font-mono">Scrollable Feed</span>
          </div>

          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {loadingBriefings ? (
              <div className="flex flex-col items-center justify-center py-10 bg-[#0a0a0c] border border-white/5 rounded-xl gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-500 border-t-transparent" />
                <span className="text-[10px] text-slate-400 font-medium">Fetching primary inbox threads...</span>
              </div>
            ) : !isAuthenticated ? (
              /* Google Authentication Request CTA Card */
              <div className="bg-[#0a0a0c] border border-white/10 rounded-xl p-6 text-center space-y-4 relative overflow-hidden shadow-lg shadow-black/20">
                <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-rose-500/5 blur-xl" />
                <div className="h-10 w-10 mx-auto rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300 text-sm">
                  🗝️
                </div>
                <div className="space-y-1.5 max-w-xs mx-auto">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Workspace Handshake Required</h4>
                  <p className="text-[10px] text-slate-400 leading-normal font-normal">
                    Authorize Google read-only scope access to sync active inbox threads and generate command summaries.
                  </p>
                </div>
                {authUrl && (
                  <a
                    href={authUrl}
                    className="inline-block px-4 py-2.5 rounded-lg bg-white text-slate-950 font-bold text-[10px] uppercase tracking-wider hover:bg-slate-200 transition-colors shadow-lg cursor-pointer"
                  >
                    Authenticate with Google
                  </a>
                )}
              </div>
            ) : briefings.length === 0 ? (
              <div className="bg-[#0a0a0c] border border-white/5 rounded-xl p-8 text-center text-slate-500 text-xs">
                No active emails or briefings found.
              </div>
            ) : (
              briefings.map((brief) => (
                <div 
                  key={brief.id} 
                  className="relative bg-[#0a0a0c] backdrop-blur-md border border-white/5 hover:border-white/10 rounded-xl p-5 transition-all duration-300 group overflow-hidden"
                >
                  {/* Accent glow bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    brief.source === "gmail" ? "bg-red-500" :
                    brief.source === "outlook" ? "bg-blue-500" : "bg-emerald-500"
                  }`} />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full border text-[8px] font-bold uppercase tracking-wider ${brief.badgeColor}`}>
                        {brief.badge}
                      </span>
                      <span className="text-[9px] text-slate-500">{brief.time}</span>
                    </div>
                    <h4 className="font-bold text-xs text-white group-hover:text-emerald-400 transition-colors leading-tight">
                      {brief.title}
                    </h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {brief.summary}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Interactive Action Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Action Items</h3>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold font-mono">Interactive List</span>
          </div>

          <div className="space-y-3">
            {activeTasks.length === 0 ? (
              <div className="bg-[#0a0a0c] border border-white/5 rounded-xl p-8 text-center text-slate-500 text-xs">
                ✨ All items completed!
              </div>
            ) : (
              activeTasks.map((action) => {
                const isAnimating = animatingOut.includes(action.id);
                
                // Style borders depending on Priority vs Important tags
                const isPriority = action.importance === "Priority";
                const isImportant = action.importance === "Important";
                const cardStyle = isAnimating
                  ? "opacity-0 scale-90 translate-x-4 max-h-0 py-0 my-0 border-none overflow-hidden duration-500 pointer-events-none"
                  : `bg-[#0a0a0c] transition-all duration-300 ${
                      isPriority 
                        ? "border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.08)] bg-rose-500/1" 
                        : isImportant 
                        ? "border-sky-500/30 shadow-[0_0_15px_rgba(56,189,248,0.08)] bg-sky-500/1" 
                        : "border-white/5 hover:border-white/10"
                    }`;

                return (
                  <div 
                    key={action.id}
                    className={`flex items-center justify-between gap-4 p-4 rounded-xl border ${cardStyle}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Checkbox Action Button */}
                      <button 
                        onClick={() => handleCheckboxClick(action.id)}
                        disabled={isAnimating}
                        className={`h-5 w-5 rounded border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                          isAnimating
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                            : "border-white/20 hover:border-emerald-500/50"
                        }`}
                      >
                        {isAnimating && <HugeiconsIcon icon={TickDouble02Icon} size={10} />}
                      </button>

                      <span className={`text-xs text-white leading-normal font-medium truncate ${
                        isAnimating ? "line-through text-slate-500" : ""
                      }`}>
                        {action.task}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isPriority ? "bg-rose-500/15 text-rose-400 border border-rose-500/10 animate-pulse" :
                        isImportant ? "bg-sky-500/15 text-sky-400 border border-sky-500/10" :
                        "bg-slate-500/15 text-slate-400 border border-slate-500/10"
                      }`}>
                        {action.importance}
                      </span>
                      
                      <button 
                        onClick={() => setSelectedAction(action)}
                        disabled={isAnimating}
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-[10px] transition-all cursor-pointer disabled:opacity-50"
                      >
                        View
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* VIEW ACTION ITEM DIALOG */}
      {selectedAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
          <div className="w-full max-w-md bg-[#0a0a0c] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative flex flex-col gap-6">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start">
              <div>
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded block w-fit mb-2 ${
                  selectedAction.importance === "Priority" ? "bg-rose-500/15 text-rose-400 border border-rose-500/10 animate-pulse" :
                  selectedAction.importance === "Important" ? "bg-sky-500/15 text-sky-400 border border-sky-500/10" :
                  "bg-slate-500/15 text-slate-400 border border-slate-500/10"
                }`}>
                  {selectedAction.importance} Action
                </span>
                <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                  {selectedAction.task}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedAction(null)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Agent Notes:</span>
                <pre className="text-xs text-slate-300 leading-relaxed font-normal whitespace-pre-wrap font-sans">
                  {selectedAction.details}
                </pre>
              </div>

              {selectedAction.suggestedDraft && (
                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 space-y-2">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block">Suggested Draft Reply:</span>
                  <pre className="text-xs text-slate-200 leading-relaxed font-normal whitespace-pre-wrap font-sans select-all cursor-pointer" title="Click to copy/select all">
                    {selectedAction.suggestedDraft}
                  </pre>
                </div>
              )}

              <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3.5 text-xs text-emerald-400">
                <HugeiconsIcon icon={AlertCircleIcon} size={16} className="shrink-0" />
                <span>Verify this item manually or click checkbox on lists to complete.</span>
              </div>
            </div>

             {/* Modal Footer */}
             <div className="pt-4 border-t border-white/5 flex gap-3">
               {selectedAction.suggestedDraft ? (
                 <>
                   <button
                     onClick={handleDispatch}
                     disabled={isSending}
                     className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                   >
                     {isSending ? (
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
                       handleCheckboxClick(selectedAction.id);
                       setSelectedAction(null);
                     }}
                     disabled={isSending}
                     className="py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs transition-all cursor-pointer disabled:opacity-50"
                   >
                     Dismiss Task
                   </button>
                 </>
               ) : (
                 <>
                   <button
                     onClick={() => {
                       handleCheckboxClick(selectedAction.id);
                       setSelectedAction(null);
                     }}
                     className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs tracking-wide transition-all cursor-pointer"
                   >
                     Mark as Completed
                   </button>
                   <button
                     onClick={() => setSelectedAction(null)}
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
