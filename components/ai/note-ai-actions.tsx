"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { runNoteAction } from "@/lib/ai/client";
import { useAI } from "@/lib/ai/use-ai";
import AIResultDisplay from "./ai-result-display";
import type { NoteActionType } from "@/lib/ai/types";
import { MotionButton } from "@/components/motion/motion-primitives";

const ACTIONS: { key: NoteActionType; label: string; color: string }[] = [
  { key: "summarize", label: "Summarize", color: "bg-indigo-600 hover:bg-indigo-500" },
  { key: "explain_simple", label: "Explain simply", color: "bg-emerald-600 hover:bg-emerald-500" },
  { key: "extract_key_terms", label: "Key terms", color: "bg-amber-600 hover:bg-amber-500" },
  { key: "generate_quiz", label: "Generate quiz", color: "bg-rose-600 hover:bg-rose-500" },
  { key: "create_flashcards", label: "Flashcards", color: "bg-violet-600 hover:bg-violet-500" },
  { key: "improve_writing", label: "Improve writing", color: "bg-sky-600 hover:bg-sky-500" },
  { key: "study_guide", label: "Study guide", color: "bg-teal-600 hover:bg-teal-500" },
];

export default function NoteAIActions({
  noteTitle,
  noteContent,
  subjectName,
  onSaveAsNote,
}: {
  noteTitle: string;
  noteContent: string;
  subjectName: string;
  onSaveAsNote?: (title: string, content: string) => void;
}) {
  const reducedMotion = useReducedMotion();
  const { result, loading, error, run, clear } = useAI();
  const [lastAction, setLastAction] = useState<NoteActionType | null>(null);

  const disabled = loading || !noteContent.trim();

  function handleRun(action: NoteActionType) {
    setLastAction(action);
    run(() =>
      runNoteAction({
        action,
        noteTitle,
        noteContent,
        subjectName,
      })
    );
  }

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 8 }}
        animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-5"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              AI Actions
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {noteContent.trim()
                ? `Run AI on "${noteTitle}"`
                : "Add content to this note to enable AI actions"}
            </p>
          </div>
          {result && (
            <MotionButton
              type="button"
              onClick={clear}
              className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Clear result
            </MotionButton>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {ACTIONS.map((a) => (
            <MotionButton
              key={a.key}
              type="button"
              disabled={disabled}
              onClick={() => handleRun(a.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition ${a.color} ${
                disabled ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {a.label}
            </MotionButton>
          ))}
        </div>
      </motion.div>

      {/* Result */}
      <AIResultDisplay
        result={result}
        loading={loading}
        error={error}
        onRetry={lastAction ? () => handleRun(lastAction) : undefined}
        onSaveAsNote={onSaveAsNote}
      />
    </div>
  );
}
