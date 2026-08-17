-- supabase/seed.sql
--
-- GENERATED FILE. Regenerate with scripts/generate-seed.ts.
--
-- One complete published Academic form so every screen has real content on
-- a fresh project. Idempotent: ids are derived from stable names, so
-- re-running updates rather than duplicates.

begin;

insert into public.test_forms (id, title, description, variant, delivery_mode, is_published, is_premium, scoring_version)
values ('11111111-2222-4333-8444-555555555555', 'Academic Mock Test 1', 'A full Academic practice test covering all four sections.', 'academic', 'computer', true, false, 'v1')
on conflict (id) do update set title = excluded.title, is_published = excluded.is_published;

insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)
values ('f3c4fb7e-431e-4178-bfbd-cceeefdf9190', '11111111-2222-4333-8444-555555555555', 'listening', 1800, 40, NULL, 0)
on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('d31cbca2-6b8d-4ecf-9f35-673a337b2a93', 'f3c4fb7e-431e-4178-bfbd-cceeefdf9190', 1, NULL, '/mock-audio/part-1.mp3', NULL, 'Questions 1-10. Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.', '{}'::jsonb, 0)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('e35b13bd-b093-419b-9df6-b8e864068fb6', 'd31cbca2-6b8d-4ecf-9f35-673a337b2a93', 'note_completion', 'Caller''s surname: ______', '[]'::jsonb, ARRAY['Whitcombe']::text[], 2, 'lenient', true, false, '{}'::jsonb, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('c2eaee14-de2c-4b16-8889-3280c71eb720', 'd31cbca2-6b8d-4ecf-9f35-673a337b2a93', 'note_completion', 'Membership type required: ______ membership', '[]'::jsonb, ARRAY['off-peak', 'offpeak']::text[], 2, 'lenient', true, false, '{}'::jsonb, 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('39538d36-d98e-4d5b-9eb5-d4fb18187012', 'd31cbca2-6b8d-4ecf-9f35-673a337b2a93', 'note_completion', 'Preferred start date: ______ March', '[]'::jsonb, ARRAY['14th', '14', 'fourteenth']::text[], 2, 'lenient', true, false, '{}'::jsonb, 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('0c278aa9-3ded-4ed7-99f0-44721384a5e5', 'd31cbca2-6b8d-4ecf-9f35-673a337b2a93', 'note_completion', 'Monthly fee: £______', '[]'::jsonb, ARRAY['32.50', '32,50']::text[], 2, 'lenient', true, false, '{}'::jsonb, 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('3b1101c0-23fe-416f-abc5-67d332cb02ab', 'd31cbca2-6b8d-4ecf-9f35-673a337b2a93', 'note_completion', 'Joining fee is waived for members who pay by ______', '[]'::jsonb, ARRAY['direct debit']::text[], 2, 'lenient', true, false, '{}'::jsonb, 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('e5b7b8ac-bd3b-4fe0-bf84-83adafd5fec2', 'd31cbca2-6b8d-4ecf-9f35-673a337b2a93', 'note_completion', 'Centre closes at ______ on Sundays', '[]'::jsonb, ARRAY['6pm', '6 pm', '18:00']::text[], 2, 'lenient', true, false, '{}'::jsonb, 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('1b74f92c-6f6e-41e9-a80d-f537b2d11dd5', 'd31cbca2-6b8d-4ecf-9f35-673a337b2a93', 'note_completion', 'Caller is interested in the ______ class on Tuesdays', '[]'::jsonb, ARRAY['badminton']::text[], 2, 'lenient', true, false, '{}'::jsonb, 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('cf4d8ac6-abb3-4d8e-82ab-31e871eff033', 'd31cbca2-6b8d-4ecf-9f35-673a337b2a93', 'note_completion', 'Classes must be booked ______ hours in advance', '[]'::jsonb, ARRAY['48', 'forty-eight']::text[], 2, 'lenient', true, false, '{}'::jsonb, 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('d3d3c158-26e1-416b-aa03-a05473095faf', 'd31cbca2-6b8d-4ecf-9f35-673a337b2a93', 'note_completion', 'Free parking is limited to ______ minutes', '[]'::jsonb, ARRAY['90', 'ninety']::text[], 2, 'lenient', true, false, '{}'::jsonb, 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('f4f73c77-5811-4d38-8f85-4e6cd68a5baf', 'd31cbca2-6b8d-4ecf-9f35-673a337b2a93', 'note_completion', 'Induction appointment booked with ______', '[]'::jsonb, ARRAY['Marco', 'Marco Silva']::text[], 2, 'lenient', true, false, '{}'::jsonb, 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('ad934cc2-03d8-474b-97e2-fb90ca09728b', 'f3c4fb7e-431e-4178-bfbd-cceeefdf9190', 2, NULL, '/mock-audio/part-2.mp3', '/mock-images/site-plan.svg', 'Questions 11-20. Choose the correct letter for Questions 11-14, match the facilities for Questions 15-17, and label the plan for Questions 18-20.', '{"image_caption":"Site plan referred to in Questions 18-20"}'::jsonb, 1)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('f8c7c470-866b-4a18-9653-950229599879', 'ad934cc2-03d8-474b-97e2-fb90ca09728b', 'multiple_choice_single', 'The arts centre was originally built as', '[{"value":"A","label":"A. a school"},{"value":"B","label":"B. a railway depot"},{"value":"C","label":"C. a public library"},{"value":"D","label":"D. a swimming baths"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('c61c3a24-41a9-47e2-bbf9-ae4a8c5a52a7', 'ad934cc2-03d8-474b-97e2-fb90ca09728b', 'multiple_choice_single', 'The speaker says the busiest period is', '[{"value":"A","label":"A. weekday mornings"},{"value":"B","label":"B. weekday evenings"},{"value":"C","label":"C. Saturday afternoons"},{"value":"D","label":"D. Sunday mornings"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('83d407cd-bea1-42af-8c57-ef5824ab57df', 'ad934cc2-03d8-474b-97e2-fb90ca09728b', 'multiple_choice_single', 'Members receive a discount of', '[{"value":"A","label":"A. 10 per cent"},{"value":"B","label":"B. 15 per cent"},{"value":"C","label":"C. 20 per cent"},{"value":"D","label":"D. 25 per cent"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('782caea0-b8ab-4b70-8fe7-53eecd941632', 'ad934cc2-03d8-474b-97e2-fb90ca09728b', 'multiple_choice_single', 'The speaker advises newcomers to start with', '[{"value":"A","label":"A. the drop-in session"},{"value":"B","label":"B. a taster weekend"},{"value":"C","label":"C. the online tutorials"},{"value":"D","label":"D. a private lesson"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('7f337321-9541-4dc5-b81c-08055f803583', 'ad934cc2-03d8-474b-97e2-fb90ca09728b', 'matching_features', 'Where can visitors leave large bags?', '[{"value":"A","label":"A. Reception"},{"value":"B","label":"B. Equipment store"},{"value":"C","label":"C. Studio 1"},{"value":"D","label":"D. Studio 2"},{"value":"E","label":"E. Cafe"},{"value":"F","label":"F. Changing rooms"},{"value":"G","label":"G. Outdoor court"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('8fb26e3d-8374-4b1d-9f07-33b38c1c3bff', 'ad934cc2-03d8-474b-97e2-fb90ca09728b', 'matching_features', 'Where is the exhibition of members'' work held?', '[{"value":"A","label":"A. Reception"},{"value":"B","label":"B. Equipment store"},{"value":"C","label":"C. Studio 1"},{"value":"D","label":"D. Studio 2"},{"value":"E","label":"E. Cafe"},{"value":"F","label":"F. Changing rooms"},{"value":"G","label":"G. Outdoor court"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('85f70911-a654-4207-9c49-f6f920c3c0a0', 'ad934cc2-03d8-474b-97e2-fb90ca09728b', 'matching_features', 'Where do the summer evening performances take place?', '[{"value":"A","label":"A. Reception"},{"value":"B","label":"B. Equipment store"},{"value":"C","label":"C. Studio 1"},{"value":"D","label":"D. Studio 2"},{"value":"E","label":"E. Cafe"},{"value":"F","label":"F. Changing rooms"},{"value":"G","label":"G. Outdoor court"}]'::jsonb, ARRAY['G']::text[], 0, 'lenient', true, false, '{}'::jsonb, 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('98bf22aa-3d80-4769-8c11-391198893b48', 'ad934cc2-03d8-474b-97e2-fb90ca09728b', 'diagram_label', 'Label 18 on the site plan (building north of the entrance)', '[]'::jsonb, ARRAY['equipment store', 'store']::text[], 2, 'lenient', true, false, '{}'::jsonb, 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('7d1534d0-577d-4f81-9abf-594591f58eb1', 'ad934cc2-03d8-474b-97e2-fb90ca09728b', 'diagram_label', 'Label 19 on the site plan (across the courtyard)', '[]'::jsonb, ARRAY['cafe', 'café']::text[], 2, 'lenient', true, false, '{}'::jsonb, 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('6b8a0ab1-d0f6-4cd0-9acd-47c4319d349f', 'ad934cc2-03d8-474b-97e2-fb90ca09728b', 'diagram_label', 'Label 20 on the site plan (beside the car park)', '[]'::jsonb, ARRAY['changing rooms', 'changing room']::text[], 2, 'lenient', true, false, '{}'::jsonb, 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('09df0e36-86a8-4c2a-9012-a3bdd6f0716e', 'f3c4fb7e-431e-4178-bfbd-cceeefdf9190', 3, NULL, '/mock-audio/part-3.mp3', NULL, 'Questions 21-30. Choose the correct letter for Questions 21-24, choose TWO letters for Questions 25-26, and match the speakers for Questions 27-30.', '{}'::jsonb, 2)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('e82c2c93-c84f-496b-8cdd-d380f97c00f2', '09df0e36-86a8-4c2a-9012-a3bdd6f0716e', 'multiple_choice_single', 'Priya is concerned that their sample size is', '[{"value":"A","label":"A. too small to be meaningful"},{"value":"B","label":"B. larger than they can process"},{"value":"C","label":"C. unevenly spread across sites"},{"value":"D","label":"D. drawn from a single season"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('f7561742-6cd3-4782-9842-b8b0bc886711', '09df0e36-86a8-4c2a-9012-a3bdd6f0716e', 'multiple_choice_single', 'Tomas suggests solving the problem by', '[{"value":"A","label":"A. visiting two additional sites"},{"value":"B","label":"B. pooling data with another group"},{"value":"C","label":"C. extending the survey period"},{"value":"D","label":"D. reducing the number of variables"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('69b53377-93ec-42c3-816e-bcd6547672ae', '09df0e36-86a8-4c2a-9012-a3bdd6f0716e', 'multiple_choice_single', 'Their supervisor''s main objection to the first draft was', '[{"value":"A","label":"A. the length of the literature review"},{"value":"B","label":"B. the absence of a control site"},{"value":"C","label":"C. the choice of statistical test"},{"value":"D","label":"D. the quality of the photographs"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('6a3fbe4c-af21-4371-9143-08796527231d', '09df0e36-86a8-4c2a-9012-a3bdd6f0716e', 'multiple_choice_single', 'They agree that the fieldwork diary should be', '[{"value":"A","label":"A. submitted as an appendix"},{"value":"B","label":"B. summarised in the introduction"},{"value":"C","label":"C. left out of the report"},{"value":"D","label":"D. rewritten as a narrative"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('9daabbcd-30ad-46dc-ad9e-ce3694e5e5f4', '09df0e36-86a8-4c2a-9012-a3bdd6f0716e', 'multiple_choice_multiple', 'Which TWO problems did the students have with the recording equipment? Choose TWO letters.', '[{"value":"A","label":"A. Battery life in cold conditions"},{"value":"B","label":"B. Incompatible memory cards"},{"value":"C","label":"C. Background noise from the road"},{"value":"D","label":"D. A faulty microphone cable"},{"value":"E","label":"E. Difficulty mounting the tripod"}]'::jsonb, ARRAY['A', 'C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('8ebe62b8-1490-4930-ac9a-0bcafc82ca9d', '09df0e36-86a8-4c2a-9012-a3bdd6f0716e', 'multiple_choice_multiple', 'Which TWO changes will they make before the next visit? Choose TWO letters.', '[{"value":"A","label":"A. Start recording earlier in the day"},{"value":"B","label":"B. Bring a second observer"},{"value":"C","label":"C. Use a different site entirely"},{"value":"D","label":"D. Shorten each recording session"},{"value":"E","label":"E. Borrow a windshield for the microphone"}]'::jsonb, ARRAY['A', 'E']::text[], 0, 'lenient', true, false, '{}'::jsonb, 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('0b8082a8-8dfe-4dbb-a0fd-721134befc8c', '09df0e36-86a8-4c2a-9012-a3bdd6f0716e', 'matching_features', 'Who proposed the original research question?', '[{"value":"A","label":"A. Priya"},{"value":"B","label":"B. Tomas"},{"value":"C","label":"C. Dr Whitfield"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('0bc69fa2-36a8-49cf-80db-299783953544', '09df0e36-86a8-4c2a-9012-a3bdd6f0716e', 'matching_features', 'Who will write the methodology section?', '[{"value":"A","label":"A. Priya"},{"value":"B","label":"B. Tomas"},{"value":"C","label":"C. Dr Whitfield"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('1a452611-e9b8-4811-a677-d54639c20c94', '09df0e36-86a8-4c2a-9012-a3bdd6f0716e', 'matching_features', 'Who arranged access to the second site?', '[{"value":"A","label":"A. Priya"},{"value":"B","label":"B. Tomas"},{"value":"C","label":"C. Dr Whitfield"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('b253ec3f-3642-4262-87a5-4b41de60c10e', '09df0e36-86a8-4c2a-9012-a3bdd6f0716e', 'matching_features', 'Who is responsible for the final proofread?', '[{"value":"A","label":"A. Priya"},{"value":"B","label":"B. Tomas"},{"value":"C","label":"C. Dr Whitfield"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('3fc1bd89-1a8b-4d45-81fe-4b8c89057fa1', 'f3c4fb7e-431e-4178-bfbd-cceeefdf9190', 4, NULL, '/mock-audio/part-4.mp3', NULL, 'Questions 31-40. Complete the notes, table and flow-chart below. Write ONE WORD ONLY for each answer.', '{}'::jsonb, 3)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('57dc66ef-7e4c-45a1-a9f1-0e496e36e2a1', '3fc1bd89-1a8b-4d45-81fe-4b8c89057fa1', 'sentence_completion', 'Before the railways, each town kept time by the position of the ______.', '[]'::jsonb, ARRAY['sun']::text[], 1, 'lenient', true, false, '{}'::jsonb, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('bfe44eab-6152-45d5-8414-9bb9941b3ecf', '3fc1bd89-1a8b-4d45-81fe-4b8c89057fa1', 'sentence_completion', 'The difference between two English towns could be as much as twenty ______.', '[]'::jsonb, ARRAY['minutes']::text[], 1, 'lenient', true, false, '{}'::jsonb, 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('25bbc346-9e8d-473c-982f-32ccbe0e925c', '3fc1bd89-1a8b-4d45-81fe-4b8c89057fa1', 'sentence_completion', 'Railway companies published timetables using a single ______ time.', '[]'::jsonb, ARRAY['London', 'standard']::text[], 1, 'lenient', true, false, '{}'::jsonb, 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('b214f74a-8c31-4a2d-b31d-30321358240f', '3fc1bd89-1a8b-4d45-81fe-4b8c89057fa1', 'summary_completion', 'Opposition came mainly from local ______ who saw it as interference.', '[]'::jsonb, ARRAY['councils', 'authorities']::text[], 1, 'lenient', true, false, '{}'::jsonb, 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('a600d058-0468-4c33-be0d-0159aa077cfa', '3fc1bd89-1a8b-4d45-81fe-4b8c89057fa1', 'summary_completion', 'The change was described by critics as a loss of local ______.', '[]'::jsonb, ARRAY['identity', 'character']::text[], 1, 'lenient', true, false, '{}'::jsonb, 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('b75cc71d-e7ee-4896-81f9-3fd9b6308f03', '3fc1bd89-1a8b-4d45-81fe-4b8c89057fa1', 'table_completion', 'Table: 1840 — first company to adopt standard time: Great ______ Railway', '[]'::jsonb, ARRAY['Western']::text[], 1, 'lenient', true, false, '{}'::jsonb, 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('a80d6a49-22c6-42ca-ae1c-6208f21f6c27', '3fc1bd89-1a8b-4d45-81fe-4b8c89057fa1', 'table_completion', 'Table: 1880 — standard time given legal ______ in Britain', '[]'::jsonb, ARRAY['force', 'status']::text[], 1, 'lenient', true, false, '{}'::jsonb, 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('97fc4317-3c75-4ff3-8090-b3a3e2211e8d', '3fc1bd89-1a8b-4d45-81fe-4b8c89057fa1', 'flowchart_completion', 'Flow-chart step 1: Astronomers determine the reference ______.', '[]'::jsonb, ARRAY['meridian']::text[], 1, 'lenient', true, false, '{}'::jsonb, 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('674f2b5c-4ccd-4130-8de6-a2de4d1110a9', '3fc1bd89-1a8b-4d45-81fe-4b8c89057fa1', 'flowchart_completion', 'Flow-chart step 2: Signal distributed by ______ to major stations.', '[]'::jsonb, ARRAY['telegraph']::text[], 1, 'lenient', true, false, '{}'::jsonb, 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('4bae5d38-d228-4f8f-815b-e6935498b50c', '3fc1bd89-1a8b-4d45-81fe-4b8c89057fa1', 'flowchart_completion', 'Flow-chart step 3: Station masters reset the platform ______ each morning.', '[]'::jsonb, ARRAY['clock', 'clocks']::text[], 1, 'lenient', true, false, '{}'::jsonb, 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)
values ('e8352666-7c81-4285-abf8-05b7e883b99c', '11111111-2222-4333-8444-555555555555', 'reading', 3600, 40, NULL, 1)
on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('e4da6d88-75db-40fe-9182-440cee7d007e', 'e8352666-7c81-4285-abf8-05b7e883b99c', 1, 'The wandering albatross, Diomedea exulans, has the largest wingspan of any living bird. A mature adult measures up to three and a half metres from tip to tip, and yet the bird is remarkable less for its size than for what it does with it. Satellite tracking has shown individuals covering more than a thousand kilometres in a single day and circling the Southern Ocean in under two months, all while beating their wings only rarely.

The trick is a technique called dynamic soaring. Wind blowing across the open ocean is slowed near the surface by friction with the water, so a bird climbing from the trough of a wave into the faster air above gains speed relative to the ground without expending muscular effort. The albatross rises into the wind, turns, and descends across it, extracting a small amount of energy from the wind gradient on every cycle. Repeated tens of thousands of times a day, these shallow arcs carry the bird enormous distances. A tendon lock in the shoulder holds the wing extended, so that maintaining the spread costs the bird almost nothing.

Measurements bear this out. Researchers who fitted birds with heart-rate loggers found that the metabolic cost of soaring flight was barely higher than that of sitting on the nest. The expensive parts of an albatross''s day are take-off and landing, which is why the birds are reluctant to leave the water in calm conditions and may sit out a windless afternoon entirely.

This economy of movement shapes the species'' breeding biology. A pair raises a single chick, and the effort takes so long that successful breeders can attempt it only every second year. The male and female take turns at the nest on Southern Ocean islands while the other forages, sometimes as far away as the coast of South America. A foraging trip of a fortnight is unremarkable. The chick, left alone on its nest mound for days at a time, is fed on an irregular schedule and grows slowly, fledging after roughly nine months.

That long, slow schedule is the source of the species'' present difficulty. Longline fishing vessels set baited hooks that sink slowly behind the boat, and albatrosses, which follow ships as a matter of course, dive on the bait and are dragged under. Because the birds breed so infrequently, a population cannot absorb additional adult mortality the way a fast-breeding species can. Conservationists have pressed for simple mitigation measures: streamer lines that scare birds away from the sinking hooks, weighted lines that sink faster, and setting gear at night when fewer birds are active.

Where these measures have been adopted and enforced, seabird bycatch has fallen sharply, in some fisheries by more than ninety per cent. The difficulty is that the albatross''s range is far larger than any one country''s waters. A bird nesting on South Georgia may pass through the jurisdictions of half a dozen states and long stretches of unregulated high seas in a single foraging trip. Protection is therefore a matter of agreement between fleets rather than of any single national rule, and the birds continue to decline in the regions where such agreement has proved hardest to reach.', NULL, NULL, 'You should spend about 20 minutes on Questions 1-13, which are based on Reading Passage 1 below.', '{}'::jsonb, 0)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('191d747e-1fae-452b-8b1e-a70851daee3e', 'e4da6d88-75db-40fe-9182-440cee7d007e', 'true_false_notgiven', 'The wandering albatross has a greater wingspan than any other bird alive today.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['TRUE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('7921ba1c-f4a5-4667-b3e0-2527a571f8ae', 'e4da6d88-75db-40fe-9182-440cee7d007e', 'true_false_notgiven', 'Albatrosses flap their wings continuously during long ocean crossings.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['FALSE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('4ee3607a-9fc2-4afe-a9d0-602b13cf2665', 'e4da6d88-75db-40fe-9182-440cee7d007e', 'true_false_notgiven', 'Dynamic soaring depends on the difference in wind speed at different heights.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['TRUE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('fd968056-a064-48d8-916a-115c08a70e10', 'e4da6d88-75db-40fe-9182-440cee7d007e', 'true_false_notgiven', 'Young albatrosses learn dynamic soaring from their parents.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NOT GIVEN']::text[], 0, 'lenient', true, false, '{}'::jsonb, 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('f5d03a31-e640-42bd-be2b-10f993c46659', 'e4da6d88-75db-40fe-9182-440cee7d007e', 'true_false_notgiven', 'Taking off uses more energy than remaining airborne.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['TRUE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('225a87cc-637b-49c0-b58e-0ea2ff106a0f', 'e4da6d88-75db-40fe-9182-440cee7d007e', 'true_false_notgiven', 'A breeding pair raises two chicks in a successful season.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['FALSE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('069cbeb8-9123-4eb3-8a37-d4b72e18647a', 'e4da6d88-75db-40fe-9182-440cee7d007e', 'note_completion', 'A locked ______ in the shoulder holds the wing open at no cost.', '[]'::jsonb, ARRAY['tendon']::text[], 2, 'lenient', true, false, '{}'::jsonb, 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('afd23bf9-ff0c-4239-84dd-93577518112f', 'e4da6d88-75db-40fe-9182-440cee7d007e', 'note_completion', 'Chicks leave the nest after about ______ months.', '[]'::jsonb, ARRAY['nine', '9']::text[], 2, 'lenient', true, false, '{}'::jsonb, 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('ef8ca344-c193-4da1-b64d-7451e597b5ac', 'e4da6d88-75db-40fe-9182-440cee7d007e', 'note_completion', '______ lines frighten birds away from hooks as they sink.', '[]'::jsonb, ARRAY['streamer', 'streamer lines']::text[], 2, 'lenient', true, false, '{}'::jsonb, 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('a607b407-fffd-43a8-8bea-b2c83aa313b9', 'e4da6d88-75db-40fe-9182-440cee7d007e', 'note_completion', 'Setting fishing gear at ______ reduces the number of birds caught.', '[]'::jsonb, ARRAY['night']::text[], 2, 'lenient', true, false, '{}'::jsonb, 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('04f5ad7c-3c5f-4223-a83e-d0b8e87ae3af', 'e4da6d88-75db-40fe-9182-440cee7d007e', 'short_answer', 'How often can a successful breeding pair attempt to raise a chick?', '[]'::jsonb, ARRAY['every second year', 'every two years', 'biennially']::text[], 3, 'lenient', true, false, '{}'::jsonb, 10)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('74e0214e-3391-463e-b224-5d71276d13a5', 'e4da6d88-75db-40fe-9182-440cee7d007e', 'short_answer', 'What is added to fishing lines so that they sink more quickly?', '[]'::jsonb, ARRAY['weights', 'weight']::text[], 3, 'lenient', true, false, '{}'::jsonb, 11)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('0ec78398-7803-4696-ae28-ff2b5a66d718', 'e4da6d88-75db-40fe-9182-440cee7d007e', 'short_answer', 'By how much has bycatch fallen in some fisheries where measures are enforced?', '[]'::jsonb, ARRAY['more than ninety per cent', '90%', 'ninety per cent', 'over 90 per cent']::text[], 3, 'lenient', true, false, '{}'::jsonb, 12)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('98b379e1-f55a-41b6-9ec3-2e5cf8cea729', 'e8352666-7c81-4285-abf8-05b7e883b99c', 2, 'A. For most of the twentieth century, the trees in a city budget appeared only as a cost. They were planted, pruned, cleared of storm damage and eventually removed, and each of those activities had a line item. Nothing on the other side of the ledger recorded what the trees returned. A parks department could therefore demonstrate the expense of its canopy with great precision while being unable to say what the city received for the money.

B. That began to change when researchers started attaching instruments to street trees. A mature plane tree in a temperate city intercepts several thousand litres of rainfall a year, water that would otherwise arrive at the drains during the few minutes of a storm when the system is least able to accept it. The same tree removes measurable quantities of particulate matter from the air and shades enough asphalt to lower the surface temperature beneath it by fifteen degrees or more on a summer afternoon. Each of these effects corresponds to money a city would otherwise spend on drainage capacity, on health care, or on electricity for cooling.

C. Putting a figure on the shade proved the most consequential of these calculations. During a severe heat episode, the difference between a shaded and an unshaded street is not a matter of comfort but of mortality, and it falls unevenly. Surveys of several large cities found canopy cover closely tracking historical patterns of wealth: the wealthiest districts commonly carried two or three times the leaf area of the poorest, and recorded correspondingly lower night-time temperatures. Heat, it turned out, was distributed along the same lines as everything else.

D. The economics of planting, however, are awkward for any elected official. A newly planted street tree delivers very little in its first decade. Its canopy is small, its roots are still establishing, and it requires watering through dry summers to survive at all. The benefits described above accrue to a tree of thirty or forty years'' standing. The councillor who authorises the planting will not be in office when the investment matures, and the residents who pay for it are not, in the main, the residents who will sit beneath it.

E. Selecting what to plant has become harder as well. A species that thrives in a city''s present climate may be poorly suited to the conditions expected there in fifty years, and the trees being planted now will still be standing then. Some municipal foresters have responded by planting deliberately mixed streets, accepting that a proportion of what goes in will fail, on the argument that a diverse canopy is more likely to survive both a warming climate and the arrival of a new pest. Others have begun sourcing familiar species from populations several hundred kilometres to the south.

F. What has changed, in the end, is not the trees but the accounting. Once a city can state that its canopy returns a given sum per year in avoided drainage, cooling and health costs, the conversation shifts from amenity to infrastructure. Several cities now carry their trees on the asset register alongside the bridges and the drains, which means that removing one is recorded as the disposal of an asset rather than the completion of a job.', NULL, NULL, 'You should spend about 20 minutes on Questions 14-26, which are based on Reading Passage 2 below.', '{}'::jsonb, 1)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('9f7fa5bf-bce2-4d2c-ad62-e522b617d550', '98b379e1-f55a-41b6-9ec3-2e5cf8cea729', 'matching_headings', 'Paragraph A — choose the most suitable heading.', '[{"value":"i","label":"i. A cost that never appears on the balance sheet"},{"value":"ii","label":"ii. Measuring what the canopy actually does"},{"value":"iii","label":"iii. Early objections from residents"},{"value":"iv","label":"iv. The uneven distribution of shade"},{"value":"v","label":"v. Where the money for planting comes from"},{"value":"vi","label":"vi. A slow return on a long investment"},{"value":"vii","label":"vii. Lessons from a single heatwave"},{"value":"viii","label":"viii. Choosing species for a warmer century"}]'::jsonb, ARRAY['i']::text[], 0, 'lenient', true, false, '{}'::jsonb, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('1b2a985e-e1fd-426f-a5e1-e82785b79f07', '98b379e1-f55a-41b6-9ec3-2e5cf8cea729', 'matching_headings', 'Paragraph B — choose the most suitable heading.', '[{"value":"i","label":"i. A cost that never appears on the balance sheet"},{"value":"ii","label":"ii. Measuring what the canopy actually does"},{"value":"iii","label":"iii. Early objections from residents"},{"value":"iv","label":"iv. The uneven distribution of shade"},{"value":"v","label":"v. Where the money for planting comes from"},{"value":"vi","label":"vi. A slow return on a long investment"},{"value":"vii","label":"vii. Lessons from a single heatwave"},{"value":"viii","label":"viii. Choosing species for a warmer century"}]'::jsonb, ARRAY['ii']::text[], 0, 'lenient', true, false, '{}'::jsonb, 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('d2c29352-f73c-47a4-9355-7c789873342d', '98b379e1-f55a-41b6-9ec3-2e5cf8cea729', 'matching_headings', 'Paragraph C — choose the most suitable heading.', '[{"value":"i","label":"i. A cost that never appears on the balance sheet"},{"value":"ii","label":"ii. Measuring what the canopy actually does"},{"value":"iii","label":"iii. Early objections from residents"},{"value":"iv","label":"iv. The uneven distribution of shade"},{"value":"v","label":"v. Where the money for planting comes from"},{"value":"vi","label":"vi. A slow return on a long investment"},{"value":"vii","label":"vii. Lessons from a single heatwave"},{"value":"viii","label":"viii. Choosing species for a warmer century"}]'::jsonb, ARRAY['iv']::text[], 0, 'lenient', true, false, '{}'::jsonb, 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('d5883829-70e5-4b31-a0d4-299045f97322', '98b379e1-f55a-41b6-9ec3-2e5cf8cea729', 'matching_headings', 'Paragraph D — choose the most suitable heading.', '[{"value":"i","label":"i. A cost that never appears on the balance sheet"},{"value":"ii","label":"ii. Measuring what the canopy actually does"},{"value":"iii","label":"iii. Early objections from residents"},{"value":"iv","label":"iv. The uneven distribution of shade"},{"value":"v","label":"v. Where the money for planting comes from"},{"value":"vi","label":"vi. A slow return on a long investment"},{"value":"vii","label":"vii. Lessons from a single heatwave"},{"value":"viii","label":"viii. Choosing species for a warmer century"}]'::jsonb, ARRAY['vi']::text[], 0, 'lenient', true, false, '{}'::jsonb, 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('c65f797c-2f6d-4635-b9f0-b570d5509b35', '98b379e1-f55a-41b6-9ec3-2e5cf8cea729', 'matching_headings', 'Paragraph E — choose the most suitable heading.', '[{"value":"i","label":"i. A cost that never appears on the balance sheet"},{"value":"ii","label":"ii. Measuring what the canopy actually does"},{"value":"iii","label":"iii. Early objections from residents"},{"value":"iv","label":"iv. The uneven distribution of shade"},{"value":"v","label":"v. Where the money for planting comes from"},{"value":"vi","label":"vi. A slow return on a long investment"},{"value":"vii","label":"vii. Lessons from a single heatwave"},{"value":"viii","label":"viii. Choosing species for a warmer century"}]'::jsonb, ARRAY['viii']::text[], 0, 'lenient', true, false, '{}'::jsonb, 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('31d757c3-db46-47a8-b636-b71470c18f3f', '98b379e1-f55a-41b6-9ec3-2e5cf8cea729', 'matching_headings', 'Paragraph F — choose the most suitable heading.', '[{"value":"i","label":"i. A cost that never appears on the balance sheet"},{"value":"ii","label":"ii. Measuring what the canopy actually does"},{"value":"iii","label":"iii. Early objections from residents"},{"value":"iv","label":"iv. The uneven distribution of shade"},{"value":"v","label":"v. Where the money for planting comes from"},{"value":"vi","label":"vi. A slow return on a long investment"},{"value":"vii","label":"vii. Lessons from a single heatwave"},{"value":"viii","label":"viii. Choosing species for a warmer century"}]'::jsonb, ARRAY['v']::text[], 0, 'lenient', true, false, '{}'::jsonb, 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('8874c206-9564-45b1-95c2-db09f18f2e65', '98b379e1-f55a-41b6-9ec3-2e5cf8cea729', 'matching_information', 'Which paragraph contains a comparison of leaf area between richer and poorer districts?', '[{"value":"A","label":"Paragraph A"},{"value":"B","label":"Paragraph B"},{"value":"C","label":"Paragraph C"},{"value":"D","label":"Paragraph D"},{"value":"E","label":"Paragraph E"},{"value":"F","label":"Paragraph F"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('bdba9b78-cdd2-488d-ae54-2a2b404a416e', '98b379e1-f55a-41b6-9ec3-2e5cf8cea729', 'matching_information', 'Which paragraph contains a reference to trees being listed among a city''s permanent assets?', '[{"value":"A","label":"Paragraph A"},{"value":"B","label":"Paragraph B"},{"value":"C","label":"Paragraph C"},{"value":"D","label":"Paragraph D"},{"value":"E","label":"Paragraph E"},{"value":"F","label":"Paragraph F"}]'::jsonb, ARRAY['F']::text[], 0, 'lenient', true, false, '{}'::jsonb, 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('b46bb56e-2bad-43dc-bae8-6aa8c5e60db8', '98b379e1-f55a-41b6-9ec3-2e5cf8cea729', 'matching_information', 'Which paragraph contains an explanation of why the timing of the benefit is politically difficult?', '[{"value":"A","label":"Paragraph A"},{"value":"B","label":"Paragraph B"},{"value":"C","label":"Paragraph C"},{"value":"D","label":"Paragraph D"},{"value":"E","label":"Paragraph E"},{"value":"F","label":"Paragraph F"}]'::jsonb, ARRAY['D']::text[], 0, 'lenient', true, false, '{}'::jsonb, 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('b5a56fbe-4b1b-4a4f-8bc6-be7e1ab3441a', '98b379e1-f55a-41b6-9ec3-2e5cf8cea729', 'matching_information', 'Which paragraph contains a figure for the volume of rain a single tree can intercept?', '[{"value":"A","label":"Paragraph A"},{"value":"B","label":"Paragraph B"},{"value":"C","label":"Paragraph C"},{"value":"D","label":"Paragraph D"},{"value":"E","label":"Paragraph E"},{"value":"F","label":"Paragraph F"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('bd0b0be1-0bbc-4e8e-8452-43f4aafb7081', '98b379e1-f55a-41b6-9ec3-2e5cf8cea729', 'summary_completion', 'Shade from a mature tree can reduce the surface temperature of the road below it by ______ degrees or more.', '[]'::jsonb, ARRAY['fifteen', '15']::text[], 2, 'lenient', true, false, '{}'::jsonb, 10)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('0083acdb-1ce1-46b2-8bad-ce4e2204c4aa', '98b379e1-f55a-41b6-9ec3-2e5cf8cea729', 'summary_completion', 'A newly planted tree needs ______ in order to survive dry summers.', '[]'::jsonb, ARRAY['watering', 'water']::text[], 2, 'lenient', true, false, '{}'::jsonb, 11)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('cc861f9f-3f76-4a47-b2ff-52044cc6cc99', '98b379e1-f55a-41b6-9ec3-2e5cf8cea729', 'summary_completion', 'A canopy of mixed species is considered more resistant to a warming climate and to any new ______.', '[]'::jsonb, ARRAY['pest', 'pests']::text[], 2, 'lenient', true, false, '{}'::jsonb, 12)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'e8352666-7c81-4285-abf8-05b7e883b99c', 3, 'There is a persistent popular model of memory in which the mind works something like a recording device. Events are captured, filed, and later played back, and the playback may be faint or incomplete but is otherwise faithful to what was captured. Almost everything experimental psychology has learned in the past century contradicts this model, and yet it survives, not least in the courtroom, where a witness who remembers vividly is treated as a witness who remembers accurately.

The early work that unsettled the recording model was done by Frederic Bartlett, who asked English participants to read an unfamiliar Native American folk tale and to reproduce it from memory after intervals of days, weeks and finally years. The reproductions did not simply lose detail. They changed shape. Unfamiliar elements were quietly replaced with familiar ones, the supernatural passages were rationalised, and the whole was reorganised into a narrative that made sense to an English reader of the 1930s. Bartlett''s conclusion was that remembering is not retrieval but reconstruction: the mind rebuilds an account from fragments and expectations each time it is asked, and what it produces is shaped by what it expects to find.

Elizabeth Loftus later showed how easily that reconstruction can be steered. Participants who had watched a film of a traffic accident were asked how fast the cars were going when they ''smashed into'' each other; others were asked about the same film using the verb ''contacted''. The smashed group reported higher speeds, and, a week later, were substantially more likely to report having seen broken glass at the scene. There had been no broken glass. A single word in a question, asked after the event, had been incorporated into the memory of the event itself.

Lynn Nadel and others have since given this an anatomical account. A memory is not stored as a unit but distributed across the cortex, with the hippocampus binding the elements into a retrievable pattern. Each act of recall reactivates that pattern and, crucially, leaves it briefly labile before it is stabilised again. Whatever is present during that window — a leading question, another witness''s account, a photograph in a newspaper — can be bound into the pattern and will subsequently be recalled as part of the original event, indistinguishable to the rememberer from anything else in it.

This last point is the one that matters legally, and it is the one that is hardest to accept. Contaminated memories do not feel contaminated. The witness is not lying and cannot be caught out, because from the inside a reconstructed detail carries exactly the same quality of vividness as an accurate one. Worse, confidence tends to rise with each retelling: the witness who has described the scene four times to investigators is more certain by the fourth telling, and jurors read that certainty as reliability.

The practical response has been procedural rather than psychological. Identification parades are now commonly administered by an officer who does not know which member is the suspect, so that no unconscious cue can be transmitted. Witnesses are asked for a statement of confidence at the moment of first identification, before any feedback, since it is that first figure, and not the one offered in court months later, that carries diagnostic value. None of this makes memory a recording. It simply accepts that it is not one.', NULL, NULL, 'You should spend about 20 minutes on Questions 27-40, which are based on Reading Passage 3 below.', '{}'::jsonb, 2)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('211a5137-6c7d-4525-b1e4-db7a280fe2da', '5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'yes_no_notgiven', 'The popular model of memory as a recording device has been largely abandoned outside psychology.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NO']::text[], 0, 'lenient', true, false, '{}'::jsonb, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('0b63fb0d-4111-4200-af23-47922a492d5b', '5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'yes_no_notgiven', 'Bartlett''s participants altered the structure of the story, not just its details.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['YES']::text[], 0, 'lenient', true, false, '{}'::jsonb, 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('7ae4c925-f820-4d0d-8849-77dc8a68cb18', '5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'yes_no_notgiven', 'Bartlett''s study would be considered unethical by modern standards.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NOT GIVEN']::text[], 0, 'lenient', true, false, '{}'::jsonb, 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('abfd2cc4-6c46-451d-a64f-798936ff4f24', '5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'yes_no_notgiven', 'The wording of a question asked afterwards can change what a witness remembers seeing.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['YES']::text[], 0, 'lenient', true, false, '{}'::jsonb, 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('3b23d74e-e252-4135-bcfd-3dd7f5aa83c2', '5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'yes_no_notgiven', 'Jurors are generally able to distinguish a confident witness from an accurate one.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NO']::text[], 0, 'lenient', true, false, '{}'::jsonb, 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('764be002-9b23-4fd8-8b44-5ce3f048983f', '5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'multiple_choice_single', 'In Bartlett''s experiment, the changes participants made to the folk tale mainly involved', '[{"value":"A","label":"A. shortening the story to its essential events."},{"value":"B","label":"B. adapting unfamiliar material to fit familiar expectations."},{"value":"C","label":"C. adding supernatural elements that were not in the original."},{"value":"D","label":"D. confusing the story with others they had read."}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('501c0fcd-a7b8-4c8c-9b66-cd1f985b274f', '5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'multiple_choice_single', 'The detail of the broken glass is significant because', '[{"value":"A","label":"A. it was reported immediately after the film was shown."},{"value":"B","label":"B. it shows that participants misjudged the speed of the cars."},{"value":"C","label":"C. it was never present in the film the participants watched."},{"value":"D","label":"D. only participants asked about ''contacted'' reported it."}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('c408c54b-2f8c-4eb7-8662-241bc2e44a61', '5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'multiple_choice_single', 'According to the passage, the hippocampus is described as', '[{"value":"A","label":"A. the site where complete memories are stored."},{"value":"B","label":"B. binding distributed elements into a retrievable pattern."},{"value":"C","label":"C. preventing new information from entering old memories."},{"value":"D","label":"D. becoming less active with each act of recall."}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('8ca03dd0-4213-48e4-8e00-c77261dc21b5', '5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'matching_features', 'Which researcher demonstrated that post-event wording alters recall?', '[{"value":"A","label":"A. Loftus"},{"value":"B","label":"B. Bartlett"},{"value":"C","label":"C. Nadel"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('a29f7540-a08a-4d7a-8766-4a59b2c20676', '5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'matching_features', 'Which researcher showed that recall reshapes a story toward the familiar?', '[{"value":"A","label":"A. Loftus"},{"value":"B","label":"B. Bartlett"},{"value":"C","label":"C. Nadel"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('4a9a7be9-b4a5-4131-b09d-f7bd7c7f03ee', '5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'matching_features', 'Which researcher described the period of instability that follows retrieval?', '[{"value":"A","label":"A. Loftus"},{"value":"B","label":"B. Bartlett"},{"value":"C","label":"C. Nadel"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 10)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('be8c7d66-d6b7-4c5e-ba96-ab706c4a3c1c', '5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'matching_sentence_endings', 'Bartlett argued that no two recollections of an event are identical', '[{"value":"A","label":"A. because the original trace is overwritten each time."},{"value":"B","label":"B. because remembering is an act of reconstruction."},{"value":"C","label":"C. although the witness reports it with great confidence."},{"value":"D","label":"D. unless the event was rehearsed immediately afterwards."},{"value":"E","label":"E. which is why juries find such testimony persuasive."}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 11)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('b80f0b3f-fbe5-4ab8-9ebf-5950c75dafd9', '5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'matching_sentence_endings', 'A detail absorbed from a newspaper photograph may be recalled as part of the original scene', '[{"value":"A","label":"A. because the original trace is overwritten each time."},{"value":"B","label":"B. because remembering is an act of reconstruction."},{"value":"C","label":"C. although the witness reports it with great confidence."},{"value":"D","label":"D. unless the event was rehearsed immediately afterwards."},{"value":"E","label":"E. which is why juries find such testimony persuasive."}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 12)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('02042938-90dd-4ce6-bb40-82fb5cec4e9f', '5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'multiple_choice_multiple', 'Which TWO procedural safeguards does the passage say have been adopted? Choose TWO letters.', '[{"value":"A","label":"A. Recording the witness''s confidence at the first identification."},{"value":"B","label":"B. Excluding witnesses who have spoken to the press."},{"value":"C","label":"C. Using an officer who does not know which member is the suspect."},{"value":"D","label":"D. Requiring identification to take place within 24 hours."},{"value":"E","label":"E. Showing the witness the parade a second time in court."}]'::jsonb, ARRAY['A', 'C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 13)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)
values ('3375bf28-5cfe-47d5-ab59-84f3f0c537c4', '11111111-2222-4333-8444-555555555555', 'writing', 3600, 2, NULL, 2)
on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('6771e185-c2c6-47a3-abbd-2f7e32369e0f', '3375bf28-5cfe-47d5-ab59-84f3f0c537c4', 1, 'The chart below shows household water consumption by end use in three cities in 2010 and 2024.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.', NULL, '/mock-images/task1-chart.svg', 'You should spend about 20 minutes on this task. Write at least 150 words.', '{"image_caption":"Household water consumption by end use in three cities, 2010 and 2024"}'::jsonb, 0)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('1375f322-1756-42d3-95ae-5abf7bac417c', '6771e185-c2c6-47a3-abbd-2f7e32369e0f', 'short_answer', 'Task 1 response', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('e3c275aa-5f65-4904-8c45-a85ffcc0fd3b', '3375bf28-5cfe-47d5-ab59-84f3f0c537c4', 2, 'Some people believe that public money spent on the arts would be better directed towards healthcare and education. Others argue that a society without publicly funded culture is poorer in ways that are not easily measured.

Discuss both these views and give your own opinion.

Give reasons for your answer and include any relevant examples from your own knowledge or experience.', NULL, NULL, 'You should spend about 40 minutes on this task. Write at least 250 words.', '{}'::jsonb, 1)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('c0fa7b54-5659-494f-8bf6-26f19f16ff47', 'e3c275aa-5f65-4904-8c45-a85ffcc0fd3b', 'short_answer', 'Task 2 response', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)
values ('25d8fdd7-87b2-4f42-b209-ed0ded578a1a', '11111111-2222-4333-8444-555555555555', 'speaking', 840, 12, NULL, 3)
on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('fb9a90b5-712f-4a0c-8f63-c381e3ea9fb0', '25d8fdd7-87b2-4f42-b209-ed0ded578a1a', 1, NULL, NULL, NULL, 'The examiner asks about yourself, your home, work or studies and other familiar topics. 4-5 minutes.', '{}'::jsonb, 0)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('911d5e0c-cf8d-4445-aae3-ab64858703c2', 'fb9a90b5-712f-4a0c-8f63-c381e3ea9fb0', 'short_answer', 'Let''s talk about where you live. Do you live in a house or an apartment?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('7bccc0db-46f4-4058-9f18-40340aa16b65', 'fb9a90b5-712f-4a0c-8f63-c381e3ea9fb0', 'short_answer', 'What do you like most about the area you live in?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('7a3c2abd-20c2-47e7-92f3-d9f1b71cae4f', 'fb9a90b5-712f-4a0c-8f63-c381e3ea9fb0', 'short_answer', 'Would you like to move somewhere else in the future? Why?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('083c739e-bb05-4a08-9517-7ccca9641cc2', 'fb9a90b5-712f-4a0c-8f63-c381e3ea9fb0', 'short_answer', 'Now let''s talk about journeys. How do you usually travel to work or college?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('305158a8-449c-4dc4-8dca-a352cee06690', 'fb9a90b5-712f-4a0c-8f63-c381e3ea9fb0', 'short_answer', 'Has the way you travel changed in the last few years?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('c9fb2dd1-34e9-4d95-9c2c-b61485200c67', 'fb9a90b5-712f-4a0c-8f63-c381e3ea9fb0', 'short_answer', 'Do you enjoy travelling by train? Why or why not?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('d801d5d8-a020-49de-bd35-6c11d70b6cf4', '25d8fdd7-87b2-4f42-b209-ed0ded578a1a', 2, 'Describe a skill you learned that took a long time to develop.

You should say:
  •  what the skill was
  •  why you decided to learn it
  •  how you went about learning it

and explain how you felt once you had developed it.', NULL, NULL, 'You have one minute to prepare. You may make notes. Then talk for one to two minutes. The examiner will tell you when to stop.', '{}'::jsonb, 1)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('f97c728f-2f26-49d4-beaf-78ccbaed4017', 'd801d5d8-a020-49de-bd35-6c11d70b6cf4', 'short_answer', 'Long turn response', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('e4a32f98-d8ae-4066-bb7d-a23a07d90adf', '25d8fdd7-87b2-4f42-b209-ed0ded578a1a', 3, NULL, NULL, NULL, 'The examiner asks further questions connected to the topic in Part 2. 4-5 minutes.', '{}'::jsonb, 2)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('b7165ca4-4e5f-4e33-91bb-8811b9f44464', 'e4a32f98-d8ae-4066-bb7d-a23a07d90adf', 'short_answer', 'Why do you think some people give up on a skill before they master it?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('e2794abe-223b-4f23-975e-cbb306c06d1a', 'e4a32f98-d8ae-4066-bb7d-a23a07d90adf', 'short_answer', 'Should schools spend more time teaching practical skills? Why?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('9d02999a-0d1b-463a-a82b-02d442c7f657', 'e4a32f98-d8ae-4066-bb7d-a23a07d90adf', 'short_answer', 'Do you think it is harder to learn new skills as an adult?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('a6554fb4-c964-4659-aaae-75526f77de9b', 'e4a32f98-d8ae-4066-bb7d-a23a07d90adf', 'short_answer', 'How has technology changed the way people acquire skills?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, order_index)
values ('7452fdde-27e1-443e-a987-1b2c7fe0786c', 'e4a32f98-d8ae-4066-bb7d-a23a07d90adf', 'short_answer', 'Will some skills disappear entirely in the next fifty years?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit;

commit;
