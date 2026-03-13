"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { AIResultUnion } from "@/lib/ai/types";
import { MotionButton } from "@/components/motion/motion-primitives";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <MotionButton
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      {copied ? "Copied!" : "Copy"}
    </MotionButton>
  );
}

function resultToText(result: AIResultUnion): string {
  switch (result.type) {
    case "text":
      return `${result.title}\n\n${result.content}`;
    case "terms":
      return `${result.title}\n\n${result.terms.map((t) => `• ${t.term}: ${t.definition}`).join("\n")}`;
    case "quiz":
      return `${result.title}\n\n${result.questions.map((q, i) => `${i + 1}. ${q.question}\n   Answer: ${q.answer}`).join("\n\n")}`;
    case "flashcards":
      return `${result.title}\n\n${result.cards.map((c, i) => `Card ${i + 1}\nFront: ${c.front}\nBack: ${c.back}`).join("\n\n")}`;
    case "study_guide":
      return `${result.title}\n\n${result.sections.map((s) => `## ${s.heading}\n${s.points.map((p) => `• ${p}`).join("\n")}\nReview: ${s.reviewQuestion}`).join("\n\n")}`;
    case "key_points":
      return `${result.title}\n\n${result.points.map((p) => `• ${p}`).join("\n")}`;
    case "study_plan":
      return `${result.title}\n\n${result.plan.map((p) => `${p.phase} (${p.duration}, ${p.priority})\n${p.tasks.map((t) => `  • ${t}`).join("\n")}`).join("\n\n")}`;
    case "steps":
      return `${result.title}\n\n${result.steps.map((s) => `Step ${s.step}: ${s.heading}\n${s.explanation}`).join("\n\n")}`;
  }
}

function resultToNoteContent(result: AIResultUnion): string {
  return resultToText(result);
}

export default function AIResultDisplay({
  result,
  loading,
  error,
  onRetry,
  onSaveAsNote,
}: {
  result: AIResultUnion | null;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  onSaveAsNote?: (title: string, content: string) => void;
}) {
  const reducedMotion = useReducedMotion();

  if (loading) {
    return (
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 8 }}
        animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={reducedMotion ? undefined : { rotate: 360 }}
            transition={reducedMotion ? undefined : { duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-5 w-5 rounded-full border-2 border-slate-300 border-t-indigo-600 dark:border-slate-600 dark:border-t-indigo-400"
          />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            AI is thinking…
          </span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 8 }}
        animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        className="rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-sm dark:border-rose-500/30 dark:bg-rose-500/10"
      >
        <p className="text-sm font-semibold text-rose-800 dark:text-rose-100">
          AI request failed
        </p>
        <p className="mt-1 text-sm text-rose-700 dark:text-rose-200">{error}</p>
        {onRetry && (
          <MotionButton
            type="button"
            onClick={onRetry}
            className="mt-3 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500"
          >
            Try again
          </MotionButton>
        )}
      </motion.div>
    );
  }

  if (!result) return null;

  const fullText = resultToText(result);

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
      animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={reducedMotion ? undefined : { duration: 0.25 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {result.title}
        </h3>
        <div className="flex items-center gap-2">
          <CopyButton text={fullText} />
          {onSaveAsNote && (
            <MotionButton
              type="button"
              onClick={() =>
                onSaveAsNote(result.title, resultToNoteContent(result))
              }
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-500"
            >
              Save as note
            </MotionButton>
          )}
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={result.type + result.title}
        initial={reducedMotion ? false : { opacity: 0, y: 6 }}
        animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        className="mt-4 text-sm text-slate-700 dark:text-slate-200"
      >
        {result.type === "text" && (
          <div className="space-y-3 leading-7 whitespace-pre-wrap">
            {result.content}
          </div>
        )}

        {result.type === "terms" && (
          <div className="grid gap-2 sm:grid-cols-2">
            {result.terms.map((t, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/40"
              >
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  {t.term}
                </div>
                <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  {t.definition}
                </div>
              </div>
            ))}
          </div>
        )}

        {result.type === "quiz" && (
          <ol className="space-y-3">
            {result.questions.map((q, i) => (
              <li
                key={i}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40"
              >
                <div className="font-medium text-slate-900 dark:text-slate-100">
                  {i + 1}. {q.question}
                </div>
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                    Show answer
                  </summary>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                    {q.answer}
                  </p>
                </details>
              </li>
            ))}
          </ol>
        )}

        {result.type === "flashcards" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {result.cards.map((c, i) => (
              <FlashCard key={i} front={c.front} back={c.back} />
            ))}
          </div>
        )}

        {result.type === "study_guide" && (
          <div className="space-y-4">
            {result.sections.map((s, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40"
              >
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                  {s.heading}
                </h4>
                <ul className="mt-2 space-y-1">
                  {s.points.map((p, j) => (
                    <li key={j} className="text-xs text-slate-600 dark:text-slate-300">
                      • {p}
                    </li>
                  ))}
                </ul>
                {s.reviewQuestion && (
                  <p className="mt-2 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                    Review: {s.reviewQuestion}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {result.type === "key_points" && (
          <ul className="space-y-2">
            {result.points.map((p, i) => (
              <li
                key={i}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900/40"
              >
                {p}
              </li>
            ))}
          </ul>
        )}

        {result.type === "study_plan" && (
          <div className="space-y-3">
            {result.plan.map((p, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    {p.phase}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {p.duration}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        p.priority === "high"
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300"
                          : p.priority === "medium"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                      }`}
                    >
                      {p.priority}
                    </span>
                  </div>
                </div>
                <ul className="mt-2 space-y-1">
                  {p.tasks.map((t, j) => (
                    <li key={j} className="text-xs text-slate-600 dark:text-slate-300">
                      • {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {result.type === "steps" && (
          <div className="space-y-3">
            {result.steps.map((s) => (
              <div
                key={s.step}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40"
              >
                <div className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                    {s.step}
                  </span>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    {s.heading}
                  </h4>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                  {s.explanation}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function FlashCard({ front, back }: { front: string; back: string }) {
  const reducedMotion = useReducedMotion();
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      whileHover={reducedMotion ? undefined : { y: -2 }}
      whileTap={reducedMotion ? undefined : { scale: 0.98 }}
      onClick={() => setFlipped(!flipped)}
      className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900/40"
    >
      {flipped ? (
        <>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
            Answer
          </div>
          <div className="mt-1 text-sm text-slate-700 dark:text-slate-200">
            {back}
          </div>
        </>
      ) : (
        <>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            Question
          </div>
          <div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
            {front}
          </div>
        </>
      )}
      <div className="mt-2 text-[10px] text-slate-400 dark:text-slate-500">
        Click to {flipped ? "see question" : "reveal answer"}
      </div>
    </motion.div>
  );
}
