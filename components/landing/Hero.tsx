"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  SparklesIcon, 
  ArrowRight01Icon, 
  PlayIcon,
  FolderOpenIcon,
  UserGroupIcon,
  Calendar01Icon,
  Mail01Icon,
  TelegramIcon,
  WhatsappIcon
} from "@hugeicons/core-free-icons";

export default function Hero() {
  const [logIndex, setLogIndex] = useState(0);
  const logs = [
    { time: "10:14:02", app: "System", type: "info", message: "Omnisync.ai agent core initialized successfully." },
    { time: "10:14:15", app: "Outlook", type: "resolve", message: "Calendar overlap detected (11:00 AM) — reschedule request dispatched." },
    { time: "10:14:32", app: "WhatsApp", type: "draft", message: "Inbound customer query analysed — generated quick response." },
    { time: "10:15:01", app: "Gmail", type: "sync", message: "Smart draft saved: Subject 'Re: Design Proposal Review'." },
    { time: "10:15:18", app: "Telegram", type: "alert", message: "Digest built: summarized 3 production issues on #alerts." },
    { time: "10:16:04", app: "System", type: "info", message: "All app connections active and operating within standard latency." }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % logs.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-36 pb-20 px-6 md:px-12 w-full bg-slate-950 text-slate-100 overflow-hidden flex flex-col items-center">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06),transparent_50%)] pointer-events-none" />
      <div className="absolute top-20 left-1/3 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-40 right-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
        
        {/* Release Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/60 backdrop-blur-md text-[13px] text-slate-300 font-medium">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-emerald-400">Omnisync 2.0:</span> Agentic Multi-App Integration Network
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          The Autonomous Agent <br className="hidden md:inline" />
          Hub for Your Workspace
        </h1>

        {/* Hero Subtitle */}
        <p className="max-w-2xl mx-auto text-base md:text-xl text-slate-400 font-normal leading-relaxed">
          Omnisync.ai orchestrates autonomous AI agents directly inside Gmail, WhatsApp, Telegram, and Outlook. Delegate your communication overhead and schedule workflows effortlessly.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/dashboard" className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-95 text-white font-semibold text-sm transition-all shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer">
            Connect Integrations
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </Link>
          <button className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 active:scale-95 text-slate-300 hover:text-slate-100 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
            <HugeiconsIcon icon={PlayIcon} size={14} className="text-emerald-400" />
            Watch Product Demo
          </button>
        </div>

        {/* Interactive Dashboard Preview Mockup */}
        <div className="mt-16 w-full max-w-4xl border border-slate-800 bg-slate-900/30 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl p-1 relative">
          <div className="border border-slate-800/80 bg-slate-950/90 rounded-[14px] overflow-hidden">
            
            {/* Header bar */}
            <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="ml-2 font-mono text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded">omnisync-core-v2.local</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Agent Hub Active</span>
                <span>CPU: 4.2%</span>
              </div>
            </div>

            {/* Main dashboard content area */}
            <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              
              {/* Integration Status (col 1) */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Connected Hubs</h4>
                <div className="space-y-2">
                  {/* Gmail */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-900/30">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-red-500/10 text-red-500">
                        <HugeiconsIcon icon={Mail01Icon} size={14} />
                      </div>
                      <span className="text-xs text-slate-300 font-medium">Gmail Smart Drafts</span>
                    </div>
                    <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">CONNECTED</span>
                  </div>
                  {/* WhatsApp */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-900/30">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-500">
                        <HugeiconsIcon icon={WhatsappIcon} size={14} />
                      </div>
                      <span className="text-xs text-slate-300 font-medium">WhatsApp Replies</span>
                    </div>
                    <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">CONNECTED</span>
                  </div>
                  {/* Telegram */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-900/30">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-sky-500/10 text-sky-500">
                        <HugeiconsIcon icon={TelegramIcon} size={14} />
                      </div>
                      <span className="text-xs text-slate-300 font-medium">Telegram Alerts</span>
                    </div>
                    <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">STREAMING</span>
                  </div>
                  {/* Outlook */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-900/30">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-blue-500/10 text-blue-500">
                        <HugeiconsIcon icon={Calendar01Icon} size={14} />
                      </div>
                      <span className="text-xs text-slate-300 font-medium">Outlook Scheduler</span>
                    </div>
                    <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">CONNECTED</span>
                  </div>
                </div>
              </div>

              {/* Central flow illustration (col 2) */}
              <div className="border border-slate-800 bg-slate-900/20 rounded-xl p-4 flex flex-col items-center justify-center relative min-h-[180px]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_60%)]" />
                
                {/* Omnisync Core Hub node */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border border-emerald-500 bg-emerald-950/80 text-emerald-400 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)] animate-pulse">
                    <HugeiconsIcon icon={SparklesIcon} size={22} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Omnisync Core</span>
                  <span className="text-[9px] font-mono text-emerald-400">Hub Active</span>
                </div>

                {/* Integration lines radiating (rendered as SVGs) */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <line x1="30" y1="30" x2="100" y2="100" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3" />
                    <line x1="170" y1="30" x2="100" y2="100" stroke="#10b981" strokeWidth="1" strokeDasharray="3" />
                    <line x1="30" y1="170" x2="100" y2="100" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="3" />
                    <line x1="170" y1="170" x2="100" y2="100" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3" />
                  </svg>
                </div>
              </div>

              {/* Live execution logs (col 3) */}
              <div className="flex flex-col justify-between">
                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Live Agent Stream</h4>
                  <div className="font-mono text-[10px] space-y-2 border border-slate-900 bg-slate-950 rounded-xl p-3 min-h-[140px] max-h-[140px] overflow-hidden relative">
                    <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
                    
                    {logs.map((log, index) => {
                      const isActive = index === logIndex;
                      const opacityClass = isActive ? "opacity-100 translate-y-0 text-emerald-400" : "opacity-40 -translate-y-1 text-slate-400";
                      
                      return (
                        <div 
                          key={index} 
                          className={`transition-all duration-500 ease-in-out flex gap-1.5 ${opacityClass} ${isActive ? "font-semibold" : ""}`}
                          style={{ display: Math.abs(index - logIndex) <= 2 || (index === 0 && logIndex === logs.length - 1) ? "flex" : "none" }}
                        >
                          <span className="text-slate-600">[{log.time}]</span>
                          <span className={log.app === "Outlook" ? "text-blue-400" : log.app === "WhatsApp" ? "text-emerald-400" : log.app === "Gmail" ? "text-red-400" : log.app === "Telegram" ? "text-sky-400" : "text-slate-500"}>
                            {log.app}:
                          </span>
                          <span className="truncate">{log.message}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
