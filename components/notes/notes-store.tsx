"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useSubjects } from "@/components/subjects/subjects-store";

export type Note = {
  id: string;
  subjectId: string;
  title: string;
  content: string;
  updatedAt: string; // ISO
};

type NotesContextValue = {
  notes: Note[];
  createNote: (input: Omit<Note, "id" | "updatedAt">) => Note;
  updateNote: (id: string, patch: Partial<Omit<Note, "id" | "subjectId">>) => void;
  deleteNote: (id: string) => void;
  getNoteById: (id: string) => Note | undefined;
  getNotesBySubjectId: (subjectId: string) => Note[];
};

const NotesContext = createContext<NotesContextValue | null>(null);

const STORAGE_KEY = "ai_workspace_notes_v1";

function safeRead(): Note[] | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed as Note[];
  } catch {
    return null;
  }
}

function safeWrite(notes: Note[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // ignore
  }
}

function nowIso() {
  return new Date().toISOString();
}

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const { subjects, updateSubject } = useSubjects();
  const [notes, setNotes] = useState<Note[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const existing = safeRead();
    if (existing) setNotes(existing);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    safeWrite(notes);
  }, [notes, hydrated]);

  // Keep subject notesCount in sync with persisted notes
  useEffect(() => {
    if (!hydrated) return;
    const counts = new Map<string, number>();
    for (const n of notes) counts.set(n.subjectId, (counts.get(n.subjectId) ?? 0) + 1);
    for (const s of subjects) {
      const next = counts.get(s.id) ?? 0;
      if (s.notesCount !== next) updateSubject(s.id, { notesCount: next });
    }
  }, [hydrated, notes, subjects, updateSubject]);

  const value = useMemo<NotesContextValue>(() => {
    return {
      notes,
      createNote: (input) => {
        const next: Note = {
          id: `note_${Date.now()}_${Math.random().toString(16).slice(2)}`,
          subjectId: input.subjectId,
          title: input.title,
          content: input.content,
          updatedAt: nowIso(),
        };
        setNotes((prev) => [next, ...prev]);
        return next;
      },
      updateNote: (id, patch) => {
        setNotes((prev) =>
          prev.map((n) =>
            n.id === id
              ? {
                  ...n,
                  ...patch,
                  updatedAt: nowIso(),
                }
              : n
          )
        );
      },
      deleteNote: (id) => setNotes((prev) => prev.filter((n) => n.id !== id)),
      getNoteById: (id) => notes.find((n) => n.id === id),
      getNotesBySubjectId: (subjectId) =>
        notes
          .filter((n) => n.subjectId === subjectId)
          .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)),
    };
  }, [notes]);

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used within NotesProvider");
  return ctx;
}

