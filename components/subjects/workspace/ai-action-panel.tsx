import type { AIActionType } from "@/lib/ai/types";

const actions: { key: AIActionType; label: string; tone: "indigo" | "emerald" | "amber" | "rose" | "slate" }[] =
  [
    { key: "summarize", label: "Summarize", tone: "indigo" },
    { key: "explain_simple", label: "Explain simply", tone: "emerald" },
    { key: "extract_key_terms", label: "Extract key terms", tone: "amber" },
    { key: "generate_quiz", label: "Generate quiz", tone: "rose" },
    { key: "create_flashcards", label: "Create flashcards", tone: "slate" },
  ];

export default function AIActionPanel({
  disabled,
  onRun,
  onRunDemo,
  hasError,
  quotaError,
}: {
  disabled?: boolean;
  onRun: (action: AIActionType) => void;
  onRunDemo: (action: AIActionType) => void;
  hasError?: boolean;
  quotaError?: boolean;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            AI actions
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Run a quick action on your notes or a file.
          </p>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/30">
            Real AI
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            + demo mode fallback
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {actions.map((a) => {
          const cls =
            a.tone === "indigo"
              ? "bg-indigo-600 hover:bg-indigo-500"
              : a.tone === "emerald"
                ? "bg-emerald-600 hover:bg-emerald-500"
                : a.tone === "amber"
                  ? "bg-amber-600 hover:bg-amber-500"
                  : a.tone === "rose"
                    ? "bg-rose-600 hover:bg-rose-500"
                    : "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100";

          const base =
            a.tone === "slate"
              ? "w-full rounded-xl px-4 py-2.5 text-left text-sm font-semibold shadow-sm transition"
              : "w-full rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-white shadow-sm transition";

          return (
            <div key={a.key} className="flex items-center gap-2">
              <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && onRun(a.key)}
                className={`${base} ${cls} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
              >
                {a.label}
              </button>
              {hasError && (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => !disabled && onRunDemo(a.key)}
                  className={`inline-flex items-center rounded-xl border border-dashed px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-900/60 ${
                    disabled ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  Use demo AI result
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-300">
        {quotaError ? (
          <>
            <p className="font-medium text-slate-800 dark:text-slate-100">
              Your OpenAI account has no available quota.
            </p>
            <p className="mt-1">
              Update your billing on OpenAI to unlock real responses. Until then, you can
              still explore the interface using demo AI results.
            </p>
          </>
        ) : (
          <>
            <p className="font-medium text-slate-800 dark:text-slate-100">
              Real AI + safe demo mode
            </p>
            <p className="mt-1">
              When the real API is unavailable, you can switch to demo AI results to keep
              exploring the workspace without breaking your flow.
            </p>
          </>
        )}
      </div>
    </section>
  );
}

