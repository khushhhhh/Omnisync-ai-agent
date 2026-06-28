"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SparklesIcon,
  ArrowRight01Icon,
  Cancel01Icon,
  Mail01Icon,
  TelegramIcon,
  WhatsappIcon,
  Calendar01Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

const SUGGESTED_PROMPTS = [
  { icon: Mail01Icon, label: "Summarize my emails", color: "text-red-400" },
  { icon: TelegramIcon, label: "Any urgent Telegram tasks?", color: "text-sky-400" },
  { icon: Calendar01Icon, label: "Any calendar conflicts?", color: "text-amber-400" },
  { icon: WhatsappIcon, label: "Show WhatsApp updates", color: "text-emerald-400" },
];

// Lightweight markdown renderer
function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-emerald-300 text-xs font-mono">$1</code>')
    .replace(/^### (.*$)/gm, '<h3 class="text-sm font-bold text-white mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-base font-bold text-white mt-4 mb-2">$1</h2>')
    .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc text-slate-300 text-sm leading-relaxed">$1</li>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

export default function AgentPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro",
      role: "model",
      content: `**OmniSync.ai Neural Command Agent online.**\n\nI have real-time access to your Gmail inbox, Telegram tasks, calendar conflicts, and WhatsApp chats. Ask me anything about your workspace, or choose a quick action below.\n\n*Ready to execute your commands.*`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUnconfigured, setIsUnconfigured] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    // Build conversation history for the API (exclude intro message)
    const history = [...messages.filter(m => m.id !== "intro"), userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();

      if (data.unconfigured) {
        setIsUnconfigured(true);
        setIsLoading(false);
        return;
      }

      if (!res.ok || data.error) {
        throw new Error(data.error || "Agent failed to respond.");
      }

      const agentMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: "model",
        content: data.response,
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, agentMessage]);

      // Remove streaming flag after a brief delay
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === agentMessage.id ? { ...m, isStreaming: false } : m
          )
        );
      }, 500);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Unknown error occurred.";
      setError(errMsg);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [messages, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-h-[900px] space-y-0">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-white/5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <HugeiconsIcon icon={SparklesIcon} size={12} className="animate-pulse" />
            Cognitive Core
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            AI Command Agent
          </h1>
          <p className="text-slate-400 text-sm font-normal leading-relaxed">
            Context-aware executive assistant with live workspace access.
          </p>
        </div>

        {/* Context Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { icon: Mail01Icon, label: "Gmail", color: "text-red-400 border-red-500/20 bg-red-500/5" },
            { icon: TelegramIcon, label: "Telegram", color: "text-sky-400 border-sky-500/20 bg-sky-500/5" },
            { icon: WhatsappIcon, label: "WhatsApp", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" },
            { icon: Calendar01Icon, label: "Calendar", color: "text-amber-400 border-amber-500/20 bg-amber-500/5" },
          ].map((badge) => (
            <div
              key={badge.label}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${badge.color}`}
            >
              <HugeiconsIcon icon={badge.icon} size={10} />
              {badge.label}
            </div>
          ))}
        </div>
      </div>

      {/* Unconfigured Banner */}
      {isUnconfigured && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 text-amber-300">
          <HugeiconsIcon icon={AlertCircleIcon} size={18} className="shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-amber-200">Gemini API Key Not Configured</p>
            <p className="text-xs leading-relaxed">
              Open <code className="bg-white/10 px-1 rounded text-xs">.env.local</code> in the project root, replace{" "}
              <code className="bg-white/10 px-1 rounded text-xs">your_gemini_api_key_here</code> with your real key from{" "}
              <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="underline text-amber-400 hover:text-amber-300">
                aistudio.google.com
              </a>
              , then restart the dev server.
            </p>
          </div>
        </div>
      )}

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold border ${
                msg.role === "user"
                  ? "bg-slate-800 border-white/10 text-slate-300"
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              }`}
            >
              {msg.role === "user" ? "U" : (
                <HugeiconsIcon icon={SparklesIcon} size={14} className={msg.isStreaming ? "animate-pulse" : ""} />
              )}
            </div>

            {/* Message Bubble */}
            <div className={`flex flex-col gap-1 max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-emerald-500/15 border border-emerald-500/20 text-slate-200 rounded-tr-sm"
                    : "bg-white/5 border border-white/10 text-slate-300 rounded-tl-sm"
                } ${msg.isStreaming ? "animate-pulse" : ""}`}
              >
                {msg.role === "model" ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                    className="prose-sm max-w-none"
                  />
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
              <span className="text-[10px] text-slate-600 font-mono px-1">
                {formatTime(msg.timestamp)}
              </span>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3 flex-row">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <HugeiconsIcon icon={SparklesIcon} size={14} className="animate-spin" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 flex items-center gap-2">
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
              <span className="text-xs text-slate-500 font-medium">Agent processing workspace context...</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs">
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 pb-3">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt.label}
              onClick={() => sendMessage(prompt.label)}
              disabled={isLoading}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs font-medium transition-all duration-200 cursor-pointer disabled:opacity-40"
            >
              <HugeiconsIcon icon={prompt.icon} size={13} className={prompt.color} />
              {prompt.label}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="border-t border-white/5 pt-4">
        <div className="flex items-end gap-3 p-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm focus-within:border-emerald-500/30 focus-within:bg-emerald-500/5 transition-all duration-300">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your emails, tasks, calendar conflicts, or any workspace action..."
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none resize-none max-h-36 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 leading-relaxed py-0.5 disabled:opacity-50"
            style={{ minHeight: "24px" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 144)}px`;
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-950 transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </button>
        </div>
        <p className="text-[10px] text-slate-600 text-center mt-2">
          Press <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 text-[9px]">Enter</kbd> to send · <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 text-[9px]">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}
