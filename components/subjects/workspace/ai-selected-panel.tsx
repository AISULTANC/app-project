import type { Note } from "@/components/notes/notes-store";
import type { WorkspaceFile } from "@/components/files/files-store";

export type SelectedSource =
  | { kind: "note"; note: Note }
  | { kind: "file"; file: WorkspaceFile }
  | null;

function formatSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AISelectedPanel({ source }: { source: SelectedSource }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-6">
      <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        Selected content
      </h2>
      {!source ? (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          No note or file selected. Click a note or file on the left to target AI
          actions.
        </p>
      ) : source.kind === "note" ? (
        <div className="mt-3 space-y-2 text-sm">
          <div className="font-semibold text-slate-900 dark:text-slate-100">
            {source.note.title}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Updated {new Date(source.note.updatedAt).toLocaleString()}
          </div>
          <p className="mt-1 line-clamp-3 text-slate-700 dark:text-slate-300">
            {source.note.content ||
              "This note is empty. Add content to get better AI results."}
          </p>
        </div>
      ) : (
        <div className="mt-3 space-y-2 text-sm">
          <div className="font-semibold text-slate-900 dark:text-slate-100">
            {source.file.name}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {source.file.type || "unknown/type"} •{" "}
            {formatSize(source.file.size)} • Uploaded{" "}
            {new Date(source.file.uploadedAt).toLocaleString()}
          </div>
          <p className="mt-1 text-slate-700 dark:text-slate-300">
            File content isn’t parsed yet in the MVP. AI actions will use this
            metadata only.
          </p>
        </div>
      )}
    </section>
  );
}

