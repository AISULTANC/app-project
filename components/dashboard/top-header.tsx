import ThemeToggle from "@/components/theme-toggle";

export default function DashboardTopHeader({
  title,
  subtitle,
  displayName,
}: {
  title: string;
  subtitle?: string;
  displayName: string;
}) {
  const initial = displayName.trim().charAt(0).toUpperCase() || "S";

  return (
    <header className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-semibold tracking-tight">{title}</div>
          {subtitle ? (
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {subtitle}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden w-[320px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-300 md:flex">
            <span className="text-slate-400 dark:text-slate-500">⌘</span>
            <span className="text-slate-400 dark:text-slate-500">K</span>
            <span className="mx-2 h-4 w-px bg-slate-200 dark:bg-slate-800" />
            <span className="truncate">Search subjects, notes, files…</span>
          </div>
          <ThemeToggle />
          <div className="hidden text-right md:block">
            <div className="text-xs text-slate-500 dark:text-slate-400">Signed in as</div>
            <div className="max-w-[180px] truncate text-sm font-medium">{displayName}</div>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
            {initial}
          </div>
        </div>
      </div>
    </header>
  );
}

