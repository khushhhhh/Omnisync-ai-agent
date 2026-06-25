"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import { Menu, Sparkles } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col lg:flex-row">
      {/* Persistent & State-Aware Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile Topbar */}
      <header className="lg:hidden h-16 border-b border-white/10 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40 w-full">
        <a href="/dashboard" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
            <Sparkles size={16} />
          </div>
          <span className="font-bold text-base tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Omnisync<span className="text-emerald-400">.ai</span>
          </span>
        </a>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Main Content Viewport */}
      <div className="flex-1 lg:ml-64 min-h-screen relative overflow-hidden flex flex-col">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[600px] md:h-[600px] bg-emerald-500/5 rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] md:w-[600px] md:h-[600px] bg-teal-500/5 rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />

        <main className="p-6 md:p-10 relative z-10 w-full max-w-7xl mx-auto flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
