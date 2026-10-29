/**
 * Sits one full mock exam through the real API and waits for the bands.
 *
 * This is the proof that the production pipeline works end to end: attempt
 * RPCs, answer saves, the ielts-submit-attempt function per section and for
 * the whole attempt, the grading queue, the worker (Claude + transcription)
 * and the final re-score. It drives the same calls the players make, so no
 * browser is needed.
 *
 *   E2E_REFRESH_TOKEN=<token> npm run test:e2e:mock
 *
 * The token belongs to the account the exam is sat as. Use the admin (admins
 * count as Premium): sign in to the site, open DevTools → Application →
 * Local Storage → the `sb-<ref>-auth-token` entry, and copy `refresh_token`.
 * Alternatively E2E_EMAIL / E2E_PASSWORD for an account that has a password.
 *
 * Options (env): E2E_FORM_SLUG (default mock-academic-1), E2E_AUDIO (a
 * speech MP3/WebM/M4A used as every speaking answer; default the practice
 * listening clip), E2E_TIMEOUT_MINUTES (default 10), SUPABASE_URL and
 * SUPABASE_ANON_KEY (default the shared project).
 */
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const URL_ = process.env.SUPABASE_URL ?? "https://nlsuvapjkznatczghvay.supabase.co";
const ANON = process.env.SUPABASE_ANON_KEY ?? "sb_publishable_7ehXXiaMvUlfBQX_zMbDbw_ppOo0lxc";
const FORM_SLUG = process.env.E2E_FORM_SLUG ?? "mock-academic-1";
const AUDIO = process.env.E2E_AUDIO ?? path.join(ROOT, "public/audio/practice/listening-walking-club-1.mp3");
const TIMEOUT_MS = Number(process.env.E2E_TIMEOUT_MINUTES ?? 10) * 60_000;
const ORDER = ["listening", "reading", "writing", "speaking"];

const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
const fail = (m) => {
  console.error("FAIL:", m);
  process.exit(1);
};

const supabase = createClient(URL_, ANON, { auth: { persistSession: false, autoRefreshToken: false } });

async function signIn() {
  if (process.env.E2E_REFRESH_TOKEN) {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: process.env.E2E_REFRESH_TOKEN });
    if (error || !data.session) fail(`refresh token rejected: ${error?.message}`);
    return data.session.user;
  }
  if (process.env.E2E_EMAIL && process.env.E2E_PASSWORD) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: process.env.E2E_EMAIL,
      password: process.env.E2E_PASSWORD,
    });
    if (error || !data.session) fail(`password sign-in rejected: ${error?.message}`);
    return data.session.user;
  }
  fail("set E2E_REFRESH_TOKEN (or E2E_EMAIL and E2E_PASSWORD); see the header of this file");
}

async function rpc(name, args) {
  const { data, error } = await supabase.rpc(name, args);
  if (error) fail(`${name}: ${error.message}`);
  return data;
}

async function invoke(name, body) {
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) {
    let detail = error.message;
    try {
      detail = JSON.stringify(await error.context?.json());
    } catch {
      /* not JSON */
    }
    fail(`${name}: ${detail}`);
  }
  return data;
}

/** A plausible answer for any renderer: an option value or a short word. */
function answerFor(q) {
  if (q.renderer === "checkbox") return JSON.stringify((q.options ?? []).slice(0, 2).map((o) => o.value));
  if (q.renderer === "radio" || q.renderer === "dropdown") return q.options?.[0]?.value ?? "A";
  return "test";
}

const WORDS =
  "The chart and the question both ask for a clear and well organised answer, so this response explains the main trend, compares the figures and finishes with an overview. ";
const essay = (min) => {
  let text = "";
  while (text.split(/\s+/).length < min + 10) text += WORDS;
  return text.trim();
};

const user = await signIn();
log("signed in as", user.email ?? user.id);

const learner = await rpc("ielts_ensure_learner");
const { data: premium } = await supabase.rpc("ielts_is_premium", { p_user: user.id });
if (!premium) fail("this account is not Premium (and not an admin); the exam cannot start");
log("learner ok; premium until", learner?.premium_expires_at ?? "(admin)");

const { data: form, error: formError } = await supabase
  .from("ielts_test_forms")
  .select("id, title, slug, variant, purpose")
  .eq("slug", FORM_SLUG)
  .eq("is_published", true)
  .maybeSingle();
if (formError || !form) fail(`form ${FORM_SLUG} not found or not published`);
log("form", form.title);

// Reuse an open attempt if there is one (start_attempt resumes), but a
// finished exam on this form needs a fresh run: nothing to do about that
// here except say so.
const attemptId = await rpc("ielts_start_attempt", { p_form_id: form.id });
const { data: before } = await supabase.from("ielts_attempts").select("status, sections_done").eq("id", attemptId).single();
log("attempt", attemptId, before?.status, "done:", before?.sections_done);

