import type { NoteActionType, FileActionType, StudyToolType } from "./prompts";

// Re-export prompt action types for convenience
export type { NoteActionType, FileActionType, StudyToolType };

// Legacy type alias (used by existing action route)
export type AIActionType =
  | "summarize"
  | "explain_simple"
  | "extract_key_terms"
  | "generate_quiz"
  | "create_flashcards";

export type SelectedContentPayload =
  | {
      kind: "note";
      subjectName: string;
      title: string;
      content: string;
    }
  | {
      kind: "file";
      subjectName: string;
      name: string;
      type: string;
      size: number;
      textContent?: string;
    };

// ── Unified AI result shapes ─────────────────────────────────────────

export type AITextResult = {
  type: "text";
  title: string;
  content: string;
};

export type AITermsResult = {
  type: "terms";
  title: string;
  terms: { term: string; definition: string }[];
};

export type AIQuizResult = {
  type: "quiz";
  title: string;
  questions: { question: string; answer: string }[];
};

export type AIFlashcardsResult = {
  type: "flashcards";
  title: string;
  cards: { front: string; back: string }[];
};

export type AIStudyGuideResult = {
  type: "study_guide";
  title: string;
  sections: { heading: string; points: string[]; reviewQuestion: string }[];
};

export type AIKeyPointsResult = {
  type: "key_points";
  title: string;
  points: string[];
};

export type AIStudyPlanResult = {
  type: "study_plan";
  title: string;
  plan: { phase: string; duration: string; priority: "high" | "medium" | "low"; tasks: string[] }[];
};

export type AIStepsResult = {
  type: "steps";
  title: string;
  steps: { step: number; heading: string; explanation: string }[];
};

export type AIChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type AIResultUnion =
  | AITextResult
  | AITermsResult
  | AIQuizResult
  | AIFlashcardsResult
  | AIStudyGuideResult
  | AIKeyPointsResult
  | AIStudyPlanResult
  | AIStepsResult;

// Legacy result type for backward compatibility
export type AIResult =
  | {
      action: "summarize" | "explain_simple";
      title: string;
      paragraphs: string[];
    }
  | {
      action: "extract_key_terms";
      title: string;
      terms: string[];
    }
  | {
      action: "generate_quiz";
      title: string;
      questions: { q: string; a: string }[];
    }
  | {
      action: "create_flashcards";
      title: string;
      cards: { front: string; back: string }[];
    };

