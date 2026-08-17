# MoreIELTS

An IELTS practice and mock exam web app: Supabase Postgres with row level
security, Supabase Auth, Edge Functions for marking and AI grading, and
Cloudflare R2 for audio and image media.

## Running it

```bash
npm install
cp .env.example .env          # fill in the Supabase values
npm run dev                   # http://localhost:3000
npm run build                 # SSR bundle -> dist/server, assets -> dist/client
npm run typecheck
npm test                      # answer-check and scoring unit tests
npm run test:db               # migrations + seed + RLS suite against Postgres
```

### First-time backend setup

```bash
supabase link --project-ref <ref>
supabase db push                        # applies supabase/migrations in order
psql "$DATABASE_URL" -f supabase/seed.sql   # one published Academic form
supabase secrets set ANTHROPIC_API_KEY=... R2_ACCOUNT_ID=...   # see the table below
npm run functions:deploy
```

Prefer the dashboard? `npm run sql:bundle` concatenates the migrations and the
seed into a single `moreielts-setup.sql` you can paste into the Supabase SQL
editor in one go. It is a generated artifact and is gitignored —
`supabase/migrations` remains the single source of truth.

Promote your first admin from the SQL editor — the profile trigger creates
every user as `role = 'user'`:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

## Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | client build | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | client build | Publishable key. Safe to ship — RLS is what protects the data |
| `SUPABASE_URL` | Edge Functions | Injected by Supabase |
| `SUPABASE_ANON_KEY` | Edge Functions | Injected by Supabase. Used to resolve the caller from their JWT |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Functions | Injected by Supabase. Bypasses RLS; the only writer of marks and scores. **Never expose to the client** |
| `ANTHROPIC_API_KEY` | Edge Functions | Claude, for `grade-writing` and `grade-speaking` |
| `R2_ACCOUNT_ID` | Edge Functions | Cloudflare account id for the S3-compatible endpoint |
| `R2_ACCESS_KEY_ID` | Edge Functions | R2 access key. Used only to presign; never sent to the browser |
| `R2_SECRET_ACCESS_KEY` | Edge Functions | R2 secret |
| `R2_BUCKET` | Edge Functions | Bucket holding audio, images and speaking recordings |
| `R2_PUBLIC_BASE_URL` | Edge Functions | Public base URL of the bucket, used to build stored object URLs |
| `SITE_URL` | Edge Functions | Origin allowed by CORS |

Google OAuth is configured in the Supabase dashboard (Authentication →
Providers), with `<site>/auth/callback` as the redirect URL.

## Stack

React 19 · TypeScript · TanStack Router + TanStack Start · Vite · Tailwind CSS 4 ·
Radix UI primitives · React Hook Form + Zod. Mobile-first and responsive
throughout. `wrangler.jsonc` targets Cloudflare Workers against the build output.

## The IELTS facts this is built to

These are baked into the schema, the marking and the UI. They are not guesses.

| | |
|---|---|
| Listening | 4 parts, 40 questions, ~30 min, **audio plays once** — no scrub, no replay |
| Reading | 3 passages, 40 questions, 60 min |
| Writing | Task 1 (150 words) + Task 2 (250 words), **one 60-minute clock for both** |
| Speaking | 3 parts, 11–14 min. Part 2 is a cue card: 1 min prep, 1–2 min talk |
| Scoring | Bands 0–9 in half bands. Never percentages, never 0–120 |
| Overall band | Mean of the four component bands, rounded to the nearest half band |
| Variants | Academic and General Training |
| Adaptivity | None. Fixed test forms; difficulty never changes mid-test |

## Folder structure

