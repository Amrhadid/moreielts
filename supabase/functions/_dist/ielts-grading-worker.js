// supabase/functions/_shared/cors.ts
var ALLOWED_ORIGIN = Deno.env.get("SITE_URL") ?? "*";
var corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};
function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// supabase/functions/_shared/supabase.ts
import { createClient } from "jsr:@supabase/supabase-js@2";
function serviceClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false } }
  );
}

// supabase/functions/_shared/anthropic.ts
var MODEL_VERSION = Deno.env.get("GRADING_MODEL") ?? "claude-opus-5-5";
async function callClaude(system, userContent, maxTokens = 16e3) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": Deno.env.get("ANTHROPIC_API_KEY"),
      "anthropic-version": "2023-06-01",
      // Lets a refused request be retried on a fallback model server-side.
      "anthropic-beta": "server-side-fallback-2026-07-01"
    },
    // No temperature: current models reject sampling parameters. Calibration
    // comes from the rubric in the system prompt instead.
    body: JSON.stringify({
      model: MODEL_VERSION,
      max_tokens: maxTokens,
      output_config: { effort: "medium" },
      fallbacks: "default",
      system,
      messages: [{ role: "user", content: userContent }]
    })
  });
  if (!response.ok) {
    throw new Error(`anthropic_error_${response.status}: ${await response.text()}`);
  }
  const body = await response.json();
  if (body.stop_reason === "refusal") throw new Error("anthropic_refusal");
  if (body.stop_reason === "max_tokens") throw new Error("anthropic_truncated");
  const text = body.content.filter((block) => block.type === "text").map((block) => block.text ?? "").join("");
  if (!text) throw new Error("anthropic_empty_response");
  return text;
}
function parseStrictJson(raw) {
  const trimmed = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/, "");
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("model_returned_non_json");
  return JSON.parse(trimmed.slice(start, end + 1));
}
function assertBand(value, field) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || n > 9 || Math.round(n * 2) !== n * 2) {
    throw new Error(`invalid_band_for_${field}`);
  }
  return n;
}

// supabase/functions/_shared/speech.ts
var API = "https://api.elevenlabs.io/v1";
var key = () => {
  const value = Deno.env.get("ELEVENLABS_API_KEY");
  if (!value) throw new Error("elevenlabs_key_missing");
  return value;
};
var TRANSCRIBE_MODEL = Deno.env.get("IELTS_STT_MODEL") ?? "scribe_v1";
var TTS_MODEL = Deno.env.get("IELTS_TTS_MODEL") ?? "eleven_multilingual_v2";
async function transcribe(audio) {
  const form = new FormData();
  const extension = (audio.type.split("/")[1] ?? "webm").split(";")[0];
  form.append("file", audio, `answer.${extension}`);
  form.append("model_id", TRANSCRIBE_MODEL);
  form.append("language_code", "en");
  form.append("timestamps_granularity", "word");
  form.append("tag_audio_events", "false");
  const response = await fetch(`${API}/speech-to-text`, {
    method: "POST",
    headers: { "xi-api-key": key() },
    body: form
  });
  if (!response.ok) {
    throw new Error(`elevenlabs_stt_${response.status}: ${(await response.text()).slice(0, 300)}`);
  }
  const body = await response.json();
  const words = (body.words ?? []).filter((w) => (w.type ?? "word") === "word").map((w) => ({ word: w.text, start: Number(w.start), end: Number(w.end) }));
  return {
    text: String(body.text ?? "").trim(),
    durationSeconds: words.length ? words[words.length - 1].end : 0,
    words
  };
}

