import Link from "next/link";
import { redirect } from "next/navigation";

import LogoutButton from "@/components/auth/logout-button";
import ProfileForm from "@/components/profile/profile-form";
import { getCurrentUser, getCurrentProfile } from "@/lib/auth/auth-helpers";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const profile = await getCurrentProfile();

  if (!user) {
    redirect("/login");
  }

  const email = profile?.email ?? user.email ?? "";
  const fullName = profile?.full_name ?? (user.user_metadata?.full_name as string | undefined) ?? "";
  const username = profile?.username ?? null;
  const avatarUrl = profile?.avatar_url ?? null;
  const provider = profile?.provider ?? "email";
  const createdAt = profile?.created_at ?? user.created_at;
  const updatedAt = profile?.updated_at ?? user.updated_at;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 dark:bg-black dark:text-white md:px-6">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <header className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-[#1f1f1f] dark:bg-[#111111]">
          <div>
            <h1 className="text-lg font-semibold">Profile</h1>
            <p className="text-sm text-slate-600 dark:text-[#a1a1a1]">
              Manage your account information.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:border-[#1f1f1f] dark:hover:bg-[#0a0a0a]"
            >
              Back to dashboard
            </Link>
            <LogoutButton />
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#1f1f1f] dark:bg-[#111111]">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-[#a1a1a1]">
            Account details
          </h2>

          <ProfileForm 
            userId={user.id} 
            email={email} 
            initialFullName={fullName}
            initialUsername={username}
            initialAvatarUrl={avatarUrl}
          />

          <div className="mt-6 grid gap-3 text-xs text-slate-500 dark:text-[#a1a1a1] md:grid-cols-2">
            <div>
              <div className="font-semibold text-slate-700 dark:text-white">User ID</div>
              <div className="break-all">{user.id}</div>
            </div>
            <div>
              <div className="font-semibold text-slate-700 dark:text-white">Auth Provider</div>
              <div className="capitalize">{provider}</div>
            </div>
            <div>
              <div className="font-semibold text-slate-700 dark:text-white">Account Created</div>
              <div>{createdAt ? new Date(createdAt).toLocaleString() : "-"}</div>
            </div>
            <div>
              <div className="font-semibold text-slate-700 dark:text-white">Last Updated</div>
              <div>{updatedAt ? new Date(updatedAt).toLocaleString() : "-"}</div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#1f1f1f] dark:bg-[#111111]">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-[#a1a1a1]">
            Profile Completion
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-[#a1a1a1]">Profile Strength</span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {[
                  fullName && 'Name',
                  username && 'Username', 
                  avatarUrl && 'Avatar'
                ].filter(Boolean).length}/3 Complete
              </span>
            </div>
            
            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-[#1f1f1f]">
              <div 
                className="h-2 rounded-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${([fullName, username, avatarUrl].filter(Boolean).length / 3) * 100}%` }}
              />
            </div>
            
            <div className="text-xs text-slate-500 dark:text-[#a1a1a1]">
              Complete your profile to get the most out of AI Workspace.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
