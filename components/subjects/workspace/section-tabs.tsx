"use client";

export type WorkspaceTab = "overview" | "notes" | "files" | "chat";

const tabs: { key: WorkspaceTab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "notes", label: "Notes" },
  { key: "files", label: "Files" },
  { key: "chat", label: "AI Chat" },
];

export default function SectionTabs({
  value,
  onChange,
}: {
  value: WorkspaceTab;
  onChange: (t: WorkspaceTab) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const active = t.key === value;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              className={[
                "rounded-xl px-3 py-2 text-sm font-semibold transition",
                active
                  ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-200 dark:ring-indigo-500/20"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900",
              ].join(" ")}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

