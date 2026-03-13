const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

function getApiKey(): string {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error(
      "GROQ_API_KEY is missing. Add it to .env.local and restart the dev server."
    );
  }
  return key;
}

type GroqMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

async function callGroq(messages: GroqMessage[]): Promise<string> {
  const key = getApiKey();

  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!res.ok) {
    let errMsg = `Groq API error (${res.status})`;
    try {
      const errBody = await res.json();
      if (errBody?.error?.message) {
        errMsg = errBody.error.message;
      }
    } catch {
      // ignore parse error
    }
    const err = new Error(errMsg);
    (err as any).status = res.status;
    throw err;
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content || typeof content !== "string") {
    throw new Error("Groq returned an empty response. Please try again.");
  }

  return content.trim();
}

// ── Public API ──────────────────────────────────────────────────────

export async function generateText(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  return callGroq([
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ]);
}

export async function generateChat(
  systemPrompt: string,
  messages: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  const groqMessages: GroqMessage[] = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];
  return callGroq(groqMessages);
}

export async function generateChatStream(
  systemPrompt: string,
  messages: { role: "user" | "assistant"; content: string }[]
): Promise<ReadableStream<Uint8Array>> {
  const key = getApiKey();
  const groqMessages: GroqMessage[] = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: groqMessages,
      temperature: 0.7,
      max_tokens: 4096,
      stream: true,
    }),
  });

  if (!res.ok) {
    let errMsg = `Groq API error (${res.status})`;
    try {
      const errBody = await res.json();
      if (errBody?.error?.message) {
        errMsg = errBody.error.message;
      }
    } catch {
      // ignore parse error
    }
    const err = new Error(errMsg);
    (err as any).status = res.status;
    throw err;
  }

  if (!res.body) {
    throw new Error("Response body is null");
  }

  return res.body;
}

export function handleGroqError(err: unknown): {
  message: string;
  status: number;
} {
  const msg =
    err instanceof Error ? err.message : "AI request failed. Please try again.";
  const httpStatus = (err as any)?.status;

  console.error("Groq error:", msg);

  if (msg.includes("GROQ_API_KEY is missing")) {
    return { message: msg, status: 500 };
  }
  if (msg.includes("Invalid API Key") || msg.includes("invalid_api_key") || httpStatus === 401) {
    return {
      message: "Invalid Groq API key. Check GROQ_API_KEY in .env.local.",
      status: 401,
    };
  }
  if (msg.includes("rate_limit") || msg.includes("Rate limit") || httpStatus === 429) {
    return {
      message: "Groq rate limit reached. Wait a moment and try again.",
      status: 429,
    };
  }
  if (msg.includes("model_not_found") || msg.includes("does not exist") || httpStatus === 404) {
    return {
      message: "Groq model not found. Check the MODEL constant in lib/ai/groq.ts.",
      status: 404,
    };
  }
  if (msg.includes("empty response")) {
    return { message: msg, status: 502 };
  }

  return { message: msg, status: httpStatus || 500 };
}
