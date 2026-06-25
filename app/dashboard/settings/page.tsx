"use client";

import React from "react";
import { Settings, Sparkles } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
        <Sparkles size={12} className="animate-pulse" />
        Platform Core
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
        Global Settings
      </h1>
      <p className="text-slate-400 text-sm max-w-xl font-normal leading-relaxed">
        Manage API credentials, persistence storage values, and integration configurations.
      </p>
      
      <div className="flex flex-col items-center justify-center py-20 border border-slate-800 bg-slate-900/20 rounded-2xl text-center px-4 max-w-2xl">
        <Settings className="text-emerald-400 mb-4" size={32} />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">System Configuration Lock</h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Platform parameters are locked under Insforge developer mode. Edit values inside your local .env file.
        </p>
      </div>
    </div>
  );
}
