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
function preflight() {
  return new Response("ok", { headers: corsHeaders });
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
async function getCaller(req) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const anon = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_ANON_KEY"),
    { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false } }
  );
  const { data, error } = await anon.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

// src/lib/answer-check.ts
var QUOTE_MAP = {
  "\u2018": "'",
  "\u2019": "'",
  "\u201A": "'",
  "\u201B": "'",
  "\u201C": '"',
  "\u201D": '"',
  "\u201E": '"',
  "\xAB": '"',
  "\xBB": '"'
};
var DASH_MAP = {
  "\u2010": "-",
  "\u2011": "-",
  "\u2012": "-",
  "\u2013": "-",
  "\u2014": "-",
  "\u2015": "-",
  "\u2212": "-"
};
function normalizeText(input) {
  let out = input.normalize("NFKC");
  out = out.replace(/[\u2018\u2019\u201A\u201B\u201C\u201D\u201E\u00AB\u00BB]/g, (c) => QUOTE_MAP[c] ?? c);
  out = out.replace(/[\u2010\u2011\u2012\u2013\u2014\u2015\u2212]/g, (c) => DASH_MAP[c] ?? c);
  out = out.replace(/[\u00A0\u2007\u202F]/g, " ");
  return out.trim().replace(/\s+/g, " ");
}
function countWords(input) {
  const normalized = normalizeText(input);
  if (!normalized) return 0;
  return normalized.split(" ").filter(Boolean).length;
}
var SPELLING_PAIRS = [
  ["colour", "color"],
  ["favour", "favor"],
  ["labour", "labor"],
  ["neighbour", "neighbor"],
  ["behaviour", "behavior"],
  ["harbour", "harbor"],
  ["honour", "honor"],
  ["humour", "humor"],
  ["rumour", "rumor"],
  ["vapour", "vapor"],
  ["centre", "center"],
  ["metre", "meter"],
  ["litre", "liter"],
  ["theatre", "theater"],
  ["fibre", "fiber"],
  ["calibre", "caliber"],
  ["defence", "defense"],
  ["offence", "offense"],
  ["licence", "license"],
  ["practise", "practice"],
  ["analyse", "analyze"],
  ["organise", "organize"],
  ["recognise", "recognize"],
  ["realise", "realize"],
  ["emphasise", "emphasize"],
  ["specialise", "specialize"],
  ["apologise", "apologize"],
  ["catalogue", "catalog"],
  ["dialogue", "dialog"],
  ["programme", "program"],
  ["grey", "gray"],
  ["tyre", "tire"],
  ["plough", "plow"],
  ["draught", "draft"],
  ["aluminium", "aluminum"],
  ["jewellery", "jewelry"],
  ["storey", "story"],
  ["kerb", "curb"],
  ["mould", "mold"],
  ["smoulder", "smolder"],
  ["aeroplane", "airplane"],
  ["cheque", "check"],
  ["sceptical", "skeptical"],
  ["archaeology", "archeology"],
  ["paediatric", "pediatric"],
  ["oesophagus", "esophagus"],
  ["anaemia", "anemia"],
  ["enrolment", "enrollment"],
  ["fulfil", "fulfill"],
  ["instalment", "installment"],
  ["skilful", "skillful"],
  ["woollen", "woolen"],
  ["travelling", "traveling"],
  ["travelled", "traveled"],
  ["traveller", "traveler"],
  ["cancelled", "canceled"],
  ["cancelling", "canceling"],
  ["labelled", "labeled"],
  ["labelling", "labeling"],
  ["modelling", "modeling"],
  ["signalled", "signaled"],
  ["counsellor", "counselor"],
  ["marvellous", "marvelous"]
];
var US_TO_UK = new Map(SPELLING_PAIRS.map(([uk, us]) => [us, uk]));
function canonicaliseSpellingWord(word) {
  const direct = US_TO_UK.get(word);
  if (direct) return direct;
  if (/i[sz]ation$/.test(word)) return word.replace(/ization$/, "isation");
  if (/i[sz](e|es|ed|ing|er|ers)?$/.test(word) && word.length > 4) {
    return word.replace(/iz(e|es|ed|ing|er|ers)?$/, (m) => m.replace("iz", "is"));
  }
  if (/yze(s|d)?$/.test(word)) return word.replace("yz", "ys");
  return word;
}
function canonicaliseSpelling(text) {
  return text.split(" ").map((w) => {
    const match = /^([a-z]+)(.*)$/.exec(w);
    if (!match) return w;
    return canonicaliseSpellingWord(match[1]) + match[2];
  }).join(" ");
}
var UNITS = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19
};
var TENS = {
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90
};
var ORDINAL_TO_CARDINAL = {
  first: "one",
  second: "two",
  third: "three",
  fifth: "five",
  eighth: "eight",
  ninth: "nine",
  twelfth: "twelve",
  twentieth: "twenty",
  thirtieth: "thirty"
};
var MONTHS = {
  january: "01",
  february: "02",
  march: "03",
  april: "04",
  may: "05",
  june: "06",
  july: "07",
  august: "08",
  september: "09",
  october: "10",
  november: "11",
  december: "12",
  jan: "01",
  feb: "02",
  mar: "03",
  apr: "04",
  jun: "06",
  jul: "07",
  aug: "08",
  sep: "09",
  sept: "09",
  oct: "10",
  nov: "11",
  dec: "12"
};
function wordsToNumber(input) {
  const parts = input.toLowerCase().replace(/-/g, " ").split(" ").filter(Boolean);
  if (parts.length === 0) return null;
  let total = 0;
  let seen = false;
  for (const raw of parts) {
    const part = ORDINAL_TO_CARDINAL[raw] ?? raw.replace(/(th|st|nd|rd)$/, "");
    if (part in UNITS) {
      total += UNITS[part];
      seen = true;
    } else if (part in TENS) {
      total += TENS[part];
      seen = true;
    } else if (part === "hundred") {
      total = (total || 1) * 100;
      seen = true;
    } else if (part === "thousand") {
      total = (total || 1) * 1e3;
      seen = true;
    } else if (part === "and" && seen) {
      continue;
    } else {
      return null;
    }
  }
  return seen ? total : null;
}
function canonicaliseNumeric(token) {
  let out = token.replace(/,(?=\d{3}\b)/g, "");
  if (/^\d+\.\d+$/.test(out)) out = out.replace(/\.?0+$/, "");
  return out;
}
var CURRENCY_WORDS = {
  "\xA3": "gbp",
  pounds: "gbp",
  pound: "gbp",
  $: "usd",
  dollars: "usd",
  dollar: "usd",
  "\u20AC": "eur",
  euros: "eur",
  euro: "eur"
};
function canonicaliseNumbers(text) {
  let out = text;
  out = out.replace(/([\u00A3$\u20AC])\s?(\d[\d.,]*)/g, (_, sym, num) => {
    return `${num} ${CURRENCY_WORDS[sym]}`;
  });
  out = out.split(" ").map((w) => CURRENCY_WORDS[w] ?? w).join(" ");
  out = out.replace(/\b(\d+)(st|nd|rd|th)\b/g, "$1");
  out = out.split(" ").map((w) => /^[\d.,]+$/.test(w) ? canonicaliseNumeric(w) : w).join(" ");
  const words = out.split(" ");
  for (let size = Math.min(4, words.length); size >= 1; size--) {
    for (let i = 0; i + size <= words.length; i++) {
      const slice = words.slice(i, i + size);
      if (slice.some((w) => !/^[a-z-]+$/.test(w))) continue;
      const value = wordsToNumber(slice.join(" "));
      if (value !== null) {
        words.splice(i, size, String(value));
        i = -1;
      }
    }
  }
  out = words.join(" ");
  const tokens = out.split(" ");
  for (let i = 0; i < tokens.length; i++) {
    const month = MONTHS[tokens[i]];
    if (!month) continue;
    const prev = tokens[i - 1];
    const next = tokens[i + 1];
    if (prev && /^\d{1,2}$/.test(prev)) {
      tokens.splice(i - 1, 2, `${month}-${prev.padStart(2, "0")}`);
      i--;
    } else if (next && /^\d{1,2}$/.test(next)) {
      tokens.splice(i, 2, `${month}-${next.padStart(2, "0")}`);
    } else {
      tokens[i] = month;
    }
  }
  return tokens.join(" ");
}
var LEADING_ARTICLE = /^(a|an|the)\s+/;
function singularise(word) {
  if (/(ss|us|is)$/.test(word)) return null;
  if (/ies$/.test(word) && word.length > 4) return word.replace(/ies$/, "y");
  if (/(ches|shes|xes|zes|ses)$/.test(word)) return word.slice(0, -2);
  if (/s$/.test(word) && word.length > 2) return word.slice(0, -1);
  return null;
}
function stripEdgePunctuation(text) {
  return text.replace(/^[."'\s]+/, "").replace(/[.,;:!?"'\s]+$/, "");
}
function answerVariants(input, options) {
  const base = stripEdgePunctuation(normalizeText(input));
  const cased = options.caseSensitive ? base : base.toLowerCase();
  const seeds = /* @__PURE__ */ new Set([cased]);
  if (!options.rules.requireArticle) {
    const withoutArticle = cased.replace(LEADING_ARTICLE, "");
    if (withoutArticle !== cased) seeds.add(withoutArticle);
  }
  const fold = (text) => options.caseSensitive ? text : text.toLowerCase();
  const out = /* @__PURE__ */ new Set();
  for (const seed of seeds) {
    const forms = /* @__PURE__ */ new Set([seed]);
    for (let pass = 0; pass < 2; pass++) {
      for (const form of [...forms]) {
        if (options.spellingPolicy === "lenient") {
          forms.add(canonicaliseSpelling(fold(form)));
        }
        if (!options.rules.requireExactNumberForm) {
          forms.add(canonicaliseNumbers(fold(form)));
        }
        if (options.acceptsPlural) {
          const words = form.split(" ");
          const singular = singularise(words[words.length - 1]);
          if (singular) forms.add([...words.slice(0, -1), singular].join(" "));
        }
      }
    }
    for (const form of forms) out.add(form);
  }
  return out;
}
function checkAnswer(userAnswer, question) {
  const normalized = normalizeText(userAnswer ?? "");
  if (!normalized) return { correct: false, reason: "empty" };
  const limit = question.wordLimit ?? 0;
  if (limit > 0 && countWords(normalized) > limit) {
    return { correct: false, reason: "word_limit_exceeded" };
  }
  const options = {
    caseSensitive: question.caseSensitive === true,
    spellingPolicy: question.spellingPolicy ?? "lenient",
    acceptsPlural: question.acceptsPlural !== false,
    rules: question.scoringRules ?? {}
  };
  const userVariants = answerVariants(normalized, options);
  for (const accepted of question.acceptedAnswers ?? []) {
    const acceptedVariants = answerVariants(accepted, options);
    for (const variant of userVariants) {
      if (acceptedVariants.has(variant)) {
        return { correct: true, matched: accepted };
      }
    }
  }
  return { correct: false, reason: "no_match" };
}
function checkMultiAnswer(userAnswers, question) {
  const accepted = (question.acceptedAnswers ?? []).map(
    (a) => normalizeText(a).toLowerCase()
  );
  const given = (userAnswers ?? []).map((a) => normalizeText(a).toLowerCase());
  if (given.length === 0) return { correct: false, reason: "empty" };
  const givenSet = new Set(given);
  const acceptedSet = new Set(accepted);
  if (givenSet.size !== acceptedSet.size) return { correct: false, reason: "no_match" };
  for (const value of acceptedSet) {
    if (!givenSet.has(value)) return { correct: false, reason: "no_match" };
  }
  return { correct: true, matched: accepted.join(", ") };
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
function writingSectionBand(task1, task2) {
  return roundToHalfBand((task1 + 2 * task2) / 3);
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
  const speakingBand = speakingRows?.length ? speakingSectionBand(speakingRows.map((r) => Number(r.part_band))) : null;
  const complete = writingBand !== null && speakingBand !== null;
  const overall = complete ? overallBand({
    listening: listening.band,
    reading: reading.band,
    writing: writingBand,
    speaking: speakingBand
  }) : null;
  await db.from("ielts_attempt_scores").upsert(
    {
      attempt_id: attemptId,
      listening_raw: listening.raw,
      listening_band: listening.band,
      reading_raw: reading.raw,
      reading_band: reading.band,
      writing_band: writingBand,
      speaking_band: speakingBand,
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
  return { listening, reading, writingBand, speakingBand, overall, complete };
}

// supabase/functions/ielts-submit-attempt/index.ts
function kickWorker(db) {
  const call = db.rpc("ielts_kick_grading").then(({ error }) => {
    if (error) console.error("kickWorker failed", error.message);
  });
  globalThis.EdgeRuntime?.waitUntil?.(call);
}
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return preflight();
  try {
    const user = await getCaller(req);
    if (!user) return json({ error: "unauthorized" }, 401);
    const { attempt_id, section } = await req.json();
    if (!attempt_id) return json({ error: "attempt_id_required" }, 400);
    const db = serviceClient();
    const { data: attempt, error: attemptError } = await db.from("ielts_attempts").select("id, user_id, form_id, status").eq("id", attempt_id).single();
    if (attemptError || !attempt) return json({ error: "attempt_not_found" }, 404);
    if (attempt.user_id !== user.id) return json({ error: "forbidden" }, 403);
    const { data: questions, error: questionsError } = await db.from("ielts_questions").select(
      `id, type_code, accepted_answers, word_limit, spelling_policy,
         accepts_plural, case_sensitive, scoring_rules,
         item_groups:ielts_item_groups!inner (
           part_number,
           test_sections:ielts_test_sections!inner ( section, form_id )
         ),
         question_types:ielts_question_types!inner ( renderer )`
    ).eq("item_groups.test_sections.form_id", attempt.form_id);
    if (questionsError) throw questionsError;
    const { data: responses } = await db.from("ielts_responses").select("id, question_id, answer").eq("attempt_id", attempt_id);
    const responseByQuestion = new Map(
      (responses ?? []).map((r) => [r.question_id, r])
    );
    const marked = [];
    for (const question of questions ?? []) {
      const group = question.item_groups;
      const sectionCode = group.test_sections.section;
      if (sectionCode !== "listening" && sectionCode !== "reading") continue;
      const response = responseByQuestion.get(question.id);
      if (!response) continue;
      const checkable = {
        acceptedAnswers: question.accepted_answers ?? [],
        wordLimit: question.word_limit,
        spellingPolicy: question.spelling_policy,
        acceptsPlural: question.accepts_plural,
        caseSensitive: question.case_sensitive,
        scoringRules: question.scoring_rules ?? {}
      };
      const renderer = question.question_types.renderer;
      let isCorrect;
      if (renderer === "checkbox") {
        let selected = [];
        try {
          const parsed = JSON.parse(response.answer ?? "[]");
          selected = Array.isArray(parsed) ? parsed : [];
        } catch {
          selected = (response.answer ?? "").split(",").map((s) => s.trim());
        }
        isCorrect = checkMultiAnswer(selected, checkable).correct;
      } else {
        isCorrect = checkAnswer(response.answer ?? "", checkable).correct;
      }
      marked.push({
        id: response.id,
        is_correct: isCorrect,
        section: sectionCode,
        part_number: group.part_number
      });
    }
    for (const row of marked) {
      await db.from("ielts_responses").update({ is_correct: row.is_correct }).eq("id", row.id);
    }
    if (!section) {
      const wrong = marked.filter((m) => !m.is_correct);
      if (wrong.length) {
        const answerById = new Map((responses ?? []).map((r) => [r.id, r]));
        await db.from("ielts_mistakes").upsert(
          wrong.map((m) => ({
            user_id: user.id,
            question_id: answerById.get(m.id).question_id,
            last_answer: answerById.get(m.id).answer,
            box: 1,
            due_at: new Date(Date.now() + 864e5).toISOString(),
            source: "mock"
          })),
          // A card answered wrong again goes back to box 1.
          { onConflict: "user_id,question_id" }
        );
      }
    }
    if (!section) {
      const { data: aiGroups } = await db.from("ielts_item_groups").select("part_number, test_sections:ielts_test_sections!inner ( section, form_id )").eq("test_sections.form_id", attempt.form_id).in("test_sections.section", ["writing", "speaking"]);
      const jobs = (aiGroups ?? []).map((g) => ({
        // deno-lint-ignore no-explicit-any
        kind: g.test_sections.section,
        attempt_id,
        part_number: g.part_number,
        user_id: user.id
      }));
      if (jobs.length) {
        const { error: jobError } = await db.from("ielts_grading_jobs").upsert(jobs, { onConflict: "attempt_id,kind,part_number", ignoreDuplicates: true });
        if (jobError) throw jobError;
        kickWorker(db);
      }
    }
    if (section) {
      const { data: current } = await db.from("ielts_attempts").select("sections_done").eq("id", attempt_id).single();
      const done = new Set(current?.sections_done ?? []);
      done.add(section);
      const { error: doneError } = await db.from("ielts_attempts").update({ sections_done: [...done] }).eq("id", attempt_id);
      if (doneError) throw doneError;
    }
    const score = await scoreAttempt(db, attempt_id, { close: !section });
    const { listening, reading, overall, complete } = score;
    const writingBand = score.writingBand;
    const speakingBandValue = score.speakingBand;
    return json({
      attempt_id,
      marked: marked.length,
      listening,
      reading,
      writing_band: writingBand,
      speaking_band: speakingBandValue,
      overall,
      status: complete ? "completed" : "awaiting_speaking"
    });
  } catch (error) {
    console.error("submit-attempt failed", error);
    return new Response(
      JSON.stringify({ error: String(error.message ?? error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
