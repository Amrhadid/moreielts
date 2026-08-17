/**
 * Anthropic Claude client for the two grading functions.
 *
 * The API key lives only in the Edge Function environment and is never sent to
 * the browser. Every result records MODEL_VERSION so a re-grade can be
 * distinguished from an original score.
 */
export const MODEL_VERSION = "claude-sonnet-5";

interface AnthropicContentBlock {
  type: string;
  text?: string;
}

export async function callClaude(
  system: string,
  userContent: string,
  maxTokens = 2000,
): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": Deno.env.get("ANTHROPIC_API_KEY")!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL_VERSION,
      max_tokens: maxTokens,
      temperature: 0,
      system,
      messages: [{ role: "user", content: userContent }],
    }),
  });

  if (!response.ok) {
    throw new Error(`anthropic_error_${response.status}: ${await response.text()}`);
  }

  const body = await response.json();
  const text = (body.content as AnthropicContentBlock[])
    .filter((block) => block.type === "text")
    .map((block) => block.text ?? "")
    .join("");

  if (!text) throw new Error("anthropic_empty_response");
  return text;
}

/**
 * Claude is instructed to return only JSON, but a stray prose wrapper would
 * otherwise crash the function, so pull the outermost JSON object out.
 */
export function parseStrictJson<T>(raw: string): T {
  const trimmed = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/, "");
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("model_returned_non_json");
  return JSON.parse(trimmed.slice(start, end + 1)) as T;
}

/** Every criterion band must be 0-9 in half steps. */
export function assertBand(value: unknown, field: string): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || n > 9 || Math.round(n * 2) !== n * 2) {
    throw new Error(`invalid_band_for_${field}`);
  }
  return n;
}
