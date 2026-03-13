"use client";

import { motion, useReducedMotion } from "framer-motion";

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
  const reducedMotion = useReducedMotion();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const active = t.key === value;
          return (
            <motion.button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              whileHover={reducedMotion ? undefined : { y: -1, scale: 1.01 }}
              whileTap={reducedMotion ? undefined : { scale: 0.98 }}
              className={[
                "relative rounded-xl px-3 py-2 text-sm font-semibold transition",
                active
                  ? "text-indigo-700 dark:text-indigo-200"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900",
              ].join(" ")}
            >
              {active ? (
                <motion.span
                  layoutId="workspace-tab-pill"
                  className="absolute inset-0 rounded-xl bg-indigo-50 ring-1 ring-indigo-100 dark:bg-indigo-500/10 dark:ring-indigo-500/20"
                  transition={
                    reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }
                  }
                />
              ) : null}
              <span className="relative z-10">{t.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