// src/lib/scoring.ts
function roundToHalfBand(value) {
  const scaled = value * 2;
  const rounded = Math.floor(scaled + 0.5 + 1e-9);
  return Math.min(9, Math.max(0, rounded / 2));
}
function rawScoreToBand(raw, section, variant, table) {
  const row = table.find(
    (r) => r.section === section && r.variant === variant && raw >= r.raw_min && raw <= r.raw_max
  );
  if (!row) {
    throw new Error(
      `No band_conversion row for ${variant}/${section} raw score ${raw}`
    );
  }
  return Number(row.band);
}
function writingTaskBand(criteria) {
  const mean = (criteria.task_achievement + criteria.coherence_cohesion + criteria.lexical_resource + criteria.grammatical_range) / 4;
  return roundToHalfBand(mean);
}
function writingSectionBand(task1, task2) {
  return roundToHalfBand((task1 + 2 * task2) / 3);
}
function speakingBand(criteria) {
  const mean = (criteria.fluency_coherence + criteria.lexical_resource + criteria.grammatical_range + criteria.pronunciation) / 4;
  return roundToHalfBand(mean);
}
function speakingSectionBand(partBands) {
  if (partBands.length === 0) return 0;
  const mean = partBands.reduce((a, b) => a + b, 0) / partBands.length;
  return roundToHalfBand(mean);
}
function overallBand(components) {
  const values = [
    components.listening,
    components.reading,
    components.writing,
    components.speaking
  ];
  const unrounded = values.reduce((a, b) => a + b, 0) / values.length;
  return {
    // Stored as numeric(3,2), so two decimals is the meaningful precision.
    unrounded: Math.round(unrounded * 100) / 100,
    band: roundToHalfBand(unrounded)
  };
}
function rawScore(responses) {
  return responses.filter((r) => r.isCorrect).length;
}

