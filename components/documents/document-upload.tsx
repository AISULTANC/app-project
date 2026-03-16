"use client";

import { useCallback, useState } from "react";
import { Upload, X, FileText, File, FileSpreadsheet, FilePlus } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useDocuments } from "./documents-store";
import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  validateFile,
  getFileType,
  formatFileSize,
} from "@/lib/documents/parser";

interface DocumentUploadProps {
  onUploadComplete?: () => void;
  compact?: boolean;
}

const fileTypeIcons: Record<string, typeof FileText> = {
  pdf: FileText,
  docx: File,
  txt: FileText,
  md: FileText,
  csv: FileSpreadsheet,
};

export default function DocumentUpload({ onUploadComplete, compact = false }: DocumentUploadProps) {
  const { uploadFile } = useDocuments();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const reducedMotion = useReducedMotion();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      await processFile(files[0]);
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      await processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    setError(null);
    
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    try {
      const result = await uploadFile(selectedFile);
      
      if (!result.success) {
        setError(result.error || "Upload failed");
        return;
      }

      setSelectedFile(null);
      onUploadComplete?.();
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setError(null);
  };

  const fileType = selectedFile ? getFileFileType(selectedFile.name) : null;
  const Icon = fileType ? fileTypeIcons[fileType] : FileText;

  if (compact) {
    return (
      <div className="space-y-3">
        <div
          className={`relative rounded-xl border-2 border-dashed p-4 text-center transition-colors ${
            dragActive
              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
              : "border-slate-200 dark:border-[#1f1f1f]"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            onChange={handleFileChange}
            accept={ALLOWED_FILE_TYPES.map((t) => `.${t}`).join(",")}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-6 w-6 text-slate-400" />
            <div className="text-sm text-slate-600 dark:text-[#a1a1a1]">
              {dragActive ? "Drop file here" : "Drag & drop or click to upload"}
            </div>
            <div className="text-xs text-slate-400">
              PDF, DOCX, TXT, MD, CSV (max 10MB)
            </div>
          </div>
        </div>

        {selectedFile && (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 dark:border-[#1f1f1f] dark:bg-[#111111]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Icon className="h-5 w-5 flex-shrink-0 text-slate-500" />
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-slate-900 dark:text-white">
                  {selectedFile.name}
                </div>
                <div className="text-xs text-slate-500">
                  {formatFileSize(selectedFile.size)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearSelection}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#0a0a0a]"
              >
                <X className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          dragActive
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
            : "border-slate-200 dark:border-[#1f1f1f]"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          onChange={handleFileChange}
          accept={ALLOWED_FILE_TYPES.map((t) => `.${t}`).join(",")}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full bg-slate-100 p-3 dark:bg-[#1f1f1f]">
            <FilePlus className="h-6 w-6 text-slate-600 dark:text-[#a1a1a1]" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-900 dark:text-white">
              {dragActive ? "Drop file here" : "Upload a document"}
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-[#a1a1a1]">
              PDF, DOCX, TXT, MD, CSV up to {formatFileSize(MAX_FILE_SIZE)}
            </div>
          </div>
        </div>
      </div>

      {selectedFile && (
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-[#1f1f1f] dark:bg-[#111111]"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="rounded-lg bg-slate-100 p-2 dark:bg-[#0a0a0a]">
              <Icon className="h-6 w-6 text-slate-600 dark:text-[#a1a1a1]" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                {selectedFile.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-[#a1a1a1]">
                {formatFileSize(selectedFile.size)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearSelection}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-[#1f1f1f] dark:text-[#a1a1a1] dark:hover:bg-[#0a0a0a]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload & Parse"}
            </button>
          </div>
        </motion.div>
      )}

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
          {error}
        </div>
      )}
    </div>
  );
}

function getFileFileType(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase();
  const typeMap: Record<string, string> = {
    pdf: "pdf",
    docx: "docx",
    txt: "txt",
    md: "md",
    csv: "csv",
  };
  return ext ? typeMap[ext] || "txt" : "txt";
}
