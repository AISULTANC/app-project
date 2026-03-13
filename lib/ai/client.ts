import type { AIActionType, AIResult, AIResultUnion, SelectedContentPayload } from "./types";
import type { NoteActionType } from "./prompts";
import type { FileActionType } from "./prompts";
import type { StudyToolType } from "./prompts";

// ── Shared fetch helper ──────────────────────────────────────────────

async function aiFetch<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = `AI request failed (${res.status})`;
    try {
      const data = await res.json();
      if (typeof data?.error === "string" && data.error.trim().length > 0) {
        message = data.error;
      }
    } catch {
      const text = await res.text().catch(() => "");
      if (text) message = text;
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

// ── Legacy action (backward compat) ─────────────────────────────────

type ActionRequest = {
  action: AIActionType;
  source: SelectedContentPayload;
};

export async function runAIAction(payload: ActionRequest): Promise<AIResult> {
  const data = await aiFetch<{ result: AIResult }>("/api/ai/action", payload);
  return data.result;
}

// ── Note AI actions ─────────────────────────────────────────────────

export async function runNoteAction(payload: {
  action: NoteActionType;
  noteTitle: string;
  noteContent: string;
  subjectName: string;
}): Promise<AIResultUnion> {
  const data = await aiFetch<{ result: AIResultUnion }>("/api/ai/note-action", payload);
  return data.result;
}

// ── File AI actions ─────────────────────────────────────────────────

export async function runFileAction(payload: {
  action: FileActionType;
  fileName: string;
  fileContent: string;
  subjectName: string;
}): Promise<AIResultUnion> {
  const data = await aiFetch<{ result: AIResultUnion }>("/api/ai/file-action", payload);
  return data.result;
}

// ── AI Chat ─────────────────────────────────────────────────────────

export async function sendChatMessage(payload: {
  messages: { role: "user" | "assistant"; content: string }[];
  subjectName: string;
  subjectDescription: string;
  context?: {
    noteTitle?: string;
    noteContent?: string;
    fileName?: string;
    fileContent?: string;
  };
}): Promise<string> {
  const data = await aiFetch<{ message: string }>("/api/ai/chat", payload);
  return data.message;
}

// ── Study Tools ─────────────────────────────────────────────────────

export async function runStudyTool(payload: {
  tool: StudyToolType;
  topic: string;
  subjectName?: string;
  additionalContent?: string;
}): Promise<AIResultUnion> {
  const data = await aiFetch<{ result: AIResultUnion }>("/api/ai/study-tools", payload);
  return data.result;
}

