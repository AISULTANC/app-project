"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import LogoutButton from "@/components/auth/logout-button";
import type { Profile } from "@/lib/auth/client-helpers";

type NavItem = {
  key: "dashboard" | "subjects" | "notes" | "files" | "documents" | "chat" | "study-tools" | "settings";
  label: string;
  href: string;
  match: (pathname: string) => boolean;
};

const navItems: NavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    match: (p) => p === "/dashboard",
  },
  {
    key: "subjects",
    label: "Subjects",
    href: "/dashboard/subjects",
    match: (p) => p === "/dashboard/subjects" || p.startsWith("/dashboard/subjects/"),
  },
  {
    key: "notes",
    label: "Notes",
    href: "/dashboard/notes",
    match: (p) => p === "/dashboard/notes",
  },
  {
    key: "files",
    label: "Files",
    href: "/dashboard/files",
    match: (p) => p === "/dashboard/files",
  },
  {
    key: "documents",
    label: "Documents",
    href: "/dashboard/documents",
    match: (p) => p === "/dashboard/documents",
  },
  {
    key: "chat",
    label: "AI Chat",
    href: "/dashboard/chat",
    match: (p) => p === "/dashboard/chat",
  },
  {
    key: "study-tools",
    label: "Study Tools",
    href: "/dashboard/study-tools",
    match: (p) => p === "/dashboard/study-tools",
  },
  {
    key: "settings",
    label: "Settings",
    href: "/dashboard/settings",
    match: (p) => p === "/dashboard/settings",
  },
];

function SidebarLink({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={reducedMotion ? undefined : { y: -1 }}
      transition={reducedMotion ? undefined : { duration: 0.18 }}
    >
      <Link
      href={href}
      className={[
        "relative flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition",
        active
          ? "text-indigo-700 dark:text-indigo-200"
          : "text-slate-700 hover:bg-slate-100 dark:text-white dark:hover:bg-[#111111]",
      ].join(" ")}
    >
      {active ? (
        <motion.span
          layoutId="sidebar-active-pill"
          className="absolute inset-0 rounded-lg bg-indigo-50 ring-1 ring-indigo-100 dark:bg-[#3b82f6]/10 dark:ring-[#3b82f6]/20"
          transition={
            reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }
          }
        />
      ) : null}
      <span className="relative z-10">{label}</span>
        {active ? (
        <span className="relative z-10 text-[10px] font-semibold uppercase tracking-wide text-indigo-600 dark:text-[#3b82f6]">
          Current
        </span>
      ) : null}
    </Link>
    </motion.div>
  );
}

export default function DashboardSidebar({
  email,
  profile,
}: {
  email?: string;
  profile?: Profile | null;
}) {
  const pathname = usePathname() ?? "";

  const displayName = profile?.full_name || profile?.username || email || "User";
  const avatarUrl = profile?.avatar_url;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        {navItems.map((item) => (
          <SidebarLink
            key={item.key}
            label={item.label}
            href={item.href}
            active={item.match(pathname)}
          />
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-[#1f1f1f] dark:bg-[#0a0a0a]">
        <div className="text-xs text-slate-500 dark:text-[#a1a1a1]">Account</div>
        
        <div className="mt-2 flex items-center gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile avatar"
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 dark:bg-[#1f1f1f]">
              <User className="h-4 w-4 text-slate-500" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm font-medium text-slate-800 dark:text-white">
              {displayName}
            </div>
            {email && (
              <div className="truncate text-xs text-slate-500 dark:text-[#a1a1a1]">
                {email}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-3 flex items-center gap-2">
          <Link
            href="/profile"
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-[#1f1f1f] dark:text-white dark:hover:bg-[#111111]"
          >
            Profile
          </Link>
          <LogoutButton className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#1f1f1f] dark:text-white dark:hover:bg-[#111111]" />
        </div>
      </div>
    </div>
  );
}

