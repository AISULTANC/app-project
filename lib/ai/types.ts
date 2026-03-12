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
    };

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

