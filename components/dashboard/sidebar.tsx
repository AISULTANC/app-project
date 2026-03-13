"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/auth/logout-button";

type NavItem = {
  key: "dashboard" | "subjects" | "notes" | "files" | "chat" | "study-tools" | "settings";
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
          : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900",
      ].join(" ")}
    >
      {active ? (
        <motion.span
          layoutId="sidebar-active-pill"
          className="absolute inset-0 rounded-lg bg-indigo-50 ring-1 ring-indigo-100 dark:bg-indigo-500/10 dark:ring-indigo-500/20"
          transition={
            reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }
          }
        />
      ) : null}
      <span className="relative z-10">{label}</span>
      {active ? (
        <span className="relative z-10 text-[10px] font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
          Current
        </span>
      ) : null}
    </Link>
    </motion.div>
  );
}

export default function DashboardSidebar({
  email,
}: {
  email: string;
}) {
  const pathname = usePathname() ?? "";

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

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/30">
        <div className="text-xs text-slate-500 dark:text-slate-400">Account</div>
        <div className="mt-1 truncate text-sm font-medium text-slate-800 dark:text-slate-100">
          {email}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Link
            href="/profile"
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Profile
          </Link>
          <LogoutButton className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}

