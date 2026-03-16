"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import type { AIChatMessage } from "@/lib/ai/types";
import { MotionButton } from "@/components/motion/motion-primitives";

function Bubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const reducedMotion = useReducedMotion();
  const isUser = role === "user";
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      className={isUser ? "flex justify-end" : "flex justify-start"}
    >
      <motion.div
        whileHover={reducedMotion ? undefined : { y: -1 }}
        className={[
          "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-7 shadow-sm",
          isUser
            ? "bg-indigo-600 text-white"
            : "bg-slate-50 text-slate-800 ring-1 ring-slate-200 dark:bg-[#111111] dark:text-white dark:ring-[#1f1f1f]",
        ].join(" ")}
      >
        {content}
      </motion.div>
    </motion.div>
  );
}

function TypingIndicator() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200 dark:bg-[#111111] dark:ring-[#1f1f1f]">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={reducedMotion ? undefined : { y: [0, -3, 0], opacity: [0.6, 1, 0.6] }}
            transition={
              reducedMotion
                ? undefined
                : { duration: 0.9, repeat: Infinity, delay: i * 0.14, ease: "easeInOut" }
            }
            className="h-2 w-2 rounded-full bg-slate-400"
          />
        ))}
      </div>
    </div>
  );
}

export default function AIChatPanel({
  subjectName,
  subjectDescription,
  context,
}: {
  subjectName: string;
  subjectDescription: string;
  context?: {
    noteTitle?: string;
    noteContent?: string;
    fileName?: string;
    fileContent?: string;
  };
}) {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const canSend = input.trim().length > 0 && !loading;

  async function send() {
    if (!canSend) return;
    const text = input.trim();
    setInput("");

    const userMsg: AIChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
    };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setLoading(true);

    const assistantId = `a-${Date.now()}`;
    let streamedContent = "";

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          subjectName,
          subjectDescription,
          context,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      if (!res.body) {
        throw new Error("No response body");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
        },
      ]);
      setLoading(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        streamedContent += chunk;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: streamedContent } : m
          )
        );
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to get AI response.";
      setMessages((prev) => {
        const hasAssistant = prev.some((m) => m.id === assistantId);
        if (hasAssistant) {
          return prev.map((m) =>
            m.id === assistantId ? { ...m, content: `Error: ${msg}` } : m
          );
        }
        return [
          ...prev,
          {
            id: assistantId,
            role: "assistant",
            content: `Error: ${msg}`,
          },
        ];
      });
    } finally {
      setLoading(false);
    }
  }

  const contextLabel = context?.noteTitle
    ? `Note: ${context.noteTitle}`
    : context?.fileName
      ? `File: ${context.fileName}`
      : null;

  return (
    <section className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#1f1f1f] dark:bg-[#111111]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-[#1f1f1f] md:px-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            AI Chat — {subjectName}
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-[#a1a1a1]">
            Ask questions about {subjectName}. AI remembers the conversation.
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/30">
          Groq ⚡
        </span>
      </div>

      {/* Context badge */}
      {contextLabel && (
        <div className="border-b border-slate-200 px-4 py-2 dark:border-[#1f1f1f]">
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-100 dark:bg-[#3b82f6]/10 dark:text-[#3b82f6] dark:ring-[#3b82f6]/20">
            Context: {contextLabel}
          </span>
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollRef}
        className="max-h-[420px] min-h-[200px] space-y-3 overflow-auto px-4 py-4 md:px-6"
      >
        {messages.length === 0 && !loading && (
          <div className="flex h-32 items-center justify-center text-sm text-slate-400 dark:text-[#a1a1a1]">
            Start a conversation about {subjectName}…
          </div>
        )}
        {messages.map((m) => (
          <Bubble key={m.id} role={m.role} content={m.content} />
        ))}
        {loading && <TypingIndicator />}
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 px-4 py-4 dark:border-[#1f1f1f] md:px-6">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${subjectName}…`}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            disabled={loading}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 disabled:opacity-50 dark:border-[#1f1f1f] dark:bg-[#0a0a0a] dark:text-white dark:focus:border-[#3b82f6] dark:focus:ring-[#3b82f6]"
          />
          <MotionButton
            type="button"
            onClick={send}
            disabled={!canSend}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </MotionButton>
        </div>
      </div>
    </section>
  );
}
