import { NextResponse } from "next/server";
import OpenAI from "openai";

import type { AIActionType, AIResult, SelectedContentPayload } from "@/lib/ai/types";

type ActionRequestBody = {
  action: AIActionType;
  source: SelectedContentPayload;
};

const MODEL = "gpt-4o-mini";

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
        "You are a study assistant. Given study material, respond with JSON only " +
        "in the shape: { \"action\": \"summarize\", \"title\": string, \"paragraphs\": string[] } " +
        "with a concise summary suitable for a student."
      );
    case "explain_simple":
      return (
        "You are a study assistant. Explain the topic in simple language for a student. " +
        "Respond with JSON only in the shape: { \"action\": \"explain_simple\", \"title\": string, \"paragraphs\": string[] }."
      );
    case "extract_key_terms":
      return (
        "You are a study assistant. Extract key terms and short definitions. " +
        "Respond with JSON only: { \"action\": \"extract_key_terms\", \"title\": string, \"terms\": string[] } " +
        "where each string is 'Term — definition'."
      );
    case "generate_quiz":
      return (
        "You are a study assistant. Generate 5 quiz questions and short answers. " +
        "Respond with JSON only: { \"action\": \"generate_quiz\", \"title\": string, " +
        "\"questions\": [{ \"q\": string, \"a\": string }] }."
      );
    case "create_flashcards":
      return (
        "You are a study assistant. Create 5 flashcards in Q/A style. " +
        "Respond with JSON only: { \"action\": \"create_flashcards\", \"title\": string, " +
        "\"cards\": [{ \"front\": string, \"back\": string }] }."
      );
    default:
      return "You are a helpful study assistant. Respond in the requested JSON format.";
  }
}

function safeParseResult(text: string, action: AIActionType): AIResult {
  try {
    const parsed = JSON.parse(text) as AIResult;
    if (parsed && parsed.action) return parsed;
  } catch {
    // fall through to mock
  }

  // Fallback: minimal mock in case JSON parsing fails
  const header = "AI result";
  if (action === "summarize" || action === "explain_simple") {
    return {
      action,
      title: header,
      paragraphs: [text.slice(0, 400)],
    };
  }
  if (action === "extract_key_terms") {
    return {
      action: "extract_key_terms",
      title: header,
      terms: [text.slice(0, 200)],
    };
  }
  if (action === "generate_quiz") {
    return {
      action: "generate_quiz",
      title: header,
      questions: [{ q: "AI response", a: text.slice(0, 200) }],
    };
  }
  return {
    action: "create_flashcards",
    title: header,
    cards: [{ front: "AI response", back: text.slice(0, 200) }],
  };
}

export async function POST(req: Request) {
  const json = (await req.json().catch(() => null)) as ActionRequestBody | null;
  if (!json || !json.action || !json.source) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  console.log("OpenAI key loaded:", !!apiKey);
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "OPENAI_API_KEY is missing. Add it to .env.local and restart the dev server.",
      },
      { status: 500 }
    );
  }

  const client = new OpenAI({ apiKey });
  const system = systemInstructionFor(json.action);
  const user = buildUserPrompt(json.action, json.source);

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.2,
    });

    const content: any = completion.choices[0]?.message?.content;
    const text =
      typeof content === "string"
        ? content
        : Array.isArray(content)
          ? content.map((p: any) => (typeof p === "string" ? p : p?.text ?? "")).join("")
          : String(content ?? "");

    const result = safeParseResult(text.trim(), json.action);
    return NextResponse.json({ result });
  } catch (err: any) {
    console.error("OpenAI error", err);

    const status = err?.status ?? 500;
    const message = err?.error?.message ?? err?.message ?? "";
    if (status === 429 || message.includes("insufficient_quota")) {
      return NextResponse.json(
        {
          error:
            "Your OpenAI API account has no available quota or billing. Please check your OpenAI billing settings.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "AI request failed. Please try again later." },
      { status: 500 }
    );
  }
}

