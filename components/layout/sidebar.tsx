"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Bell, 
  Bot, 
  Settings, 
  X,
  Sparkles
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Briefing", href: "/dashboard/briefing", icon: BookOpen },
    { name: "Alerts", href: "/dashboard/alerts", icon: Bell },
    { name: "AI Agent", href: "/dashboard/agent", icon: Bot },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const user = { name: "Raghav (Lead Agent)", email: "raghav@omnisync.ai" };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`w-64 fixed top-0 left-0 h-full bg-slate-950/95 border-r border-white/10 backdrop-blur-md z-50 flex flex-col justify-between p-6 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-8 w-full">
          {/* Logo & Close Button (Mobile Only) */}
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 group" onClick={onClose}>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                <Sparkles size={18} />
              </div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Omnisync<span className="text-emerald-400">.ai</span>
              </span>
            </Link>
            <button 
              className="lg:hidden p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              onClick={onClose}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 w-full">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 border ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)] font-bold"
                      : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <IconComponent size={16} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card at bottom */}
        <div className="pt-4 border-t border-white/5 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-emerald-500/10 border border-emerald-400/20">
            {user.name.charAt(0)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-white truncate leading-none mb-1">{user.name}</span>
            <span className="text-[10px] text-slate-400 truncate leading-none">{user.email}</span>
          </div>
        </div>
      </aside>
    </>
  );
}
