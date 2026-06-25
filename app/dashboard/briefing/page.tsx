"use client";

import React from "react";
import { BookOpen, Sparkles } from "lucide-react";

export default function BriefingPage() {
  return (
    <div className="space-y-6">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
        <Sparkles size={12} className="animate-pulse" />
        Neural Briefing Hub
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
        Briefing Archives
      </h1>
      <p className="text-slate-400 text-sm max-w-xl font-normal leading-relaxed">
        Access your historical briefs, aggregated workspace insights, and compiled reports.
      </p>
      
      <div className="flex flex-col items-center justify-center py-20 border border-slate-800 bg-slate-900/20 rounded-2xl text-center px-4 max-w-2xl">
        <BookOpen className="text-emerald-400 mb-4" size={32} />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">No Archived Briefs</h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Once your daily inbox and chat integrations compile updates over time, they will be archived here.
        </p>
      </div>
    </div>
  );
}
