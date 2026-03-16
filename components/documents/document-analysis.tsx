"use client";

import { useState } from "react";
import { X, Sparkles, Loader2, Send } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

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

interface DocumentAnalysisProps {
  documentId: string;
  fileName: string;
  onClose: () => void;
}

type AnalysisAction = "summarize" | "key_points" | "explain" | "custom";

const quickActions: { id: AnalysisAction; label: string }[] = [
  { id: "summarize", label: "Summarize" },
  { id: "key_points", label: "Key Points" },
  { id: "explain", label: "Explain" },
];

export default function DocumentAnalysis({ documentId, fileName, onClose }: DocumentAnalysisProps) {
  const [action, setAction] = useState<AnalysisAction>("summarize");
  const [customQuestion, setCustomQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (selectedAction?: AnalysisAction, question?: string) => {
    const actionToUse = selectedAction || action;
    const questionToUse = question || customQuestion;

    if (actionToUse === "custom" && !questionToUse.trim()) {
      setError("Please enter a question");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error("Client not initialized");
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      const res = await fetch("/api/documents/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          documentId,
          action: actionToUse,
          question: questionToUse,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Analysis failed");
      }

      setResponse(result.response);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (actionId: AnalysisAction) => {
    setAction(actionId);
    setCustomQuestion("");
    handleAnalyze(actionId);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAnalyze("custom", customQuestion);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-[#1f1f1f] dark:bg-[#111111]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-[#1f1f1f]">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-500/20">
              <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">AI Document Analysis</h3>
              <p className="text-xs text-slate-500 dark:text-[#a1a1a1]">{fileName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-[#0a0a0a]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 border-b border-slate-200 p-4 dark:border-[#1f1f1f]">
          {quickActions.map((qa) => (
            <button
              key={qa.id}
              onClick={() => handleQuickAction(qa.id)}
              disabled={loading}
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-50 dark:bg-[#0a0a0a] dark:text-[#a1a1a1] dark:hover:bg-[#1f1f1f]"
            >
              {qa.label}
            </button>
          ))}
        </div>

        {/* Custom Question */}
        <form onSubmit={handleCustomSubmit} className="flex gap-2 border-b border-slate-200 p-4 dark:border-[#1f1f1f]">
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => {
              setCustomQuestion(e.target.value);
              setAction("custom");
            }}
            placeholder="Ask a custom question about this document..."
            className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-[#1f1f1f] dark:bg-[#0a0a0a] dark:text-white dark:focus:border-[#3b82f6]"
          />
          <button
            type="submit"
            disabled={loading || !customQuestion.trim()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </form>

        {/* Response */}
        <div className="max-h-[400px] overflow-auto p-4">
          {loading && !response && (
            <div className="flex items-center justify-center gap-2 py-8 text-slate-500 dark:text-[#a1a1a1]">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Analyzing document...</span>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
              {error}
            </div>
          )}

          {response && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-[#a1a1a1]">
                {response}
              </div>
            </div>
          )}

          {!loading && !response && !error && (
            <div className="py-8 text-center text-sm text-slate-500 dark:text-[#a1a1a1]">
              Select an action or ask a question to analyze this document
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
