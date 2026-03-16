import DashboardLayoutFrame from "@/components/dashboard/layout-frame";
import { FilesProvider } from "@/components/files/files-store";
import { NotesProvider } from "@/components/notes/notes-store";
import { SubjectsProvider } from "@/components/subjects/subjects-store";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Profile } from "@/lib/auth/client-helpers";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const email = profile?.email || user.email || "";

  return (
    <SubjectsProvider>
      <NotesProvider>
        <FilesProvider>
          <DashboardLayoutFrame
            email={email}
            profile={profile}
          >
            {children}
          </DashboardLayoutFrame>
        </FilesProvider>
      </NotesProvider>
    </SubjectsProvider>
  );
}

