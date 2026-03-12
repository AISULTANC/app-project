"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  key: "dashboard" | "subjects" | "notes" | "files" | "chat" | "settings";
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
  return (
    <Link
      href={href}
      className={[
        "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition",
        active
          ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-200 dark:ring-indigo-500/20"
          : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900",
      ].join(" ")}
    >
      <span>{label}</span>
      {active ? (
        <span className="text-[10px] font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
          Current
        </span>
      ) : null}
    </Link>
  );
}

export default function DashboardSidebar() {
  const pathname = usePathname() ?? "";

  return (
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
  );
}

