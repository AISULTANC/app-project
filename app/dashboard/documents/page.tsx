"use client";

import { useDocuments } from "@/components/documents/documents-store";
import DocumentUpload from "@/components/documents/document-upload";
import DocumentCard from "@/components/documents/document-card";
import { FileText, Loader2 } from "lucide-react";
import { useState } from "react";

export default function DocumentsPage() {
  const { documents, loading } = useDocuments();
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
            My Documents
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-[#a1a1a1]">
            Upload documents and ask AI to analyze them
          </p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          {showUpload ? "Hide Upload" : "Upload Document"}
        </button>
      </div>

      {/* Upload Section */}
      {showUpload && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f1f1f] dark:bg-[#111111]">
          <DocumentUpload compact onUploadComplete={() => setShowUpload(false)} />
        </div>
      )}

      {/* Documents Grid */}
      <div>
        <h2 className="mb-4 text-sm font-semibold text-slate-700 dark:text-white">
          Uploaded Documents ({documents.length})
        </h2>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-slate-500 dark:text-[#a1a1a1]">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading documents...</span>
          </div>
        ) : documents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center dark:border-[#1f1f1f] dark:bg-[#0a0a0a]">
            <FileText className="mx-auto h-10 w-10 text-slate-400" />
            <p className="mt-3 text-sm text-slate-600 dark:text-[#a1a1a1]">
              No documents uploaded yet
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-[#a1a1a1]">
              Upload a PDF, DOCX, TXT, or MD file to get started
            </p>
            <button
              onClick={() => setShowUpload(true)}
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Upload Your First Document
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