```
supabase/
  migrations/            Numbered, sequential, additive-only SQL
    0001_initial_schema.sql      Tables, triggers, signup hook
    0002_row_level_security.sql  RLS policies and table grants
    0003_safe_views.sql          questions_public + get_attempt_review()
    0004_attempt_rpcs.sql        Server-authoritative timing, redeem_code
    0005_seed_question_types.sql The 15 question types
    0006_seed_band_conversion.sql Raw score -> band, versioned
  functions/
    _shared/               CORS, service client, rate limit, Anthropic client
    submit-attempt/        Marks responses and writes every score
    grade-writing/         Claude, four Writing criteria, strict JSON
    grade-speaking/        Claude, four Speaking criteria, strict JSON
    upload-url/            Presigned R2 PUT URLs (SigV4)
  tests/rls_test.sql       Security assertions, run by npm run test:db
  seed.sql                 GENERATED — one published Academic form

scripts/
  generate-seed.ts         Emits supabase/seed.sql from seed-content/
  seed-content/            The authored test content (3 passages, 4 parts, …)
  test-db.sh               Scratch DB -> migrations -> seed -> RLS suite
  bundle-sql.sh            Concatenates migrations + seed for the SQL editor
  supabase-stubs.sql       Local stand-ins for auth schema/roles. Never applied
                           to a real project

src/
  lib/
    answer-check.ts        Pure marking rules. Unit tested (59 cases)
    scoring.ts             Pure band maths. Unit tested (37 cases)
    supabase.ts            Browser client (anon key only)
    auth.tsx               AuthProvider, useAuth, Protected, AdminOnly
    queries.ts             Every read and write, via TanStack Query
    usePlayerAttempt.ts    Shared player state: attempt, content, timing, saves
    adapters.ts            Database rows -> the shapes the components consume
  types/                   content.ts (UI shapes), database.ts (row shapes)
  components/
    ui/                    Radix-backed primitives
    renderers/             The four question renderers + renderer dispatch
    layout/                Header, Sidebar, Footer, AppShell
    player/                Timer header, navigator, submit dialog, status
    admin/                 Form-builder cards, rows, drag-reorder hook
  routes/                  File-based routes (TanStack Router)
```

## Content model

```
test form -> sections -> item groups -> questions
```

An **item group** owns a shared stimulus (a reading passage, a listening part's
audio, a chart image, or a speaking cue card) plus shared instructions and a part
number, and contains an ordered list of questions. This is the unit the admin
builder edits and the unit the players render.

## The question type registry

`public.question_types` is the single source of truth. It is a **reference
table**, not an enum and not a CHECK constraint: `questions.type_code` is a
foreign key into it, so adding an IELTS question type is an `INSERT` and needs
neither a migration to a constraint nor a client release. The practice picker,
the admin type dropdown, the Learn page and the players all read the table, and
`questions_public` ships each question's `renderer` alongside it.

All 15 seeded types map onto exactly **four renderers**:

| Renderer | Types |
|---|---|
| `radio` | multiple_choice_single, true_false_notgiven, yes_no_notgiven |
| `checkbox` | multiple_choice_multiple |
| `dropdown` | matching_headings, matching_information, matching_features, matching_sentence_endings |
| `text_input` | sentence/summary/note/table/flowchart completion, diagram_label, short_answer |

Adding a new question type means one row in `question_types`. If it maps to an
existing renderer, nothing else changes.

## Routes

| Route | Screen |
|---|---|
| `/login`, `/signup`, `/auth/callback` | Email + password and Google OAuth |
| `/` | Dashboard — target vs estimated band, resume card, recent attempts |
| `/practice` | Practice picker — section → question type → difficulty |
| `/mock` | Published forms and the section order |
| `/learn` | Format reference and every question type |
| `/enhance` | Weakest question types from your last attempt |
| `/test/reading` | Reading player — split pane, navigator, tabbed on mobile |
| `/test/listening` | Listening player — play-once audio, current part's questions |
| `/test/writing` | Writing player — live word count, autosave, one 60-min clock |
| `/test/speaking` | Speaking player — cue card, prep timer, real recording |
| `/results` | Attempt history |
| `/results/$attemptId` | Result — bands, accuracy, criteria feedback, answer review |
| `/admin` | Test form list (admin guarded) |
| `/admin/forms/$formId` | Form builder — writes to the real tables |
| `/admin/students`, `/admin/codes`, `/admin/analytics` | Admin tables |

