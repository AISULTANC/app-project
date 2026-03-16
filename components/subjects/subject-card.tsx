import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export type SubjectVM = {
  id: string;
  name: string;
  description?: string;
  color: "indigo" | "emerald" | "amber" | "rose";
  notes: number;
  files: number;
};

function ColorDot({ color }: { color: SubjectVM["color"] }) {
  const cls =
    color === "indigo"
      ? "bg-indigo-500"
      : color === "emerald"
        ? "bg-emerald-500"
        : color === "amber"
          ? "bg-amber-500"
          : "bg-rose-500";
  return <span className={`h-2.5 w-2.5 rounded-full ${cls}`} />;
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-[#1f1f1f] dark:text-[#a1a1a1]">
      {children}
    </span>
  );
}

export default function SubjectCard({ subject }: { subject: SubjectVM }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
      animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={reducedMotion ? undefined : { duration: 0.28 }}
      whileHover={
        reducedMotion
          ? undefined
          : {
              y: -3,
              scale: 1.01,
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.09)",
            }
      }
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#1f1f1f] dark:bg-[#111111]"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <ColorDot color={subject.color} />
          <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">
            {subject.name}
          </div>
        </div>
        <span className="text-xs text-slate-500 dark:text-[#a1a1a1]">Mock</span>
      </div>

      {subject.description ? (
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-[#a1a1a1]">
          {subject.description}
        </p>
      ) : (
        <div className="mt-2 text-sm text-slate-500 dark:text-[#a1a1a1]">
          No description.
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>{subject.notes} notes</Badge>
        <Badge>{subject.files} files</Badge>
      </div>

      <div className="mt-4">
        <motion.div whileTap={reducedMotion ? undefined : { scale: 0.98 }}>
          <Link
          href={`/dashboard/subjects/${subject.id}`}
          className="block w-full rounded-xl bg-indigo-50 px-3 py-2 text-center text-sm font-semibold text-indigo-700 ring-1 ring-indigo-100 hover:bg-indigo-100 dark:bg-[#3b82f6]/10 dark:text-[#3b82f6] dark:ring-[#3b82f6]/20 dark:hover:bg-[#3b82f6]/15"
        >
          Open workspace
        </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

