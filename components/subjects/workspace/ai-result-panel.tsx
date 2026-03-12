import type { AIResult } from "@/lib/ai/types";

function actionLabel(action: AIResult["action"]) {
  switch (action) {
    case "summarize":
      return "Summary";
    case "explain_simple":
      return "Simple explanation";
    case "extract_key_terms":
      return "Key terms";
    case "generate_quiz":
      return "Quiz";
    case "create_flashcards":
      return "Flashcards";
    default:
      return "AI result";
  }
}

export default function AIResultPanel({ result }: { result: AIResult | null }) {
  const empty = !result;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          AI result
        </h2>
        {!empty && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200 dark:bg-slate-900/60 dark:text-slate-200 dark:ring-slate-700">
            {actionLabel(result.action)}
          </span>
        )}
      </div>

      {empty ? (
        <div className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
          <p className="font-medium">No AI result yet.</p>
          <p className="mt-1">
            Select a note or file in this subject, then choose an action like{" "}
            <span className="font-semibold">Summarize</span> or{" "}
            <span className="font-semibold">Generate quiz</span> to see AI output here.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-4 text-sm text-slate-800 dark:text-slate-100">
          <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900 dark:bg-slate-900/40 dark:text-slate-50">
            {result.title}
          </div>

          {result.action === "summarize" || result.action === "explain_simple" ? (
            <div className="space-y-3">
              {result.paragraphs.map((p, i) => (
                <p key={i} className="leading-7 text-slate-700 dark:text-slate-200">
                  {p}
                </p>
              ))}
            </div>
          ) : result.action === "extract_key_terms" ? (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Key terms
              </h3>
              <ul className="mt-1 grid gap-2 sm:grid-cols-2">
                {result.terms.map((t) => (
                  <li
                    key={t}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ) : result.action === "generate_quiz" ? (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Practice questions
              </h3>
              <ol className="space-y-3 text-slate-700 dark:text-slate-200">
                {result.questions.map((q, idx) => (
                  <li key={idx} className="rounded-lg border border-slate-200 bg-white p-3 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900/40">
                    <div className="font-medium">{q.q}</div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Answer: {q.a}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ) : result.action === "create_flashcards" ? (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Flashcards
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {result.cards.map((c, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs shadow-sm dark:border-slate-700 dark:bg-slate-900/40"
                  >
                    <div className="font-semibold text-slate-900 dark:text-slate-50">
                      {c.front}
                    </div>
                    <div className="mt-1 text-slate-700 dark:text-slate-200">{c.back}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}

