"use client";

import { ThemeProvider } from "next-themes";
import { DocumentsProvider } from "@/components/documents/documents-store";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <DocumentsProvider>
        {children}
      </DocumentsProvider>
    </ThemeProvider>
  );
}