// src/lib/speech-stats.ts
var SINGLE_FILLERS = /* @__PURE__ */ new Set(["um", "umm", "uh", "uhm", "er", "erm", "ah", "hmm", "mm"]);
var DOUBLE_FILLERS = /* @__PURE__ */ new Set(["you know", "i mean", "sort of", "kind of"]);
function clean(word) {
  return word.toLowerCase().replace(/[^a-z']/g, "");
}
function speechStats(words, fallbackText = "") {
  const tokens = words.length ? words.map((w) => clean(w.word)).filter(Boolean) : fallbackText.split(/\s+/).map(clean).filter(Boolean);
  const counts = /* @__PURE__ */ new Map();
  const bump = (filler) => counts.set(filler, (counts.get(filler) ?? 0) + 1);
  for (let i = 0; i < tokens.length; i++) {
    const pair = `${tokens[i]} ${tokens[i + 1] ?? ""}`;
    if (DOUBLE_FILLERS.has(pair)) {
      bump(pair);
      i++;
    } else if (SINGLE_FILLERS.has(tokens[i])) {
      bump(tokens[i]);
    }
  }
  const fillerCount = [...counts.values()].reduce((a, b) => a + b, 0);
  let longPauses = 0;
  for (let i = 1; i < words.length; i++) {
    if (words[i].start - words[i - 1].end >= 2) longPauses++;
  }
  const speakingSeconds = words.length ? Math.max(0, words[words.length - 1].end - words[0].start) : 0;
  const wordCount = tokens.length;
  return {
    wordCount,
    speakingSeconds: Math.round(speakingSeconds),
    wordsPerMinute: speakingSeconds > 0 ? Math.round(wordCount / speakingSeconds * 60) : 0,
    fillerCount,
    fillerRate: wordCount ? Math.round(fillerCount / wordCount * 1e3) / 10 : 0,
    longPauses,
    topFillers: [...counts.entries()].map(([filler, count]) => ({ filler, count })).sort((a, b) => b.count - a.count).slice(0, 5)
  };
}

// supabase/functions/_shared/grading.ts
var WRITING_PROMPT = `You are a certified IELTS Writing examiner applying the public band descriptors.

You assess ONE task against exactly four criteria:
- Task Achievement (Task 1) or Task Response (Task 2): does the response cover the requirements, and for Task 1 is there a clear overview of the main trends without inventing data?
- Coherence and Cohesion: paragraphing, logical progression, cohesive devices, referencing.
- Lexical Resource: range, precision, collocation, repetition, and errors of word choice.
- Grammatical Range and Accuracy: sentence variety, control of complex forms, error density and whether errors impede meaning.

Rules you must follow:
1. Award each criterion a band from 0 to 9 in HALF BANDS only (e.g. 6, 6.5, 7). Never award a band outside that scale and never use percentages.
2. Judge only what is written. Do not reward intent or penalise opinions.
3. Under-length responses are penalised under Task Achievement/Response: below 150 words for Task 1 or 250 words for Task 2.
4. Every criterion must cite at least one SHORT VERBATIM QUOTE from the candidate's own response as evidence. Quote exactly; never paraphrase into the quote field and never invent text that is not present.
5. Be calibrated, not generous. A band 7 requires genuine control; a response with frequent basic errors is not band 7.
6. "corrections": up to 10 of the most instructive errors. "original" must be copied verbatim from the response; "corrected" is the minimal fix; "why" is one short sentence naming the rule.
7. "model_answer": rewrite the candidate's OWN response so it would score about one band higher overall (cap at 9). Keep their ideas, position and structure where possible; change what the band descriptors reward. Keep it to the task's typical length.

Return STRICT JSON only. No markdown, no commentary, no code fence. Use exactly this shape:
{
  "task_achievement": <number>,
  "coherence_cohesion": <number>,
  "lexical_resource": <number>,
  "grammatical_range": <number>,
  "feedback": {
    "task_achievement": { "comment": "<2-3 sentences>", "evidence": ["<quote>"] },
    "coherence_cohesion": { "comment": "<2-3 sentences>", "evidence": ["<quote>"] },
    "lexical_resource": { "comment": "<2-3 sentences>", "evidence": ["<quote>"] },
    "grammatical_range": { "comment": "<2-3 sentences>", "evidence": ["<quote>"] },
    "summary": "<2-3 sentences on the single highest-value improvement>",
    "corrections": [ { "original": "<verbatim>", "corrected": "<fix>", "why": "<rule>" } ],
    "model_answer": "<the improved response>"
  }
}`;
async function gradeWritingText(taskNumber, prompt, answer) {
  const wordCount = answer.split(/\s+/).filter(Boolean).length;
  const minimum = taskNumber === 1 ? 150 : 250;
  const raw = await callClaude(
    WRITING_PROMPT,
    [
      `TASK NUMBER: ${taskNumber}`,
      `MINIMUM REQUIRED LENGTH: ${minimum} words`,
      `ACTUAL LENGTH: ${wordCount} words`,
      "",
      "TASK PROMPT:",
      prompt,
      "",
      "CANDIDATE RESPONSE:",
      answer
    ].join("\n")
  );
  const result = parseStrictJson(raw);
  const criteria = {
    task_achievement: assertBand(result.task_achievement, "task_achievement"),
    coherence_cohesion: assertBand(result.coherence_cohesion, "coherence_cohesion"),
    lexical_resource: assertBand(result.lexical_resource, "lexical_resource"),
    grammatical_range: assertBand(result.grammatical_range, "grammatical_range")
  };
  const feedback = { ...result.feedback ?? {} };
  if (Array.isArray(feedback.corrections)) {
    feedback.corrections = feedback.corrections.filter(
      (c) => typeof c.original === "string" && c.original.length > 0 && answer.includes(c.original)
    );
  }
  feedback.word_count = wordCount;
  return {
    ...criteria,
    // Computed here from the four criteria, not taken from the model: the
    // arithmetic is ours and is unit tested.
    task_band: writingTaskBand(criteria),
    feedback,
    model_version: MODEL_VERSION
  };
}
async function gradeAttemptWriting(db, attemptId, taskNumber) {
  const { data: attempt } = await db.from("ielts_attempts").select("form_id").eq("id", attemptId).single();
  if (!attempt) throw new Error("attempt_not_found");
  const { data: groups } = await db.from("ielts_item_groups").select("id, passage_text, test_sections:ielts_test_sections!inner ( section, form_id ), questions:ielts_questions ( id )").eq("test_sections.form_id", attempt.form_id).eq("test_sections.section", "writing").eq("part_number", taskNumber);
  const group = groups?.[0];
  if (!group) throw new Error("writing_task_not_found");
  const questionIds = (group.questions ?? []).map((q) => q.id);
  const { data: responses } = await db.from("ielts_responses").select("answer").eq("attempt_id", attemptId).in("question_id", questionIds.length ? questionIds : ["00000000-0000-0000-0000-000000000000"]);
  const answer = responses?.[0]?.answer?.trim() ?? "";
  const grade = answer ? await gradeWritingText(taskNumber, group.passage_text ?? "", answer) : {
    task_achievement: 0,
    coherence_cohesion: 0,
    lexical_resource: 0,
    grammatical_range: 0,
    task_band: 0,
    feedback: { summary: "No response was submitted for this task." },
    model_version: MODEL_VERSION
  };
  const { error } = await db.from("ielts_writing_scores").upsert(
    { attempt_id: attemptId, task_number: taskNumber, ...grade },
    { onConflict: "attempt_id,task_number" }
  );
  if (error) throw error;
  return grade;
}
async function gradeEssay(db, submissionId) {
  const { data: sub } = await db.from("ielts_writing_submissions").select("id, task_number, prompt, body, parent_id").eq("id", submissionId).single();
  if (!sub) throw new Error("submission_not_found");
  const grade = await gradeWritingText(sub.task_number, sub.prompt, sub.body);
  if (sub.parent_id) {
    const { data: parent } = await db.from("ielts_writing_submissions").select("task_band, task_achievement, coherence_cohesion, lexical_resource, grammatical_range").eq("id", sub.parent_id).maybeSingle();
    if (parent) grade.feedback.previous = parent;
  }
  const { error } = await db.from("ielts_writing_submissions").update({ ...grade, status: "graded", graded_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", submissionId);
  if (error) throw error;
}
async function fetchRecording(db, ref) {
  if (ref.startsWith("storage:")) {
    const rest = ref.slice("storage:".length);
    const slash = rest.indexOf("/");
    const { data, error } = await db.storage.from(rest.slice(0, slash)).download(rest.slice(slash + 1));
    if (error || !data) throw new Error(`recording_download_failed: ${error?.message ?? "empty"}`);
    return data;
  }
  const response = await fetch(ref);
  if (!response.ok) throw new Error(`recording_fetch_failed_${response.status}`);
  return await response.blob();
}
var SPEAKING_PROMPT = `You are a certified IELTS Speaking examiner applying the public band descriptors.

You assess ONE part of the Speaking test against exactly four criteria:
- Fluency and Coherence: speech rate and continuity, hesitation, self-correction, discourse markers, and whether ideas connect logically.
- Lexical Resource: range and precision of vocabulary, paraphrase when a word is missing, collocation, idiomatic control.
- Grammatical Range and Accuracy: variety of structures attempted, control of complex forms, error density and whether errors impede understanding.
- Pronunciation: you only have a machine transcript. Use the measured speech statistics and any transcription markers of unclear speech as evidence. Where there is no pronunciation evidence, award a neutral band close to the other criteria and say so explicitly rather than inventing evidence.

Rules you must follow:
1. Award each criterion a band from 0 to 9 in HALF BANDS only (e.g. 6, 6.5, 7). Never use percentages.
2. Judge only the transcript and statistics supplied. Do not assume anything the candidate did not say.
3. Part 1 is short familiar exchanges, Part 2 is a 1-2 minute monologue, Part 3 is abstract discussion. Calibrate expectations to the part.
4. Every criterion must cite at least one SHORT VERBATIM QUOTE from the candidate's own words as evidence. Quote exactly; never invent text.
5. Be calibrated, not generous.
6. "better_answer": a short model answer (Part 1: 2-3 sentences per question; Part 2: about 200 words; Part 3: 4-5 sentences per question) that keeps the candidate's ideas but shows band 7.5+ language.

Return STRICT JSON only. No markdown, no commentary, no code fence. Use exactly this shape:
{
  "fluency_coherence": <number>,
  "lexical_resource": <number>,
  "grammatical_range": <number>,
  "pronunciation": <number>,
  "feedback": {
    "fluency_coherence": { "comment": "<2-3 sentences>", "evidence": ["<quote>"] },
    "lexical_resource": { "comment": "<2-3 sentences>", "evidence": ["<quote>"] },
    "grammatical_range": { "comment": "<2-3 sentences>", "evidence": ["<quote>"] },
    "pronunciation": { "comment": "<2-3 sentences>", "evidence": ["<quote>"] },
    "summary": "<2-3 sentences on the single highest-value improvement>",
    "better_answer": "<model answer>"
  }
}`;
async function gradeAttemptSpeaking(db, attemptId, partNumber) {
  const { data: attempt } = await db.from("ielts_attempts").select("form_id").eq("id", attemptId).single();
  if (!attempt) throw new Error("attempt_not_found");
  const { data: groups } = await db.from("ielts_item_groups").select(
    "id, passage_text, shared_instructions, test_sections:ielts_test_sections!inner ( section, form_id ), questions:ielts_questions ( id, prompt, order_index )"
  ).eq("test_sections.form_id", attempt.form_id).eq("test_sections.section", "speaking").eq("part_number", partNumber);
  const group = groups?.[0];
  if (!group) throw new Error("speaking_part_not_found");
  const questions = [...group.questions ?? []].sort(
    (a, b) => a.order_index - b.order_index
  );
  const { data: responses } = await db.from("ielts_responses").select("question_id, audio_url, answer").eq("attempt_id", attemptId).in("question_id", questions.length ? questions.map((q) => q.id) : ["00000000-0000-0000-0000-000000000000"]);
  const byQuestion = new Map((responses ?? []).map((r) => [r.question_id, r]));
  const { data: existing } = await db.from("ielts_speaking_scores").select("transcript, feedback").eq("attempt_id", attemptId).eq("part_number", partNumber).maybeSingle();
  const lines = [];
  const allWords = [];
  let offset = 0;
  if (existing?.transcript) {
    lines.push(existing.transcript);
  } else {
    for (const question of questions) {
      const response = byQuestion.get(question.id);
      const ref = response?.audio_url ?? response?.answer ?? "";
      if (!ref) continue;
      const t = await transcribe(await fetchRecording(db, ref));
      lines.push(`EXAMINER: ${question.prompt}
CANDIDATE: ${t.text || "(silence)"}`);
      const base = offset - (t.words[0]?.start ?? 0);
      for (const w of t.words) allWords.push({ ...w, start: w.start + base, end: w.end + base });
      offset = (allWords[allWords.length - 1]?.end ?? offset) + 0.5;
    }
  }
  const transcript = lines.join("\n\n").trim();
  const stats = allWords.length ? speechStats(allWords) : existing?.feedback?.stats ?? null;
  if (!transcript) {
    const { error: error2 } = await db.from("ielts_speaking_scores").upsert(
      {
        attempt_id: attemptId,
        part_number: partNumber,
        fluency_coherence: 0,
        lexical_resource: 0,
        grammatical_range: 0,
        pronunciation: 0,
        part_band: 0,
        transcript: "",
        feedback: { summary: "No recording was submitted for this part." },
        model_version: MODEL_VERSION
      },
      { onConflict: "attempt_id,part_number" }
    );
    if (error2) throw error2;
    return;
  }
  const raw = await callClaude(
    SPEAKING_PROMPT,
    [
      `SPEAKING PART: ${partNumber}`,
      `PART INSTRUCTIONS: ${group.shared_instructions ?? "n/a"}`,
      `CUE CARD / PROMPTS: ${group.passage_text ?? "n/a"}`,
      stats ? `MEASURED SPEECH STATISTICS: ${JSON.stringify(stats)}` : "MEASURED SPEECH STATISTICS: unavailable",
      "",
      "TRANSCRIPT:",
      transcript
    ].join("\n")
  );
  const result = parseStrictJson(raw);
  const criteria = {
    fluency_coherence: assertBand(result.fluency_coherence, "fluency_coherence"),
    lexical_resource: assertBand(result.lexical_resource, "lexical_resource"),
    grammatical_range: assertBand(result.grammatical_range, "grammatical_range"),
    pronunciation: assertBand(result.pronunciation, "pronunciation")
  };
  const { error } = await db.from("ielts_speaking_scores").upsert(
    {
      attempt_id: attemptId,
      part_number: partNumber,
      ...criteria,
      part_band: speakingBand(criteria),
      transcript,
      feedback: { ...result.feedback ?? {}, stats },
      model_version: MODEL_VERSION
    },
    { onConflict: "attempt_id,part_number" }
  );
  if (error) throw error;
}

// supabase/functions/_shared/attempt-score.ts
async function scoreAttempt(db, attemptId, options = {}) {
  const { data: attempt, error } = await db.from("ielts_attempts").select("id, user_id, form_id, submitted_at, test_forms:ielts_test_forms ( variant, scoring_version )").eq("id", attemptId).single();
  if (error || !attempt) throw new Error("attempt_not_found");
  const form = attempt.test_forms;
  const version = form?.scoring_version ?? "v1";
  const { data: marked } = await db.from("ielts_responses").select(
    `id, is_correct,
       questions:ielts_questions!inner ( item_groups:ielts_item_groups!inner ( part_number, test_sections:ielts_test_sections!inner ( section ) ) )`
  ).eq("attempt_id", attemptId).not("is_correct", "is", null);
  const { data: conversion } = await db.from("ielts_band_conversion").select("variant, section, raw_min, raw_max, band, version").eq("version", version);
  const table = conversion ?? [];
  const variant = form.variant;
  function sectionBand(code) {
    const rows = (marked ?? []).filter((m) => m.questions.item_groups.test_sections.section === code).map((m) => ({
      questionId: m.id,
      typeCode: "",
      partNumber: m.questions.item_groups.part_number,
      isCorrect: m.is_correct === true
    }));
    const raw = rawScore(rows);
    return { raw, band: rawScoreToBand(raw, code, variant, table) };
  }
  const listening = sectionBand("listening");
  const reading = sectionBand("reading");
  const { data: writingRows } = await db.from("ielts_writing_scores").select("task_number, task_band").eq("attempt_id", attemptId);
  const task1 = writingRows?.find((r) => r.task_number === 1)?.task_band ?? null;
  const task2 = writingRows?.find((r) => r.task_number === 2)?.task_band ?? null;
  const writingBand = task1 !== null && task2 !== null ? writingSectionBand(Number(task1), Number(task2)) : null;
  const { data: speakingRows } = await db.from("ielts_speaking_scores").select("part_band").eq("attempt_id", attemptId);
  const speakingBand2 = speakingRows?.length ? speakingSectionBand(speakingRows.map((r) => Number(r.part_band))) : null;
  const complete = writingBand !== null && speakingBand2 !== null;
  const overall = complete ? overallBand({
    listening: listening.band,
    reading: reading.band,
    writing: writingBand,
    speaking: speakingBand2
  }) : null;
  await db.from("ielts_attempt_scores").upsert(
    {
      attempt_id: attemptId,
      listening_raw: listening.raw,
      listening_band: listening.band,
      reading_raw: reading.raw,
      reading_band: reading.band,
      writing_band: writingBand,
      speaking_band: speakingBand2,
      overall_unrounded: overall?.unrounded ?? null,
      overall_band: overall?.band ?? null,
      scoring_version: version
    },
    { onConflict: "attempt_id" }
  );
  if (options.close || attempt.submitted_at) {
    await db.from("ielts_attempts").update({
      status: complete ? "completed" : "awaiting_speaking",
      ...options.close ? { submitted_at: (/* @__PURE__ */ new Date()).toISOString(), section_deadline_at: null } : {}
    }).eq("id", attemptId);
    if (complete && overall) {
      await db.from("ielts_learners").upsert({ user_id: attempt.user_id, current_band: overall.band }, { onConflict: "user_id" });
    }
  }
  return { listening, reading, writingBand, speakingBand: speakingBand2, overall, complete };
}

// supabase/functions/ielts-grading-worker/index.ts
Deno.serve(async (req) => {
  const db = serviceClient();
  const { data: keyOk } = await db.rpc("ielts_check_worker_key", {
    p_key: req.headers.get("x-grade-key")
  });
  if (keyOk !== true) return json({ error: "forbidden" }, 403);
  const body = await req.json().catch(() => ({}));
  const { data: jobs, error } = await db.rpc("ielts_claim_grading_jobs", {
    p_limit: Math.min(Number(body.limit ?? 5), 10),
    p_job: body.job_id ?? null
  });
  if (error) return json({ error: error.message }, 500);
  const results = await Promise.all(
    (jobs ?? []).map(async (job) => {
      try {
        if (job.kind === "writing") {
          await gradeAttemptWriting(db, job.attempt_id, job.part_number);
        } else if (job.kind === "speaking") {
          await gradeAttemptSpeaking(db, job.attempt_id, job.part_number);
        } else {
          await gradeEssay(db, job.submission_id);
        }
        await db.from("ielts_grading_jobs").update({ status: "done", finished_at: (/* @__PURE__ */ new Date()).toISOString(), last_error: null }).eq("id", job.id);
        return { id: job.id, ok: true };
      } catch (err) {
        const message = String(err.message ?? err).slice(0, 1e3);
        console.error("grading job failed", job.id, message);
        const exhausted = job.tries >= 5;
        await db.from("ielts_grading_jobs").update({
          status: exhausted ? "failed" : "pending",
          last_error: message,
          ...exhausted ? { finished_at: (/* @__PURE__ */ new Date()).toISOString() } : {}
        }).eq("id", job.id);
        if (exhausted && job.kind === "essay") {
          await db.from("ielts_writing_submissions").update({ status: "failed" }).eq("id", job.submission_id);
        }
        return { id: job.id, ok: false, error: message };
      }
    })
  );
  const attemptIds = new Set(
    (jobs ?? []).filter((j) => j.attempt_id).map((j) => j.attempt_id)
  );
  for (const attemptId of attemptIds) {
    try {
      await scoreAttempt(db, attemptId);
    } catch (err) {
      console.error("rescore failed", attemptId, err);
    }
  }
  return json({ processed: results.length, results });
});
