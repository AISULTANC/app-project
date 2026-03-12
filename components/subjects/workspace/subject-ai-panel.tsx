"use client";

import { useState } from "react";

import { runAIAction } from "@/lib/ai/client";
import type { AIActionType, AIResult, SelectedContentPayload } from "@/lib/ai/types";

import AIActionPanel from "./ai-action-panel";
import AIResultPanel from "./ai-result-panel";
import AISelectedPanel, { type SelectedSource } from "./ai-selected-panel";

type NonNullSource = Exclude<SelectedSource, null>;

function toPayload(
  subjectName: string,
  source: NonNullSource
): SelectedContentPayload {
  if (source.kind === "note") {
    return {
      kind: "note",
      subjectName,
      title: source.note.title,
      content: source.note.content || "",
    };
  }
  return {
    kind: "file",
    subjectName,
    name: source.file.name,
    type: source.file.type || "unknown/type",
    size: source.file.size,
  };
}

function buildDemoResult(
  action: AIActionType,
  subjectName: string,
  source: NonNullSource
): AIResult {
  const label =
    source.kind === "note"
      ? `"${source.note.title || "Untitled note"}"`
      : `"${source.file.name}"`;

  const baseTitle =
    action === "summarize"
      ? "Demo summary"
      : action === "explain_simple"
        ? "Demo simple explanation"
        : action === "extract_key_terms"
          ? "Demo key terms"
          : action === "generate_quiz"
            ? "Demo quiz"
            : "Demo flashcards";

  if (action === "summarize" || action === "explain_simple") {
    return {
      action,
      title: baseTitle,
      paragraphs: [
        `This is a demo AI ${action === "summarize" ? "summary" : "explanation"} for the subject ${subjectName} based on ${label}.`,
        "Connect your own OpenAI API key with available billing to see real, personalized AI responses generated from your notes and files.",
      ],
    };
  }

  if (action === "extract_key_terms") {
    return {
      action: "extract_key_terms",
      title: baseTitle,
      terms: [
        "Demo term — Short, student-friendly definition to show how key terms will appear.",
        "Concept check — Use this list to quickly review the most important ideas.",
      ],
    };
  }

  if (action === "generate_quiz") {
    return {
      action: "generate_quiz",
      title: baseTitle,
      questions: [
        {
          q: "Demo question: What is one idea you should remember from this topic?",
          a: "This is a placeholder answer. Real questions and answers will be generated from your own study material.",
        },
        {
          q: "Demo question: How could this topic show up on a test?",
          a: "In demo mode, this gives you a feel for the quiz format.",
        },
      ],
    };
  }

  return {
    action: "create_flashcards",
    title: baseTitle,
    cards: [
      {
        front: "Demo flashcard front",
        back: "This is where an explanation or definition would go, generated from your content.",
      },
      {
        front: "How to use these cards",
        back: "Use the real AI mode to turn tricky concepts into quick-review flashcards.",
      },
    ],
  };
}

export default function SubjectAIPanel({
  subjectName,
  selected,
}: {
  subjectName: string;
  selected: SelectedSource;
}) {
  const [result, setResult] = useState<AIResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  async function handleRun(action: AIActionType) {
    if (!selected) return;
    setLoading(true);
    setError(null);
    setErrorCode(null);
    try {
      const payload = {
        action,
        source: toPayload(subjectName, selected as NonNullSource),
      };
      const res = await runAIAction(payload);
      setResult(res);
    } catch (err: any) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "AI request failed. Please try again.";
      setError(message);
      setErrorCode(err?.code ?? null);
    } finally {
      setLoading(false);
    }
  }

  function handleUseDemo(action: AIActionType) {
    if (!selected) return;
    const demo = buildDemoResult(action, subjectName, selected as NonNullSource);
    setResult(demo);
    setError(null);
    setErrorCode(null);
  }

  const hasError = Boolean(error);
  const quotaError = errorCode === "INSUFFICIENT_QUOTA";

  return (
    <>
      <AISelectedPanel source={selected} />
      <AIActionPanel
        disabled={!selected || loading}
        onRun={handleRun}
        onRunDemo={handleUseDemo}
        hasError={hasError}
        quotaError={quotaError}
      />
      <section className="space-y-2">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-300">
            Running AI action…
          </div>
        ) : null}
        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm dark:border-rose-500/40 dark:bg-rose-500/10">
            <p className="font-medium text-rose-800 dark:text-rose-100">AI request problem</p>
            <p className="mt-1 text-rose-700 dark:text-rose-200">{error}</p>
          </div>
        ) : null}
        <AIResultPanel result={result} />
      </section>
    </>
  );
}

