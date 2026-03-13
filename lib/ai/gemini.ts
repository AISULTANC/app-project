import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL = "gemini-2.0-flash";

let _client: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error(
      "GEMINI_API_KEY is missing. Add it to .env.local and restart the dev server."
    );
  }
  if (!_client) {
    _client = new GoogleGenerativeAI(key);
  }
  return _client;
}

export async function generateText(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: MODEL });
  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
  const result = await model.generateContent(fullPrompt);
  const response = await result.response;
  return response.text().trim();
}

export async function generateChat(
  systemPrompt: string,
  messages: { role: "user" | "model"; parts: { text: string }[] }[]
): Promise<string> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: MODEL });
  const chat = model.startChat({
    history: messages.slice(0, -1).map((m) => ({
      role: m.role,
      parts: m.parts,
    })),
  });
  const last = messages[messages.length - 1];
  const result = await chat.sendMessage(
    `${systemPrompt}\n\n${last.parts[0].text}`
  );
  const response = await result.response;
  return response.text().trim();
}

export function handleGeminiError(err: unknown): {
  message: string;
  status: number;
} {
  const msg =
    err instanceof Error ? err.message : "AI request failed. Please try again.";

  console.error("Gemini error:", msg);

  if (msg.includes("API_KEY_INVALID") || msg.includes("INVALID_ARGUMENT")) {
    return {
      message: "Invalid Gemini API key. Check GEMINI_API_KEY in .env.local.",
      status: 401,
    };
  }
  if (msg.includes("429") || msg.includes("QUOTA") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("quota") || msg.includes("Too Many Requests")) {
    return {
      message: "Gemini API quota exceeded. Wait a minute and try again, or check your billing at https://ai.google.dev/gemini-api/docs/rate-limits",
      status: 429,
    };
  }
  if (msg.includes("404") || msg.includes("not found for API version") || msg.includes("Not Found")) {
    return {
      message: "Gemini model not found. The model may have been deprecated — check lib/ai/gemini.ts.",
      status: 404,
    };
  }
  if (msg.includes("CONTENT_FILTER")) {
    return {
      message:
        "Content was blocked by safety filters. Try rephrasing your request.",
      status: 400,
    };
  }
  if (msg.includes("GEMINI_API_KEY is missing")) {
    return { message: msg, status: 500 };
  }

  return { message: msg, status: 500 };
}
