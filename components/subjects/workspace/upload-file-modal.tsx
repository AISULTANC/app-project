"use client";

import { useEffect, useMemo, useState } from "react";

export type NewFileInput = { name: string; type: "PDF" | "DOCX" | "TXT" };

export default function UploadFileModal({
  open,
  onClose,
  onUpload,
}: {
  open: boolean;
  onClose: () => void;
  onUpload: (input: NewFileInput) => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<NewFileInput["type"]>("PDF");

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
    setType("PDF");
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Upload File"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 dark:border-slate-800">
          <div>
            <div className="text-sm font-semibold">Upload File</div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Add a lecture file (PDF, DOCX, or TXT) to this subject.
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              File name
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Lecture 03 - Derivatives.pdf"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-600"
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Type
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["PDF", "DOCX", "TXT"] as const).map((t) => {
                const active = t === type;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={[
                      "rounded-xl border px-3 py-2 text-sm font-semibold transition",
                      active
                        ? "border-indigo-200 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200 dark:ring-indigo-500/20"
                        : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900",
                    ].join(" ")}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-300">
            Mock upload UI: later you’ll select a real file and we’ll store it in
            your workspace.
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 p-5 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={() => {
              if (!canSave) return;
              onUpload({ name: name.trim(), type });
              onClose();
            }}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}

