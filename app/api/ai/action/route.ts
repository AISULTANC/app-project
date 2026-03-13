import { NextResponse } from "next/server";

import { generateText, handleGroqError } from "@/lib/ai/groq";
import type { AIActionType, AIResult, SelectedContentPayload } from "@/lib/ai/types";

type ActionRequestBody = {
  action: AIActionType;
  source: SelectedContentPayload;
};

function buildUserPrompt(action: AIActionType, source: SelectedContentPayload): string {
  const baseHeader =
    source.kind === "note"
      ? `Subject: ${source.subjectName}\nNote title: ${source.title}`
      : `Subject: ${source.subjectName}\nFile name: ${source.name}\nType: ${source.type}\nSize: ${source.size} bytes`;

  const content =
    source.kind === "note"
      ? `\n\nNote content:\n${source.content || "(note is empty)"}`
      : "\n\n(Only file metadata is available in this MVP; no full text yet.)";

  return `${baseHeader}${content}`;
}

function systemInstructionFor(action: AIActionType): string {
  switch (action) {
    case "summarize":
      return (
        "You are a study assistant. Given study material, create a concise summary suitable for a student. " +
        "Respond with JSON only in this exact format: { \"action\": \"summarize\", \"title\": \"Summary Title\", \"paragraphs\": [\"First paragraph\", \"Second paragraph\"] }"
      );
    case "explain_simple":
      return (
        "You are a study assistant. Explain the topic in simple language for a student. " +
        "Respond with JSON only in this exact format: { \"action\": \"explain_simple\", \"title\": \"Explanation Title\", \"paragraphs\": [\"First paragraph\", \"Second paragraph\"] }"
      );
    case "extract_key_terms":
      return (
        "You are a study assistant. Extract key terms and short definitions from the study material. " +
        "Respond with JSON only in this exact format: { \"action\": \"extract_key_terms\", \"title\": \"Key Terms\", \"terms\": [\"Term 1 — Definition 1\", \"Term 2 — Definition 2\"] }"
      );
    case "generate_quiz":
      return (
        "You are a study assistant. Generate 5 quiz questions with short answers based on the study material. " +
        "Respond with JSON only in this exact format: { \"action\": \"generate_quiz\", \"title\": \"Quiz Questions\", \"questions\": [{ \"q\": \"Question 1\", \"a\": \"Answer 1\" }, { \"q\": \"Question 2\", \"a\": \"Answer 2\" }] }"
      );
    case "create_flashcards":
      return (
        "You are a study assistant. Create 5 flashcards in Q/A style based on the study material. " +
        "Respond with JSON only in this exact format: { \"action\": \"create_flashcards\", \"title\": \"Flashcards\", \"cards\": [{ \"front\": \"Question 1\", \"back\": \"Answer 1\" }, { \"front\": \"Question 2\", \"back\": \"Answer 2\" }] }"
      );
    default:
      return "You are a helpful study assistant. Respond in the requested JSON format.";
  }
}

function safeParseResult(text: string, action: AIActionType): AIResult {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/```\s*$/, "");
  }

  try {
    const parsed = JSON.parse(cleaned) as AIResult;
    if (parsed && parsed.action) return parsed;
  } catch {
    // fall through to fallback
  }

  const header = "AI result";
  if (action === "summarize" || action === "explain_simple") {
    return { action, title: header, paragraphs: [cleaned.slice(0, 400)] };
  }
  if (action === "extract_key_terms") {
    return { action: "extract_key_terms", title: header, terms: [cleaned.slice(0, 200)] };
  }
  if (action === "generate_quiz") {
    return { action: "generate_quiz", title: header, questions: [{ q: "AI response", a: cleaned.slice(0, 200) }] };
  }
  return { action: "create_flashcards", title: header, cards: [{ front: "AI response", back: cleaned.slice(0, 200) }] };
}

export async function POST(req: Request) {
  const json = (await req.json().catch(() => null)) as ActionRequestBody | null;
  if (!json || !json.action || !json.source) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const system = systemInstructionFor(json.action);
    const user = buildUserPrompt(json.action, json.source);
    const text = await generateText(system, user);
    const parsedResult = safeParseResult(text, json.action);
    return NextResponse.json({ result: parsedResult });
  } catch (err) {
    const { message, status } = handleGroqError(err);
    return NextResponse.json({ error: message }, { status });
  }
}

