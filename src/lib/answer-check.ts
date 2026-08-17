/**
 * Answer checking for Listening and Reading gap-fill and choice questions.
 *
 * This module is pure and has no imports: it is the single source of truth for
 * "is this answer correct", and it runs identically in the browser (for offline
 * practice review) and inside the Edge Function that marks a submitted attempt.
 * The server result is authoritative; the client never writes `is_correct`.
 *
 * Rules are applied in the order documented in the README, and every rejection
 * carries a machine-readable `reason`.
 */

export type SpellingPolicy = "strict" | "lenient";

/** Per-question overrides. All fields optional; defaults are the common case. */
export interface ScoringRules {
  /** Require the leading article to match exactly (default: articles ignored). */
  requireArticle?: boolean;
  /** Reject numerals written as words, or vice versa (default: equivalent). */
  requireExactNumberForm?: boolean;
}

/** The subset of a question row this checker needs. */
export interface CheckableQuestion {
  acceptedAnswers: string[];
  wordLimit?: number | null;
  spellingPolicy?: SpellingPolicy | null;
  acceptsPlural?: boolean | null;
  caseSensitive?: boolean | null;
  scoringRules?: ScoringRules | null;
}

export type CheckFailureReason =
  | "empty"
  | "word_limit_exceeded"
  | "no_match";

export interface CheckResult {
  correct: boolean;
  reason?: CheckFailureReason;
  /** Which accepted answer matched, for the answer-review UI. */
  matched?: string;
}

/* ------------------------------------------------------------------ *
 * Step 1 — normalisation
 * ------------------------------------------------------------------ */

const QUOTE_MAP: Record<string, string> = {
  "‘": "'",
  "’": "'",
  "‚": "'",
  "‛": "'",
  "“": '"',
  "”": '"',
  "„": '"',
  "«": '"',
  "»": '"',
};

const DASH_MAP: Record<string, string> = {
  "‐": "-",
  "‑": "-",
  "‒": "-",
  "–": "-",
  "—": "-",
  "―": "-",
  "−": "-",
};

/**
 * Trim, collapse internal whitespace, and fold unicode quotes and dashes onto
 * their ASCII equivalents. Non-breaking spaces count as whitespace.
 */
export function normalizeText(input: string): string {
  let out = input.normalize("NFKC");
  out = out.replace(/[‘’‚‛“”„«»]/g, (c) => QUOTE_MAP[c] ?? c);
  out = out.replace(/[‐‑‒–—―−]/g, (c) => DASH_MAP[c] ?? c);
  out = out.replace(/[   ]/g, " ");
  return out.trim().replace(/\s+/g, " ");
}

/**
 * Step 2 — word counting.
 *
 * A hyphenated word ("twenty-five", "off-peak") is ONE word, and a number
 * ("32.50", "1,200") is one word, so a plain whitespace split is correct once
 * the text has been normalised.
 */
export function countWords(input: string): number {
  const normalized = normalizeText(input);
  if (!normalized) return 0;
  return normalized.split(" ").filter(Boolean).length;
}

/* ------------------------------------------------------------------ *
 * Step 4 — spelling variants (lenient policy)
 * ------------------------------------------------------------------ */

/**
 * UK -> US spelling pairs, stored one way and applied in both directions so a
 * candidate may use either. Suffix rules cover the productive cases; the
 * explicit list covers the irregulars that rules would get wrong.
 */
const SPELLING_PAIRS: Array<[uk: string, us: string]> = [
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
  ["marvellous", "marvelous"],
];

/** us form -> uk form, so both sides fold onto one canonical spelling. */
const US_TO_UK = new Map(SPELLING_PAIRS.map(([uk, us]) => [us, uk]));

/**
 * Productive suffix rules, applied only when the word is not in the explicit
 * map. Each returns the UK-canonical form of a US spelling.
 */
function canonicaliseSpellingWord(word: string): string {
  const direct = US_TO_UK.get(word);
  if (direct) return direct;

  // -ization / -izing / -ized / -izes / -ize  ->  -isation / -ising / ...
  if (/i[sz]ation$/.test(word)) return word.replace(/ization$/, "isation");
  if (/i[sz](e|es|ed|ing|er|ers)?$/.test(word) && word.length > 4) {
    return word.replace(/iz(e|es|ed|ing|er|ers)?$/, (m) => m.replace("iz", "is"));
  }
  // -yze -> -yse (analyze, paralyze)
  if (/yze(s|d)?$/.test(word)) return word.replace("yz", "ys");
  return word;
}

