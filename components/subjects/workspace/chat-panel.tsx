"use client";

import { useMemo, useState } from "react";

type Message = { id: string; role: "user" | "assistant"; content: string };

function Bubble({ role, content }: { role: Message["role"]; content: string }) {
  const isUser = role === "user";
  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={[
          "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-6 shadow-sm",
          isUser
            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
            : "bg-slate-50 text-slate-800 ring-1 ring-slate-200 dark:bg-slate-900/30 dark:text-slate-100 dark:ring-slate-800",
        ].join(" ")}
      >
        {content}
      </div>
    </div>
  );
}

export default function SubjectChatPanel({
  subjectName,
}: {
  subjectName: string;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      role: "user",
      content: `Can you explain today’s topic in ${subjectName} like I’m new to it?`,
    },
    {
      id: "m2",
      role: "assistant",
      content:
        "Sure. Start with the big idea, then we’ll break it into steps and a simple example. What part feels hardest right now?",
    },
    {
      id: "m3",
      role: "user",
      content: "The definitions and how to apply them.",
    },
  ]);
  const [input, setInput] = useState("");

  const canSend = useMemo(() => input.trim().length > 0, [input]);

  function send() {
    if (!canSend) return;
    const text = input.trim();
    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", content: text },
    ]);

    // Mock assistant reply (MVP UI only)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content:
            "Got it. Here’s a simple approach: (1) restate the definition in your own words, (2) identify the inputs/outputs, (3) do one tiny example, (4) increase difficulty.\n\nIf you paste a definition, I’ll walk through it step-by-step.",
        },
      ]);
    }, 350);
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800 md:px-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            AI Chat
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Ask questions and keep context within this subject.
          </p>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">Mock</span>
      </div>

      <div className="max-h-[360px] space-y-3 overflow-auto px-4 py-4 md:px-6">
        {messages.map((m) => (
          <Bubble key={m.id} role={m.role} content={m.content} />
        ))}
      </div>

      <div className="border-t border-slate-200 px-4 py-4 dark:border-slate-800 md:px-6">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${subjectName} assistant…`}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-600"
          />
          <button
            type="button"
            onClick={send}
            disabled={!canSend}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </section>
  );
}

