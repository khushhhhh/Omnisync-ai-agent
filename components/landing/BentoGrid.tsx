"use client";

import React, { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  WhatsappIcon,
  TelegramIcon,
  Mail01Icon,
  Calendar01Icon,
  TickDouble02Icon,
  SentIcon,
  BubbleChatIcon,
  ArrowRight01Icon,
  SparklesIcon,
  TaskDaily01Icon,
  AlertCircleIcon
} from "@hugeicons/core-free-icons";

export default function BentoGrid() {
  // Gmail State
  const [gmailStep, setGmailStep] = useState<"idle" | "drafting" | "drafted" | "sent">("idle");
  const [gmailDraftText, setGmailDraftText] = useState("");
  const gmailFullText = "Hi Sarah, thanks for reaching out. I've reviewed the proposal. Let's schedule our project kickoff for Thursday at 2:00 PM PST. I'll send an invite. - Alex (Omnisync Assistant)";

  useEffect(() => {
    if (gmailStep === "drafting") {
      let index = 0;
      setGmailDraftText("");
      const interval = setInterval(() => {
        if (index < gmailFullText.length) {
          setGmailDraftText((prev) => prev + gmailFullText.charAt(index));
          index++;
        } else {
          clearInterval(interval);
          setGmailStep("drafted");
        }
      }, 15);
      return () => clearInterval(interval);
    }
  }, [gmailStep]);

  // WhatsApp State
  const [whatsappSent, setWhatsappSent] = useState(false);

  // Telegram State
  const [telegramSummarized, setTelegramSummarized] = useState(false);

  // Outlook State
  const [outlookResolved, setOutlookResolved] = useState(false);

  return (
    <section className="relative py-24 px-6 md:px-12 w-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(16,185,129,0.03),transparent_60%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <HugeiconsIcon icon={SparklesIcon} size={13} className="animate-pulse" />
            Integrations Ecosystem
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Multi-App Integration Network
          </h2>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-400 font-normal leading-relaxed">
            Omnisync.ai seamlessly connects autonomous AI agents directly into your existing communication systems. Experience unified, contextual workflows across all channels.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* GMAIL CARD (col-span 7) */}
          <div className="group relative md:col-span-7 flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 backdrop-blur-xl transition-all duration-300 hover:border-red-500/30 hover:shadow-[0_0_30px_rgba(239,68,68,0.1)]">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-red-500/10 blur-[50px] transition-opacity duration-300 group-hover:opacity-100" />
            
            <div className="space-y-6">
              {/* Header inside Card */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 shadow-sm transition-transform duration-300 group-hover:scale-110">
                    <HugeiconsIcon icon={Mail01Icon} size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-slate-100">Gmail</h3>
                    <p className="text-xs text-red-400 font-medium">Gmail Smart Drafts</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/50 text-[10px] font-semibold text-slate-400 tracking-wide">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                  Live Sync
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                Automatically draft replies to complex customer emails. The agent reads the context of the thread, drafts appropriate replies in your drafts folder, and flags urgent topics for review.
              </p>
            </div>

            {/* Interactive Mockup */}
            <div className="mt-8 border border-slate-800 bg-slate-950/80 rounded-2xl p-4 overflow-hidden relative font-mono text-xs text-slate-300 min-h-[170px] flex flex-col justify-between shadow-inner">
              <div className="border-b border-slate-900 pb-2 mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <span>To: sarah.k@designco.com</span>
                </div>
                <div className="text-[10px] text-slate-600 bg-slate-900 px-2 py-0.5 rounded-md">
                  Subject: Re: Project Proposal
                </div>
              </div>

              <div className="flex-1 flex items-start gap-2 py-2">
                {gmailStep === "idle" && (
                  <div className="text-slate-500 italic">Incoming: "Hey, can we schedule the project kickoff this week?"</div>
                )}
                {(gmailStep === "drafting" || gmailStep === "drafted") && (
                  <div className="text-emerald-400 border-l-2 border-emerald-500/50 pl-2 leading-relaxed">
                    {gmailDraftText}
                    {gmailStep === "drafting" && <span className="inline-block w-1.5 h-4 bg-emerald-400 animate-pulse ml-0.5" />}
                  </div>
                )}
                {gmailStep === "sent" && (
                  <div className="w-full flex flex-col items-center justify-center py-6 text-center text-emerald-400 space-y-2">
                    <HugeiconsIcon icon={TickDouble02Icon} size={28} className="text-emerald-400 animate-bounce" />
                    <span className="font-semibold">Draft successfully saved to Gmail!</span>
                  </div>
                )}
              </div>

              {gmailStep !== "sent" && (
                <div className="flex items-center justify-end gap-2 border-t border-slate-900 pt-2 mt-2">
                  {gmailStep === "idle" && (
                    <button
                      onClick={() => setGmailStep("drafting")}
                      className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 active:scale-95 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-red-500/20 transition-all cursor-pointer"
                    >
                      <HugeiconsIcon icon={SparklesIcon} size={12} />
                      Generate AI Draft
                    </button>
                  )}
                  {gmailStep === "drafted" && (
                    <button
                      onClick={() => setGmailStep("sent")}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                    >
                      <HugeiconsIcon icon={SentIcon} size={12} />
                      Approve & Save Draft
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* WHATSAPP CARD (col-span 5) */}
          <div className="group relative md:col-span-5 flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-[50px] transition-opacity duration-300 group-hover:opacity-100" />

            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm transition-transform duration-300 group-hover:scale-110">
                    <HugeiconsIcon icon={WhatsappIcon} size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-slate-100">WhatsApp</h3>
                    <p className="text-xs text-emerald-400 font-medium">WhatsApp Quick Replies</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/50 text-[10px] font-semibold text-slate-400 tracking-wide">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Active
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-400 text-sm leading-relaxed">
                Empower your customer relation managers with quick, smart replies. Omnisync listens to customer requests, instantly constructs natural responses, and displays them as suggestion overlays.
              </p>
            </div>

            {/* Interactive Mockup */}
            <div className="mt-8 border border-slate-800 bg-slate-950/80 rounded-2xl p-4 overflow-hidden relative flex flex-col justify-between min-h-[170px] shadow-inner font-sans text-xs">
              {/* Chat Messages */}
              <div className="space-y-3 flex-1 flex flex-col justify-end pb-3">
                <div className="bg-slate-900 border border-slate-800 text-slate-300 p-2.5 rounded-2xl rounded-tl-none max-w-[85%] self-start">
                  <p className="text-[10px] text-slate-500 font-semibold mb-0.5">Customer • 10:14 AM</p>
                  Hello, is the API endpoint live? We are seeing 503 errors on the sandbox environment.
                </div>
                {whatsappSent ? (
                  <div className="bg-emerald-500/15 border border-emerald-500/20 text-emerald-300 p-2.5 rounded-2xl rounded-tr-none max-w-[85%] self-end">
                    <p className="text-[10px] text-emerald-400 font-semibold mb-0.5">Omnisync Assistant • Just now</p>
                    Hi! Yes, our sandbox is currently undergoing a minor upgrade. It should be fully active in 5 minutes.
                    <div className="flex justify-end mt-1">
                      <HugeiconsIcon icon={TickDouble02Icon} size={14} className="text-emerald-400" />
                    </div>
                  </div>
                ) : (
                  <div className="border border-slate-800 bg-slate-900/40 p-2 rounded-xl text-[11px] text-slate-400 flex items-start gap-2">
                    <HugeiconsIcon icon={BubbleChatIcon} size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-emerald-400">Agent Draft Ready:</span> "Hi! Yes, our sandbox is currently undergoing a minor upgrade..."
                    </div>
                  </div>
                )}
              </div>

              {!whatsappSent && (
                <div className="border-t border-slate-900 pt-2 flex justify-end">
                  <button
                    onClick={() => setWhatsappSent(true)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <HugeiconsIcon icon={SentIcon} size={12} />
                    Send Quick Reply
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* TELEGRAM CARD (col-span 5) */}
          <div className="group relative md:col-span-5 flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 backdrop-blur-xl transition-all duration-300 hover:border-sky-500/30 hover:shadow-[0_0_30px_rgba(14,165,233,0.1)]">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-sky-500/10 blur-[50px] transition-opacity duration-300 group-hover:opacity-100" />

            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 border border-sky-500/20 shadow-sm transition-transform duration-300 group-hover:scale-110">
                    <HugeiconsIcon icon={TelegramIcon} size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-slate-100">Telegram</h3>
                    <p className="text-xs text-sky-400 font-medium">Telegram Notification Streams</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/50 text-[10px] font-semibold text-slate-400 tracking-wide">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
                  Streaming
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-400 text-sm leading-relaxed">
                Consolidate complex team discussions. Monitor busy Telegram support channels, automatically detect high-priority events, and stream digests summarizing issues and decisions.
              </p>
            </div>

            {/* Interactive Mockup */}
            <div className="mt-8 border border-slate-800 bg-slate-950/80 rounded-2xl p-4 overflow-hidden relative flex flex-col justify-between min-h-[170px] shadow-inner font-sans text-xs">
              <div className="space-y-2.5 flex-1">
                {telegramSummarized ? (
                  <div className="border border-sky-500/20 bg-sky-500/10 rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-sky-400 font-semibold text-[11px]">
                      <HugeiconsIcon icon={TaskDaily01Icon} size={14} />
                      Stream Digest Summary
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      🔴 <span className="font-semibold text-red-400">Security Alert:</span> Invalid TLS cert resolved on proxy. <br />
                      🟢 <span className="font-semibold text-emerald-400">Server Ops:</span> Node-3 cluster autoscaled (+2 pods). <br />
                      💬 <span className="font-semibold text-slate-400">Dev Chat:</span> Team agreed to delay production deploy by 1 hour.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="border border-slate-800 bg-slate-900/60 p-2 rounded-xl text-[10px] text-slate-400 space-y-1">
                      <div className="flex justify-between font-semibold text-slate-500">
                        <span>#production-alerts • 10:20 AM</span>
                        <span className="text-red-400 flex items-center gap-1">
                          <HugeiconsIcon icon={AlertCircleIcon} size={10} /> Critical
                        </span>
                      </div>
                      <p className="text-slate-300 font-mono">TLS validation failed for api.omnisync.ai. Traffic redirected.</p>
                    </div>
                    <div className="border border-slate-800 bg-slate-900/60 p-2 rounded-xl text-[10px] text-slate-400 space-y-1">
                      <div className="flex justify-between font-semibold text-slate-500">
                        <span>#devops-ops • 10:21 AM</span>
                        <span className="text-slate-500">Info</span>
                      </div>
                      <p className="text-slate-300 font-mono">Kubernetes auto-scaled cluster: node-3-us-east. 2 pods added.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-900 pt-2 flex items-center justify-between mt-2">
                <span className="text-[10px] text-slate-500">2 events detected</span>
                <button
                  onClick={() => setTelegramSummarized(!telegramSummarized)}
                  className="px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 font-semibold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                >
                  {telegramSummarized ? "Show Details" : "Digest Channel Feed"}
                  <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* OUTLOOK CARD (col-span 7) */}
          <div className="group relative md:col-span-7 flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-500/10 blur-[50px] transition-opacity duration-300 group-hover:opacity-100" />

            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-sm transition-transform duration-300 group-hover:scale-110">
                    <HugeiconsIcon icon={Calendar01Icon} size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-slate-100">Outlook</h3>
                    <p className="text-xs text-blue-400 font-medium">Outlook Calendar De-conflicting</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/50 text-[10px] font-semibold text-slate-400 tracking-wide">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping" />
                  Connected
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                Keep your team schedules organized. Omnisync continuously audits your calendar invites, automatically detects double-bookings, proposes alternative slots, and coordinates auto-resolutions dynamically.
              </p>
            </div>

            {/* Interactive Mockup */}
            <div className="mt-8 border border-slate-800 bg-slate-950/80 rounded-2xl p-4 overflow-hidden relative flex flex-col justify-between min-h-[170px] shadow-inner font-sans text-xs">
              <div className="flex-1 flex gap-4">
                {/* 2-Day Timeline Mockup */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-1 mb-2 text-slate-500 text-[10px] font-semibold">
                    <span>TIMELINE: WEDNESDAY, JUNE 24</span>
                    <span className="text-blue-400 font-mono">10:00 - 12:00</span>
                  </div>

                  {outlookResolved ? (
                    <div className="space-y-2">
                      <div className="border border-emerald-500/30 bg-emerald-500/5 p-2 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-emerald-400 text-[11px]">Board Meeting Review</p>
                          <p className="text-[10px] text-slate-400">10:00 AM - 11:00 AM • Room A</p>
                        </div>
                        <span className="text-[9px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">CONFIRMED</span>
                      </div>
                      <div className="border border-blue-500/20 bg-blue-500/5 p-2 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-blue-400 text-[11px]">Marketing Align (Rescheduled)</p>
                          <p className="text-[10px] text-slate-400">11:00 AM - 12:00 PM • Google Meet</p>
                        </div>
                        <span className="text-[9px] text-blue-400 font-semibold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">AUTO-RESOLVED</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 relative">
                      <div className="border border-slate-800 bg-slate-900/60 p-2 rounded-lg relative z-10">
                        <p className="font-semibold text-slate-300 text-[11px]">Board Meeting Review</p>
                        <p className="text-[10px] text-slate-400">10:00 AM - 11:30 AM • Room A</p>
                      </div>
                      {/* Conflict overlapping box */}
                      <div className="border border-red-500/30 bg-red-500/10 p-2 rounded-lg relative -mt-5 z-20 border-dashed">
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-red-400 text-[11px]">Marketing Align (Conflict)</p>
                          <span className="text-[8px] bg-red-500/20 text-red-400 px-1 py-0.2 rounded font-bold">OVERLAP</span>
                        </div>
                        <p className="text-[10px] text-slate-300">11:00 AM - 12:00 PM • Google Meet</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-900 pt-2 flex items-center justify-between mt-2">
                <span className="text-[10px] text-slate-500">
                  {outlookResolved ? "Conflicts resolved successfully" : "1 critical conflict detected"}
                </span>
                {!outlookResolved && (
                  <button
                    onClick={() => setOutlookResolved(true)}
                    className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    <HugeiconsIcon icon={SparklesIcon} size={12} />
                    De-conflict Calendar
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
