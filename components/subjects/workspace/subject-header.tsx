"use client";

import type { SubjectColor } from "@/components/subjects/add-subject-modal";

function ColorDot({ color }: { color: SubjectColor }) {
  const cls =
    color === "indigo"
      ? "bg-indigo-500"
      : color === "emerald"
        ? "bg-emerald-500"
        : color === "amber"
          ? "bg-amber-500"
          : "bg-rose-500";
  return <span className={`h-2.5 w-2.5 rounded-full ${cls}`} />;
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900/30">
      <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
        {label}
      </div>
      <div className="mt-0.5 text-base font-semibold text-slate-900 dark:text-slate-100">
        {value}
      </div>
    </div>
  );
}

export default function SubjectHeader({
  name,
  description,
  color,
  notesCount,
  filesCount,
  onAddNote,
  onUploadFile,
}: {
  name: string;
  description: string;
  color: SubjectColor;
  notesCount: number;
  filesCount: number;
  onAddNote: () => void;
  onUploadFile: () => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <ColorDot color={color} />
            <h1 className="truncate text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {name}
            </h1>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            {description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Stat label="Notes" value={notesCount} />
            <Stat label="Files" value={filesCount} />
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onAddNote}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
          >
            Add Note
          </button>
          <button
            type="button"
            onClick={onUploadFile}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
          >
            Upload File
          </button>
        </div>
      </div>
    </section>
  );
}

