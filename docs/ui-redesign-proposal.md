# MoreIELTS UI redesign proposal

Status: proposal, not yet implemented. Written against the code on `main` at
`28d7b4f` and screenshots of the landing and sign-in pages at 1440 px and 390 px,
light and dark.

## Summary

The current UI is clean and well built, but it reads as a generic SaaS template:
every block is an 18 px rounded card with a shadow, the brand is a stock sky blue
with Inter, icons are emoji and unicode glyphs, and the two navigation systems
(header links and sidebar) show the same five items. The test players are the
strongest part of the product and the part that most deserves investment, because
a mock test is only useful if it rehearses the computer-delivered IELTS interface.

The proposal is one design direction, **Exam Desk**, with two registers:

- **Browse register** (dashboard, practice, learn, results): calm, editorial,
  hierarchy through type and spacing rather than boxes.
- **Exam register** (the four players): mirrors computer-delivered IELTS
  conventions so the mock feels like the real screen.

Everything below is scoped to the existing stack: Tailwind 4 tokens in
`src/styles.css`, Radix primitives, TanStack Router, no new framework.

## What is wrong today

Ordered by how much each one costs the user.

1. **Duplicate navigation.** On desktop at `lg` and above, `Header` renders
   Practice / Mock Test / Learn / Enhance and `Sidebar` renders the same five
   links in a card. Two menus, one destination set.
2. **Logged-out visitors see app navigation.** The marketing header shows
   Practice, Mock Test, Learn and Enhance. All four are behind `Protected`, so a
   visitor who clicks one hits a sign-in wall.
3. **Dashboard quick links start timed tests.** The "Practise a section" tiles
   link to `/test/*`, which calls `start_section()` and starts a server-side
   clock. A quick-look click should go to the practice picker, not an attempt.
4. **The primary action is the smallest thing on the dashboard.** "Continue
   test" / "Start a mock test" is a one-third-width card beside a two-thirds
   band tile. The band tile is information; the action card is the job.
5. **Dark mode is only half themed.** Section tiles use literal colours
   (`text-[#607eea] bg-[#eef1ff]`) that do not change in dark mode, and the
   animated ring decoration renders as a brown circle. `good`, `warn` and `bad`
   text tokens are not adjusted for dark backgrounds.
6. **Icons are emoji and glyphs.** `nav.ts` uses 🏠 🎯 📝 📖 ✨ (already marked
   `TODO(design)`), section tiles use ◉ ▤ ✎ ◌. They render differently per OS,
   and at 1x the speaking glyph is close to invisible.
7. **Everything is a card.** Lists, tables, feature blurbs, section headings,
   the sidebar and the footer CTA all share the same radius and shadow. Nothing
   is set off because everything is.
8. **The players are close to the real exam but miss its conventions.**
   No flag-for-review, no part tabs in the navigator, no highlight or notes in
   the passage, no resizable divider, no hide-timer or text-size control. The
   writing player stacks prompt above editor, so the candidate scrolls between
   them. The timer has `aria-live="polite"` on a per-second value, which will
   announce every tick to screen-reader users.
9. **Results use traffic-light colours for bands.** A 6.5 renders amber and a
   5.0 renders red regardless of the user's target. Colour should encode
   distance to target, not an absolute judgement. The AI disclaimer is a
   full-width yellow alert above the detail; it should be a footnote.
10. **Implementation detail leaks into copy.** Practice and Learn say "Answered
    with the text input control". Candidates care what the exam asks, not which
    renderer draws it.
11. **Motion is global.** Every `Button` lifts 2 px on hover, including inside
    dialogs and the player. Cards animate on hover everywhere.
12. **States are thin.** Loading is the word "Loading…"; empty states have no
    action; save errors are an inline strip in the player.
13. **Placeholders shipped.** Footer About, Privacy and Terms link to `#`.

## Design direction: Exam Desk

### Principles

- **Cards mark objects you can pick.** Selectable things (a test form, a
  question type, a question in the player) get a border. Lists, headings and
  explanatory text sit on the page.
- **One accent, used for one thing.** The accent marks the primary action and
  the current item. Section identity uses four muted hues with dark variants.
- **Bands are always relative to the target.** Every band number is shown next
  to the target or as a delta from it.
- **The exam register copies the real screen.** When a convention exists in
  computer-delivered IELTS, match it instead of inventing a nicer one.

### Tokens (`src/styles.css`)

Keep the paper / surface / ink / muted / line structure. Change the values and
add what is missing.

