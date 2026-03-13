"use client";

import { useState } from "react";
import { runStudyTool } from "@/lib/ai/client";
import { useAI } from "@/lib/ai/use-ai";
import { useSubjects } from "@/components/subjects/subjects-store";
import { useNotes } from "@/components/notes/notes-store";
import AIResultDisplay from "@/components/ai/ai-result-display";
import type { StudyToolType } from "@/lib/ai/types";

const TOOLS: {
  key: StudyToolType;
  label: string;
  description: string;
  color: string;
  icon: string;
}[] = [
  {
    key: "generate_quiz",
    label: "Generate Quiz",
    description: "Create practice questions to test your understanding",
    color: "bg-rose-600 hover:bg-rose-500",
    icon: "?",
  },
  {
    key: "generate_flashcards",
    label: "Flashcards",
    description: "Create flashcards for quick review sessions",
    color: "bg-violet-600 hover:bg-violet-500",
    icon: "◫",
  },
  {
    key: "study_plan",
    label: "Study Plan",
    description: "Get a structured plan with priorities and time estimates",
    color: "bg-indigo-600 hover:bg-indigo-500",
    icon: "📋",
  },
  {
    key: "explain_step_by_step",
    label: "Step-by-Step",
    description: "Break down a topic from basics to advanced",
    color: "bg-emerald-600 hover:bg-emerald-500",
    icon: "1→",
  },
  {
    key: "key_terms",
    label: "Key Terms",
    description: "Get definitions for the most important concepts",
    color: "bg-amber-600 hover:bg-amber-500",
    icon: "A",
  },
];

export default function StudyToolsPage() {
  const { subjects } = useSubjects();
  const { notes, createNote } = useNotes();
  const { result, loading, error, run, clear } = useAI();

  const [topic, setTopic] = useState("");
  const [subjectId, setSubjectId] = useState<string>("");
  const [lastTool, setLastTool] = useState<StudyToolType | null>(null);

  const subject = subjects.find((s) => s.id === subjectId);

  // Gather note content for additional context if a subject is selected
  const subjectNotes = subjectId
    ? notes
        .filter((n) => n.subjectId === subjectId)
        .slice(0, 3)
        .map((n) => `${n.title}: ${n.content?.slice(0, 300) || ""}`)
        .join("\n\n")
    : "";

  const canRun = topic.trim().length > 0 && !loading;

  function handleRun(tool: StudyToolType) {
    if (!canRun) return;
    setLastTool(tool);
    run(() =>
      runStudyTool({
        tool,
        topic: topic.trim(),
        subjectName: subject?.name,
        additionalContent: subjectNotes || undefined,
      })
    );
  }

  return (
    <>
      {/* Input section */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-6">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          AI Study Tools
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Enter a topic and pick a tool. AI will generate study materials for you.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
              Topic or question
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Derivatives and their applications in Calculus"
              rows={3}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
              Subject (optional — adds context from your notes)
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            >
              <option value="">No subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {subject && subjectNotes && (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Will include context from {notes.filter((n) => n.subjectId === subjectId).length} note(s)
                in {subject.name}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Tool buttons */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-6">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Choose a tool
        </h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <button
              key={t.key}
              type="button"
              disabled={!canRun}
              onClick={() => handleRun(t.key)}
              className={`group flex flex-col items-start rounded-xl p-4 text-left text-white shadow-sm transition ${t.color} ${
                !canRun ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              <span className="text-lg font-bold leading-none">{t.icon}</span>
              <span className="mt-2 text-sm font-semibold">{t.label}</span>
              <span className="mt-1 text-xs opacity-80">{t.description}</span>
            </button>
          ))}
        </div>
        {!topic.trim() && (
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Enter a topic above to enable the tools.
          </p>
        )}
      </section>

      {/* Result */}
      {(result || loading || error) && (
        <section>
          {result && (
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={clear}
                className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Clear result
              </button>
            </div>
          )}
          <AIResultDisplay
            result={result}
            loading={loading}
            error={error}
            onRetry={lastTool ? () => handleRun(lastTool) : undefined}
            onSaveAsNote={
              subjectId
                ? (title, content) => {
                    createNote({ subjectId, title, content });
                  }
                : undefined
            }
          />
        </section>
      )}
    </>
  );
}
