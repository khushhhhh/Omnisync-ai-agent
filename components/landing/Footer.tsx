"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon, SentIcon } from "@hugeicons/core-free-icons";

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400 text-sm py-16 px-6 md:px-12 w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        
        {/* Brand Info (col 4) */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <HugeiconsIcon icon={SparklesIcon} size={16} />
            </div>
            <span className="font-bold text-base tracking-tight text-white">
              Omnisync<span className="text-emerald-400">.ai</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Integrating advanced autonomous agent networks directly into the communication apps you rely on daily. Built securely for modern collaborative teams.
          </p>
          <div className="text-xs text-slate-600">
            © {new Date().getFullYear()} Omnisync.ai Inc. All rights reserved.
          </div>
        </div>

        {/* Links Grid (col 5) */}
        <div className="md:col-span-5 grid grid-cols-3 gap-4">
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">Product</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-slate-200 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-slate-200 transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-slate-200 transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">Integrations</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-slate-200 transition-colors">Gmail</a></li>
              <li><a href="#" className="hover:text-slate-200 transition-colors">WhatsApp</a></li>
              <li><a href="#" className="hover:text-slate-200 transition-colors">Telegram</a></li>
              <li><a href="#" className="hover:text-slate-200 transition-colors">Outlook</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">Company</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-slate-200 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-slate-200 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-slate-200 transition-colors">Careers</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter (col 3) */}
        <div className="md:col-span-3 space-y-4">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">Stay Updated</h5>
          <p className="text-xs text-slate-500">
            Subscribe to our newsletter for the latest agentic updates and workflow guides.
          </p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email address"
              className="flex-1 bg-slate-900 border border-slate-800 focus:border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none placeholder-slate-600 transition-colors"
            />
            <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-100 transition-all cursor-pointer">
              <HugeiconsIcon icon={SentIcon} size={14} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
