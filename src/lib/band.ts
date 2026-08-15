/**
 * IELTS banding helpers.
 *
 * Bands run 0-9 in half-band steps. They are never percentages and never a
 * 0-120 scale. The overall band is the arithmetic mean of the four component
 * bands, rounded to the nearest half band (.25 rounds up to the half, .75
 * rounds up to the whole).
 */

export type Band = number;

export function roundToHalfBand(value: number): Band {
  return Math.round(value * 2) / 2;
}

export function overallBand(components: number[]): Band {
  if (components.length === 0) return 0;
  const mean = components.reduce((a, b) => a + b, 0) / components.length;
  return roundToHalfBand(mean);
}

/** Bands always display with one decimal: 6.5, and 7.0 rather than a bare 7. */
export function formatBand(band: Band): string {
  return band.toFixed(1);
}

/**
 * Raw score (out of 40) to band, for Listening and Academic Reading.
 * Indicative conversion only -- the real table shifts slightly per test form.
 */
const RAW_TO_BAND: Array<[min: number, band: Band]> = [
  [39, 9],
  [37, 8.5],
  [35, 8],
  [33, 7.5],
  [30, 7],
  [27, 6.5],
  [23, 6],
  [19, 5.5],
  [15, 5],
  [13, 4.5],
  [10, 4],
  [8, 3.5],
  [6, 3],
  [4, 2.5],
  [0, 0],
];

export function rawScoreToBand(raw: number): Band {
  for (const [min, band] of RAW_TO_BAND) {
    if (raw >= min) return band;
  }
  return 0;
}

export function bandTone(band: Band): "good" | "warn" | "bad" {
  if (band >= 7) return "good";
  if (band >= 5.5) return "warn";
  return "bad";
}
