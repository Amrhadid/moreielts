/**
 * Generates supabase/seed.sql from every form in scripts/seed-content/forms.
 *
 * Run `npm run seed:generate` after adding or editing a form, then apply the
 * seed. Deterministic uuids mean re-running the seed updates the same rows
 * rather than duplicating them. The run refuses to write when validation
 * reports an error; `--check` validates without writing.
 */
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { FORMS } from "./seed-content/forms";
import { validateForms } from "./seed-content/validate";
import type { SeedForm } from "../src/types/content";

/** The first form predates slugs; its ids keep their original names. */
const LEGACY_SLUG = "academic-1";
const LEGACY_FORM_ID = "11111111-2222-4333-8444-555555555555";

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

const report = validateForms(FORMS);
for (const w of report.warnings) console.warn(`warning: ${w}`);
for (const e of report.errors) console.error(`error: ${e}`);
console.log(`${FORMS.length} forms · ${report.errors.length} errors · ${report.warnings.length} warnings`);
if (report.errors.length > 0) process.exit(1);
if (process.argv.includes("--check")) process.exit(0);

function formSql(form: SeedForm): string[] {
  const legacy = form.slug === LEGACY_SLUG;
  const name = (n: string) => (legacy ? n : `${form.slug}:${n}`);
  const formId = legacy ? LEGACY_FORM_ID : uuidFor(`form:${form.slug}`);

  const lines = [
    `-- ${form.title} (${form.slug})`,
    `insert into public.test_forms (id, slug, title, description, variant, delivery_mode, is_published, is_premium, difficulty, scoring_version)`,
    `values (${q(formId)}, ${q(form.slug)}, ${q(form.title)}, ${q(form.description)}, ${q(form.variant)}, 'computer', true, ${form.isPremium}, ${q(form.difficulty)}, 'v1')`,
    "on conflict (id) do update set slug = excluded.slug, title = excluded.title, description = excluded.description, is_published = excluded.is_published, is_premium = excluded.is_premium, difficulty = excluded.difficulty;",
    "",
  ];

  form.sections.forEach((section, order) => {
    const sectionId = uuidFor(name(`section:${section.code}`));
    lines.push(
      `insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)`,
      `values (${q(sectionId)}, ${q(formId)}, ${q(section.code)}, ${section.durationMinutes * 60}, ${section.questionCount}, NULL, ${order})`,
      "on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;",
      "",
    );

    section.itemGroups.forEach((group, groupIndex) => {
      const groupId = uuidFor(name(`group:${section.code}:${group.id}`));
      const metadata = JSON.stringify({
        ...(group.imageCaption ? { image_caption: group.imageCaption } : {}),
        title: group.title,
      });

      // An R2 URL written by generate-audio must survive a re-seed, so the
      // update keeps a stored audio_url over the authored placeholder.
      lines.push(
        `insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)`,
        `values (${q(groupId)}, ${q(sectionId)}, ${group.partNumber}, ${q(group.passageText)}, ${q(group.audioUrl)}, ${q(group.imageUrl)}, ${q(group.instructions)}, ${q(metadata)}::jsonb, ${groupIndex})`,
        "on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);",
        "",
      );

      if (group.transcript?.trim()) {
        lines.push(
          `insert into public.item_group_scripts (group_id, transcript) values (${q(groupId)}, ${q(group.transcript.trim())})`,
          "on conflict (group_id) do update set transcript = excluded.transcript;",
          "",
        );
      }

      group.questions.forEach((question, questionIndex) => {
        const questionId = uuidFor(name(`question:${section.code}:${question.id}`));
        const options = JSON.stringify(question.options ?? []);
        lines.push(
          `insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)`,
          `values (${q(questionId)}, ${q(groupId)}, ${q(question.type)}, ${q(question.prompt)}, ${q(options)}::jsonb, ${textArray(question.acceptedAnswers)}, ${question.wordLimit ?? 0}, ${q(question.spellingStrict ? "strict" : "lenient")}, true, false, '{}'::jsonb, ${q(question.explanation ?? null)}, ${questionIndex})`,
          "on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;",
          "",
        );
      });
    });
  });
  return lines;
}

const lines: string[] = [
  "-- supabase/seed.sql",
  "--",
  "-- GENERATED FILE. Regenerate with `npm run seed:generate`.",
  "--",
  "-- Every authored form in scripts/seed-content/forms, published. Requires",
  "-- migrations through 0007 (slug, difficulty, explanation, item_group_scripts).",
  "-- Idempotent: ids are derived from stable names, so re-running updates",
  "-- rather than duplicates.",
  "",
  "begin;",
  "",
  ...FORMS.flatMap(formSql),
  "commit;",
  "",
];

writeFileSync("supabase/seed.sql", lines.join("\n"));
console.log(`Wrote supabase/seed.sql (${lines.length} lines)`);
