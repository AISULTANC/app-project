import DashboardLayoutFrame from "@/components/dashboard/layout-frame";
import { FilesProvider } from "@/components/files/files-store";
import { NotesProvider } from "@/components/notes/notes-store";
import { SubjectsProvider } from "@/components/subjects/subjects-store";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  const displayName =
    profile?.full_name ||
    (user.user_metadata?.full_name as string | undefined) ||
    user.email ||
    "Student";

  const email = profile?.email || user.email || "";

  return (
    <SubjectsProvider>
      <NotesProvider>
        <FilesProvider>
          <DashboardLayoutFrame
            displayName={displayName}
            email={email}
          >
            {children}
          </DashboardLayoutFrame>
        </FilesProvider>
      </NotesProvider>
    </SubjectsProvider>
  );
}

