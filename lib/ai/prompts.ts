export type NoteActionType =
  | "summarize"
  | "explain_simple"
  | "extract_key_terms"
  | "generate_quiz"
  | "create_flashcards"
  | "improve_writing"
  | "study_guide";

export type FileActionType =
  | "summarize"
  | "extract_key_points"
  | "generate_quiz"
  | "explain_simple"
  | "create_flashcards";

export type StudyToolType =
  | "generate_quiz"
  | "generate_flashcards"
  | "study_plan"
  | "explain_step_by_step"
  | "key_terms";

const JSON_INSTRUCTION =
  "IMPORTANT: Respond ONLY with valid JSON. No markdown, no code fences, no extra text.";

// ── Note action prompts ──────────────────────────────────────────────

export function noteActionSystem(action: NoteActionType): string {
  const base = "You are an expert study assistant helping a student learn.";

  switch (action) {
    case "summarize":
      return `${base} Given a student's note, create a concise, useful summary that captures the key ideas. ${JSON_INSTRUCTION} Format: { "title": "string", "content": "string (use \\n for paragraphs)" }`;

    case "explain_simple":
      return `${base} Explain the content of this note in simple, beginner-friendly language. Use analogies and short sentences. ${JSON_INSTRUCTION} Format: { "title": "string", "content": "string (use \\n for paragraphs)" }`;

    case "extract_key_terms":
      return `${base} Extract the most important terms and concepts from this note. Provide a clear, short definition for each. ${JSON_INSTRUCTION} Format: { "title": "string", "terms": [{ "term": "string", "definition": "string" }] }`;

    case "generate_quiz":
      return `${base} Generate 5 quiz questions with answers based on this note. Questions should test understanding, not just memorization. ${JSON_INSTRUCTION} Format: { "title": "string", "questions": [{ "question": "string", "answer": "string" }] }`;

    case "create_flashcards":
      return `${base} Create 6-8 flashcards from this note. Each card should have a front (question/term) and back (answer/definition). ${JSON_INSTRUCTION} Format: { "title": "string", "cards": [{ "front": "string", "back": "string" }] }`;

    case "improve_writing":
      return `${base} Improve the writing of this note. Fix grammar, improve clarity, and enhance structure while keeping the original meaning. Return the improved version. ${JSON_INSTRUCTION} Format: { "title": "string", "content": "string (the improved note text)" }`;

    case "study_guide":
      return `${base} Convert this note into a structured study guide with sections, key points, and review questions. ${JSON_INSTRUCTION} Format: { "title": "string", "sections": [{ "heading": "string", "points": ["string"], "reviewQuestion": "string" }] }`;
  }
}

export function noteActionUser(
  noteTitle: string,
  noteContent: string,
  subjectName: string
): string {
  return `Subject: ${subjectName}\nNote title: ${noteTitle}\n\nNote content:\n${noteContent || "(empty note)"}`;
}

// ── File action prompts ──────────────────────────────────────────────

export function fileActionSystem(action: FileActionType): string {
  const base =
    "You are an expert study assistant. A student has uploaded a file with the following extracted text content.";

  switch (action) {
    case "summarize":
      return `${base} Create a concise summary capturing the main ideas. ${JSON_INSTRUCTION} Format: { "title": "string", "content": "string (use \\n for paragraphs)" }`;

    case "extract_key_points":
      return `${base} Extract the most important key points as a bullet list. ${JSON_INSTRUCTION} Format: { "title": "string", "points": ["string"] }`;

    case "generate_quiz":
      return `${base} Generate 5 quiz questions with answers from this file content. ${JSON_INSTRUCTION} Format: { "title": "string", "questions": [{ "question": "string", "answer": "string" }] }`;

    case "explain_simple":
      return `${base} Explain the content simply for a beginner student. ${JSON_INSTRUCTION} Format: { "title": "string", "content": "string (use \\n for paragraphs)" }`;

    case "create_flashcards":
      return `${base} Create 6-8 flashcards from this file content. ${JSON_INSTRUCTION} Format: { "title": "string", "cards": [{ "front": "string", "back": "string" }] }`;
  }
}

export function fileActionUser(
  fileName: string,
  fileContent: string,
  subjectName: string
): string {
  return `Subject: ${subjectName}\nFile: ${fileName}\n\nFile content:\n${fileContent || "(no text could be extracted from this file)"}`;
}

// ── Chat prompts ─────────────────────────────────────────────────────

export function chatSystem(
  subjectName: string,
  subjectDescription: string,
  context?: { noteTitle?: string; noteContent?: string; fileName?: string; fileContent?: string }
): string {
  let sys = `You are a helpful, friendly study assistant for the subject "${subjectName}". Subject description: ${subjectDescription}. Help the student understand concepts, answer questions, explain topics, and study effectively. Keep responses clear and well-structured. Use markdown formatting for readability.`;

  if (context?.noteTitle) {
    sys += `\n\nThe student has a note selected titled "${context.noteTitle}". Note content:\n${context.noteContent || "(empty)"}`;
  }
  if (context?.fileName) {
    sys += `\n\nThe student has a file selected: "${context.fileName}". File content:\n${context.fileContent || "(no text extracted)"}`;
  }

  return sys;
}

// ── Study tool prompts ───────────────────────────────────────────────

export function studyToolSystem(tool: StudyToolType): string {
  const base = "You are an expert study assistant.";

  switch (tool) {
    case "generate_quiz":
      return `${base} Generate 8 quiz questions with answers based on the provided topic/content. Mix question types: multiple choice concepts, short answer, and application questions. ${JSON_INSTRUCTION} Format: { "title": "string", "questions": [{ "question": "string", "answer": "string" }] }`;

    case "generate_flashcards":
      return `${base} Create 10 study flashcards for the provided topic/content. Cover key terms, concepts, and important facts. ${JSON_INSTRUCTION} Format: { "title": "string", "cards": [{ "front": "string", "back": "string" }] }`;

    case "study_plan":
      return `${base} Create a structured study plan for the provided topic. Include time estimates, priority levels, and specific study activities. ${JSON_INSTRUCTION} Format: { "title": "string", "plan": [{ "phase": "string", "duration": "string", "priority": "high" | "medium" | "low", "tasks": ["string"] }] }`;

    case "explain_step_by_step":
      return `${base} Explain the provided topic step by step, building from basics to more complex ideas. Use clear language and examples. ${JSON_INSTRUCTION} Format: { "title": "string", "steps": [{ "step": number, "heading": "string", "explanation": "string" }] }`;

    case "key_terms":
      return `${base} List the most important terms and definitions for the provided topic. ${JSON_INSTRUCTION} Format: { "title": "string", "terms": [{ "term": "string", "definition": "string" }] }`;
  }
}

export function studyToolUser(
  topic: string,
  subjectName?: string,
  additionalContent?: string
): string {
  let prompt = "";
  if (subjectName) prompt += `Subject: ${subjectName}\n`;
  prompt += `Topic: ${topic}`;
  if (additionalContent) {
    prompt += `\n\nAdditional content:\n${additionalContent}`;
  }
  return prompt;
}
