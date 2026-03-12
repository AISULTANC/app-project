import DashboardLayoutFrame from "@/components/dashboard/layout-frame";
import { FilesProvider } from "@/components/files/files-store";
import { NotesProvider } from "@/components/notes/notes-store";
import { SubjectsProvider } from "@/components/subjects/subjects-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SubjectsProvider>
      <NotesProvider>
        <FilesProvider>
          <DashboardLayoutFrame>{children}</DashboardLayoutFrame>
        </FilesProvider>
      </NotesProvider>
    </SubjectsProvider>
  );
}

