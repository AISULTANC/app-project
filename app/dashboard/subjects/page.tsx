"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import AddSubjectModal, {
  type NewSubjectInput,
} from "@/components/subjects/add-subject-modal";
import {
  FadeInSection,
  MotionButton,
  StaggerItem,
  StaggerList,
} from "@/components/motion/motion-primitives";
import SubjectCard, { type SubjectVM } from "@/components/subjects/subject-card";
import { useSubjects } from "@/components/subjects/subjects-store";

export default function SubjectsPage() {
  const reducedMotion = useReducedMotion();
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
      <FadeInSection className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#1f1f1f] dark:bg-black md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <div className="text-xs font-semibold text-slate-700 dark:text-white">
              Search
            </div>
            <div className="mt-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search subjects…"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-[#1f1f1f] dark:bg-black dark:text-white dark:focus:border-[#3b82f6]"
              />
            </div>
          </div>

          <div className="sm:pt-5">
            <MotionButton
              type="button"
              onClick={() => setModalOpen(true)}
              className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 sm:w-auto"
            >
              Add Subject
            </MotionButton>
          </div>
        </div>
      </FadeInSection>

      {/* Subjects grid */}
      <FadeInSection
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#1f1f1f] dark:bg-black md:p-6"
        delay={0.05}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Your subjects
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-[#a1a1a1]">
              {filtered.length} subject{filtered.length === 1 ? "" : "s"} shown
            </p>
          </div>
        </div>

        <StaggerList className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((s) => (
            <StaggerItem key={s.id}>
              <SubjectCard subject={s} />
            </StaggerItem>
          ))}
        </StaggerList>

        {filtered.length === 0 ? (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 6 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 dark:border-[#1f1f1f] dark:bg-[#0a0a0a] dark:text-[#a1a1a1]"
          >
            No subjects match your search. Try a different term or create a new
            subject.
          </motion.div>
        ) : null}
      </FadeInSection>

      <AddSubjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={onCreate}
      />
    </>
  );
}

