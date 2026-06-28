"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { TickDouble02Icon, SparklesIcon } from "@hugeicons/core-free-icons";

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 relative w-full px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-teal-500/20 bg-teal-500/5 text-teal-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <HugeiconsIcon icon={SparklesIcon} size={12} className="animate-pulse" />
            Pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Simple, transparent scaling.
          </h2>
          <p className="text-slate-400 max-w-2xl text-base md:text-lg">
            Start for free. Upgrade when your AI delegate takes over more of your workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col hover:border-white/20 transition-all">
            <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
            <p className="text-slate-400 text-sm mb-6">For individuals dipping their toes into agentic workflows.</p>
            <div className="mb-8">
              <span className="text-4xl font-extrabold text-white">$0</span>
              <span className="text-slate-500 text-sm">/mo</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {['1 Integration (Gmail)', '100 Summaries/mo', 'Basic Calendar Checks'].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                  <HugeiconsIcon icon={TickDouble02Icon} size={16} className="text-emerald-500" />
                  {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all">
              Start Free
            </button>
          </div>

          {/* Pro */}
          <div className="bg-slate-900 border border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.1)] rounded-3xl p-8 flex flex-col relative scale-105 z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
              Most Popular
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Executive Pro</h3>
            <p className="text-emerald-400/80 text-sm mb-6">Full autonomous delegation across all channels.</p>
            <div className="mb-8">
              <span className="text-4xl font-extrabold text-white">$29</span>
              <span className="text-slate-500 text-sm">/mo</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {['All Integrations', 'Unlimited Summaries', 'Auto-draft Replies', 'Priority Agent Chat API'].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-200">
                  <HugeiconsIcon icon={TickDouble02Icon} size={16} className="text-emerald-400" />
                  {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/20 transition-all">
              Upgrade to Pro
            </button>
          </div>

          {/* Enterprise */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col hover:border-white/20 transition-all">
            <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
            <p className="text-slate-400 text-sm mb-6">For entire teams that need unified workspace memory.</p>
            <div className="mb-8">
              <span className="text-4xl font-extrabold text-white">Custom</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {['Custom Webhook Routes', 'Dedicated BaaS Storage', 'SAML SSO', 'White-glove Setup'].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                  <HugeiconsIcon icon={TickDouble02Icon} size={16} className="text-emerald-500" />
                  {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
