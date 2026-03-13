"use client";

import { useMemo, useState } from "react";

import { useFiles, type WorkspaceFile } from "@/components/files/files-store";
import { useNotes } from "@/components/notes/notes-store";
import FileRow, { type FileVM } from "@/components/subjects/workspace/file-row";
import { useSubjects } from "@/components/subjects/subjects-store";
import FileAIActions from "@/components/ai/file-ai-actions";

export default function FilesPage() {
  const { files, deleteFile } = useFiles();
  const { createNote } = useNotes();
  const { getSubjectById } = useSubjects();
  const [query, setQuery] = useState("");
  const [aiFile, setAiFile] = useState<WorkspaceFile | null>(null);

  const subjectNameFor = (subjectId: string) =>
    getSubjectById(subjectId)?.name ?? subjectId;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = [...files].sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1));
    if (!q) return rows;
    return rows.filter((f) => f.name.toLowerCase().includes(q));
  }, [files, query]);

  const viewModels = useMemo<FileVM[]>(
    () =>
      filtered.map((f) => ({
        id: f.id,
        name: f.name,
        typeLabel: f.type || "unknown/type",
        sizeBytes: f.size,
        uploadedAt: new Date(f.uploadedAt).toLocaleString(),
        subjectName: getSubjectById(f.subjectId)?.name ?? f.subjectId,
      })),
    [filtered, getSubjectById]
  );

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              All files
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Files across all subjects. Click &quot;AI&quot; to run AI actions on a file.
            </p>
          </div>
          <div className="w-full sm:w-[360px]">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Search by file name
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search files…"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-600"
            />
          </div>
        </div>

        {viewModels.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-300">
            No files yet. Open a subject workspace and upload a file to start
            organizing your lecture materials.
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {filtered.map((f) => {
              const vm: FileVM = {
                id: f.id,
                name: f.name,
                typeLabel: f.type || "unknown/type",
                sizeBytes: f.size,
                uploadedAt: new Date(f.uploadedAt).toLocaleString(),
                subjectName: subjectNameFor(f.subjectId),
              };
              return (
                <div key={f.id}>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <FileRow
                        file={vm}
                        onOpen={() => setAiFile(aiFile?.id === f.id ? null : f)}
                        onDelete={() => deleteFile(f.id)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setAiFile(aiFile?.id === f.id ? null : f)}
                      className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                        aiFile?.id === f.id
                          ? "border-indigo-400 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-200"
                          : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
                      }`}
                    >
                      AI
                    </button>
                  </div>
                  {aiFile?.id === f.id && (
                    <div className="mt-3">
                      <FileAIActions
                        fileName={f.name}
                        fileContent={f.textContent || ""}
                        subjectName={subjectNameFor(f.subjectId)}
                        onSaveAsNote={(title, content) => {
                          createNote({ subjectId: f.subjectId, title, content });
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

