import { NextResponse } from "next/server";

import { generateText, handleGroqError } from "@/lib/ai/groq";
import {
  studyToolSystem,
  studyToolUser,
  type StudyToolType,
} from "@/lib/ai/prompts";
import type { AIResultUnion } from "@/lib/ai/types";

type RequestBody = {
  tool: StudyToolType;
  topic: string;
  subjectName?: string;
  additionalContent?: string;
};

const VALID_TOOLS: StudyToolType[] = [
  "generate_quiz",
  "generate_flashcards",
  "study_plan",
  "explain_step_by_step",
  "key_terms",
];

function parseResult(raw: string, tool: StudyToolType): AIResultUnion {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/```\s*$/, "");
  }

  try {
    const parsed = JSON.parse(cleaned);

    switch (tool) {
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
      case "generate_flashcards":
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
      case "study_plan":
        return {
          type: "study_plan",
          title: parsed.title || "Study Plan",
          plan: Array.isArray(parsed.plan)
            ? parsed.plan.map((p: any) => ({
                phase: p.phase || "",
                duration: p.duration || "",
                priority: p.priority || "medium",
                tasks: Array.isArray(p.tasks) ? p.tasks : [],
              }))
            : [],
        };
      case "explain_step_by_step":
        return {
          type: "steps",
          title: parsed.title || "Step-by-Step",
          steps: Array.isArray(parsed.steps)
            ? parsed.steps.map((s: any, i: number) => ({
                step: s.step || i + 1,
                heading: s.heading || "",
                explanation: s.explanation || "",
              }))
            : [],
        };
      case "key_terms":
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
      default:
        return { type: "text", title: "Result", content: cleaned };
    }
  } catch {
    return { type: "text", title: "AI Result", content: raw };
  }
}

export async function POST(req: Request) {
  const json = (await req.json().catch(() => null)) as RequestBody | null;

  if (!json || !json.tool || !VALID_TOOLS.includes(json.tool) || !json.topic) {
    return NextResponse.json(
      { error: "Invalid request. Provide tool and topic." },
      { status: 400 }
    );
  }

  try {
    const system = studyToolSystem(json.tool);
    const user = studyToolUser(json.topic, json.subjectName, json.additionalContent);
    const text = await generateText(system, user);
    const result = parseResult(text, json.tool);
    return NextResponse.json({ result });
  } catch (err) {
    const { message, status } = handleGroqError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
