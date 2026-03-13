"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useSubjects } from "@/components/subjects/subjects-store";

export type WorkspaceFile = {
  id: string;
  subjectId: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string; // ISO
  textContent?: string; // extracted text for AI actions (txt files, future: PDF/DOCX)
};

type FilesContextValue = {
  files: WorkspaceFile[];
  addFile: (input: Omit<WorkspaceFile, "id" | "uploadedAt">) => WorkspaceFile;
  deleteFile: (id: string) => void;
  getFilesBySubjectId: (subjectId: string) => WorkspaceFile[];
};

const FilesContext = createContext<FilesContextValue | null>(null);

const STORAGE_KEY = "ai_workspace_files_v1";

function safeRead(): WorkspaceFile[] | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed as WorkspaceFile[];
  } catch {
    return null;
  }
}

function safeWrite(files: WorkspaceFile[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  } catch {
    // ignore
  }
}

function nowIso() {
  return new Date().toISOString();
}

export function FilesProvider({ children }: { children: React.ReactNode }) {
  const { subjects, updateSubject } = useSubjects();
  const [files, setFiles] = useState<WorkspaceFile[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const existing = safeRead();
    if (existing) setFiles(existing);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    safeWrite(files);
  }, [files, hydrated]);

  // Keep subject filesCount in sync with persisted files
  useEffect(() => {
    if (!hydrated) return;
    const counts = new Map<string, number>();
    for (const f of files) counts.set(f.subjectId, (counts.get(f.subjectId) ?? 0) + 1);
    for (const s of subjects) {
      const next = counts.get(s.id) ?? 0;
      if (s.filesCount !== next) updateSubject(s.id, { filesCount: next });
    }
  }, [hydrated, files, subjects, updateSubject]);

  const value = useMemo<FilesContextValue>(() => {
    return {
      files,
      addFile: (input) => {
        const next: WorkspaceFile = {
          id: `file_${Date.now()}_${Math.random().toString(16).slice(2)}`,
          subjectId: input.subjectId,
          name: input.name,
          type: input.type,
          size: input.size,
          uploadedAt: nowIso(),
        };
        setFiles((prev) => [next, ...prev]);
        return next;
      },
      deleteFile: (id) => setFiles((prev) => prev.filter((f) => f.id !== id)),
      getFilesBySubjectId: (subjectId) =>
        files
          .filter((f) => f.subjectId === subjectId)
          .sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1)),
    };
  }, [files]);

  return <FilesContext.Provider value={value}>{children}</FilesContext.Provider>;
}

export function useFiles() {
  const ctx = useContext(FilesContext);
  if (!ctx) throw new Error("useFiles must be used within FilesProvider");
  return ctx;
}

