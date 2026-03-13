"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  modalBackdropVariants,
  modalPanelVariants,
  MotionButton,
} from "@/components/motion/motion-primitives";

export type SubjectColor = "indigo" | "emerald" | "amber" | "rose";

export type NewSubjectInput = {
  name: string;
  description: string;
  color: SubjectColor;
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
      {children}
    </div>
  );
}

const colors: { key: SubjectColor; label: string; dot: string }[] = [
  { key: "indigo", label: "Indigo", dot: "bg-indigo-500" },
  { key: "emerald", label: "Emerald", dot: "bg-emerald-500" },
  { key: "amber", label: "Amber", dot: "bg-amber-500" },
  { key: "rose", label: "Rose", dot: "bg-rose-500" },
];

export default function AddSubjectModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (input: NewSubjectInput) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState<SubjectColor>("indigo");

  const canSave = useMemo(() => name.trim().length > 0, [name]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setName("");
    setDescription("");
    setColor("indigo");
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Add Subject"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
      <motion.div
        variants={modalPanelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 dark:border-slate-800">
          <div>
            <div className="text-sm font-semibold">Add Subject</div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Create a workspace for a class and its study materials.
            </div>
          </div>
          <MotionButton
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
            aria-label="Close"
          >
            ✕
          </MotionButton>
        </div>

        <div className="space-y-4 p-5">
          <div className="space-y-2">
            <FieldLabel>Subject name</FieldLabel>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Calculus"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-600"
            />
          </div>

          <div className="space-y-2">
            <FieldLabel>Description</FieldLabel>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional: what are you studying here?"
              rows={4}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-600"
            />
          </div>

          <div className="space-y-2">
            <FieldLabel>Color</FieldLabel>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {colors.map((c) => {
                const active = c.key === color;
                return (
                  <MotionButton
                    key={c.key}
                    type="button"
                    onClick={() => setColor(c.key)}
                    className={[
                      "flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition",
                      active
                        ? "border-indigo-200 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200 dark:ring-indigo-500/20"
                        : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900",
                    ].join(" ")}
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${c.dot}`} />
                    <span>{c.label}</span>
                  </MotionButton>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 p-5 dark:border-slate-800">
          <MotionButton
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
          >
            Cancel
          </MotionButton>
          <MotionButton
            type="button"
            disabled={!canSave}
            onClick={() => {
              if (!canSave) return;
              onCreate({ name: name.trim(), description: description.trim(), color });
              onClose();
            }}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add Subject
          </MotionButton>
        </div>
      </motion.div>
    </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

