"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { runFileAction } from "@/lib/ai/client";
import { useAI } from "@/lib/ai/use-ai";
import AIResultDisplay from "./ai-result-display";
import type { FileActionType } from "@/lib/ai/types";
import { MotionButton } from "@/components/motion/motion-primitives";

const ACTIONS: { key: FileActionType; label: string; color: string }[] = [
  { key: "summarize", label: "Summarize", color: "bg-indigo-600 hover:bg-indigo-500" },
  { key: "extract_key_points", label: "Key points", color: "bg-emerald-600 hover:bg-emerald-500" },
  { key: "generate_quiz", label: "Generate quiz", color: "bg-rose-600 hover:bg-rose-500" },
  { key: "explain_simple", label: "Explain simply", color: "bg-amber-600 hover:bg-amber-500" },
  { key: "create_flashcards", label: "Flashcards", color: "bg-violet-600 hover:bg-violet-500" },
];

export default function FileAIActions({
  fileName,
  fileContent,
  subjectName,
  onSaveAsNote,
}: {
  fileName: string;
  fileContent: string;
  subjectName: string;
  onSaveAsNote?: (title: string, content: string) => void;
}) {
  const reducedMotion = useReducedMotion();
  const { result, loading, error, run, clear } = useAI();
  const [lastAction, setLastAction] = useState<FileActionType | null>(null);

  const hasContent = fileContent.trim().length > 0;
  const disabled = loading || !hasContent;

  function handleRun(action: FileActionType) {
    setLastAction(action);
    run(() =>
      runFileAction({
        action,
        fileName,
        fileContent,
        subjectName,
      })
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 8 }}
        animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-5"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              File AI Actions
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {hasContent
                ? `Run AI on "${fileName}"`
                : "No text content available for this file"}
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

        {!hasContent && (
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-300">
            Text extraction is available for .txt files. PDF and DOCX parsing
            can be added later. For now, try uploading a .txt file to use AI
            actions.
          </div>
        )}
      </motion.div>

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
