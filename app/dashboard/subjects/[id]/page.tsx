"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

import SubjectChatPanel from "@/components/subjects/workspace/chat-panel";
import FileRow from "@/components/subjects/workspace/file-row";
import SectionTabs, {
  type WorkspaceTab,
} from "@/components/subjects/workspace/section-tabs";
import SubjectHeader from "@/components/subjects/workspace/subject-header";
import NoteEditorModal from "@/components/notes/note-editor-modal";
import { useNotes, type Note } from "@/components/notes/notes-store";
import { useSubjects } from "@/components/subjects/subjects-store";
import { useFiles } from "@/components/files/files-store";
import UploadFileModal from "@/components/files/upload-file-modal";
import AISelectedPanel, {
  type SelectedSource,
} from "@/components/subjects/workspace/ai-selected-panel";
import SubjectAIPanel from "@/components/subjects/workspace/subject-ai-panel";

function titleCaseFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function SubjectWorkspacePage() {
  const params = useParams<{ id: string }>();
  const subjectId = typeof params?.id === "string" ? params.id : "";

  const { getSubjectById, updateSubject } = useSubjects();
  const subject = subjectId ? getSubjectById(subjectId) : undefined;
  const { getNotesBySubjectId, createNote, updateNote, deleteNote } = useNotes();
  const { getFilesBySubjectId, addFile, deleteFile } = useFiles();
  const meta = subject
    ? { name: subject.name, description: subject.description, color: subject.color }
    : {
        name: titleCaseFromSlug(subjectId || "Subject"),
        description: "This subject wasn’t found in your workspace.",
        color: "indigo" as const,
      };

  const [tab, setTab] = useState<WorkspaceTab>("overview");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<"create" | "edit">("create");
  const [activeNote, setActiveNote] = useState<Note | undefined>(undefined);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<SelectedSource>(null);

  const notes = useMemo(
    () => (subjectId ? getNotesBySubjectId(subjectId) : []),
    [getNotesBySubjectId, subjectId]
  );

  const files = useMemo(
    () => (subjectId ? getFilesBySubjectId(subjectId) : []),
    [getFilesBySubjectId, subjectId]
  );

  const notesCount = subject?.notesCount ?? notes.length;
  const filesCount = subject?.filesCount ?? files.length;

  const showNotes = tab === "overview" || tab === "notes";
  const showFiles = tab === "overview" || tab === "files";
  const showRight = tab === "overview" || tab === "chat";

  const leftCol = useMemo(() => {
    return (
      <div className="space-y-6" id="notes">
        {showNotes ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Notes
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Keep ideas, examples, and study plans in one place.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditorMode("create");
                  setActiveNote(undefined);
                  setEditorOpen(true);
                }}
                className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                Add note
              </button>
            </div>

            {notes.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-300">
                No notes yet. Add your first note to start building a study
                trail for this subject.
              </div>
            ) : (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {notes.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => setSelectedSource({ kind: "note", note: n })}
                    className={[
                      "cursor-pointer rounded-2xl border bg-white p-4 shadow-sm dark:bg-slate-950",
                      selectedSource?.kind === "note" && selectedSource.note.id === n.id
                        ? "border-indigo-400 ring-2 ring-indigo-200 dark:border-indigo-500 dark:ring-indigo-500/40"
                        : "border-slate-200 dark:border-slate-800",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {n.title}
                        </div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Updated {new Date(n.updatedAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditorMode("edit");
                            setActiveNote(n);
                            setEditorOpen(true);
                          }}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
                        >
                          Open
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteNote(n.id)}
                          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:bg-rose-500/15"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {n.content ? n.content.slice(0, 140) + (n.content.length > 140 ? "…" : "") : "No content yet."}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {showFiles ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Files
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Upload lecture materials and reference documents.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setUploadOpen(true)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
              >
                Upload
              </button>
            </div>

            {files.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-300">
                No files yet. Upload a lecture or document to keep your study
                materials together.
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {files.map((f) => (
                  <FileRow
                    key={f.id}
                    file={{
                      id: f.id,
                      name: f.name,
                      typeLabel: f.type || "unknown/type",
                      sizeBytes: f.size,
                      uploadedAt: new Date(f.uploadedAt).toLocaleString(),
                    }}
                    onOpen={() => {
                      setSelectedSource({ kind: "file", file: f });
                    }}
                    onDelete={() => deleteFile(f.id)}
                  />
                ))}
              </div>
            )}
          </section>
        ) : null}
      </div>
    );
  }, [files, notes, showFiles, showNotes, deleteNote, deleteFile]);

  return (
    <>
      {subject ? (
        <SubjectHeader
          name={meta.name}
          description={meta.description}
          color={meta.color}
          notesCount={notesCount}
          filesCount={filesCount}
          onAddNote={() => {
            setEditorMode("create");
            setActiveNote(undefined);
            setEditorOpen(true);
          }}
          onUploadFile={() => setUploadOpen(true)}
        />
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Subject not found
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            This workspace doesn’t exist yet. Create a subject first, then open
            its workspace from the Subjects page.
          </p>
          <div className="mt-4">
            <a
              href="/dashboard/subjects"
              className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              Go to Subjects
            </a>
          </div>
        </section>
      )}

      <SectionTabs value={tab} onChange={setTab} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">{leftCol}</div>

        {showRight ? (
          <div className="space-y-6">
            <SubjectAIPanel subjectName={meta.name} selected={selectedSource} />
            <SubjectChatPanel subjectName={meta.name} />
          </div>
        ) : null}
      </div>

      <NoteEditorModal
        open={editorOpen}
        mode={editorMode}
        subjectName={meta.name}
        note={activeNote}
        onClose={() => setEditorOpen(false)}
        onSave={({ title, content }) => {
          if (!subject) return;
          if (editorMode === "create") {
            createNote({ subjectId: subject.id, title, content });
          } else if (activeNote) {
            updateNote(activeNote.id, { title, content });
          }
          setEditorOpen(false);
        }}
        onDelete={
          editorMode === "edit" && activeNote
            ? () => {
                deleteNote(activeNote.id);
                setEditorOpen(false);
              }
            : undefined
        }
      />

      <UploadFileModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSelectFile={(file) => {
          if (!subject) return;
          addFile({
            subjectId: subject.id,
            name: file.name,
            type: file.type || "unknown/type",
            size: file.size,
          });
          // counts are also synced in FilesProvider, but keep immediate UI snappy
          updateSubject(subject.id, { filesCount: (subject.filesCount ?? 0) + 1 });
        }}
      />
    </>
  );
}

