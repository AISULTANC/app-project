"use client";

import Link from "next/link";

import { useSubjects } from "@/components/subjects/subjects-store";

type RecentNote = {
  title: string;
  subject: string;
  updatedAt: string;
  preview: string;
};

type RecentFile = {
  filename: string;
  subject: string;
  type: "PDF" | "DOCX" | "TXT";
  addedAt: string;
};

const recentNotes: RecentNote[] = [
  {
    title: "Derivatives — intuition",
    subject: "Calculus",
    updatedAt: "Today",
    preview: "Derivative as the slope at a point; instantaneous rate of change…",
  },
  {
    title: "Causes of WWI",
    subject: "History",
    updatedAt: "Yesterday",
    preview: "Alliances, militarism, imperialism, nationalism — how they intersected…",
  },
  {
    title: "Thesis statements",
    subject: "English",
    updatedAt: "2 days ago",
    preview: "A thesis is a claim that your essay proves; it should be specific and arguable…",
  },
];

const recentFiles: RecentFile[] = [
  { filename: "Lecture 05 - Limits.pdf", subject: "Calculus", type: "PDF", addedAt: "Today" },
  { filename: "Primary Sources.docx", subject: "History", type: "DOCX", addedAt: "2 days ago" },
  { filename: "Reading Notes.txt", subject: "English", type: "TXT", addedAt: "3 days ago" },
];

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
      {children}
    </span>
  );
}

function ColorDot({ color }: { color: "indigo" | "emerald" | "amber" | "rose" }) {
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

export default function DashboardPage() {
  const { subjects } = useSubjects();

  return (
    <>
      {/* Subject cards */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Your subjects
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Jump back into a class workspace.
                </p>
              </div>
              <Link
                href="/dashboard/subjects"
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                Manage subjects
              </Link>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {subjects.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ColorDot color={s.color} />
                      <div className="text-sm font-semibold">{s.name}</div>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Saved
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge>{s.notesCount} notes</Badge>
                    <Badge>{s.filesCount} files</Badge>
                  </div>
                  <div className="mt-4">
                    <Link
                      href={`/dashboard/subjects/${s.id}`}
                      className="block w-full rounded-xl bg-indigo-50 px-3 py-2 text-center text-sm font-semibold text-indigo-700 ring-1 ring-indigo-100 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-200 dark:ring-indigo-500/20 dark:hover:bg-indigo-500/15"
                    >
                      Open workspace
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent notes */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-6 lg:col-span-2">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Recent notes
                  </h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Continue where you left off.
                  </p>
                </div>
                <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900">
                  View all
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {recentNotes.map((n) => (
                  <div
                    key={n.title}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="text-sm font-semibold">{n.title}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Badge>{n.subject}</Badge>
                          <span>Updated {n.updatedAt}</span>
                        </div>
                      </div>
                      <button className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                        Open
                      </button>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {n.preview}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick AI actions */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-6">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Quick AI actions
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Run an action on your latest material.
              </p>

              <div className="mt-4 space-y-2">
                {[
                  { label: "Summarize", tone: "indigo" as const },
                  { label: "Explain simply", tone: "emerald" as const },
                  { label: "Extract key terms", tone: "amber" as const },
                  { label: "Generate quiz", tone: "rose" as const },
                ].map((a) => {
                  const cls =
                    a.tone === "indigo"
                      ? "bg-indigo-600 hover:bg-indigo-500"
                      : a.tone === "emerald"
                        ? "bg-emerald-600 hover:bg-emerald-500"
                        : a.tone === "amber"
                          ? "bg-amber-600 hover:bg-amber-500"
                          : "bg-rose-600 hover:bg-rose-500";

                  return (
                    <button
                      key={a.label}
                      className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-white shadow-sm transition ${cls}`}
                    >
                      {a.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-300">
                Mock UI only. Later, these buttons can run AI on a selected file
                or note inside a subject.
              </div>
            </section>
          </div>

          {/* Recent files */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Recent files
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Lecture materials you’ve uploaded recently.
                </p>
              </div>
              <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900">
                Upload
              </button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {recentFiles.map((f) => (
                <div
                  key={f.filename}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {f.filename}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Badge>{f.subject}</Badge>
                        <Badge>{f.type}</Badge>
                      </div>
                    </div>
                    <div className="rounded-lg bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-slate-900/30 dark:text-slate-200 dark:ring-slate-800">
                      {f.addedAt}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-200 dark:ring-indigo-500/20 dark:hover:bg-indigo-500/15">
                      Summarize
                    </button>
                    <button className="flex-1 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                      Open
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
    </>
  );
}

