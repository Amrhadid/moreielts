# MoreIELTS

An IELTS practice and mock exam web app. **This is a UI-only first pass** — every
screen is clickable and navigable end to end, and all data comes from local
TypeScript files under `src/mock/`. There is no backend, no database and no auth.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # SSR bundle -> dist/server, static assets -> dist/client
npm run typecheck
```

## Stack

React 19 · TypeScript · TanStack Router + TanStack Start · Vite · Tailwind CSS 4 ·
Radix UI primitives · React Hook Form + Zod. Mobile-first and responsive
throughout. `wrangler.jsonc` targets Cloudflare Workers against the build output.

## The IELTS facts this is built to

These are baked into the UI and the mock data. They are not configurable guesses.

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
src/
  registry/questionTypes.ts   The question type registry — see below
  types/                      content.ts (form -> section -> group -> question)
                              result.ts  (bands, criteria, answer review)
  mock/                       All app data. Swap these for real queries later.
    readingSection.ts         3 passages, Q1-40
    listeningSection.ts       4 parts, Q1-40
    writingSection.ts         Task 1 + Task 2
    speakingSection.ts        Parts 1-3 incl. cue card
    testForm.ts              Assembles the Academic form; admin list + shells
    result.ts                 A marked attempt, derived from the form
    user.ts                   Profile, attempt history, band trend
  lib/                        band.ts (banding maths), text.ts, useCountdown.ts, cn.ts
  components/
    ui/                       Radix-backed primitives (Button, Card, Dialog, …)
    renderers/                The four question renderers + registry dispatch
    layout/                   Header, Sidebar, Footer, AppShell
    player/                   Shared test-player parts (timer, navigator, submit)
    admin/                    Form-builder cards, rows, drag-reorder hook
  routes/                     File-based routes (TanStack Router)
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

`src/registry/questionTypes.ts` is the single source of truth for question types.
There is deliberately **no hardcoded union of types in any component** — the
practice picker, the admin type dropdown, the Learn page and the players all read
this list. Each entry carries a `code`, the `sections` it belongs to, a `label`, a
`renderer`, a `defaultWordLimit` and a free/premium `tier`.

All 15 registry types map onto exactly **four renderers**:

| Renderer | Types |
|---|---|
| `radio` | multiple_choice_single, true_false_notgiven, yes_no_notgiven |
| `checkbox` | multiple_choice_multiple |
| `dropdown` | matching_headings, matching_information, matching_features, matching_sentence_endings |
| `text_input` | sentence/summary/note/table/flowchart completion, diagram_label, short_answer |

Adding a new question type means adding one registry entry. If it maps to an
existing renderer, nothing else changes.

## Routes

| Route | Screen |
|---|---|
| `/` | Dashboard — target vs estimated band, resume card, recent attempts |
| `/practice` | Practice picker — section → question type → difficulty |
| `/mock` | Full mock test overview |
| `/learn` | Format reference and every question type |
| `/enhance` | Weakest question types and a suggested plan |
| `/test/reading` | Reading player — split pane, navigator, tabbed on mobile |
| `/test/listening` | Listening player — play-once audio, current part's questions |
| `/test/writing` | Writing player — live word count, autosave, one 60-min clock |
| `/test/speaking` | Speaking player — 3 parts, cue card, prep timer, recorder |
| `/results` | Attempt history |
| `/results/$attemptId` | Result — bands, accuracy breakdowns, answer review |
| `/admin` | Test form list |
| `/admin/forms/$formId` | Form builder — section tabs, groups, questions, drag reorder |
| `/admin/students`, `/admin/codes`, `/admin/analytics` | Table shells only |

## Where to plug in the backend

Everything stubbed is marked `TODO(backend):` in the source. The main seams:

1. **Content loading.** Routes import from `src/mock/` directly. Replace those
   imports with route loaders that fetch a `TestForm`. The types in
   `src/types/content.ts` are the contract — match them and no component changes.
2. **Answer persistence.** `src/components/player/useAnswers.ts` holds the answer
   sheet in local state. Add a debounced write to an attempts table there.
3. **Submission and marking.** `src/components/player/SubmitDialog.tsx` navigates
   straight to a fixed result. Post the sheet, mark server-side, route to the real
   attempt id. `src/lib/band.ts` already has the raw-score → band conversion.
4. **AI grading.** Writing and Speaking bands and the per-criterion feedback in
   `src/mock/result.ts` are static. Both display shapes are typed in
   `src/types/result.ts` as `SubjectiveSectionResult`.
5. **Media.** Listening audio and Task 1 charts are placeholder URLs on the item
   group (`audioUrl`, `imageUrl`). Upload to R2 and store the object URL. The
   listening player currently simulates playback with a ticker — swap it for an
   `<audio>` element with controls suppressed so the play-once rule still holds.
6. **Recording.** The speaking recorder in `src/routes/test.speaking.tsx` is UI
   state only. Replace with `MediaRecorder` plus an upload.
7. **Auth, payments, admin writes.** Not present. The profile menu, plan badges,
   access codes and the builder's save button are all inert.

## Not built in this pass

No Supabase, no auth, no API calls, no AI grading, no real audio recording or
upload, no payments, no course content.
