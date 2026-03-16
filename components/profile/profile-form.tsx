"use client";

import { useState, useRef } from "react";
import { Camera, Loader2, Upload, X } from "lucide-react";

import { updateProfileClient, uploadAvatar, deleteAvatar } from "@/lib/auth/client-helpers";

export default function ProfileForm({
  userId,
  email,
  initialFullName,
  initialUsername,
  initialAvatarUrl,
}: {
  userId: string;
  email: string;
  initialFullName: string;
  initialUsername: string | null;
  initialAvatarUrl: string | null;
}) {
  const [fullName, setFullName] = useState(initialFullName);
  const [username, setUsername] = useState(initialUsername || "");
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await updateProfileClient({
        full_name: fullName.trim() || null,
        username: username.trim() || null,
      });

      setSuccess("Profile saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAvatarUpload(file: File) {
    setError(null);
    setSuccess(null);
    setAvatarLoading(true);

    try {
      const newAvatarUrl = await uploadAvatar(file);
      setAvatarUrl(newAvatarUrl);
      setSuccess("Avatar uploaded successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload avatar.");
    } finally {
      setAvatarLoading(false);
    }
  }

  async function handleAvatarDelete() {
    setError(null);
    setSuccess(null);
    setAvatarLoading(true);

    try {
      await deleteAvatar();
      setAvatarUrl(null);
      setSuccess("Avatar removed successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove avatar.");
    } finally {
      setAvatarLoading(false);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Avatar must be less than 5MB.");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError("Avatar must be an image file.");
        return;
      }
      
      handleAvatarUpload(file);
    }
  }

  return (
    <form onSubmit={onSave} className="space-y-6">
      {/* Avatar Section */}
      <div>
        <label className="mb-3 block text-sm font-medium">Profile Picture</label>
        <div className="flex items-center gap-4">
          <div className="relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile avatar"
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 dark:bg-[#1f1f1f]">
                <Camera className="h-8 w-8 text-slate-400" />
              </div>
            )}
            
            {avatarLoading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
          </div>
          
          <div className="flex flex-1 flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={avatarLoading}
            />
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarLoading}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-[#1f1f1f] dark:bg-[#111111] dark:text-white dark:hover:bg-[#0a0a0a]"
              >
                <Upload className="h-4 w-4" />
                Upload
              </button>
              
              {avatarUrl && (
                <button
                  type="button"
                  onClick={handleAvatarDelete}
                  disabled={avatarLoading}
                  className="flex items-center gap-2 rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-rose-800 dark:bg-[#111111] dark:text-rose-400 dark:hover:bg-rose-950"
                >
                  <X className="h-4 w-4" />
                  Remove
                </button>
              )}
            </div>
            
            <div className="text-xs text-slate-500 dark:text-[#a1a1a1]">
              JPG, PNG or GIF. Max 5MB.
            </div>
          </div>
        </div>
      </div>

      {/* Email Field */}
      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 dark:border-[#1f1f1f] dark:bg-[#0a0a0a] dark:text-[#a1a1a1]"
        />
        <div className="mt-1 text-xs text-slate-500 dark:text-[#a1a1a1]">
          Email cannot be changed
        </div>
      </div>

      {/* Full Name Field */}
      <div>
        <label className="mb-1 block text-sm font-medium">Full name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your full name"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-indigo-400 transition focus:ring-2 dark:border-[#1f1f1f] dark:bg-[#111111] dark:text-white dark:focus:border-[#3b82f6]"
          disabled={loading}
        />
      </div>

      {/* Username Field */}
      <div>
        <label className="mb-1 block text-sm font-medium">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-indigo-400 transition focus:ring-2 dark:border-[#1f1f1f] dark:bg-[#111111] dark:text-white dark:focus:border-[#3b82f6]"
          disabled={loading}
        />
        <div className="mt-1 text-xs text-slate-500 dark:text-[#a1a1a1]">
          Optional - This will be visible to other users
        </div>
      </div>

      {/* Messages */}
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save profile"
        )}
      </button>
    </form>
  );
}
