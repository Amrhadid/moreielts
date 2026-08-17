/**
 * IELTS band scoring. Pure functions only — the same code runs in the
 * `submit-attempt` Edge Function (authoritative) and in the client for display.
 *
 * Bands are 0-9 in half-band steps. Nothing here deals in percentages.
 */

export type Band = number;

export type ObjectiveSection = "listening" | "reading";
export type Variant = "academic" | "general_training";

/** A row of the band_conversion table. */
export interface BandConversionRow {
  variant: Variant;
  section: ObjectiveSection;
  raw_min: number;
  raw_max: number;
  band: number;
  version: string;
}

/**
 * Round to the nearest half band.
 *
 * IELTS rounds a fractional part of .25-.49 up to the half and .75-.99 up to
 * the whole, which is exactly "round half up at half-band resolution". The
 * epsilon guards against a value like 6.249999 arriving from floating-point
 * division of an exact 6.25.
 */
export function roundToHalfBand(value: number): Band {
  const scaled = value * 2;
  const rounded = Math.floor(scaled + 0.5 + 1e-9);
  return Math.min(9, Math.max(0, rounded / 2));
}

/** Bands always render with one decimal: "7.0", not "7". */
export function formatBand(band: Band): string {
  return band.toFixed(1);
}

/**
 * Raw score (0-40) to band, via the versioned band_conversion table.
 * Throws rather than guessing when the table has no row for the score — a
 * missing conversion row is a data bug, not something to paper over.
 */
export function rawScoreToBand(
  raw: number,
  section: ObjectiveSection,
  variant: Variant,
  table: BandConversionRow[],
): Band {
  const row = table.find(
    (r) =>
      r.section === section &&
      r.variant === variant &&
      raw >= r.raw_min &&
      raw <= r.raw_max,
  );
  if (!row) {
    throw new Error(
      `No band_conversion row for ${variant}/${section} raw score ${raw}`,
    );
  }
  return Number(row.band);
}

/* ------------------------------------------------------------------ *
 * Writing
 * ------------------------------------------------------------------ */

export interface WritingCriteria {
  task_achievement: number;
  coherence_cohesion: number;
  lexical_resource: number;
  grammatical_range: number;
}

/** A single task's band: the mean of its four criteria, to the nearest half. */
export function writingTaskBand(criteria: WritingCriteria): Band {
  const mean =
    (criteria.task_achievement +
      criteria.coherence_cohesion +
      criteria.lexical_resource +
      criteria.grammatical_range) /
    4;
  return roundToHalfBand(mean);
}

/**
 * Section band for Writing. Task 2 carries double the weight of Task 1, so the
 * section band is (T1 + 2*T2) / 3, rounded to the nearest half.
 */
export function writingSectionBand(task1: Band, task2: Band): Band {
  return roundToHalfBand((task1 + 2 * task2) / 3);
}

/* ------------------------------------------------------------------ *
 * Speaking
 * ------------------------------------------------------------------ */

export interface SpeakingCriteria {
  fluency_coherence: number;
  lexical_resource: number;
  grammatical_range: number;
  pronunciation: number;
}

/** Speaking is scored once across the whole test: mean of the four criteria. */
export function speakingBand(criteria: SpeakingCriteria): Band {
  const mean =
    (criteria.fluency_coherence +
      criteria.lexical_resource +
      criteria.grammatical_range +
      criteria.pronunciation) /
    4;
  return roundToHalfBand(mean);
}

/**
 * When each part is graded separately, the section band is the mean of the
 * part bands, to the nearest half.
 */
export function speakingSectionBand(partBands: Band[]): Band {
  if (partBands.length === 0) return 0;
  const mean = partBands.reduce((a, b) => a + b, 0) / partBands.length;
  return roundToHalfBand(mean);
}

/* ------------------------------------------------------------------ *
 * Overall
 * ------------------------------------------------------------------ */

export interface ComponentBands {
  listening: Band;
  reading: Band;
  writing: Band;
  speaking: Band;
}

export interface OverallResult {
  /** The raw mean, stored so a recalibration can be audited later. */
  unrounded: number;
  band: Band;
}

/** Overall band: the mean of the four component bands, to the nearest half. */
export function overallBand(components: ComponentBands): OverallResult {
  const values = [
    components.listening,
    components.reading,
    components.writing,
    components.speaking,
  ];
  const unrounded = values.reduce((a, b) => a + b, 0) / values.length;
  return {
    // Stored as numeric(3,2), so two decimals is the meaningful precision.
    unrounded: Math.round(unrounded * 100) / 100,
    band: roundToHalfBand(unrounded),
  };
}

/* ------------------------------------------------------------------ *
 * Objective section tallies
 * ------------------------------------------------------------------ */

export interface MarkedResponse {
  questionId: string;
  typeCode: string;
  partNumber: number;
  isCorrect: boolean;
}

export interface AccuracyBucket {
  key: string;
  correct: number;
  total: number;
}

/** Group marked responses into the accuracy rows the result page displays. */
export function tallyBy(
  responses: MarkedResponse[],
  key: (r: MarkedResponse) => string,
): AccuracyBucket[] {
  const map = new Map<string, AccuracyBucket>();
  for (const response of responses) {
    const k = key(response);
    const bucket = map.get(k) ?? { key: k, correct: 0, total: 0 };
    bucket.total += 1;
    if (response.isCorrect) bucket.correct += 1;
    map.set(k, bucket);
  }
  return [...map.values()];
}

export function rawScore(responses: MarkedResponse[]): number {
  return responses.filter((r) => r.isCorrect).length;
}
