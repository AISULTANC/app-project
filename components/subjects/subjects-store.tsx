"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type SubjectColor = "indigo" | "emerald" | "amber" | "rose";

export type Subject = {
  id: string;
  name: string;
  description: string;
  color: SubjectColor;
  notesCount: number;
  filesCount: number;
};

type SubjectsContextValue = {
  subjects: Subject[];
  createSubject: (input: Omit<Subject, "id" | "notesCount" | "filesCount">) => Subject;
  updateSubject: (id: string, patch: Partial<Omit<Subject, "id">>) => void;
  getSubjectById: (id: string) => Subject | undefined;
};

const SubjectsContext = createContext<SubjectsContextValue | null>(null);

const STORAGE_KEY = "ai_workspace_subjects_v1";

const seedSubjects: Subject[] = [
  {
    id: "calculus",
    name: "Calculus",
    description: "Limits, derivatives, integrals, and practice problems.",
    color: "indigo",
    notesCount: 6,
    filesCount: 3,
  },
  {
    id: "history",
    name: "History",
    description: "Timelines, causes/effects, primary sources, essay prep.",
    color: "emerald",
    notesCount: 4,
    filesCount: 2,
  },
  {
    id: "english",
    name: "English",
    description: "Reading notes, themes, thesis writing, and quotes.",
    color: "amber",
    notesCount: 8,
    filesCount: 5,
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    description: "Network basics, threat models, and security fundamentals.",
    color: "rose",
    notesCount: 3,
    filesCount: 1,
  },
];

function safeRead(): Subject[] | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed as Subject[];
  } catch {
    return null;
  }
}

function safeWrite(subjects: Subject[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
  } catch {
    // ignore
  }
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function SubjectsProvider({ children }: { children: React.ReactNode }) {
  const [subjects, setSubjects] = useState<Subject[]>(seedSubjects);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const existing = safeRead();
    if (existing && existing.length > 0) {
      setSubjects(existing);
    } else {
      safeWrite(seedSubjects);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    safeWrite(subjects);
  }, [subjects, hydrated]);

  const value = useMemo<SubjectsContextValue>(() => {
    return {
      subjects,
      createSubject: (input) => {
        const base = slugify(input.name) || "subject";
        const existing = new Set(subjects.map((s) => s.id));
        let id = base;
        let n = 2;
        while (existing.has(id)) id = `${base}-${n++}`;

        const next: Subject = {
          id,
          name: input.name,
          description: input.description,
          color: input.color,
          notesCount: 0,
          filesCount: 0,
        };
        setSubjects((prev) => [next, ...prev]);
        return next;
      },
      updateSubject: (id, patch) => {
        setSubjects((prev) =>
          prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
        );
      },
      getSubjectById: (id) => subjects.find((s) => s.id === id),
    };
  }, [subjects]);

  return <SubjectsContext.Provider value={value}>{children}</SubjectsContext.Provider>;
}

export function useSubjects() {
  const ctx = useContext(SubjectsContext);
  if (!ctx) throw new Error("useSubjects must be used within SubjectsProvider");
  return ctx;
}