function canonicaliseSpelling(text: string): string {
  return text
    .split(" ")
    .map((w) => {
      // Preserve any trailing punctuation while folding the word itself.
      const match = /^([a-z]+)(.*)$/.exec(w);
      if (!match) return w;
      return canonicaliseSpellingWord(match[1]) + match[2];
    })
    .join(" ");
}

/* ------------------------------------------------------------------ *
 * Step 7 — numbers, currency and dates
 * ------------------------------------------------------------------ */

const UNITS: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18,
  nineteen: 19,
};

const TENS: Record<string, number> = {
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70,
  eighty: 80, ninety: 90,
};

const ORDINAL_TO_CARDINAL: Record<string, string> = {
  first: "one", second: "two", third: "three", fifth: "five", eighth: "eight",
  ninth: "nine", twelfth: "twelve", twentieth: "twenty", thirtieth: "thirty",
};

const MONTHS: Record<string, string> = {
  january: "01", february: "02", march: "03", april: "04", may: "05",
  june: "06", july: "07", august: "08", september: "09", october: "10",
  november: "11", december: "12",
  jan: "01", feb: "02", mar: "03", apr: "04", jun: "06", jul: "07",
  aug: "08", sep: "09", sept: "09", oct: "10", nov: "11", dec: "12",
};

/** "twenty-five" / "twenty five" -> 25. Returns null when not a number word. */
export function wordsToNumber(input: string): number | null {
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
      total = (total || 1) * 1000;
      seen = true;
    } else if (part === "and" && seen) {
      continue;
    } else {
      return null;
    }
  }
  return seen ? total : null;
}

/** Strip separators and trailing zero decimals: "1,200" -> "1200", "20.00" -> "20". */
function canonicaliseNumeric(token: string): string {
  let out = token.replace(/,(?=\d{3}\b)/g, "");
  if (/^\d+\.\d+$/.test(out)) out = out.replace(/\.?0+$/, "");
  return out;
}

const CURRENCY_WORDS: Record<string, string> = {
  "£": "gbp", pounds: "gbp", pound: "gbp",
  $: "usd", dollars: "usd", dollar: "usd",
  "€": "eur", euros: "eur", euro: "eur",
};

/**
 * Fold numbers, currency and dates onto a canonical token stream so that
 * "20" / "twenty", "£32.50" / "32.50 pounds", and "14 March" / "March 14th"
 * all compare equal.
 */
