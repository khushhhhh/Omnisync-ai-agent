"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  Calendar01Icon,
  TelegramIcon,
  WhatsappIcon,
  SparklesIcon,
  Brain02Icon,
  ZapIcon
} from "@hugeicons/core-free-icons";

export default function Features() {
  const features = [
    {
      title: "Contextual Inbox Summaries",
      description: "Omnisync.ai reads 50-message threads and outputs a single 3-bullet brief. Stop reading entire chains and just get the action items.",
      icon: Mail01Icon,
      color: "text-red-400 border-red-500/20 bg-red-500/10",
      glow: "group-hover:bg-red-500/20"
    },
    {
      title: "Smart Calendar Resolution",
      description: "When an overlap is detected, the agent analyzes participant seniority and meeting urgency to suggest the optimal reschedule.",
      icon: Calendar01Icon,
      color: "text-amber-400 border-amber-500/20 bg-amber-500/10",
      glow: "group-hover:bg-amber-500/20"
    },
    {
      title: "Telegram Task Extraction",
      description: "Turn noisy support channels into clean checklists. The agent reads unstructured chat and extracts assigned to-dos automatically.",
      icon: TelegramIcon,
      color: "text-sky-400 border-sky-500/20 bg-sky-500/10",
      glow: "group-hover:bg-sky-500/20"
    },
    {
      title: "WhatsApp Dispatcher",
      description: "Draft perfect responses to client inquiries while you sleep. Review and send them with one click in the morning.",
      icon: WhatsappIcon,
      color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
      glow: "group-hover:bg-emerald-500/20"
    },
    {
      title: "Neural Engine Sync",
      description: "Powered by Gemini 2.0 Flash, the agent connects dots across platforms. If a client emails you, the agent flags it in your Telegram.",
      icon: Brain02Icon,
      color: "text-purple-400 border-purple-500/20 bg-purple-500/10",
      glow: "group-hover:bg-purple-500/20"
    },
    {
      title: "Real-Time Action Hub",
      description: "Your dashboard acts as a unified command center. All your disparate communication channels, unified into one actionable checklist.",
      icon: ZapIcon,
      color: "text-blue-400 border-blue-500/20 bg-blue-500/10",
      glow: "group-hover:bg-blue-500/20"
    }
  ];

  return (
    <section id="features" className="py-24 relative w-full px-6 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <HugeiconsIcon icon={SparklesIcon} size={12} className="animate-pulse" />
            Core Capabilities
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Everything your agent can do.
          </h2>
          <p className="text-slate-400 max-w-2xl text-base md:text-lg">
            Stop switching between tabs. Omnisync.ai brings your entire digital workspace into one intelligent, actionable flow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl transition-all duration-500 opacity-50 ${feature.glow}`} />
              
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border mb-6 ${feature.color}`}>
                <HugeiconsIcon icon={feature.icon} size={24} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                {feature.title}
              </h3>
              
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
