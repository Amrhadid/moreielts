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

// supabase/functions/_shared/check.ts
function toSelection(answer) {
  if (Array.isArray(answer)) return answer.map(String);
  if (typeof answer !== "string") return [];
  try {
    const parsed = JSON.parse(answer);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
  }
  return answer.split(",").map((s) => s.trim()).filter(Boolean);
}
function isCorrect(question, answer) {
  const checkable = {
    acceptedAnswers: question.accepted_answers ?? [],
    wordLimit: question.word_limit,
    spellingPolicy: question.spelling_policy,
    acceptsPlural: question.accepts_plural,
    caseSensitive: question.case_sensitive,
    scoringRules: question.scoring_rules ?? {}
  };
  if (question.renderer === "checkbox") {
    return checkMultiAnswer(toSelection(answer), checkable).correct;
  }
  return checkAnswer(typeof answer === "string" ? answer : String(answer ?? ""), checkable).correct;
}
function storedAnswer(answer) {
  return Array.isArray(answer) ? JSON.stringify(answer) : String(answer ?? "");
}

// supabase/functions/ielts-drill/index.ts
var BOX_DAYS = [0, 1, 3, 7, 14, 30];
var PUBLIC_QUESTION = "id, group_id, type_code, prompt, options, word_limit, order_index";
var KEYED_QUESTION = "id, group_id, prompt, accepted_answers, explanation, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, question_types:ielts_question_types!inner ( renderer )";
var GROUP_FIELDS = "id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, test_sections:ielts_test_sections!inner ( section, test_forms:ielts_test_forms!inner ( id, title, is_published, is_premium, difficulty, purpose ) )";
function markable(q) {
  return { ...q, renderer: q.question_types.renderer };
}
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return preflight();
  try {
    const user = await getCaller(req);
    if (!user) return json({ error: "unauthorized" }, 401);
    const db = serviceClient();
    const body = await req.json();
    const { data: premium } = await db.rpc("ielts_is_premium", { p_user: user.id });
    if (!premium) return json({ error: "premium_required" }, 403);
    if (body.action === "start") {
      const typeCode = String(body.type_code ?? "");
      const { data: candidates, error } = await db.from("ielts_questions").select(`group_id, item_groups:ielts_item_groups!inner ( ${GROUP_FIELDS} )`).eq("type_code", typeCode);
      if (error) throw error;
      const groups = /* @__PURE__ */ new Map();
      for (const c of candidates ?? []) {
        const form = c.item_groups.test_sections.test_forms;
        if (!form.is_published) continue;
        if (form.purpose !== "practice") continue;
        if (form.is_premium && !premium) continue;
        if (body.difficulty && form.difficulty !== body.difficulty) continue;
        groups.set(c.group_id, c.item_groups);
      }
      if (groups.size === 0) {
        return json({ error: premium ? "no_content_for_type" : "no_free_content_for_type" }, 404);
      }
      const { data: recent } = await db.from("ielts_drill_attempts").select("group_id").eq("user_id", user.id).eq("type_code", typeCode).order("started_at", { ascending: false }).limit(50);
      const seen = new Set((recent ?? []).map((r) => r.group_id));
      const fresh = [...groups.keys()].filter((id) => !seen.has(id));
      const pool = fresh.length ? fresh : [...groups.keys()];
      const groupId = pool[Math.floor(Math.random() * pool.length)];
      const group = groups.get(groupId);
      const { data: questions } = await db.from("ielts_questions").select(PUBLIC_QUESTION).eq("group_id", groupId).eq("type_code", typeCode).order("order_index");
      const { data: drill, error: drillError } = await db.from("ielts_drill_attempts").insert({
        user_id: user.id,
        type_code: typeCode,
        group_id: groupId,
        question_ids: (questions ?? []).map((q) => q.id),
        total: questions?.length ?? 0
      }).select("id").single();
      if (drillError) throw drillError;
      return json({
        drill_id: drill.id,
        group: {
          id: group.id,
          part_number: group.part_number,
          section: group.test_sections.section,
          form_title: group.test_sections.test_forms.title,
          passage_text: group.passage_text,
          audio_url: group.audio_url,
          image_url: group.image_url,
          instructions: group.shared_instructions,
          image_caption: group.metadata?.image_caption ?? null
        },
        questions
      });
    }
    if (body.action === "submit") {
      const { data: drill } = await db.from("ielts_drill_attempts").select("id, user_id, group_id, question_ids, submitted_at").eq("id", body.drill_id).single();
      if (!drill || drill.user_id !== user.id) return json({ error: "drill_not_found" }, 404);
      if (drill.submitted_at) return json({ error: "already_submitted" }, 409);
      const answers = body.answers ?? {};
      const { data: questions } = await db.from("ielts_questions").select(KEYED_QUESTION).in("id", drill.question_ids).order("order_index");
      const review = (questions ?? []).map((q) => ({
        question_id: q.id,
        prompt: q.prompt,
        answer: answers[q.id] ?? "",
        correct: isCorrect(markable(q), answers[q.id] ?? ""),
        accepted_answers: q.accepted_answers,
        explanation: q.explanation
      }));
      const correct = review.filter((r) => r.correct).length;
      await db.from("ielts_drill_responses").insert(
        review.map((r) => ({
          drill_id: drill.id,
          question_id: r.question_id,
          answer: storedAnswer(r.answer),
          is_correct: r.correct
        }))
      );
      await db.from("ielts_drill_attempts").update({ correct, submitted_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", drill.id);
      const wrong = review.filter((r) => !r.correct);
      if (wrong.length) {
        await db.from("ielts_mistakes").upsert(
          wrong.map((r) => ({
            user_id: user.id,
            question_id: r.question_id,
            last_answer: storedAnswer(r.answer),
            box: 1,
            due_at: new Date(Date.now() + 864e5).toISOString(),
            source: "ielts-drill"
          })),
          { onConflict: "user_id,question_id" }
        );
      }
      const { data: script } = await db.from("ielts_item_group_scripts").select("transcript").eq("group_id", drill.group_id).maybeSingle();
      return json({ correct, total: review.length, review, transcript: script?.transcript ?? null });
    }
    if (body.action === "due") {
      const { data: cards } = await db.from("ielts_mistakes").select("question_id, box, due_at, last_answer, times_wrong, times_right").eq("user_id", user.id).lt("box", 6).lte("due_at", (/* @__PURE__ */ new Date()).toISOString()).order("due_at").limit(Math.min(Number(body.limit ?? 20), 50));
      const ids = (cards ?? []).map((c) => c.question_id);
      if (!ids.length) return json({ cards: [] });
      const { data: questions } = await db.from("ielts_questions").select(`${PUBLIC_QUESTION}, question_types:ielts_question_types!inner ( renderer, label ), item_groups:ielts_item_groups!inner ( ${GROUP_FIELDS} )`).in("id", ids);
      const byId = new Map((questions ?? []).map((q) => [q.id, q]));
      return json({
        cards: (cards ?? []).filter((c) => byId.has(c.question_id)).map((c) => {
          const q = byId.get(c.question_id);
          const g = q.item_groups;
          return {
            ...c,
            question: {
              id: q.id,
              type_code: q.type_code,
              type_label: q.question_types.label,
              renderer: q.question_types.renderer,
              prompt: q.prompt,
              options: q.options,
              word_limit: q.word_limit
            },
            group: {
              section: g.test_sections.section,
              passage_text: g.passage_text,
              audio_url: g.audio_url,
              image_url: g.image_url,
              instructions: g.shared_instructions
            }
          };
        })
      });
    }
    if (body.action === "review") {
      const { data: card } = await db.from("ielts_mistakes").select("box, times_right, times_wrong").eq("user_id", user.id).eq("question_id", body.question_id).maybeSingle();
      if (!card) return json({ error: "card_not_found" }, 404);
      const { data: q } = await db.from("ielts_questions").select(KEYED_QUESTION).eq("id", body.question_id).single();
      if (!q) return json({ error: "question_not_found" }, 404);
      const correct = isCorrect(markable(q), body.answer ?? "");
      const box = correct ? Math.min(6, card.box + 1) : 1;
      const days = BOX_DAYS[Math.min(box, 5)];
      await db.from("ielts_mistakes").update({
        box,
        due_at: new Date(Date.now() + days * 864e5).toISOString(),
        last_answer: storedAnswer(body.answer),
        times_right: card.times_right + (correct ? 1 : 0),
        times_wrong: card.times_wrong + (correct ? 0 : 1)
      }).eq("user_id", user.id).eq("question_id", body.question_id);
      await db.from("ielts_activity_log").insert({ user_id: user.id, kind: "review", minutes: 1 });
      return json({
        correct,
        box,
        mastered: box >= 6,
        next_in_days: box >= 6 ? null : days,
        accepted_answers: q.accepted_answers,
        explanation: q.explanation
      });
    }
    return json({ error: "unknown_action" }, 400);
  } catch (error) {
    console.error("ielts-drill failed", error);
    return new Response(
      JSON.stringify({ error: String(error.message ?? error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
