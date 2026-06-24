import React from "react";
import SidebarNav from "@/components/dashboard/SidebarNav";
import UserCard from "@/components/dashboard/UserCard";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon } from "@hugeicons/core-free-icons";

// Hardcoded mock verified session for UI sprint (renders 100% statically without BaaS queries)
const user = { name: "Raghav (Lead Agent)", email: "raghav@omnisync.ai" };

/* 
// SERVER-SIDE AUTHENTICATION LOGIC (COMMENTED OUT TO UNBLOCK SPRINT)
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAuthActions } from "@insforge/sdk/ssr";

const cookieStore = await cookies();
const auth = createAuthActions({ requestCookies: cookieStore });
const { data: { user: currentUser } } = await auth.getCurrentUser();
if (!currentUser) {
  redirect("/sign-in");
}
*/

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex">
      {/* Fixed Sidebar */}
      <aside className="w-[260px] fixed top-0 left-0 h-full bg-[#0a0a0c]/90 border-r border-white/10 backdrop-blur-md z-30 flex flex-col justify-between p-6">
        <div className="space-y-8 w-full">
          {/* Logo */}
          <a href="/dashboard" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <HugeiconsIcon icon={SparklesIcon} size={18} />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Omnisync<span className="text-emerald-400">.ai</span>
            </span>
          </a>

          {/* Navigation Links */}
          <SidebarNav />
        </div>

        {/* User status card at bottom (passed with mock credentials) */}
        <UserCard user={user} />
      </aside>

      {/* Main Content Container */}
      <div className="flex-1 pl-[260px] min-h-screen relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[600px] md:h-[600px] bg-emerald-500/5 rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] md:w-[600px] md:h-[600px] bg-teal-500/5 rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />

        <main className="p-8 md:p-12 relative z-10 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
