"use client";

import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { LogoutIcon, SparklesIcon } from "@hugeicons/core-free-icons";
import { insforge } from "@/lib/insforge";

interface UserProps {
  name: string;
  email: string;
}

export default function UserCard({ user }: { user?: UserProps }) {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const { error } = await insforge.auth.signOut();
      if (!error) {
        window.location.href = "/sign-in";
      } else {
        console.error("Sign out error:", error);
      }
    } catch (err) {
      console.error("Unexpected error during sign out:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {/* Pulsing Status Dot indicator */}
        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <HugeiconsIcon icon={SparklesIcon} size={15} />
          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-white truncate">{user?.name || "Active Agent"}</span>
          <span className="text-[10px] text-slate-400 truncate">{user?.email || "Listening live"}</span>
        </div>
      </div>

      <button
        onClick={handleSignOut}
        disabled={loading}
        className="w-full py-2 px-3 rounded-lg border border-white/5 hover:border-red-500/20 hover:bg-red-500/10 text-slate-300 hover:text-red-200 text-xs font-medium flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
      >
        <HugeiconsIcon icon={LogoutIcon} size={14} />
        <span>{loading ? "Signing Out..." : "Sign Out"}</span>
      </button>
    </div>
  );
}
