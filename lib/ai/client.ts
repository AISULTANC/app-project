import type { AIActionType, AIResult, SelectedContentPayload } from "./types";

type ActionRequest = {
  action: AIActionType;
  source: SelectedContentPayload;
};

type ActionResponse = {
  result: AIResult;
};

// Frontend-facing helper: call our API route, with nicer error messages.
export async function runAIAction(
  payload: ActionRequest
): Promise<AIResult> {
  const res = await fetch("/api/ai/action", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = `AI request failed (${res.status})`;
    let code: string | undefined;

    try {
      const data = await res.json();
      if (typeof data?.error === "string" && data.error.trim().length > 0) {
        message = data.error;
      }
      if (typeof data?.code === "string") {
        code = data.code;
      }
    } catch {
      const text = await res.text().catch(() => "");
      if (text) {
        message = text;
      }
    }

    const err: any = new Error(message);
    const lower = message.toLowerCase();

    if (res.status === 429 || lower.includes("insufficient_quota") || lower.includes("no available quota")) {
      err.code = "INSUFFICIENT_QUOTA";
    } else if (code) {
      err.code = code;
    }

    throw err;
  }

  const data = (await res.json()) as ActionResponse;
  return data.result;
}