const audioBytes = await readFile(AUDIO);
const audioType = AUDIO.endsWith(".webm") ? "audio/webm" : AUDIO.endsWith(".m4a") ? "audio/mp4" : "audio/mpeg";
const audioExt = audioType === "audio/webm" ? "webm" : audioType === "audio/mp4" ? "m4a" : "mp3";

for (const section of ORDER) {
  if (before?.sections_done?.includes(section)) {
    log(section, "already submitted on this attempt, skipping");
    continue;
  }
  const start = await rpc("ielts_start_section", { p_attempt_id: attemptId, p_section: section });
  log(section, "started;", start?.[0]?.remaining_seconds, "s on the clock");

  const { data: sectionRow } = await supabase
    .from("ielts_test_sections")
    .select("id")
    .eq("form_id", form.id)
    .eq("section", section)
    .single();
  const { data: groups } = await supabase
    .from("ielts_item_groups")
    .select("id, part_number")
    .eq("section_id", sectionRow.id)
    .order("order_index");
  const { data: questions } = await supabase
    .from("ielts_questions_public")
    .select("id, group_id, renderer, options, order_index")
    .in("group_id", groups.map((g) => g.id))
    .order("order_index");
  if (!questions?.length) fail(`${section}: no questions visible (Premium view empty?)`);

  let saved = 0;
  for (const q of questions) {
    let answer;
    let audioUrl = null;
    if (section === "writing") {
      const part = groups.find((g) => g.id === q.group_id)?.part_number ?? 2;
      answer = essay(part === 1 ? 150 : 250);
    } else if (section === "speaking") {
      const storagePath = `${user.id}/${attemptId}/${q.id}.${audioExt}`;
      const { error: upErr } = await supabase.storage
        .from("ielts-recordings")
        .upload(storagePath, audioBytes, { upsert: true, contentType: audioType });
      if (upErr) fail(`speaking upload: ${upErr.message}`);
      answer = `storage:ielts-recordings/${storagePath}`;
      audioUrl = answer;
    } else {
      answer = answerFor(q);
    }
    await rpc("ielts_save_response", {
      p_attempt_id: attemptId,
      p_question_id: q.id,
      p_answer: answer,
      p_time_spent_ms: 1000,
      p_audio_url: audioUrl,
    });
    saved += 1;
  }
  log(section, `saved ${saved}/${questions.length} answers`);

  const result = await invoke("ielts-submit-attempt", {
    attempt_id: attemptId,
    ...(section === "speaking" ? {} : { section }),
  });
  log(section, "submitted →", JSON.stringify({ status: result.status, listening: result.listening, reading: result.reading }));
}

// Grading runs in the background: the worker is kicked at submit and swept
// every minute. Poll until the attempt is completed or the time is up.
log("waiting for Writing and Speaking grades (up to", TIMEOUT_MS / 60000, "minutes)…");
const deadline = Date.now() + TIMEOUT_MS;
let lastSummary = "";
while (Date.now() < deadline) {
  const { data: jobs } = await supabase
    .from("ielts_grading_jobs")
    .select("kind, part_number, status, tries, last_error")
    .eq("attempt_id", attemptId)
    .order("kind")
    .order("part_number");
  const summary = (jobs ?? []).map((j) => `${j.kind[0]}${j.part_number}:${j.status}`).join(" ");
  if (summary !== lastSummary) {
    log("jobs", summary || "(none yet)");
    for (const j of jobs ?? []) if (j.last_error) log(`  ${j.kind} ${j.part_number} error:`, j.last_error.slice(0, 160));
    lastSummary = summary;
  }
  const { data: attempt } = await supabase.from("ielts_attempts").select("status").eq("id", attemptId).single();
  if (attempt?.status === "completed") break;
  if ((jobs ?? []).length && jobs.every((j) => j.status === "failed")) fail("every grading job failed; see errors above");
  await new Promise((r) => setTimeout(r, 5000));
}

const { data: scores } = await supabase.from("ielts_attempt_scores").select("*").eq("attempt_id", attemptId).maybeSingle();
const { data: final } = await supabase.from("ielts_attempts").select("status").eq("id", attemptId).single();
log("attempt status:", final?.status);
log("bands:", JSON.stringify({
  listening: scores?.listening_band,
  reading: scores?.reading_band,
  writing: scores?.writing_band,
  speaking: scores?.speaking_band,
  overall: scores?.overall_band,
}));
if (final?.status !== "completed") fail("the attempt did not reach completed in time");
if (scores?.overall_band == null) fail("no overall band was written");
log("PASS: full mock graded end to end →", `/results/${attemptId}`);
