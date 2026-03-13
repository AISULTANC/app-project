import { NextResponse } from "next/server";

import { generateText, handleGroqError } from "@/lib/ai/groq";
import {
  noteActionSystem,
  noteActionUser,
  type NoteActionType,
} from "@/lib/ai/prompts";
import type { AIResultUnion } from "@/lib/ai/types";

type RequestBody = {
  action: NoteActionType;
  noteTitle: string;
  noteContent: string;
  subjectName: string;
};

const VALID_ACTIONS: NoteActionType[] = [
  "summarize",
  "explain_simple",
  "extract_key_terms",
  "generate_quiz",
  "create_flashcards",
  "improve_writing",
  "study_guide",
];

function parseResult(raw: string, action: NoteActionType): AIResultUnion {
  // Strip markdown code fences if present
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/```\s*$/, "");
  }

  try {
    const parsed = JSON.parse(cleaned);

    switch (action) {
      case "summarize":
      case "explain_simple":
      case "improve_writing":
        return {
          type: "text",
          title: parsed.title || "Result",
          content: parsed.content || cleaned,
        };
      case "extract_key_terms":
        return {
          type: "terms",
          title: parsed.title || "Key Terms",
          terms: Array.isArray(parsed.terms)
            ? parsed.terms.map((t: any) =>
                typeof t === "string"
                  ? { term: t, definition: "" }
                  : { term: t.term || "", definition: t.definition || "" }
              )
            : [],
        };
      case "generate_quiz":
        return {
          type: "quiz",
          title: parsed.title || "Quiz",
          questions: Array.isArray(parsed.questions)
            ? parsed.questions.map((q: any) => ({
                question: q.question || q.q || "",
                answer: q.answer || q.a || "",
              }))
            : [],
        };
      case "create_flashcards":
        return {
          type: "flashcards",
          title: parsed.title || "Flashcards",
          cards: Array.isArray(parsed.cards)
            ? parsed.cards.map((c: any) => ({
                front: c.front || "",
                back: c.back || "",
              }))
            : [],
        };
      case "study_guide":
        return {
          type: "study_guide",
          title: parsed.title || "Study Guide",
          sections: Array.isArray(parsed.sections)
            ? parsed.sections.map((s: any) => ({
                heading: s.heading || "",
                points: Array.isArray(s.points) ? s.points : [],
                reviewQuestion: s.reviewQuestion || "",
              }))
            : [],
        };
      default:
        return { type: "text", title: "Result", content: cleaned };
    }
  } catch {
    return { type: "text", title: "AI Result", content: raw };
  }
}

export async function POST(req: Request) {
  const json = (await req.json().catch(() => null)) as RequestBody | null;

  if (
    !json ||
    !json.action ||
    !VALID_ACTIONS.includes(json.action) ||
    !json.noteTitle
  ) {
    return NextResponse.json(
      { error: "Invalid request. Provide action, noteTitle, noteContent, and subjectName." },
      { status: 400 }
    );
  }

  try {
    const system = noteActionSystem(json.action);
    const user = noteActionUser(json.noteTitle, json.noteContent, json.subjectName);
    const text = await generateText(system, user);
    const result = parseResult(text, json.action);
    return NextResponse.json({ result });
  } catch (err) {
    const { message, status } = handleGroqError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
