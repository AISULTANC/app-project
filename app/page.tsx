import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-gradient-to-b from-indigo-50 via-white to-white dark:from-slate-900/40 dark:via-slate-950 dark:to-slate-950" />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-sm font-semibold text-white">
            AI
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">AI Workspace</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              for Students
            </div>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-slate-600 dark:text-slate-300 md:flex">
          <a href="#features" className="hover:text-slate-900 dark:hover:text-slate-100">
            Features
          </a>
          <a href="#how" className="hover:text-slate-900 dark:hover:text-slate-100">
            How it works
          </a>
          <a href="#cta" className="hover:text-slate-900 dark:hover:text-slate-100">
            Get started
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Start free
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 pb-16 pt-10 md:grid-cols-2 md:pb-24 md:pt-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Built for study flow, not busywork
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              Your subjects, notes, and lecture files — powered by AI.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
              Organize classes by subject, upload materials, and instantly get
              summaries, simple explanations, key terms, and quiz questions.
              Keep an AI chat per subject so your context stays focused.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                Create your workspace
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
              >
                Go to dashboard
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="rounded-full bg-white/60 px-3 py-1 ring-1 ring-slate-200 dark:bg-slate-900/40 dark:ring-slate-800">
                Subjects
              </span>
              <span className="rounded-full bg-white/60 px-3 py-1 ring-1 ring-slate-200 dark:bg-slate-900/40 dark:ring-slate-800">
                Notes
              </span>
              <span className="rounded-full bg-white/60 px-3 py-1 ring-1 ring-slate-200 dark:bg-slate-900/40 dark:ring-slate-800">
                PDF/DOCX/TXT uploads
              </span>
              <span className="rounded-full bg-white/60 px-3 py-1 ring-1 ring-slate-200 dark:bg-slate-900/40 dark:ring-slate-800">
                Summaries & quizzes
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-indigo-100 via-white to-emerald-100 blur-2xl dark:from-indigo-500/10 dark:via-slate-950 dark:to-emerald-500/10" />
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/40">
                <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <div className="ml-3 text-xs font-medium text-slate-600 dark:text-slate-300">
                  AI Workspace — Calculus
                </div>
              </div>
              <div className="grid gap-4 p-5">
                <div className="grid gap-2">
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Lecture upload
                  </div>
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300">
                    Drop PDF/DOCX/TXT or browse files
                  </div>
                </div>

                <div className="grid gap-2">
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    AI actions
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Summarize", "Explain simply", "Key terms", "Quiz"].map(
                      (label) => (
                        <div
                          key={label}
                          className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-200 dark:ring-indigo-500/20"
                        >
                          {label}
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Subject chat
                  </div>
                  <div className="mt-2 space-y-2 text-xs">
                    <div className="rounded-lg bg-slate-50 p-2 text-slate-700 dark:bg-slate-900/40 dark:text-slate-200">
                      Explain derivatives like I’m new to calculus.
                    </div>
                    <div className="rounded-lg bg-indigo-50 p-2 text-indigo-800 dark:bg-indigo-500/10 dark:text-indigo-200">
                      A derivative tells you how fast something changes. Think
                      of it as the slope of a curve at one point…
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">
              Everything you need to study faster
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              A focused workspace per class: materials in, understanding out.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Subjects that stay organized",
                desc: "Create a subject for each class and keep everything in one place.",
              },
              {
                title: "Upload lecture materials",
                desc: "Store PDFs, DOCX, and TXT so your study content is always available.",
              },
              {
                title: "Instant AI summaries",
                desc: "Turn long lecture notes into clear bullet points in seconds.",
              },
              {
                title: "Quizzes that test understanding",
                desc: "Generate questions + answers to practice before exams.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {f.title}
                </div>
                <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="how" className="mx-auto w-full max-w-6xl px-6 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 md:p-10 dark:border-slate-800 dark:bg-slate-900/30">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              How it works
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Create a subject",
                  desc: "One workspace per class: Calculus, History, English…",
                },
                {
                  step: "2",
                  title: "Add notes + uploads",
                  desc: "Write notes and upload lecture files as you go.",
                },
                {
                  step: "3",
                  title: "Use AI when you need it",
                  desc: "Summaries, simple explanations, key terms, quizzes, and chat.",
                },
              ].map((s) => (
                <div key={s.step} className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-950 dark:ring-1 dark:ring-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-sm font-semibold text-white">
                      {s.step}
                    </div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {s.title}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className="mx-auto w-full max-w-6xl px-6 pb-20">
          <div className="rounded-3xl bg-indigo-600 px-8 py-10 text-white md:px-12">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Build your study system in one place.
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Start with a subject, upload a lecture, and let AI turn it
                  into understanding.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100"
                >
                  Start free
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} AI Workspace for Students</div>
          <div className="flex gap-4">
            <a href="#features" className="hover:text-slate-700">
              Features
            </a>
            <a href="#cta" className="hover:text-slate-700">
              Get started
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
