import ThemeToggle from "@/components/theme-toggle";
import DashboardSidebar from "@/components/dashboard/sidebar";

export default function DashboardShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[260px_1fr] md:px-6">
        {/* Sidebar */}
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:sticky md:top-6 md:h-[calc(100vh-3rem)] md:overflow-auto">
          <div className="flex items-center gap-2 px-2 pb-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
              AI
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">AI Workspace</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Student Dashboard
              </div>
            </div>
          </div>

          <DashboardSidebar />

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/30">
            <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Quick tip
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
              Keep each class in its own subject. AI chat stays focused on the
              current subject context.
            </p>
          </div>
        </aside>

        {/* Main */}
        <div className="space-y-6">
          {/* Top header */}
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
                <div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                  S
                </div>
              </div>
            </div>
          </header>

          {children}
        </div>
      </div>
    </div>
  );
}

