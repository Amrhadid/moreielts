/**
 * AI correction for the practice module.
 *
 * Practice grading goes through the `claude-completion` Edge Function that is
 * already deployed and keyed on the Supabase project MoreIELTS shares with
 * MoreTOEFL (the browser never sees an Anthropic key). The function takes a
 * prompt, an optional system prompt and model parameters, and returns the
 * model's text; this client mirrors the MoreTOEFL drill grader, so the two
 * sites share one wired grading path and the function is maintained in the
 * MoreTOEFL repository.
 *
 * The model is left to the function's own default so it is controlled in one
 * place; the strict-JSON parsing and band validation below match the
 * grade-writing / grade-speaking functions in supabase/functions.
 */

export interface ClaudeOptions {
  prompt: string;
  system?: string;
  maxTokens?: number;
  temperature?: number;
}

interface EdgeSuccess {
  content: string;
  usage?: { input_tokens: number; output_tokens: number };
}

interface EdgeFailure {
  error: string;
}

export const AI_FUNCTION_NAME = "claude-completion";

export async function callClaude(options: ClaudeOptions): Promise<string> {
  const body: Record<string, unknown> = { prompt: options.prompt };
  if (options.system) body.system = options.system;
  if (options.maxTokens !== undefined) body.max_tokens = options.maxTokens;
  if (options.temperature !== undefined) body.temperature = options.temperature;

  let data: EdgeSuccess | EdgeFailure | null;
  try {
    // Imported here rather than at module level so the pure helpers below can
    // be unit tested without a configured Supabase client.
    const { invokeFunction } = await import("~/lib/supabase");
    data = await invokeFunction<EdgeSuccess | EdgeFailure>(AI_FUNCTION_NAME, body);
  } catch (error) {
    throw new Error(describeInvokeError(error));
  }

  if (!data || "error" in data) {
    throw new Error(
      `The AI grader returned an error: ${(data as EdgeFailure | null)?.error ?? "unknown"}`,
    );
  }
  if (!data.content) throw new Error("The AI grader returned an empty response.");
  return data.content;
}

function describeInvokeError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (/Failed to send|fetch/i.test(message)) {
    return "Could not reach the AI grader. Check your connection and that the site is configured against a Supabase project that has the claude-completion function deployed.";
  }
  if (/401|unauthori[sz]ed|JWT/i.test(message)) {
    return "Your session has expired. Sign in again to get AI feedback.";
  }
  return `AI grading failed: ${message}`;
}

/**
 * The model is instructed to return only JSON, but a stray prose wrapper or
 * code fence would otherwise crash the caller, so pull the outermost object
 * out.
 */
export function parseStrictJson<T>(raw: string): T {
  const trimmed = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("The AI grader returned an unreadable response. Please try again.");
  }
  try {
    return JSON.parse(trimmed.slice(start, end + 1)) as T;
  } catch {
    throw new Error("The AI grader returned an unreadable response. Please try again.");
  }
}

/** Every criterion band must be 0-9 in half steps; anything else is rejected. */
export function assertBand(value: unknown, field: string): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || n > 9 || Math.round(n * 2) !== n * 2) {
    throw new Error(`The AI grader returned an invalid band for ${field}.`);
  }
  return n;
}
