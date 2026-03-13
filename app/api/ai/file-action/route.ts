import { NextResponse } from "next/server";

import { generateText, handleGroqError } from "@/lib/ai/groq";
import {
  fileActionSystem,
  fileActionUser,
  type FileActionType,
} from "@/lib/ai/prompts";
import type { AIResultUnion } from "@/lib/ai/types";

type RequestBody = {
  action: FileActionType;
  fileName: string;
  fileContent: string;
  subjectName: string;
};

const VALID_ACTIONS: FileActionType[] = [
  "summarize",
  "extract_key_points",
  "generate_quiz",
  "explain_simple",
  "create_flashcards",
];

function parseResult(raw: string, action: FileActionType): AIResultUnion {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/```\s*$/, "");
  }

  try {
    const parsed = JSON.parse(cleaned);

    switch (action) {
      case "summarize":
      case "explain_simple":
        return {
          type: "text",
          title: parsed.title || "Result",
          content: parsed.content || cleaned,
        };
      case "extract_key_points":
        return {
          type: "key_points",
          title: parsed.title || "Key Points",
          points: Array.isArray(parsed.points) ? parsed.points : [],
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
    !json.fileName
  ) {
    return NextResponse.json(
      { error: "Invalid request. Provide action, fileName, fileContent, and subjectName." },
      { status: 400 }
    );
  }

  try {
    const system = fileActionSystem(json.action);
    const user = fileActionUser(json.fileName, json.fileContent, json.subjectName);
    const text = await generateText(system, user);
    const result = parseResult(text, json.action);
    return NextResponse.json({ result });
  } catch (err) {
    const { message, status } = handleGroqError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