| Token | Today | Proposed light | Proposed dark | Why |
|---|---|---|---|---|
| `--color-paper` | `#f6f8fb` | `#f3f5f8` | `#0f141b` | Cooler, less blue cast |
| `--color-ink` | `#14181f` | `#151a21` | `#eef2f6` | |
| `--color-brand-600` | `#0875c9` (sky) | `#2448a8` (ink blue) | `#8fb0ff` | Reads as "exam", not "startup"; 7.2:1 on paper |
| `--color-listening` | literal `#607eea` | `#5b63c7` | `#aab0ff` | New token, dark-safe |
| `--color-reading` | literal `#07966f` | `#1f7a5a` | `#7fd1b3` | New token |
| `--color-writing` | literal `#c47918` | `#a8651a` | `#f0b86b` | New token |
| `--color-speaking` | literal `#a055c9` | `#9a4f8f` | `#e3a6d8` | New token |
| `--color-good/warn/bad` | one value | keep | lighten by one step | Dark contrast |
| `--radius-card` | one value, 18 px | `--radius-sm 8`, `--radius-md 12`, `--radius-lg 16` | | A scale, so not everything is 18 |
| `--font-display` | none | `"Source Serif 4"` | | Headlines share the passage serif; the product looks like a reading room |
| `--font-sans` | Inter | `"Instrument Sans"` | | Humanist, less default |
| `--font-mono` | none | `"JetBrains Mono"` | | Timer and question numbers |

Add `--shadow-raised` as the single shadow used by floating things (dialogs,
dropdowns, the player submit bar). Cards stop using shadows.

### Icons

Replace emoji and glyphs with `lucide-react` (one dependency, tree-shaken).
Section icons: `Headphones`, `BookOpenText`, `PenLine`, `Mic`. Nav icons:
`LayoutDashboard`, `Target`, `ClipboardList`, `GraduationCap`, `BarChart3`.

### Navigation

- **Desktop:** one left rail, 232 px, collapsible to 64 px icons. The top bar
  shrinks to a page title, a breadcrumb inside admin, and the account menu.
  Remove the header link row.
- **Mobile:** a bottom tab bar with Home, Practice, Mock, Results, More. Study
  apps are used on phones between other things; a hamburger drawer hides the
  whole product behind one tap.
- **Logged out:** a marketing header with How it works, The test, Sign in, and
  one accent button, Start free.
- Fold **Enhance** into the dashboard as a "Focus" block. It is one list
  derived from the last attempt; it does not need a route in the primary nav.
  Keep `/enhance` as a redirect.

### Landing

- Replace the cartoon hero with a **live reading question**: a real
  `QuestionBlock` with a short passage and three True / False / Not Given
  items the visitor can answer without an account. The product demonstrates
  itself. Keep one "7.5" moment, not two.
- Headline in the display serif. Proposed copy: "Rehearse the real test."
  Subhead: "Forty questions, audio that plays once, one clock for both writing
  tasks. The same rules as exam day, with a band estimate at the end."
- Replace the numbered 01 / 02 / 03 cards with a three-column plain list
  (number markers imply sequence; these are parallel features).
- Trust strip: "No card required · Built to the published IELTS format · Not
  affiliated with the IELTS partners."
- Real Privacy and Terms pages, or remove the links until they exist.

### Dashboard ("Today")

Top to bottom, each block earning its position:

1. **Primary action, full width.** If an attempt is in progress: "Continue
   Reading · Passage 2 of 3 · 23 min left" with one button. Otherwise: "Start
   your next mock" with the next published form named.
2. **Band strip.** Estimated band and target band side by side on a 0 to 9
   ruler with a target marker, then four small section bands each with a delta
   chip against the target. The hand-drawn trend bars become a 6-point
   sparkline with the last point emphasised.
3. **Focus.** The two weakest question types from the last attempt, each with
   accuracy and a "Practise" button that deep-links into the practice picker
   with section and type pre-selected (add `?section=&type=` search params).
4. **Recent attempts.** A plain list, no card, with date, form, and band.

Move the plan tier out of the greeting and into the account menu. Section
tiles link to `/practice?section=reading`, never to `/test/*`.

### Practice picker

One screen instead of three stacked steps.

