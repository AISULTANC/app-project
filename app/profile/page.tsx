import Link from "next/link";
import { redirect } from "next/navigation";

import LogoutButton from "@/components/auth/logout-button";
import ProfileForm from "@/components/profile/profile-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect("/login");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle();

  const email = user.email ?? profile?.email ?? "";
  const fullName = profile?.full_name ?? (user.user_metadata?.full_name as string | undefined) ?? "";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100 md:px-6">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <header className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div>
            <h1 className="text-lg font-semibold">Profile</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Manage your account information.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900"
            >
              Back to dashboard
            </Link>
            <LogoutButton />
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Account details
          </h2>

          <ProfileForm userId={user.id} email={email} initialFullName={fullName} />

          <div className="mt-6 grid gap-3 text-xs text-slate-500 dark:text-slate-400 md:grid-cols-2">
            <div>
              <div className="font-semibold text-slate-700 dark:text-slate-200">User ID</div>
              <div className="break-all">{user.id}</div>
            </div>
            <div>
              <div className="font-semibold text-slate-700 dark:text-slate-200">Created</div>
              <div>{profile?.created_at ? new Date(profile.created_at).toLocaleString() : "-"}</div>
            </div>
            <div>
              <div className="font-semibold text-slate-700 dark:text-slate-200">Updated</div>
              <div>{profile?.updated_at ? new Date(profile.updated_at).toLocaleString() : "-"}</div>
            </div>
            <div>
              <div className="font-semibold text-slate-700 dark:text-slate-200">Avatar</div>
              <div>Coming soon</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
