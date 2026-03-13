"use client";

import { useState } from "react";
import AIChatPanel from "@/components/ai/ai-chat-panel";
import { useSubjects } from "@/components/subjects/subjects-store";

export default function ChatPage() {
  const { subjects } = useSubjects();
  const [selectedId, setSelectedId] = useState<string>(subjects[0]?.id || "");

  const selected = subjects.find((s) => s.id === selectedId);

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {/* Subject selector */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
              Chat about
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
              <option value="__general">General (no subject)</option>
            </select>
          </div>

          {/* Chat panel */}
          <AIChatPanel
            key={selectedId}
            subjectName={selected?.name || "General"}
            subjectDescription={selected?.description || "General study assistance"}
          />
        </div>

        <div className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Tips
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Use subject chat when you want focused help. Keep your question
              specific and paste a definition or example if you can.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Try asking
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/30">
                "Explain limits in simple terms"
              </li>
              <li className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/30">
                "Create 5 quiz questions about derivatives"
              </li>
              <li className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/30">
                "Help me write a study plan for the exam"
              </li>
              <li className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/30">
                "What are the key concepts I should review?"
              </li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}

