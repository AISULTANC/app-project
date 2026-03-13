"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MotionButton,
  modalBackdropVariants,
  modalPanelVariants,
} from "@/components/motion/motion-primitives";

export default function UploadFileModal({
  open,
  onClose,
  onSelectFile,
}: {
  open: boolean;
  onClose: () => void;
  onSelectFile: (file: File, textContent?: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selected, setSelected] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string | undefined>(undefined);

  const canUpload = useMemo(() => !!selected, [selected]);

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
    setSelected(null);
    setExtractedText(undefined);
    setTimeout(() => inputRef.current?.focus(), 0);
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
          aria-label="Upload file"
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
            <div className="text-sm font-semibold">Upload File</div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Choose a file — we’ll store metadata only (frontend MVP).
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
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/30">
            <input
              ref={inputRef}
              type="file"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setSelected(f);
                setExtractedText(undefined);
                if (f && (f.type === "text/plain" || f.name.endsWith(".txt") || f.name.endsWith(".md") || f.name.endsWith(".csv"))) {
                  f.text().then((t) => setExtractedText(t)).catch(() => {});
                }
              }}
              className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-900 hover:file:bg-slate-100 dark:text-slate-200 dark:file:bg-slate-950 dark:file:text-slate-100 dark:hover:file:bg-slate-900"
            />
            <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">
              Supported types later: PDF, DOCX, TXT. For now we accept any file
              and record name/type/size.
            </div>
          </div>

          {selected ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                Selected
              </div>
              <div className="mt-2 space-y-1 text-slate-600 dark:text-slate-300">
                <div className="truncate">{selected.name}</div>
                <div className="text-xs">
                  {selected.type || "unknown/type"} • {selected.size} bytes
                </div>
              </div>
            </div>
          ) : null}
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
            disabled={!canUpload}
            onClick={() => {
              if (!selected) return;
              onSelectFile(selected, extractedText);
              onClose();
            }}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            Upload
          </MotionButton>
        </div>
      </motion.div>
    </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

