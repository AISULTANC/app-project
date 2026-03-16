"use client";

import { useMemo, useState } from "react";

import NoteEditorModal from "@/components/notes/note-editor-modal";
import { useNotes, type Note } from "@/components/notes/notes-store";
import { useSubjects } from "@/components/subjects/subjects-store";
import NoteAIActions from "@/components/ai/note-ai-actions";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-white">
      {children}
    </span>
  );
}

export default function NotesPage() {
  const { notes, createNote, updateNote, deleteNote } = useNotes();
  const { getSubjectById, subjects } = useSubjects();
  const [query, setQuery] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [activeNote, setActiveNote] = useState<Note | undefined>(undefined);
  const [aiNote, setAiNote] = useState<Note | null>(null);

  const subjectNameFor = (subjectId: string) =>
    getSubjectById(subjectId)?.name ?? subjectId;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = [...notes].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
    if (!q) return rows;
    return rows.filter((n) => n.title.toLowerCase().includes(q));
  }, [notes, query]);

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#1f1f1f] dark:bg-black md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              All notes
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-[#a1a1a1]">
              Notes across all subjects in your workspace.
            </p>
          </div>
          <div className="w-full sm:w-[360px]">
            <div className="text-xs font-semibold text-slate-700 dark:text-white">
              Search by title
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes…"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-[#1f1f1f] dark:bg-black dark:text-white dark:focus:border-slate-600"
            />
          </div>
        </div>

        {subjects.length === 0 ? null : null}

        {filtered.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 dark:border-[#1f1f1f] dark:bg-slate-900/30 dark:text-[#a1a1a1]">
            No notes yet. Open a subject workspace and add your first note.
          </div>
        ) : (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {filtered.map((n) => (
              <div
                key={n.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#1f1f1f] dark:bg-black"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {n.title}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Badge>{subjectNameFor(n.subjectId)}</Badge>
                      <span>Updated {new Date(n.updatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAiNote(aiNote?.id === n.id ? null : n)}
                      className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                        aiNote?.id === n.id
                          ? "border-indigo-400 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-200"
                          : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-[#1f1f1f] dark:bg-black dark:text-white dark:hover:bg-slate-900"
                      }`}
                    >
                      AI
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveNote(n);
                        setEditorOpen(true);
                      }}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50 dark:border-[#1f1f1f] dark:bg-black dark:text-white dark:hover:bg-slate-900"
                    >
                      Open
                    </button>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-[#a1a1a1]">
                  {n.content
                    ? n.content.slice(0, 140) + (n.content.length > 140 ? "…" : "")
                    : "No content yet."}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* AI Actions for selected note */}
      {aiNote && (
        <NoteAIActions
          noteTitle={aiNote.title}
          noteContent={aiNote.content}
          subjectName={subjectNameFor(aiNote.subjectId)}
          onSaveAsNote={(title, content) => {
            createNote({ subjectId: aiNote.subjectId, title, content });
          }}
        />
      )}

      <NoteEditorModal
        open={editorOpen}
        mode="edit"
        subjectName={activeNote ? subjectNameFor(activeNote.subjectId) : "Subject"}
        note={activeNote}
        onClose={() => setEditorOpen(false)}
        onSave={({ title, content }) => {
          if (!activeNote) return;
          updateNote(activeNote.id, { title, content });
          setEditorOpen(false);
        }}
        onDelete={
          activeNote
            ? () => {
                deleteNote(activeNote.id);
                setEditorOpen(false);
              }
            : undefined
        }
      />
    </>
  );
}

