import Link from "next/link";
import { redirect } from "next/navigation";

import SignupForm from "@/components/auth/signup-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function SignupPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
        <header className="mb-8 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-sm font-semibold text-white">
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
          <h1 className="text-xl font-semibold tracking-tight">
            Create your workspace
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Sign up to save subjects, notes, files, and AI activity.
          </p>

          <div className="mt-6">
            <SignupForm />
          </div>

          <Link
            href="/"
            className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
          >
            Back to landing page
          </Link>
        </main>
      </div>
    </div>
  );
}

