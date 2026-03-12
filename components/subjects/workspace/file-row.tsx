export type FileVM = {
  id: string;
  name: string;
  typeLabel: string;
  uploadedAt: string;
  sizeBytes: number;
  subjectName?: string;
};

function TypePill({ label }: { label: string }) {
  const lower = label.toLowerCase();
  const cls =
    lower.includes("pdf")
      ? "bg-rose-50 text-rose-700 ring-rose-100 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/20"
      : lower.includes("doc")
        ? "bg-indigo-50 text-indigo-700 ring-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-200 dark:ring-indigo-500/20"
        : "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${cls}`}
    >
      {label}
    </span>
  );
}

function formatSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileRow({
  file,
  onOpen,
  onDelete,
}: {
  file: FileVM;
  onOpen: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
          {file.name}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <TypePill label={file.typeLabel} />
          {file.subjectName ? <span>{file.subjectName}</span> : null}
          <span>{formatSize(file.sizeBytes)}</span>
          <span>Uploaded {file.uploadedAt}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
        {onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:bg-rose-500/15"
          >
            Delete
          </button>
        ) : null}
        <button
          type="button"
          onClick={onOpen}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
        >
          Open file
        </button>
      </div>
    </div>
  );
}

