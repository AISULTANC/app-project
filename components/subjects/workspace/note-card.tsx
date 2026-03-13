import Link from "next/link";

export type NoteVM = {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
};

export default function NoteCard({
  subjectId,
  note,
}: {
  subjectId: string;
  note: NoteVM;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
            {note.title}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Updated {note.updatedAt}
          </div>
        </div>
        <Link
          href={`/dashboard/subjects/${subjectId}#notes`}
          className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
        >
          Open note
        </Link>
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {note.preview}
      </p>
    </div>
  );
}

