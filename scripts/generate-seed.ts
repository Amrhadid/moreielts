/**
 * Generates supabase/seed.sql from the mock Academic form.
 *
 * This is how the UI-pass mock content becomes real seed data: run it once to
 * (re)generate the SQL, then apply the seed to a fresh project so every screen
 * has something to show. Deterministic uuids mean re-running the seed updates
 * the same rows rather than duplicating them.
 *
 *   npx esbuild scripts/generate-seed.ts --bundle --platform=node \
 *     --format=esm --outfile=/tmp/seed.mjs && node /tmp/seed.mjs
 */
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { listeningSection } from "./seed-content/listeningSection";
import { readingSection } from "./seed-content/readingSection";
import { speakingSection } from "./seed-content/speakingSection";
import { writingSection } from "./seed-content/writingSection";
import type { Section } from "../src/types/content";

const FORM_ID = "11111111-2222-4333-8444-555555555555";

/** Stable uuid v5-ish from a name, so re-seeding is idempotent. */
function uuidFor(name: string): string {
  const hex = createHash("sha1").update(name).digest("hex");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    "4" + hex.slice(13, 16),
    ((parseInt(hex.slice(16, 17), 16) & 0x3) | 0x8).toString(16) + hex.slice(17, 20),
    hex.slice(20, 32),
  ].join("-");
}

function q(value: string | null | undefined): string {
  if (value === null || value === undefined) return "NULL";
  return `'${value.replace(/'/g, "''")}'`;
}

function textArray(values: string[]): string {
  if (values.length === 0) return "'{}'";
  return `ARRAY[${values.map(q).join(", ")}]::text[]`;
}

const SECTIONS: Array<{ section: Section; order: number }> = [
  { section: listeningSection, order: 0 },
  { section: readingSection, order: 1 },
  { section: writingSection, order: 2 },
  { section: speakingSection, order: 3 },
];

const lines: string[] = [
  "-- supabase/seed.sql",
  "--",
  "-- GENERATED FILE. Regenerate with scripts/generate-seed.ts.",
  "--",
  "-- One complete published Academic form so every screen has real content on",
  "-- a fresh project. Idempotent: ids are derived from stable names, so",
  "-- re-running updates rather than duplicates.",
  "",
  "begin;",
  "",
  `insert into public.test_forms (id, title, description, variant, delivery_mode, is_published, is_premium, scoring_version)`,
  `values (${q(FORM_ID)}, 'Academic Mock Test 1', 'A full Academic practice test covering all four sections.', 'academic', 'computer', true, false, 'v1')`,
  "on conflict (id) do update set title = excluded.title, is_published = excluded.is_published;",
  "",
];

for (const { section, order } of SECTIONS) {
  const sectionId = uuidFor(`section:${section.code}`);
  lines.push(
    `insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)`,
    `values (${q(sectionId)}, ${q(FORM_ID)}, ${q(section.code)}, ${section.durationMinutes * 60}, ${section.questionCount}, NULL, ${order})`,
    "on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;",
    "",
  );

  section.itemGroups.forEach((group, groupIndex) => {
    const groupId = uuidFor(`group:${section.code}:${group.id}`);
    const metadata = group.imageCaption
      ? JSON.stringify({ image_caption: group.imageCaption })
      : "{}";

    lines.push(
      `insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)`,
      `values (${q(groupId)}, ${q(sectionId)}, ${group.partNumber}, ${q(group.passageText)}, ${q(group.audioUrl)}, ${q(group.imageUrl)}, ${q(group.instructions)}, ${q(metadata)}::jsonb, ${groupIndex})`,
      "on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions;",
      "",
    );

    group.questions.forEach((question, questionIndex) => {
      const questionId = uuidFor(`question:${section.code}:${question.id}`);
      const options = JSON.stringify(question.options ?? []);
      lines.push(
        `insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)`,
        `values (${q(questionId)}, ${q(groupId)}, ${q(question.type)}, ${q(question.prompt)}, ${q(options)}::jsonb, ${textArray(question.acceptedAnswers)}, ${question.wordLimit ?? 0}, ${q(question.spellingStrict ? "strict" : "lenient")}, true, false, '{}'::jsonb, ${questionIndex})`,
        "on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;",
        "",
      );
    });
  });
}

lines.push("commit;", "");

writeFileSync("supabase/seed.sql", lines.join("\n"));
console.log(`Wrote supabase/seed.sql (${lines.length} lines)`);
