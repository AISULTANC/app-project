"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

import DashboardSidebar from "@/components/dashboard/sidebar";
import DashboardTopHeader from "@/components/dashboard/top-header";

function headerForPath(pathname: string) {
  if (pathname === "/dashboard") {
    return {
      title: "Let’s make studying easier today.",
      subtitle: "Welcome back — here’s what’s happening in your workspace.",
    };
  }
  if (pathname === "/dashboard/subjects") {
    return {
      title: "Subjects",
      subtitle: "Organize your classes and study materials.",
    };
  }
  if (pathname.startsWith("/dashboard/subjects/")) {
    return {
      title: "Subject workspace",
      subtitle: "Study materials, notes, and AI tools—focused in one subject.",
    };
  }
  if (pathname === "/dashboard/notes") {
    return { title: "Notes", subtitle: "Browse and pick up where you left off." };
  }
  if (pathname === "/dashboard/files") {
    return {
      title: "Files",
      subtitle: "Lecture materials and documents across your subjects.",
    };
  }
  if (pathname === "/dashboard/chat") {
    return {
      title: "AI Chat",
      subtitle: "Ask questions and keep study context organized.",
    };
  }
  if (pathname === "/dashboard/settings") {
    return {
      title: "Settings",
      subtitle: "Manage your workspace preferences.",
    };
  }
  return { title: "Dashboard" };
}

export default function DashboardLayoutFrame({
  children,
  displayName,
  email,
}: {
  children: React.ReactNode;
  displayName: string;
  email: string;
}) {
  const pathname = usePathname() ?? "";
  const reducedMotion = useReducedMotion();
  const header = headerForPath(pathname);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[260px_1fr] md:px-6">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:sticky md:top-6 md:h-[calc(100vh-3rem)] md:overflow-auto">
          <div className="flex items-center gap-2 px-2 pb-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
              AI
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">AI Workspace</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Student Dashboard
              </div>
            </div>
          </div>

          <DashboardSidebar email={email} />

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/30">
            <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Quick tip
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
              Keep each class in its own subject. AI chat stays focused on the
              current subject context.
            </p>
          </div>
        </aside>

        <div className="space-y-6">
          <DashboardTopHeader
            title={header.title}
            subtitle={header.subtitle}
            displayName={displayName}
          />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
              transition={
                reducedMotion
                  ? undefined
                  : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }
              }
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

