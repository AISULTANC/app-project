import { generateChatStream, handleGroqError } from "@/lib/ai/groq";
import { chatSystem } from "@/lib/ai/prompts";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type RequestBody = {
  messages: ChatMessage[];
  subjectName: string;
  subjectDescription: string;
  context?: {
    noteTitle?: string;
    noteContent?: string;
    fileName?: string;
    fileContent?: string;
  };
};

export async function POST(req: Request) {
  const json = (await req.json().catch(() => null)) as RequestBody | null;

  if (
    !json ||
    !Array.isArray(json.messages) ||
    json.messages.length === 0 ||
    !json.subjectName
  ) {
    return new Response(
      JSON.stringify({ error: "Invalid request. Provide messages array and subjectName." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const system = chatSystem(
      json.subjectName,
      json.subjectDescription || "",
      json.context
    );

    const groqStream = await generateChatStream(system, json.messages);
    const reader = groqStream.getReader();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n").filter((line) => line.trim() !== "");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") continue;

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(new TextEncoder().encode(content));
                  }
                } catch {
                  // Skip malformed JSON
                }
              }
            }
          }
        } catch (err) {
          console.error("Stream error:", err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (err) {
    const { message, status } = handleGroqError(err);
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}