Everything except the auth routes is wrapped in `Protected`; `/admin/*` is
additionally wrapped in `AdminOnly`. Both guards are convenience only — RLS
blocks the underlying queries regardless of what the client renders.

## Security model

The three properties the schema is built to guarantee, and how:

**1. A candidate never receives an accepted answer during an attempt.**
`public.questions` — which holds `accepted_answers` — is admin-only for *every*
operation including SELECT. Candidates read `public.questions_public`, a view
that does not project the answer columns at all, so there is no client-side
filtering to get wrong. Answers are released by `get_attempt_review()`, which
refuses unless the attempt's status is `completed`.

**2. Timing is decided by the server.**
`start_section()` stamps `section_started_at` and `section_deadline_at` from the
database clock. `save_response()` rejects any write past the deadline with
`deadline_passed`. The client countdown is display only: it is seeded from
`get_attempt_state()`, resynced by the 30-second heartbeat and by every save,
and never read from local storage. A trigger reverts direct client writes to the
timing columns, using a single-use transaction-local flag that only the timing
RPCs set — so a client cannot extend its own deadline even immediately after
calling an RPC.

**3. Correctness and scores are decided by the server.**
`responses.is_correct` and every score table are SELECT-only for authenticated
users; they are written exclusively by the `submit-attempt` Edge Function
running as the service role. That function imports the same `answer-check` and
`scoring` modules the app uses, so there is one implementation of both, and it is
the tested one.

These are not assertions in prose only — `supabase/tests/rls_test.sql` exercises
each of them (plus cross-user isolation and privilege escalation) against a real
Postgres. Run it with `npm run test:db`.

## Marking rules

`src/lib/answer-check.ts` applies, in order: unicode/whitespace normalisation →
word limit (a hyphenated word and a number each count as one) → case → UK/US
spelling variants under a lenient policy → regular plurals → leading articles →
number, currency and date equivalence (`20` = `twenty`, `£32.50` = `32.50
pounds`, `14 March` = `March 14th`) → match against every accepted answer.
Per-question switches (`spelling_policy`, `accepts_plural`, `case_sensitive`,
`scoring_rules`) are all editable in the admin builder.

## Scoring

`src/lib/scoring.ts`, pure and tested:

- **Listening / Reading** — count correct, look up `band_conversion` by variant
  and raw score. The seeded table is an **estimate, not an official IELTS
  table**, and is versioned (`v1`) so it can be recalibrated without changing
  any previously scored attempt.
- **Writing** — task band is the mean of the four criteria to the nearest half;
  the section band weights Task 2 double: `(T1 + 2·T2) / 3`.
- **Speaking** — mean of the four criteria to the nearest half.
- **Overall** — mean of the four component bands. `.25`–`.49` rounds up to the
  half, `.75`–`.99` up to the whole. The unrounded mean is stored too.

The criterion bands themselves come from Claude, but every band *calculation* is
done here rather than taken from the model.

## AI grading

`grade-writing` and `grade-speaking` call Claude with criterion-specific prompts
that require a short verbatim quote from the candidate's own answer as evidence
for each of the four criteria. Both demand strict JSON, validate every band is
0–9 in half steps before writing, record `model_version` on every row, and are
rate limited per user via `ai_grading_usage`. The API key exists only in the
function environment.

`grade-speaking` currently grades a transcript. Producing that transcript from
`responses.audio_url` server-side is marked `TODO(transcription)` — until then a
client-supplied transcript is used only when no stored one exists.

## Media uploads

`upload-url` issues a presigned R2 PUT (SigV4, five-minute expiry) after
checking: admin role for item audio and images, attempt ownership and an active
attempt for speaking recordings. Content type and size are validated and the
signed URL is bound to one object key and one content type. R2 credentials never
reach the browser.

## Not built

Cloudflare Stream video, payments, and course content. Speech-to-text for
speaking recordings is stubbed as described above.
