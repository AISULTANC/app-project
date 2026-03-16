"use client";

import { useEffect, useMemo, useState } from "react";

export type NewNoteInput = { title: string; content: string };

export default function AddNoteModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (input: NewNoteInput) => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const canSave = useMemo(() => title.trim().length > 0, [title]);

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
    setTitle("");
    setContent("");
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Add Note"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-[#1f1f1f] dark:bg-[#111111]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 dark:border-[#1f1f1f]">
          <div>
            <div className="text-sm font-semibold">Add Note</div>
            <div className="mt-1 text-sm text-slate-600 dark:text-[#a1a1a1]">
              Capture key points while they're fresh.
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-white dark:hover:bg-[#0a0a0a]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-700 dark:text-white">
              Title
            </div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chain Rule examples"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-[#1f1f1f] dark:bg-[#0a0a0a] dark:text-white dark:focus:border-[#3b82f6]"
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-700 dark:text-white">
              Content
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write a quick summary or paste key points…"
              rows={6}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-[#1f1f1f] dark:bg-[#0a0a0a] dark:text-white dark:focus:border-[#3b82f6]"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 p-5 dark:border-[#1f1f1f]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-[#1f1f1f] dark:bg-[#111111] dark:text-white dark:hover:bg-[#0a0a0a]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={() => {
              if (!canSave) return;
              onCreate({ title: title.trim(), content: content.trim() });
              onClose();
            }}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add Note
          </button>
        </div>
      </div>
    </div>
  );
}

