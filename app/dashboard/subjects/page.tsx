"use client";

import { useMemo, useState } from "react";

import AddSubjectModal, {
  type NewSubjectInput,
} from "@/components/subjects/add-subject-modal";
import SubjectCard, { type SubjectVM } from "@/components/subjects/subject-card";
import { useSubjects } from "@/components/subjects/subjects-store";

export default function SubjectsPage() {
  const { subjects, createSubject } = useSubjects();
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const viewModels = useMemo<SubjectVM[]>(
    () =>
      subjects.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        color: s.color,
        notes: s.notesCount,
        files: s.filesCount,
      })),
    [subjects]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return viewModels;
    return viewModels.filter((s) => s.name.toLowerCase().includes(q));
  }, [viewModels, query]);

  function onCreate(input: NewSubjectInput) {
    createSubject({
      name: input.name,
      description: input.description || "No description.",
      color: input.color,
    });
  }

  return (
    <>
      {/* Top action bar */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Search
            </div>
            <div className="mt-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search subjects…"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-600"
              />
            </div>
          </div>

          <div className="sm:pt-5">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 sm:w-auto"
            >
              Add Subject
            </button>
          </div>
        </div>
      </section>

      {/* Subjects grid */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Your subjects
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {filtered.length} subject{filtered.length === 1 ? "" : "s"} shown
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((s) => (
            <SubjectCard key={s.id} subject={s} />
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-300">
            No subjects match your search. Try a different term or create a new
            subject.
          </div>
        ) : null}
      </section>

      <AddSubjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={onCreate}
      />
    </>
  );
}

