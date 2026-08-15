-- 0005_seed_question_types.sql
-- Seed the question type registry.
--
-- This is reference DATA, not schema: adding an IELTS question type in future
-- is an INSERT here, and requires no migration to any constraint. Every entry
-- maps onto one of the four renderers the players implement.
--
-- Idempotent: re-running updates labels and limits without disturbing any
-- question rows that reference these codes.

insert into public.question_types
  (code, section, label, renderer, default_word_limit)
values
  ('multiple_choice_single',    'reading',   'Multiple choice (one answer)',      'radio',      0),
  ('multiple_choice_multiple',  'reading',   'Multiple choice (several answers)', 'checkbox',   0),
  ('true_false_notgiven',       'reading',   'True / False / Not Given',          'radio',      0),
  ('yes_no_notgiven',           'reading',   'Yes / No / Not Given',              'radio',      0),
  ('matching_headings',         'reading',   'Matching headings',                 'dropdown',   0),
  ('matching_information',      'reading',   'Matching information',              'dropdown',   0),
  ('matching_features',         'reading',   'Matching features',                 'dropdown',   0),
  ('matching_sentence_endings', 'reading',   'Matching sentence endings',         'dropdown',   0),
  ('sentence_completion',       'reading',   'Sentence completion',               'text_input', 2),
  ('summary_completion',        'reading',   'Summary completion',                'text_input', 2),
  ('note_completion',           'listening', 'Note completion',                   'text_input', 2),
  ('table_completion',          'listening', 'Table completion',                  'text_input', 2),
  ('flowchart_completion',      'listening', 'Flow-chart completion',             'text_input', 2),
  ('diagram_label',             'listening', 'Diagram labelling',                 'text_input', 2),
  ('short_answer',              'reading',   'Short answer',                      'text_input', 3)
on conflict (code) do update
  set label = excluded.label,
      renderer = excluded.renderer,
      default_word_limit = excluded.default_word_limit,
      is_active = true;

-- Note on the `section` column: it records the section a type is most
-- associated with, for grouping in the practice picker. It is not a
-- restriction -- most completion and matching types appear in both Listening
-- and Reading, and the admin builder allows any active type in any section.
