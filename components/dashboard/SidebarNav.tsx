"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  HomeIcon, 
  FolderSyncIcon, 
  AnalyticsUpIcon 
} from "@hugeicons/core-free-icons";

export default function SidebarNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Hub", href: "/dashboard", icon: HomeIcon },
    { name: "Integrations", href: "/dashboard/integrations", icon: FolderSyncIcon },
    { name: "Logs", href: "/dashboard/logs", icon: AnalyticsUpIcon },
  ];

  return (
    <div className="space-y-1.5 w-full">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <a
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
              isActive
                ? "bg-white/8 text-white border-l-2 border-emerald-500 shadow-inner"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            <HugeiconsIcon 
              icon={item.icon} 
              size={18} 
              className={`transition-colors duration-200 ${
                isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-300"
              }`}
            />
            <span>{item.name}</span>
          </a>
        );
      })}
    </div>
  );
}
