"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

export interface Document {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
}

type DocumentsContextValue = {
  documents: Document[];
  loading: boolean;
  uploadFile: (file: File) => Promise<{ success: boolean; error?: string }>;
  deleteDocument: (id: string) => Promise<{ success: boolean; error?: string }>;
  refreshDocuments: () => Promise<void>;
};

const DocumentsContext = createContext<DocumentsContextValue | null>(null);

let supabase: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (typeof window === "undefined") return null;
  if (!supabase) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return supabase;
}

export function DocumentsProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setDocuments([]);
        return;
      }

      const { data, error } = await supabase
        .from("documents")
        .select("id, file_name, file_type, file_size, uploaded_at")
        .eq("user_id", user.id)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const uploadFile = useCallback(async (file: File): Promise<{ success: boolean; error?: string }> => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { success: false, error: "Client not initialized" };
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: "Not authenticated" };
      }

      // Get auth token for API
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: "No session" };
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || "Upload failed" };
      }

      // Refresh documents list
      await fetchDocuments();
      return { success: true };
    } catch (error) {
      console.error("Upload error:", error);
      return { success: false, error: "Upload failed" };
    }
  }, [fetchDocuments]);

  const deleteDocument = useCallback(async (id: string): Promise<{ success: boolean; error?: string }> => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { success: false, error: "Client not initialized" };
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: "No session" };
      }

      const response = await fetch(`/api/documents?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || "Delete failed" };
      }

      // Update local state
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      return { success: true };
    } catch (error) {
      console.error("Delete error:", error);
      return { success: false, error: "Delete failed" };
    }
  }, []);

  const value = useMemo<DocumentsContextValue>(
    () => ({
      documents,
      loading,
      uploadFile,
      deleteDocument,
      refreshDocuments: fetchDocuments,
    }),
    [documents, loading, uploadFile, deleteDocument, fetchDocuments]
  );

  return (
    <DocumentsContext.Provider value={value}>
      {children}
    </DocumentsContext.Provider>
  );
}

export function useDocuments() {
  const ctx = useContext(DocumentsContext);
  if (!ctx) {
    throw new Error("useDocuments must be used within DocumentsProvider");
  }
  return ctx;
}
