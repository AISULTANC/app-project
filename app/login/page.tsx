"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
        <header className="mb-8 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
            AI
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">AI Workspace</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              for Students
            </div>
          </div>
        </header>

        <main className="flex-1">
          <h1 className="text-xl font-semibold tracking-tight">Log in</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Authentication is not enabled yet. For now, you can go straight to
            your dashboard.
          </p>

          <div className="mt-6 space-y-3">
            <Link
              href="/dashboard"
              className="flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              Go to dashboard
            </Link>
            <Link
              href="/"
              className="flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
            >
              Back to landing page
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
            Once authentication is wired up again, this page will support real
            email/password login.
          </p>
        </main>
      </div>
    </div>
  );
}

