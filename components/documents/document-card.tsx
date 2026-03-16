"use client";

import { useState } from "react";
import { FileText, File, Trash2, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useDocuments, type Document } from "./documents-store";
import { formatFileSize } from "@/lib/documents";
import DocumentAnalysis from "./document-analysis";

interface DocumentCardProps {
  document: Document;
}

const fileTypeIcons: Record<string, typeof FileText> = {
  pdf: FileText,
  docx: File,
  txt: FileText,
  md: FileText,
};

export default function DocumentCard({ document }: DocumentCardProps) {
  const { deleteDocument } = useDocuments();
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const Icon = fileTypeIcons[document.file_type] || FileText;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    
    setDeleting(true);
    await deleteDocument(document.id);
    setDeleting(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-[#1f1f1f] dark:bg-[#111111]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="rounded-lg bg-slate-100 p-2 dark:bg-[#0a0a0a]">
              <Icon className="h-5 w-5 text-slate-600 dark:text-[#a1a1a1]" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                {document.file_name}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#a1a1a1]">
                <span>{document.file_type.toUpperCase()}</span>
                <span>•</span>
                <span>{formatFileSize(document.file_size)}</span>
                <span>•</span>
                <span>{formatDate(document.uploaded_at)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => setShowAnalysis(true)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-[#a1a1a1] dark:hover:bg-[#0a0a0a]"
              title="Ask AI about this document"
            >
              <Sparkles className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-rose-600 dark:text-[#a1a1a1] dark:hover:bg-[#0a0a0a]"
              title="Delete document"
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setShowAnalysis(true)}
            className="flex-1 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100 hover:bg-indigo-100 dark:bg-[#3b82f6]/10 dark:text-[#3b82f6] dark:ring-[#3b82f6]/20 dark:hover:bg-[#3b82f6]/15"
          >
            Ask AI
          </button>
        </div>
      </motion.div>

      {showAnalysis && (
        <DocumentAnalysis
          documentId={document.id}
          fileName={document.file_name}
          onClose={() => setShowAnalysis(false)}
        />
      )}
    </>
  );
}