function canonicaliseNumbers(text: string): string {
  let out = text;

  // Currency symbol -> trailing code: "£32.50" -> "32.50 gbp"
  out = out.replace(/([£$€])\s?(\d[\d.,]*)/g, (_, sym: string, num: string) => {
    return `${num} ${CURRENCY_WORDS[sym]}`;
  });
  // Currency word -> code: "32.50 pounds" -> "32.50 gbp"
  out = out
    .split(" ")
    .map((w) => CURRENCY_WORDS[w] ?? w)
    .join(" ");

  // Ordinal numerals -> cardinal: "14th" -> "14"
  out = out.replace(/\b(\d+)(st|nd|rd|th)\b/g, "$1");

  // Numeric tokens: strip separators and trailing zero decimals.
  out = out
    .split(" ")
    .map((w) => (/^[\d.,]+$/.test(w) ? canonicaliseNumeric(w) : w))
    .join(" ");

  // Number words -> numerals, longest run first ("twenty five" -> "25").
  const words = out.split(" ");
  for (let size = Math.min(4, words.length); size >= 1; size--) {
    for (let i = 0; i + size <= words.length; i++) {
      const slice = words.slice(i, i + size);
      if (slice.some((w) => !/^[a-z-]+$/.test(w))) continue;
      const value = wordsToNumber(slice.join(" "));
      if (value !== null) {
        words.splice(i, size, String(value));
        i = -1; // restart the scan at this size
      }
    }
  }
  out = words.join(" ");

  // Month names -> numeric, then normalise "<day> <month>" and "<month> <day>"
  // onto one ordering so either is accepted.
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

/* ------------------------------------------------------------------ *
 * Steps 5 and 6 — plurals and articles
 * ------------------------------------------------------------------ */

const LEADING_ARTICLE = /^(a|an|the)\s+/;

/** Regular English plural -> singular. Irregulars are left alone. */
function singularise(word: string): string | null {
  if (/(ss|us|is)$/.test(word)) return null;
  if (/ies$/.test(word) && word.length > 4) return word.replace(/ies$/, "y");
  if (/(ches|shes|xes|zes|ses)$/.test(word)) return word.slice(0, -2);
  if (/s$/.test(word) && word.length > 2) return word.slice(0, -1);
  return null;
}

/* ------------------------------------------------------------------ *
 * Variant generation and comparison
 * ------------------------------------------------------------------ */

/** Trailing sentence punctuation carries no meaning in a gap-fill answer. */
function stripEdgePunctuation(text: string): string {
  return text.replace(/^[."'\s]+/, "").replace(/[.,;:!?"'\s]+$/, "");
}

interface VariantOptions {
  caseSensitive: boolean;
  spellingPolicy: SpellingPolicy;
  acceptsPlural: boolean;
  rules: ScoringRules;
}

/**
 * Every string an answer is allowed to be equal to. Both the candidate's answer
 * and each accepted answer are expanded this way, and a match on any pair means
 * the answer is correct.
 */
export function answerVariants(input: string, options: VariantOptions): Set<string> {
  const base = stripEdgePunctuation(normalizeText(input));
  const cased = options.caseSensitive ? base : base.toLowerCase();

  const seeds = new Set<string>([cased]);

  // Step 6 — articles are ignored unless the rules demand them.
  if (!options.rules.requireArticle) {
    const withoutArticle = cased.replace(LEADING_ARTICLE, "");
    if (withoutArticle !== cased) seeds.add(withoutArticle);
  }

  // For a case-sensitive question the later steps must not fold case, or the
  // lower-casing inside them would silently reinstate case-insensitive matching.
  const fold = (text: string) => (options.caseSensitive ? text : text.toLowerCase());

  const out = new Set<string>();
  for (const seed of seeds) {
    const forms = new Set<string>([seed]);

    // Steps 4, 5 and 7 compose in both directions -- "theaters" needs the
    // plural stripped before the spelling map recognises "theater". Two passes
    // reach a fixed point for every rule combination we support.
    for (let pass = 0; pass < 2; pass++) {
      for (const form of [...forms]) {
        // Step 4 — spelling.
        if (options.spellingPolicy === "lenient") {
          forms.add(canonicaliseSpelling(fold(form)));
        }
        // Step 7 — numbers, currency, dates.
        if (!options.rules.requireExactNumberForm) {
          forms.add(canonicaliseNumbers(fold(form)));
        }
        // Step 5 — plurals, applied to the final word.
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

/* ------------------------------------------------------------------ *
 * Public entry point
 * ------------------------------------------------------------------ */

export function checkAnswer(
  userAnswer: string,
  question: CheckableQuestion,
): CheckResult {
  const normalized = normalizeText(userAnswer ?? "");
  if (!normalized) return { correct: false, reason: "empty" };

  // Step 2 — the word limit is checked before any matching, so an otherwise
  // correct but over-long answer is rejected with a specific reason.
  const limit = question.wordLimit ?? 0;
  if (limit > 0 && countWords(normalized) > limit) {
    return { correct: false, reason: "word_limit_exceeded" };
  }

  const options: VariantOptions = {
    caseSensitive: question.caseSensitive === true,
    spellingPolicy: question.spellingPolicy ?? "lenient",
    acceptsPlural: question.acceptsPlural !== false,
    rules: question.scoringRules ?? {},
  };

  const userVariants = answerVariants(normalized, options);

  // Step 8 — any accepted answer may match.
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

/**
 * Multi-select questions (multiple_choice_multiple) are all-or-nothing: the
 * selected set must equal the accepted set, order irrelevant.
 */
export function checkMultiAnswer(
  userAnswers: string[],
  question: CheckableQuestion,
): CheckResult {
  const accepted = (question.acceptedAnswers ?? []).map((a) =>
    normalizeText(a).toLowerCase(),
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
