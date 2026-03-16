import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-black dark:text-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
        <header className="mb-8 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-sm font-semibold text-white">
            AI
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">AI Workspace</div>
            <div className="text-xs text-slate-500 dark:text-[#a1a1a1]">
              for Students
            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/60 dark:bg-rose-950/30">
            <h1 className="text-lg font-semibold text-rose-700 dark:text-rose-300">
              Authentication Error
            </h1>
            <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">
              There was an error during the authentication process. Please try again.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <Link
              href="/login"
              className="block w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Try Again
            </Link>
            
            <Link
              href="/"
              className="block w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-[#1f1f1f] dark:bg-[#111111] dark:text-white dark:hover:bg-[#0a0a0a]"
            >
              Back to Home
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
