"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Satellite01Icon, 
  Brain02Icon, 
  Rocket01Icon,
  ArrowRight01Icon,
  SparklesIcon
} from "@hugeicons/core-free-icons";

export default function Workflow() {
  const steps = [
    {
      number: "01",
      title: "Listen & Ingest",
      description: "The agent securely hooks into your Gmail, Outlook, Telegram, and WhatsApp via OAuth and Webhooks, listening for high-priority signals in real-time.",
      icon: Satellite01Icon,
      color: "from-blue-500/20 to-sky-500/5",
      iconColor: "text-blue-400 border-blue-500/30 bg-blue-500/10"
    },
    {
      number: "02",
      title: "Think & Synthesize",
      description: "Powered by Gemini 2.0, the Neural Core processes the noise. It extracts tasks, detects calendar collisions, and prepares context-aware drafts.",
      icon: Brain02Icon,
      color: "from-purple-500/20 to-fuchsia-500/5",
      iconColor: "text-purple-400 border-purple-500/30 bg-purple-500/10"
    },
    {
      number: "03",
      title: "Act & Dispatch",
      description: "Review your Daily Brief. Approve drafted emails, resolve conflicts with one click, or let the agent handle routine tasks autonomously.",
      icon: Rocket01Icon,
      color: "from-emerald-500/20 to-teal-500/5",
      iconColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
    }
  ];

  return (
    <section id="workflow" className="py-24 relative w-full px-6 border-y border-white/5 bg-[#08080a]">
      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="flex flex-col items-center text-center space-y-4 mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-sky-500/20 bg-sky-500/5 text-sky-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <HugeiconsIcon icon={SparklesIcon} size={12} className="animate-pulse" />
            How it works
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Listen. Think. Act.
          </h2>
          <p className="text-slate-400 max-w-2xl text-base md:text-lg">
            Omnisync.ai operates just like a human Chief of Staff, sitting between the noise of your inbox and your actual execution layer.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
            {steps.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center group">
                <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${step.color} border border-white/10 flex items-center justify-center mb-6 shadow-2xl relative overflow-hidden transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-${step.iconColor.split('text-')[1].split('-')[0]}-500/20`}>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl border backdrop-blur-md ${step.iconColor}`}>
                    <HugeiconsIcon icon={step.icon} size={24} />
                  </div>
                </div>
                
                <div className="absolute top-0 right-0 -mt-4 -mr-4 text-7xl font-black text-white/5 select-none pointer-events-none">
                  {step.number}
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-[280px]">
                  {step.description}
                </p>

                {i < steps.length - 1 && (
                  <div className="md:hidden mt-8 text-slate-700">
                    <HugeiconsIcon icon={ArrowRight01Icon} size={24} className="rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
