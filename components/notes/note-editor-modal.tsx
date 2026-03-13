"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { MotionButton, modalBackdropVariants, modalPanelVariants } from "@/components/motion/motion-primitives";
import type { Note } from "@/components/notes/notes-store";

export default function NoteEditorModal({
  open,
  mode,
  subjectName,
  note,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  mode: "create" | "edit";
  subjectName: string;
  note?: Note;
  onClose: () => void;
  onSave: (input: { title: string; content: string }) => void;
  onDelete?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const canSave = useMemo(() => title.trim().length > 0, [title]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (canSave) onSave({ title: title.trim(), content: content });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, onSave, canSave, title, content]);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [open, mode, note]);

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
          aria-label="Note editor"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
      <motion.div
        variants={modalPanelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 dark:border-slate-800">
          <div className="min-w-0">
            <div className="text-sm font-semibold">
              {mode === "create" ? "New note" : "Edit note"}
            </div>
            <div className="mt-1 truncate text-sm text-slate-600 dark:text-slate-300">
              {subjectName}
              <span className="mx-2 text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs">Ctrl/⌘ + S to save</span>
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
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Title
            </div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chain Rule examples"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-600"
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Content
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note…"
              rows={12}
              className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-600"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-200 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {mode === "edit" && onDelete ? (
              <MotionButton
                type="button"
                onClick={onDelete}
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:bg-rose-500/15"
              >
                Delete
              </MotionButton>
            ) : null}
          </div>
          <div className="flex gap-2">
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
              onClick={() => onSave({ title: title.trim(), content: content })}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save
            </MotionButton>
          </div>
        </div>
      </motion.div>
    </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

