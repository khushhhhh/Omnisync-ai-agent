import React from "react";
import SignInForm from "@/components/auth/SignInForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - Omnisync.ai",
  description: "Sign in to your Omnisync.ai account to manage your AI agents and webhooks.",
};

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0c] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Decorative Blur Background Objects */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[500px] md:h-[500px] bg-emerald-500/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] md:w-[500px] md:h-[500px] bg-teal-500/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

      {/* Actual Sign-In Form component */}
      <SignInForm />
    </main>
  );
}
