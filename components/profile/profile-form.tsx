"use client";

import { useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ProfileForm({
  userId,
  email,
  initialFullName,
}: {
  userId: string;
  email: string;
  initialFullName: string;
}) {
  const [fullName, setFullName] = useState(initialFullName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: upsertError } = await supabase.from("profiles").upsert(
        {
          id: userId,
          email,
          full_name: fullName.trim() || null,
        },
        { onConflict: "id" }
      );

      if (upsertError) {
        setError(upsertError.message);
        return;
      }

      setSuccess("Profile saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSave} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Full name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your full name"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-indigo-400 transition focus:ring-2 dark:border-slate-800 dark:bg-slate-950"
          disabled={loading}
        />
      </div>

      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
          {success}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
