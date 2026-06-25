"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon, Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-7xl border border-slate-800 bg-slate-950/70 backdrop-blur-xl rounded-2xl px-6 py-3.5 shadow-2xl flex items-center justify-between">
      {/* Logo */}
      <a href="#" className="flex items-center gap-2 group">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
          <HugeiconsIcon icon={SparklesIcon} size={18} />
        </div>
        <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent group-hover:text-white transition-colors">
          Omnisync<span className="text-emerald-400">.ai</span>
        </span>
      </a>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
        <a href="#features" className="hover:text-slate-100 transition-colors">Features</a>
        <a href="#integrations" className="hover:text-slate-100 transition-colors">Integrations</a>
        <a href="#workflow" className="hover:text-slate-100 transition-colors">Workflow</a>
        <a href="#pricing" className="hover:text-slate-100 transition-colors">Pricing</a>
      </div>

      {/* Action Button */}
      <div className="hidden md:flex items-center gap-4">
        <a 
          href="#login" 
          className="text-sm font-semibold text-slate-300 hover:text-slate-100 transition-colors"
        >
          Sign In
        </a>
        <Link href="/dashboard" className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-95 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 cursor-pointer">
          Launch App
        </Link>
      </div>

      {/* Mobile Toggle */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden flex items-center justify-center text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
      >
        <HugeiconsIcon icon={mobileMenuOpen ? Cancel01Icon : Menu01Icon} size={22} />
      </button>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-[70px] left-0 w-full border border-slate-800 bg-slate-950/95 backdrop-blur-2xl rounded-2xl p-6 flex flex-col gap-5 shadow-2xl animate-fadeIn md:hidden">
          <a 
            href="#features" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-slate-400 hover:text-slate-100 transition-colors"
          >
            Features
          </a>
          <a 
            href="#integrations" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-slate-400 hover:text-slate-100 transition-colors"
          >
            Integrations
          </a>
          <a 
            href="#workflow" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-slate-400 hover:text-slate-100 transition-colors"
          >
            Workflow
          </a>
          <a 
            href="#pricing" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-slate-400 hover:text-slate-100 transition-colors"
          >
            Pricing
          </a>
          <hr className="border-slate-800" />
          <div className="flex flex-col gap-3">
            <a 
              href="#login" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 text-sm font-semibold text-slate-300 hover:text-slate-100 transition-colors"
            >
              Sign In
            </a>
            <Link 
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 cursor-pointer text-center"
            >
              Launch App
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
