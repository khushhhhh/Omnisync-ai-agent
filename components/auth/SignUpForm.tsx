"use client";

import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  MailIcon, 
  LockIcon, 
  UserIcon,
  ViewIcon, 
  ViewOffIcon, 
  ArrowRight01Icon,
  AlertCircleIcon,
  SparklesIcon
} from "@hugeicons/core-free-icons";
import { insforge } from "@/lib/insforge";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: apiError } = await insforge.auth.signUp({
        email,
        password,
        name,
      });

      if (apiError) {
        setError(apiError.message || "Failed to create account. Please try again.");
      } else if (data) {
        if (data.requireEmailVerification) {
          setSuccess("Account created successfully! Please check your email to verify your account.");
        } else {
          setSuccess("Account created successfully! Redirecting to dashboard...");
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1500);
        }
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md z-10">
      {/* Header */}
      <div className="text-center mb-8">
        <a href="/" className="inline-flex items-center gap-2 group mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
            <HugeiconsIcon icon={SparklesIcon} size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Omnisync<span className="text-emerald-400">.ai</span>
          </span>
        </a>
        <h2 className="text-2xl font-bold text-white tracking-tight">Create Account</h2>
        <p className="text-slate-400 text-sm mt-1.5">Sign up to sync your apps and deploy autonomous webhooks</p>
      </div>

      {/* Card container */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/40">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Full Name field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Full Name
            </label>
            <div className="relative">
              <HugeiconsIcon 
                icon={UserIcon} 
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" 
                size={18} 
              />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all duration-300 text-sm"
                disabled={loading}
              />
            </div>
          </div>

          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-3:00 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <HugeiconsIcon 
                icon={MailIcon} 
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" 
                size={18} 
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all duration-300 text-sm"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <HugeiconsIcon 
                icon={LockIcon} 
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" 
                size={18} 
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full pl-11 pr-11 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all duration-300 text-sm"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                disabled={loading}
              >
                <HugeiconsIcon icon={showPassword ? ViewOffIcon : ViewIcon} size={18} />
              </button>
            </div>
          </div>

          {/* Notifications */}
          {error && (
            <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl p-3.5 text-xs">
              <HugeiconsIcon icon={AlertCircleIcon} className="text-red-400 shrink-0 mt-0.5" size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 rounded-xl p-3.5 text-xs">
              <HugeiconsIcon icon={SparklesIcon} className="text-emerald-400 shrink-0 mt-0.5" size={16} />
              <span>{success}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-[0.98] text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-emerald-500/15 hover:shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
            {!loading && <HugeiconsIcon icon={ArrowRight01Icon} size={16} />}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6 pt-5 border-t border-white/5">
          <p className="text-slate-400 text-xs">
            Already have an account?{" "}
            <a 
              href="/sign-in" 
              className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors font-semibold"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