- **Left:** a section segmented control (Listening / Reading / Writing /
  Speaking), then the question types for that section as a list. Each row:
  icon, label, one line of what the exam asks ("Decide whether each statement
  agrees with the passage"), and your accuracy from past attempts when known.
- **Right, sticky:** the summary. Selected type, difficulty as a segmented
  control (Foundation / Standard / Challenge with the band ranges), an estimate
  ("10 questions · about 12 minutes"), and the Start button.
- Drop the per-tile Free badge. Show a single lock icon on premium types only.
- Writing and Speaking skip the type list and show Task 1 / Task 2 or Part 1 /
  2 / 3 as the choice instead of a disabled step.

### Players (exam register)

Shared changes in `PlayerHeader`, `QuestionNavigator` and `QuestionBlock`:

- **Header:** section and part on the left, the timer centred in mono with a
  hide / show toggle, and on the right text size (A- / A+), flag, and Submit.
  "Exit" moves behind a confirm dialog since leaving does not stop the clock.
- **Timer announcements:** remove `aria-live` from the per-second clock. Use an
  `aria-live="assertive"` region that announces at 10 minutes and 5 minutes
  only, and tint the clock at 5 minutes as today.
- **Navigator:** group question numbers under Part 1 / Part 2 / Part 3 tabs,
  exactly as the computer-delivered test does. Each square has four states:
  blank, answered, flagged, current. Clicking a part tab scrolls to its first
  question.
- **Flag for review:** a toggle on every question, stored in the client only,
  surfaced in the navigator and in the submit dialog ("3 flagged, 2 blank").
- **Split pane:** a draggable divider with a 35 / 65 minimum, and a swap button.
  Both are real-exam features.
- **Passage tools:** select text to highlight (persist in local state per
  attempt) and add a short note. Clear-all in the toolbar.
- **Question cards:** drop the per-question shadow and the type label (the
  group instructions already say it). The current question gets a 3 px left
  rule in the accent instead of a tinted background.

Per player:

- **Listening:** one large status line, "Part 2 · Audio playing · 4:12 of
  6:40", with a non-interactive progress bar. The audio cannot be scrubbed, so
  do not render a scrubber. Show the four parts in the navigator with the
  played parts locked.
- **Writing:** prompt and editor side by side at `md` and above, with the chart
  image in the prompt pane. Word count and the save state live in the editor
  footer. The task switcher becomes two tabs with word counts, as today.
- **Speaking:** a large record state (Prepare 0:42 / Recording 1:18) with a
  countdown ring for the Part 2 preparation minute and the cue card centred.

### Results

- **Top:** the overall band large, the target next to it, and the change since
  the previous completed attempt ("+0.5"). Below it the four section bands on
  one 0 to 9 ruler each, with the target marker. Colour encodes at-or-above
  target versus below, not an absolute scale.
- The AI disclaimer becomes one muted line under the bands.
- **Writing and speaking feedback:** the candidate's own text on the left with
  the evidence quotes highlighted and numbered; the four criteria on the right,
  each linking to its highlights. The data already exists in
  `feedback[criterion].evidence`.
- **Answer review:** filter chips (All / Incorrect / Flagged / by type). On
  phones render rows as stacked cards instead of a 46 rem table. Each
  incorrect row gets "Practise this type" inline.

### States and motion

- Skeletons shaped like the content for every loading state. Empty states with
  one sentence and one action ("Sit a mock test to get your first estimate" →
  Start a mock).
- Save errors in the player as a toast with Retry, not an inline strip that
  shifts the layout.
- Remove the global `hover:-translate-y-0.5` on `Button` and the hover lift on
  `Card`. Keep one page-enter transition. Keep the reduced-motion rule.

### Accessibility checks to carry through

- Every token pair meets 4.5:1 in both themes; the proposed accent is 7.2:1 on
  paper and 8.1:1 on the dark surface.
- Navigator squares get `aria-pressed` for flagged and keep `aria-current`.
- The passage pane gets a visible "Skip to questions" link on mobile.
- The review table is a real table on desktop with `scope` on headers; the
  mobile card version keeps the same reading order.

## Rollout

Each phase ships on its own and leaves the app consistent.

| Phase | Scope | Files | Risk |
|---|---|---|---|
| 1 | Tokens, fonts, icons, remove global hover motion, fix dark-mode literals | `styles.css`, `Button`, `Card`, `nav.ts`, `Landing`, `index.tsx`, `Logo` | Low |
| 2 | Single navigation: rail + bottom tabs, marketing header for visitors | `Header`, `Sidebar`, `AppShell`, new `BottomTabs` | Low |
| 3 | Dashboard and practice picker | `index.tsx`, `practice.tsx`, `enhance.tsx` → redirect | Medium |
| 4 | Player conventions: part tabs, flags, timer, split pane, writing side by side | `player/*`, `test.*.tsx`, `usePlayerAttempt` (flags) | Medium |
| 5 | Results: ruler bands, highlighted evidence, review filters | `results.$attemptId.tsx` | Medium |
| 6 | Landing with live question, legal pages | `Landing`, new routes | Low |

Phases 1 and 2 are a few hundred lines and can go in one PR. Phase 4 is the
one that changes how the product feels and should get a round of testing on a
real 40-question form before it ships.

## Out of scope

Pricing and payments UI, course content, and the admin builder. The admin
screens should pick up the tokens and icons from phase 1 automatically and
need no redesign of their own.
