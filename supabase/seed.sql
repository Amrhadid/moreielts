-- supabase/seed.sql
--
-- GENERATED FILE. Regenerate with `npm run seed:generate`.
--
-- Every authored form in scripts/seed-content/forms, published. Requires
-- migrations through 0007 (slug, difficulty, explanation, item_group_scripts).
-- Idempotent: ids are derived from stable names, so re-running updates
-- rather than duplicates.

begin;

-- Academic Mock Test 1 (academic-1)
insert into public.test_forms (id, slug, title, description, variant, delivery_mode, is_published, is_premium, difficulty, scoring_version)
values ('11111111-2222-4333-8444-555555555555', 'academic-1', 'Academic Mock Test 1', 'A full Academic practice test covering all four sections.', 'academic', 'computer', true, false, 'standard', 'v1')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, description = excluded.description, is_published = excluded.is_published, is_premium = excluded.is_premium, difficulty = excluded.difficulty;

insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)
values ('f3c4fb7e-431e-4178-bfbd-cceeefdf9190', '11111111-2222-4333-8444-555555555555', 'listening', 1800, 40, NULL, 0)
on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('d31cbca2-6b8d-4ecf-9f35-673a337b2a93', 'f3c4fb7e-431e-4178-bfbd-cceeefdf9190', 1, NULL, '/mock-audio/part-1.mp3', NULL, 'Questions 1-10. Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.', '{"title":"Part 1 — Enquiry about a community sports centre"}'::jsonb, 0)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.item_group_scripts (group_id, transcript) values ('d31cbca2-6b8d-4ecf-9f35-673a337b2a93', 'RECEPTIONIST: Good morning, Riverside Community Sports Centre, Ellie speaking. How can I help you?
JAMES: Oh, hello. I''m thinking of joining the centre, and I wanted to ask a few questions before I sign up.
RECEPTIONIST: Of course. I can take your details now and register you over the phone, if you like. Could I start with your name?
JAMES: Yes, it''s James Whitcombe.
RECEPTIONIST: Could you spell the surname for me, please?
JAMES: Sure. It''s W-H-I-T-C-O-M-B-E. People often put an "a" in it, but there isn''t one.
RECEPTIONIST: Whitcombe. Thank you. And what kind of membership were you thinking of? We have full membership, which lets you come in at any time, and off-peak, which covers weekdays before four o''clock and all day at weekends.
JAMES: I did look at the full membership, but I work from home most days, so I can come in during the day. I think off-peak membership would suit me better.
RECEPTIONIST: Off-peak it is. And when would you like your membership to start?
JAMES: I was going to say the first of March, but I''m away that week visiting my parents. So could we make it the fourteenth?
RECEPTIONIST: The fourteenth of March. No problem at all. Now, the monthly fee for off-peak membership is thirty-two pounds fifty. Full membership is forty-five pounds, just so you can compare.
JAMES: Thirty-two fifty is fine. Is there a joining fee as well? A friend of mine said he had to pay something extra when he joined.
RECEPTIONIST: Normally there''s a joining fee of twenty pounds, but it''s waived if you pay by direct debit. If you pay by card each month, or pay for the whole year up front, then the fee still applies, I''m afraid.
JAMES: Well, direct debit is the easiest for me anyway, so I''ll do that.
RECEPTIONIST: Lovely. Would you like to know our opening hours?
JAMES: Yes, please. I know you open quite early during the week.
RECEPTIONIST: That''s right. Monday to Friday we''re open from six in the morning until ten at night. On Saturdays we close at eight in the evening, and on Sundays the centre closes at 6 pm.
JAMES: Six on Sundays. OK, that''s useful to know. And what about classes? I saw on your website that there''s a yoga class on Tuesdays.
RECEPTIONIST: There was, but yoga moved to Thursdays this term. On Tuesdays we now have circuit training first thing in the morning, and then a badminton class in the early afternoon, which falls within your off-peak hours.
JAMES: Circuit training sounds a bit intense for me. I''d be more interested in the badminton class, actually. I used to play a lot at school.
RECEPTIONIST: It''s very popular, so that brings me to booking. All our classes have to be booked in advance, either through the app or here at the desk.
JAMES: How far ahead do I need to book? Twenty-four hours?
RECEPTIONIST: It used to be twenty-four hours, but too many people were booking and then not turning up. So now classes must be booked 48 hours in advance. And if you cancel with less than a day''s notice, you lose that class credit.
JAMES: Fair enough. What about parking? I''ll probably drive most of the time.
RECEPTIONIST: There''s a car park behind the main building. Parking is free for members, but only for 90 minutes. After that it''s one pound an hour. You might see a sign saying two hours, but that''s out of date and we''re replacing it next week.
JAMES: Ninety minutes should be plenty for me.
RECEPTIONIST: Finally, every new member has an induction appointment with one of our instructors, who shows you how to use the equipment safely. Could you come in on the fourteenth at ten o''clock?
JAMES: Ten is perfect.
RECEPTIONIST: Let me see who''s available that morning. Sarah is working, but she''s fully booked, so I''ll put you with Marco. That''s Marco Silva. He''ll meet you at reception.
JAMES: Marco. Great. Do I need to bring anything with me?
RECEPTIONIST: Just some photo identification and a pair of indoor trainers. We''ll email you a confirmation of everything we''ve discussed today.
JAMES: Brilliant. Thanks very much for your help, Ellie.
RECEPTIONIST: You''re welcome, Mr Whitcombe. See you on the fourteenth. Goodbye.')
on conflict (group_id) do update set transcript = excluded.transcript;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e35b13bd-b093-419b-9df6-b8e864068fb6', 'd31cbca2-6b8d-4ecf-9f35-673a337b2a93', 'note_completion', 'Caller''s surname: ______', '[]'::jsonb, ARRAY['Whitcombe']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'The caller gives his name and spells it: "It''s W-H-I-T-C-O-M-B-E."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('c2eaee14-de2c-4b16-8889-3280c71eb720', 'd31cbca2-6b8d-4ecf-9f35-673a337b2a93', 'note_completion', 'Membership type required: ______ membership', '[]'::jsonb, ARRAY['off-peak', 'offpeak']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'He rejects full membership because he works from home: "I think off-peak membership would suit me better."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('39538d36-d98e-4d5b-9eb5-d4fb18187012', 'd31cbca2-6b8d-4ecf-9f35-673a337b2a93', 'note_completion', 'Preferred start date: ______ March', '[]'::jsonb, ARRAY['14th', '14', 'fourteenth']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'The first of March is ruled out because he is away: "could we make it the fourteenth?"', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('0c278aa9-3ded-4ed7-99f0-44721384a5e5', 'd31cbca2-6b8d-4ecf-9f35-673a337b2a93', 'note_completion', 'Monthly fee: £______', '[]'::jsonb, ARRAY['32.50', '32,50']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'The receptionist states: "the monthly fee for off-peak membership is thirty-two pounds fifty." The £45 figure is for full membership.', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('3b1101c0-23fe-416f-abc5-67d332cb02ab', 'd31cbca2-6b8d-4ecf-9f35-673a337b2a93', 'note_completion', 'Joining fee is waived for members who pay by ______', '[]'::jsonb, ARRAY['direct debit']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'The joining fee "is waived if you pay by direct debit"; paying by card still incurs it.', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e5b7b8ac-bd3b-4fe0-bf84-83adafd5fec2', 'd31cbca2-6b8d-4ecf-9f35-673a337b2a93', 'note_completion', 'Centre closes at ______ on Sundays', '[]'::jsonb, ARRAY['6pm', '6 pm', '18:00']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Saturday closing is eight, but "on Sundays the centre closes at 6 pm."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('1b74f92c-6f6e-41e9-a80d-f537b2d11dd5', 'd31cbca2-6b8d-4ecf-9f35-673a337b2a93', 'note_completion', 'Caller is interested in the ______ class on Tuesdays', '[]'::jsonb, ARRAY['badminton']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Yoga has moved to Thursdays; on Tuesdays there is "a badminton class in the early afternoon", and James says "I''d be more interested in the badminton class."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('cf4d8ac6-abb3-4d8e-82ab-31e871eff033', 'd31cbca2-6b8d-4ecf-9f35-673a337b2a93', 'note_completion', 'Classes must be booked ______ hours in advance', '[]'::jsonb, ARRAY['48', 'forty-eight']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'The old 24-hour rule changed: "now classes must be booked 48 hours in advance."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('d3d3c158-26e1-416b-aa03-a05473095faf', 'd31cbca2-6b8d-4ecf-9f35-673a337b2a93', 'note_completion', 'Free parking is limited to ______ minutes', '[]'::jsonb, ARRAY['90', 'ninety']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'The two-hour sign is out of date: "Parking is free for members, but only for 90 minutes."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f4f73c77-5811-4d38-8f85-4e6cd68a5baf', 'd31cbca2-6b8d-4ecf-9f35-673a337b2a93', 'note_completion', 'Induction appointment booked with ______', '[]'::jsonb, ARRAY['Marco', 'Marco Silva']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Sarah is fully booked, "so I''ll put you with Marco. That''s Marco Silva."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('ad934cc2-03d8-474b-97e2-fb90ca09728b', 'f3c4fb7e-431e-4178-bfbd-cceeefdf9190', 2, NULL, '/mock-audio/part-2.mp3', '/mock-images/site-plan.svg', 'Questions 11-20. Choose the correct letter for Questions 11-14, match the facilities for Questions 15-17, and label the plan for Questions 18-20.', '{"image_caption":"Site plan referred to in Questions 18-20","title":"Part 2 — Introductory talk at an arts centre"}'::jsonb, 1)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.item_group_scripts (group_id, transcript) values ('ad934cc2-03d8-474b-97e2-fb90ca09728b', 'HELEN: Good evening, everyone, and welcome to the Depot Arts Centre. My name''s Helen Carter, and I''m the centre manager. I''m going to give you a short introduction to the building and what goes on here, and then you''re welcome to look around.
HELEN: First, a little history. A lot of visitors assume the building was once a school, because of the tall windows, and some older residents remember the public swimming baths, although those were actually on the other side of the road. In fact, the building was built in 1892 as a railway depot, where steam engines were brought in for repair. It closed in the nineteen sixties, stood empty for many years, and was converted into an arts centre in 2005. You can still see the original rails set into the floor of the main hall.
HELEN: Now, a word about when we''re busy. You might expect weekday evenings to be our busiest time, when people come in after work, and they certainly are busy. Weekday mornings and Sunday mornings are fairly quiet. But by far our busiest period is Saturday afternoons, when the family workshops run alongside the regular classes, so if you''d like a quieter visit, avoid those.
HELEN: Membership costs sixty pounds a year. Students with a valid card can get 15 per cent off course fees without joining, and when the scheme started members got 10 per cent off. However, these days members receive a discount of 20 per cent on all courses, workshops and performance tickets, so it pays for itself very quickly.
HELEN: If you''re completely new to art or craft, you may be wondering where to start. We run a taster weekend twice a year, and there are online tutorials on our website, and of course our tutors offer private lessons, though those are quite expensive. But my advice to newcomers is always to start with the drop-in session on Wednesday afternoons. You don''t need to book, all materials are provided, and you can try a different activity every week.
HELEN: Let me tell you where things are. When you come through the main entrance, reception is directly in front of you. The lockers at reception are quite small, so if you have large bags, please leave them in the equipment store, where there''s plenty of space and it''s locked at all times. Studio 1 is the large room with the skylights, and that''s where we hold the exhibition of members'' work, which changes every month. Studio 2 is mainly used for dance and pottery. And in summer we hold the evening performances outdoors, on the outdoor court, weather permitting, of course. If it rains, they move into the café.
HELEN: Now, if you''d like to look at the site plan in your welcome pack, I''ll show you how to find these places. You''re standing at the main entrance, at the bottom of the plan. The building just north of the entrance is the equipment store, so that''s the first one you''ll pass. If you walk straight across the courtyard, the building on the far side is the café, which serves lunch until three. And finally, if you follow the path round to the left, the building beside the car park houses the changing rooms, with showers for anyone attending the dance classes.
HELEN: Right, that''s all from me. Please do explore, and if you have any questions, the staff at reception will be happy to help.')
on conflict (group_id) do update set transcript = excluded.transcript;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f8c7c470-866b-4a18-9653-950229599879', 'ad934cc2-03d8-474b-97e2-fb90ca09728b', 'multiple_choice_single', 'The arts centre was originally built as', '[{"value":"A","label":"A. a school"},{"value":"B","label":"B. a railway depot"},{"value":"C","label":"C. a public library"},{"value":"D","label":"D. a swimming baths"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Despite the school and swimming baths, "the building was built in 1892 as a railway depot."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('c61c3a24-41a9-47e2-bbf9-ae4a8c5a52a7', 'ad934cc2-03d8-474b-97e2-fb90ca09728b', 'multiple_choice_single', 'The speaker says the busiest period is', '[{"value":"A","label":"A. weekday mornings"},{"value":"B","label":"B. weekday evenings"},{"value":"C","label":"C. Saturday afternoons"},{"value":"D","label":"D. Sunday mornings"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Weekday evenings are busy, "But by far our busiest period is Saturday afternoons."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('83d407cd-bea1-42af-8c57-ef5824ab57df', 'ad934cc2-03d8-474b-97e2-fb90ca09728b', 'multiple_choice_single', 'Members receive a discount of', '[{"value":"A","label":"A. 10 per cent"},{"value":"B","label":"B. 15 per cent"},{"value":"C","label":"C. 20 per cent"},{"value":"D","label":"D. 25 per cent"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The 10% and 15% figures are distractors: "these days members receive a discount of 20 per cent."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('782caea0-b8ab-4b70-8fe7-53eecd941632', 'ad934cc2-03d8-474b-97e2-fb90ca09728b', 'multiple_choice_single', 'The speaker advises newcomers to start with', '[{"value":"A","label":"A. the drop-in session"},{"value":"B","label":"B. a taster weekend"},{"value":"C","label":"C. the online tutorials"},{"value":"D","label":"D. a private lesson"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Helen says "my advice to newcomers is always to start with the drop-in session."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('7f337321-9541-4dc5-b81c-08055f803583', 'ad934cc2-03d8-474b-97e2-fb90ca09728b', 'matching_features', 'Where can visitors leave large bags?', '[{"value":"A","label":"A. Reception"},{"value":"B","label":"B. Equipment store"},{"value":"C","label":"C. Studio 1"},{"value":"D","label":"D. Studio 2"},{"value":"E","label":"E. Cafe"},{"value":"F","label":"F. Changing rooms"},{"value":"G","label":"G. Outdoor court"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"if you have large bags, please leave them in the equipment store."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('8fb26e3d-8374-4b1d-9f07-33b38c1c3bff', 'ad934cc2-03d8-474b-97e2-fb90ca09728b', 'matching_features', 'Where is the exhibition of members'' work held?', '[{"value":"A","label":"A. Reception"},{"value":"B","label":"B. Equipment store"},{"value":"C","label":"C. Studio 1"},{"value":"D","label":"D. Studio 2"},{"value":"E","label":"E. Cafe"},{"value":"F","label":"F. Changing rooms"},{"value":"G","label":"G. Outdoor court"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"Studio 1 ... that''s where we hold the exhibition of members'' work."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('85f70911-a654-4207-9c49-f6f920c3c0a0', 'ad934cc2-03d8-474b-97e2-fb90ca09728b', 'matching_features', 'Where do the summer evening performances take place?', '[{"value":"A","label":"A. Reception"},{"value":"B","label":"B. Equipment store"},{"value":"C","label":"C. Studio 1"},{"value":"D","label":"D. Studio 2"},{"value":"E","label":"E. Cafe"},{"value":"F","label":"F. Changing rooms"},{"value":"G","label":"G. Outdoor court"}]'::jsonb, ARRAY['G']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"in summer we hold the evening performances outdoors, on the outdoor court."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('98bf22aa-3d80-4769-8c11-391198893b48', 'ad934cc2-03d8-474b-97e2-fb90ca09728b', 'diagram_label', 'Label 18 on the site plan (building north of the entrance)', '[]'::jsonb, ARRAY['equipment store', 'store']::text[], 2, 'lenient', true, false, '{}'::jsonb, '"The building just north of the entrance is the equipment store."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('7d1534d0-577d-4f81-9abf-594591f58eb1', 'ad934cc2-03d8-474b-97e2-fb90ca09728b', 'diagram_label', 'Label 19 on the site plan (across the courtyard)', '[]'::jsonb, ARRAY['cafe', 'café']::text[], 2, 'lenient', true, false, '{}'::jsonb, '"If you walk straight across the courtyard, the building on the far side is the café."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('6b8a0ab1-d0f6-4cd0-9acd-47c4319d349f', 'ad934cc2-03d8-474b-97e2-fb90ca09728b', 'diagram_label', 'Label 20 on the site plan (beside the car park)', '[]'::jsonb, ARRAY['changing rooms', 'changing room']::text[], 2, 'lenient', true, false, '{}'::jsonb, '"the building beside the car park houses the changing rooms."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('09df0e36-86a8-4c2a-9012-a3bdd6f0716e', 'f3c4fb7e-431e-4178-bfbd-cceeefdf9190', 3, NULL, '/mock-audio/part-3.mp3', NULL, 'Questions 21-30. Choose the correct letter for Questions 21-24, choose TWO letters for Questions 25-26, and match the speakers for Questions 27-30.', '{"title":"Part 3 — Two students discuss a field-work project"}'::jsonb, 2)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.item_group_scripts (group_id, transcript) values ('09df0e36-86a8-4c2a-9012-a3bdd6f0716e', 'TOMAS: Hi, Priya. Have you had a chance to look at the data from the last site visit?
PRIYA: I have, and I''m a bit worried, Tomas. It''s not that we haven''t got enough recordings. We''ve got plenty. The problem is that the sample is unevenly spread across the sites. Nearly two-thirds of the recordings come from the woodland site, and hardly any from the meadow.
TOMAS: Right. I don''t think visiting extra sites would help, and we can''t extend the survey period because the deadline''s fixed. What if we pooled our data with another group? Ana''s group recorded at the meadow on the same days, and they said they''d be happy to share.
PRIYA: Pooling our data with Ana''s group would definitely even things out. Let''s ask her today.
DR WHITFIELD: Good morning, both of you. Sorry I''m late.
PRIYA: Morning, Dr Whitfield. We were just talking about the sample.
DR WHITFIELD: Good, because I wanted to talk about your first draft. The literature review is a little long, but that''s easily fixed, and the photographs are lovely. My main objection is the absence of a control site. Without one, you can''t show that the changes you recorded have anything to do with the road.
TOMAS: We did think the statistical test might be the problem.
DR WHITFIELD: No, the test is fine. It''s the control site that''s missing. That''s why I arranged access to the second site, the nature reserve. I spoke to the warden last week, and you can go in whenever you like.
PRIYA: That''s brilliant, thank you. What should we do with the fieldwork diary? We weren''t sure whether to summarise it in the introduction or leave it out.
DR WHITFIELD: Don''t rewrite it as a narrative, and please don''t leave it out. Examiners like to see it.
TOMAS: So we agree it should be submitted as an appendix?
PRIYA: Yes, as an appendix. That keeps the main report short.
DR WHITFIELD: Good. Now, how did the recording equipment behave?
TOMAS: Not brilliantly. The memory cards were fine, and the tripod was easy to mount. But the battery life was terrible in the cold conditions. On the frosty mornings the batteries died after about an hour.
PRIYA: And the other problem was background noise from the road. On some recordings you can hardly hear the birds over the lorries. We thought the microphone cable was faulty at first, but it turned out to be fine.
DR WHITFIELD: So what will you change before the next visit?
PRIYA: Well, we''ll start recording earlier in the day, before the traffic builds up. We considered shortening each recording session, but then we''d lose data.
TOMAS: And we''ll borrow a windshield for the microphone from the media department. That should cut some of the noise. We don''t need a second observer, and we''re definitely keeping the same site.
DR WHITFIELD: Sensible. Let''s just check who is doing what. Remind me who proposed the original research question?
TOMAS: That was Priya. She came up with it in the first week.
PRIYA: True, it was my idea. And Tomas will write the methodology section, because he set up all the equipment.
TOMAS: Yes, I''ll do the methodology. And we know Dr Whitfield arranged access to the second site.
DR WHITFIELD: I did. And who''s responsible for the final proofread?
TOMAS: I offered, but my spelling is awful.
PRIYA: I''ll do the final proofread, then. I''m responsible for that.
DR WHITFIELD: Excellent. Send me the next draft by the end of the month.')
on conflict (group_id) do update set transcript = excluded.transcript;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e82c2c93-c84f-496b-8cdd-d380f97c00f2', '09df0e36-86a8-4c2a-9012-a3bdd6f0716e', 'multiple_choice_single', 'Priya is concerned that their sample size is', '[{"value":"A","label":"A. too small to be meaningful"},{"value":"B","label":"B. larger than they can process"},{"value":"C","label":"C. unevenly spread across sites"},{"value":"D","label":"D. drawn from a single season"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Priya says "the sample is unevenly spread across the sites", not that it is too small.', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f7561742-6cd3-4782-9842-b8b0bc886711', '09df0e36-86a8-4c2a-9012-a3bdd6f0716e', 'multiple_choice_single', 'Tomas suggests solving the problem by', '[{"value":"A","label":"A. visiting two additional sites"},{"value":"B","label":"B. pooling data with another group"},{"value":"C","label":"C. extending the survey period"},{"value":"D","label":"D. reducing the number of variables"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Tomas asks "What if we pooled our data with another group?"', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('69b53377-93ec-42c3-816e-bcd6547672ae', '09df0e36-86a8-4c2a-9012-a3bdd6f0716e', 'multiple_choice_single', 'Their supervisor''s main objection to the first draft was', '[{"value":"A","label":"A. the length of the literature review"},{"value":"B","label":"B. the absence of a control site"},{"value":"C","label":"C. the choice of statistical test"},{"value":"D","label":"D. the quality of the photographs"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Dr Whitfield says "My main objection is the absence of a control site."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('6a3fbe4c-af21-4371-9143-08796527231d', '09df0e36-86a8-4c2a-9012-a3bdd6f0716e', 'multiple_choice_single', 'They agree that the fieldwork diary should be', '[{"value":"A","label":"A. submitted as an appendix"},{"value":"B","label":"B. summarised in the introduction"},{"value":"C","label":"C. left out of the report"},{"value":"D","label":"D. rewritten as a narrative"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'They agree "it should be submitted as an appendix", rejecting summarising or leaving it out.', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('9daabbcd-30ad-46dc-ad9e-ce3694e5e5f4', '09df0e36-86a8-4c2a-9012-a3bdd6f0716e', 'multiple_choice_multiple', 'Which TWO problems did the students have with the recording equipment? Choose TWO letters.', '[{"value":"A","label":"A. Battery life in cold conditions"},{"value":"B","label":"B. Incompatible memory cards"},{"value":"C","label":"C. Background noise from the road"},{"value":"D","label":"D. A faulty microphone cable"},{"value":"E","label":"E. Difficulty mounting the tripod"}]'::jsonb, ARRAY['A', 'C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The problems were "the battery life was terrible in the cold conditions" and "background noise from the road"; the cards, tripod and cable were fine.', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('8ebe62b8-1490-4930-ac9a-0bcafc82ca9d', '09df0e36-86a8-4c2a-9012-a3bdd6f0716e', 'multiple_choice_multiple', 'Which TWO changes will they make before the next visit? Choose TWO letters.', '[{"value":"A","label":"A. Start recording earlier in the day"},{"value":"B","label":"B. Bring a second observer"},{"value":"C","label":"C. Use a different site entirely"},{"value":"D","label":"D. Shorten each recording session"},{"value":"E","label":"E. Borrow a windshield for the microphone"}]'::jsonb, ARRAY['A', 'E']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'They will "start recording earlier in the day" and "borrow a windshield for the microphone."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('0b8082a8-8dfe-4dbb-a0fd-721134befc8c', '09df0e36-86a8-4c2a-9012-a3bdd6f0716e', 'matching_features', 'Who proposed the original research question?', '[{"value":"A","label":"A. Priya"},{"value":"B","label":"B. Tomas"},{"value":"C","label":"C. Dr Whitfield"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Asked who proposed the research question, Tomas replies "That was Priya."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('0bc69fa2-36a8-49cf-80db-299783953544', '09df0e36-86a8-4c2a-9012-a3bdd6f0716e', 'matching_features', 'Who will write the methodology section?', '[{"value":"A","label":"A. Priya"},{"value":"B","label":"B. Tomas"},{"value":"C","label":"C. Dr Whitfield"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Priya says "Tomas will write the methodology section."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('1a452611-e9b8-4811-a677-d54639c20c94', '09df0e36-86a8-4c2a-9012-a3bdd6f0716e', 'matching_features', 'Who arranged access to the second site?', '[{"value":"A","label":"A. Priya"},{"value":"B","label":"B. Tomas"},{"value":"C","label":"C. Dr Whitfield"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Dr Whitfield says "I arranged access to the second site, the nature reserve."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('b253ec3f-3642-4262-87a5-4b41de60c10e', '09df0e36-86a8-4c2a-9012-a3bdd6f0716e', 'matching_features', 'Who is responsible for the final proofread?', '[{"value":"A","label":"A. Priya"},{"value":"B","label":"B. Tomas"},{"value":"C","label":"C. Dr Whitfield"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Tomas declines, and Priya says "I''ll do the final proofread, then."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('3fc1bd89-1a8b-4d45-81fe-4b8c89057fa1', 'f3c4fb7e-431e-4178-bfbd-cceeefdf9190', 4, NULL, '/mock-audio/part-4.mp3', NULL, 'Questions 31-40. Complete the notes, table and flow-chart below. Write ONE WORD ONLY for each answer.', '{"title":"Part 4 — Lecture on the history of standardised time"}'::jsonb, 3)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.item_group_scripts (group_id, transcript) values ('3fc1bd89-1a8b-4d45-81fe-4b8c89057fa1', 'LECTURER: Good morning. Today I want to look at something we all take for granted: the idea that everyone in a country shares the same time.
LECTURER: Before the railways, each town kept its own local time, set by the position of the sun. When the sun was at its highest point, it was noon, and the church clock was adjusted accordingly. Because the sun reaches its highest point later as you travel west, towns only a short distance apart kept different times. In England, the difference between two towns could be as much as twenty minutes. Bristol, for example, was about ten minutes behind London, and towns in the far west were further behind still.
LECTURER: For most people, this hardly mattered, since nobody could travel fast enough to notice. The railways changed that. A traveller arriving in a town by train could find the station clock showing a different time from the one at the departure station, and missed connections were common. So the railway companies began to publish their timetables using a single standard time, which in practice meant London time, taken from the observatory at Greenwich.
LECTURER: This was not universally welcomed. Opposition came mainly from local councils, who saw the change as interference by private companies in matters that were properly theirs to decide. Some refused for years to alter their public clocks, and a few famously displayed two minute hands, one for local time and one for railway time. Critics described the change as a loss of local identity, which suggests how closely people associated the time with the place they lived.
LECTURER: Let''s look at some key dates, which you''ll find in the table in your handout. In 1840, the Great Western Railway became the first company to adopt standard time across its network. Other companies soon followed, and by the mid-1850s the great majority of public clocks in Britain showed London time. However, the law did not catch up until 1880, when standard time was finally given legal force in Britain. Before that, a court could still rule that an appointment set for ten o''clock meant ten o''clock local time.
LECTURER: Finally, I want to explain how the correct time actually reached the stations, which is shown in the flow-chart. The first step was carried out by astronomers, who determined the reference meridian by observing the stars as they crossed it. This gave them an exact measurement of noon. In the second step, the time signal was distributed by telegraph, along the wires that ran beside the railway lines, to the major stations. And in the third and final step, the station masters reset the platform clock each morning when the signal arrived, so that every train was running to the same time.
LECTURER: Next week, we''ll see how this system was extended internationally, with the creation of time zones.')
on conflict (group_id) do update set transcript = excluded.transcript;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('57dc66ef-7e4c-45a1-a9f1-0e496e36e2a1', '3fc1bd89-1a8b-4d45-81fe-4b8c89057fa1', 'sentence_completion', 'Before the railways, each town kept time by the position of the ______.', '[]'::jsonb, ARRAY['sun']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Each town kept "its own local time, set by the position of the sun."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('bfe44eab-6152-45d5-8414-9bb9941b3ecf', '3fc1bd89-1a8b-4d45-81fe-4b8c89057fa1', 'sentence_completion', 'The difference between two English towns could be as much as twenty ______.', '[]'::jsonb, ARRAY['minutes']::text[], 1, 'lenient', true, false, '{}'::jsonb, '"the difference between two towns could be as much as twenty minutes."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('25bbc346-9e8d-473c-982f-32ccbe0e925c', '3fc1bd89-1a8b-4d45-81fe-4b8c89057fa1', 'sentence_completion', 'Railway companies published timetables using a single ______ time.', '[]'::jsonb, ARRAY['London', 'standard']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Companies published timetables "using a single standard time, which in practice meant London time."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('b214f74a-8c31-4a2d-b31d-30321358240f', '3fc1bd89-1a8b-4d45-81fe-4b8c89057fa1', 'summary_completion', 'Opposition came mainly from local ______ who saw it as interference.', '[]'::jsonb, ARRAY['councils', 'authorities']::text[], 1, 'lenient', true, false, '{}'::jsonb, '"Opposition came mainly from local councils, who saw the change as interference."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('a600d058-0468-4c33-be0d-0159aa077cfa', '3fc1bd89-1a8b-4d45-81fe-4b8c89057fa1', 'summary_completion', 'The change was described by critics as a loss of local ______.', '[]'::jsonb, ARRAY['identity', 'character']::text[], 1, 'lenient', true, false, '{}'::jsonb, '"Critics described the change as a loss of local identity."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('b75cc71d-e7ee-4896-81f9-3fd9b6308f03', '3fc1bd89-1a8b-4d45-81fe-4b8c89057fa1', 'table_completion', 'Table: 1840 — first company to adopt standard time: Great ______ Railway', '[]'::jsonb, ARRAY['Western']::text[], 1, 'lenient', true, false, '{}'::jsonb, '"In 1840, the Great Western Railway became the first company to adopt standard time."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('a80d6a49-22c6-42ca-ae1c-6208f21f6c27', '3fc1bd89-1a8b-4d45-81fe-4b8c89057fa1', 'table_completion', 'Table: 1880 — standard time given legal ______ in Britain', '[]'::jsonb, ARRAY['force', 'status']::text[], 1, 'lenient', true, false, '{}'::jsonb, '"in 1880 ... standard time was finally given legal force in Britain."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('97fc4317-3c75-4ff3-8090-b3a3e2211e8d', '3fc1bd89-1a8b-4d45-81fe-4b8c89057fa1', 'flowchart_completion', 'Flow-chart step 1: Astronomers determine the reference ______.', '[]'::jsonb, ARRAY['meridian']::text[], 1, 'lenient', true, false, '{}'::jsonb, '"astronomers, who determined the reference meridian by observing the stars."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('674f2b5c-4ccd-4130-8de6-a2de4d1110a9', '3fc1bd89-1a8b-4d45-81fe-4b8c89057fa1', 'flowchart_completion', 'Flow-chart step 2: Signal distributed by ______ to major stations.', '[]'::jsonb, ARRAY['telegraph']::text[], 1, 'lenient', true, false, '{}'::jsonb, '"the time signal was distributed by telegraph ... to the major stations."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('4bae5d38-d228-4f8f-815b-e6935498b50c', '3fc1bd89-1a8b-4d45-81fe-4b8c89057fa1', 'flowchart_completion', 'Flow-chart step 3: Station masters reset the platform ______ each morning.', '[]'::jsonb, ARRAY['clock', 'clocks']::text[], 1, 'lenient', true, false, '{}'::jsonb, '"the station masters reset the platform clock each morning."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)
values ('e8352666-7c81-4285-abf8-05b7e883b99c', '11111111-2222-4333-8444-555555555555', 'reading', 3600, 40, NULL, 1)
on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('e4da6d88-75db-40fe-9182-440cee7d007e', 'e8352666-7c81-4285-abf8-05b7e883b99c', 1, 'The wandering albatross, Diomedea exulans, has the largest wingspan of any living bird. A mature adult measures up to three and a half metres from tip to tip, and yet the bird is remarkable less for its size than for what it does with it. Satellite tracking has shown individuals covering more than a thousand kilometres in a single day and circling the Southern Ocean in under two months, all while beating their wings only rarely.

The trick is a technique called dynamic soaring. Wind blowing across the open ocean is slowed near the surface by friction with the water, so a bird climbing from the trough of a wave into the faster air above gains speed relative to the ground without expending muscular effort. The albatross rises into the wind, turns, and descends across it, extracting a small amount of energy from the wind gradient on every cycle. Repeated tens of thousands of times a day, these shallow arcs carry the bird enormous distances. A tendon lock in the shoulder holds the wing extended, so that maintaining the spread costs the bird almost nothing.

Measurements bear this out. Researchers who fitted birds with heart-rate loggers found that the metabolic cost of soaring flight was barely higher than that of sitting on the nest. The expensive parts of an albatross''s day are take-off and landing, which is why the birds are reluctant to leave the water in calm conditions and may sit out a windless afternoon entirely.

This economy of movement shapes the species'' breeding biology. A pair raises a single chick, and the effort takes so long that successful breeders can attempt it only every second year. The male and female take turns at the nest on Southern Ocean islands while the other forages, sometimes as far away as the coast of South America. A foraging trip of a fortnight is unremarkable. The chick, left alone on its nest mound for days at a time, is fed on an irregular schedule and grows slowly, fledging after roughly nine months.

That long, slow schedule is the source of the species'' present difficulty. Longline fishing vessels set baited hooks that sink slowly behind the boat, and albatrosses, which follow ships as a matter of course, dive on the bait and are dragged under. Because the birds breed so infrequently, a population cannot absorb additional adult mortality the way a fast-breeding species can. Conservationists have pressed for simple mitigation measures: streamer lines that scare birds away from the sinking hooks, weighted lines that sink faster, and setting gear at night when fewer birds are active.

Where these measures have been adopted and enforced, seabird bycatch has fallen sharply, in some fisheries by more than ninety per cent. The difficulty is that the albatross''s range is far larger than any one country''s waters. A bird nesting on South Georgia may pass through the jurisdictions of half a dozen states and long stretches of unregulated high seas in a single foraging trip. Protection is therefore a matter of agreement between fleets rather than of any single national rule, and the birds continue to decline in the regions where such agreement has proved hardest to reach.', NULL, NULL, 'You should spend about 20 minutes on Questions 1-13, which are based on Reading Passage 1 below.', '{"title":"Passage 1 — The long flight of the wandering albatross"}'::jsonb, 0)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('191d747e-1fae-452b-8b1e-a70851daee3e', 'e4da6d88-75db-40fe-9182-440cee7d007e', 'true_false_notgiven', 'The wandering albatross has a greater wingspan than any other bird alive today.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['TRUE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The passage states it "has the largest wingspan of any living bird."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('7921ba1c-f4a5-4667-b3e0-2527a571f8ae', 'e4da6d88-75db-40fe-9182-440cee7d007e', 'true_false_notgiven', 'Albatrosses flap their wings continuously during long ocean crossings.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['FALSE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The bird travels huge distances "while beating their wings only rarely", so the statement is false.', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('4ee3607a-9fc2-4afe-a9d0-602b13cf2665', 'e4da6d88-75db-40fe-9182-440cee7d007e', 'true_false_notgiven', 'Dynamic soaring depends on the difference in wind speed at different heights.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['TRUE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Energy is extracted "from the wind gradient", because wind "is slowed near the surface by friction with the water."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('fd968056-a064-48d8-916a-115c08a70e10', 'e4da6d88-75db-40fe-9182-440cee7d007e', 'true_false_notgiven', 'Young albatrosses learn dynamic soaring from their parents.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NOT GIVEN']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The passage never says how young birds acquire the technique.', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f5d03a31-e640-42bd-be2b-10f993c46659', 'e4da6d88-75db-40fe-9182-440cee7d007e', 'true_false_notgiven', 'Taking off uses more energy than remaining airborne.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['TRUE']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"The expensive parts of an albatross''s day are take-off and landing", while soaring costs "barely higher than ... sitting on the nest."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('225a87cc-637b-49c0-b58e-0ea2ff106a0f', 'e4da6d88-75db-40fe-9182-440cee7d007e', 'true_false_notgiven', 'A breeding pair raises two chicks in a successful season.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['FALSE']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"A pair raises a single chick", not two.', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('069cbeb8-9123-4eb3-8a37-d4b72e18647a', 'e4da6d88-75db-40fe-9182-440cee7d007e', 'note_completion', 'A locked ______ in the shoulder holds the wing open at no cost.', '[]'::jsonb, ARRAY['tendon']::text[], 2, 'lenient', true, false, '{}'::jsonb, '"A tendon lock in the shoulder holds the wing extended."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('afd23bf9-ff0c-4239-84dd-93577518112f', 'e4da6d88-75db-40fe-9182-440cee7d007e', 'note_completion', 'Chicks leave the nest after about ______ months.', '[]'::jsonb, ARRAY['nine', '9']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'The chick grows slowly, "fledging after roughly nine months."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('ef8ca344-c193-4da1-b64d-7451e597b5ac', 'e4da6d88-75db-40fe-9182-440cee7d007e', 'note_completion', '______ lines frighten birds away from hooks as they sink.', '[]'::jsonb, ARRAY['streamer', 'streamer lines']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Mitigation includes "streamer lines that scare birds away from the sinking hooks."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('a607b407-fffd-43a8-8bea-b2c83aa313b9', 'e4da6d88-75db-40fe-9182-440cee7d007e', 'note_completion', 'Setting fishing gear at ______ reduces the number of birds caught.', '[]'::jsonb, ARRAY['night']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Another measure is "setting gear at night when fewer birds are active."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('04f5ad7c-3c5f-4223-a83e-d0b8e87ae3af', 'e4da6d88-75db-40fe-9182-440cee7d007e', 'short_answer', 'How often can a successful breeding pair attempt to raise a chick?', '[]'::jsonb, ARRAY['every second year', 'every two years', 'biennially']::text[], 3, 'lenient', true, false, '{}'::jsonb, '"successful breeders can attempt it only every second year."', 10)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('74e0214e-3391-463e-b224-5d71276d13a5', 'e4da6d88-75db-40fe-9182-440cee7d007e', 'short_answer', 'What is added to fishing lines so that they sink more quickly?', '[]'::jsonb, ARRAY['weights', 'weight']::text[], 3, 'lenient', true, false, '{}'::jsonb, 'The passage mentions "weighted lines that sink faster."', 11)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('0ec78398-7803-4696-ae28-ff2b5a66d718', 'e4da6d88-75db-40fe-9182-440cee7d007e', 'short_answer', 'By how much has bycatch fallen in some fisheries where measures are enforced?', '[]'::jsonb, ARRAY['90%', 'ninety per cent', '90 per cent']::text[], 3, 'lenient', true, false, '{}'::jsonb, '"seabird bycatch has fallen sharply, in some fisheries by more than ninety per cent."', 12)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('98b379e1-f55a-41b6-9ec3-2e5cf8cea729', 'e8352666-7c81-4285-abf8-05b7e883b99c', 2, 'A. For most of the twentieth century, the trees in a city budget appeared only as a cost. They were planted, pruned, cleared of storm damage and eventually removed, and each of those activities had a line item. Nothing on the other side of the ledger recorded what the trees returned. A parks department could therefore demonstrate the expense of its canopy with great precision while being unable to say what the city received for the money.

B. That began to change when researchers started attaching instruments to street trees. A mature plane tree in a temperate city intercepts several thousand litres of rainfall a year, water that would otherwise arrive at the drains during the few minutes of a storm when the system is least able to accept it. The same tree removes measurable quantities of particulate matter from the air and shades enough asphalt to lower the surface temperature beneath it by fifteen degrees or more on a summer afternoon. Each of these effects corresponds to money a city would otherwise spend on drainage capacity, on health care, or on electricity for cooling.

C. Putting a figure on the shade proved the most consequential of these calculations. During a severe heat episode, the difference between a shaded and an unshaded street is not a matter of comfort but of mortality, and it falls unevenly. Surveys of several large cities found canopy cover closely tracking historical patterns of wealth: the wealthiest districts commonly carried two or three times the leaf area of the poorest, and recorded correspondingly lower night-time temperatures. Heat, it turned out, was distributed along the same lines as everything else.

D. The economics of planting, however, are awkward for any elected official. A newly planted street tree delivers very little in its first decade. Its canopy is small, its roots are still establishing, and it requires watering through dry summers to survive at all. The benefits described above accrue to a tree of thirty or forty years'' standing. The councillor who authorises the planting will not be in office when the investment matures, and the residents who pay for it are not, in the main, the residents who will sit beneath it.

E. Selecting what to plant has become harder as well. A species that thrives in a city''s present climate may be poorly suited to the conditions expected there in fifty years, and the trees being planted now will still be standing then. Some municipal foresters have responded by planting deliberately mixed streets, accepting that a proportion of what goes in will fail, on the argument that a diverse canopy is more likely to survive both a warming climate and the arrival of a new pest. Others have begun sourcing familiar species from populations several hundred kilometres to the south.

F. What has changed, in the end, is not the trees but the accounting. Once a city can state that its canopy returns a given sum per year in avoided drainage, cooling and health costs, the conversation shifts from amenity to infrastructure. Several cities now carry their trees on the asset register alongside the bridges and the drains, which means that removing one is recorded as the disposal of an asset rather than the completion of a job.', NULL, NULL, 'You should spend about 20 minutes on Questions 14-26, which are based on Reading Passage 2 below.', '{"title":"Passage 2 — What a city tree is worth"}'::jsonb, 1)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('9f7fa5bf-bce2-4d2c-ad62-e522b617d550', '98b379e1-f55a-41b6-9ec3-2e5cf8cea729', 'matching_headings', 'Paragraph A — choose the most suitable heading.', '[{"value":"i","label":"i. A cost that never appears on the balance sheet"},{"value":"ii","label":"ii. Measuring what the canopy actually does"},{"value":"iii","label":"iii. Early objections from residents"},{"value":"iv","label":"iv. The uneven distribution of shade"},{"value":"v","label":"v. Where the money for planting comes from"},{"value":"vi","label":"vi. A slow return on a long investment"},{"value":"vii","label":"vii. Lessons from a single heatwave"},{"value":"viii","label":"viii. Choosing species for a warmer century"}]'::jsonb, ARRAY['i']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph A says nothing recorded "what the trees returned"; trees "appeared only as a cost."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('1b2a985e-e1fd-426f-a5e1-e82785b79f07', '98b379e1-f55a-41b6-9ec3-2e5cf8cea729', 'matching_headings', 'Paragraph B — choose the most suitable heading.', '[{"value":"i","label":"i. A cost that never appears on the balance sheet"},{"value":"ii","label":"ii. Measuring what the canopy actually does"},{"value":"iii","label":"iii. Early objections from residents"},{"value":"iv","label":"iv. The uneven distribution of shade"},{"value":"v","label":"v. Where the money for planting comes from"},{"value":"vi","label":"vi. A slow return on a long investment"},{"value":"vii","label":"vii. Lessons from a single heatwave"},{"value":"viii","label":"viii. Choosing species for a warmer century"}]'::jsonb, ARRAY['ii']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph B describes how "researchers started attaching instruments to street trees" to measure their effects.', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('d2c29352-f73c-47a4-9355-7c789873342d', '98b379e1-f55a-41b6-9ec3-2e5cf8cea729', 'matching_headings', 'Paragraph C — choose the most suitable heading.', '[{"value":"i","label":"i. A cost that never appears on the balance sheet"},{"value":"ii","label":"ii. Measuring what the canopy actually does"},{"value":"iii","label":"iii. Early objections from residents"},{"value":"iv","label":"iv. The uneven distribution of shade"},{"value":"v","label":"v. Where the money for planting comes from"},{"value":"vi","label":"vi. A slow return on a long investment"},{"value":"vii","label":"vii. Lessons from a single heatwave"},{"value":"viii","label":"viii. Choosing species for a warmer century"}]'::jsonb, ARRAY['iv']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph C shows shade "falls unevenly", with canopy "tracking historical patterns of wealth."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('d5883829-70e5-4b31-a0d4-299045f97322', '98b379e1-f55a-41b6-9ec3-2e5cf8cea729', 'matching_headings', 'Paragraph D — choose the most suitable heading.', '[{"value":"i","label":"i. A cost that never appears on the balance sheet"},{"value":"ii","label":"ii. Measuring what the canopy actually does"},{"value":"iii","label":"iii. Early objections from residents"},{"value":"iv","label":"iv. The uneven distribution of shade"},{"value":"v","label":"v. Where the money for planting comes from"},{"value":"vi","label":"vi. A slow return on a long investment"},{"value":"vii","label":"vii. Lessons from a single heatwave"},{"value":"viii","label":"viii. Choosing species for a warmer century"}]'::jsonb, ARRAY['vi']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph D explains that benefits "accrue to a tree of thirty or forty years'' standing."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('c65f797c-2f6d-4635-b9f0-b570d5509b35', '98b379e1-f55a-41b6-9ec3-2e5cf8cea729', 'matching_headings', 'Paragraph E — choose the most suitable heading.', '[{"value":"i","label":"i. A cost that never appears on the balance sheet"},{"value":"ii","label":"ii. Measuring what the canopy actually does"},{"value":"iii","label":"iii. Early objections from residents"},{"value":"iv","label":"iv. The uneven distribution of shade"},{"value":"v","label":"v. Where the money for planting comes from"},{"value":"vi","label":"vi. A slow return on a long investment"},{"value":"vii","label":"vii. Lessons from a single heatwave"},{"value":"viii","label":"viii. Choosing species for a warmer century"}]'::jsonb, ARRAY['viii']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph E covers species that may be "poorly suited to the conditions expected there in fifty years."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('31d757c3-db46-47a8-b636-b71470c18f3f', '98b379e1-f55a-41b6-9ec3-2e5cf8cea729', 'matching_headings', 'Paragraph F — choose the most suitable heading.', '[{"value":"i","label":"i. A cost that never appears on the balance sheet"},{"value":"ii","label":"ii. Measuring what the canopy actually does"},{"value":"iii","label":"iii. Early objections from residents"},{"value":"iv","label":"iv. The uneven distribution of shade"},{"value":"v","label":"v. Where the money for planting comes from"},{"value":"vi","label":"vi. A slow return on a long investment"},{"value":"vii","label":"vii. Lessons from a single heatwave"},{"value":"viii","label":"viii. Choosing species for a warmer century"}]'::jsonb, ARRAY['v']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph F says "What has changed, in the end, is not the trees but the accounting", as canopy returns "a given sum per year."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('8874c206-9564-45b1-95c2-db09f18f2e65', '98b379e1-f55a-41b6-9ec3-2e5cf8cea729', 'matching_information', 'Which paragraph contains a comparison of leaf area between richer and poorer districts?', '[{"value":"A","label":"Paragraph A"},{"value":"B","label":"Paragraph B"},{"value":"C","label":"Paragraph C"},{"value":"D","label":"Paragraph D"},{"value":"E","label":"Paragraph E"},{"value":"F","label":"Paragraph F"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph C: "the wealthiest districts commonly carried two or three times the leaf area of the poorest."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('bdba9b78-cdd2-488d-ae54-2a2b404a416e', '98b379e1-f55a-41b6-9ec3-2e5cf8cea729', 'matching_information', 'Which paragraph contains a reference to trees being listed among a city''s permanent assets?', '[{"value":"A","label":"Paragraph A"},{"value":"B","label":"Paragraph B"},{"value":"C","label":"Paragraph C"},{"value":"D","label":"Paragraph D"},{"value":"E","label":"Paragraph E"},{"value":"F","label":"Paragraph F"}]'::jsonb, ARRAY['F']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph F: "Several cities now carry their trees on the asset register alongside the bridges and the drains."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('b46bb56e-2bad-43dc-bae8-6aa8c5e60db8', '98b379e1-f55a-41b6-9ec3-2e5cf8cea729', 'matching_information', 'Which paragraph contains an explanation of why the timing of the benefit is politically difficult?', '[{"value":"A","label":"Paragraph A"},{"value":"B","label":"Paragraph B"},{"value":"C","label":"Paragraph C"},{"value":"D","label":"Paragraph D"},{"value":"E","label":"Paragraph E"},{"value":"F","label":"Paragraph F"}]'::jsonb, ARRAY['D']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph D: "The councillor who authorises the planting will not be in office when the investment matures."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('b5a56fbe-4b1b-4a4f-8bc6-be7e1ab3441a', '98b379e1-f55a-41b6-9ec3-2e5cf8cea729', 'matching_information', 'Which paragraph contains a figure for the volume of rain a single tree can intercept?', '[{"value":"A","label":"Paragraph A"},{"value":"B","label":"Paragraph B"},{"value":"C","label":"Paragraph C"},{"value":"D","label":"Paragraph D"},{"value":"E","label":"Paragraph E"},{"value":"F","label":"Paragraph F"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph B: "A mature plane tree ... intercepts several thousand litres of rainfall a year."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('bd0b0be1-0bbc-4e8e-8452-43f4aafb7081', '98b379e1-f55a-41b6-9ec3-2e5cf8cea729', 'summary_completion', 'Shade from a mature tree can reduce the surface temperature of the road below it by ______ degrees or more.', '[]'::jsonb, ARRAY['fifteen', '15']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Shade can "lower the surface temperature beneath it by fifteen degrees or more."', 10)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('0083acdb-1ce1-46b2-8bad-ce4e2204c4aa', '98b379e1-f55a-41b6-9ec3-2e5cf8cea729', 'summary_completion', 'A newly planted tree needs ______ in order to survive dry summers.', '[]'::jsonb, ARRAY['watering', 'water']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'A new tree "requires watering through dry summers to survive at all."', 11)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('cc861f9f-3f76-4a47-b2ff-52044cc6cc99', '98b379e1-f55a-41b6-9ec3-2e5cf8cea729', 'summary_completion', 'A canopy of mixed species is considered more resistant to a warming climate and to any new ______.', '[]'::jsonb, ARRAY['pest', 'pests']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'A diverse canopy is "more likely to survive both a warming climate and the arrival of a new pest."', 12)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'e8352666-7c81-4285-abf8-05b7e883b99c', 3, 'There is a persistent popular model of memory in which the mind works something like a recording device. Events are captured, filed, and later played back, and the playback may be faint or incomplete but is otherwise faithful to what was captured. Almost everything experimental psychology has learned in the past century contradicts this model, and yet it survives, not least in the courtroom, where a witness who remembers vividly is treated as a witness who remembers accurately.

The early work that unsettled the recording model was done by Frederic Bartlett, who asked English participants to read an unfamiliar Native American folk tale and to reproduce it from memory after intervals of days, weeks and finally years. The reproductions did not simply lose detail. They changed shape. Unfamiliar elements were quietly replaced with familiar ones, the supernatural passages were rationalised, and the whole was reorganised into a narrative that made sense to an English reader of the 1930s. Bartlett''s conclusion was that remembering is not retrieval but reconstruction: the mind rebuilds an account from fragments and expectations each time it is asked, and what it produces is shaped by what it expects to find.

Elizabeth Loftus later showed how easily that reconstruction can be steered. Participants who had watched a film of a traffic accident were asked how fast the cars were going when they ''smashed into'' each other; others were asked about the same film using the verb ''contacted''. The smashed group reported higher speeds, and, a week later, were substantially more likely to report having seen broken glass at the scene. There had been no broken glass. A single word in a question, asked after the event, had been incorporated into the memory of the event itself.

Lynn Nadel and others have since given this an anatomical account. A memory is not stored as a unit but distributed across the cortex, with the hippocampus binding the elements into a retrievable pattern. Each act of recall reactivates that pattern and, crucially, leaves it briefly labile before it is stabilised again. Whatever is present during that window — a leading question, another witness''s account, a photograph in a newspaper — can be bound into the pattern and will subsequently be recalled as part of the original event, indistinguishable to the rememberer from anything else in it.

This last point is the one that matters legally, and it is the one that is hardest to accept. Contaminated memories do not feel contaminated. The witness is not lying and cannot be caught out, because from the inside a reconstructed detail carries exactly the same quality of vividness as an accurate one. Worse, confidence tends to rise with each retelling: the witness who has described the scene four times to investigators is more certain by the fourth telling, and jurors read that certainty as reliability.

The practical response has been procedural rather than psychological. Identification parades are now commonly administered by an officer who does not know which member is the suspect, so that no unconscious cue can be transmitted. Witnesses are asked for a statement of confidence at the moment of first identification, before any feedback, since it is that first figure, and not the one offered in court months later, that carries diagnostic value. None of this makes memory a recording. It simply accepts that it is not one.', NULL, NULL, 'You should spend about 20 minutes on Questions 27-40, which are based on Reading Passage 3 below.', '{"title":"Passage 3 — The confident witness"}'::jsonb, 2)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('211a5137-6c7d-4525-b1e4-db7a280fe2da', '5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'yes_no_notgiven', 'The popular model of memory as a recording device has been largely abandoned outside psychology.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NO']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The writer says the model "survives, not least in the courtroom", so it has not been abandoned.', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('0b63fb0d-4111-4200-af23-47922a492d5b', '5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'yes_no_notgiven', 'Bartlett''s participants altered the structure of the story, not just its details.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['YES']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"The reproductions did not simply lose detail. They changed shape."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('7ae4c925-f820-4d0d-8849-77dc8a68cb18', '5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'yes_no_notgiven', 'Bartlett''s study would be considered unethical by modern standards.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NOT GIVEN']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The ethics of Bartlett''s study are never discussed.', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('abfd2cc4-6c46-451d-a64f-798936ff4f24', '5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'yes_no_notgiven', 'The wording of a question asked afterwards can change what a witness remembers seeing.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['YES']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"A single word in a question, asked after the event, had been incorporated into the memory of the event itself."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('3b23d74e-e252-4135-bcfd-3dd7f5aa83c2', '5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'yes_no_notgiven', 'Jurors are generally able to distinguish a confident witness from an accurate one.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NO']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The writer says "jurors read that certainty as reliability", so they do not distinguish the two.', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('764be002-9b23-4fd8-8b44-5ce3f048983f', '5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'multiple_choice_single', 'In Bartlett''s experiment, the changes participants made to the folk tale mainly involved', '[{"value":"A","label":"A. shortening the story to its essential events."},{"value":"B","label":"B. adapting unfamiliar material to fit familiar expectations."},{"value":"C","label":"C. adding supernatural elements that were not in the original."},{"value":"D","label":"D. confusing the story with others they had read."}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"Unfamiliar elements were quietly replaced with familiar ones" to fit "what it expects to find."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('501c0fcd-a7b8-4c8c-9b66-cd1f985b274f', '5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'multiple_choice_single', 'The detail of the broken glass is significant because', '[{"value":"A","label":"A. it was reported immediately after the film was shown."},{"value":"B","label":"B. it shows that participants misjudged the speed of the cars."},{"value":"C","label":"C. it was never present in the film the participants watched."},{"value":"D","label":"D. only participants asked about ''contacted'' reported it."}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Participants reported broken glass, but "There had been no broken glass."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('c408c54b-2f8c-4eb7-8662-241bc2e44a61', '5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'multiple_choice_single', 'According to the passage, the hippocampus is described as', '[{"value":"A","label":"A. the site where complete memories are stored."},{"value":"B","label":"B. binding distributed elements into a retrievable pattern."},{"value":"C","label":"C. preventing new information from entering old memories."},{"value":"D","label":"D. becoming less active with each act of recall."}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The passage says "the hippocampus binding the elements into a retrievable pattern."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('8ca03dd0-4213-48e4-8e00-c77261dc21b5', '5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'matching_features', 'Which researcher demonstrated that post-event wording alters recall?', '[{"value":"A","label":"A. Loftus"},{"value":"B","label":"B. Bartlett"},{"value":"C","label":"C. Nadel"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Loftus showed that "A single word in a question, asked after the event" changed the memory.', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('a29f7540-a08a-4d7a-8766-4a59b2c20676', '5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'matching_features', 'Which researcher showed that recall reshapes a story toward the familiar?', '[{"value":"A","label":"A. Loftus"},{"value":"B","label":"B. Bartlett"},{"value":"C","label":"C. Nadel"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Bartlett found unfamiliar elements "replaced with familiar ones."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('4a9a7be9-b4a5-4131-b09d-f7bd7c7f03ee', '5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'matching_features', 'Which researcher described the period of instability that follows retrieval?', '[{"value":"A","label":"A. Loftus"},{"value":"B","label":"B. Bartlett"},{"value":"C","label":"C. Nadel"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Nadel''s account says recall "leaves it briefly labile before it is stabilised again."', 10)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('be8c7d66-d6b7-4c5e-ba96-ab706c4a3c1c', '5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'matching_sentence_endings', 'Bartlett argued that no two recollections of an event are identical', '[{"value":"A","label":"A. because the original trace is overwritten each time."},{"value":"B","label":"B. because remembering is an act of reconstruction."},{"value":"C","label":"C. although the witness reports it with great confidence."},{"value":"D","label":"D. unless the event was rehearsed immediately afterwards."},{"value":"E","label":"E. which is why juries find such testimony persuasive."}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Bartlett concluded "remembering is not retrieval but reconstruction."', 11)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('b80f0b3f-fbe5-4ab8-9ebf-5950c75dafd9', '5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'matching_sentence_endings', 'A detail absorbed from a newspaper photograph may be recalled as part of the original scene', '[{"value":"A","label":"A. because the original trace is overwritten each time."},{"value":"B","label":"B. because remembering is an act of reconstruction."},{"value":"C","label":"C. although the witness reports it with great confidence."},{"value":"D","label":"D. unless the event was rehearsed immediately afterwards."},{"value":"E","label":"E. which is why juries find such testimony persuasive."}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Such details are recalled "as part of the original event", and "Contaminated memories do not feel contaminated", so the witness is confident.', 12)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('02042938-90dd-4ce6-bb40-82fb5cec4e9f', '5ba4e51a-e35a-4814-bdb3-9764f0a2aa01', 'multiple_choice_multiple', 'Which TWO procedural safeguards does the passage say have been adopted? Choose TWO letters.', '[{"value":"A","label":"A. Recording the witness''s confidence at the first identification."},{"value":"B","label":"B. Excluding witnesses who have spoken to the press."},{"value":"C","label":"C. Using an officer who does not know which member is the suspect."},{"value":"D","label":"D. Requiring identification to take place within 24 hours."},{"value":"E","label":"E. Showing the witness the parade a second time in court."}]'::jsonb, ARRAY['A', 'C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Parades are run "by an officer who does not know which member is the suspect", and witnesses give "a statement of confidence at the moment of first identification."', 13)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)
values ('3375bf28-5cfe-47d5-ab59-84f3f0c537c4', '11111111-2222-4333-8444-555555555555', 'writing', 3600, 2, NULL, 2)
on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('6771e185-c2c6-47a3-abbd-2f7e32369e0f', '3375bf28-5cfe-47d5-ab59-84f3f0c537c4', 1, 'The chart below shows household water consumption by end use in three cities in 2010 and 2024.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.', NULL, '/mock-images/task1-chart.svg', 'You should spend about 20 minutes on this task. Write at least 150 words.', '{"image_caption":"Household water consumption by end use in three cities, 2010 and 2024","title":"Task 1"}'::jsonb, 0)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('1375f322-1756-42d3-95ae-5abf7bac417c', '6771e185-c2c6-47a3-abbd-2f7e32369e0f', 'short_answer', 'Task 1 response', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('e3c275aa-5f65-4904-8c45-a85ffcc0fd3b', '3375bf28-5cfe-47d5-ab59-84f3f0c537c4', 2, 'Some people believe that public money spent on the arts would be better directed towards healthcare and education. Others argue that a society without publicly funded culture is poorer in ways that are not easily measured.

Discuss both these views and give your own opinion.

Give reasons for your answer and include any relevant examples from your own knowledge or experience.', NULL, NULL, 'You should spend about 40 minutes on this task. Write at least 250 words.', '{"title":"Task 2"}'::jsonb, 1)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('c0fa7b54-5659-494f-8bf6-26f19f16ff47', 'e3c275aa-5f65-4904-8c45-a85ffcc0fd3b', 'short_answer', 'Task 2 response', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)
values ('25d8fdd7-87b2-4f42-b209-ed0ded578a1a', '11111111-2222-4333-8444-555555555555', 'speaking', 840, 12, NULL, 3)
on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('fb9a90b5-712f-4a0c-8f63-c381e3ea9fb0', '25d8fdd7-87b2-4f42-b209-ed0ded578a1a', 1, NULL, NULL, NULL, 'The examiner asks about yourself, your home, work or studies and other familiar topics. 4-5 minutes.', '{"title":"Part 1 — Introduction and familiar topics"}'::jsonb, 0)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('911d5e0c-cf8d-4445-aae3-ab64858703c2', 'fb9a90b5-712f-4a0c-8f63-c381e3ea9fb0', 'short_answer', 'Let''s talk about where you live. Do you live in a house or an apartment?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('7bccc0db-46f4-4058-9f18-40340aa16b65', 'fb9a90b5-712f-4a0c-8f63-c381e3ea9fb0', 'short_answer', 'What do you like most about the area you live in?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('7a3c2abd-20c2-47e7-92f3-d9f1b71cae4f', 'fb9a90b5-712f-4a0c-8f63-c381e3ea9fb0', 'short_answer', 'Would you like to move somewhere else in the future? Why?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('083c739e-bb05-4a08-9517-7ccca9641cc2', 'fb9a90b5-712f-4a0c-8f63-c381e3ea9fb0', 'short_answer', 'Now let''s talk about journeys. How do you usually travel to work or college?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('305158a8-449c-4dc4-8dca-a352cee06690', 'fb9a90b5-712f-4a0c-8f63-c381e3ea9fb0', 'short_answer', 'Has the way you travel changed in the last few years?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('c9fb2dd1-34e9-4d95-9c2c-b61485200c67', 'fb9a90b5-712f-4a0c-8f63-c381e3ea9fb0', 'short_answer', 'Do you enjoy travelling by train? Why or why not?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('d801d5d8-a020-49de-bd35-6c11d70b6cf4', '25d8fdd7-87b2-4f42-b209-ed0ded578a1a', 2, 'Describe a skill you learned that took a long time to develop.

You should say:
  •  what the skill was
  •  why you decided to learn it
  •  how you went about learning it

and explain how you felt once you had developed it.', NULL, NULL, 'You have one minute to prepare. You may make notes. Then talk for one to two minutes. The examiner will tell you when to stop.', '{"title":"Part 2 — Individual long turn"}'::jsonb, 1)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f97c728f-2f26-49d4-beaf-78ccbaed4017', 'd801d5d8-a020-49de-bd35-6c11d70b6cf4', 'short_answer', 'Long turn response', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('e4a32f98-d8ae-4066-bb7d-a23a07d90adf', '25d8fdd7-87b2-4f42-b209-ed0ded578a1a', 3, NULL, NULL, NULL, 'The examiner asks further questions connected to the topic in Part 2. 4-5 minutes.', '{"title":"Part 3 — Two-way discussion"}'::jsonb, 2)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('b7165ca4-4e5f-4e33-91bb-8811b9f44464', 'e4a32f98-d8ae-4066-bb7d-a23a07d90adf', 'short_answer', 'Why do you think some people give up on a skill before they master it?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e2794abe-223b-4f23-975e-cbb306c06d1a', 'e4a32f98-d8ae-4066-bb7d-a23a07d90adf', 'short_answer', 'Should schools spend more time teaching practical skills? Why?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('9d02999a-0d1b-463a-a82b-02d442c7f657', 'e4a32f98-d8ae-4066-bb7d-a23a07d90adf', 'short_answer', 'Do you think it is harder to learn new skills as an adult?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('a6554fb4-c964-4659-aaae-75526f77de9b', 'e4a32f98-d8ae-4066-bb7d-a23a07d90adf', 'short_answer', 'How has technology changed the way people acquire skills?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('7452fdde-27e1-443e-a987-1b2c7fe0786c', 'e4a32f98-d8ae-4066-bb7d-a23a07d90adf', 'short_answer', 'Will some skills disappear entirely in the next fifty years?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

-- Academic Mock Test 2 (academic-2)
insert into public.test_forms (id, slug, title, description, variant, delivery_mode, is_published, is_premium, difficulty, scoring_version)
values ('be1b01a1-baba-43ea-a644-82c9fca21664', 'academic-2', 'Academic Mock Test 2', 'A second full Academic practice test covering all four sections.', 'academic', 'computer', true, false, 'standard', 'v1')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, description = excluded.description, is_published = excluded.is_published, is_premium = excluded.is_premium, difficulty = excluded.difficulty;

insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)
values ('38268768-a9a8-495c-b42d-ff90ca81df51', 'be1b01a1-baba-43ea-a644-82c9fca21664', 'listening', 1800, 40, NULL, 0)
on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('f894d089-3acd-4eb1-88c5-5ea0808472f9', '38268768-a9a8-495c-b42d-ff90ca81df51', 1, NULL, NULL, NULL, 'Questions 1-10. Complete the booking form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.', '{"title":"Part 1 — Booking a walking holiday"}'::jsonb, 0)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.item_group_scripts (group_id, transcript) values ('f894d089-3acd-4eb1-88c5-5ea0808472f9', 'AGENT: Good afternoon, Fellside Walking Holidays, Mark speaking. How can I help?
LINDA: Hello. I''m interested in booking one of your self-guided walking holidays, and I''d like to check a few details first.
AGENT: Certainly. I''ll fill in a booking form as we go, and you can confirm at the end. Could I take your name, please?
LINDA: Yes, it''s Linda Fairbrother.
AGENT: Is that Fairbrother as in F-A-I-R-B-R-O-T-H-E-R?
LINDA: That''s right, all one word.
AGENT: Thank you. And your postcode?
LINDA: It''s BS8 4RT. Sorry, I''ve just moved, so I nearly gave you my old one, which was BS6.
AGENT: BS8 4RT. Got it. Now, which holiday were you thinking of?
LINDA: I was looking at the Coastal Path walk at first, but some of the cliff sections look quite steep. A friend recommended the Larch Valley walk instead.
AGENT: The Larch Valley walk is lovely, and much gentler. That''s L-A-R-C-H. We offer it as a four-night, six-night or eight-night trip.
LINDA: Four nights seems too short to travel all that way, and eight is more than I can take off work. So six nights, please.
AGENT: Six nights. And when would you like to set off? We run it from May to September.
LINDA: I was hoping for the sixteenth of June, but I imagine that''s busy.
AGENT: I''m afraid the sixteenth is full. The next available departure is the twenty-third of June.
LINDA: The twenty-third is fine. That''s a Saturday, isn''t it?
AGENT: It is. Now, accommodation. On this route we can put you in small hotels, bed and breakfasts or farmhouses.
LINDA: I stayed in hotels on my last trip and found them rather impersonal. B and Bs can be nice, but I''d really prefer farmhouse accommodation, if possible. I love the idea of a big breakfast in a farm kitchen.
AGENT: Farmhouses are available every night on that route, so that''s no problem. The price for six nights, sharing a room, is four hundred and ninety pounds per person, but as you''re travelling alone there''s a supplement, which brings it to five hundred and forty pounds per person.
LINDA: Five hundred and forty. That''s a little more than I expected, but it''s all right. Does that include moving my luggage between farmhouses?
AGENT: Luggage transfer isn''t included, I''m afraid. It''s an extra twelve pounds per day. Some people manage with a large rucksack, but most clients find it worth paying.
LINDA: Twelve pounds a day. Yes, I''ll definitely have that. I don''t want to carry everything up hills.
AGENT: Sensible. Do you have any dietary requirements? The farmhouses provide breakfast and an evening meal.
LINDA: I don''t have any allergies, but I am vegetarian. I eat fish occasionally, but please just put vegetarian.
AGENT: Vegetarian. I''ll pass that on to each farmhouse. And finally, may I ask how you heard about us? We like to know which advertising works.
LINDA: Well, a friend has mentioned you a few times, and I''ve looked at your website, of course. But it was actually an article in a walking magazine that made me ring. There was a whole page about your Larch Valley route.
AGENT: Oh, that''s good to hear. I''ll put magazine. Right, I''ll email you the booking form now, and once you''ve paid the deposit, your place is confirmed.
LINDA: Wonderful. Thanks for your help, Mark.
AGENT: You''re welcome, Ms Fairbrother. Enjoy your walk.')
on conflict (group_id) do update set transcript = excluded.transcript;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('3458fbad-bf10-4403-b169-9d17c7bf414d', 'f894d089-3acd-4eb1-88c5-5ea0808472f9', 'note_completion', 'Customer''s name: Linda ______', '[]'::jsonb, ARRAY['Fairbrother']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'The agent spells it: "F-A-I-R-B-R-O-T-H-E-R", and Linda confirms "all one word."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('71ffd902-de73-48a5-924d-c44786d9d5ac', 'f894d089-3acd-4eb1-88c5-5ea0808472f9', 'note_completion', 'Postcode: ______', '[]'::jsonb, ARRAY['BS8 4RT']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Linda says "It''s BS8 4RT"; BS6 was her old postcode.', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('870206e4-34ae-43ac-a99c-8a91cbb79ea2', 'f894d089-3acd-4eb1-88c5-5ea0808472f9', 'note_completion', 'Holiday chosen: the ______ Valley walk', '[]'::jsonb, ARRAY['Larch']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'She rejects the Coastal Path walk: "A friend recommended the Larch Valley walk instead."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('06ab12bd-c261-42ee-a1a5-bc3bc5ca1515', 'f894d089-3acd-4eb1-88c5-5ea0808472f9', 'note_completion', 'Length of trip: ______ nights', '[]'::jsonb, ARRAY['six', '6']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Four is too short and eight too long: "So six nights, please."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('aa3de43c-9d1b-4a63-bb37-5188679aff07', 'f894d089-3acd-4eb1-88c5-5ea0808472f9', 'note_completion', 'Departure date: ______ June', '[]'::jsonb, ARRAY['23rd', '23', 'twenty-third']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'The sixteenth is full: "The next available departure is the twenty-third of June."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('7897c32a-daf4-439a-b696-321f5e0f7135', 'f894d089-3acd-4eb1-88c5-5ea0808472f9', 'note_completion', 'Type of accommodation: ______', '[]'::jsonb, ARRAY['farmhouse', 'farmhouses']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'She found hotels impersonal: "I''d really prefer farmhouse accommodation."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('c536a157-03b9-4a4c-bdc1-a0cd5d565f57', 'f894d089-3acd-4eb1-88c5-5ea0808472f9', 'note_completion', 'Price per person (including supplement): £______', '[]'::jsonb, ARRAY['540']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'The supplement "brings it to five hundred and forty pounds per person"; £490 is the sharing price.', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('149fe757-0f17-4590-818d-70290b68291e', 'f894d089-3acd-4eb1-88c5-5ea0808472f9', 'note_completion', 'Luggage transfer: £______ per day extra', '[]'::jsonb, ARRAY['12', 'twelve']::text[], 2, 'lenient', true, false, '{}'::jsonb, '"It''s an extra twelve pounds per day."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('8aebccaa-6d68-42e8-bae0-72f4c3d12a4f', 'f894d089-3acd-4eb1-88c5-5ea0808472f9', 'note_completion', 'Dietary requirement: ______', '[]'::jsonb, ARRAY['vegetarian']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Linda says "please just put vegetarian."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('3e6b1ec7-ad0a-4f8a-ac0c-cafd5491965e', 'f894d089-3acd-4eb1-88c5-5ea0808472f9', 'note_completion', 'Heard about the company from: a ______', '[]'::jsonb, ARRAY['magazine', 'walking magazine']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Not the friend or website: "it was actually an article in a walking magazine that made me ring."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('5a0507f4-4fa4-4cef-8030-beacd6fc0850', '38268768-a9a8-495c-b42d-ff90ca81df51', 2, NULL, NULL, NULL, 'Questions 11-20. Choose the correct letter for Questions 11-14, choose TWO letters for Questions 15-16, and for Questions 17-20 say where each item should go.', '{"title":"Part 2 — A radio talk about a food waste scheme"}'::jsonb, 1)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.item_group_scripts (group_id, transcript) values ('5a0507f4-4fa4-4cef-8030-beacd6fc0850', 'OFFICER: Good morning. My name is Rachel Osei, and I''m the waste services officer for the city council. I''ve been invited onto the programme this morning to explain the new food waste collection scheme, which will change how every household in the city deals with its rubbish.
OFFICER: Let''s start with the date. Some of you may have read that the scheme was going to start on the first of March. That was the original plan, but delivering equipment to every household took longer than we expected, so the scheme now starts on the first of April. There will be a review after the first two months, at the beginning of June.
OFFICER: People often ask me why we''re doing this. Yes, there''s a national target for recycling, and we''re close to meeting it already. And it''s true that some residents have been asking for food collections for years. But the main reason is cost. Every tonne of rubbish we send to landfill costs the city over a hundred pounds, and food makes up about a third of the average bin. Reducing landfill costs means more money for other services. As a bonus, the compost produced will be used in the city''s parks.
OFFICER: So, what do you need to do? Every household will get two containers: a small kitchen caddy to keep by the sink and a larger outdoor bin. You don''t need to buy anything, and you don''t need to go and collect them from your local library, as some people have suggested. The caddies will be delivered to homes over the next three weeks, and they''ll be left on your doorstep.
OFFICER: Food waste will be collected weekly, on the same day as your other rubbish. We did consider collecting it twice a week in summer, but in practice a weekly service is enough if the lid is kept closed. Your general waste will now go fortnightly.
OFFICER: Now, what can go into the caddy? Almost any food, cooked or raw: fruit and vegetable peelings, tea bags, meat, cooked bones and eggshells are all fine. However, please don''t put plastic bags in the caddy, even if they claim to be biodegradable, because they jam our machinery. And cooking oil should never go in either. Small amounts can be soaked up with kitchen paper and put in general waste.
OFFICER: To keep the caddy clean, you can line it with compostable liners. A roll of these will be supplied free for the first year, along with your caddy. After that, you''ll need to buy them, and they''re on sale in most supermarkets, although you don''t have to use any particular brand. Alternatively, and this is what I do, you can simply wrap your food waste in newspaper. Any newspaper is acceptable, and it works just as well.
OFFICER: Finally, I know people are confused about where other items should go, so here are a few examples. Pizza boxes cause a lot of arguments. As long as they''re clean, they go in your recycling box with other cardboard. Any leftover pizza goes in the food caddy, of course. Garden waste, such as grass and hedge cuttings, goes in the garden bin, not the food caddy, because the woody material takes too long to break down. Broken glass is dangerous for our crews to sort, so please don''t put it in the recycling box. Wrap it carefully and put it in general waste. And old batteries must not go in any of your bins at home, because they can start fires in the lorries. Please take them to the recycling centre on Mill Road, or to a supermarket collection point.
OFFICER: If you have any more questions, the full details are on the council website. Thank you.')
on conflict (group_id) do update set transcript = excluded.transcript;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f9c2c06e-8df7-4287-8355-5cd51ad851a6', '5a0507f4-4fa4-4cef-8030-beacd6fc0850', 'multiple_choice_single', 'The food waste scheme will start on', '[{"value":"A","label":"A. 1 March"},{"value":"B","label":"B. 1 April"},{"value":"C","label":"C. 1 May"},{"value":"D","label":"D. 1 June"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'March was the original plan, but "the scheme now starts on the first of April."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('41b73052-d046-4467-a8f0-f8c56bd6a87d', '5a0507f4-4fa4-4cef-8030-beacd6fc0850', 'multiple_choice_single', 'According to the speaker, the main reason for the scheme is to', '[{"value":"A","label":"A. reduce the cost of landfill"},{"value":"B","label":"B. meet a national recycling target"},{"value":"C","label":"C. respond to residents'' requests"},{"value":"D","label":"D. produce compost for the parks"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"the main reason is cost ... Reducing landfill costs means more money for other services."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('7e52136f-f2d6-4e7b-a46a-1975c1e5a779', '5a0507f4-4fa4-4cef-8030-beacd6fc0850', 'multiple_choice_single', 'Kitchen caddies will be', '[{"value":"A","label":"A. delivered to homes"},{"value":"B","label":"B. collected from libraries"},{"value":"C","label":"C. bought from the council"},{"value":"D","label":"D. sold in supermarkets"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"The caddies will be delivered to homes over the next three weeks."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f6b2da83-e166-4afc-924d-c2fd58ec6e28', '5a0507f4-4fa4-4cef-8030-beacd6fc0850', 'multiple_choice_single', 'Food waste will be collected', '[{"value":"A","label":"A. twice a week"},{"value":"B","label":"B. every week"},{"value":"C","label":"C. every two weeks"},{"value":"D","label":"D. once a month"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"Food waste will be collected weekly"; it is general waste that goes fortnightly.', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('a1375c89-d702-4d91-8b6e-fe65bb025d37', '5a0507f4-4fa4-4cef-8030-beacd6fc0850', 'multiple_choice_multiple', 'Which TWO items should NOT be put in the food caddy? Choose TWO letters.', '[{"value":"A","label":"A. tea bags"},{"value":"B","label":"B. cooked bones"},{"value":"C","label":"C. plastic bags"},{"value":"D","label":"D. eggshells"},{"value":"E","label":"E. cooking oil"}]'::jsonb, ARRAY['C', 'E']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"please don''t put plastic bags in the caddy" and "cooking oil should never go in either"; tea bags, bones and eggshells "are all fine."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('0065c354-3376-4f58-a8d4-f734da368942', '5a0507f4-4fa4-4cef-8030-beacd6fc0850', 'multiple_choice_multiple', 'Which TWO things does the speaker say about caddy liners? Choose TWO letters.', '[{"value":"A","label":"A. They are free for the first year."},{"value":"B","label":"B. Newspaper can be used instead."},{"value":"C","label":"C. They can be collected from libraries."},{"value":"D","label":"D. Only the council''s own brand may be used."},{"value":"E","label":"E. They are delivered every month."}]'::jsonb, ARRAY['A', 'B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Liners "will be supplied free for the first year", and "Any newspaper is acceptable"; "you don''t have to use any particular brand."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('7eb8ef88-a25a-45b6-9f42-89ee112db346', '5a0507f4-4fa4-4cef-8030-beacd6fc0850', 'matching_features', 'Clean pizza boxes', '[{"value":"A","label":"A. Food caddy"},{"value":"B","label":"B. Garden bin"},{"value":"C","label":"C. Recycling box"},{"value":"D","label":"D. General waste"},{"value":"E","label":"E. Recycling centre"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"As long as they''re clean, they go in your recycling box with other cardboard."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('879935cf-cde2-4760-886d-d9674a66f00d', '5a0507f4-4fa4-4cef-8030-beacd6fc0850', 'matching_features', 'Hedge cuttings', '[{"value":"A","label":"A. Food caddy"},{"value":"B","label":"B. Garden bin"},{"value":"C","label":"C. Recycling box"},{"value":"D","label":"D. General waste"},{"value":"E","label":"E. Recycling centre"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"grass and hedge cuttings, goes in the garden bin, not the food caddy."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('a7b830d9-413a-4771-8bb6-ba4d32bc0afb', '5a0507f4-4fa4-4cef-8030-beacd6fc0850', 'matching_features', 'Broken glass', '[{"value":"A","label":"A. Food caddy"},{"value":"B","label":"B. Garden bin"},{"value":"C","label":"C. Recycling box"},{"value":"D","label":"D. General waste"},{"value":"E","label":"E. Recycling centre"}]'::jsonb, ARRAY['D']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"Wrap it carefully and put it in general waste."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f5a74d22-b312-4fb6-bc15-6c9043ee347a', '5a0507f4-4fa4-4cef-8030-beacd6fc0850', 'matching_features', 'Old batteries', '[{"value":"A","label":"A. Food caddy"},{"value":"B","label":"B. Garden bin"},{"value":"C","label":"C. Recycling box"},{"value":"D","label":"D. General waste"},{"value":"E","label":"E. Recycling centre"}]'::jsonb, ARRAY['E']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"Please take them to the recycling centre on Mill Road."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('9f65b0a2-7f5e-4c07-ba01-1901657329e8', '38268768-a9a8-495c-b42d-ff90ca81df51', 3, NULL, NULL, NULL, 'Questions 21-30. Choose the correct letter for Questions 21-25. For Questions 26-30, what do the students say about each source? Choose the correct letter, A-F.', '{"title":"Part 3 — Planning a presentation on urban beekeeping"}'::jsonb, 2)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.item_group_scripts (group_id, transcript) values ('9f65b0a2-7f5e-4c07-ba01-1901657329e8', 'KATE: Thanks for seeing us, Professor Lane. We wanted to talk about our presentation on urban beekeeping.
PROFESSOR LANE: Of course. Remind me why you chose the topic, Kate?
KATE: Well, people assume it''s because my uncle keeps bees, and he does, but that wasn''t really it. And we''d both seen the news stories about bees declining. But it was the lecture last term on pollinators in cities that got us interested. That''s what made us want to find out more.
PROFESSOR LANE: Good. And how has the research gone, Omar?
OMAR: Mostly well. Interviewing the beekeepers was easier than I expected, actually, because they love talking about their hives. The chemistry of honey was quite complicated, but we got there. The hardest part was finding recent data. Most of the figures on city hives are more than ten years old.
PROFESSOR LANE: That''s a common problem. I''ve looked at your draft slides, by the way. The length is about right, and you''ve got plenty of visuals, and the structure is clear. My concern is that it''s too technical at the moment. Your audience are first-year students, and some of the material on hive biology will lose them.
KATE: OK, we can simplify that section. We were also wondering how to open the presentation. I suggested starting with a short video of a rooftop hive.
OMAR: And I thought we could ask the audience a question, or show a statistic about how many hives there are in London.
PROFESSOR LANE: Those would all work, but I think something people can see and touch is more memorable.
KATE: In that case, why don''t we open with a jar of honey from a city hive? We could pass it round.
OMAR: Yes, let''s open with the jar of honey. It''s much more memorable than a statistic.
PROFESSOR LANE: Excellent. Now, on sources. You''ve cited a textbook and a few blogs, which is fine for background, and there''s a government report from 2008. But the one I''d really recommend you cite is the 2019 survey of urban beekeepers. It''s the most recent large study.
OMAR: We''ll add the 2019 survey. Can we quickly go through the other sources with you?
PROFESSOR LANE: Go ahead.
OMAR: First, the city council report. It''s very reliable, but it''s outdated now, because it was published before the hive registration scheme started.
PROFESSOR LANE: Fair. And the beekeepers'' association website?
KATE: That has lots of information, but it''s biased. The association wants more people to keep bees, so it tends to play down the problems, like the competition with wild bees.
PROFESSOR LANE: Right. What about the journal article by Moreno?
OMAR: That''s definitely been the most useful. It compares hive health in twelve cities, and it has the exact data we need for the main section.
KATE: Then there''s the documentary we watched. It was enjoyable, but too general for us. It covered bees all over the world and only mentioned cities for a few minutes.
PROFESSOR LANE: And the university''s own hive records?
OMAR: We''d love to use those, but they''re hard to obtain. They''re kept in paper files in the biology department, and we need special permission to see them.
PROFESSOR LANE: I can help you with that. Send me an email and I''ll speak to the department.
KATE: Thank you, that would be great.')
on conflict (group_id) do update set transcript = excluded.transcript;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f422c404-1d5d-450e-be9c-fee6b88ef6ad', '9f65b0a2-7f5e-4c07-ba01-1901657329e8', 'multiple_choice_single', 'The students chose the topic mainly because of', '[{"value":"A","label":"A. Kate''s uncle''s hives"},{"value":"B","label":"B. a lecture they attended"},{"value":"C","label":"C. news stories about bee decline"},{"value":"D","label":"D. a visit to a rooftop garden"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Kate says "it was the lecture last term on pollinators in cities that got us interested."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e02319c0-31e5-44f9-8729-53d7f272dd4a', '9f65b0a2-7f5e-4c07-ba01-1901657329e8', 'multiple_choice_single', 'Omar says the most difficult part of the research was', '[{"value":"A","label":"A. finding recent data"},{"value":"B","label":"B. interviewing beekeepers"},{"value":"C","label":"C. understanding the chemistry of honey"},{"value":"D","label":"D. keeping within the time limit"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"The hardest part was finding recent data."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('c7516585-2a0b-4e81-aa7d-124f39165855', '9f65b0a2-7f5e-4c07-ba01-1901657329e8', 'multiple_choice_single', 'Professor Lane thinks the presentation is currently', '[{"value":"A","label":"A. too long"},{"value":"B","label":"B. short of visuals"},{"value":"C","label":"C. too technical"},{"value":"D","label":"D. poorly structured"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"My concern is that it''s too technical at the moment."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('60e465fc-763c-428e-9ac8-39ce4cf581ad', '9f65b0a2-7f5e-4c07-ba01-1901657329e8', 'multiple_choice_single', 'The students decide to open the presentation with', '[{"value":"A","label":"A. a short video"},{"value":"B","label":"B. a question for the audience"},{"value":"C","label":"C. a statistic about London"},{"value":"D","label":"D. a jar of honey"}]'::jsonb, ARRAY['D']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Omar agrees: "Yes, let''s open with the jar of honey."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('d62b9580-51bd-4ab2-b706-a7c367cb1f16', '9f65b0a2-7f5e-4c07-ba01-1901657329e8', 'multiple_choice_single', 'Professor Lane recommends that they cite', '[{"value":"A","label":"A. a government report"},{"value":"B","label":"B. the 2019 survey"},{"value":"C","label":"C. a textbook"},{"value":"D","label":"D. a beekeeping blog"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"the one I''d really recommend you cite is the 2019 survey of urban beekeepers."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e13c0097-6cfe-486e-b19a-7d2fbfca81f9', '9f65b0a2-7f5e-4c07-ba01-1901657329e8', 'matching_features', 'The city council report', '[{"value":"A","label":"A. reliable but out of date"},{"value":"B","label":"B. too general"},{"value":"C","label":"C. the most useful"},{"value":"D","label":"D. biased"},{"value":"E","label":"E. difficult to obtain"},{"value":"F","label":"F. too short"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"It''s very reliable, but it''s outdated now."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('01610ee5-8816-41e8-b604-335ab5bf0134', '9f65b0a2-7f5e-4c07-ba01-1901657329e8', 'matching_features', 'The beekeepers'' association website', '[{"value":"A","label":"A. reliable but out of date"},{"value":"B","label":"B. too general"},{"value":"C","label":"C. the most useful"},{"value":"D","label":"D. biased"},{"value":"E","label":"E. difficult to obtain"},{"value":"F","label":"F. too short"}]'::jsonb, ARRAY['D']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"That has lots of information, but it''s biased."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('8f737533-c906-4e45-9dcb-e70698f0d65c', '9f65b0a2-7f5e-4c07-ba01-1901657329e8', 'matching_features', 'The journal article by Moreno', '[{"value":"A","label":"A. reliable but out of date"},{"value":"B","label":"B. too general"},{"value":"C","label":"C. the most useful"},{"value":"D","label":"D. biased"},{"value":"E","label":"E. difficult to obtain"},{"value":"F","label":"F. too short"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"That''s definitely been the most useful."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('4498c1b8-086e-4ff5-829b-4ad2bd5f2954', '9f65b0a2-7f5e-4c07-ba01-1901657329e8', 'matching_features', 'The documentary', '[{"value":"A","label":"A. reliable but out of date"},{"value":"B","label":"B. too general"},{"value":"C","label":"C. the most useful"},{"value":"D","label":"D. biased"},{"value":"E","label":"E. difficult to obtain"},{"value":"F","label":"F. too short"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"It was enjoyable, but too general for us."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f54debaf-0b17-4214-a12b-c96cce72286b', '9f65b0a2-7f5e-4c07-ba01-1901657329e8', 'matching_features', 'The university''s hive records', '[{"value":"A","label":"A. reliable but out of date"},{"value":"B","label":"B. too general"},{"value":"C","label":"C. the most useful"},{"value":"D","label":"D. biased"},{"value":"E","label":"E. difficult to obtain"},{"value":"F","label":"F. too short"}]'::jsonb, ARRAY['E']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"We''d love to use those, but they''re hard to obtain."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('ecb021eb-e379-405c-8549-f7e7d0e3cefa', '38268768-a9a8-495c-b42d-ff90ca81df51', 4, NULL, NULL, NULL, 'Questions 31-40. Complete the notes below. Write ONE WORD ONLY for each answer.', '{"title":"Part 4 — Lecture on the history of glass"}'::jsonb, 3)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.item_group_scripts (group_id, transcript) values ('ecb021eb-e379-405c-8549-f7e7d0e3cefa', 'LECTURER: Good morning, everyone. In today''s lecture on the history of materials, we''re going to look at glass, which is one of the oldest manufactured materials and still one of the most important.
LECTURER: The earliest glass objects we know of were made in Mesopotamia, roughly four and a half thousand years ago. They weren''t windows or vessels. Glass was first used for beads, which were valued as highly as precious stones, and were often traded over long distances.
LECTURER: The basic recipe has changed surprisingly little since then. The main raw material is sand, which is mostly silica. On its own, silica melts only at an extremely high temperature, far beyond what early furnaces could reach. So glassmakers added plant ash, which lowers the melting temperature to a level that a wood fire can manage. Lime was also added to make the glass stable, so that it didn''t dissolve in water.
LECTURER: For centuries, glass was shaped by pouring it into moulds or winding it around a core, which was slow and expensive. The real breakthrough came from the Romans, who invented glass blowing around fifty BC. A worker could now inflate a bubble of molten glass on the end of a pipe and shape it in minutes, and glass vessels became cheap enough for ordinary households.
LECTURER: Let''s move forward to medieval Venice, which became the centre of European glassmaking. In 1291, the city''s glassmakers were ordered to move their furnaces to the island of Murano. The official reason was the risk of fire, since the city was built largely of wood and the furnaces burned day and night. But there was another benefit for the authorities: it was easier to keep the glassmakers'' secrets on a small island.
LECTURER: Those secrets were valuable. In the fifteenth century, Venetian workers developed an almost perfectly clear glass called cristallo. Ordinary glass had a greenish tint caused by iron in the sand, so they added manganese to remove the colour. Cristallo was so profitable that glassmakers were forbidden to leave the republic, and those who did could face severe punishment.
LECTURER: In England, the most important development came in the 1670s, when George Ravenscroft added lead oxide to the mixture. Lead glass was heavier and more brilliant than cristallo, and easier to cut, which is why it is still used for fine crystal today.
LECTURER: Flat glass for windows remained difficult to make until the twentieth century. Then, in the 1950s, Alastair Pilkington developed the float process. Molten glass is poured onto a bath of liquid tin. Because the glass floats on the surface of the tin, it spreads out into a perfectly flat, even sheet, with no need for grinding or polishing.
LECTURER: That brings us to the present. You might expect most glass to go into bottles and jars, or into screens for phones and computers. In fact, the largest share of glass produced today, by a considerable margin, is used in construction, mainly for windows and the glass walls of office buildings. And that''s what we''ll look at next week, when we discuss energy efficiency in buildings.')
on conflict (group_id) do update set transcript = excluded.transcript;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('24529116-8115-4f63-8084-8879c1924a57', 'ecb021eb-e379-405c-8549-f7e7d0e3cefa', 'note_completion', 'Early glass (Mesopotamia): first used for making ______', '[]'::jsonb, ARRAY['beads']::text[], 1, 'lenient', true, false, '{}'::jsonb, '"Glass was first used for beads, which were valued as highly as precious stones."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('55fa229a-8627-413f-a3b2-1935f7abb269', 'ecb021eb-e379-405c-8549-f7e7d0e3cefa', 'note_completion', 'Main raw material: ______ (mostly silica)', '[]'::jsonb, ARRAY['sand']::text[], 1, 'lenient', true, false, '{}'::jsonb, '"The main raw material is sand, which is mostly silica."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('cdda163c-6e93-4b60-937f-a1c05d5ee9ca', 'ecb021eb-e379-405c-8549-f7e7d0e3cefa', 'note_completion', 'Plant ash added to lower the melting ______', '[]'::jsonb, ARRAY['temperature', 'point']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Glassmakers "added plant ash, which lowers the melting temperature."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('4a064596-312f-4560-bf2c-7f70cd978654', 'ecb021eb-e379-405c-8549-f7e7d0e3cefa', 'note_completion', 'Romans: invented glass ______ around 50 BC', '[]'::jsonb, ARRAY['blowing']::text[], 1, 'lenient', true, false, '{}'::jsonb, '"the Romans, who invented glass blowing around fifty BC."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('420bbaf2-0ddc-4968-b60a-7909e7d3c099', 'ecb021eb-e379-405c-8549-f7e7d0e3cefa', 'note_completion', 'Venice, 1291: furnaces moved to Murano because of the risk of ______', '[]'::jsonb, ARRAY['fire', 'fires']::text[], 1, 'lenient', true, false, '{}'::jsonb, '"The official reason was the risk of fire."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('0fcb44b4-ebdc-45e4-ba41-93a634916044', 'ecb021eb-e379-405c-8549-f7e7d0e3cefa', 'note_completion', 'Cristallo: ______ added to remove the green colour', '[]'::jsonb, ARRAY['manganese']::text[], 1, 'lenient', true, false, '{}'::jsonb, '"they added manganese to remove the colour."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('88de8d06-be82-4dcc-97ac-d283eb4dba61', 'ecb021eb-e379-405c-8549-f7e7d0e3cefa', 'note_completion', 'Glassmakers were not allowed to ______ the republic', '[]'::jsonb, ARRAY['leave']::text[], 1, 'lenient', true, false, '{}'::jsonb, '"glassmakers were forbidden to leave the republic."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('0b7d9529-3e95-4708-ac8e-574cf5d2b586', 'ecb021eb-e379-405c-8549-f7e7d0e3cefa', 'note_completion', 'Ravenscroft (1670s): added ______ oxide', '[]'::jsonb, ARRAY['lead']::text[], 1, 'lenient', true, false, '{}'::jsonb, '"George Ravenscroft added lead oxide to the mixture."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('d90447f3-69a0-4404-8e90-b9e0487340cb', 'ecb021eb-e379-405c-8549-f7e7d0e3cefa', 'note_completion', 'Float process (1950s): molten glass poured onto liquid ______', '[]'::jsonb, ARRAY['tin']::text[], 1, 'lenient', true, false, '{}'::jsonb, '"Molten glass is poured onto a bath of liquid tin."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('9b6b27fa-5968-46b9-8f36-c82a58975b22', 'ecb021eb-e379-405c-8549-f7e7d0e3cefa', 'note_completion', 'Today the largest share of glass is used in ______', '[]'::jsonb, ARRAY['construction', 'buildings']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Not bottles or screens: "the largest share of glass produced today ... is used in construction."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)
values ('6c0fa702-3e73-4d9c-9392-ef187f0345c2', 'be1b01a1-baba-43ea-a644-82c9fca21664', 'reading', 3600, 40, NULL, 1)
on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('ecd61c36-ef3b-4ba2-8bb3-edff638c2d61', '6c0fa702-3e73-4d9c-9392-ef187f0345c2', 1, 'Few objects are as ordinary as the pencil, and few have a history so closely tied to war, smuggling and industrial secrecy. The story begins in the 1560s in Borrowdale, a remote valley in the north of England, where a violent storm is said to have uprooted a large tree and exposed a seam of a black, greasy mineral beneath its roots. Local shepherds soon discovered that the substance left a dark mark that did not wash off in the rain, and they used it to mark their sheep. They called it wad, or black lead, in the mistaken belief that it was a form of lead. It was in fact graphite, a pure form of carbon, and the Borrowdale deposit remains the only one ever found in which the graphite was solid and pure enough to be sawn directly into sticks.

The mineral was soon found to have more serious uses. It could line the moulds used for casting cannonballs, producing smoother and rounder shot, and its value rose accordingly. The mine came under the control of the Crown, which limited extraction to a few weeks each year in order to keep prices high, and the entrance was guarded by armed men. In 1752, Parliament made the theft of wad a crime punishable by hard labour or transportation to the colonies. Despite this, a flourishing black market grew up around the mine, and stolen graphite was sold in the inns of the nearby town of Keswick.

The earliest pencils were simply sticks of graphite wrapped in string or sheepskin to keep the user''s fingers clean. Before long, craftsmen began enclosing the graphite in wood. A groove was cut in a strip of juniper, the stick was laid inside, and a second strip was glued over the top. The basic method of placing the core between two halves of wood is still used today, although juniper has long since given way to cedar, which is softer and easier to sharpen.

England''s near-monopoly on solid graphite created a problem for other countries, and the problem became acute in the 1790s, when France found itself at war with Britain and cut off from its supply. The French government turned to Nicolas-Jacques Conté, an engineer and inventor, and asked him to find a substitute. Conté''s solution, patented in 1795, was to grind impure graphite into a fine powder and mix it with clay and water. The resulting paste was pressed into long, thin moulds and then fired in a kiln at a high temperature. Once cooled, the rods were waxed so that they would glide smoothly across the paper.

Conté''s process was more than a wartime improvisation. By varying the proportion of clay to graphite, he found that he could control the hardness of the finished core: more clay produced a harder, paler line, while more graphite produced a softer, darker one. This is the origin of the grading system that is still printed on pencils today, in which H stands for hard and B for black. Because the process could use powdered graphite of almost any quality, it also freed pencil makers from their dependence on Borrowdale. By the middle of the nineteenth century the Cumbrian mine was nearly exhausted, and it closed for good in 1891.

The centre of the industry then shifted to Germany, and particularly to the region around Nuremberg, where families such as the Fabers and the Staedtlers established factories that are still in operation. In the United States, meanwhile, the writer Henry David Thoreau worked for a time in his father''s pencil business in Massachusetts, where he developed an improved method of grinding graphite that made the family''s pencils among the best in the country. Mass production arrived in the second half of the century, when machines were introduced that could cut the grooves in the wood and shape finished pencils far faster than any craftsman.

One persistent feature of the pencil, its yellow paint, dates from the 1890s. The finest graphite of the period came from a mine in Siberia, near the border with China, and one manufacturer painted its premium pencils yellow, a colour associated with Chinese imperial authority, to advertise their origin. Rival companies quickly copied the colour so that their own pencils would appear to be of the same quality, and in North America yellow remains by far the most common colour for pencils sold today.

The rubber eraser attached to the end of many pencils has a more contested history. An American stationer, Hymen Lipman, patented the idea in 1858, but the patent was later declared invalid by the Supreme Court on the grounds that it merely combined two existing objects without creating anything new. Perhaps because of this, pencils sold in much of Europe are still commonly made without one.

For all the changes in manufacturing, the pencil has proved remarkably resistant to replacement. Ballpoint pens, typewriters and computers have each been expected to make it obsolete, yet billions are still produced every year. Architects, carpenters and artists continue to prefer it, partly because a pencil line can be erased and partly because it works at any angle and in any temperature, which explains why pencils were carried on early space missions. A tool that began as a shepherd''s marker has outlived almost every technology that threatened it.', NULL, NULL, 'You should spend about 20 minutes on Questions 1-13, which are based on Reading Passage 1 below.', '{"title":"Passage 1 — The making of the modern pencil"}'::jsonb, 0)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('2e0a04a3-bd41-4892-943c-3ac17a57edd3', 'ecd61c36-ef3b-4ba2-8bb3-edff638c2d61', 'true_false_notgiven', 'The graphite at Borrowdale was first used by shepherds.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['TRUE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Shepherds "used it to mark their sheep" once they found it "left a dark mark that did not wash off in the rain."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('b004f3d7-34aa-475f-8757-05cd72cc07e3', 'ecd61c36-ef3b-4ba2-8bb3-edff638c2d61', 'true_false_notgiven', 'People in the sixteenth century correctly identified wad as a form of carbon.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['FALSE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'They called it black lead "in the mistaken belief that it was a form of lead. It was in fact graphite."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('4640c377-f9bb-4bfa-a708-d24fb13a7868', 'ecd61c36-ef3b-4ba2-8bb3-edff638c2d61', 'true_false_notgiven', 'The Crown allowed the mine to be worked throughout the year.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['FALSE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The Crown "limited extraction to a few weeks each year in order to keep prices high."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('b0d58938-a329-4a10-a16c-6ebc445f54b4', 'ecd61c36-ef3b-4ba2-8bb3-edff638c2d61', 'true_false_notgiven', 'Most of the stolen graphite was eventually exported to France.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NOT GIVEN']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The passage says only that stolen graphite "was sold in the inns of the nearby town of Keswick"; its final destination is not mentioned.', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('2929fd5f-e40f-4d30-a6a3-aa917f3fefa4', 'ecd61c36-ef3b-4ba2-8bb3-edff638c2d61', 'true_false_notgiven', 'Cedar replaced juniper because it is easier to sharpen.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['TRUE']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"juniper has long since given way to cedar, which is softer and easier to sharpen."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('d0d817d1-eef8-40c1-852c-5ab4bddb8182', 'ecd61c36-ef3b-4ba2-8bb3-edff638c2d61', 'table_completion', 'Table — 1752: theft of wad punishable by hard labour or ______ to the colonies', '[]'::jsonb, ARRAY['transportation']::text[], 1, 'lenient', true, false, '{}'::jsonb, '"Parliament made the theft of wad a crime punishable by hard labour or transportation to the colonies."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('855fcc55-8b6e-4367-9de8-d732ba88c406', 'ecd61c36-ef3b-4ba2-8bb3-edff638c2d61', 'table_completion', 'Table — 1795: substitute process patented by Conté, a French ______ and inventor', '[]'::jsonb, ARRAY['engineer']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The French government turned to "Nicolas-Jacques Conté, an engineer and inventor", whose solution was "patented in 1795".', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('2af20366-2d5b-4f16-ba97-ec629ca1e901', 'ecd61c36-ef3b-4ba2-8bb3-edff638c2d61', 'table_completion', 'Table — 1858: eraser patented by Lipman, later ruled invalid by the Supreme ______', '[]'::jsonb, ARRAY['Court']::text[], 1, 'lenient', true, false, '{}'::jsonb, '"the patent was later declared invalid by the Supreme Court."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('01cb41c4-429d-438d-9711-e5b3dbb56f20', 'ecd61c36-ef3b-4ba2-8bb3-edff638c2d61', 'table_completion', 'Table — 1891: the ______ mine closed permanently', '[]'::jsonb, ARRAY['Borrowdale', 'Cumbrian']::text[], 1, 'lenient', true, false, '{}'::jsonb, '"the Cumbrian mine was nearly exhausted, and it closed for good in 1891."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('c1b43931-0c2d-42a6-b1b4-c5c9357fe1a2', 'ecd61c36-ef3b-4ba2-8bb3-edff638c2d61', 'flowchart_completion', 'Flow-chart step 1: impure graphite is ground into a fine ______', '[]'::jsonb, ARRAY['powder']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Conté would "grind impure graphite into a fine powder."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('77c8a701-296f-469b-beb9-e735fdd25cbd', 'ecd61c36-ef3b-4ba2-8bb3-edff638c2d61', 'flowchart_completion', 'Flow-chart step 2: the powder is mixed with ______ and water', '[]'::jsonb, ARRAY['clay']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The powder was mixed "with clay and water."', 10)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('872018cc-9a5f-49ae-a1c6-62f9c3081270', 'ecd61c36-ef3b-4ba2-8bb3-edff638c2d61', 'flowchart_completion', 'Flow-chart step 3: the paste is pressed into moulds and fired in a ______', '[]'::jsonb, ARRAY['kiln']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The paste "was pressed into long, thin moulds and then fired in a kiln."', 11)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('cb2678d1-bda7-46dc-bcb3-2c301b1bb67a', 'ecd61c36-ef3b-4ba2-8bb3-edff638c2d61', 'flowchart_completion', 'Flow-chart step 4: the cooled rods are coated with ______ so they glide smoothly', '[]'::jsonb, ARRAY['wax']::text[], 1, 'lenient', true, false, '{}'::jsonb, '"the rods were waxed so that they would glide smoothly across the paper."', 12)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('a349b76c-b08f-4075-9e33-640e3002224f', '6c0fa702-3e73-4d9c-9392-ef187f0345c2', 2, 'A. Sailors have known for thousands of years that seawater can be made drinkable. Aristotle described how the vapour from boiling seawater condenses into fresh water, and by the nineteenth century many ocean-going ships carried small stills for emergencies. What held the technology back was not understanding but energy: boiling enough water to supply a town requires burning vast quantities of fuel. Only in the second half of the twentieth century, when oil-rich but water-poor states began building large coastal plants, did desalination become a practical source of public water.

B. Two broad methods dominate the industry. The older, thermal desalination, is a refined version of the ship''s still: seawater is heated, often in a series of chambers at progressively lower pressures, and the vapour is condensed and collected. The newer method, reverse osmosis, uses no heat at all. Instead, seawater is forced at high pressure through membranes whose pores are small enough to let water molecules pass while holding back the dissolved salt. Thermal plants remain common in the Gulf, where they are often built beside power stations and use their waste heat, but almost all plants built in recent decades use membranes. Membranes have their own difficulties: they are easily blocked by algae, sand and other particles, so the seawater must first be filtered carefully, and the membranes themselves must be cleaned regularly and eventually replaced.

C. The shift to reverse osmosis has transformed the economics of desalination. Early membrane plants consumed large amounts of electricity simply to maintain the pressure required. The decisive innovation was the energy recovery device, which captures the pressure of the concentrated brine leaving the membranes and transfers it to the incoming seawater. Together with better membranes, such devices have cut the energy needed to produce a cubic metre of fresh water by roughly three-quarters since the 1970s. In Israel, the Sorek plant, which opened in 2013, produces water at a price that would have seemed impossible a generation earlier, and the country now obtains most of its household water from the sea.

D. That cost is still higher than that of pumping water from a river or an aquifer, and for many governments desalination has traditionally been the option of last resort, built only when everything else has failed. Australia offers a cautionary example. During a severe drought in the early 2000s, several of its largest cities commissioned desalination plants at great expense. By the time the plants were completed, the rains had returned and reservoirs were full, and some plants were left idle for years while consumers continued to pay for them through their water bills. Critics argued that money would have been better spent on reducing leaks and encouraging households to use less. Supporters replied that a plant that is not needed this year may be indispensable in the next drought, and that its value lies precisely in being independent of the weather.

E. The most serious environmental objection concerns what is left behind. For every litre of fresh water a typical plant produces, it discharges roughly one and a half litres of brine, a concentrated salt solution that may also contain chemicals used to clean the membranes. Because brine is denser than seawater, it tends to sink and spread across the sea floor, where it can harm organisms that are unable to move away. Saudi Arabia, which operates some of the largest plants in the world, discharges much of its brine into the shallow and enclosed waters of the Gulf, where scientists have warned that salinity is rising. Well-designed outlets, which spread the brine through many small openings so that it mixes quickly, can reduce the damage considerably, but they add to the cost.

F. A growing number of researchers argue that brine should be treated not as waste but as a resource. It contains magnesium, lithium and other valuable minerals in higher concentrations than ordinary seawater, and pilot projects in several countries are attempting to extract them profitably. In Spain, where desalinated water is widely used to irrigate greenhouse crops in the dry south-east, engineers have experimented with blending brine back into the processing of salt for sale. None of these schemes is yet operating at scale, and it remains to be seen whether they can be made economic. But if they succeed, the most troublesome by-product of desalination could become one of its sources of income.

G. Whether desalination comes to be seen as a routine part of a water supply, rather than an emergency measure, will depend less on engineering than on politics. A plant takes years to plan and build, and its benefits are greatest in precisely the dry years that are hardest to predict. For a growing number of coastal cities facing a less predictable climate, the question is no longer whether they can afford to build one, but whether they can afford not to.', NULL, NULL, 'You should spend about 20 minutes on Questions 14-26, which are based on Reading Passage 2 below.', '{"title":"Passage 2 — Drinking the sea"}'::jsonb, 1)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('b5d7f422-3ee4-4e12-9d39-227d32563026', 'a349b76c-b08f-4075-9e33-640e3002224f', 'matching_headings', 'Paragraph A — choose the most suitable heading.', '[{"value":"i","label":"i. An old idea made practical"},{"value":"ii","label":"ii. A problem left behind in the sea"},{"value":"iii","label":"iii. The falling price of a once-costly process"},{"value":"iv","label":"iv. Why rainfall is no longer reliable"},{"value":"v","label":"v. Using what was once thrown away"},{"value":"vi","label":"vi. A last resort or a first choice?"},{"value":"vii","label":"vii. Two ways of separating salt from water"},{"value":"viii","label":"viii. Opposition from farmers"}]'::jsonb, ARRAY['i']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph A says the idea was known to Aristotle, but "Only in the second half of the twentieth century ... did desalination become a practical source of public water."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('a8d429a5-aae7-480b-8a8f-b19ba2a3e50b', 'a349b76c-b08f-4075-9e33-640e3002224f', 'matching_headings', 'Paragraph B — choose the most suitable heading.', '[{"value":"i","label":"i. An old idea made practical"},{"value":"ii","label":"ii. A problem left behind in the sea"},{"value":"iii","label":"iii. The falling price of a once-costly process"},{"value":"iv","label":"iv. Why rainfall is no longer reliable"},{"value":"v","label":"v. Using what was once thrown away"},{"value":"vi","label":"vi. A last resort or a first choice?"},{"value":"vii","label":"vii. Two ways of separating salt from water"},{"value":"viii","label":"viii. Opposition from farmers"}]'::jsonb, ARRAY['vii']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph B begins "Two broad methods dominate the industry" and describes thermal desalination and reverse osmosis.', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('67a02fdc-4c05-481a-a7ee-10845c91e710', 'a349b76c-b08f-4075-9e33-640e3002224f', 'matching_headings', 'Paragraph C — choose the most suitable heading.', '[{"value":"i","label":"i. An old idea made practical"},{"value":"ii","label":"ii. A problem left behind in the sea"},{"value":"iii","label":"iii. The falling price of a once-costly process"},{"value":"iv","label":"iv. Why rainfall is no longer reliable"},{"value":"v","label":"v. Using what was once thrown away"},{"value":"vi","label":"vi. A last resort or a first choice?"},{"value":"vii","label":"vii. Two ways of separating salt from water"},{"value":"viii","label":"viii. Opposition from farmers"}]'::jsonb, ARRAY['iii']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph C explains how the energy needed has been cut "by roughly three-quarters since the 1970s", lowering the price.', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('880a6957-20d7-491c-abaa-842874b6c4f0', 'a349b76c-b08f-4075-9e33-640e3002224f', 'matching_headings', 'Paragraph D — choose the most suitable heading.', '[{"value":"i","label":"i. An old idea made practical"},{"value":"ii","label":"ii. A problem left behind in the sea"},{"value":"iii","label":"iii. The falling price of a once-costly process"},{"value":"iv","label":"iv. Why rainfall is no longer reliable"},{"value":"v","label":"v. Using what was once thrown away"},{"value":"vi","label":"vi. A last resort or a first choice?"},{"value":"vii","label":"vii. Two ways of separating salt from water"},{"value":"viii","label":"viii. Opposition from farmers"}]'::jsonb, ARRAY['vi']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph D describes desalination as "the option of last resort" and the argument that "its value lies precisely in being independent of the weather."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e155f081-642b-45dd-bc49-d67c093fbc28', 'a349b76c-b08f-4075-9e33-640e3002224f', 'matching_headings', 'Paragraph E — choose the most suitable heading.', '[{"value":"i","label":"i. An old idea made practical"},{"value":"ii","label":"ii. A problem left behind in the sea"},{"value":"iii","label":"iii. The falling price of a once-costly process"},{"value":"iv","label":"iv. Why rainfall is no longer reliable"},{"value":"v","label":"v. Using what was once thrown away"},{"value":"vi","label":"vi. A last resort or a first choice?"},{"value":"vii","label":"vii. Two ways of separating salt from water"},{"value":"viii","label":"viii. Opposition from farmers"}]'::jsonb, ARRAY['ii']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph E concerns "what is left behind": brine that "tends to sink and spread across the sea floor."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('741c96e4-eded-4392-8883-b36ca8fb07b0', 'a349b76c-b08f-4075-9e33-640e3002224f', 'matching_headings', 'Paragraph F — choose the most suitable heading.', '[{"value":"i","label":"i. An old idea made practical"},{"value":"ii","label":"ii. A problem left behind in the sea"},{"value":"iii","label":"iii. The falling price of a once-costly process"},{"value":"iv","label":"iv. Why rainfall is no longer reliable"},{"value":"v","label":"v. Using what was once thrown away"},{"value":"vi","label":"vi. A last resort or a first choice?"},{"value":"vii","label":"vii. Two ways of separating salt from water"},{"value":"viii","label":"viii. Opposition from farmers"}]'::jsonb, ARRAY['v']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph F argues "brine should be treated not as waste but as a resource."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('96eafe3d-6f8f-4a3d-a040-4ab4410f065f', 'a349b76c-b08f-4075-9e33-640e3002224f', 'matching_features', 'Which country obtains most of its household water from desalination?', '[{"value":"A","label":"A. Saudi Arabia"},{"value":"B","label":"B. Israel"},{"value":"C","label":"C. Australia"},{"value":"D","label":"D. Spain"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"the country now obtains most of its household water from the sea" refers to Israel.', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('19e83695-2963-4105-a891-1ac06fbc9051', 'a349b76c-b08f-4075-9e33-640e3002224f', 'matching_features', 'Which country built plants that then stood unused for a long period?', '[{"value":"A","label":"A. Saudi Arabia"},{"value":"B","label":"B. Israel"},{"value":"C","label":"C. Australia"},{"value":"D","label":"D. Spain"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'In Australia "some plants were left idle for years."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f6a41438-ac18-4a02-84b0-bcbb2fb293da', 'a349b76c-b08f-4075-9e33-640e3002224f', 'matching_features', 'Which country uses desalinated water for farming?', '[{"value":"A","label":"A. Saudi Arabia"},{"value":"B","label":"B. Israel"},{"value":"C","label":"C. Australia"},{"value":"D","label":"D. Spain"}]'::jsonb, ARRAY['D']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"In Spain ... desalinated water is widely used to irrigate greenhouse crops."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('513d5c88-25f6-434a-a09e-8d16f6e4376d', 'a349b76c-b08f-4075-9e33-640e3002224f', 'matching_features', 'In which country has brine disposal raised concerns about the sea becoming saltier?', '[{"value":"A","label":"A. Saudi Arabia"},{"value":"B","label":"B. Israel"},{"value":"C","label":"C. Australia"},{"value":"D","label":"D. Spain"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Saudi Arabia discharges brine into the Gulf, "where scientists have warned that salinity is rising."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('315aa3f7-01d8-4b61-b1cc-6975507d21ad', 'a349b76c-b08f-4075-9e33-640e3002224f', 'sentence_completion', 'Thermal plants in the Gulf often use the waste ______ from nearby power stations.', '[]'::jsonb, ARRAY['heat']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'They are "often built beside power stations and use their waste heat."', 10)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('1eaaf4ca-5a7e-4cf8-813c-37c67329be83', 'a349b76c-b08f-4075-9e33-640e3002224f', 'sentence_completion', 'An energy recovery device transfers the pressure of the outgoing ______ to the incoming seawater.', '[]'::jsonb, ARRAY['brine', 'concentrated brine']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'It "captures the pressure of the concentrated brine leaving the membranes and transfers it to the incoming seawater."', 11)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('9a2b46c5-8d97-4d8c-8e5a-11851c425328', 'a349b76c-b08f-4075-9e33-640e3002224f', 'sentence_completion', 'Brine sinks to the sea floor because it is ______ than seawater.', '[]'::jsonb, ARRAY['denser']::text[], 2, 'lenient', true, false, '{}'::jsonb, '"Because brine is denser than seawater, it tends to sink."', 12)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('39d69555-e8c4-4a9a-bad3-7e101fdcfa1d', '6c0fa702-3e73-4d9c-9392-ef187f0345c2', 3, 'Boredom has never enjoyed a good reputation. Moralists have treated it as a symptom of idleness, teachers as a failure of discipline, and parents as a problem to be solved, ideally by someone else. For most of the twentieth century psychologists showed little interest in it either, perhaps because it seemed too trivial and too familiar to need explaining. That neglect has ended. Over the past two decades boredom has become a serious subject of research, and the picture that has emerged is more interesting, and in some respects more troubling, than its reputation would suggest.

The first task was to define it. Researchers now generally describe boredom as the uncomfortable experience of wanting to engage in satisfying activity while being unable to do so. This definition separates boredom from simple relaxation, which is pleasant, and from apathy, in which the desire to act is absent altogether. The bored person wants something to do; what is missing is a task that can absorb their attention. Situations that produce boredom tend to share two features: they are monotonous, and they are beyond the person''s control. Measuring it, however, has proved harder than defining it. Early studies relied on questionnaires asking people how easily they became bored, which revealed stable differences between individuals but said little about particular moments. More recent work asks participants to report their feelings at random points during the day, often through an app on their phone, and suggests that most adults feel bored for several hours each week, most often while waiting, travelling or doing housework.

Some of the most widely discussed findings concern how far people will go to escape it. In a series of studies published in 2014, participants were left alone in an empty room for between six and fifteen minutes with nothing to do but think. The only object in the room was a button that delivered a mild electric shock, and every participant had already experienced the shock and said they would pay money to avoid it. Nevertheless, two-thirds of the men and a quarter of the women pressed the button at least once during the session. One man pressed it 190 times. The researchers concluded that many people find their own thoughts so unrewarding that even an unpleasant stimulus is preferable to none at all.

Results like these have encouraged the view that boredom is simply harmful, and there is evidence to support it. People who report being bored frequently are more likely to eat when they are not hungry, to take risks while driving, and to suffer from depression. Among students, boredom in lessons is a strong predictor of poor results, more so than anxiety. It is tempting, therefore, to see boredom as a condition to be eliminated, and the modern smartphone, which can fill any spare moment with news, games or messages, appears to offer a cure.

A growing number of researchers argue that this conclusion is mistaken. On their account, boredom functions much as pain does: it is unpleasant precisely so that we will pay attention to it. Pain warns us that the body is being damaged; boredom warns us that our current activity is not worth continuing and pushes us to look for a better one. Seen in this way, boredom is not a malfunction but a signal, and the problem lies not in the feeling itself but in how we respond to it. Eating, gambling and reckless driving are poor responses; seeking a more meaningful task is a good one.

There is also some evidence that boredom can foster creativity. In one frequently cited experiment, participants who had first spent fifteen minutes copying numbers from a telephone directory went on to produce more ideas when asked to think of uses for a pair of plastic cups than participants who had moved straight to the creative task. The explanation offered was that a dull task allows the mind to wander, and that wandering thoughts are more likely to make unexpected connections. However, attempts to repeat the experiment have produced mixed results, and the size of the effect, if it exists, appears to be modest.

What does seem clear is that constantly relieving boredom may come at a cost. If every idle moment is filled by a screen, the signal that boredom provides is never heard, and the opportunity to decide what we actually want to do is lost. Some researchers suspect that heavy smartphone use may even lower people''s tolerance for ordinary periods of low stimulation, so that they become bored more easily, although this has yet to be firmly established.

None of this means that boredom should be welcomed for its own sake, or that teachers should deliberately make lessons dull. Chronic boredom, the kind experienced by people trapped in monotonous jobs or confined to hospital beds, has real and lasting costs. The point is rather that the brief, everyday boredom of a delayed train or a quiet afternoon need not be treated as an emergency. It may be telling us something worth hearing.', NULL, NULL, 'You should spend about 20 minutes on Questions 27-40, which are based on Reading Passage 3 below.', '{"title":"Passage 3 — The uses of boredom"}'::jsonb, 2)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('48244c1d-16c7-40f0-84e0-2336e5bdc7db', '39d69555-e8c4-4a9a-bad3-7e101fdcfa1d', 'yes_no_notgiven', 'Psychologists in the twentieth century paid boredom little attention.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['YES']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"For most of the twentieth century psychologists showed little interest in it either."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('1cf2abbc-8e11-4cd0-8ffa-0fa7b8defd92', '39d69555-e8c4-4a9a-bad3-7e101fdcfa1d', 'yes_no_notgiven', 'Relaxation and boredom are essentially the same experience.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NO']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The definition "separates boredom from simple relaxation, which is pleasant."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('87a447f6-47ed-4a64-b624-ec9096529705', '39d69555-e8c4-4a9a-bad3-7e101fdcfa1d', 'yes_no_notgiven', 'Boredom is more common today than it was a century ago.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NOT GIVEN']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The passage never compares how common boredom is now with the past.', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('466c0a07-beea-4254-882e-f7d4fddfd9e6', '39d69555-e8c4-4a9a-bad3-7e101fdcfa1d', 'yes_no_notgiven', 'For students, boredom predicts poor results more strongly than anxiety does.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['YES']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"boredom in lessons is a strong predictor of poor results, more so than anxiety."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('b625d547-62e5-49f3-b143-b3cc3fc3107e', '39d69555-e8c4-4a9a-bad3-7e101fdcfa1d', 'yes_no_notgiven', 'Teachers should make some lessons dull on purpose.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NO']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"None of this means ... that teachers should deliberately make lessons dull."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('9adc6fd2-ac3d-4122-9256-62a3611027d6', '39d69555-e8c4-4a9a-bad3-7e101fdcfa1d', 'multiple_choice_single', 'According to the passage, situations that cause boredom are typically', '[{"value":"A","label":"A. new and confusing"},{"value":"B","label":"B. repetitive and outside the person''s control"},{"value":"C","label":"C. pleasant but undemanding"},{"value":"D","label":"D. stressful and tiring"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Such situations "are monotonous, and they are beyond the person''s control."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('6978f477-e3c3-4da3-a3da-c0a17d1587df', '39d69555-e8c4-4a9a-bad3-7e101fdcfa1d', 'multiple_choice_single', 'Before the 2014 experiment began, participants', '[{"value":"A","label":"A. were told they could leave at any time"},{"value":"B","label":"B. had been given a mild shock and said they would pay to avoid it"},{"value":"C","label":"C. were offered money for each button press"},{"value":"D","label":"D. had spent fifteen minutes copying numbers"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"every participant had already experienced the shock and said they would pay money to avoid it."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('a3c453ac-76f7-411b-b829-579450630518', '39d69555-e8c4-4a9a-bad3-7e101fdcfa1d', 'multiple_choice_single', 'The writer compares boredom to pain in order to show that boredom', '[{"value":"A","label":"A. is a sign of physical illness"},{"value":"B","label":"B. can be ignored without consequence"},{"value":"C","label":"C. has a useful warning function"},{"value":"D","label":"D. is felt more strongly by some people"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"boredom warns us that our current activity is not worth continuing", just as "Pain warns us that the body is being damaged."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('7f1dadee-c370-448c-b7b9-426735868037', '39d69555-e8c4-4a9a-bad3-7e101fdcfa1d', 'multiple_choice_single', 'What does the writer say about the experiment with the plastic cups?', '[{"value":"A","label":"A. Its findings have not been consistently repeated."},{"value":"B","label":"B. It proved that boredom improves creativity."},{"value":"C","label":"C. It used too few participants."},{"value":"D","label":"D. Its participants were already bored before it began."}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"attempts to repeat the experiment have produced mixed results, and the size of the effect ... appears to be modest."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e7760d1e-5ab3-45ae-a2fb-9bf105f78795', '39d69555-e8c4-4a9a-bad3-7e101fdcfa1d', 'summary_completion', 'Summary: Frequent boredom has been linked to eating without hunger, risky driving and ______.', '[]'::jsonb, ARRAY['depression']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Bored people are more likely "to take risks while driving, and to suffer from depression."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('1c9f00f9-8b84-457b-b23f-85d87ca4f350', '39d69555-e8c4-4a9a-bad3-7e101fdcfa1d', 'summary_completion', 'Summary: The ______ seems to offer a way to fill every spare moment.', '[]'::jsonb, ARRAY['smartphone']::text[], 1, 'lenient', true, false, '{}'::jsonb, '"the modern smartphone, which can fill any spare moment ... appears to offer a cure."', 10)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('2a4b1ced-e282-42d5-98f8-7c8d85fd398a', '39d69555-e8c4-4a9a-bad3-7e101fdcfa1d', 'summary_completion', 'Summary: A dull task may let the mind ______, making unexpected connections more likely.', '[]'::jsonb, ARRAY['wander']::text[], 1, 'lenient', true, false, '{}'::jsonb, '"a dull task allows the mind to wander."', 11)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('5a19846f-a770-4eff-93ce-0a754bf9da26', '39d69555-e8c4-4a9a-bad3-7e101fdcfa1d', 'matching_sentence_endings', 'Many participants in the empty room gave themselves electric shocks', '[{"value":"A","label":"A. because it signals that an activity is not worth continuing."},{"value":"B","label":"B. because they had nothing else to occupy them."},{"value":"C","label":"C. unless the task is made more difficult."},{"value":"D","label":"D. even when they had been warned in advance."},{"value":"E","label":"E. which explains why it is rarely studied."}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'They had "nothing to do but think", and "even an unpleasant stimulus is preferable to none at all."', 12)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('c8ab3914-8874-420d-a8f1-59e7da1756d5', '39d69555-e8c4-4a9a-bad3-7e101fdcfa1d', 'matching_sentence_endings', 'Some researchers argue that boredom is useful', '[{"value":"A","label":"A. because it signals that an activity is not worth continuing."},{"value":"B","label":"B. because they had nothing else to occupy them."},{"value":"C","label":"C. unless the task is made more difficult."},{"value":"D","label":"D. even when they had been warned in advance."},{"value":"E","label":"E. which explains why it is rarely studied."}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"boredom warns us that our current activity is not worth continuing and pushes us to look for a better one."', 13)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)
values ('280ad2d8-747a-4d24-868e-251f01034f18', 'be1b01a1-baba-43ea-a644-82c9fca21664', 'writing', 3600, 2, NULL, 2)
on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('effef79d-779e-4319-a45c-99d15496316b', '280ad2d8-747a-4d24-868e-251f01034f18', 1, 'The graph below shows the percentage of electricity generated from renewable sources in three countries between 2000 and 2020.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.', NULL, '/mock-images/academic-2-task1.svg', 'You should spend about 20 minutes on this task. Write at least 150 words.', '{"image_caption":"Share of electricity generated from renewable sources in three countries, 2000-2020","title":"Task 1"}'::jsonb, 0)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('0fda3d32-afbf-47e8-a3cf-297534172614', 'effef79d-779e-4319-a45c-99d15496316b', 'short_answer', 'Task 1 response', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('4fae6da6-5e9a-4063-a0ee-02e0a8ad80bc', '280ad2d8-747a-4d24-868e-251f01034f18', 2, 'In many countries, a growing number of people now work from home for some or all of the week.

Do the advantages of this development outweigh the disadvantages?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.', NULL, NULL, 'You should spend about 40 minutes on this task. Write at least 250 words.', '{"title":"Task 2"}'::jsonb, 1)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('0a396a5f-39c9-4326-8442-a20d7abf3537', '4fae6da6-5e9a-4063-a0ee-02e0a8ad80bc', 'short_answer', 'Task 2 response', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)
values ('35f25c3f-9204-44e8-877f-7cca235d81c6', 'be1b01a1-baba-43ea-a644-82c9fca21664', 'speaking', 840, 12, NULL, 3)
on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('fb6a3ef5-7b41-4a14-9aa1-35fe9b30d916', '35f25c3f-9204-44e8-877f-7cca235d81c6', 1, NULL, NULL, NULL, 'The examiner asks about yourself, your home, work or studies and other familiar topics. 4-5 minutes.', '{"title":"Part 1 — Introduction and familiar topics"}'::jsonb, 0)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e5e54278-1a9b-40cd-b214-613a670db92c', 'fb6a3ef5-7b41-4a14-9aa1-35fe9b30d916', 'short_answer', 'Let''s talk about your work or studies. What do you do?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('ce9490ef-2e07-47ed-951f-3c41bdcac751', 'fb6a3ef5-7b41-4a14-9aa1-35fe9b30d916', 'short_answer', 'What do you find most interesting about it?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('922c3f5c-809c-4710-9ae5-ba7a32b398dd', 'fb6a3ef5-7b41-4a14-9aa1-35fe9b30d916', 'short_answer', 'Is there anything you would like to change about it?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('10c840e5-bcc7-4b35-a8a1-f179c5daff93', 'fb6a3ef5-7b41-4a14-9aa1-35fe9b30d916', 'short_answer', 'Now let''s talk about food. What kind of food do you enjoy cooking or eating?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('d860ff74-147a-415c-8348-1da17b8183c4', 'fb6a3ef5-7b41-4a14-9aa1-35fe9b30d916', 'short_answer', 'Did you eat the same things when you were a child?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('25fb4ce2-1786-4c76-89c9-1a3a7f0ac6bb', 'fb6a3ef5-7b41-4a14-9aa1-35fe9b30d916', 'short_answer', 'Do you prefer eating at home or in restaurants? Why?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('b61f1fc8-0f3d-437e-b0fd-8c3e7159d559', '35f25c3f-9204-44e8-877f-7cca235d81c6', 2, 'Describe a place you visited that was very different from where you live.

You should say:
  •  where the place was
  •  when and why you went there
  •  what was different about it

and explain how you felt about the experience.', NULL, NULL, 'You have one minute to prepare. You may make notes. Then talk for one to two minutes. The examiner will tell you when to stop.', '{"title":"Part 2 — Individual long turn"}'::jsonb, 1)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('12040957-3c35-452a-b3e6-0a86fd3239fd', 'b61f1fc8-0f3d-437e-b0fd-8c3e7159d559', 'short_answer', 'Long turn response', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('bdb16a56-cfc3-4f06-bf5c-c7ca7a98323f', '35f25c3f-9204-44e8-877f-7cca235d81c6', 3, NULL, NULL, NULL, 'The examiner asks further questions connected to the topic in Part 2. 4-5 minutes.', '{"title":"Part 3 — Two-way discussion"}'::jsonb, 2)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('9ed22582-4bf8-4fb2-b55a-03aea1f406af', 'bdb16a56-cfc3-4f06-bf5c-c7ca7a98323f', 'short_answer', 'Why do you think people enjoy visiting places that are unfamiliar to them?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('111f09f4-5603-47a2-92f7-09e0aab0fb5c', 'bdb16a56-cfc3-4f06-bf5c-c7ca7a98323f', 'short_answer', 'What can young people learn from travelling to other countries?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('ae6a4399-34d8-44d1-bffc-4f557f34bb36', 'bdb16a56-cfc3-4f06-bf5c-c7ca7a98323f', 'short_answer', 'Has tourism done more good or harm to the places people visit?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('01fba0d7-d4d5-42c3-90a2-fdf87da49092', 'bdb16a56-cfc3-4f06-bf5c-c7ca7a98323f', 'short_answer', 'Do you think virtual travel could ever replace real travel?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('c786547f-8b27-452a-89f9-70beb3b4aab4', 'bdb16a56-cfc3-4f06-bf5c-c7ca7a98323f', 'short_answer', 'How might the way people take holidays change in the future?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

-- Academic Mock Test 3 (academic-3)
insert into public.test_forms (id, slug, title, description, variant, delivery_mode, is_published, is_premium, difficulty, scoring_version)
values ('4aaa0f29-4099-43d9-98a7-770e52e4690d', 'academic-3', 'Academic Mock Test 3', 'A foundation-level Academic practice test (around band 5-6) covering all four sections.', 'academic', 'computer', true, false, 'foundation', 'v1')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, description = excluded.description, is_published = excluded.is_published, is_premium = excluded.is_premium, difficulty = excluded.difficulty;

insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)
values ('68e2e502-8a0e-4ca1-aae2-5a2d1b7b0ed7', '4aaa0f29-4099-43d9-98a7-770e52e4690d', 'listening', 1800, 40, NULL, 0)
on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('57ea542c-dca7-4937-8f35-4c84e1865e64', '68e2e502-8a0e-4ca1-aae2-5a2d1b7b0ed7', 1, NULL, NULL, NULL, 'Questions 1-10. Complete the booking form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.', '{"title":"Part 1 — Hiring bicycles for a family holiday"}'::jsonb, 0)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.item_group_scripts (group_id, transcript) values ('57ea542c-dca7-4937-8f35-4c84e1865e64', 'LUCY: Good morning, Greenway Cycle Hire, Lucy speaking. How can I help you?
DANIEL: Oh, hello. I''m calling because my family and I are coming to the area on holiday next month, and we''d like to hire some bikes while we''re there.
LUCY: Lovely. I can certainly help with that. Can I start by taking your name?
DANIEL: Yes, it''s Daniel Ferris.
LUCY: Is that F-A-R-R-I-S?
DANIEL: No, it''s F-E-R-R-I-S. Ferris.
LUCY: Thank you, Mr Ferris. And how many bikes will you need?
DANIEL: Well, when I first looked at your website I thought we''d need four, but my mother has decided she''d rather walk, so it''s just three bikes now. One for me, one for my wife and one for our son.
LUCY: Three bikes, then. Do you know what kind of bikes you''d like? We have road bikes, hybrid bikes, mountain bikes and electric bikes.
DANIEL: My wife and I are happy with hybrid bikes, I think. We''re not planning anything too difficult.
LUCY: That''s what most people choose. And your son?
DANIEL: He''s fourteen, and he''s very keen on going off the paths into the woods, so he''s asked for a mountain bike.
LUCY: No problem, we have plenty of those in his size. Now, when would you like to start the hire?
DANIEL: We arrive on the tenth of July, but that''s a Saturday and we''ll be tired from the drive, and on the Sunday we''re visiting friends. So could we start on Monday, the twelfth of July?
LUCY: Yes, the twelfth is fine. And for how long?
DANIEL: We''re staying a full week, but I think five days of cycling will be enough for us.
LUCY: Five days, starting on the twelfth. Let me tell you about the prices. The hybrid and mountain bikes are eighteen pounds per bike per day. The electric bikes are more expensive, at twenty-two pounds a day.
DANIEL: Eighteen pounds is fine. We don''t need electric ones. What about helmets? Do we have to pay extra for those?
LUCY: No, helmets are free with every bike. We also have child seats and baskets, but there is a small charge for those.
DANIEL: We won''t need child seats, but a basket might be useful. I''ll think about it.
LUCY: You can decide on the day. Now, where would you like to collect the bikes? We have two shops. The main one is in the town centre, next to the post office, but most visitors use our smaller shop, which is right next to the station.
DANIEL: We''ll be driving, but I think the shop next to the station is closer to our cottage, so we''ll collect them from there.
LUCY: That''s fine. There''s a car park just behind it too. When you come, please remember to bring some identification with you.
DANIEL: Would my driving licence be OK?
LUCY: I''m afraid we can''t accept driving licences any more, because so many people use digital ones now. We need to see a passport.
DANIEL: Right, I''ll make sure I bring my passport. Is there anything else?
LUCY: Not for the booking, but can I recommend a route? Lots of families enjoy the Castle Trail, but it''s quite hilly and there''s a lot of traffic in the summer.
DANIEL: That doesn''t sound ideal.
LUCY: No. For you I''d really recommend the Riverside Trail. It''s completely flat, it follows the river for twenty kilometres, and there''s a lovely café halfway along.
DANIEL: The Riverside Trail sounds perfect. Thank you so much.
LUCY: You''re welcome. I''ll email you the booking details this afternoon.
DANIEL: Great. Goodbye.
LUCY: Goodbye, Mr Ferris.')
on conflict (group_id) do update set transcript = excluded.transcript;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('ed27816e-4ff9-4f84-bb06-3693b24b7e06', '57ea542c-dca7-4937-8f35-4c84e1865e64', 'note_completion', 'Customer name: Daniel ______', '[]'::jsonb, ARRAY['Ferris']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Daniel spells his name: "No, it''s F-E-R-R-I-S. Ferris."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('cd81b703-3768-4163-9b33-8ea32497d254', '57ea542c-dca7-4937-8f35-4c84e1865e64', 'note_completion', 'Number of bikes needed: ______', '[]'::jsonb, ARRAY['3', 'three']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'He first thought four but says "so it''s just three bikes now."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('4a312a7e-5174-4c18-9322-91861580c8f5', '57ea542c-dca7-4937-8f35-4c84e1865e64', 'note_completion', 'Type of bike for son: ______ bike', '[]'::jsonb, ARRAY['mountain']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Daniel says "he''s asked for a mountain bike."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('a4d87e78-4b73-4d3b-9fa2-6945dc9208e2', '57ea542c-dca7-4937-8f35-4c84e1865e64', 'note_completion', 'Hire starts on: ______ July', '[]'::jsonb, ARRAY['12th', '12', 'twelfth']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'They arrive on the tenth but ask to start "on Monday, the twelfth of July".', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('d8afe938-0a32-4dec-b580-03a1bb9395ce', '57ea542c-dca7-4937-8f35-4c84e1865e64', 'note_completion', 'Length of hire: ______ days', '[]'::jsonb, ARRAY['5', 'five']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Daniel says "five days of cycling will be enough for us."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('600de6ea-b2d3-424b-93ef-7d04c3ad9282', '57ea542c-dca7-4937-8f35-4c84e1865e64', 'note_completion', 'Cost per bike per day: £______', '[]'::jsonb, ARRAY['18', 'eighteen']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Lucy says hybrid and mountain bikes "are eighteen pounds per bike per day"; the electric bikes are the distractor.', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('c5393782-7ffc-4721-b97d-d27b02ff24d2', '57ea542c-dca7-4937-8f35-4c84e1865e64', 'note_completion', 'Helmets are ______', '[]'::jsonb, ARRAY['free', 'included']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Lucy confirms "helmets are free with every bike."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('6d645116-d448-493f-aee7-2be4ab9d891a', '57ea542c-dca7-4937-8f35-4c84e1865e64', 'note_completion', 'Collection point: the shop next to the ______', '[]'::jsonb, ARRAY['station', 'railway station']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Daniel chooses to collect "from there", "the shop next to the station".', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('21f2ec66-cfc0-48b7-810f-abdd1086b344', '57ea542c-dca7-4937-8f35-4c84e1865e64', 'note_completion', 'Identification required: a ______', '[]'::jsonb, ARRAY['passport']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'A driving licence is refused: "We need to see a passport."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('7defa312-fe44-46fb-a8b4-9c9162dc9040', '57ea542c-dca7-4937-8f35-4c84e1865e64', 'note_completion', 'Recommended route: the ______ Trail', '[]'::jsonb, ARRAY['Riverside']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Lucy says "For you I''d really recommend the Riverside Trail."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('5ba1f061-5b07-46d4-b485-7ef7460d4d0f', '68e2e502-8a0e-4ca1-aae2-5a2d1b7b0ed7', 2, NULL, NULL, NULL, 'Questions 11-20. Choose the correct letter for Questions 11-14. For Questions 15-18, choose what each area of the garden offers (A-F). For Questions 19-20, write NO MORE THAN TWO WORDS AND/OR A NUMBER.', '{"title":"Part 2 — Welcome talk at a botanical garden"}'::jsonb, 1)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.item_group_scripts (group_id, transcript) values ('5ba1f061-5b07-46d4-b485-7ef7460d4d0f', 'GUIDE: Good morning, everyone, and welcome to Ashford Botanical Garden. My name is Peter, and I''ll be your guide this morning. Before we set off, I''d like to tell you a little about the garden and explain what you can see today.
GUIDE: Many visitors think the garden is much older than it really is, because some of the trees here are more than two hundred years old. In fact, those trees belonged to a private estate. The land was bought by the town council in 1872, but it took almost twenty years to design and plant the gardens, so the garden was first opened to the public in 1890. The large glasshouse you can see behind me was added much later, in 1925.
GUIDE: Now, today''s tour. The programme says that it lasts one hour, but that information is out of date. We''ve added a visit to the new glasshouse, so the tour now lasts an hour and a half. If anyone needs to leave early, that''s no problem at all, just let me know.
GUIDE: A few simple rules before we start. You are very welcome to take photographs anywhere in the garden, including inside the glasshouses. You may also touch most of the plants, except the ones with red labels, which can be harmful. The one thing we do ask is that you don''t feed the birds. The ducks and swans on the lake become ill if they eat bread, so please keep your sandwiches to yourselves.
GUIDE: Our newest attraction is the Tropical House, which opened last spring. Many people expect it to be full of cactus plants, but those are in our desert collection in the old glasshouse. The Tropical House is warm and very humid, because it contains plants from rainforests in South America and Asia, including some very rare orchids.
GUIDE: Let me now tell you about the four main areas of the garden. First, the Rose Garden. This is our most famous area, and in June it''s full of colour. This year it''s also where you''ll find an exhibition of sculptures by local artists, so do take your time walking around it. The sculptures will be there until the end of September.
GUIDE: Next to the Rose Garden is the lake. People often ask if there''s a play area for children near the water, but for safety reasons there isn''t one. The play area is at the main entrance. What you will find by the lake is our café, which serves hot meals and has a terrace looking over the water.
GUIDE: Then there''s the Herb Garden. It was planted by monks hundreds of years ago, although what you see today is a modern copy. Every plant is labelled with its traditional uses in cooking and medicine. If you like what you see, the small shed at the gate sells plants grown here in the garden, so you can take some home.
GUIDE: Finally, the Japanese Garden. It''s the quietest part of the garden. We used to give guided talks there on Sunday afternoons, but those have stopped for this year. However, it''s a wonderful place to rest, because there''s plenty of seating in the shade under the maple trees, which is very welcome on a hot day.
GUIDE: Just two more practical points. The gift shop is beside the main entrance. The sign on the door says it closes at half past four, but in summer it stays open until 5 pm, so you have plenty of time after the tour.
GUIDE: And if you enjoy your visit today, you might like to buy an annual pass. A single ticket costs eight pounds, but an annual pass costs just forty pounds and lets you visit as often as you like for twelve months. You can buy one in the gift shop.
GUIDE: Right, if everyone''s ready, let''s start by walking down to the Rose Garden.')
on conflict (group_id) do update set transcript = excluded.transcript;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f3886c7a-1601-43d1-a96b-728916240ca6', '5ba1f061-5b07-46d4-b485-7ef7460d4d0f', 'multiple_choice_single', 'The garden was first opened to the public in', '[{"value":"A","label":"A. 1872"},{"value":"B","label":"B. 1890"},{"value":"C","label":"C. 1925"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The guide says "the garden was first opened to the public in 1890"; 1872 is when the land was bought.', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('8e8b57d4-40eb-4f9e-a765-4ba574803083', '5ba1f061-5b07-46d4-b485-7ef7460d4d0f', 'multiple_choice_single', 'How long does today''s tour last?', '[{"value":"A","label":"A. 45 minutes"},{"value":"B","label":"B. one hour"},{"value":"C","label":"C. an hour and a half"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The programme is out of date: "the tour now lasts an hour and a half."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f49abe64-b3bc-47b4-934c-975bf4a52607', '5ba1f061-5b07-46d4-b485-7ef7460d4d0f', 'multiple_choice_single', 'Visitors are asked not to', '[{"value":"A","label":"A. feed the birds"},{"value":"B","label":"B. touch any plants"},{"value":"C","label":"C. take photographs in the glasshouses"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The guide says "The one thing we do ask is that you don''t feed the birds."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('9a304b17-40f6-47f2-8a40-8da812776c53', '5ba1f061-5b07-46d4-b485-7ef7460d4d0f', 'multiple_choice_single', 'The Tropical House contains plants from', '[{"value":"A","label":"A. deserts"},{"value":"B","label":"B. rainforests"},{"value":"C","label":"C. mountains"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The Tropical House "contains plants from rainforests in South America and Asia".', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('5a500e62-1bfc-4bb5-bded-5318b832ec9d', '5ba1f061-5b07-46d4-b485-7ef7460d4d0f', 'matching_features', 'Rose Garden', '[{"value":"A","label":"A. a children''s play area"},{"value":"B","label":"B. guided talks"},{"value":"C","label":"C. seating in the shade"},{"value":"D","label":"D. plants for sale"},{"value":"E","label":"E. a café"},{"value":"F","label":"F. an exhibition of sculptures"}]'::jsonb, ARRAY['F']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The guide says the Rose Garden "it''s also where you''ll find an exhibition of sculptures by local artists".', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('37a74e75-71dd-464d-8e66-f4218026698f', '5ba1f061-5b07-46d4-b485-7ef7460d4d0f', 'matching_features', 'Lake', '[{"value":"A","label":"A. a children''s play area"},{"value":"B","label":"B. guided talks"},{"value":"C","label":"C. seating in the shade"},{"value":"D","label":"D. plants for sale"},{"value":"E","label":"E. a café"},{"value":"F","label":"F. an exhibition of sculptures"}]'::jsonb, ARRAY['E']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'There is no play area by the lake; "What you will find by the lake is our café".', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('a5822ca1-6149-44cc-99e3-d3a93afc037e', '5ba1f061-5b07-46d4-b485-7ef7460d4d0f', 'matching_features', 'Herb Garden', '[{"value":"A","label":"A. a children''s play area"},{"value":"B","label":"B. guided talks"},{"value":"C","label":"C. seating in the shade"},{"value":"D","label":"D. plants for sale"},{"value":"E","label":"E. a café"},{"value":"F","label":"F. an exhibition of sculptures"}]'::jsonb, ARRAY['D']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'At the Herb Garden "the small shed at the gate sells plants grown here in the garden".', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('1d0cae22-ee26-47d5-ad10-63d0d84bb4fa', '5ba1f061-5b07-46d4-b485-7ef7460d4d0f', 'matching_features', 'Japanese Garden', '[{"value":"A","label":"A. a children''s play area"},{"value":"B","label":"B. guided talks"},{"value":"C","label":"C. seating in the shade"},{"value":"D","label":"D. plants for sale"},{"value":"E","label":"E. a café"},{"value":"F","label":"F. an exhibition of sculptures"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Guided talks "have stopped", but "there''s plenty of seating in the shade under the maple trees".', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('033326e8-721d-4322-85d3-72d7696eb2ae', '5ba1f061-5b07-46d4-b485-7ef7460d4d0f', 'note_completion', 'In summer the gift shop closes at ______', '[]'::jsonb, ARRAY['5 pm', '5pm', '5', 'five', '17:00']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'The sign says half past four, "but in summer it stays open until 5 pm".', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('2e7361ae-3d18-49c0-9f3f-194dfc308805', '5ba1f061-5b07-46d4-b485-7ef7460d4d0f', 'note_completion', 'An annual pass costs £______', '[]'::jsonb, ARRAY['40', 'forty']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'The guide says "an annual pass costs just forty pounds".', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('696cc755-91c3-4f1c-91e6-49457c1ba2c6', '68e2e502-8a0e-4ca1-aae2-5a2d1b7b0ed7', 3, NULL, NULL, NULL, 'Questions 21-30. Choose the correct letter for Questions 21-25. For Questions 26-30, decide who will do each task: A Maya, B Ben, or C both.', '{"title":"Part 3 — Planning a presentation on campus recycling"}'::jsonb, 2)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.item_group_scripts (group_id, transcript) values ('696cc755-91c3-4f1c-91e6-49457c1ba2c6', 'DR HOLT: Come in, Maya, Ben. So, you wanted to talk about your presentation for the environmental studies module.
MAYA: Yes, thank you, Dr Holt. We''ve chosen the topic of recycling on campus, and we''d like your advice before we go much further.
DR HOLT: Good. Can I ask why you chose that topic? There were quite a few on the list.
BEN: Well, it wasn''t because there''s lots of research on it. Actually, there''s very little. It''s more that we both work part-time in the student café, and we see so much plastic thrown away every day. We wanted to understand why.
MAYA: Yes, it''s a personal interest really. We see the problem with our own eyes.
DR HOLT: That''s a good reason. What have you done so far?
MAYA: We''ve carried out a survey. We hoped to get two hundred responses, but in the end a hundred and twenty students completed it.
DR HOLT: A hundred and twenty is perfectly acceptable for a project of this size. What did you find?
BEN: The first thing was that most students say they recycle regularly. About eighty per cent said they always or usually recycle.
DR HOLT: That doesn''t surprise me. People tend to report good behaviour in surveys.
MAYA: No, but what really surprised us was that most students didn''t know which bin to use. When we showed them pictures of common items, like coffee cups and sandwich boxes, more than half chose the wrong bin.
DR HOLT: That is interesting. So they want to recycle, but they don''t know how.
BEN: Exactly. We also wanted to compare students and staff, but not enough staff answered, so we''ve left that out.
DR HOLT: Sensible. Now, I''ve looked at your draft slides. The visuals are clear, and you have plenty of statistics, perhaps even too many. What it needs is more focus on solutions. At the moment you describe the problem very well, but you don''t say what the university could do about it.
MAYA: That''s true. We spent most of our time on the survey results.
DR HOLT: The audience will want to know what should change. Remember, you have fifteen minutes in total. Some groups have asked for twenty, but I''m afraid fifteen is the limit, including questions.
BEN: OK, fifteen minutes. So we''ll need to cut some of the numbers.
DR HOLT: Yes. Now, have you decided who''s doing what?
MAYA: Mostly. Ben is much better at design than I am, so he''s going to do the slides.
BEN: I''m happy to do that. I''ll make them simpler, too.
DR HOLT: And the solutions section? You''ll need some information from the university.
MAYA: I''ll contact the facilities manager. I met her at an open day, so I''ll email her this week and ask what the university is planning.
DR HOLT: Good. Will you give the audience a handout?
BEN: I was going to write it, but Maya''s notes are much better organised than mine.
MAYA: That''s fine, I''ll write the handout. Ben, you''ve got enough to do with the slides.
DR HOLT: What about rehearsing? Timing is where most groups go wrong.
BEN: We''ll practise the timing together. We''ve booked a seminar room for next Thursday so we can run through it twice.
MAYA: Yes, we''ll both be there.
DR HOLT: Excellent. And who''s preparing the conclusion?
MAYA: I thought I''d do it, but I''ll be busy with the handout and the facilities manager.
BEN: So I''ll prepare the conclusion. It should link closely to the slides anyway.
DR HOLT: That sounds like a sensible division. Send me the new slides by Friday and I''ll give you some quick feedback.
MAYA: Thank you, Dr Holt. That''s really helpful.')
on conflict (group_id) do update set transcript = excluded.transcript;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('ef154bab-4af8-4328-94bb-63a81c9296bc', '696cc755-91c3-4f1c-91e6-49457c1ba2c6', 'multiple_choice_single', 'Why did the students choose recycling as their topic?', '[{"value":"A","label":"A. Their tutor suggested it."},{"value":"B","label":"B. It relates to their part-time job."},{"value":"C","label":"C. A lot of research is available on it."}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Ben says "we both work part-time in the student café, and we see so much plastic thrown away every day."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('8479481b-d7b0-4827-983c-1211b677749b', '696cc755-91c3-4f1c-91e6-49457c1ba2c6', 'multiple_choice_single', 'How many students completed the survey?', '[{"value":"A","label":"A. 80"},{"value":"B","label":"B. 120"},{"value":"C","label":"C. 200"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Maya says "in the end a hundred and twenty students completed it"; two hundred was only their hope.', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('b7e4bc2d-280d-4929-b233-30f34204ba5e', '696cc755-91c3-4f1c-91e6-49457c1ba2c6', 'multiple_choice_single', 'What surprised the students most?', '[{"value":"A","label":"A. Students did not know which bin to use."},{"value":"B","label":"B. Students hardly ever recycled."},{"value":"C","label":"C. Staff recycled less than students."}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Maya says "what really surprised us was that most students didn''t know which bin to use."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('01777d04-5162-4f31-92f0-3e1abf066ccb', '696cc755-91c3-4f1c-91e6-49457c1ba2c6', 'multiple_choice_single', 'Dr Holt says the presentation needs more', '[{"value":"A","label":"A. visuals"},{"value":"B","label":"B. statistics"},{"value":"C","label":"C. focus on solutions"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Dr Holt says "What it needs is more focus on solutions."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('4d43b485-60a7-4840-b884-7bbc86632921', '696cc755-91c3-4f1c-91e6-49457c1ba2c6', 'multiple_choice_single', 'How long can the presentation last?', '[{"value":"A","label":"A. 10 minutes"},{"value":"B","label":"B. 15 minutes"},{"value":"C","label":"C. 20 minutes"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Dr Holt says "you have fifteen minutes in total" and "fifteen is the limit".', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('fb2ca7e6-27d5-477c-af9e-2e99e1ae3617', '696cc755-91c3-4f1c-91e6-49457c1ba2c6', 'matching_features', 'design the slides', '[{"value":"A","label":"A. Maya"},{"value":"B","label":"B. Ben"},{"value":"C","label":"C. both Maya and Ben"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Maya says "Ben is much better at design than I am, so he''s going to do the slides."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('a795481e-ecac-47dd-ac90-abecaf8c975a', '696cc755-91c3-4f1c-91e6-49457c1ba2c6', 'matching_features', 'contact the facilities manager', '[{"value":"A","label":"A. Maya"},{"value":"B","label":"B. Ben"},{"value":"C","label":"C. both Maya and Ben"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Maya says "I''ll contact the facilities manager."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f8650921-e725-467c-8c6f-458e93075607', '696cc755-91c3-4f1c-91e6-49457c1ba2c6', 'matching_features', 'write the handout', '[{"value":"A","label":"A. Maya"},{"value":"B","label":"B. Ben"},{"value":"C","label":"C. both Maya and Ben"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Ben suggests Maya, and she agrees: "That''s fine, I''ll write the handout."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('4bdb4d22-aaf8-4c9b-bfcd-604e91a0c0d4', '696cc755-91c3-4f1c-91e6-49457c1ba2c6', 'matching_features', 'practise the timing', '[{"value":"A","label":"A. Maya"},{"value":"B","label":"B. Ben"},{"value":"C","label":"C. both Maya and Ben"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Ben says "We''ll practise the timing together" and Maya adds "we''ll both be there."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('7cac2fa0-30aa-4d5c-8872-21785365e914', '696cc755-91c3-4f1c-91e6-49457c1ba2c6', 'matching_features', 'prepare the conclusion', '[{"value":"A","label":"A. Maya"},{"value":"B","label":"B. Ben"},{"value":"C","label":"C. both Maya and Ben"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Maya is too busy, so Ben says "So I''ll prepare the conclusion."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('3d3b3970-42f4-4f7e-b2ba-61aaea8268f9', '68e2e502-8a0e-4ca1-aae2-5a2d1b7b0ed7', 4, NULL, NULL, NULL, 'Questions 31-40. Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.', '{"title":"Part 4 — Lecture: how honeybees communicate"}'::jsonb, 3)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.item_group_scripts (group_id, transcript) values ('3d3b3970-42f4-4f7e-b2ba-61aaea8268f9', 'LECTURER: Good afternoon. In today''s lecture I''m going to talk about one of the most remarkable animals in the natural world, the honeybee, and in particular about how honeybees share information with each other. Then, at the end, I''ll say something about the problems bees face today.
LECTURER: Let''s begin with communication. A honeybee colony depends on finding food, which means nectar and pollen from flowers. But flowers may be several kilometres away from the hive. So when a worker bee, which we call a forager, finds a good source of food, she needs a way to tell the other bees where it is. She does this by dancing.
LECTURER: The most famous of these dances is called the waggle dance. The bee walks forward in a straight line on the wall of the hive, shaking her body from side to side, and then circles back to the start and repeats the movement many times.
LECTURER: There is also a simpler dance, called the round dance. In the round dance the bee simply runs in small circles. It tells the other bees that there is food close to the hive, within about fifty metres, but it doesn''t say in which direction. The other bees just fly out and search the area nearby.
LECTURER: The waggle dance is much more informative. It gives both direction and distance. Direction is shown by the angle of the straight run. If the bee runs straight up the wall of the hive, the food is in the same direction as the sun. If she runs at an angle to the right, the food is at that same angle to the right of the sun. So the dance is always relative to the sun, which is quite extraordinary when you think that it happens in the dark inside the hive.
LECTURER: What about distance? You might expect the speed of the dance to show this, but in fact it''s the length of the waggle run that shows the distance. A longer waggle means the food is further away.
LECTURER: This system was discovered by an Austrian scientist called Karl von Frisch. He studied bees for many years, starting in the 1920s, and he was awarded the Nobel Prize in 1973 for this work. At first many scientists didn''t believe him, but later experiments with robotic bees confirmed that he was right.
LECTURER: Dancing isn''t the only way bees share information, though. When a forager returns, she carries the scent of the flowers on her body. The other bees smell this, so they use scent to identify the right kind of flower when they arrive at the location.
LECTURER: Let me now say a little about the colony itself. A colony may contain up to sixty thousand bees, but there is only one queen. She is the only female who lays eggs, and in summer she can lay up to two thousand eggs a day. The workers, who are all female, do everything else. They clean the hive, feed the young, and collect food. Because they work so hard, a worker bee in summer lives for only about six weeks. Bees born in autumn live much longer, because they rest through the winter.
LECTURER: Finally, the problems. You''ve probably heard that bee numbers are falling in many countries. There are several causes. Some people think pesticides are the main problem, and they certainly play a part. Disease, especially a small parasite called the varroa mite, is another. But most researchers now agree that the biggest single threat is loss of habitat. Modern farms grow huge areas of one crop, and there are fewer hedges and meadows, so bees simply can''t find enough different flowers through the year.
LECTURER: Fortunately, there are simple solutions. In many countries, farmers are now paid to plant wildflowers at the edges of their fields. These strips of flowers give bees food from spring to autumn, and studies show that bee numbers recover quite quickly where this is done.
LECTURER: Next week we''ll look at how other insects, such as ants, communicate. Thank you.')
on conflict (group_id) do update set transcript = excluded.transcript;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('bf14a921-bbbc-41bd-8120-bd5e88b0eb74', '3d3b3970-42f4-4f7e-b2ba-61aaea8268f9', 'note_completion', 'The main dance used to show where food is: the ______ dance', '[]'::jsonb, ARRAY['waggle']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The lecturer says "The most famous of these dances is called the waggle dance."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('51462294-cd69-4762-85ba-63b850c6ba52', '3d3b3970-42f4-4f7e-b2ba-61aaea8268f9', 'note_completion', 'Round dance: food is within about ______ metres of the hive', '[]'::jsonb, ARRAY['50', 'fifty']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The round dance means food is "close to the hive, within about fifty metres".', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('132abd58-10b1-486f-8514-d637bd574f45', '3d3b3970-42f4-4f7e-b2ba-61aaea8268f9', 'note_completion', 'Direction is shown relative to the ______', '[]'::jsonb, ARRAY['sun']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The lecturer says "the dance is always relative to the sun".', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('121beb29-e89b-41dc-9e1a-4be48423f896', '3d3b3970-42f4-4f7e-b2ba-61aaea8268f9', 'note_completion', 'The length of the waggle run shows the ______', '[]'::jsonb, ARRAY['distance']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Not the speed: "it''s the length of the waggle run that shows the distance."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('8fd682c8-426b-47a7-8fb5-c1182b2cbefb', '3d3b3970-42f4-4f7e-b2ba-61aaea8268f9', 'note_completion', 'Karl von Frisch received the Nobel Prize in ______', '[]'::jsonb, ARRAY['1973']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Von Frisch "was awarded the Nobel Prize in 1973 for this work"; the 1920s is when he started.', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('5c623182-ab67-410b-b03b-a30d5d98c499', '3d3b3970-42f4-4f7e-b2ba-61aaea8268f9', 'note_completion', 'Bees also use ______ to identify the right flower', '[]'::jsonb, ARRAY['scent', 'smell']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The other bees "use scent to identify the right kind of flower".', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f82cc1b8-d7f4-4fb9-b659-3f7721c6d156', '3d3b3970-42f4-4f7e-b2ba-61aaea8268f9', 'note_completion', 'In summer the queen can lay up to ______ eggs a day', '[]'::jsonb, ARRAY['2000', '2,000']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The queen "can lay up to two thousand eggs a day"; sixty thousand is the colony size.', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('270986cb-b277-4113-916e-9442bfba5e79', '3d3b3970-42f4-4f7e-b2ba-61aaea8268f9', 'note_completion', 'A summer worker bee lives for about six ______', '[]'::jsonb, ARRAY['weeks']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The lecturer says "a worker bee in summer lives for only about six weeks."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('119fd7db-4f2e-4d2b-bb23-1875de7e5c66', '3d3b3970-42f4-4f7e-b2ba-61aaea8268f9', 'note_completion', 'The biggest single threat to bees: loss of ______', '[]'::jsonb, ARRAY['habitat']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Pesticides and mites are mentioned, but "the biggest single threat is loss of habitat."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('991d7320-0950-4a3b-bc91-b46c8548719d', '3d3b3970-42f4-4f7e-b2ba-61aaea8268f9', 'note_completion', 'Farmers are paid to plant ______ at field edges', '[]'::jsonb, ARRAY['wildflowers']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Farmers "are now paid to plant wildflowers at the edges of their fields."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)
values ('b7a397f1-35c5-49b1-bf79-33e6e2947f5e', '4aaa0f29-4099-43d9-98a7-770e52e4690d', 'reading', 3600, 40, NULL, 1)
on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('437dddfb-eb26-425d-8d1f-fa6a182b611e', 'b7a397f1-35c5-49b1-bf79-33e6e2947f5e', 1, 'Today the bicycle is so familiar that it is easy to forget it is a fairly recent invention. People were building steam engines and printing newspapers long before anyone found a practical way to travel on two wheels. The story of how the bicycle developed is a story of many small improvements made by different people in different countries over about seventy years.

The first machine that most historians accept as an early bicycle was built in 1817 by Karl von Drais, a German official. It was made almost entirely of wood and had no pedals. The rider sat on a seat between two wheels and pushed the ground with his feet, rather like a child on a modern balance bike. Drais called it a "running machine", and on its first journey he travelled about fourteen kilometres in under an hour, which was faster than walking. Drais hoped that his machine would be useful at a time when horses were expensive to feed, because poor harvests had made oats very costly. The idea was copied quickly in France and Britain, where the machines were known as "hobby horses". However, they were expensive, uncomfortable on rough roads and dangerous on hills, and the fashion lasted only a few years.

The next important step came in the 1860s in France, when pedals were attached directly to the front wheel. This machine, called the velocipede, could be ridden without the feet touching the ground. It became popular in Paris, and riding schools opened where wealthy young men paid to learn. But the velocipede had a serious problem. It had iron tyres and a heavy frame, and the ride was so rough that the British gave it the nickname "boneshaker".

Because the pedals turned the front wheel directly, one turn of the pedals moved the machine only as far as the wheel travelled in one turn. The obvious way to go faster was to make the front wheel larger. By the 1870s, makers in Britain were producing bicycles with front wheels as large as one and a half metres across and a tiny rear wheel. These machines, later called "penny-farthings" after two British coins of different sizes, were fast and surprisingly efficient. They also had rubber tyres, which made them more comfortable. However, the rider sat very high above the ground, and a stone in the road could throw him forward over the handlebars. Riding a penny-farthing was therefore mostly a sport for brave young men, and very few women rode them.

The machine that changed everything was the "safety bicycle", which appeared in the 1880s. The best-known early design was the Rover, produced in 1885 by John Kemp Starley in the English city of Coventry. The safety bicycle had two wheels of the same size and a chain that connected the pedals to the rear wheel. Because of the chain, a small wheel could still turn quickly, so the rider could sit lower and put his or her feet on the ground when stopping. Three years later, in 1888, John Boyd Dunlop, a Scottish vet living in Ireland, developed a tyre filled with air for his son''s tricycle. Air-filled tyres were soon fitted to safety bicycles, and the ride became smooth for the first time.

The result was a cycling boom in the 1890s. Factories in Britain, France and the United States produced bicycles in huge numbers, and prices fell until ordinary workers could afford one. For many people, the bicycle was the first machine that allowed them to travel independently beyond their own town or village. It had a particularly strong effect on the lives of women. Cycling required practical clothing, and the long, heavy skirts of the time were gradually replaced by shorter skirts and loose trousers. The American campaigner Susan B. Anthony said in 1896 that the bicycle had "done more to emancipate women than anything else in the world".

The bicycle also helped to prepare the way for other forms of transport. Cyclists in Britain and the United States formed clubs that campaigned for better roads, and many of the skills and factories of the bicycle industry were later used to make motor cars and even aircraft. The Wright brothers, who made the first powered flight in 1903, ran a bicycle shop in Ohio, and they used the money from that business to pay for their experiments.

Although the basic design of the safety bicycle has hardly changed in more than a century, the bicycle continues to develop. Gears, lighter materials such as aluminium and carbon fibre, and more recently electric motors have all made cycling easier. Bicycles are also very popular in developing countries, where they are often the cheapest way to carry goods to market. Many cities are now building cycle lanes to reduce traffic and pollution, so the machine that began as a wooden toy may have an important part to play in the future.', NULL, NULL, 'You should spend about 20 minutes on Questions 1-13, which are based on Reading Passage 1 below.', '{"title":"Passage 1 — The rise of the bicycle"}'::jsonb, 0)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('8e97fce5-9fd5-4bcb-aabf-6fb49cb3ff87', '437dddfb-eb26-425d-8d1f-fa6a182b611e', 'true_false_notgiven', 'The bicycle was invented after the steam engine.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['TRUE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The passage says "People were building steam engines and printing newspapers long before anyone found a practical way to travel on two wheels."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('2548b274-1559-4e40-9e46-cb1870a00f0e', '437dddfb-eb26-425d-8d1f-fa6a182b611e', 'true_false_notgiven', 'Drais''s running machine was moved by pedals.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['FALSE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The machine "had no pedals" and the rider "pushed the ground with his feet".', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('fb0f8b53-da84-4645-a99d-b20912a67d25', '437dddfb-eb26-425d-8d1f-fa6a182b611e', 'true_false_notgiven', 'Drais sold hundreds of running machines in Germany.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NOT GIVEN']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The passage says the idea "was copied quickly in France and Britain" but gives no sales figures for Drais.', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('c0cee528-fb27-4bbf-b59b-5803c0585d31', '437dddfb-eb26-425d-8d1f-fa6a182b611e', 'true_false_notgiven', 'Hobby horses remained fashionable for several decades.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['FALSE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The passage says "the fashion lasted only a few years."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e961f1b0-3990-466a-a07b-ca278d03faed', '437dddfb-eb26-425d-8d1f-fa6a182b611e', 'true_false_notgiven', 'The velocipede got its British nickname because it was uncomfortable to ride.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['TRUE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The ride was "so rough that the British gave it the nickname" boneshaker.', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('5928a60d-a222-498a-b3bf-66fc016e4e0e', '437dddfb-eb26-425d-8d1f-fa6a182b611e', 'true_false_notgiven', 'Penny-farthings were ridden by women as often as by men.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['FALSE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Riding one was "mostly a sport for brave young men, and very few women rode them."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('0c6c70eb-b3ae-474f-af25-20297d7c7c72', '437dddfb-eb26-425d-8d1f-fa6a182b611e', 'true_false_notgiven', 'Starley later opened a second factory outside Coventry.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NOT GIVEN']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The passage only says the Rover was "produced in 1885 by John Kemp Starley in the English city of Coventry"; no second factory is mentioned.', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('74dc55fe-1d15-415b-9344-f7bcd331c475', '437dddfb-eb26-425d-8d1f-fa6a182b611e', 'note_completion', 'Velocipede (1860s): pedals fixed to the ______ wheel (ONE WORD ONLY)', '[]'::jsonb, ARRAY['front']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'In the 1860s "pedals were attached directly to the front wheel."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('9fd167fa-1925-4f2c-8dec-770deff9dc52', '437dddfb-eb26-425d-8d1f-fa6a182b611e', 'note_completion', 'Penny-farthing (1870s): made more comfortable by ______ tyres (ONE WORD ONLY)', '[]'::jsonb, ARRAY['rubber']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Penny-farthings "also had rubber tyres, which made them more comfortable."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('915d69e4-8b08-4c2f-9436-3d9ed79fb371', '437dddfb-eb26-425d-8d1f-fa6a182b611e', 'note_completion', 'Safety bicycle (1880s): a ______ linked the pedals to the rear wheel (ONE WORD ONLY)', '[]'::jsonb, ARRAY['chain']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'It had "a chain that connected the pedals to the rear wheel."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('6b2d8896-b84e-469a-8868-213f775bfa1f', '437dddfb-eb26-425d-8d1f-fa6a182b611e', 'note_completion', 'Dunlop first made his air-filled tyre for his son''s ______ (ONE WORD ONLY)', '[]'::jsonb, ARRAY['tricycle']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Dunlop "developed a tyre filled with air for his son''s tricycle."', 10)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('7422f514-3491-45ed-8776-6b8397f70473', '437dddfb-eb26-425d-8d1f-fa6a182b611e', 'note_completion', '1890s: bicycles became cheap enough for ordinary ______ to buy (ONE WORD ONLY)', '[]'::jsonb, ARRAY['workers']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Prices "fell until ordinary workers could afford one."', 11)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('0b3965b6-a188-49f5-8e60-c3c5ce5caefe', '437dddfb-eb26-425d-8d1f-fa6a182b611e', 'note_completion', 'The Wright brothers paid for their experiments with money from a bicycle ______ (ONE WORD ONLY)', '[]'::jsonb, ARRAY['shop']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'They "ran a bicycle shop in Ohio" and "used the money from that business to pay for their experiments."', 12)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('b2ed9bf2-b98f-42a7-bdb2-9fc4db9513fe', 'b7a397f1-35c5-49b1-bf79-33e6e2947f5e', 2, 'A. Planting gardens on top of buildings is not a modern invention. In Scandinavia, farmhouses were covered with grass roofs for hundreds of years because the thick layer of soil kept the houses warm in winter. What is new is the idea of putting gardens on the flat roofs of offices, shops and apartment blocks in large modern cities. Over the past thirty years, this kind of "green roof" has spread from a few experimental buildings in Germany to thousands of cities around the world.

B. One of the main reasons city governments support green roofs is water. In a city, most surfaces are hard, so when it rains heavily the water runs straight off roofs and roads into the drains. If the drains cannot cope, streets flood. A green roof works like a sponge. The plants and soil hold much of the rain and release it slowly, and some of it simply evaporates back into the air. Studies in Germany have found that a typical green roof can hold between fifty and ninety per cent of the rain that falls on it in summer, which greatly reduces the pressure on the drains. In winter, when plants grow more slowly, the figure is lower, but it is still significant. The water that does leave the roof is also cleaner, because the soil filters out some of the dust and pollution it has collected.

C. Green roofs can also reduce energy costs for the people inside the building. A normal dark roof becomes extremely hot in summer, sometimes reaching more than seventy degrees Celsius, and this heat passes into the rooms below. A roof covered in plants stays much cooler, so less air conditioning is needed. In winter the soil acts as an extra layer of insulation, keeping heat inside. A study of one shopping centre in Canada found that its green roof reduced the energy used for cooling by about a quarter. Green roofs also help to cool the city as a whole. Large cities are often several degrees warmer than the countryside around them, because concrete and tarmac absorb heat during the day and release it at night. Plants cool the air as water evaporates from their leaves, so a city with many green roofs can be noticeably more comfortable during a heatwave.

D. A third benefit is for nature. Cities have lost large areas of grassland and woodland, and many birds and insects have lost their homes as a result. Green roofs can give them a place to feed and rest. In London, some roofs have been specially designed for a rare bird called the black redstart, using gravel and local plants that copy its natural habitat. Bees and butterflies also visit roof gardens, even on buildings more than ten floors high. Some building owners now place beehives on their roofs and sell the honey to staff and visitors.

E. Some rooftop gardens go one step further and produce food. In New York, one company runs two large farms on the roofs of old industrial buildings and sells vegetables to local restaurants and shops. Because the food travels only a short distance, it can be picked when it is ripe and reach customers on the same day. Supporters say rooftop farms can also teach city children where food comes from, and many of them run regular visits for school groups.

F. Despite these advantages, green roofs are still unusual in most cities, and the main reason is weight. Wet soil is very heavy, and many older buildings were not designed to carry this load. Before a garden can be added, an engineer must check that the roof is strong enough, and in many cases it is not. Strengthening a roof is expensive, so most green roofs are built on new buildings, where the extra weight can be included in the design from the start. Lighter systems, which use a thin layer of special soil and small, tough plants called sedums, can be fitted to some older roofs, but they hold less water and support fewer kinds of wildlife.

G. Several cities have now decided that the benefits are worth the cost. Since 2009 Toronto has required most new large buildings to include a green roof, and cities such as Copenhagen and Paris have introduced similar rules. Other cities prefer to encourage owners with money rather than force them, by paying part of the cost of construction. Builders also point out that a green roof needs care. Weeds must be removed, dead plants replaced and drains kept clear, and on a tall building this work can only be done by trained staff, which adds to the yearly cost. Either way, as cities grow hotter and storms become heavier, it seems likely that more and more of the view from a high window will be green.', NULL, NULL, 'You should spend about 20 minutes on Questions 14-26, which are based on Reading Passage 2 below.', '{"title":"Passage 2 — Gardens on the rooftops"}'::jsonb, 1)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('b2130061-74d0-4deb-917f-d7af8765d684', 'b2ed9bf2-b98f-42a7-bdb2-9fc4db9513fe', 'matching_headings', 'Paragraph A — choose the most suitable heading.', '[{"value":"i","label":"i. Saving money on heating and cooling"},{"value":"ii","label":"ii. An old idea in a new setting"},{"value":"iii","label":"iii. Why many buildings cannot carry a garden"},{"value":"iv","label":"iv. Helping wildlife in the city"},{"value":"v","label":"v. Food grown close to the people who eat it"},{"value":"vi","label":"vi. Slowing the flow of rainwater"},{"value":"vii","label":"vii. Laws that require green roofs"},{"value":"viii","label":"viii. The high price of fresh vegetables"}]'::jsonb, ARRAY['ii']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph A explains that grass roofs existed "for hundreds of years" and that "What is new is the idea of putting gardens on the flat roofs" of city buildings.', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('09d1a55e-9b51-4484-821b-6448bc791c3c', 'b2ed9bf2-b98f-42a7-bdb2-9fc4db9513fe', 'matching_headings', 'Paragraph B — choose the most suitable heading.', '[{"value":"i","label":"i. Saving money on heating and cooling"},{"value":"ii","label":"ii. An old idea in a new setting"},{"value":"iii","label":"iii. Why many buildings cannot carry a garden"},{"value":"iv","label":"iv. Helping wildlife in the city"},{"value":"v","label":"v. Food grown close to the people who eat it"},{"value":"vi","label":"vi. Slowing the flow of rainwater"},{"value":"vii","label":"vii. Laws that require green roofs"},{"value":"viii","label":"viii. The high price of fresh vegetables"}]'::jsonb, ARRAY['vi']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph B says "A green roof works like a sponge" and the plants "release it slowly", reducing flooding.', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('6ddb9ea0-05ee-4c30-b823-ee5c93d42b58', 'b2ed9bf2-b98f-42a7-bdb2-9fc4db9513fe', 'matching_headings', 'Paragraph C — choose the most suitable heading.', '[{"value":"i","label":"i. Saving money on heating and cooling"},{"value":"ii","label":"ii. An old idea in a new setting"},{"value":"iii","label":"iii. Why many buildings cannot carry a garden"},{"value":"iv","label":"iv. Helping wildlife in the city"},{"value":"v","label":"v. Food grown close to the people who eat it"},{"value":"vi","label":"vi. Slowing the flow of rainwater"},{"value":"vii","label":"vii. Laws that require green roofs"},{"value":"viii","label":"viii. The high price of fresh vegetables"}]'::jsonb, ARRAY['i']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph C says "Green roofs can also reduce energy costs" in summer and winter.', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('400cf6d0-b281-4234-9b03-b829011d09b6', 'b2ed9bf2-b98f-42a7-bdb2-9fc4db9513fe', 'matching_headings', 'Paragraph D — choose the most suitable heading.', '[{"value":"i","label":"i. Saving money on heating and cooling"},{"value":"ii","label":"ii. An old idea in a new setting"},{"value":"iii","label":"iii. Why many buildings cannot carry a garden"},{"value":"iv","label":"iv. Helping wildlife in the city"},{"value":"v","label":"v. Food grown close to the people who eat it"},{"value":"vi","label":"vi. Slowing the flow of rainwater"},{"value":"vii","label":"vii. Laws that require green roofs"},{"value":"viii","label":"viii. The high price of fresh vegetables"}]'::jsonb, ARRAY['iv']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph D says "A third benefit is for nature" and describes roofs for birds, bees and butterflies.', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('263f7ea5-9946-44e9-92af-14a94ad826ab', 'b2ed9bf2-b98f-42a7-bdb2-9fc4db9513fe', 'matching_headings', 'Paragraph E — choose the most suitable heading.', '[{"value":"i","label":"i. Saving money on heating and cooling"},{"value":"ii","label":"ii. An old idea in a new setting"},{"value":"iii","label":"iii. Why many buildings cannot carry a garden"},{"value":"iv","label":"iv. Helping wildlife in the city"},{"value":"v","label":"v. Food grown close to the people who eat it"},{"value":"vi","label":"vi. Slowing the flow of rainwater"},{"value":"vii","label":"vii. Laws that require green roofs"},{"value":"viii","label":"viii. The high price of fresh vegetables"}]'::jsonb, ARRAY['v']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph E describes rooftop farms where "the food travels only a short distance".', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('56b3a84a-dfe4-41e0-99b3-b642e890642a', 'b2ed9bf2-b98f-42a7-bdb2-9fc4db9513fe', 'matching_headings', 'Paragraph F — choose the most suitable heading.', '[{"value":"i","label":"i. Saving money on heating and cooling"},{"value":"ii","label":"ii. An old idea in a new setting"},{"value":"iii","label":"iii. Why many buildings cannot carry a garden"},{"value":"iv","label":"iv. Helping wildlife in the city"},{"value":"v","label":"v. Food grown close to the people who eat it"},{"value":"vi","label":"vi. Slowing the flow of rainwater"},{"value":"vii","label":"vii. Laws that require green roofs"},{"value":"viii","label":"viii. The high price of fresh vegetables"}]'::jsonb, ARRAY['iii']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph F explains "the main reason is weight" and "many older buildings were not designed to carry this load."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('b46dfac3-c646-4cfe-962f-cf3206d226fe', 'b2ed9bf2-b98f-42a7-bdb2-9fc4db9513fe', 'matching_information', 'Which paragraph, A-F, contains the temperature that an ordinary roof can reach?', '[{"value":"A","label":"Paragraph A"},{"value":"B","label":"Paragraph B"},{"value":"C","label":"Paragraph C"},{"value":"D","label":"Paragraph D"},{"value":"E","label":"Paragraph E"},{"value":"F","label":"Paragraph F"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph C says a dark roof can reach "more than seventy degrees Celsius".', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('645af469-3d6d-47f6-b8d9-31c15ce15c25', 'b2ed9bf2-b98f-42a7-bdb2-9fc4db9513fe', 'matching_information', 'Which paragraph, A-F, contains an example of a roof designed for one particular species?', '[{"value":"A","label":"Paragraph A"},{"value":"B","label":"Paragraph B"},{"value":"C","label":"Paragraph C"},{"value":"D","label":"Paragraph D"},{"value":"E","label":"Paragraph E"},{"value":"F","label":"Paragraph F"}]'::jsonb, ARRAY['D']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph D mentions roofs "specially designed for a rare bird called the black redstart".', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('a184e478-36db-4359-9434-e089ec0e5fdb', 'b2ed9bf2-b98f-42a7-bdb2-9fc4db9513fe', 'matching_information', 'Which paragraph, A-F, contains educational visits for young people?', '[{"value":"A","label":"Paragraph A"},{"value":"B","label":"Paragraph B"},{"value":"C","label":"Paragraph C"},{"value":"D","label":"Paragraph D"},{"value":"E","label":"Paragraph E"},{"value":"F","label":"Paragraph F"}]'::jsonb, ARRAY['E']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph E says rooftop farms "run regular visits for school groups."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('5150ecbd-ef63-4751-9e7c-1ceb6e822ca2', 'b2ed9bf2-b98f-42a7-bdb2-9fc4db9513fe', 'summary_completion', 'Green roofs first spread from experimental buildings in ______. (ONE WORD ONLY)', '[]'::jsonb, ARRAY['Germany']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Green roofs spread "from a few experimental buildings in Germany".', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('52ea3119-ffac-427c-9763-c43fbee2d6d3', 'b2ed9bf2-b98f-42a7-bdb2-9fc4db9513fe', 'summary_completion', 'Before a garden is added, an ______ must check the strength of the roof. (ONE WORD ONLY)', '[]'::jsonb, ARRAY['engineer']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The passage says "an engineer must check that the roof is strong enough".', 10)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('b3c0031a-b015-4cba-bfa0-6f7c65498fcf', 'b2ed9bf2-b98f-42a7-bdb2-9fc4db9513fe', 'summary_completion', 'Lighter systems use small, tough plants known as ______. (ONE WORD ONLY)', '[]'::jsonb, ARRAY['sedums']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Lighter systems use "small, tough plants called sedums".', 11)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('3f4fb407-167f-41c1-ab0e-7950c3316f02', 'b2ed9bf2-b98f-42a7-bdb2-9fc4db9513fe', 'summary_completion', 'Instead of making rules, some cities offer owners ______ towards the cost. (ONE WORD ONLY)', '[]'::jsonb, ARRAY['money']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Some cities "encourage owners with money rather than force them".', 12)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('ac4d32e9-9576-48a1-960b-daf369d32c1c', 'b7a397f1-35c5-49b1-bf79-33e6e2947f5e', 3, 'Parents of teenagers often complain that their children stay up too late at night and are impossible to wake in the morning. For a long time this was seen as a question of discipline: young people, it was thought, simply needed to go to bed earlier. Over the past thirty years, however, sleep scientists have collected a great deal of evidence that the problem is mainly biological, and some of them now argue that it is schools, rather than teenagers, that should change their habits. In my view, that argument is largely correct.

The key to the problem is the body clock, the internal system that tells us when to feel sleepy and when to feel alert. One of the main signals in this system is a hormone called melatonin, which the body releases in the evening to prepare us for sleep. In young children, melatonin is released quite early, which is why they are usually ready for bed by eight o''clock. During puberty, however, the body clock shifts. Teenagers begin to release melatonin as much as two hours later than they did as children. As a result, a typical sixteen-year-old does not feel sleepy until around eleven o''clock at night, however early he or she goes to bed.

At the same time, teenagers still need a lot of sleep, between eight and ten hours a night according to most experts. A teenager who falls asleep at eleven therefore needs to sleep until at least seven, and ideally later. Yet in many countries secondary schools begin at around eight o''clock, and some students must leave home before seven to catch a bus. Surveys in the United States suggest that most high-school students sleep less than eight hours on school nights, and many sleep less than seven.

The effects of this lost sleep are serious. Tired students find it harder to concentrate and remember what they have learned, and they are more likely to feel anxious or depressed. Sleepy teenage drivers are also more likely to have accidents. Some people blame mobile phones and computers for the problem, and it is true that the bright light from screens can delay the release of melatonin even further. But teenagers were sleeping late long before smartphones were invented, and taking away their phones does not change the body clock itself.

What happens when schools start later? Several studies suggest the results can be impressive. In one well-known study in the American city of Seattle, two high schools moved their start time from 7.50 to 8.45 in the morning. Researchers measured students'' sleep with wrist monitors before and after the change. They found that students slept, on average, thirty-four minutes longer each night, and their grades in biology rose by about four and a half per cent. Attendance also improved, especially in the first lesson of the day. Similar results have been reported in Britain and Australia. Teachers in several of these schools also said that students seemed more awake and took a more active part in lessons, although this is harder to measure.

Not everyone is convinced. Some critics argue that if school starts later, students will simply go to bed later, and so gain no extra sleep. The Seattle study, however, found that bedtimes stayed roughly the same while waking times moved later, which is exactly what the body clock theory predicts. A more practical objection is cost. A later start can make it harder to organise school buses, especially where the same buses carry younger children to primary schools. It can also cause difficulties for parents who need to leave for work early, and for students who have part-time jobs or sports training after school.

These problems are real, but I do not believe they are a good reason to do nothing. Bus timetables can be changed, and many schools have found that the difficulties are smaller in practice than they expected. Moreover, the cost of tired students is also real, even if it does not appear in a school''s budget. It is paid in lower grades, poorer health and, in the worst cases, road accidents.

Some schools have tried a compromise, keeping the same start time but moving the most demanding lessons, such as mathematics, away from the first hour of the day. The early results of this approach are encouraging, though less impressive than those of a genuinely later start. It would be wrong to suggest that a later start will solve every problem. Teenagers still benefit from good habits, such as keeping screens out of the bedroom and going to bed at a similar time each night. But schools are in the unusual position of being able to give millions of young people more sleep with a single decision. In the United States, the American Academy of Pediatrics has recommended that secondary schools should start no earlier than 8.30. I believe more education authorities around the world should follow that advice.', NULL, NULL, 'You should spend about 20 minutes on Questions 27-40, which are based on Reading Passage 3 below.', '{"title":"Passage 3 — Should school start later?"}'::jsonb, 2)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('1d491531-63d9-42ce-806a-876f6c5613ff', 'ac4d32e9-9576-48a1-960b-daf369d32c1c', 'yes_no_notgiven', 'Do the following statements agree with the views of the writer? Teenagers'' sleep problems are mainly caused by a lack of discipline.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NO']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The writer reports evidence "that the problem is mainly biological" and says that argument "is largely correct".', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('de0d21a4-8027-471d-a39e-ac2185deb722', 'ac4d32e9-9576-48a1-960b-daf369d32c1c', 'yes_no_notgiven', 'Do the following statements agree with the views of the writer? Most teenagers need at least eight hours of sleep a night.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['YES']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Teenagers need "between eight and ten hours a night according to most experts."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('1d997707-19c2-44cf-a707-d9b82e868d0b', 'ac4d32e9-9576-48a1-960b-daf369d32c1c', 'yes_no_notgiven', 'Do the following statements agree with the views of the writer? Teenagers who use phones at night sleep worse than those who read books.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NOT GIVEN']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The writer says light from screens "can delay the release of melatonin" but makes no comparison with reading books.', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('600d01ab-280f-424a-aa85-aea32a49a480', 'ac4d32e9-9576-48a1-960b-daf369d32c1c', 'yes_no_notgiven', 'Do the following statements agree with the views of the writer? Removing teenagers'' phones will correct their body clocks.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NO']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The writer says "taking away their phones does not change the body clock itself."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('8b46586c-70e6-42a6-94bd-f98d7eb0529a', 'ac4d32e9-9576-48a1-960b-daf369d32c1c', 'yes_no_notgiven', 'Do the following statements agree with the views of the writer? The practical difficulties of a later start are a good reason to keep early start times.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NO']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The writer says "I do not believe they are a good reason to do nothing."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('d48b9f06-2632-4079-b3ad-59eb26e46ab2', 'ac4d32e9-9576-48a1-960b-daf369d32c1c', 'multiple_choice_single', 'According to the passage, melatonin is', '[{"value":"A","label":"A. a hormone that helps the body prepare for sleep."},{"value":"B","label":"B. released earlier in teenagers than in children."},{"value":"C","label":"C. produced only when it is completely dark."},{"value":"D","label":"D. the main cause of anxiety in young people."}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Melatonin is "a hormone" which "the body releases in the evening to prepare us for sleep."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('b83b5a9e-8513-4bfd-9882-2bb8abc8edb8', 'ac4d32e9-9576-48a1-960b-daf369d32c1c', 'multiple_choice_single', 'In the Seattle study, the school start time was moved', '[{"value":"A","label":"A. about thirty minutes later."},{"value":"B","label":"B. nearly an hour later."},{"value":"C","label":"C. to 8.30 in the morning."},{"value":"D","label":"D. to after nine o''clock."}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The schools "moved their start time from 7.50 to 8.45 in the morning", which is 55 minutes later.', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('8175a0a9-5ca0-4cf1-ba6b-3e4528dbf0a7', 'ac4d32e9-9576-48a1-960b-daf369d32c1c', 'multiple_choice_single', 'After the change in Seattle, students', '[{"value":"A","label":"A. went to bed much later than before."},{"value":"B","label":"B. slept over an hour longer each night."},{"value":"C","label":"C. went to bed at about the same time but woke later."},{"value":"D","label":"D. improved their grades in every subject."}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The study "found that bedtimes stayed roughly the same while waking times moved later".', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('cb4ea3a1-ac18-4d79-a67c-43e452e9d5bc', 'ac4d32e9-9576-48a1-960b-daf369d32c1c', 'multiple_choice_single', 'Which problem with a later start does the writer mention?', '[{"value":"A","label":"A. Teachers would have to work longer hours."},{"value":"B","label":"B. Organising school buses could be more difficult."},{"value":"C","label":"C. Primary schools would also have to start later."},{"value":"D","label":"D. Students would have less time for homework."}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The writer says "A later start can make it harder to organise school buses".', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('cb0981f9-a9a0-4b05-8cd3-49e57f47774e', 'ac4d32e9-9576-48a1-960b-daf369d32c1c', 'matching_sentence_endings', 'A typical sixteen-year-old does not feel sleepy until about eleven at night', '[{"value":"A","label":"A. because their body clock changes during puberty."},{"value":"B","label":"B. because they spend too long on homework."},{"value":"C","label":"C. which shows that a later start can improve results."},{"value":"D","label":"D. which is why light from screens is a particular problem."},{"value":"E","label":"E. unless parents set a fixed bedtime."}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'During puberty "the body clock shifts", so a sixteen-year-old "does not feel sleepy until around eleven o''clock at night".', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('83d6feb0-9c00-437e-b318-69f7c1153a17', 'ac4d32e9-9576-48a1-960b-daf369d32c1c', 'matching_sentence_endings', 'Bright light in the evening can make teenagers'' sleep problems worse', '[{"value":"A","label":"A. because their body clock changes during puberty."},{"value":"B","label":"B. because they spend too long on homework."},{"value":"C","label":"C. which shows that a later start can improve results."},{"value":"D","label":"D. which is why light from screens is a particular problem."},{"value":"E","label":"E. unless parents set a fixed bedtime."}]'::jsonb, ARRAY['D']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The passage says "the bright light from screens can delay the release of melatonin even further."', 10)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('6db18535-57b1-4908-8d7c-47d1bacab850', 'ac4d32e9-9576-48a1-960b-daf369d32c1c', 'matching_sentence_endings', 'Grades and attendance rose after the Seattle schools changed their timetable', '[{"value":"A","label":"A. because their body clock changes during puberty."},{"value":"B","label":"B. because they spend too long on homework."},{"value":"C","label":"C. which shows that a later start can improve results."},{"value":"D","label":"D. which is why light from screens is a particular problem."},{"value":"E","label":"E. unless parents set a fixed bedtime."}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'After the later start "their grades in biology rose" and "Attendance also improved".', 11)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('59aa71f3-1a82-48d8-a43d-c1d67d721a4d', 'ac4d32e9-9576-48a1-960b-daf369d32c1c', 'short_answer', 'Which organisation recommends that secondary schools start no earlier than 8.30? Write NO MORE THAN FIVE WORDS.', '[]'::jsonb, ARRAY['American Academy of Pediatrics', 'the American Academy of Pediatrics']::text[], 5, 'lenient', true, false, '{}'::jsonb, 'The passage says "the American Academy of Pediatrics has recommended that secondary schools should start no earlier than 8.30."', 12)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('422f38e1-3233-43a2-ae58-32407caec65b', 'ac4d32e9-9576-48a1-960b-daf369d32c1c', 'multiple_choice_multiple', 'Which TWO effects of lost sleep does the writer mention? Choose TWO letters.', '[{"value":"A","label":"A. difficulty concentrating"},{"value":"B","label":"B. weight gain"},{"value":"C","label":"C. a higher risk of road accidents"},{"value":"D","label":"D. arguments with parents"},{"value":"E","label":"E. poorer eyesight"}]'::jsonb, ARRAY['A', 'C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Tired students "find it harder to concentrate" and "Sleepy teenage drivers are also more likely to have accidents."', 13)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)
values ('fd1e870c-a50c-4e70-8611-2ae6d93e7c42', '4aaa0f29-4099-43d9-98a7-770e52e4690d', 'writing', 3600, 2, NULL, 2)
on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('78c06ac9-d944-4582-b6dd-f6e6bb359c56', 'fd1e870c-a50c-4e70-8611-2ae6d93e7c42', 1, 'The bar chart below shows the percentage of workers in the city of Northbridge who used five different methods of transport to travel to work in 2005 and 2025.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.', NULL, '/mock-images/academic-3-task1.svg', 'You should spend about 20 minutes on this task. Write at least 150 words.', '{"image_caption":"How people travelled to work in Northbridge, 2005 and 2025 (% of workers)","title":"Task 1"}'::jsonb, 0)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f7979d5d-81a6-4a67-9f4d-b6c763088936', '78c06ac9-d944-4582-b6dd-f6e6bb359c56', 'short_answer', 'Task 1 response', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('60225c95-31af-4c78-ac04-d72711b9967f', 'fd1e870c-a50c-4e70-8611-2ae6d93e7c42', 2, 'More and more university courses are now taught online rather than in a classroom.

Do the advantages of this development outweigh the disadvantages?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.', NULL, NULL, 'You should spend about 40 minutes on this task. Write at least 250 words.', '{"title":"Task 2"}'::jsonb, 1)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('ad9507c1-ce44-4cf6-937a-147490b0f2ec', '60225c95-31af-4c78-ac04-d72711b9967f', 'short_answer', 'Task 2 response', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)
values ('9738b527-3a42-48c2-88a0-dcccf50e0a26', '4aaa0f29-4099-43d9-98a7-770e52e4690d', 'speaking', 840, 12, NULL, 3)
on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('67c0fe99-9bbc-44d1-be06-ff6d34f1dd6c', '9738b527-3a42-48c2-88a0-dcccf50e0a26', 1, NULL, NULL, NULL, 'The examiner asks about yourself, your home, work or studies and other familiar topics. 4-5 minutes.', '{"title":"Part 1 — Introduction and familiar topics"}'::jsonb, 0)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('1c11ac22-6d0c-4052-8761-62df94ae279c', '67c0fe99-9bbc-44d1-be06-ff6d34f1dd6c', 'short_answer', 'Let''s talk about food. What kind of food do you enjoy eating most?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('290a05b5-f805-4669-9f1b-05fd75d60c3b', '67c0fe99-9bbc-44d1-be06-ff6d34f1dd6c', 'short_answer', 'Do you usually cook at home or eat out?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e4edf458-acf7-40db-9339-577aa3905118', '67c0fe99-9bbc-44d1-be06-ff6d34f1dd6c', 'short_answer', 'Is there any food you did not like as a child but like now?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('9328a05b-2a55-4b07-b701-5efb94c296e1', '67c0fe99-9bbc-44d1-be06-ff6d34f1dd6c', 'short_answer', 'Now let''s talk about weekends. What do you usually do at the weekend?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('6e286f95-4cc4-4a0f-86ea-1c984434b05e', '67c0fe99-9bbc-44d1-be06-ff6d34f1dd6c', 'short_answer', 'Do you prefer to spend weekends with friends or with family? Why?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('9f80e9a1-51c0-4a76-b8d2-2824bfecb44c', '67c0fe99-9bbc-44d1-be06-ff6d34f1dd6c', 'short_answer', 'Is there something new you would like to try at the weekend?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('6633d056-b710-4f5f-ad54-0991d520d061', '9738b527-3a42-48c2-88a0-dcccf50e0a26', 2, 'Describe a park or garden that you enjoy visiting.

You should say:
  •  where it is
  •  how often you go there
  •  what you usually do there

and explain why you enjoy visiting this place.', NULL, NULL, 'You have one minute to prepare. You may make notes. Then talk for one to two minutes. The examiner will tell you when to stop.', '{"title":"Part 2 — Individual long turn"}'::jsonb, 1)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e8aa0d57-eab6-43bf-bf08-d94f5508478d', '6633d056-b710-4f5f-ad54-0991d520d061', 'short_answer', 'Long turn response', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('795e4111-656f-4e08-a3fd-9614fd975a23', '9738b527-3a42-48c2-88a0-dcccf50e0a26', 3, NULL, NULL, NULL, 'The examiner asks further questions connected to the topic in Part 2. 4-5 minutes.', '{"title":"Part 3 — Two-way discussion"}'::jsonb, 2)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e61e44fb-5b05-41ab-9db9-2383d3421838', '795e4111-656f-4e08-a3fd-9614fd975a23', 'short_answer', 'Why do you think parks are important in cities?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('2e34a012-5f4c-431a-b771-3ee0b0b58c08', '795e4111-656f-4e08-a3fd-9614fd975a23', 'short_answer', 'Do people in your country spend enough time outdoors?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('08a9bf88-f19b-4678-b72d-ee34812396fa', '795e4111-656f-4e08-a3fd-9614fd975a23', 'short_answer', 'Should local governments spend more money on public parks? Why?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e30ac162-f518-4c31-8ced-e1b6233233ac', '795e4111-656f-4e08-a3fd-9614fd975a23', 'short_answer', 'How are parks today different from parks in the past?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('fd41f6a9-26ff-4c14-9b40-fcfeeaa9c732', '795e4111-656f-4e08-a3fd-9614fd975a23', 'short_answer', 'Do you think cities will have more or fewer green spaces in the future?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

-- Academic Mock Test 4 (academic-4)
insert into public.test_forms (id, slug, title, description, variant, delivery_mode, is_published, is_premium, difficulty, scoring_version)
values ('09ba0ecc-c1cf-45a6-8667-2bfbf893228a', 'academic-4', 'Academic Mock Test 4', 'A challenge-level Academic practice test (band 7.5+) covering all four sections.', 'academic', 'computer', true, true, 'challenge', 'v1')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, description = excluded.description, is_published = excluded.is_published, is_premium = excluded.is_premium, difficulty = excluded.difficulty;

insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)
values ('7bde28fd-7f67-435d-988f-d67b248e2991', '09ba0ecc-c1cf-45a6-8667-2bfbf893228a', 'listening', 1800, 40, NULL, 0)
on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('166d9c5f-ea60-4db9-8299-16578200e05e', '7bde28fd-7f67-435d-988f-d67b248e2991', 1, NULL, NULL, NULL, 'Questions 1-10. Complete the application notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.', '{"title":"Part 1 — Volunteering at a wildlife rescue centre"}'::jsonb, 0)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.item_group_scripts (group_id, transcript) values ('166d9c5f-ea60-4db9-8299-16578200e05e', 'HANNAH: Hello, Fernhill Wildlife Rescue, Hannah speaking.
RAVI: Hi, Hannah. I saw your appeal for volunteers in the local paper and I''d like to find out whether I could help.
HANNAH: That''s wonderful, we''re always short of people. I can take some details over the phone and start an application now, if that suits you.
RAVI: Yes, please.
HANNAH: Could I have your full name?
RAVI: Ravi Thakkar. That''s T-H-A-K-K-A-R.
HANNAH: Double K?
RAVI: That''s right. People usually put a C in there somewhere, but it''s just the two Ks.
HANNAH: Got it. And your postcode?
RAVI: It''s BS7 4QD. Sorry, I''ve just moved, so let me think. No, that was my old one. The new one is BS7 4QB.
HANNAH: B for bravo at the end?
RAVI: Yes, B for bravo.
HANNAH: Thanks. Now, availability. Most of our volunteers come in on a regular morning each week, because that''s when the animals are cleaned and fed.
RAVI: I''d originally thought Tuesdays, because I don''t start work until midday then. But my manager has just moved our team meeting to Tuesday mornings, so it would have to be Thursday mornings instead.
HANNAH: Thursday is actually ideal, we''re quite thin on the ground that day. Have you done any work with animals before?
RAVI: Not with wild animals. I helped out at a dog rescue charity for a few months when I was a student, mainly walking the dogs, but the longest I''ve done anything was two years at a riding school, mucking out the stables and leading the ponies.
HANNAH: The riding school is probably the most relevant, so I''ll put that down. Handling large animals safely is a good skill to have. Do you have a preference for which unit you''d like to work in?
RAVI: I''d been hoping for the bird unit, if I''m honest.
HANNAH: I''m afraid that''s the one area where we have a waiting list. It''s very popular. But the hedgehog unit is crying out for help at this time of year, because so many young ones are found underweight in the autumn.
RAVI: Hedgehogs would be great, actually. I''d be happy with that.
HANNAH: Lovely. Everyone starts with an induction session, which covers hygiene, handling and what to do if you''re bitten or scratched. It used to be a two-hour session, but we''ve added a practical element, so it now takes three hours, usually on a Saturday.
RAVI: That''s fine. Is there anything I need to bring or wear?
HANNAH: Old clothes, definitely, and we''ll provide gloves and overalls. The one thing we insist on is waterproof boots, because the floors in the units are hosed down several times a day. Trainers just get soaked.
RAVI: I''ve got a pair of wellingtons, so that''s no problem.
HANNAH: Good. There''s also a health requirement. You don''t need rabies cover or anything like that, but you must be up to date with your tetanus vaccination, because of the risk from scratches and bites.
RAVI: I think I had one about five years ago, but I''ll check with my doctor.
HANNAH: Please do. We''ll ask to see a record. Lastly, we need one reference. Many people give us a tutor or a friend, but we specifically ask for someone who has supervised you at work, ideally your line manager.
RAVI: That''s easy, my line manager will be happy to do it.
HANNAH: Excellent. So, if the reference and the vaccination record arrive in time, you could start in the first week of October. Let''s say Thursday the second of October.
RAVI: The second of October. Perfect. Thanks very much, Hannah.
HANNAH: Thank you, Ravi. I''ll email you the forms today.')
on conflict (group_id) do update set transcript = excluded.transcript;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('ff42d0c6-bed2-4b1e-b5ab-354f3b60b1eb', '166d9c5f-ea60-4db9-8299-16578200e05e', 'note_completion', 'Surname: ______', '[]'::jsonb, ARRAY['Thakkar']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Ravi spells it "T-H-A-K-K-A-R" and confirms "it''s just the two Ks."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('67e80a5c-c4e4-4d44-841e-c942f78c6348', '166d9c5f-ea60-4db9-8299-16578200e05e', 'note_completion', 'Postcode: ______', '[]'::jsonb, ARRAY['BS7 4QB']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'BS7 4QD "was my old one. The new one is BS7 4QB."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('bb9794df-2b97-4525-80f5-4f220ae8628c', '166d9c5f-ea60-4db9-8299-16578200e05e', 'note_completion', 'Available on ______ mornings', '[]'::jsonb, ARRAY['Thursday', 'Thursdays']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Tuesdays are no longer possible, "so it would have to be Thursday mornings instead."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e38b5181-d576-41d6-a52e-fa1e32ec15fd', '166d9c5f-ea60-4db9-8299-16578200e05e', 'note_completion', 'Most relevant experience: two years at a ______', '[]'::jsonb, ARRAY['riding school']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Hannah says "The riding school is probably the most relevant, so I''ll put that down."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('a5f0b95d-8d83-45b1-93f0-6fa4d8b35b8b', '166d9c5f-ea60-4db9-8299-16578200e05e', 'note_completion', 'Unit: ______ unit', '[]'::jsonb, ARRAY['hedgehog']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'The bird unit has a waiting list; Ravi agrees, "Hedgehogs would be great, actually."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('5129a662-c182-4831-aa7e-310cc9a3113b', '166d9c5f-ea60-4db9-8299-16578200e05e', 'note_completion', 'Induction session lasts ______ hours', '[]'::jsonb, ARRAY['3', 'three']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'It "used to be a two-hour session" but "it now takes three hours".', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('264fe002-5280-46e2-ab75-290eb45ad17c', '166d9c5f-ea60-4db9-8299-16578200e05e', 'note_completion', 'Must wear ______ boots', '[]'::jsonb, ARRAY['waterproof']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Hannah says "The one thing we insist on is waterproof boots".', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('a75c1498-31ef-46d2-a408-125880db5ed0', '166d9c5f-ea60-4db9-8299-16578200e05e', 'note_completion', 'Must be up to date with ______ vaccination', '[]'::jsonb, ARRAY['tetanus']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Rabies cover is not needed, but "you must be up to date with your tetanus vaccination".', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('179fc557-6378-49fc-a37a-2e3ba6228929', '166d9c5f-ea60-4db9-8299-16578200e05e', 'note_completion', 'Reference from: ______', '[]'::jsonb, ARRAY['line manager', 'manager']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Not a tutor or friend: "ideally your line manager."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('8350a023-f1a0-4b7f-85be-40f0246757e1', '166d9c5f-ea60-4db9-8299-16578200e05e', 'note_completion', 'Start date: Thursday ______ October', '[]'::jsonb, ARRAY['2nd', '2', 'second']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Hannah says "Let''s say Thursday the second of October."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('4c1ccd01-31f8-42b2-837b-b106d962a3df', '7bde28fd-7f67-435d-988f-d67b248e2991', 2, NULL, NULL, NULL, 'Questions 11-20. Choose the correct letter for Questions 11-14. For Questions 15-20, choose the feature (A-G) that matches each site on the canal.', '{"title":"Part 2 — Talk on the restoration of the Harnley Canal"}'::jsonb, 1)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.item_group_scripts (group_id, transcript) values ('4c1ccd01-31f8-42b2-837b-b106d962a3df', 'SPEAKER: Good evening, and thank you for coming. I''m Clare Sowerby, chair of the Harnley Canal Trust, and tonight I want to give you an overview of where the restoration stands, twenty years after we began.
SPEAKER: Let me start with a little history, because there''s a common misconception. People often assume the canal fell out of use because of the railways. The railway certainly took some of its trade, but the canal carried coal profitably right up until 1936. What actually finished it was a breach near Ellerby, where the bank collapsed after a winter of heavy rain. The company simply couldn''t afford the repair, and the water was drained.
SPEAKER: When the Trust was founded, our first instinct was to raise money through grants. In the end, though, the single biggest contribution has not been money at all. Grants have covered around a third of the cost, and fundraising events much less. What has really made the difference is volunteer labour. We estimate that volunteers have given over two hundred thousand hours, and if we''d had to pay for that, the project would never have happened.
SPEAKER: People also ask why it has taken so long. Finance is part of it, and so is the sheer amount of silt we''ve had to remove. But the main delay, and I don''t think anyone foresaw this, has been the planning and environmental approvals. Every section has needed its own survey, and some have taken several years to be signed off.
SPEAKER: Looking ahead, our priority for the next five years is not, as some members would like, to extend the canal further west. Nor is it to build the new visitor centre, although that remains a long-term ambition. The board has agreed that what matters most is securing the water supply, because without a reliable reservoir the restored sections will not stay navigable through a dry summer.
SPEAKER: Now let me take you along the canal, from east to west, and describe some of the sites you can visit.
SPEAKER: We start at Bramley Lock. When we began, there was almost nothing left of it but a hole in the ground. The original stone had long since been taken away for local buildings, so we had to source new stone from a quarry in the next valley. What''s special about Bramley is the gates. Instead of the traditional wooden beams that boaters push by hand, they''re operated hydraulically, at the touch of a button, which makes the lock usable by people with limited strength.
SPEAKER: A little further on is the Ellerby Aqueduct, where the canal crosses the river. This is the site of the breach I mentioned. The engineers wanted to replace it with concrete, but the planners insisted that the aqueduct be rebuilt using the original stone, and every block was numbered, recovered from the river bed and put back in its place. It took four years.
SPEAKER: Next is the old Toll House. For a while we used it as our office, and many people think it still is. But since the office moved into town, the Toll House has become our training base. Every new volunteer spends their first day there, learning about safety and tools.
SPEAKER: Then we come to Haddon Tunnel. The tunnel is around eight hundred metres long and, I should warn you, there''s no towpath through it. It''s also home to a colony of bats, and because bats are a protected species, the tunnel is closed to boats and walkers from November to March while they hibernate. So if you want to see it, come in the summer.
SPEAKER: Beyond the tunnel is Carver''s Wharf. People sometimes think the restoration there was paid for by the council. In fact the council gave us the land, but the work itself was paid for entirely by a group of businesses in the town, who wanted a place to hold markets.
SPEAKER: And finally, at the western end, the Lock Keeper''s Cottage. It''s been restored as it would have looked in the 1890s, and upstairs there''s a small exhibition about the lives of the people who worked on the canal, the boatmen, the lock keepers and their families. I''d really recommend it.
SPEAKER: Now, before I take questions, let me say a few words about how you can get involved.')
on conflict (group_id) do update set transcript = excluded.transcript;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('2459049e-4c55-4b2f-9fa5-1ff3b1933485', '4c1ccd01-31f8-42b2-837b-b106d962a3df', 'multiple_choice_single', 'According to the speaker, the canal closed mainly because of', '[{"value":"A","label":"A. competition from the railways"},{"value":"B","label":"B. damage caused by bad weather"},{"value":"C","label":"C. a fall in demand for coal"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The speaker says "What actually finished it was a breach near Ellerby, where the bank collapsed after a winter of heavy rain."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('b901af7f-2a14-4db3-a088-d58c41cc27c2', '4c1ccd01-31f8-42b2-837b-b106d962a3df', 'multiple_choice_single', 'What has contributed most to the restoration?', '[{"value":"A","label":"A. grants"},{"value":"B","label":"B. fundraising events"},{"value":"C","label":"C. unpaid work"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Grants covered "around a third", but "What has really made the difference is volunteer labour."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('47f492f6-8671-448a-a441-9485be4fec40', '4c1ccd01-31f8-42b2-837b-b106d962a3df', 'multiple_choice_single', 'The main cause of delay has been', '[{"value":"A","label":"A. obtaining official permission"},{"value":"B","label":"B. a shortage of money"},{"value":"C","label":"C. the removal of silt"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The speaker says the main delay "has been the planning and environmental approvals."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('30e22021-8df1-43b3-880d-cedddceca00c', '4c1ccd01-31f8-42b2-837b-b106d962a3df', 'multiple_choice_single', 'The Trust''s priority for the next five years is to', '[{"value":"A","label":"A. extend the canal westwards"},{"value":"B","label":"B. build a visitor centre"},{"value":"C","label":"C. ensure a reliable supply of water"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The board agreed "what matters most is securing the water supply".', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('46732fdc-6bf5-400d-97be-d25dd338d019', '4c1ccd01-31f8-42b2-837b-b106d962a3df', 'matching_features', 'Bramley Lock', '[{"value":"A","label":"A. It was rebuilt using the original stone."},{"value":"B","label":"B. It is now used for training volunteers."},{"value":"C","label":"C. It has been fitted with a modern mechanism."},{"value":"D","label":"D. It provides a habitat for a protected species."},{"value":"E","label":"E. It was funded entirely by local businesses."},{"value":"F","label":"F. It is closed to the public for part of the year."},{"value":"G","label":"G. It contains an exhibition about canal workers."}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The original stone was gone, and the gates are "operated hydraulically, at the touch of a button".', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('3e8f9899-ca20-40e4-9ccb-6cdf712708d4', '4c1ccd01-31f8-42b2-837b-b106d962a3df', 'matching_features', 'Ellerby Aqueduct', '[{"value":"A","label":"A. It was rebuilt using the original stone."},{"value":"B","label":"B. It is now used for training volunteers."},{"value":"C","label":"C. It has been fitted with a modern mechanism."},{"value":"D","label":"D. It provides a habitat for a protected species."},{"value":"E","label":"E. It was funded entirely by local businesses."},{"value":"F","label":"F. It is closed to the public for part of the year."},{"value":"G","label":"G. It contains an exhibition about canal workers."}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The planners insisted "that the aqueduct be rebuilt using the original stone".', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('570ed535-ca54-4cf4-9c8d-8d98bf8098f1', '4c1ccd01-31f8-42b2-837b-b106d962a3df', 'matching_features', 'Toll House', '[{"value":"A","label":"A. It was rebuilt using the original stone."},{"value":"B","label":"B. It is now used for training volunteers."},{"value":"C","label":"C. It has been fitted with a modern mechanism."},{"value":"D","label":"D. It provides a habitat for a protected species."},{"value":"E","label":"E. It was funded entirely by local businesses."},{"value":"F","label":"F. It is closed to the public for part of the year."},{"value":"G","label":"G. It contains an exhibition about canal workers."}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'It is no longer the office: "the Toll House has become our training base."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('346f9d98-85be-4213-aead-94de1982feea', '4c1ccd01-31f8-42b2-837b-b106d962a3df', 'matching_features', 'Haddon Tunnel', '[{"value":"A","label":"A. It was rebuilt using the original stone."},{"value":"B","label":"B. It is now used for training volunteers."},{"value":"C","label":"C. It has been fitted with a modern mechanism."},{"value":"D","label":"D. It provides a habitat for a protected species."},{"value":"E","label":"E. It was funded entirely by local businesses."},{"value":"F","label":"F. It is closed to the public for part of the year."},{"value":"G","label":"G. It contains an exhibition about canal workers."}]'::jsonb, ARRAY['F']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Because of the bats, "the tunnel is closed to boats and walkers from November to March".', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('8e13074a-c3d9-436c-90fc-2cd9bcb24cba', '4c1ccd01-31f8-42b2-837b-b106d962a3df', 'matching_features', 'Carver''s Wharf', '[{"value":"A","label":"A. It was rebuilt using the original stone."},{"value":"B","label":"B. It is now used for training volunteers."},{"value":"C","label":"C. It has been fitted with a modern mechanism."},{"value":"D","label":"D. It provides a habitat for a protected species."},{"value":"E","label":"E. It was funded entirely by local businesses."},{"value":"F","label":"F. It is closed to the public for part of the year."},{"value":"G","label":"G. It contains an exhibition about canal workers."}]'::jsonb, ARRAY['E']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The council gave the land, "but the work itself was paid for entirely by a group of businesses in the town".', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('9f990b14-ccb2-47c1-a63e-b295be097bcf', '4c1ccd01-31f8-42b2-837b-b106d962a3df', 'matching_features', 'Lock Keeper''s Cottage', '[{"value":"A","label":"A. It was rebuilt using the original stone."},{"value":"B","label":"B. It is now used for training volunteers."},{"value":"C","label":"C. It has been fitted with a modern mechanism."},{"value":"D","label":"D. It provides a habitat for a protected species."},{"value":"E","label":"E. It was funded entirely by local businesses."},{"value":"F","label":"F. It is closed to the public for part of the year."},{"value":"G","label":"G. It contains an exhibition about canal workers."}]'::jsonb, ARRAY['G']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Upstairs "there''s a small exhibition about the lives of the people who worked on the canal".', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('929c6273-a4e5-4890-87db-62f81802400d', '7bde28fd-7f67-435d-988f-d67b248e2991', 3, NULL, NULL, NULL, 'Questions 21-30. Choose the correct letter for Questions 21-25. For Questions 26-30, decide who expresses each view: A Lena only, B Omar only, or C both Lena and Omar.', '{"title":"Part 3 — Tutorial on a dissertation about behavioural ''nudges''"}'::jsonb, 2)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.item_group_scripts (group_id, transcript) values ('929c6273-a4e5-4890-87db-62f81802400d', 'PROF GRANT: Right, Lena, Omar, thanks for coming. You''ve sent me a joint proposal on nudges in pension saving. Before we get into detail, tell me in a sentence what you''re actually trying to find out.
LENA: We started with the question of whether automatic enrolment increases saving, but that''s been answered many times. So what we''re really asking is whether the effect lasts, whether people who were enrolled by default are still saving at the same rate five or ten years later.
PROF GRANT: Persistence, then, not the initial effect. Good, that''s a much better question. Where''s your data coming from?
OMAR: We''d hoped to run our own survey, but realistically we''d never get the sample size. Then we looked at government statistics, but they''re only published in aggregate. What we''ve managed to get is access to an anonymised dataset from a large employer''s pension provider, covering about forty thousand employees over twelve years.
PROF GRANT: That''s a real coup. Has the ethics committee approved it?
LENA: Provisionally. They want us to confirm how the data will be stored before final approval.
PROF GRANT: Fine. Now, I read your literature review, and frankly it''s thorough, perhaps too thorough. The issue isn''t that you''ve missed anything important, and the writing is clear. The problem is that you summarise each study in turn without ever saying how they relate to each other. I want to see you comparing and evaluating, not listing.
OMAR: So we should organise it by theme rather than by author?
PROF GRANT: Exactly. Now, the critics. You mention that nudges have been accused of being manipulative. What''s your position?
OMAR: I''m honestly not sure the manipulation argument holds up. You can always opt out of a default, so nobody''s choice is being removed.
LENA: I''d go further than that, actually. The alternative to a default isn''t neutrality. There''s always some default, even if it''s not enrolling. So the question is only which default is set.
PROF GRANT: That''s a well-known argument. But you might also consider that people rarely notice a default, which is the whole reason it works.
LENA: That''s fair. I still think it''s justified when the default clearly serves people''s interests.
PROF GRANT: And methodology. Why not a randomised trial?
OMAR: The employer changed its policy in a single year, so we can compare people hired just before and just after. It''s not randomised, but it''s close.
PROF GRANT: A natural experiment. Good. Just be careful about what else changed that year.
PROF GRANT: Finally, which journal articles will you lean on most? You cite Madrian and Shea a great deal.
LENA: Their study is the foundation, but it only covers about a year. The paper we''ll rely on most is the Danish one by Chetty and colleagues, because it follows people for much longer.
PROF GRANT: Sensible. Now, before you go, let''s talk about the risks to the project. Talk me through what each of you is worried about.
OMAR: For me, it''s the data. Twelve years sounds like a lot, but people change jobs, so a lot of them will drop out of the records. If too many leave, we can''t really say anything about persistence.
LENA: I''m worried about that too, yes. Attrition is a genuine risk for both of us. The other thing on my mind is the word limit. There''s so much we could say about the policy implications that I can see us running over.
OMAR: I''m less concerned about that. We can always move material into an appendix.
PROF GRANT: What about the statistical side? Panel data can be tricky.
OMAR: That doesn''t worry me. I took the advanced econometrics module last year, and we used this kind of model all the time.
LENA: I haven''t done that module, so I''ll need to read up, but between us I think we''re covered.
PROF GRANT: And the timetable?
LENA: I think we''re fine for time, provided the ethics approval comes through this month.
OMAR: Agreed. The real pressure point is getting the dataset cleaned. I''d say that will take at least six weeks, and I think we''ve both underestimated it so far.
LENA: Yes, I''d accept that. We probably have.
PROF GRANT: Good. Honesty about that now will save you a lot of trouble later. Let''s meet again in a fortnight.')
on conflict (group_id) do update set transcript = excluded.transcript;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('1baa9af9-62e9-4397-872f-1b5f2f12b77e', '929c6273-a4e5-4890-87db-62f81802400d', 'multiple_choice_single', 'What is the main research question of the dissertation?', '[{"value":"A","label":"A. whether automatic enrolment increases saving"},{"value":"B","label":"B. whether the effect of automatic enrolment is long-lasting"},{"value":"C","label":"C. why some employees opt out of pension schemes"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Lena says they are asking "whether the effect lasts", and the professor sums it up as "Persistence, then, not the initial effect."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('9e6a430e-03fd-4b4f-a967-034da0bba527', '929c6273-a4e5-4890-87db-62f81802400d', 'multiple_choice_single', 'The students will obtain their data from', '[{"value":"A","label":"A. their own survey"},{"value":"B","label":"B. published government statistics"},{"value":"C","label":"C. a pension provider"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Omar says they have "access to an anonymised dataset from a large employer''s pension provider".', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('63c734fa-b8a5-44e7-bce7-6e6c034bc5e7', '929c6273-a4e5-4890-87db-62f81802400d', 'multiple_choice_single', 'What is Professor Grant''s criticism of the literature review?', '[{"value":"A","label":"A. It leaves out key studies."},{"value":"B","label":"B. It describes studies without connecting them."},{"value":"C","label":"C. It is not clearly written."}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'He says "you summarise each study in turn without ever saying how they relate to each other."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('76ba9baa-808f-4a92-81af-39313d054589', '929c6273-a4e5-4890-87db-62f81802400d', 'multiple_choice_single', 'Why do the students not use a randomised trial?', '[{"value":"A","label":"A. The ethics committee would not allow it."},{"value":"B","label":"B. A policy change provides a comparable situation."},{"value":"C","label":"C. The employer refused to take part."}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Omar explains "The employer changed its policy in a single year, so we can compare people hired just before and just after."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('fd85276e-c99f-4156-b794-622a66356ab4', '929c6273-a4e5-4890-87db-62f81802400d', 'multiple_choice_single', 'Which study will the students depend on most?', '[{"value":"A","label":"A. one that covers a longer period"},{"value":"B","label":"B. the original study of automatic enrolment"},{"value":"C","label":"C. one that uses a randomised design"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Lena says they will "rely on most" the Danish paper "because it follows people for much longer."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f77fa85e-edbb-4f9a-8ddb-f88847f631c1', '929c6273-a4e5-4890-87db-62f81802400d', 'matching_features', 'Default options are not necessarily manipulative.', '[{"value":"A","label":"A. Lena only"},{"value":"B","label":"B. Omar only"},{"value":"C","label":"C. both Lena and Omar"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Omar is "not sure the manipulation argument holds up" and Lena says "I''d go further than that, actually."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('44496ca8-3764-4cdf-817b-f97beda257ba', '929c6273-a4e5-4890-87db-62f81802400d', 'matching_features', 'Many people may disappear from the dataset.', '[{"value":"A","label":"A. Lena only"},{"value":"B","label":"B. Omar only"},{"value":"C","label":"C. both Lena and Omar"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Omar fears people "will drop out of the records" and Lena says "Attrition is a genuine risk for both of us."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('c1b88115-ecf9-4823-b590-8fb7e692ecf1', '929c6273-a4e5-4890-87db-62f81802400d', 'matching_features', 'Keeping within the word limit could be a problem.', '[{"value":"A","label":"A. Lena only"},{"value":"B","label":"B. Omar only"},{"value":"C","label":"C. both Lena and Omar"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Lena worries "I can see us running over", but Omar says "I''m less concerned about that."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('3166a33f-4c1f-406f-bb25-276e33fc67bd', '929c6273-a4e5-4890-87db-62f81802400d', 'matching_features', 'The statistical analysis will not be difficult.', '[{"value":"A","label":"A. Lena only"},{"value":"B","label":"B. Omar only"},{"value":"C","label":"C. both Lena and Omar"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Omar says "That doesn''t worry me", while Lena says she will "need to read up".', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('1f6d0c40-c28b-4d97-ae39-478918828a85', '929c6273-a4e5-4890-87db-62f81802400d', 'matching_features', 'Preparing the data will take longer than expected.', '[{"value":"A","label":"A. Lena only"},{"value":"B","label":"B. Omar only"},{"value":"C","label":"C. both Lena and Omar"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Omar says "we''ve both underestimated it so far" and Lena agrees, "Yes, I''d accept that. We probably have."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('c05a456a-f45b-4f09-9355-9f8105da6f74', '7bde28fd-7f67-435d-988f-d67b248e2991', 4, NULL, NULL, NULL, 'Questions 31-40. Complete the notes below. Write ONE WORD ONLY for each answer.', '{"title":"Part 4 — Lecture: life around deep-sea hydrothermal vents"}'::jsonb, 3)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.item_group_scripts (group_id, transcript) values ('c05a456a-f45b-4f09-9355-9f8105da6f74', 'LECTURER: Good morning. Today we turn to one of the most significant discoveries in twentieth-century biology, the ecosystems that surround hydrothermal vents on the deep ocean floor, and what they have done to our ideas about where life can exist.
LECTURER: Hydrothermal vents form along mid-ocean ridges, where tectonic plates are pulling apart. Seawater seeps down through cracks in the crust, is heated by magma beneath, and rises again carrying dissolved minerals. When this superheated fluid, which can exceed four hundred degrees Celsius, meets the near-freezing water of the deep sea, the minerals precipitate out and build tall chimneys. The darkest of these are known as black smokers, the colour coming from iron sulphide particles.
LECTURER: The vents themselves were predicted by geologists before they were observed. What nobody predicted was the life around them. In 1977, a team diving in the submersible Alvin near the Galápagos Islands went down expecting to measure water temperature and chemistry. They had brought no biologists at all. What they found were dense communities of clams, mussels and, most strikingly, giant tube worms more than two metres long.
LECTURER: The puzzle was obvious. At these depths there is no sunlight, so there can be no photosynthesis. Until then it had been assumed that virtually all life on Earth ultimately depended on the sun, with the deep sea surviving on a slow rain of organic debris from above. That debris is far too sparse to support communities this dense.
LECTURER: The answer turned out to be chemosynthesis. Certain bacteria are able to obtain energy by oxidising hydrogen sulphide, the chemical that gives the vent fluid its smell of rotten eggs, and they use that energy to make organic compounds from carbon dioxide. These bacteria are the primary producers of the vent ecosystem, playing the role that plants play on land.
LECTURER: The giant tube worm, Riftia, illustrates this beautifully. As an adult it has no mouth and no gut. Instead, it has an organ called the trophosome, packed with billions of symbiotic bacteria. The worm''s bright red plume, which gets its colour from a specialised form of haemoglobin, absorbs sulphide and oxygen from the water and delivers them to the bacteria, which in return supply the worm with food. It''s a partnership so complete that neither can survive without the other.
LECTURER: Vent communities are also remarkably unstable. A vent may remain active for only a few decades before the flow of fluid shifts or stops, and when it does, the community around it dies. This raises a question that occupied researchers for years: how do animals colonise new vents, which may be hundreds of kilometres apart? The current view is that their larvae drift in deep ocean currents, sometimes for weeks, and that only a tiny proportion happen to settle at a new site.
LECTURER: One recent finding concerns a snail found in the Indian Ocean, which has gone a step further than most vent animals. It builds scales on its foot out of iron sulphide drawn from the vent fluid, effectively a coat of metal armour. Engineers have studied the structure of these scales because of its ability to absorb impacts.
LECTURER: Why does all this matter beyond biology? Partly because of the origin of life. Some researchers argue that life on Earth may have begun not in a warm surface pool, as Darwin suggested, but around vents like these, where chemical energy was plentiful. And partly because of the search for life elsewhere. Jupiter''s moon Europa and Saturn''s moon Enceladus both appear to have liquid oceans beneath their ice, and there is evidence of vent activity on Enceladus in particular.
LECTURER: Finally, a note of concern. Many vent fields contain valuable metals such as copper, zinc and gold, and several companies have applied for licences to mine them. Because vent species are often found nowhere else, scientists have called for a moratorium on mining until the ecosystems are better understood.
LECTURER: That''s all for today. Next week we''ll look at cold seeps, which are related but rather different.')
on conflict (group_id) do update set transcript = excluded.transcript;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('c56ecb73-3939-4a25-bac9-0c787f72a315', 'c05a456a-f45b-4f09-9355-9f8105da6f74', 'note_completion', 'Vents form where tectonic plates are separating along mid-ocean ______', '[]'::jsonb, ARRAY['ridges']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The lecturer says "Hydrothermal vents form along mid-ocean ridges".', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('9479a447-f4d6-49e0-9a41-aea9910d2e52', 'c05a456a-f45b-4f09-9355-9f8105da6f74', 'note_completion', 'Black smokers get their colour from particles of iron ______', '[]'::jsonb, ARRAY['sulphide', 'sulfide']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'He says "the colour coming from iron sulphide particles."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('636fd92f-4510-454c-a90d-49b48ea7a6a0', 'c05a456a-f45b-4f09-9355-9f8105da6f74', 'note_completion', 'The 1977 Alvin expedition included no ______', '[]'::jsonb, ARRAY['biologists']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The team "had brought no biologists at all."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f883c52e-a17c-4572-94ec-414e31dd4fc5', 'c05a456a-f45b-4f09-9355-9f8105da6f74', 'note_completion', 'Before 1977, deep-sea life was thought to depend on organic ______ falling from above', '[]'::jsonb, ARRAY['debris']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'It was assumed the deep sea survived "on a slow rain of organic debris from above."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('147ccc2d-d20e-4340-878d-93a29abf271f', 'c05a456a-f45b-4f09-9355-9f8105da6f74', 'note_completion', 'Vent bacteria gain energy by oxidising hydrogen ______', '[]'::jsonb, ARRAY['sulphide', 'sulfide']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Bacteria "obtain energy by oxidising hydrogen sulphide".', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('15419626-3f65-4bf3-9df8-98c06b96fdea', 'c05a456a-f45b-4f09-9355-9f8105da6f74', 'note_completion', 'Adult Riftia lacks a mouth and a ______', '[]'::jsonb, ARRAY['gut']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'As an adult it "has no mouth and no gut."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('609df153-c7f4-41cb-9b8c-23993ea9d821', 'c05a456a-f45b-4f09-9355-9f8105da6f74', 'note_completion', 'The red plume contains a special form of ______', '[]'::jsonb, ARRAY['haemoglobin', 'hemoglobin']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The plume "gets its colour from a specialised form of haemoglobin".', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('37e8159e-c6ad-4328-8f2e-41115b517e46', 'c05a456a-f45b-4f09-9355-9f8105da6f74', 'note_completion', 'New vents are colonised by ______ carried in ocean currents', '[]'::jsonb, ARRAY['larvae']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The current view is "that their larvae drift in deep ocean currents".', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('0f45d810-97b2-4d20-af87-f52d5c929b0d', 'c05a456a-f45b-4f09-9355-9f8105da6f74', 'note_completion', 'An Indian Ocean snail has iron scales on its ______', '[]'::jsonb, ARRAY['foot']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The snail "builds scales on its foot out of iron sulphide".', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('ab1880ca-b715-4d3c-94e8-62efe0da2baf', 'c05a456a-f45b-4f09-9355-9f8105da6f74', 'note_completion', 'Scientists have called for a ______ on mining vent fields', '[]'::jsonb, ARRAY['moratorium']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Scientists "have called for a moratorium on mining until the ecosystems are better understood."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)
values ('92225587-b842-4d77-9b9e-38cb512d8340', '09ba0ecc-c1cf-45a6-8667-2bfbf893228a', 'reading', 3600, 40, NULL, 1)
on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('b6187cd1-bc00-4824-9e6a-ce75e214fa86', '92225587-b842-4d77-9b9e-38cb512d8340', 1, 'When Arthur Evans began excavating at Knossos on Crete in 1900, he expected to find evidence of a literate Bronze Age civilisation, and within weeks he had it: clay tablets incised with an unfamiliar script. Over the following decades some three thousand tablets emerged from the site, most of them bearing the script Evans named Linear B, to distinguish it from an older and still undeciphered system he called Linear A. Their decipherment, achieved half a century later, is often narrated as the triumph of a single gifted amateur. The truth is more interesting, and more instructive about how such problems are actually solved.

Evans himself was, paradoxically, the principal obstacle. Convinced that the palace culture he had uncovered, which he christened Minoan, was entirely distinct from that of mainland Greece, he dismissed any suggestion that the tablets might record an early form of Greek. His authority in the field was immense, and his reluctance to publish more than a fraction of the inscriptions meant that for forty years scholars worked from a sample too small to support serious analysis. Only after his death in 1941 did a fuller corpus become available.

By then the problem had been transformed by events on the mainland. In 1939 Carl Blegen, an American archaeologist, uncovered an archive of some six hundred tablets at Pylos in the western Peloponnese, written in the same script. Blegen did not attempt a decipherment himself, but the discovery was fatal to the assumption that Linear B was exclusively Cretan. If the script had been used in a Greek-speaking region, the possibility that it recorded Greek could no longer be dismissed out of hand.

The most important analytical work was done by Alice Kober, a classicist at Brooklyn College, who in the 1940s approached the script without committing herself to any hypothesis about its language. Working through the inscriptions by hand and recording each sign on index cards, she noticed that certain words appeared in three related forms, sharing a common stem but ending differently. These sets, later called "Kober''s triplets", indicated that the language was inflected: like Latin or Greek, it changed the endings of words to mark grammatical case. More subtly, she observed that the final sign of the stem sometimes changed as well, which implied that some signs represented a consonant and a vowel together, and that signs sharing a consonant could be grouped. Kober refused to speculate about what the language was; she insisted that the structure had to be established first. She died in 1950, two years before the breakthrough her method made possible.

It was Michael Ventris, a British architect who had been fascinated by the script since hearing Evans lecture when he was fourteen, who turned Kober''s insight into a working system. Ventris constructed a grid in which signs that appeared to share a consonant were placed in the same row and those that appeared to share a vowel in the same column. Crucially, the grid could be filled in without knowing the actual sound of any sign: it recorded relationships, not values. Ventris circulated his progress in a series of "work notes" to other scholars, and for most of this period he believed, as Evans had, that the language was probably related to Etruscan.

The decisive step came in 1952, when Ventris experimented with assigning sound values to a few signs on the basis of place names. Certain words occurred frequently in the Knossos tablets but not at Pylos, which suggested they were local names. If one of them was read as ko-no-so, Knossos, and another as a-mi-ni-so, the nearby harbour of Amnisos, the values thus fixed could be carried across the grid to other signs. Ventris found, to his own surprise, that words began to emerge that were recognisably Greek, albeit an archaic Greek some five centuries older than Homer. He announced the result in a radio broadcast in July 1952, describing it with characteristic caution as a working hypothesis.

Ventris then sought the collaboration of John Chadwick, a Cambridge philologist with expertise in early Greek dialects, and together they published the full case in 1953. Confirmation arrived almost immediately. A tablet newly excavated by Blegen at Pylos showed pictures of tripod cauldrons alongside a word that, read by the Ventris grid, spelled ti-ri-po, tripod. Sceptics persisted for some years, but the weight of such independent checks eventually silenced them. Ventris did not live to see the consensus fully established; he was killed in a road accident in 1956, at the age of thirty-four.

What the tablets contain has disappointed those who hoped for poetry or history. They are almost entirely administrative: inventories of livestock, rations for workers, lists of bronze and textiles, records of offerings to deities. Yet that is precisely their value. They reveal a highly centralised economy in which palace scribes tracked goods with remarkable precision, and they push the written history of the Greek language back by several centuries. The decipherment also stands as a model of method. It was achieved not by inspired guesswork but by the patient establishment of internal structure, followed by a hypothesis that could be tested against evidence its author had not yet seen.', NULL, NULL, 'You should spend about 20 minutes on Questions 1-13, which are based on Reading Passage 1 below.', '{"title":"Passage 1 — Reading Linear B"}'::jsonb, 0)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('31fed9ac-4fe0-4d0e-b948-09f10b4ace88', 'b6187cd1-bc00-4824-9e6a-ce75e214fa86', 'true_false_notgiven', 'Evans named the Linear B script in order to separate it from another writing system.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['TRUE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Evans named it Linear B "to distinguish it from an older and still undeciphered system he called Linear A."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('6a226cd4-8087-4d9b-88c0-5cb1b1d8826c', 'b6187cd1-bc00-4824-9e6a-ce75e214fa86', 'true_false_notgiven', 'Evans published most of the Knossos inscriptions during his lifetime.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['FALSE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Evans showed "reluctance to publish more than a fraction of the inscriptions"; a fuller corpus appeared only "after his death".', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('92c20813-2937-4999-9ca4-84b3b8bb4bbe', 'b6187cd1-bc00-4824-9e6a-ce75e214fa86', 'true_false_notgiven', 'Blegen proposed that the Pylos tablets were written in Greek.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['FALSE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The passage says "Blegen did not attempt a decipherment himself".', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('5a59163c-d253-4656-ad34-75d087b34e27', 'b6187cd1-bc00-4824-9e6a-ce75e214fa86', 'true_false_notgiven', 'Kober''s index cards were later donated to a university archive.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NOT GIVEN']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The passage says she recorded "each sign on index cards" but says nothing about what happened to them.', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('8be8de6b-ae66-4bd5-a29d-de6d8efc2036', 'b6187cd1-bc00-4824-9e6a-ce75e214fa86', 'true_false_notgiven', 'Ventris believed for some time that the language was linked to Etruscan.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['TRUE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'For most of this period "he believed, as Evans had, that the language was probably related to Etruscan."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('3816a036-8c76-4ecb-aafb-740e3d2e6509', 'b6187cd1-bc00-4824-9e6a-ce75e214fa86', 'true_false_notgiven', 'The language of the tablets is older than that of Homer.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['TRUE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The words were "an archaic Greek some five centuries older than Homer."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('150ee7a0-9698-4989-8670-ef56a5142bd2', 'b6187cd1-bc00-4824-9e6a-ce75e214fa86', 'sentence_completion', 'Kober''s triplets showed that the language was ______, changing its word endings. (NO MORE THAN TWO WORDS)', '[]'::jsonb, ARRAY['inflected']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'The triplets "indicated that the language was inflected".', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('6b70486d-05f5-4f4c-950f-02074282da9d', 'b6187cd1-bc00-4824-9e6a-ce75e214fa86', 'sentence_completion', 'Ventris''s grid recorded relationships between signs rather than their ______. (NO MORE THAN TWO WORDS)', '[]'::jsonb, ARRAY['values']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'The grid "recorded relationships, not values."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('5de80e12-6234-4a7c-88fb-9c90bee74406', 'b6187cd1-bc00-4824-9e6a-ce75e214fa86', 'sentence_completion', 'Ventris first assigned sounds to signs using ______. (NO MORE THAN TWO WORDS)', '[]'::jsonb, ARRAY['place names']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'He assigned "sound values to a few signs on the basis of place names."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e81f5daa-cced-4ba8-8158-0f03a654f40b', 'b6187cd1-bc00-4824-9e6a-ce75e214fa86', 'matching_features', 'Which person found tablets that showed the script was not used only on Crete? (You may use any letter more than once.)', '[{"value":"A","label":"A. Arthur Evans"},{"value":"B","label":"B. Alice Kober"},{"value":"C","label":"C. Michael Ventris"},{"value":"D","label":"D. Carl Blegen"}]'::jsonb, ARRAY['D']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Blegen''s Pylos archive "was fatal to the assumption that Linear B was exclusively Cretan."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('3c216ea1-979a-429d-a21e-d17f3a690c83', 'b6187cd1-bc00-4824-9e6a-ce75e214fa86', 'matching_features', 'Which person refused to guess the language before analysing its structure? (You may use any letter more than once.)', '[{"value":"A","label":"A. Arthur Evans"},{"value":"B","label":"B. Alice Kober"},{"value":"C","label":"C. Michael Ventris"},{"value":"D","label":"D. Carl Blegen"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Kober "refused to speculate about what the language was; she insisted that the structure had to be established first."', 10)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('de37a8b5-1a9e-4dbb-a68b-678317745d5a', 'b6187cd1-bc00-4824-9e6a-ce75e214fa86', 'matching_features', 'Which person excavated a tablet that confirmed the decipherment? (You may use any letter more than once.)', '[{"value":"A","label":"A. Arthur Evans"},{"value":"B","label":"B. Alice Kober"},{"value":"C","label":"C. Michael Ventris"},{"value":"D","label":"D. Carl Blegen"}]'::jsonb, ARRAY['D']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Confirmation came from "A tablet newly excavated by Blegen at Pylos" spelling "ti-ri-po, tripod."', 11)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('283dbba8-0eb9-4400-b76a-c1d5ee884e10', 'b6187cd1-bc00-4824-9e6a-ce75e214fa86', 'matching_features', 'Which person shared unfinished findings with other researchers? (You may use any letter more than once.)', '[{"value":"A","label":"A. Arthur Evans"},{"value":"B","label":"B. Alice Kober"},{"value":"C","label":"C. Michael Ventris"},{"value":"D","label":"D. Carl Blegen"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Ventris "circulated his progress in a series of" work notes "to other scholars".', 12)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('ecd9676f-7450-4a4f-8416-1f63de500155', '92225587-b842-4d77-9b9e-38cb512d8340', 2, 'A. For most of the history of soil science, the living component of soil was studied by growing it. Microbiologists took a sample, spread it on a nutrient medium and counted the colonies that appeared. The method was reproducible and cheap, but it had a fundamental flaw that became apparent only when DNA sequencing allowed organisms to be identified without being cultured at all. It turned out that the overwhelming majority of soil microbes, by some estimates more than ninety-nine per cent, will not grow on any standard laboratory medium. A gram of fertile soil may contain billions of bacterial cells belonging to tens of thousands of species, and the culturing tradition had been describing a vanishingly small and unrepresentative fraction of them.

B. Among the most consequential of these organisms are the mycorrhizal fungi, which colonise the roots of around eighty per cent of land plants. The fungi extend fine threads, or hyphae, far beyond the reach of the roots themselves, effectively enlarging the plant''s absorptive surface many times over. Through this network they deliver phosphorus and other nutrients that the plant would struggle to obtain on its own, and in exchange they receive sugars, which plants may surrender in substantial quantities, sometimes a fifth or more of the carbon they fix by photosynthesis. The relationship is ancient; fossil evidence suggests that it may have been instrumental in allowing plants to colonise land in the first place.

C. The hyphae perform a second function that is less widely appreciated. Many mycorrhizal fungi secrete a sticky glycoprotein known as glomalin, which binds mineral particles and organic matter into crumbs, or aggregates. Aggregated soil has a network of pores that allows water to infiltrate rather than run off and air to reach the roots, and it is markedly more resistant to erosion. Glomalin is also remarkably persistent, remaining in the soil for years or even decades, and it may account for a significant share of the carbon stored in some soils, a fact that has drawn the attention of researchers concerned with climate mitigation.

D. Modern intensive agriculture has, in many cases, inadvertently undermined these relationships. When phosphorus is supplied abundantly as soluble fertiliser, plants have little incentive to sustain a costly partnership with fungi, and colonisation of their roots declines. Repeated ploughing physically severs the hyphal network, and long periods of bare soil between crops deprive the fungi of the living roots on which they depend. The result is a soil that may produce high yields as long as inputs are maintained but has lost much of its capacity to supply nutrients and retain water unaided, a dependency that becomes expensive when fertiliser prices rise. Compaction by heavy machinery compounds the problem, squeezing out the pore spaces in which fungi and bacteria live.

E. Agronomists have accordingly begun to promote practices designed to rebuild soil biology. Reduced tillage or direct drilling, in which seed is inserted into undisturbed ground, leaves fungal networks largely intact. Cover crops, sown after the main harvest, keep living roots in the ground through the winter, and diverse rotations support a broader range of microbial partners than a single crop grown year after year. The evidence that such measures increase microbial activity is strong. The evidence that they raise yields is more mixed: benefits often take several years to appear and depend heavily on soil type and climate, which partly explains why adoption has been uneven.

F. Industry has responded with a growing market in microbial inoculants, products containing selected bacteria or fungal spores that are applied to seed or soil. Some have performed well in controlled trials, particularly in degraded soils with depleted native populations. In healthy field soils, however, results have frequently been disappointing. Introduced strains must compete with an established and highly adapted community, and many simply fail to persist. A recent review of several hundred field trials concluded that the average yield benefit was modest and highly variable, and warned that products were often marketed with claims that the evidence did not support.

G. Perhaps the most intriguing recent research concerns the role of fungal networks in communication between plants. In experiments with tomato plants connected by a shared mycorrhizal network, plants that had not themselves been attacked by a fungal pathogen began to activate defensive genes after a connected neighbour was infected. Similar effects have been reported in response to insect pests. The mechanism remains uncertain, and some researchers caution that popular accounts of a "wood wide web" have run well ahead of the data. Other researchers point out that plants connected in this way also compete for the same nutrients, so the network may carry rivalry as well as cooperation, and that the direction of benefit can change with the season and with the age of the plants involved. Nonetheless, the finding hints that the soil beneath a field may be not merely a store of nutrients but an active system of exchange whose workings agriculture is only beginning to understand.', NULL, NULL, 'You should spend about 20 minutes on Questions 14-26, which are based on Reading Passage 2 below.', '{"title":"Passage 2 — The economy beneath our feet"}'::jsonb, 1)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('652852cd-27b0-4b7a-898b-b3f1ea8703c6', 'ecd9676f-7450-4a4f-8416-1f63de500155', 'matching_headings', 'Paragraph A — choose the most suitable heading.', '[{"value":"i","label":"i. A hidden partnership beneath the crop"},{"value":"ii","label":"ii. Why conventional measurement missed most of the picture"},{"value":"iii","label":"iii. The unintended cost of feeding plants directly"},{"value":"iv","label":"iv. Commercial products that have yet to deliver"},{"value":"v","label":"v. A substance that holds the soil together"},{"value":"vi","label":"vi. The superior yields of organic farming"},{"value":"vii","label":"vii. Practices that rebuild underground life"},{"value":"viii","label":"viii. Signals that warn of attack"}]'::jsonb, ARRAY['ii']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph A explains that "the overwhelming majority of soil microbes" will not grow in the laboratory, so culturing described "a vanishingly small and unrepresentative fraction".', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('df148919-39dd-4620-a380-da36d46871e1', 'ecd9676f-7450-4a4f-8416-1f63de500155', 'matching_headings', 'Paragraph B — choose the most suitable heading.', '[{"value":"i","label":"i. A hidden partnership beneath the crop"},{"value":"ii","label":"ii. Why conventional measurement missed most of the picture"},{"value":"iii","label":"iii. The unintended cost of feeding plants directly"},{"value":"iv","label":"iv. Commercial products that have yet to deliver"},{"value":"v","label":"v. A substance that holds the soil together"},{"value":"vi","label":"vi. The superior yields of organic farming"},{"value":"vii","label":"vii. Practices that rebuild underground life"},{"value":"viii","label":"viii. Signals that warn of attack"}]'::jsonb, ARRAY['i']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph B describes how fungi deliver nutrients to roots and "in exchange they receive sugars".', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('ce90cc52-bc07-45b0-9fe3-d988e3e187d7', 'ecd9676f-7450-4a4f-8416-1f63de500155', 'matching_headings', 'Paragraph C — choose the most suitable heading.', '[{"value":"i","label":"i. A hidden partnership beneath the crop"},{"value":"ii","label":"ii. Why conventional measurement missed most of the picture"},{"value":"iii","label":"iii. The unintended cost of feeding plants directly"},{"value":"iv","label":"iv. Commercial products that have yet to deliver"},{"value":"v","label":"v. A substance that holds the soil together"},{"value":"vi","label":"vi. The superior yields of organic farming"},{"value":"vii","label":"vii. Practices that rebuild underground life"},{"value":"viii","label":"viii. Signals that warn of attack"}]'::jsonb, ARRAY['v']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph C describes glomalin, "which binds mineral particles and organic matter into crumbs".', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('ad8181a1-d913-42c9-b209-af186c00c390', 'ecd9676f-7450-4a4f-8416-1f63de500155', 'matching_headings', 'Paragraph D — choose the most suitable heading.', '[{"value":"i","label":"i. A hidden partnership beneath the crop"},{"value":"ii","label":"ii. Why conventional measurement missed most of the picture"},{"value":"iii","label":"iii. The unintended cost of feeding plants directly"},{"value":"iv","label":"iv. Commercial products that have yet to deliver"},{"value":"v","label":"v. A substance that holds the soil together"},{"value":"vi","label":"vi. The superior yields of organic farming"},{"value":"vii","label":"vii. Practices that rebuild underground life"},{"value":"viii","label":"viii. Signals that warn of attack"}]'::jsonb, ARRAY['iii']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph D says that when phosphorus "is supplied abundantly as soluble fertiliser", colonisation of roots "declines".', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f721e865-15eb-475c-97d8-735816456f4c', 'ecd9676f-7450-4a4f-8416-1f63de500155', 'matching_headings', 'Paragraph E — choose the most suitable heading.', '[{"value":"i","label":"i. A hidden partnership beneath the crop"},{"value":"ii","label":"ii. Why conventional measurement missed most of the picture"},{"value":"iii","label":"iii. The unintended cost of feeding plants directly"},{"value":"iv","label":"iv. Commercial products that have yet to deliver"},{"value":"v","label":"v. A substance that holds the soil together"},{"value":"vi","label":"vi. The superior yields of organic farming"},{"value":"vii","label":"vii. Practices that rebuild underground life"},{"value":"viii","label":"viii. Signals that warn of attack"}]'::jsonb, ARRAY['vii']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph E describes "practices designed to rebuild soil biology".', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e8f4960b-a660-4cd6-a219-340dc93d37b5', 'ecd9676f-7450-4a4f-8416-1f63de500155', 'matching_headings', 'Paragraph F — choose the most suitable heading.', '[{"value":"i","label":"i. A hidden partnership beneath the crop"},{"value":"ii","label":"ii. Why conventional measurement missed most of the picture"},{"value":"iii","label":"iii. The unintended cost of feeding plants directly"},{"value":"iv","label":"iv. Commercial products that have yet to deliver"},{"value":"v","label":"v. A substance that holds the soil together"},{"value":"vi","label":"vi. The superior yields of organic farming"},{"value":"vii","label":"vii. Practices that rebuild underground life"},{"value":"viii","label":"viii. Signals that warn of attack"}]'::jsonb, ARRAY['iv']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph F says that in field soils "results have frequently been disappointing" for inoculants.', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('9045f21a-2427-49ad-b1c9-e6a124e8bc56', 'ecd9676f-7450-4a4f-8416-1f63de500155', 'matching_headings', 'Paragraph G — choose the most suitable heading.', '[{"value":"i","label":"i. A hidden partnership beneath the crop"},{"value":"ii","label":"ii. Why conventional measurement missed most of the picture"},{"value":"iii","label":"iii. The unintended cost of feeding plants directly"},{"value":"iv","label":"iv. Commercial products that have yet to deliver"},{"value":"v","label":"v. A substance that holds the soil together"},{"value":"vi","label":"vi. The superior yields of organic farming"},{"value":"vii","label":"vii. Practices that rebuild underground life"},{"value":"viii","label":"viii. Signals that warn of attack"}]'::jsonb, ARRAY['viii']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph G describes unattacked plants that "began to activate defensive genes after a connected neighbour was infected."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('6fec3287-4fa9-4cdb-8fa1-e099bec9252e', 'ecd9676f-7450-4a4f-8416-1f63de500155', 'short_answer', 'What proportion of land plants have roots colonised by mycorrhizal fungi? Write NO MORE THAN THREE WORDS AND/OR A NUMBER.', '[]'::jsonb, ARRAY['80 per cent', 'eighty per cent', '80%']::text[], 3, 'lenient', true, false, '{}'::jsonb, 'The fungi "colonise the roots of around eighty per cent of land plants."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f54a20d5-67a3-4e74-84fe-8d6fa8bac72e', 'ecd9676f-7450-4a4f-8416-1f63de500155', 'short_answer', 'Which nutrient is named as one the fungi deliver to plants? Write NO MORE THAN THREE WORDS AND/OR A NUMBER.', '[]'::jsonb, ARRAY['phosphorus']::text[], 3, 'lenient', true, false, '{}'::jsonb, 'The fungi "deliver phosphorus and other nutrients that the plant would struggle to obtain on its own".', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('eb4e28fc-5019-4c48-b635-b536c998cfd2', 'ecd9676f-7450-4a4f-8416-1f63de500155', 'short_answer', 'In which plant were signals through a shared fungal network observed? Write NO MORE THAN THREE WORDS AND/OR A NUMBER.', '[]'::jsonb, ARRAY['tomato', 'tomatoes', 'tomato plants']::text[], 3, 'lenient', true, false, '{}'::jsonb, 'The paragraph refers to "experiments with tomato plants connected by a shared mycorrhizal network".', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('af56e35a-dafd-4d72-bf89-438c24375d1a', 'ecd9676f-7450-4a4f-8416-1f63de500155', 'summary_completion', 'Repeated ploughing cuts through the fungal ______. (NO MORE THAN TWO WORDS)', '[]'::jsonb, ARRAY['network', 'hyphal network']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'The passage says "Repeated ploughing physically severs the hyphal network".', 10)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('240f8588-3893-46d1-8155-ba06694de272', 'ecd9676f-7450-4a4f-8416-1f63de500155', 'summary_completion', 'Under direct drilling, seed is placed into ______ ground. (NO MORE THAN TWO WORDS)', '[]'::jsonb, ARRAY['undisturbed']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'In direct drilling "seed is inserted into undisturbed ground".', 11)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('855341b9-6612-4b49-a6cb-77e2ddc7d1d4', 'ecd9676f-7450-4a4f-8416-1f63de500155', 'summary_completion', 'Cover crops keep living ______ in the soil over winter. (NO MORE THAN TWO WORDS)', '[]'::jsonb, ARRAY['roots']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Cover crops "keep living roots in the ground through the winter".', 12)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('4419cfe3-ecb2-4264-94db-8c438bb7c70e', '92225587-b842-4d77-9b9e-38cb512d8340', 3, 'It is a commonplace of popular writing about science that its theories aim at truth, and that progress consists in replacing false accounts of the world with accurate ones. There is something right about this picture, but it sits uneasily with the actual practice of the sciences, in which a great deal of the most productive work is done with models that everyone involved knows to be false. The ideal gas, the frictionless plane, the perfectly rational economic agent, the infinitely large population of population genetics: none of these exists, and no competent scientist supposes that they do. The question of why such fictions are so useful, and what their usefulness implies about scientific knowledge, deserves more attention than it usually receives.

One tempting answer treats idealisation as a temporary expedient. On this view, scientists simplify because the full truth is too complicated to handle, and each idealised model is a stage on the way to a more complete description that will eventually replace it. The history of physics offers some support: the simple pendulum of the introductory textbook can indeed be corrected, step by step, for air resistance, the mass of the string and the finite amplitude of the swing. But I think this answer misdescribes the situation in most fields. In population genetics, the assumption of an infinite population is not a stopgap awaiting correction; it is precisely what makes the effects of selection visible by removing the noise of chance. Restoring the missing detail would not improve the model so much as obscure the very thing it was built to reveal.

A better account, I suggest, holds that a model is valuable for what it omits. To explain why some phenomenon occurs is in large part to identify which of the countless features of a situation make a difference to it, and which do not. A model that included everything would be as uninformative as a map drawn at a scale of one to one. The idealised model, by contrast, makes a claim of relevance: it says, in effect, that these factors matter and the rest may be disregarded for the purpose at hand. When such a model successfully reproduces the behaviour of the real system, it vindicates that judgement of relevance, and this is a genuine piece of knowledge, even though the model''s literal description of the system is false.

This view has a consequence that some find uncomfortable. If models are tools tailored to particular questions, then there is no reason to expect a single model of a complex system to serve all purposes, and some sciences routinely use several models of the same phenomenon that are mutually inconsistent. Hydrologists may treat water in one context as a continuous fluid and in another as a collection of discrete molecules; ecologists may model the same population with and without spatial structure, depending on what they wish to understand. Critics have argued that this pluralism is a symptom of immaturity, and that a fully developed science would unify its models into one consistent theory. I see no good reason to believe this. The expectation of eventual unification is an article of faith rather than a conclusion drawn from the history of science, which shows as many cases of proliferating models as of convergence.

None of this means that anything goes. A model''s idealisations must be chosen so that the factors it neglects really are negligible for the question asked, and this is an empirical matter that can be investigated and, in principle, found wanting. The economist''s rational agent offers a cautionary example. For explaining the behaviour of large markets under stable conditions it has often served well; for explaining financial panics, in which the systematic departures of real people from rationality are precisely what drive events, it has proved seriously misleading. The fault in such cases lies not in idealisation itself but in its application beyond the domain where its omissions are harmless.

There is a further and more practical lesson here, which concerns how science is communicated. When the public is told that a model "predicts" a certain outcome, it is rarely told which features of the world the model has set aside, and so it has no means of judging whether those omissions matter for the question at hand. The disputes over epidemiological modelling during recent pandemics showed how damaging this can be: models designed to compare policy options under explicit simplifying assumptions were reported, and sometimes attacked, as if they were forecasts of what would actually happen. Greater candour about idealisation would not weaken public trust in science; if anything, it would protect that trust against the disappointment that follows when a misunderstood prediction fails to come true.

The philosopher Nancy Cartwright once remarked that the laws of physics lie, in the sense that the simple regularities they describe are rarely, if ever, observed in nature. Her point was not that physics is unreliable but that its reliability has a different source from the one usually supposed. The same might be said of scientific models generally. Their success does not show that the world is as simple as they portray it. It shows that their makers have correctly judged which complications can, for a given purpose, be safely ignored.', NULL, NULL, 'You should spend about 20 minutes on Questions 27-40, which are based on Reading Passage 3 below.', '{"title":"Passage 3 — The uses of falsehood in science"}'::jsonb, 2)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('1cfa7432-38aa-462b-ad65-11a0793e5f37', '4419cfe3-ecb2-4264-94db-8c438bb7c70e', 'yes_no_notgiven', 'Do the following statements agree with the claims of the writer? Most scientists who use idealised models believe they describe real systems.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NO']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The writer says of these fictions that "no competent scientist supposes that they do" exist.', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('96ad15d6-9849-4e4b-aaf4-93cf10b29665', '4419cfe3-ecb2-4264-94db-8c438bb7c70e', 'yes_no_notgiven', 'Do the following statements agree with the claims of the writer? Correcting the simple pendulum model step by step is possible.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['YES']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The simple pendulum "can indeed be corrected, step by step, for air resistance".', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('6a81ac80-5039-405b-a47d-26c1ef24b35e', '4419cfe3-ecb2-4264-94db-8c438bb7c70e', 'yes_no_notgiven', 'Do the following statements agree with the claims of the writer? The assumption of an infinite population is a stopgap that will eventually be corrected.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NO']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The writer says the assumption "is not a stopgap awaiting correction".', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('c1282ba8-fd2d-4117-aa5c-2637e64ed29d', '4419cfe3-ecb2-4264-94db-8c438bb7c70e', 'yes_no_notgiven', 'Do the following statements agree with the claims of the writer? A fully developed science would inevitably unify its models into one theory.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NO']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The writer says "I see no good reason to believe this" and calls unification "an article of faith".', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('eb43afa3-993b-4a39-be49-6141e90c048d', '4419cfe3-ecb2-4264-94db-8c438bb7c70e', 'yes_no_notgiven', 'Do the following statements agree with the claims of the writer? Ecology uses more mutually inconsistent models than any other science.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NOT GIVEN']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The writer says "some sciences routinely use several models" and gives ecology as an example, but makes no comparison of numbers.', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('1858bb34-bd05-42bb-bb2b-a1d4655a09cd', '4419cfe3-ecb2-4264-94db-8c438bb7c70e', 'yes_no_notgiven', 'Do the following statements agree with the claims of the writer? Being open about idealisation would reduce public confidence in science.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NO']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The writer says "Greater candour about idealisation would not weaken public trust in science".', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('54f99752-4582-4335-b1df-171775010d28', '4419cfe3-ecb2-4264-94db-8c438bb7c70e', 'multiple_choice_single', 'Why does the writer mention a map drawn at a scale of one to one?', '[{"value":"A","label":"A. to show that complete accuracy is technically impossible"},{"value":"B","label":"B. to illustrate that including every detail would explain nothing"},{"value":"C","label":"C. to argue that models should be judged by their visual clarity"},{"value":"D","label":"D. to contrast physical maps with mathematical models"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The writer says "A model that included everything would be as uninformative as a map drawn at a scale of one to one."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('77db773a-b738-4bb7-a7ab-35ee7464462e', '4419cfe3-ecb2-4264-94db-8c438bb7c70e', 'multiple_choice_single', 'According to the writer, when an idealised model reproduces the behaviour of a real system, it', '[{"value":"A","label":"A. proves that its literal description is approximately true."},{"value":"B","label":"B. shows that further detail would make it more accurate."},{"value":"C","label":"C. confirms a judgement about which factors are relevant."},{"value":"D","label":"D. can be applied with confidence to other systems."}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Such success "vindicates that judgement of relevance, and this is a genuine piece of knowledge".', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('2c30fa60-94d7-409e-9235-8b25ac73ecaf', '4419cfe3-ecb2-4264-94db-8c438bb7c70e', 'multiple_choice_single', 'What does the writer conclude from the example of the rational economic agent?', '[{"value":"A","label":"A. Idealised models should be abandoned in economics."},{"value":"B","label":"B. The model fails when used where its omissions matter."},{"value":"C","label":"C. Financial panics cannot be modelled at all."},{"value":"D","label":"D. Large markets behave more rationally than individuals."}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The fault lies "not in idealisation itself but in its application beyond the domain where its omissions are harmless."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('25067b56-aab0-42ca-9c2b-5fa5f3951b4c', '4419cfe3-ecb2-4264-94db-8c438bb7c70e', 'multiple_choice_single', 'What problem with pandemic modelling does the writer identify?', '[{"value":"A","label":"A. The models relied on unreliable data."},{"value":"B","label":"B. The models were designed by non-specialists."},{"value":"C","label":"C. Comparisons of policies were treated as forecasts."},{"value":"D","label":"D. Policymakers ignored the models'' conclusions."}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Models built "to compare policy options" were reported "as if they were forecasts of what would actually happen."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('47460520-82ce-4d43-919d-769bbdcd6e8b', '4419cfe3-ecb2-4264-94db-8c438bb7c70e', 'matching_sentence_endings', 'The simple regularities described by the laws of physics are rarely observed in nature', '[{"value":"A","label":"A. because its usefulness depends on what it leaves out."},{"value":"B","label":"B. since every simplification is eventually replaced by a truer one."},{"value":"C","label":"C. provided that its predictions are confirmed by experiment."},{"value":"D","label":"D. even though no one believes it describes the system literally."},{"value":"E","label":"E. unless its assumptions are stated explicitly."}]'::jsonb, ARRAY['D']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Cartwright said the laws of physics "lie", yet "Her point was not that physics is unreliable".', 10)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('919ac7f1-cbf5-41bb-adcb-ec3c86387964', '4419cfe3-ecb2-4264-94db-8c438bb7c70e', 'matching_sentence_endings', 'In population genetics the infinite-population model reveals the effects of selection', '[{"value":"A","label":"A. because its usefulness depends on what it leaves out."},{"value":"B","label":"B. since every simplification is eventually replaced by a truer one."},{"value":"C","label":"C. provided that its predictions are confirmed by experiment."},{"value":"D","label":"D. even though no one believes it describes the system literally."},{"value":"E","label":"E. unless its assumptions are stated explicitly."}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The assumption "makes the effects of selection visible by removing the noise of chance", and restoring detail "would not improve the model".', 11)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('bbaeef7a-c427-46f9-8bfc-6223f27a4a10', '4419cfe3-ecb2-4264-94db-8c438bb7c70e', 'multiple_choice_multiple', 'Which TWO of the following does the writer present as examples of a science using inconsistent models of one phenomenon? Choose TWO letters.', '[{"value":"A","label":"A. physicists modelling a pendulum"},{"value":"B","label":"B. hydrologists modelling water"},{"value":"C","label":"C. economists modelling markets"},{"value":"D","label":"D. ecologists modelling a population"},{"value":"E","label":"E. epidemiologists modelling a pandemic"}]'::jsonb, ARRAY['B', 'D']::text[], 0, 'lenient', true, false, '{}'::jsonb, '"Hydrologists may treat water in one context as a continuous fluid and in another as a collection of discrete molecules; ecologists may model the same population with and without spatial structure".', 12)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('54d06f1e-55cf-4c72-a90c-3fd1c35bfb5b', '4419cfe3-ecb2-4264-94db-8c438bb7c70e', 'multiple_choice_single', 'What is the writer''s main purpose in the passage?', '[{"value":"A","label":"A. to argue that scientific theories cannot be true"},{"value":"B","label":"B. to explain how false models can yield genuine knowledge"},{"value":"C","label":"C. to trace the history of idealisation in physics"},{"value":"D","label":"D. to criticise the way economists use models"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The writer asks "why such fictions are so useful" and concludes that success shows makers "have correctly judged which complications can, for a given purpose, be safely ignored."', 13)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)
values ('bb5dabae-17fa-4d09-b70d-245a6c18d5bf', '09ba0ecc-c1cf-45a6-8667-2bfbf893228a', 'writing', 3600, 2, NULL, 2)
on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('6907f91c-a594-49a3-85c6-22fc51ca4a61', 'bb5dabae-17fa-4d09-b70d-245a6c18d5bf', 1, 'The line graph below shows the percentage of electricity generated from renewable sources in Denmark, Spain, Japan and Canada between 2000 and 2025.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.', NULL, '/mock-images/academic-4-task1.svg', 'You should spend about 20 minutes on this task. Write at least 150 words.', '{"image_caption":"Share of electricity generated from renewable sources in four countries, 2000-2025 (%)","title":"Task 1"}'::jsonb, 0)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('42689ea1-1c27-4a2c-8b69-cf420da05e75', '6907f91c-a594-49a3-85c6-22fc51ca4a61', 'short_answer', 'Task 1 response', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('6884f39a-1581-4ff8-a730-cf3a7b358ec9', 'bb5dabae-17fa-4d09-b70d-245a6c18d5bf', 2, 'Some argue that personal genetic data, such as the results of commercial DNA tests, should be available to medical researchers without individual consent because the benefits to public health are so great. Others believe that such data must always remain under the control of the individual.

Discuss both these views and give your own opinion.

Give reasons for your answer and include any relevant examples from your own knowledge or experience.', NULL, NULL, 'You should spend about 40 minutes on this task. Write at least 250 words.', '{"title":"Task 2"}'::jsonb, 1)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('7092d265-f477-4ca7-a8de-362b509bba1c', '6884f39a-1581-4ff8-a730-cf3a7b358ec9', 'short_answer', 'Task 2 response', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)
values ('2aabf235-b92b-4cf0-9719-77d7cbfaee2b', '09ba0ecc-c1cf-45a6-8667-2bfbf893228a', 'speaking', 840, 12, NULL, 3)
on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('c74a3e6b-b84c-4fc1-9e11-a2d812cc5992', '2aabf235-b92b-4cf0-9719-77d7cbfaee2b', 1, NULL, NULL, NULL, 'The examiner asks about yourself, your home, work or studies and other familiar topics. 4-5 minutes.', '{"title":"Part 1 — Introduction and familiar topics"}'::jsonb, 0)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('3366077d-d8c7-43be-8c3c-b0740ad4dad0', 'c74a3e6b-b84c-4fc1-9e11-a2d812cc5992', 'short_answer', 'Let''s talk about your studies or work. What do you find most demanding about it?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('a61bf354-01c9-4241-ab68-8c3327620e60', 'c74a3e6b-b84c-4fc1-9e11-a2d812cc5992', 'short_answer', 'Has the subject you study or the job you do changed the way you think?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('cbb6198a-9e47-4af4-a40f-7ef956ba2eb2', 'c74a3e6b-b84c-4fc1-9e11-a2d812cc5992', 'short_answer', 'Would you consider retraining in a completely different field? Why?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('d7885614-2575-479d-82e7-a22594a9892a', 'c74a3e6b-b84c-4fc1-9e11-a2d812cc5992', 'short_answer', 'Now let''s talk about museums. How often do you visit museums?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('c2e2bba2-99b8-4561-8978-17945dc5f496', 'c74a3e6b-b84c-4fc1-9e11-a2d812cc5992', 'short_answer', 'Do you prefer museums about history or about science? Why?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('a5ddb572-31f7-4fef-86e2-18bd327e3a27', 'c74a3e6b-b84c-4fc1-9e11-a2d812cc5992', 'short_answer', 'Do you think museums should be free to enter?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('4b296f70-fb41-4ff5-9263-18d2ef9aea64', '2aabf235-b92b-4cf0-9719-77d7cbfaee2b', 2, 'Describe a time when you changed your mind about something important.

You should say:
  •  what your original opinion was
  •  what made you reconsider it
  •  how long the change took

and explain what you learned from the experience.', NULL, NULL, 'You have one minute to prepare. You may make notes. Then talk for one to two minutes. The examiner will tell you when to stop.', '{"title":"Part 2 — Individual long turn"}'::jsonb, 1)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('7ce870aa-8dee-4f48-ab94-ca3d1dcc2b89', '4b296f70-fb41-4ff5-9263-18d2ef9aea64', 'short_answer', 'Long turn response', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('e3286c5c-0a14-4eb7-ae85-abe062bbd43b', '2aabf235-b92b-4cf0-9719-77d7cbfaee2b', 3, NULL, NULL, NULL, 'The examiner asks further questions connected to the topic in Part 2. 4-5 minutes.', '{"title":"Part 3 — Two-way discussion"}'::jsonb, 2)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('2e46fc6a-d240-4629-bd0a-7e88b51353b4', 'e3286c5c-0a14-4eb7-ae85-abe062bbd43b', 'short_answer', 'Why do people often find it difficult to change long-held beliefs?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('2fa6230d-4159-405f-99cb-025d04dfeb5d', 'e3286c5c-0a14-4eb7-ae85-abe062bbd43b', 'short_answer', 'To what extent should public figures be criticised for changing their positions?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('796da9b0-ccf0-4962-a89b-fcb8f8a83c1a', 'e3286c5c-0a14-4eb7-ae85-abe062bbd43b', 'short_answer', 'Has the internet made people more or less open to opposing views?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f95eb8d6-bd82-4858-91e4-083a84942042', 'e3286c5c-0a14-4eb7-ae85-abe062bbd43b', 'short_answer', 'How far is it the role of education to teach people to question what they believe?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('01319329-dd0e-457b-b253-fbd3779a37e1', 'e3286c5c-0a14-4eb7-ae85-abe062bbd43b', 'short_answer', 'Do you think societies change their values faster now than in the past? Why?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

-- General Training Mock Test 1 (general-1)
insert into public.test_forms (id, slug, title, description, variant, delivery_mode, is_published, is_premium, difficulty, scoring_version)
values ('f08fa3c1-8485-4593-b50e-b1bb033c1368', 'general-1', 'General Training Mock Test 1', 'A full General Training practice test covering all four sections.', 'general_training', 'computer', true, false, 'standard', 'v1')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, description = excluded.description, is_published = excluded.is_published, is_premium = excluded.is_premium, difficulty = excluded.difficulty;

insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)
values ('f21bc676-935b-425d-92d8-aabddef3b09f', 'f08fa3c1-8485-4593-b50e-b1bb033c1368', 'listening', 1800, 40, NULL, 0)
on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('2186b970-8f9e-4945-9158-1237d6b23b11', 'f21bc676-935b-425d-92d8-aabddef3b09f', 1, NULL, NULL, NULL, 'Questions 1-10. Complete the booking form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.', '{"title":"Part 1 — Booking a house removal"}'::jsonb, 0)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.item_group_scripts (group_id, transcript) values ('2186b970-8f9e-4945-9158-1237d6b23b11', 'HELEN: Good morning, Swift Move Removals, Helen speaking. How can I help?
DAVID: Hello. I''m moving house next month and I''d like to book a van and some help with the furniture.
HELEN: Certainly. I''ll take a few details first. Could I have your name, please?
DAVID: Yes, it''s David Okafor. That''s O-K-A-F-O-R.
HELEN: Thank you, Mr Okafor. And where are you moving from?
DAVID: From a flat at 27 Linden Road, here in town. It''s on the second floor, and I should warn you there''s no lift.
HELEN: No lift, that''s useful to know. And the new address?
DAVID: It''s a house in Barton, 14 Mill Lane. It''s about twenty miles away.
HELEN: Lovely. And what date were you thinking of?
DAVID: Well, I''d originally hoped for Friday the fifth of June, but my landlord has asked me to leave a few days later, so let''s say Tuesday the ninth of June.
HELEN: The ninth. Let me check... yes, we have a team free that day. Now, how big is the move? How many bedrooms?
DAVID: Two bedrooms. There''s a fair amount of furniture, but the biggest thing is a piano.
HELEN: A piano. Is that an upright or a grand?
DAVID: An upright. It belonged to my grandmother.
HELEN: That''s fine, but a piano needs an extra person on the team, and there''s a charge for that. Shall I put it down?
DAVID: Yes, please. What''s the charge for that?
HELEN: For an upright piano it''s an additional sixty-five pounds.
DAVID: OK. And the basic price for the move?
HELEN: For a two-bedroom flat with a midweek date, the standard price is three hundred and forty pounds. If it were a Friday or Saturday it would be three hundred and ninety.
DAVID: Good thing I changed the date, then. Do you provide boxes?
HELEN: We do. We can deliver up to forty cardboard boxes a week before, free of charge, and we collect them afterwards. We also sell packing paper and tape, but most people find the boxes are enough.
DAVID: Forty free boxes is great. I won''t need the paper, thanks.
HELEN: Now, do you want us to pack for you, or will you do the packing yourself?
DAVID: I''ll pack the boxes myself, but I''d like someone to take the beds apart and put them back together.
HELEN: That''s our dismantling service. It''s included for up to two beds, so no extra charge there.
DAVID: Excellent. What about insurance? I have quite a lot of glass ornaments.
HELEN: Our basic cover is included and protects items up to a total value of five thousand pounds. If you think your belongings are worth more, you can upgrade to full cover for twenty pounds.
DAVID: I think five thousand is enough, to be honest.
HELEN: Fine. And how would you like to pay the deposit? We take a deposit of fifty pounds to confirm the booking.
DAVID: Can I pay by bank transfer? I don''t really like giving card details over the phone.
HELEN: Of course, bank transfer is fine. I''ll email you our account details. What''s the best email address?
DAVID: It''s d.okafor@mailbox.net.
HELEN: Thank you. And a phone number in case the team needs to contact you on the day?
DAVID: My mobile is 07946 318 552.
HELEN: Lovely. One more thing: is there anywhere for the van to park near your flat? It''s a large vehicle.
DAVID: There''s a car park behind the building. The van could go there, I think, though the street at the front is very narrow.
HELEN: Then I''ll note the car park. Our team will arrive between eight and half past eight in the morning.
DAVID: That early? Well, I suppose it''s better to start early.
HELEN: It is, especially with the stairs. And the team leader that day will be Marcus. He''s very experienced with pianos, so you''re in good hands.
DAVID: Marcus. Great. Is there anything else I need to do?
HELEN: Just pay the deposit within seven days and you''ll receive a confirmation. If you need to cancel, please give us at least forty-eight hours'' notice.
DAVID: Understood. Thank you very much, Helen.
HELEN: You''re welcome, Mr Okafor. Goodbye.')
on conflict (group_id) do update set transcript = excluded.transcript;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('2d4482aa-392e-486e-ac92-57279fb7f490', '2186b970-8f9e-4945-9158-1237d6b23b11', 'note_completion', 'Customer name: David ______', '[]'::jsonb, ARRAY['Okafor']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'The caller spells his surname: "it''s David Okafor. That''s O-K-A-F-O-R."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('14380534-b643-46e9-8264-f7bc40bea4ad', '2186b970-8f9e-4945-9158-1237d6b23b11', 'note_completion', 'Moving from: flat on the ______ floor, no lift', '[]'::jsonb, ARRAY['second', '2nd']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'David says the flat "is on the second floor" and "there''s no lift."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('d9c99df8-3297-4abb-b3b9-12a8c58ff853', '2186b970-8f9e-4945-9158-1237d6b23b11', 'note_completion', 'Moving to: 14 ______, Barton', '[]'::jsonb, ARRAY['Mill Lane']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'The new address is "a house in Barton, 14 Mill Lane."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f2ed2c77-55d5-405b-8064-01286a38b9be', '2186b970-8f9e-4945-9158-1237d6b23b11', 'note_completion', 'Date of move: Tuesday ______ June', '[]'::jsonb, ARRAY['9th', '9', 'ninth']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'He hoped for the fifth, but settles on "Tuesday the ninth of June."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('6bd27c8b-303d-4b0d-acb3-23fb5c194f82', '2186b970-8f9e-4945-9158-1237d6b23b11', 'note_completion', 'Special item: upright ______ (extra charge £65)', '[]'::jsonb, ARRAY['piano']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'David says "the biggest thing is a piano", and Helen adds "For an upright piano it''s an additional sixty-five pounds."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e6519cb6-7fd9-4ff4-9dda-f6c72a2560f8', '2186b970-8f9e-4945-9158-1237d6b23b11', 'note_completion', 'Standard price (midweek): £______', '[]'::jsonb, ARRAY['340']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Helen says "the standard price is three hundred and forty pounds"; £390 is the weekend price.', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('4f2e19e1-e09b-4b6f-9948-58f71eb79327', '2186b970-8f9e-4945-9158-1237d6b23b11', 'note_completion', 'Free delivery of up to ______ boxes', '[]'::jsonb, ARRAY['40', 'forty']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Helen says "We can deliver up to forty cardboard boxes a week before, free of charge."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e0246d5c-829e-4854-bf40-357adcd2a43a', '2186b970-8f9e-4945-9158-1237d6b23b11', 'note_completion', 'Deposit paid by ______', '[]'::jsonb, ARRAY['bank transfer', 'transfer']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'David asks "Can I pay by bank transfer?" and Helen replies "bank transfer is fine."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('d9d42936-389b-4f75-a87a-d3c4f616bdca', '2186b970-8f9e-4945-9158-1237d6b23b11', 'note_completion', 'Van to park in the ______ behind the building', '[]'::jsonb, ARRAY['car park', 'carpark']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'David says "There''s a car park behind the building", and Helen says "I''ll note the car park."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('513a125d-f098-41a8-96e3-59dc01f810ee', '2186b970-8f9e-4945-9158-1237d6b23b11', 'note_completion', 'Team leader: ______', '[]'::jsonb, ARRAY['Marcus']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Helen says "the team leader that day will be Marcus."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('d6908b0e-e829-4515-b3a1-d5c596d0279c', 'f21bc676-935b-425d-92d8-aabddef3b09f', 2, NULL, NULL, NULL, 'Questions 11-15: choose the correct letter, A, B or C. Questions 16-20: which task will each group do? Choose from the list A-G.', '{"title":"Part 2 — Volunteer day at Elmbridge Riverside Park"}'::jsonb, 1)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.item_group_scripts (group_id, transcript) values ('d6908b0e-e829-4515-b3a1-d5c596d0279c', 'SPEAKER: Good morning, everyone, and thank you for coming along to the Elmbridge Riverside Park volunteer day. My name''s Fiona Grant, and I''m the volunteer coordinator here. Before we split into groups, I want to give you a little background and go through the plan for the day.
SPEAKER: Many of you will know the park as it is now, but it''s actually quite new. The land was used as a timber yard for almost a century, and it was only when the yard closed that the council bought the site. People often assume it was farmland, because of the open meadows, but those were created by us after the old sheds were cleared. The park opened to the public eleven years ago.
SPEAKER: Today''s event is the biggest we''ve ever organised. We usually have about thirty volunteers, but this morning we have more than eighty of you, which is fantastic. The main reason for the numbers, I think, is that a local radio station mentioned us last week. We did put posters up in the library, and of course we post on social media, but the radio seems to have made the difference.
SPEAKER: Now, some practical points. Please make sure you''ve signed in at the green tent. If you haven''t brought gloves, don''t worry, we have plenty, but we don''t have spare boots, so if you''re wearing trainers, please stay on the paths and away from the riverbank. Lunch will be provided at one o''clock. It was going to be in the visitor centre, but because it''s such a lovely day we''ve moved it to the picnic lawn beside the bandstand.
SPEAKER: At the end of the day, around four, there''ll be a short talk from our ecologist about the otters that have recently returned to this stretch of the river. She''ll be speaking at the bird hide rather than at the café, because that''s where you''re most likely to spot them.
SPEAKER: One more thing before the groups. Some of you have asked how to stay involved. We run a volunteer session on the first Saturday of every month, and you don''t need to book. Just turn up. We used to ask people to register online, but we found it put people off.
SPEAKER: Right, let me explain what each group will be doing. You''ll see you''ve each been given a coloured sticker.
SPEAKER: The Red group will be working along the river path. Normally I''d ask this group to pick up litter, but the Scouts did a brilliant job of that last weekend, so instead the Red group will be planting bulbs along the path edges. We''ve got about two thousand daffodil bulbs to get in the ground.
SPEAKER: The Blue group, you''ll be at the boathouse. The rowing club has asked for help, and I know some of you were hoping to paint, but the paint hasn''t dried on the primer coat yet, so painting will have to wait for another day. Instead, you''ll be repairing the benches along the jetty, many of which have loose or broken slats.
SPEAKER: The Yellow group will be based at the main entrance. This is a large group, because we expect a lot of visitors today. You''ll be guiding visitors, giving out maps and answering questions. Some of you have offered to serve refreshments too, but the café staff are handling that, so please concentrate on helping people find their way.
SPEAKER: The Green group is a small group, and you''ve been chosen because several of you have experience with nature surveys. You''ll be recording wildlife in the wetland area, counting birds and insects. Please take a clipboard from the tent. This information goes straight to the county wildlife trust.
SPEAKER: And finally, the Purple group. You''ll start in the meadow. There''s been a problem with people leaving rubbish after picnics, so your job is clearing litter from the meadow and the area around the bandstand, so it''s tidy before lunch. Litter pickers and bags are in the blue container next to the tent.
SPEAKER: If anyone is unsure which group they''re in, check the colour of your sticker or come and find me. I''ll be wearing this orange vest all day. Right, let''s get started, and thank you again.')
on conflict (group_id) do update set transcript = excluded.transcript;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e1941ef9-f03e-41dc-9cfe-da735f97a912', 'd6908b0e-e829-4515-b3a1-d5c596d0279c', 'multiple_choice_single', 'Before it became a park, the site was', '[{"value":"A","label":"A. farmland"},{"value":"B","label":"B. a timber yard"},{"value":"C","label":"C. a sports ground"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Fiona says "The land was used as a timber yard for almost a century", and that people only "assume it was farmland."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('1090b417-fa29-4ca8-b42a-3ad97d7b1296', 'd6908b0e-e829-4515-b3a1-d5c596d0279c', 'multiple_choice_single', 'The speaker thinks so many volunteers came because of', '[{"value":"A","label":"A. posters in the library"},{"value":"B","label":"B. social media posts"},{"value":"C","label":"C. a radio mention"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'She says "a local radio station mentioned us last week" and "the radio seems to have made the difference."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('82bc96ed-529a-46da-afc8-39e41d53ee01', 'd6908b0e-e829-4515-b3a1-d5c596d0279c', 'multiple_choice_single', 'Volunteers wearing trainers should', '[{"value":"A","label":"A. borrow boots from the tent"},{"value":"B","label":"B. stay on the paths"},{"value":"C","label":"C. work near the visitor centre"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'She says "we don''t have spare boots, so if you''re wearing trainers, please stay on the paths."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('beeb386b-0bb2-419b-ad46-c3c60d295853', 'd6908b0e-e829-4515-b3a1-d5c596d0279c', 'multiple_choice_single', 'Lunch will be served', '[{"value":"A","label":"A. in the visitor centre"},{"value":"B","label":"B. beside the bandstand"},{"value":"C","label":"C. at the café"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Lunch has been "moved ... to the picnic lawn beside the bandstand."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('d5e61ece-7690-47fa-ae02-fe5e2ed9d9e1', 'd6908b0e-e829-4515-b3a1-d5c596d0279c', 'multiple_choice_single', 'To join the monthly sessions, people should', '[{"value":"A","label":"A. register online"},{"value":"B","label":"B. telephone the coordinator"},{"value":"C","label":"C. simply arrive"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'She says "you don''t need to book. Just turn up."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('5b5db320-0cf3-4958-b886-1d44ce7a7fe0', 'd6908b0e-e829-4515-b3a1-d5c596d0279c', 'matching_features', 'Red group', '[{"value":"A","label":"A. clearing litter"},{"value":"B","label":"B. planting bulbs"},{"value":"C","label":"C. repairing benches"},{"value":"D","label":"D. painting the boathouse"},{"value":"E","label":"E. serving refreshments"},{"value":"F","label":"F. guiding visitors"},{"value":"G","label":"G. recording wildlife"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The Red group "will be planting bulbs along the path edges" because the Scouts already picked up the litter.', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('775e870e-9179-4b8f-a1fb-092f3ea82733', 'd6908b0e-e829-4515-b3a1-d5c596d0279c', 'matching_features', 'Blue group', '[{"value":"A","label":"A. clearing litter"},{"value":"B","label":"B. planting bulbs"},{"value":"C","label":"C. repairing benches"},{"value":"D","label":"D. painting the boathouse"},{"value":"E","label":"E. serving refreshments"},{"value":"F","label":"F. guiding visitors"},{"value":"G","label":"G. recording wildlife"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Painting has to wait, so the Blue group "will be repairing the benches along the jetty."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e021a029-5093-4020-83df-51e7ba1e3119', 'd6908b0e-e829-4515-b3a1-d5c596d0279c', 'matching_features', 'Yellow group', '[{"value":"A","label":"A. clearing litter"},{"value":"B","label":"B. planting bulbs"},{"value":"C","label":"C. repairing benches"},{"value":"D","label":"D. painting the boathouse"},{"value":"E","label":"E. serving refreshments"},{"value":"F","label":"F. guiding visitors"},{"value":"G","label":"G. recording wildlife"}]'::jsonb, ARRAY['F']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The Yellow group "will be guiding visitors", while "the café staff are handling" refreshments.', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('cc502c50-c835-444c-b8d2-aa8def28e3a3', 'd6908b0e-e829-4515-b3a1-d5c596d0279c', 'matching_features', 'Green group', '[{"value":"A","label":"A. clearing litter"},{"value":"B","label":"B. planting bulbs"},{"value":"C","label":"C. repairing benches"},{"value":"D","label":"D. painting the boathouse"},{"value":"E","label":"E. serving refreshments"},{"value":"F","label":"F. guiding visitors"},{"value":"G","label":"G. recording wildlife"}]'::jsonb, ARRAY['G']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The Green group "will be recording wildlife in the wetland area."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('33f4d18e-5544-4f44-b0c5-89cb6dda7300', 'd6908b0e-e829-4515-b3a1-d5c596d0279c', 'matching_features', 'Purple group', '[{"value":"A","label":"A. clearing litter"},{"value":"B","label":"B. planting bulbs"},{"value":"C","label":"C. repairing benches"},{"value":"D","label":"D. painting the boathouse"},{"value":"E","label":"E. serving refreshments"},{"value":"F","label":"F. guiding visitors"},{"value":"G","label":"G. recording wildlife"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The Purple group''s job "is clearing litter from the meadow."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('57515e31-a084-4e1f-b4c7-4c04b8d39c9f', 'f21bc676-935b-425d-92d8-aabddef3b09f', 3, NULL, NULL, NULL, 'Questions 21-25: choose the correct letter, A, B or C. Questions 26-30: what do the students say about each part of their research? Choose from the list A-F.', '{"title":"Part 3 — Discussing a survey on commuting habits"}'::jsonb, 2)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.item_group_scripts (group_id, transcript) values ('57515e31-a084-4e1f-b4c7-4c04b8d39c9f', 'TUTOR: Come in, Leila, Owen. So, you wanted to talk about your project on how staff at the hospital get to work?
LEILA: Yes. We''ve collected all our data now and we''re starting on the report, but we''ve got a few questions.
TUTOR: Fine. Remind me first why you chose the hospital.
OWEN: Well, at first we thought about the shopping centre, because it''s so big, but the managers wouldn''t give us permission. The hospital was keen, mainly because they''re planning a new car park and wanted to know whether it''s really needed.
LEILA: So they had a practical reason to help us, which made it much easier.
TUTOR: Good. And how many people took part in the end?
LEILA: We hoped for five hundred. We sent the questionnaire to about nine hundred staff, and we got three hundred and twelve replies.
TUTOR: That''s a decent response. What was the most interesting finding?
OWEN: I expected the night-shift workers to drive more than anyone, and they do, but what surprised us was that cycling was much more common among senior doctors than among junior staff.
LEILA: Yes, we''d assumed it would be the younger staff on bikes.
TUTOR: Interesting. Did you find out why?
OWEN: Partly because many senior staff live closer to the hospital, in the older neighbourhoods. Junior staff tend to rent further out, where it''s cheaper.
TUTOR: That makes sense. Now, what did you want to ask me?
LEILA: Mostly about the structure. Should we present the interviews before the questionnaire results, or after?
TUTOR: After. The questionnaire gives the overall picture, and the interviews explain it. Readers need the picture first.
OWEN: OK. And the other thing is length. We''re well over the word limit.
TUTOR: Then look at your literature review. Students usually write too much there. Keep the methods section as it is, because that''s where examiners check your work is reliable.
LEILA: Right. Let''s go through each part of the research quickly, then. The questionnaire first.
OWEN: I''d say the questionnaire was easily the most reliable source of data we had. The numbers were large and the questions were the same for everyone.
TUTOR: I''d agree. What about the interviews?
LEILA: The interviews took far longer than we''d planned. We''d scheduled twenty minutes each, but people kept talking for nearly an hour.
OWEN: Which was lovely, but it meant we only managed twelve.
TUTOR: Twelve is enough. And the traffic count at the main gate?
OWEN: That one gave us surprising results. We counted cars at the gate for a week, and there were far fewer cars at peak times than the hospital thought, because so many staff arrive outside normal rush hours.
TUTOR: That''s very useful for the car park question. Make it prominent. And the map you made of where staff live?
LEILA: We were worried about the map. We thought plotting postcodes would be really technical, but actually there''s free software that does it in minutes. It was easier than we thought.
TUTOR: Good. Anything else?
OWEN: There''s the cost comparison, where we worked out what each type of commute costs per month. To be honest, I''m not sure it fits.
LEILA: I think it does, but we used fuel prices from last year, so the figures may be wrong.
TUTOR: Hmm. Let me look at it before you decide. Send me that section and I''ll check the figures myself before you include it.
OWEN: So that one needs to be checked by you.
TUTOR: Exactly. And I don''t think anything should be left out completely. Now, when is your deadline?
LEILA: The fourteenth of next month.
TUTOR: Then send me a draft a week before. Good work, both of you.')
on conflict (group_id) do update set transcript = excluded.transcript;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('1e81d17f-f55d-4118-a7ec-e968831ff96e', '57515e31-a084-4e1f-b4c7-4c04b8d39c9f', 'multiple_choice_single', 'The students chose the hospital because', '[{"value":"A","label":"A. it is the largest employer"},{"value":"B","label":"B. it wanted information about parking"},{"value":"C","label":"C. the shopping centre was too far away"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Owen says the hospital was keen "because they''re planning a new car park and wanted to know whether it''s really needed."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('4566c34e-1d24-4678-9b55-a2616d9c93b5', '57515e31-a084-4e1f-b4c7-4c04b8d39c9f', 'multiple_choice_single', 'How many completed questionnaires did they receive?', '[{"value":"A","label":"A. 312"},{"value":"B","label":"B. 500"},{"value":"C","label":"C. 900"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Leila says "we got three hundred and twelve replies"; five hundred was only what they "hoped for."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('18ac5955-f759-447a-abda-970c197ca451', '57515e31-a084-4e1f-b4c7-4c04b8d39c9f', 'multiple_choice_single', 'What surprised the students?', '[{"value":"A","label":"A. how many night-shift staff drive"},{"value":"B","label":"B. how many senior doctors cycle"},{"value":"C","label":"C. how many junior staff live nearby"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Owen says "cycling was much more common among senior doctors than among junior staff."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('89363995-04f3-413b-b18b-ad6022e652f9', '57515e31-a084-4e1f-b4c7-4c04b8d39c9f', 'multiple_choice_single', 'The tutor advises them to put the interviews', '[{"value":"A","label":"A. before the questionnaire results"},{"value":"B","label":"B. after the questionnaire results"},{"value":"C","label":"C. in an appendix"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Asked "before ... or after?", the tutor answers "After."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e0ae3ea5-441e-4833-9c07-fe36190d3ed9', '57515e31-a084-4e1f-b4c7-4c04b8d39c9f', 'multiple_choice_single', 'To reduce the length, the tutor suggests shortening the', '[{"value":"A","label":"A. literature review"},{"value":"B","label":"B. methods section"},{"value":"C","label":"C. conclusion"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The tutor says "look at your literature review. Students usually write too much there."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('3007c0c9-d7f7-468e-b90b-d00b8060ffb5', '57515e31-a084-4e1f-b4c7-4c04b8d39c9f', 'matching_features', 'the questionnaire', '[{"value":"A","label":"A. It was the most reliable source of data."},{"value":"B","label":"B. It took longer than expected."},{"value":"C","label":"C. It produced surprising results."},{"value":"D","label":"D. It should be left out of the report."},{"value":"E","label":"E. It needs to be checked by the tutor."},{"value":"F","label":"F. It was easier than the students thought."}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Owen says "the questionnaire was easily the most reliable source of data we had."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('5c321f75-ecff-4ed8-b315-f4c2ba42c34f', '57515e31-a084-4e1f-b4c7-4c04b8d39c9f', 'matching_features', 'the interviews', '[{"value":"A","label":"A. It was the most reliable source of data."},{"value":"B","label":"B. It took longer than expected."},{"value":"C","label":"C. It produced surprising results."},{"value":"D","label":"D. It should be left out of the report."},{"value":"E","label":"E. It needs to be checked by the tutor."},{"value":"F","label":"F. It was easier than the students thought."}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Leila says "The interviews took far longer than we''d planned."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('3f68596d-663f-4f3b-99b9-fa4a61277b2f', '57515e31-a084-4e1f-b4c7-4c04b8d39c9f', 'matching_features', 'the traffic count', '[{"value":"A","label":"A. It was the most reliable source of data."},{"value":"B","label":"B. It took longer than expected."},{"value":"C","label":"C. It produced surprising results."},{"value":"D","label":"D. It should be left out of the report."},{"value":"E","label":"E. It needs to be checked by the tutor."},{"value":"F","label":"F. It was easier than the students thought."}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Owen says the traffic count "gave us surprising results."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('1e4d91c5-0cca-46ee-b611-eafa535ead09', '57515e31-a084-4e1f-b4c7-4c04b8d39c9f', 'matching_features', 'the map', '[{"value":"A","label":"A. It was the most reliable source of data."},{"value":"B","label":"B. It took longer than expected."},{"value":"C","label":"C. It produced surprising results."},{"value":"D","label":"D. It should be left out of the report."},{"value":"E","label":"E. It needs to be checked by the tutor."},{"value":"F","label":"F. It was easier than the students thought."}]'::jsonb, ARRAY['F']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Leila says of the map "It was easier than we thought."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('7038e953-7300-4d4a-936c-aff449ce08f0', '57515e31-a084-4e1f-b4c7-4c04b8d39c9f', 'matching_features', 'the cost comparison', '[{"value":"A","label":"A. It was the most reliable source of data."},{"value":"B","label":"B. It took longer than expected."},{"value":"C","label":"C. It produced surprising results."},{"value":"D","label":"D. It should be left out of the report."},{"value":"E","label":"E. It needs to be checked by the tutor."},{"value":"F","label":"F. It was easier than the students thought."}]'::jsonb, ARRAY['E']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The tutor says "I''ll check the figures myself before you include it", and Owen confirms "that one needs to be checked by you."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('97d8e374-d80b-4c74-ad4f-ef54a73694af', 'f21bc676-935b-425d-92d8-aabddef3b09f', 4, NULL, NULL, NULL, 'Questions 31-40. Complete the notes below. Write ONE WORD ONLY for each answer.', '{"title":"Part 4 — Lecture: the history of the public library"}'::jsonb, 3)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.item_group_scripts (group_id, transcript) values ('97d8e374-d80b-4c74-ad4f-ef54a73694af', 'LECTURER: Good afternoon. Today I want to look at the history of the public library, an institution most of us take for granted, but which is surprisingly recent in its modern form.
LECTURER: Collections of books and documents are, of course, ancient. The great libraries of the ancient world, such as the one at Alexandria, were impressive, but they were not public in our sense. They served scholars and rulers. Access was a privilege, not a right.
LECTURER: For much of the Middle Ages, books in Europe were kept mainly in monasteries. Because each book was copied by hand, they were extremely valuable, and in many libraries the books were actually attached to the shelves with a chain, so that they could be read but not removed. Some of these chained libraries survive today and can still be visited.
LECTURER: The invention of printing changed things enormously. Books became cheaper, and literacy slowly spread. But for most working people, books were still too expensive to buy. In the eighteenth century, a solution appeared in the form of the subscription library. Members paid a yearly fee, and in return they could borrow books from a shared collection. These were popular with the middle classes, but the fee still excluded the poor.
LECTURER: Another important development was the circulating library, often run by a bookseller, which lent novels for a small charge per book. Critics at the time complained that these libraries encouraged people, especially young women, to read nothing but romantic fiction. We might smile at that now, but it shows that people already argued about what libraries should be for.
LECTURER: The real turning point came in the middle of the nineteenth century. In Britain, an Act of Parliament in 1850 allowed towns to raise money through local taxes to build free libraries. At first, the amount they could raise was very small, and many towns chose not to bother. The movement grew slowly until wealthy individuals began to help.
LECTURER: The most famous of these was the industrialist Andrew Carnegie, who paid for more than two and a half thousand library buildings around the world. Carnegie had an interesting condition, though. He paid for the building, but the town had to provide the land and promise to fund the books and staff every year. In other words, he wanted the community to take responsibility.
LECTURER: Early public libraries looked quite different from today''s. In most of them, readers were not allowed to touch the shelves. You looked up a book in a catalogue, wrote its number on a slip, and handed it to a member of staff, who fetched it for you. The idea of open shelves, where readers could browse freely, was controversial. Librarians feared that books would be stolen or put back in the wrong place. In fact, when open access was introduced, it was so popular that it spread rapidly.
LECTURER: Libraries also became places of quiet study, and in many towns the reading room, where newspapers were laid out, was used by people who could not afford to buy a daily paper. For job seekers in particular, the newspaper advertisements were essential.
LECTURER: In the twentieth century, libraries extended their services in new directions. Children''s libraries became common after the First World War. In rural areas, where people lived far from any town, mobile libraries were introduced. At first these were horse-drawn carts, later vans, carrying several thousand books from village to village.
LECTURER: Today, of course, libraries face a new challenge from digital technology. Some people predicted that the internet would make them unnecessary. But visitor numbers in many places show a different story. Libraries now lend e-books, offer free computer access and run classes in digital skills, particularly for older people. Many also act as community hubs, hosting everything from job clubs to toddler groups.
LECTURER: If there is one theme running through this history, it is the idea of equality. Each stage, from the subscription library to the free library to free internet access, has widened access to knowledge. And that, I would argue, is why the public library still matters. Next week we''ll look at the architecture of library buildings.')
on conflict (group_id) do update set transcript = excluded.transcript;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('82f6cc26-dae0-4bb7-bc42-b023f1637c13', '97d8e374-d80b-4c74-ad4f-ef54a73694af', 'note_completion', 'Ancient libraries served scholars and ______.', '[]'::jsonb, ARRAY['rulers']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The lecturer says ancient libraries "served scholars and rulers."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e5ca06cf-7441-4b6f-8c3a-b76c3d004243', '97d8e374-d80b-4c74-ad4f-ef54a73694af', 'note_completion', 'Medieval books were often attached to shelves with a ______.', '[]'::jsonb, ARRAY['chain']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Books were "attached to the shelves with a chain."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('4d93aacd-2a9d-410b-9003-f1979922e0c3', '97d8e374-d80b-4c74-ad4f-ef54a73694af', 'note_completion', 'Subscription library members paid a yearly ______.', '[]'::jsonb, ARRAY['fee']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'In subscription libraries "Members paid a yearly fee."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('8a5f1c1c-3168-42d8-a1f8-325fcf59485e', '97d8e374-d80b-4c74-ad4f-ef54a73694af', 'note_completion', 'Circulating libraries were often run by a ______.', '[]'::jsonb, ARRAY['bookseller']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The circulating library was "often run by a bookseller."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('620e22c0-ea4f-4766-9b24-06888bb8b826', '97d8e374-d80b-4c74-ad4f-ef54a73694af', 'note_completion', 'From 1850, towns could use local ______ to build free libraries.', '[]'::jsonb, ARRAY['taxes', 'tax']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The 1850 Act "allowed towns to raise money through local taxes."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('17346e30-8bf8-47a3-a696-794f2eebb05d', '97d8e374-d80b-4c74-ad4f-ef54a73694af', 'note_completion', 'Carnegie''s condition: the town provided the ______ and paid for books and staff.', '[]'::jsonb, ARRAY['land']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Carnegie paid for the building, "but the town had to provide the land."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('0aed8b47-b3c0-4d7d-bc21-e33a713321d2', '97d8e374-d80b-4c74-ad4f-ef54a73694af', 'note_completion', 'Readers used a ______ to find a book''s number.', '[]'::jsonb, ARRAY['catalogue', 'catalog']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The lecturer explains "You looked up a book in a catalogue, wrote its number on a slip."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e4819251-2cc1-4343-96c4-6ac02ee00ac4', '97d8e374-d80b-4c74-ad4f-ef54a73694af', 'note_completion', 'Reading-room newspapers were especially important for ______ seekers.', '[]'::jsonb, ARRAY['job']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The lecturer says "For job seekers in particular, the newspaper advertisements were essential."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('1220dce4-1358-434a-bc42-36c2c2c71f04', '97d8e374-d80b-4c74-ad4f-ef54a73694af', 'note_completion', 'The first mobile libraries were horse-drawn ______.', '[]'::jsonb, ARRAY['carts', 'cart']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Of mobile libraries the lecturer says "At first these were horse-drawn carts, later vans."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('0d8bb899-fe88-471a-9cc6-88ebe28c891c', '97d8e374-d80b-4c74-ad4f-ef54a73694af', 'note_completion', 'The theme running through library history is ______.', '[]'::jsonb, ARRAY['equality']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The lecturer says the theme "is the idea of equality."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)
values ('ff503b9f-7b80-4900-92a3-72f079d32718', 'f08fa3c1-8485-4593-b50e-b1bb033c1368', 'reading', 3600, 40, NULL, 1)
on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('2c365888-bffa-4174-bb37-caefa0aff091', 'ff503b9f-7b80-4900-92a3-72f079d32718', 1, 'WESTFIELD LEISURE CENTRE — IMPORTANT NOTICE TO ALL MEMBERS

From Monday 3 March the main pool will close for six weeks while the changing rooms are refurbished. During this time the learner pool will remain open, and adult lane swimming will move there from 6.30 am to 8.30 am on weekdays only.

Swimming lessons for children will continue as normal in the learner pool. Parents are reminded that children under eight must be accompanied in the water by an adult at all times outside lessons.

The gym and fitness studios are not affected and will keep their usual hours (6 am to 10 pm, Monday to Friday; 8 am to 6 pm at weekends). Temporary changing facilities will be available in the sports hall. Please note that these have no showers, so members may wish to shower at home.

Members who use only the main pool may freeze their membership during the closure at no cost. To do this, speak to a member of staff at reception; requests cannot be made online. Frozen memberships will restart automatically when the pool reopens.

The café will offer a 10% discount to all members throughout the refurbishment as a thank-you for your patience. We apologise for any inconvenience.', NULL, NULL, 'Questions 1-7. Read the notice below. Do the following statements agree with the information given? Write TRUE, FALSE or NOT GIVEN.', '{"title":"Section 1 — Westfield Leisure Centre: changes to opening hours"}'::jsonb, 0)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('fb12dc85-5cda-4dca-a826-5273078f1583', '2c365888-bffa-4174-bb37-caefa0aff091', 'true_false_notgiven', 'The main pool will be closed for more than a month.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['TRUE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The notice says "the main pool will close for six weeks", which is more than a month.', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('b4b201e9-0e60-46f5-9c53-733aa186e3ed', '2c365888-bffa-4174-bb37-caefa0aff091', 'true_false_notgiven', 'Adult lane swimming will be available at weekends during the closure.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['FALSE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Lane swimming moves to the learner pool "on weekdays only."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('77e37524-d07e-4e1b-bc40-7877e6fbb2b0', '2c365888-bffa-4174-bb37-caefa0aff091', 'true_false_notgiven', 'Children''s swimming lessons will be cancelled during the work.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['FALSE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The notice says "Swimming lessons for children will continue as normal in the learner pool."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e14ee526-759e-4c25-8a7a-d81d6bce24d7', '2c365888-bffa-4174-bb37-caefa0aff091', 'true_false_notgiven', 'The gym will open later than usual during the refurbishment.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['FALSE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The gym is "not affected and will keep their usual hours."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('2506eab3-cb3a-484f-8d79-48dde25028e2', '2c365888-bffa-4174-bb37-caefa0aff091', 'true_false_notgiven', 'The temporary changing area includes showers.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['FALSE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The temporary facilities "have no showers."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('8747aa65-2e15-4552-a147-6c3522320897', '2c365888-bffa-4174-bb37-caefa0aff091', 'true_false_notgiven', 'Members can freeze their membership by visiting reception.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['TRUE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Members should "speak to a member of staff at reception; requests cannot be made online."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('c89c54ac-3b16-4b0b-bd96-48488458a45c', '2c365888-bffa-4174-bb37-caefa0aff091', 'true_false_notgiven', 'The café will extend its opening hours during the closure.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NOT GIVEN']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The notice mentions only "a 10% discount" at the café, and says nothing about its opening hours.', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('28b6a6e8-a694-4b24-a4a6-7189b33ced16', 'ff503b9f-7b80-4900-92a3-72f079d32718', 2, 'A. Spice Route Kitchen
Discover the flavours of South Asia in our friendly evening classes, held every Wednesday from 7 pm. Each session ends with a shared meal at a long table. All ingredients are supplied, but please bring a container to take your leftovers home. £35 per session.

B. The Weekend Baker
Spend a Saturday morning learning to make bread, pastry and cakes with a professional baker. Classes are limited to six people so everyone receives individual attention. Children aged twelve and over are welcome with a paying adult. £60 per morning.

C. Fresh Start Cooking
Never cooked before? This six-week course for complete beginners covers the basics, from boiling an egg to roasting a chicken. Run by the city council, it is free to anyone receiving unemployment benefits, and £15 per week for others.

D. Green Table
Our plant-based cooking classes show you how to prepare tasty meals without meat or dairy. Held online, so you can join from your own kitchen. A shopping list is emailed to you a week before each class. £20 per session.

E. Knife Skills Masterclass
A single three-hour workshop for people who already cook but want to work faster and more safely. You will learn to chop, slice and fillet like a chef. Every participant takes home a professional cook''s knife, included in the price of £85.', NULL, NULL, 'Questions 8-14. Look at the five advertisements A-E. For which class are the following statements true? Choose the correct letter, A-E. You may use any letter more than once.', '{"title":"Section 1 — Cooking classes in the city"}'::jsonb, 1)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f254acd8-a58e-458d-a196-4fe6648286f8', '28b6a6e8-a694-4b24-a4a6-7189b33ced16', 'matching_information', 'You do not need to leave home to attend this class.', '[{"value":"A","label":"A. Spice Route Kitchen"},{"value":"B","label":"B. The Weekend Baker"},{"value":"C","label":"C. Fresh Start Cooking"},{"value":"D","label":"D. Green Table"},{"value":"E","label":"E. Knife Skills Masterclass"}]'::jsonb, ARRAY['D']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Green Table is "Held online, so you can join from your own kitchen."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f44acd0e-3adb-460e-ae66-f38967bd798e', '28b6a6e8-a694-4b24-a4a6-7189b33ced16', 'matching_information', 'Participants receive a piece of equipment to keep.', '[{"value":"A","label":"A. Spice Route Kitchen"},{"value":"B","label":"B. The Weekend Baker"},{"value":"C","label":"C. Fresh Start Cooking"},{"value":"D","label":"D. Green Table"},{"value":"E","label":"E. Knife Skills Masterclass"}]'::jsonb, ARRAY['E']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'In the masterclass "Every participant takes home a professional cook''s knife."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('cad1fa20-632f-40e4-be81-f6db59f8ac0a', '28b6a6e8-a694-4b24-a4a6-7189b33ced16', 'matching_information', 'This class is suitable for people with no cooking experience.', '[{"value":"A","label":"A. Spice Route Kitchen"},{"value":"B","label":"B. The Weekend Baker"},{"value":"C","label":"C. Fresh Start Cooking"},{"value":"D","label":"D. Green Table"},{"value":"E","label":"E. Knife Skills Masterclass"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Fresh Start is a course "for complete beginners."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('cd77d610-a857-46e6-b283-d004bc9565da', '28b6a6e8-a694-4b24-a4a6-7189b33ced16', 'matching_information', 'Some people can attend this class without paying.', '[{"value":"A","label":"A. Spice Route Kitchen"},{"value":"B","label":"B. The Weekend Baker"},{"value":"C","label":"C. Fresh Start Cooking"},{"value":"D","label":"D. Green Table"},{"value":"E","label":"E. Knife Skills Masterclass"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Fresh Start "is free to anyone receiving unemployment benefits."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('a8b71c64-0adf-4e25-b5d1-fdc5ea3e2ffa', '28b6a6e8-a694-4b24-a4a6-7189b33ced16', 'matching_information', 'Participants eat together at the end of the class.', '[{"value":"A","label":"A. Spice Route Kitchen"},{"value":"B","label":"B. The Weekend Baker"},{"value":"C","label":"C. Fresh Start Cooking"},{"value":"D","label":"D. Green Table"},{"value":"E","label":"E. Knife Skills Masterclass"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'At Spice Route "Each session ends with a shared meal at a long table."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f660d1a3-18f5-4032-82a5-0c15cbcaee86', '28b6a6e8-a694-4b24-a4a6-7189b33ced16', 'matching_information', 'Young people may attend with an adult.', '[{"value":"A","label":"A. Spice Route Kitchen"},{"value":"B","label":"B. The Weekend Baker"},{"value":"C","label":"C. Fresh Start Cooking"},{"value":"D","label":"D. Green Table"},{"value":"E","label":"E. Knife Skills Masterclass"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'At The Weekend Baker "Children aged twelve and over are welcome with a paying adult."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('1cc7a7e1-c94d-4633-952a-5f9d3c1a5682', '28b6a6e8-a694-4b24-a4a6-7189b33ced16', 'matching_information', 'Participants must buy their own ingredients.', '[{"value":"A","label":"A. Spice Route Kitchen"},{"value":"B","label":"B. The Weekend Baker"},{"value":"C","label":"C. Fresh Start Cooking"},{"value":"D","label":"D. Green Table"},{"value":"E","label":"E. Knife Skills Masterclass"}]'::jsonb, ARRAY['D']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'For Green Table "A shopping list is emailed to you a week before each class", whereas Spice Route says "All ingredients are supplied."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('77afacd8-22e5-4768-af5b-a753b0a821c2', 'ff503b9f-7b80-4900-92a3-72f079d32718', 3, 'A. Welcome to Northgate Distribution. Before you start, please make sure you have returned your signed contract and a copy of your bank details to the HR office. You will also need to bring photo identification on your first morning so that your security pass can be printed. Your first shift will begin with a two-hour induction in the training room on the ground floor.

B. All warehouse staff must wear the high-visibility jacket and steel-toed boots provided by the company. These are issued during induction and remain company property. Personal jewellery, other than a plain wedding ring, must be removed before entering the warehouse floor. Long hair should be tied back.

C. Forklift trucks operate in all areas of the warehouse, so walk only along the marked yellow pathways. Never use a mobile phone while walking on the warehouse floor. If you see a spillage, report it immediately to your shift supervisor and stay beside it to warn others until it has been cleaned up. First-aid kits are located beside every fire exit.

D. Wages are paid every two weeks, on a Friday, directly into your bank account. Overtime is paid at one and a half times your normal hourly rate and must be approved in advance by your shift supervisor. Your payslip can be viewed on the staff portal, where you can also update your address.

E. If you are ill and unable to attend, you must telephone the absence line at least one hour before your shift starts. Text messages and emails are not accepted. For absences of more than seven days, a doctor''s note is required. Holiday requests should be made through the staff portal at least four weeks in advance.

F. Your shift supervisor is your first point of contact for any question about your work. For questions about contracts or pay, contact HR, which is open from 9 am to 5 pm on weekdays. Every new employee is also given a buddy, an experienced colleague who will work alongside you during your first fortnight.', NULL, NULL, 'Questions 15-20: the guide has six sections, A-F. Choose the correct heading for each section from the list of headings i-viii. Questions 21-27: complete the sentences below. Write NO MORE THAN TWO WORDS from the text for each answer.', '{"title":"Section 2 — Northgate Distribution: guide for new warehouse staff"}'::jsonb, 2)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('7552ad4b-a3dc-4cfe-aba7-74b237b1acd7', '77afacd8-22e5-4768-af5b-a753b0a821c2', 'matching_headings', 'Section A', '[{"value":"i","label":"i. Before your first day"},{"value":"ii","label":"ii. Keeping yourself and others safe"},{"value":"iii","label":"iii. Getting paid"},{"value":"iv","label":"iv. Opportunities for promotion"},{"value":"v","label":"v. Who to ask for help"},{"value":"vi","label":"vi. When you cannot come to work"},{"value":"vii","label":"vii. Looking the part"},{"value":"viii","label":"viii. Social events for staff"}]'::jsonb, ARRAY['i']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Section A lists what to do "Before you start", such as returning "your signed contract."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('79cdaac6-15cb-48f3-a5b8-1523c0bb3ae9', '77afacd8-22e5-4768-af5b-a753b0a821c2', 'matching_headings', 'Section B', '[{"value":"i","label":"i. Before your first day"},{"value":"ii","label":"ii. Keeping yourself and others safe"},{"value":"iii","label":"iii. Getting paid"},{"value":"iv","label":"iv. Opportunities for promotion"},{"value":"v","label":"v. Who to ask for help"},{"value":"vi","label":"vi. When you cannot come to work"},{"value":"vii","label":"vii. Looking the part"},{"value":"viii","label":"viii. Social events for staff"}]'::jsonb, ARRAY['vii']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Section B covers clothing: staff "must wear the high-visibility jacket and steel-toed boots."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('c3a0737b-25cc-46d6-b245-61a56c93a22e', '77afacd8-22e5-4768-af5b-a753b0a821c2', 'matching_headings', 'Section C', '[{"value":"i","label":"i. Before your first day"},{"value":"ii","label":"ii. Keeping yourself and others safe"},{"value":"iii","label":"iii. Getting paid"},{"value":"iv","label":"iv. Opportunities for promotion"},{"value":"v","label":"v. Who to ask for help"},{"value":"vi","label":"vi. When you cannot come to work"},{"value":"vii","label":"vii. Looking the part"},{"value":"viii","label":"viii. Social events for staff"}]'::jsonb, ARRAY['ii']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Section C is about safety: "walk only along the marked yellow pathways" and report spillages.', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('4a9b79f1-e61f-43ea-8658-e1d89791e003', '77afacd8-22e5-4768-af5b-a753b0a821c2', 'matching_headings', 'Section D', '[{"value":"i","label":"i. Before your first day"},{"value":"ii","label":"ii. Keeping yourself and others safe"},{"value":"iii","label":"iii. Getting paid"},{"value":"iv","label":"iv. Opportunities for promotion"},{"value":"v","label":"v. Who to ask for help"},{"value":"vi","label":"vi. When you cannot come to work"},{"value":"vii","label":"vii. Looking the part"},{"value":"viii","label":"viii. Social events for staff"}]'::jsonb, ARRAY['iii']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Section D explains that "Wages are paid every two weeks, on a Friday."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('7d7f4d18-2849-4b8f-aee6-f2c9b978aa5a', '77afacd8-22e5-4768-af5b-a753b0a821c2', 'matching_headings', 'Section E', '[{"value":"i","label":"i. Before your first day"},{"value":"ii","label":"ii. Keeping yourself and others safe"},{"value":"iii","label":"iii. Getting paid"},{"value":"iv","label":"iv. Opportunities for promotion"},{"value":"v","label":"v. Who to ask for help"},{"value":"vi","label":"vi. When you cannot come to work"},{"value":"vii","label":"vii. Looking the part"},{"value":"viii","label":"viii. Social events for staff"}]'::jsonb, ARRAY['vi']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Section E covers absence: "If you are ill and unable to attend, you must telephone the absence line."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('7bf9f303-38b5-4b79-a7b3-6c579f151d00', '77afacd8-22e5-4768-af5b-a753b0a821c2', 'matching_headings', 'Section F', '[{"value":"i","label":"i. Before your first day"},{"value":"ii","label":"ii. Keeping yourself and others safe"},{"value":"iii","label":"iii. Getting paid"},{"value":"iv","label":"iv. Opportunities for promotion"},{"value":"v","label":"v. Who to ask for help"},{"value":"vi","label":"vi. When you cannot come to work"},{"value":"vii","label":"vii. Looking the part"},{"value":"viii","label":"viii. Social events for staff"}]'::jsonb, ARRAY['v']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Section F says "Your shift supervisor is your first point of contact for any question."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('112e93c4-fed9-47f8-8e09-c6a4e0e49ffa', '77afacd8-22e5-4768-af5b-a753b0a821c2', 'sentence_completion', 'New staff need ______ on their first morning so a security pass can be made.', '[]'::jsonb, ARRAY['photo identification']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Staff must "bring photo identification on your first morning so that your security pass can be printed."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('138cab46-f5dc-480a-85cd-58ce16b3cae6', '77afacd8-22e5-4768-af5b-a753b0a821c2', 'sentence_completion', 'The induction takes place in the ______.', '[]'::jsonb, ARRAY['training room']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'The first shift begins "with a two-hour induction in the training room."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('7a1564d8-bab8-42df-92e8-fd317e33b001', '77afacd8-22e5-4768-af5b-a753b0a821c2', 'sentence_completion', 'The only jewellery allowed on the warehouse floor is a plain ______.', '[]'::jsonb, ARRAY['wedding ring']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Jewellery, "other than a plain wedding ring, must be removed."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('c4a05f6a-b509-4c5f-b794-f7a20ee6543c', '77afacd8-22e5-4768-af5b-a753b0a821c2', 'sentence_completion', 'First-aid kits can be found next to each ______.', '[]'::jsonb, ARRAY['fire exit']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'The guide says "First-aid kits are located beside every fire exit."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('0ba0c45d-2f4e-45ce-9e3d-ec88889d1009', '77afacd8-22e5-4768-af5b-a753b0a821c2', 'sentence_completion', 'Overtime must be approved beforehand by the ______.', '[]'::jsonb, ARRAY['shift supervisor', 'supervisor']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Overtime "must be approved in advance by your shift supervisor."', 10)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('c3bf964c-79ff-4128-a214-633aa5f26b90', '77afacd8-22e5-4768-af5b-a753b0a821c2', 'sentence_completion', 'Staff who are absent for over a week must provide a ______.', '[]'::jsonb, ARRAY['doctor''s note']::text[], 2, 'lenient', true, false, '{}'::jsonb, '"For absences of more than seven days, a doctor''s note is required."', 11)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('61954cd4-040c-4f0e-bd6a-ee94dbfd90a8', '77afacd8-22e5-4768-af5b-a753b0a821c2', 'sentence_completion', 'During their first two weeks, new staff work with a ______.', '[]'::jsonb, ARRAY['buddy']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Each new employee "is also given a buddy, an experienced colleague who will work alongside you during your first fortnight."', 12)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('ac9ab633-6c2b-4015-8e83-27def6d8e1a5', 'ff503b9f-7b80-4900-92a3-72f079d32718', 4, 'Walk down almost any high street fifty years ago and you would have found a shoe repairer, a watchmender and a shop that fixed radios and televisions. Repair was simply part of ordinary life. When a kettle stopped working, the obvious thing to do was to take it to someone who could mend it. By the end of the twentieth century, most of those shops had disappeared. Manufactured goods had become so cheap that buying a new toaster often cost less than paying someone to repair the old one, and many products were designed in ways that made repair difficult or impossible.

Yet in the past decade something unexpected has happened. In towns and cities across Europe and North America, repair is making a comeback. Some of this activity takes the form of traditional businesses, but much of it is happening in a newer and more informal setting: the repair café. The first repair café was organised in Amsterdam in 2009 by a journalist, Martine Postma, who wanted to do something practical about waste. The idea was simple. Once a month, in a community hall, volunteers with practical skills would sit at tables with their tools, and members of the public would bring in broken items to be fixed for free. Today there are more than two thousand repair cafés worldwide.

What is striking about these events is that they are not only about fixing things. Visitors are expected to stay with their item and watch, or even help, while it is repaired. The aim is to pass on knowledge, so that next time the owner might be able to do the job themselves. Many volunteers say that this teaching is the most rewarding part of the experience. As one retired electrician put it, ''Anyone can replace a fuse. What I enjoy is the look on someone''s face when they realise they could have done it all along.''

The success of repair cafés reflects a wider change in attitudes. Surveys suggest that younger consumers in particular are increasingly uncomfortable with the idea of throwing things away. Concern about the environment is part of the explanation: electronic waste is now one of the fastest-growing kinds of rubbish, and much of it contains valuable metals that are rarely recovered. But money matters too. During periods of rising prices, people are more willing to extend the life of what they already own.

Governments have started to take notice. Several countries have introduced what are known as ''right to repair'' laws, which require manufacturers of certain products, such as washing machines and refrigerators, to make spare parts available for a number of years after a model is sold. Some laws also require that products can be opened with ordinary tools rather than special ones that only the manufacturer possesses. France has gone further, requiring sellers of some electronic goods to display a repairability score, from one to ten, so that shoppers can compare products before they buy.

Not everyone is enthusiastic. Some manufacturers argue that allowing untrained people to open devices raises safety concerns, particularly with products containing powerful batteries. Others point out that making products easy to take apart can make them heavier or more expensive. These arguments are not without merit, but in my view they are frequently exaggerated. Many of the design features that prevent repair, such as glued-in batteries, exist mainly to make products thinner or cheaper to assemble, not to protect the user.

There are also practical limits to what repair cafés can achieve. Volunteers are often older people whose skills were learned on simpler machines, and modern electronics, with their tiny components and specialist software, can defeat even the most experienced fixer. Some cafés have responded by recruiting younger volunteers who are comfortable with smartphones and laptops, and by sharing repair guides online.

Whether repair will ever return to the central place it once held in daily life is uncertain. Manufactured goods remain cheap, and convenience is a powerful force. But the repair movement has already achieved something important. It has reminded large numbers of people that the objects around them are not mysterious, and that a broken thing is not necessarily a finished one. That change of attitude may turn out to matter more than any number of mended kettles.

Perhaps the most hopeful sign is how ordinary repair has begun to seem again. Libraries lend tools, schools run workshops where pupils take apart old radios, and online videos show millions of viewers how to replace a cracked phone screen or a worn bicycle chain. None of this will bring back the high street of fifty years ago, but it suggests that the habit of fixing things has not been lost, only forgotten for a while.', NULL, NULL, 'Questions 28-40. Read the passage below. Questions 28-32: choose the correct letter, A, B, C or D. Questions 33-36: do the statements agree with the views of the writer? Write YES, NO or NOT GIVEN. Questions 37-40: complete the summary using ONE WORD ONLY from the passage.', '{"title":"Section 3 — The quiet comeback of the repair shop"}'::jsonb, 3)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('5d9a54b5-ae22-4570-87b6-d6edb2b98eea', 'ac9ab633-6c2b-4015-8e83-27def6d8e1a5', 'multiple_choice_single', 'According to the writer, why did many repair shops close?', '[{"value":"A","label":"A. Customers no longer trusted repairers."},{"value":"B","label":"B. New goods were often cheaper than repairs."},{"value":"C","label":"C. Repairers retired without training others."},{"value":"D","label":"D. High street rents increased sharply."}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The writer says "buying a new toaster often cost less than paying someone to repair the old one."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('ba43f2b2-52d1-42be-9d8f-f43ec6c116e4', 'ac9ab633-6c2b-4015-8e83-27def6d8e1a5', 'multiple_choice_single', 'Martine Postma started the first repair café because she wanted to', '[{"value":"A","label":"A. write a newspaper story"},{"value":"B","label":"B. create jobs for volunteers"},{"value":"C","label":"C. take practical action on waste"},{"value":"D","label":"D. raise money for a community hall"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Postma "wanted to do something practical about waste."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('cd765069-fafe-4331-b754-cb78a770bdc2', 'ac9ab633-6c2b-4015-8e83-27def6d8e1a5', 'multiple_choice_single', 'Visitors to a repair café are expected to', '[{"value":"A","label":"A. leave their item for collection later"},{"value":"B","label":"B. pay a small fee for parts"},{"value":"C","label":"C. stay and learn from the repair"},{"value":"D","label":"D. bring their own tools"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Visitors "are expected to stay with their item and watch, or even help", because "The aim is to pass on knowledge."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('b5996ec8-cbed-4085-b4ad-d2cbbb669714', 'ac9ab633-6c2b-4015-8e83-27def6d8e1a5', 'multiple_choice_single', 'The retired electrician enjoys', '[{"value":"A","label":"A. solving difficult technical problems"},{"value":"B","label":"B. showing people they are capable"},{"value":"C","label":"C. replacing parts quickly"},{"value":"D","label":"D. meeting other volunteers"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'He enjoys "the look on someone''s face when they realise they could have done it all along."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('511573ff-df44-48ce-ac42-51bbdc0a4306', 'ac9ab633-6c2b-4015-8e83-27def6d8e1a5', 'multiple_choice_single', 'In France, some electronic goods must show', '[{"value":"A","label":"A. the cost of spare parts"},{"value":"B","label":"B. the expected lifetime of the product"},{"value":"C","label":"C. a score for how easy they are to repair"},{"value":"D","label":"D. the nearest repair café"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'France requires sellers "to display a repairability score, from one to ten."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('4d5d49c7-dc5b-4790-b60d-965bded5b3e4', 'ac9ab633-6c2b-4015-8e83-27def6d8e1a5', 'yes_no_notgiven', 'Younger consumers are more comfortable throwing things away than older consumers.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NO']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The writer says "younger consumers in particular are increasingly uncomfortable with the idea of throwing things away."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('30eededa-3bd6-4dbf-a36f-9a0f906e470b', 'ac9ab633-6c2b-4015-8e83-27def6d8e1a5', 'yes_no_notgiven', 'Manufacturers'' safety concerns are often overstated.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['YES']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The writer says "in my view they are frequently exaggerated."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('c7112392-8a3e-4847-8390-3bf1ff0b49e0', 'ac9ab633-6c2b-4015-8e83-27def6d8e1a5', 'yes_no_notgiven', 'Glued-in batteries are mainly intended to protect the user.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NO']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Such features "exist mainly to make products thinner or cheaper to assemble, not to protect the user."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('15af9965-d6d6-48bb-881b-2aaa587cf669', 'ac9ab633-6c2b-4015-8e83-27def6d8e1a5', 'yes_no_notgiven', 'Repair cafés should receive funding from local councils.', '[{"value":"YES","label":"YES"},{"value":"NO","label":"NO"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NOT GIVEN']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The writer discusses "right to repair" laws but gives no view on councils funding repair cafés.', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('419d872c-159f-4e9b-94da-28b6a5ec7c95', 'ac9ab633-6c2b-4015-8e83-27def6d8e1a5', 'summary_completion', 'Electronic waste often contains valuable ______ that are seldom recovered.', '[]'::jsonb, ARRAY['metals']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Much electronic waste "contains valuable metals that are rarely recovered."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('1adef45d-a6d8-4972-baf5-8debc549421b', 'ac9ab633-6c2b-4015-8e83-27def6d8e1a5', 'summary_completion', 'Right to repair laws require manufacturers to supply spare ______ for several years.', '[]'::jsonb, ARRAY['parts']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The laws require manufacturers "to make spare parts available for a number of years."', 10)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('74a97a84-0e8e-47a1-b2c1-2f9e2fbbd122', 'ac9ab633-6c2b-4015-8e83-27def6d8e1a5', 'summary_completion', 'Many volunteers learned their skills on ______ machines.', '[]'::jsonb, ARRAY['simpler']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Volunteers'' "skills were learned on simpler machines."', 11)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f3c39c34-c5e0-4c14-9966-7d06155c3a4f', 'ac9ab633-6c2b-4015-8e83-27def6d8e1a5', 'summary_completion', 'Some cafés now share repair ______ online.', '[]'::jsonb, ARRAY['guides']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Some cafés responded "by sharing repair guides online."', 12)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)
values ('ecb74ae6-47db-462b-b7b9-664217f56994', 'f08fa3c1-8485-4593-b50e-b1bb033c1368', 'writing', 3600, 2, NULL, 2)
on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('821b4d08-89e7-48d7-a6d2-9d3654a683ee', 'ecb74ae6-47db-462b-b7b9-664217f56994', 1, 'You recently stayed at a hotel and left a valuable item in your room when you checked out.

Write a letter to the hotel manager. In your letter:
  •  give details of your stay
  •  describe the item and explain why it is important to you
  •  say how you would like the item to be returned

Begin your letter as follows:

Dear Sir or Madam,', NULL, NULL, 'You should spend about 20 minutes on this task. Write at least 150 words. You do NOT need to write any addresses.', '{"title":"Task 1"}'::jsonb, 0)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('92463207-0c16-4829-92ad-ebc3d7959202', '821b4d08-89e7-48d7-a6d2-9d3654a683ee', 'short_answer', 'Task 1 response', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('4bf90e23-e6d8-4a42-a8d0-100478284f68', 'ecb74ae6-47db-462b-b7b9-664217f56994', 2, 'In many countries, people are working longer hours than ever before, and some say this has a negative effect on family life.

What are the causes of this trend? What can be done to reduce its effects?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.', NULL, NULL, 'You should spend about 40 minutes on this task. Write at least 250 words.', '{"title":"Task 2"}'::jsonb, 1)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('38e7478d-abb2-442c-855f-ae6d15645072', '4bf90e23-e6d8-4a42-a8d0-100478284f68', 'short_answer', 'Task 2 response', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)
values ('ff20e403-4d15-4a8f-b6f8-ddd549733c79', 'f08fa3c1-8485-4593-b50e-b1bb033c1368', 'speaking', 840, 12, NULL, 3)
on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('6dcdb2f5-18c7-4bab-918d-ab31dc65cedd', 'ff20e403-4d15-4a8f-b6f8-ddd549733c79', 1, NULL, NULL, NULL, 'The examiner asks about yourself, your home, work or studies and other familiar topics. 4-5 minutes.', '{"title":"Part 1 — Introduction and familiar topics"}'::jsonb, 0)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('a6de102a-5ef4-4910-8c2c-9ece63b8f594', '6dcdb2f5-18c7-4bab-918d-ab31dc65cedd', 'short_answer', 'Let''s talk about your work or studies. What do you do?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('62236970-16c9-44c8-af83-69d20af06b74', '6dcdb2f5-18c7-4bab-918d-ab31dc65cedd', 'short_answer', 'What do you enjoy most about it?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('99d2932b-c5ed-4c0b-be40-67202e1de027', '6dcdb2f5-18c7-4bab-918d-ab31dc65cedd', 'short_answer', 'Is there anything you would like to change about it?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('8b5fa992-2ab2-46fa-8a07-baaeeccfba1f', '6dcdb2f5-18c7-4bab-918d-ab31dc65cedd', 'short_answer', 'Now let''s talk about weekends. What do you usually do at the weekend?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('b34b5ca1-3bbc-4d88-9ae6-b3c970fef9ce', '6dcdb2f5-18c7-4bab-918d-ab31dc65cedd', 'short_answer', 'Did you spend your weekends differently as a child?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('1803e691-776e-458b-b658-ba522c53f278', '6dcdb2f5-18c7-4bab-918d-ab31dc65cedd', 'short_answer', 'Do you prefer busy or relaxing weekends? Why?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('a50812ab-94e5-434a-a526-f7d1d7fab10a', 'ff20e403-4d15-4a8f-b6f8-ddd549733c79', 2, 'Describe a neighbour you know well.

You should say:
  •  who this person is
  •  how long you have known them
  •  what you usually do or talk about together

and explain why you get on well with this person.', NULL, NULL, 'You have one minute to prepare. You may make notes. Then talk for one to two minutes. The examiner will tell you when to stop.', '{"title":"Part 2 — Individual long turn"}'::jsonb, 1)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('a1116fb9-30ca-44fd-a928-703bd05fb78b', 'a50812ab-94e5-434a-a526-f7d1d7fab10a', 'short_answer', 'Long turn response', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('b145e4a8-bd8d-41cf-8395-104b85dbddec', 'ff20e403-4d15-4a8f-b6f8-ddd549733c79', 3, NULL, NULL, NULL, 'The examiner asks further questions connected to the topic in Part 2. 4-5 minutes.', '{"title":"Part 3 — Two-way discussion"}'::jsonb, 2)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f39610d0-2141-4dc0-899f-4bb4e61d0a8b', 'b145e4a8-bd8d-41cf-8395-104b85dbddec', 'short_answer', 'Do people know their neighbours as well as they did in the past?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('8e9acd3d-7b02-44a5-adb6-21fb4264bd71', 'b145e4a8-bd8d-41cf-8395-104b85dbddec', 'short_answer', 'What can people do to build a sense of community where they live?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('54f0c087-a6ae-4db2-aae2-8ec368a3ecfb', 'b145e4a8-bd8d-41cf-8395-104b85dbddec', 'short_answer', 'Is it better to live in a large city or a small town? Why?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('2a351dda-5c11-4ae6-ba3b-eb5f0908e49d', 'b145e4a8-bd8d-41cf-8395-104b85dbddec', 'short_answer', 'How do you think neighbourhoods will change in the future?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('ac8b2a10-7100-4a72-bb6e-9c24fb39b4fd', 'b145e4a8-bd8d-41cf-8395-104b85dbddec', 'short_answer', 'Should local governments organise events for residents? Why?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

-- General Training Mock Test 2 (general-2)
insert into public.test_forms (id, slug, title, description, variant, delivery_mode, is_published, is_premium, difficulty, scoring_version)
values ('aefc3b54-b041-4a2e-936c-90c87fa1c92e', 'general-2', 'General Training Mock Test 2', 'A full General Training practice test covering all four sections.', 'general_training', 'computer', true, true, 'standard', 'v1')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, description = excluded.description, is_published = excluded.is_published, is_premium = excluded.is_premium, difficulty = excluded.difficulty;

insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)
values ('e51b1718-51a7-41b0-837d-551f0bca320c', 'aefc3b54-b041-4a2e-936c-90c87fa1c92e', 'listening', 1800, 40, NULL, 0)
on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('cc2cfcdb-35d4-4b5c-b4c1-7e852e6eae1d', 'e51b1718-51a7-41b0-837d-551f0bca320c', 1, NULL, NULL, NULL, 'Questions 1-10. Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.', '{"title":"Part 1 — Enrolling a child in a holiday activity club"}'::jsonb, 0)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.item_group_scripts (group_id, transcript) values ('cc2cfcdb-35d4-4b5c-b4c1-7e852e6eae1d', 'MAN: Good afternoon, Oakfield Holiday Club. This is Raj. How can I help you?
WOMAN: Hi. I''m calling about your summer club. I''d like to book a place for my son.
MAN: Of course. Let me open a new form. What''s your son''s name?
WOMAN: It''s Leo Brannigan. B-R-A-N-N-I-G-A-N.
MAN: Thank you. And how old is Leo?
WOMAN: He''s nine now, but he''ll be ten in August, during the club.
MAN: That''s fine. We go by age on the first day, so I''ll put him in the nine-to-eleven group. Which weeks are you interested in?
WOMAN: We''re away at the start of the holidays, so I was thinking of the third and fourth weeks.
MAN: OK. Week three starts on the twenty-eighth of July, and week four on the fourth of August. Would he do full days?
WOMAN: What are the times?
MAN: Full days are from half past eight until five. Half days are mornings only, finishing at half past twelve.
WOMAN: Full days, please. I''m working. Is there any flexibility at the end of the day? Sometimes I finish late.
MAN: We do offer a late pick-up until six o''clock, but it has to be arranged the day before, and there''s a small charge. Most parents don''t need it, but it''s there if you do.
WOMAN: That''s good to know. I''ll probably manage without it.
MAN: Right. Full days are thirty-two pounds a day, or a hundred and fifty pounds for a whole week of five days.
WOMAN: So the weekly price is cheaper. I''ll book both full weeks, then.
MAN: Lovely. Now, every week has a theme. In week three the theme is space, and in week four it''s... let me see... it was going to be pirates, but we''ve changed that to the Olympics, because of the sports facilities we''ve got this year.
WOMAN: Oh, he''ll love that. He''s very sporty.
MAN: In that case he''ll have a great time. There''s a mini sports day on the Friday, and parents are invited to watch in the afternoon.
WOMAN: Wonderful. I''ll try to take the afternoon off.
MAN: Great. Is there anything we should know about his health? Allergies, for example?
WOMAN: He''s allergic to nuts. Not severely, but he can''t eat anything containing them.
MAN: OK, I''ll put that down. We''re a nut-free site anyway, but it''s good for staff to know. Does he need to bring any medication?
WOMAN: No, nothing like that.
MAN: And will he bring a packed lunch, or have the hot lunch? The hot lunch is an extra four pounds a day.
WOMAN: He''s quite fussy, so he''ll bring his own.
MAN: Packed lunch, then. Now, every child needs to bring a few things each day. A water bottle, sun cream, and a hat. And on Wednesdays in week four, he''ll need a swimming costume, because we''re taking them to the leisure centre pool.
WOMAN: Swimming costume on Wednesday, got it.
MAN: Now, who will collect him at the end of the day? We need a name for anyone other than parents.
WOMAN: Usually it''ll be me, but on some days his grandfather will collect him. His name is Patrick Hale.
MAN: Patrick Hale. I''ll add him. He''ll need to bring some ID the first time. And finally, how did you hear about us?
WOMAN: A friend recommended you. Well, actually, I first saw a leaflet at the dentist''s, and then a friend said her daughter had a great time.
MAN: So the leaflet came first. I''ll put that. And how would you like to pay?
WOMAN: Can I pay online?
MAN: Yes, I''ll send you a link by email. Payment is due by the first of July, otherwise we can''t hold the place.
WOMAN: The first of July. That''s fine. Thank you so much.
MAN: You''re welcome. We look forward to meeting Leo.')
on conflict (group_id) do update set transcript = excluded.transcript;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('74e4906e-83b2-496d-afd0-231c7dfb7689', 'cc2cfcdb-35d4-4b5c-b4c1-7e852e6eae1d', 'note_completion', 'Child''s name: Leo ______', '[]'::jsonb, ARRAY['Brannigan']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'The mother spells the surname: "It''s Leo Brannigan. B-R-A-N-N-I-G-A-N."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('85570aea-67b2-4d6b-9ff0-d8949ac9013b', 'cc2cfcdb-35d4-4b5c-b4c1-7e852e6eae1d', 'note_completion', 'Age group: ______ to eleven', '[]'::jsonb, ARRAY['nine', '9']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Raj says "I''ll put him in the nine-to-eleven group."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('57612979-9eda-4155-b74c-cd0a136250af', 'cc2cfcdb-35d4-4b5c-b4c1-7e852e6eae1d', 'note_completion', 'Week three starts: ______ July', '[]'::jsonb, ARRAY['28th', '28', 'twenty-eighth']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Raj says "Week three starts on the twenty-eighth of July."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('5d71569a-65fe-49d8-947e-17db23488731', 'cc2cfcdb-35d4-4b5c-b4c1-7e852e6eae1d', 'note_completion', 'Cost of a full week: £______', '[]'::jsonb, ARRAY['150']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'A full week is "a hundred and fifty pounds for a whole week"; £32 is the daily price.', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('1cd388bc-c8cc-4b45-b2ea-ce7adc771331', 'cc2cfcdb-35d4-4b5c-b4c1-7e852e6eae1d', 'note_completion', 'Theme of week four: the ______', '[]'::jsonb, ARRAY['Olympics', 'Olympic Games']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Raj says the week-four theme "was going to be pirates, but we''ve changed that to the Olympics."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('8404950a-296e-4dfb-9126-6db66f1df56c', 'cc2cfcdb-35d4-4b5c-b4c1-7e852e6eae1d', 'note_completion', 'Allergy: ______', '[]'::jsonb, ARRAY['nuts', 'nut']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The mother says "He''s allergic to nuts."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('b4db35eb-e946-4ce2-997e-b395c3ad6812', 'cc2cfcdb-35d4-4b5c-b4c1-7e852e6eae1d', 'note_completion', 'Lunch: ______ lunch', '[]'::jsonb, ARRAY['packed']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'He will bring his own, so Raj notes "Packed lunch, then."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('6554e341-03bd-443c-93f9-ebb55b1c775b', 'cc2cfcdb-35d4-4b5c-b4c1-7e852e6eae1d', 'note_completion', 'Bring a ______ on Wednesdays in week four', '[]'::jsonb, ARRAY['swimming costume', 'swimsuit']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Raj says "on Wednesdays in week four, he''ll need a swimming costume."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('2de19039-537d-4393-b604-38d90ea9ff4e', 'cc2cfcdb-35d4-4b5c-b4c1-7e852e6eae1d', 'note_completion', 'Other person collecting: Patrick ______ (grandfather)', '[]'::jsonb, ARRAY['Hale']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The mother says "his grandfather will collect him. His name is Patrick Hale."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('53ba0338-6529-4975-bab7-daef78741182', 'cc2cfcdb-35d4-4b5c-b4c1-7e852e6eae1d', 'note_completion', 'Heard about the club from a ______', '[]'::jsonb, ARRAY['leaflet']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'She "first saw a leaflet at the dentist''s", and Raj says "So the leaflet came first."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('2385a9b3-c993-4fa5-badf-e36abfd1af88', 'e51b1718-51a7-41b0-837d-551f0bca320c', 2, NULL, NULL, NULL, 'Questions 11-14: choose the correct letter, A, B or C. Questions 15-20: on which floor can visitors find each of the following? Choose from the list A-F. You may use any letter more than once.', '{"title":"Part 2 — Welcome talk at the Harbourside Museum of Making"}'::jsonb, 1)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.item_group_scripts (group_id, transcript) values ('2385a9b3-c993-4fa5-badf-e36abfd1af88', 'GUIDE: Hello everyone, and welcome to the Harbourside Museum of Making. I''m Sam, and I''ll be giving you a quick introduction before you explore on your own.
GUIDE: This building has had a long history. It was built in 1902 as a warehouse for storing grain that arrived by ship. Later it was used as a furniture factory, and it''s that period, the factory years, that gave us the idea for a museum about making things. It opened as a museum only four years ago.
GUIDE: Our aim is a little different from most museums. We do display objects, of course, but what we really want is for visitors to try making things themselves. That''s why you''ll see workshops on almost every floor, and why we say on our posters that this is a museum where you are allowed to touch.
GUIDE: A few practical things. Entry to the permanent galleries is free, but the temporary exhibition this season, on the history of the bicycle, has a charge of six pounds for adults. Children under sixteen go in free. Tickets for workshops are sold at the information desk, not online, and they do sell out quickly, so I''d suggest booking as soon as you finish here.
GUIDE: We are very popular with school groups on weekday mornings, so if you''d like a quieter visit another time, I''d recommend coming in the late afternoon. And on the first Thursday of every month, we stay open until nine in the evening, with music and talks.
GUIDE: Right, let me tell you where things are. We''re standing on the ground floor now, in the main hall. Here you''ll find the information desk and also the shop, which sells materials and kits so you can continue making at home.
GUIDE: If you''ve brought coats or bags, the cloakroom is downstairs, in the basement, next to the toilets. The basement is also where we have our largest machine, an old steam engine from the factory days, which is run for visitors every hour on the hour.
GUIDE: On the first floor you''ll find the textile gallery, with weaving looms and sewing machines. The children''s workshop used to be on this floor too, but we found it got very noisy, so it''s now on the second floor, where there''s more space.
GUIDE: Also on the second floor is a small study room, where you can look at our collection of tools and design drawings. It''s open to everyone, but please ask a member of staff before handling anything there.
GUIDE: The second floor is also home to the woodwork gallery, which shows furniture made in this building over seventy years.
GUIDE: The temporary exhibition I mentioned, the bicycles, is on the third floor. You''ll need to show your ticket at the entrance there.
GUIDE: And finally, the café. Many people expect it to be on the ground floor, but it''s actually right at the top, on the roof terrace, with wonderful views of the harbour. There''s a lift as well as the stairs. On sunny days it gets very busy around lunchtime, so you might like to go a bit earlier.
GUIDE: Before I let you go, a word about photography. You''re very welcome to take photos in all the galleries, but please don''t use a flash, because some of our textiles are fragile and can fade. In the bicycle exhibition, photography isn''t allowed at all, as several of the bicycles are on loan from private collectors.
GUIDE: And if you''re interested in volunteering with us, we''re always looking for people to help run the workshops. You don''t need to be an expert, just enthusiastic. There''s a form at the information desk.
GUIDE: If you have any questions, the staff in green T-shirts are happy to help. Enjoy your visit.')
on conflict (group_id) do update set transcript = excluded.transcript;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('36511985-a947-4d57-a193-d0093ecaf062', '2385a9b3-c993-4fa5-badf-e36abfd1af88', 'multiple_choice_single', 'The idea for the museum came from the building''s time as', '[{"value":"A","label":"A. a grain warehouse"},{"value":"B","label":"B. a furniture factory"},{"value":"C","label":"C. a shipyard"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Sam says "it''s that period, the factory years, that gave us the idea for a museum about making things."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('59909127-bc8b-435b-9139-b94d2a2a6798', '2385a9b3-c993-4fa5-badf-e36abfd1af88', 'multiple_choice_single', 'What does the museum mainly want visitors to do?', '[{"value":"A","label":"A. make things themselves"},{"value":"B","label":"B. learn about the harbour"},{"value":"C","label":"C. buy craft kits"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Sam says "what we really want is for visitors to try making things themselves."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('7ee614bd-84d0-4600-a931-dc23211c5966', '2385a9b3-c993-4fa5-badf-e36abfd1af88', 'multiple_choice_single', 'Workshop tickets can be bought', '[{"value":"A","label":"A. online"},{"value":"B","label":"B. at the information desk"},{"value":"C","label":"C. at each workshop"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Sam says "Tickets for workshops are sold at the information desk, not online."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('2d11fa62-5782-45c7-8a15-8d162cd0f57c', '2385a9b3-c993-4fa5-badf-e36abfd1af88', 'multiple_choice_single', 'For a quieter visit, Sam recommends coming', '[{"value":"A","label":"A. on weekday mornings"},{"value":"B","label":"B. in the late afternoon"},{"value":"C","label":"C. on the first Thursday of the month"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Sam says "I''d recommend coming in the late afternoon."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('9d9ba623-a0f9-4819-8ee3-872c766ab821', '2385a9b3-c993-4fa5-badf-e36abfd1af88', 'matching_features', 'the shop', '[{"value":"A","label":"A. basement"},{"value":"B","label":"B. ground floor"},{"value":"C","label":"C. first floor"},{"value":"D","label":"D. second floor"},{"value":"E","label":"E. third floor"},{"value":"F","label":"F. roof terrace"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'On the ground floor "you''ll find the information desk and also the shop."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('61d8b5a8-b290-4e64-8954-6e81c054361d', '2385a9b3-c993-4fa5-badf-e36abfd1af88', 'matching_features', 'the cloakroom', '[{"value":"A","label":"A. basement"},{"value":"B","label":"B. ground floor"},{"value":"C","label":"C. first floor"},{"value":"D","label":"D. second floor"},{"value":"E","label":"E. third floor"},{"value":"F","label":"F. roof terrace"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Sam says "the cloakroom is downstairs, in the basement."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('534e651c-dbec-42e8-bfed-94084a293719', '2385a9b3-c993-4fa5-badf-e36abfd1af88', 'matching_features', 'the steam engine', '[{"value":"A","label":"A. basement"},{"value":"B","label":"B. ground floor"},{"value":"C","label":"C. first floor"},{"value":"D","label":"D. second floor"},{"value":"E","label":"E. third floor"},{"value":"F","label":"F. roof terrace"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The basement "is also where we have our largest machine, an old steam engine."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('c658161b-15b5-4ec4-b49d-0ffb49ed59ae', '2385a9b3-c993-4fa5-badf-e36abfd1af88', 'matching_features', 'the children''s workshop', '[{"value":"A","label":"A. basement"},{"value":"B","label":"B. ground floor"},{"value":"C","label":"C. first floor"},{"value":"D","label":"D. second floor"},{"value":"E","label":"E. third floor"},{"value":"F","label":"F. roof terrace"}]'::jsonb, ARRAY['D']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The children''s workshop "is now on the second floor, where there''s more space."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e70b6d0e-bb96-4160-91d7-eeb1135773fd', '2385a9b3-c993-4fa5-badf-e36abfd1af88', 'matching_features', 'the bicycle exhibition', '[{"value":"A","label":"A. basement"},{"value":"B","label":"B. ground floor"},{"value":"C","label":"C. first floor"},{"value":"D","label":"D. second floor"},{"value":"E","label":"E. third floor"},{"value":"F","label":"F. roof terrace"}]'::jsonb, ARRAY['E']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Sam says "the bicycles, is on the third floor."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('8c958d45-3caa-4287-bae5-04d5f79ba924', '2385a9b3-c993-4fa5-badf-e36abfd1af88', 'matching_features', 'the café', '[{"value":"A","label":"A. basement"},{"value":"B","label":"B. ground floor"},{"value":"C","label":"C. first floor"},{"value":"D","label":"D. second floor"},{"value":"E","label":"E. third floor"},{"value":"F","label":"F. roof terrace"}]'::jsonb, ARRAY['F']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The café is "right at the top, on the roof terrace."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('4d6ec4c6-6859-48b4-97dd-137d17519f72', 'e51b1718-51a7-41b0-837d-551f0bca320c', 3, NULL, NULL, NULL, 'Questions 21-25: choose the correct letter, A, B or C. Questions 26-30: complete the sentences below. Write NO MORE THAN TWO WORDS for each answer.', '{"title":"Part 3 — Planning a presentation on food waste"}'::jsonb, 2)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.item_group_scripts (group_id, transcript) values ('4d6ec4c6-6859-48b4-97dd-137d17519f72', 'MAYA: Right, Tom, we need to plan the presentation on food waste in the college canteen. It''s on Friday, so we haven''t got long.
TOM: I know. Shall we start with what we found? I think the most important result is that most of the waste isn''t from the kitchen at all. It''s food left on plates.
MAYA: Yes, about sixty per cent, wasn''t it? The kitchen waste was much smaller than I expected.
TOM: And the item thrown away most often was bread, which surprised me. I''d have guessed vegetables.
MAYA: Me too. Though when you think about it, everyone gets a bread roll with their meal whether they want it or not.
TOM: Exactly. So that''s one of our recommendations: only give bread if students ask for it.
MAYA: Good. Now, how should we open the presentation? Professor Hughes said it''s important to get the audience''s attention.
TOM: We could start with a statistic, the national figure on food waste.
MAYA: Everyone starts with a statistic. What about a photograph? We took that picture of one day''s waste piled on a table. It''s quite shocking.
TOM: That''s better. Let''s open with the photo, then give the numbers afterwards.
MAYA: OK. How are we dividing the talking?
TOM: I''m happy to do the methods, since I designed the weighing system. Could you present the results?
MAYA: Sure. And let''s both do the recommendations, taking turns.
TOM: Fine. What about the interview with the canteen manager? She was really helpful.
MAYA: She was. What I found most interesting was that she wants to reduce waste, but she''s worried about complaints if portions get smaller.
TOM: Right, so the problem isn''t that she doesn''t care. It''s the fear of complaints.
MAYA: Yes. We should say that clearly. Now, the recommendations. We have the bread one. What else?
TOM: Smaller plates. Research shows people take less food if the plate is smaller.
MAYA: And the menu. If the canteen published the menu a week in advance, they could estimate numbers better.
TOM: Good. And what about leftovers? Some colleges give unsold food to a local charity at the end of the day.
MAYA: The manager said there''s a food bank in the town that would take it, but they''d need a fridge to store it overnight.
TOM: So we recommend the college buys a fridge for that. It''s not expensive.
MAYA: OK. What about visual aids? I don''t want too many slides.
TOM: Agreed. Professor Hughes said no more than ten slides for a fifteen-minute talk.
MAYA: And let''s use a bar chart for the waste by category. A pie chart would be too hard to read with so many categories.
TOM: Bar chart, fine. Now, practice. When can we rehearse?
MAYA: Thursday afternoon? The library has rooms you can book.
TOM: Let''s book one for two o''clock. And we should time ourselves, because the professor stops people when they run over.
MAYA: Right. One last thing: the handout. Should we give one?
TOM: Yes, a single page with our main recommendations, so the canteen manager can share it with her staff.
MAYA: Perfect. I''ll write the handout tonight.
TOM: And I''ll make the slides tomorrow morning. Should we send the slides to the professor in advance?
MAYA: She didn''t ask for them, but it can''t hurt. Let''s send them on Thursday evening, after we''ve rehearsed and made any changes.
TOM: Good idea. Then we''ll know they''re the final version. I think we''re in good shape.')
on conflict (group_id) do update set transcript = excluded.transcript;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('d0304bb0-60c3-4ab3-bdb3-74b9ffc77fcb', '4d6ec4c6-6859-48b4-97dd-137d17519f72', 'multiple_choice_single', 'Most of the canteen''s waste came from', '[{"value":"A","label":"A. the kitchen"},{"value":"B","label":"B. students'' plates"},{"value":"C","label":"C. unsold food"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Tom says most of the waste "isn''t from the kitchen at all. It''s food left on plates."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('1e4fd8df-6dac-4d56-809a-f5ae33d402d5', '4d6ec4c6-6859-48b4-97dd-137d17519f72', 'multiple_choice_single', 'Which item was thrown away most often?', '[{"value":"A","label":"A. vegetables"},{"value":"B","label":"B. bread"},{"value":"C","label":"C. rice"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Tom says "the item thrown away most often was bread."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('2f6613c9-b81e-4b8d-974e-82cfb5455542', '4d6ec4c6-6859-48b4-97dd-137d17519f72', 'multiple_choice_single', 'They decide to begin the presentation with', '[{"value":"A","label":"A. a national statistic"},{"value":"B","label":"B. a photograph"},{"value":"C","label":"C. a question to the audience"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Tom agrees "Let''s open with the photo, then give the numbers afterwards."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f1544b45-a6a4-45ab-8772-ce7918e4fc63', '4d6ec4c6-6859-48b4-97dd-137d17519f72', 'multiple_choice_single', 'Who will present the methods?', '[{"value":"A","label":"A. Tom"},{"value":"B","label":"B. Maya"},{"value":"C","label":"C. both of them"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Tom says "I''m happy to do the methods, since I designed the weighing system."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('998ceda9-9fa0-4fe7-9964-4a5cf60eed1c', '4d6ec4c6-6859-48b4-97dd-137d17519f72', 'multiple_choice_single', 'The canteen manager''s main concern is', '[{"value":"A","label":"A. the cost of changes"},{"value":"B","label":"B. complaints about smaller portions"},{"value":"C","label":"C. a lack of staff"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Maya says the manager is "worried about complaints if portions get smaller."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('84c86787-de66-4f84-aad2-08305c50237f', '4d6ec4c6-6859-48b4-97dd-137d17519f72', 'sentence_completion', 'The students will recommend using smaller ______.', '[]'::jsonb, ARRAY['plates']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Tom suggests "Smaller plates", since "people take less food if the plate is smaller."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('9e62fd54-988c-4875-8ee3-9e174742b893', '4d6ec4c6-6859-48b4-97dd-137d17519f72', 'sentence_completion', 'Giving leftovers to the food bank would require a ______.', '[]'::jsonb, ARRAY['fridge']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The food bank would take it, "but they''d need a fridge to store it overnight."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('3eea396b-07b4-4361-a46b-e1ed6863c053', '4d6ec4c6-6859-48b4-97dd-137d17519f72', 'sentence_completion', 'Waste by category will be shown in a ______.', '[]'::jsonb, ARRAY['bar chart']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Maya says "let''s use a bar chart for the waste by category."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('42c3a83c-26a7-4293-bbc6-923d3a13b803', '4d6ec4c6-6859-48b4-97dd-137d17519f72', 'sentence_completion', 'They will rehearse in a room in the ______.', '[]'::jsonb, ARRAY['library']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Maya says "The library has rooms you can book."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('d92650df-2c99-4037-a84b-fdd9e0939d07', '4d6ec4c6-6859-48b4-97dd-137d17519f72', 'sentence_completion', 'The handout will list the main ______.', '[]'::jsonb, ARRAY['recommendations']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The handout will be "a single page with our main recommendations."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('c7b9d6e7-2049-46d2-b9b8-7276dfaef124', 'e51b1718-51a7-41b0-837d-551f0bca320c', 4, NULL, NULL, NULL, 'Questions 31-40. Complete the notes below. Write ONE WORD ONLY for each answer.', '{"title":"Part 4 — Lecture: beekeeping in cities"}'::jsonb, 3)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.item_group_scripts (group_id, transcript) values ('c7b9d6e7-2049-46d2-b9b8-7276dfaef124', 'LECTURER: Good morning. In this session I''m going to talk about urban beekeeping: the practice of keeping honeybees in towns and cities, which has grown remarkably over the past twenty years.
LECTURER: Let''s begin with the obvious question. Why would bees do well in a city? Most people imagine that the countryside, with its fields and hedgerows, would be a far better home. In fact, modern farmland is often surprisingly poor for bees. Large areas are planted with a single crop, which flowers for only a few weeks, and the use of chemicals can harm insects. Cities, by contrast, offer an enormous variety of plants in gardens, parks and even along railway lines, flowering at different times across the year.
LECTURER: Temperature also plays a part. Cities are usually a few degrees warmer than the surrounding countryside, so the bees'' season starts earlier and finishes later.
LECTURER: Where are city hives kept? Rooftops are the most common location, partly because they are out of the way of the public. Hotels, offices and even museums now keep hives on their roofs, and some use the honey in their restaurants. Allotments and community gardens are also popular sites.
LECTURER: The honey itself is interesting. Because bees in cities visit so many different plants, urban honey tends to have a more complex flavour than honey from a single crop. Some beekeepers even sell honey labelled by neighbourhood. And tests have shown that, despite the traffic, city honey is generally clean, since the bees filter out most pollution.
LECTURER: However, I want to spend most of today on the problems, because urban beekeeping is not as straightforward as it sounds.
LECTURER: The first problem is simply numbers. In some cities, the number of hives has increased so quickly that there may not be enough flowers to go round. Researchers in London, for example, found that in some central areas there were more hives than the available plants could support. This is called overcrowding, and it can lead to hungry, weakened colonies.
LECTURER: The second problem is competition. Honeybees are just one of many kinds of bee. There are hundreds of species of wild bee, most of which live alone rather than in hives, and they depend on the same flowers. A single hive can contain fifty thousand honeybees, so a large number of hives can push wild bees out. Ironically, people who start keeping bees to help nature may actually be harming wild species.
LECTURER: Third, disease. When hives are close together, diseases and parasites spread easily from one colony to another. Experienced beekeepers inspect their hives regularly, but new beekeepers may not recognise the signs.
LECTURER: Finally, there''s the question of neighbours. Most people are happy to have bees nearby, but a swarm, when thousands of bees leave a hive together, can be frightening if it lands in a busy street. Good management can reduce swarming, but not prevent it entirely.
LECTURER: So what can be done? Many experts now argue that the best way to help bees in cities is not to add more hives, but to plant more flowers. Planting is something everyone can do, even on a balcony, and it benefits wild bees as well as honeybees. Several cities now encourage this through what they call pollinator corridors: chains of gardens, parks and green roofs that allow insects to move across the city.
LECTURER: Some local councils have also introduced registration, so that they know how many hives exist and where. And training courses for beginners are increasingly common, often run by local beekeeping associations.
LECTURER: Before we finish, I want to stress one point. None of this means that urban beekeeping is a bad thing. Many hobby beekeepers are careful and well informed, and city hives have done a great deal to raise public interest in insects. Schools that keep bees, for example, report that pupils become far more curious about plants and the natural world. The question is one of balance: how many hives a particular area can support, and whether we are also providing for the wild species that cannot speak up for themselves.
LECTURER: In the next session we''ll look in more detail at the wild bee species I mentioned, and at how scientists count them.')
on conflict (group_id) do update set transcript = excluded.transcript;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('7982095f-a100-45a2-9f93-ee1f0b8e76da', 'c7b9d6e7-2049-46d2-b9b8-7276dfaef124', 'note_completion', 'Farmland is often planted with a single ______.', '[]'::jsonb, ARRAY['crop']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The lecturer says "Large areas are planted with a single crop."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('3719b374-55ce-4319-80e5-da60b4e58199', 'c7b9d6e7-2049-46d2-b9b8-7276dfaef124', 'note_completion', 'Cities offer flowers in gardens, parks and along ______ lines.', '[]'::jsonb, ARRAY['railway', 'rail']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Plants grow "in gardens, parks and even along railway lines."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('3d651d35-4c88-4f03-84dc-cf4f3313ca3f', 'c7b9d6e7-2049-46d2-b9b8-7276dfaef124', 'note_completion', 'Cities are warmer, so the bees'' ______ is longer.', '[]'::jsonb, ARRAY['season']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Because cities are warmer, "the bees'' season starts earlier and finishes later."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f5a63ef4-e648-4d3c-b051-20709ed0b189', 'c7b9d6e7-2049-46d2-b9b8-7276dfaef124', 'note_completion', 'The most common location for city hives is on ______.', '[]'::jsonb, ARRAY['rooftops', 'roofs']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The lecturer says "Rooftops are the most common location."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('5e48cea3-f136-4673-85ff-75c1310276e3', 'c7b9d6e7-2049-46d2-b9b8-7276dfaef124', 'note_completion', 'Urban honey has a more complex ______.', '[]'::jsonb, ARRAY['flavour', 'flavor']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Urban honey "tends to have a more complex flavour than honey from a single crop."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('ae5667d8-a385-42d7-b1be-29cf876d2fb8', 'c7b9d6e7-2049-46d2-b9b8-7276dfaef124', 'note_completion', 'Bees filter out most ______, so city honey is clean.', '[]'::jsonb, ARRAY['pollution']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Tests show city honey "is generally clean, since the bees filter out most pollution."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('8e19b237-18f4-4d5e-a150-b6608f6d6dc7', 'c7b9d6e7-2049-46d2-b9b8-7276dfaef124', 'note_completion', 'Problem 1: too many hives, known as ______.', '[]'::jsonb, ARRAY['overcrowding']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The lecturer says "This is called overcrowding."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('592e4218-ce45-48d9-93fe-60b7241a3813', 'c7b9d6e7-2049-46d2-b9b8-7276dfaef124', 'note_completion', 'Problem 2: honeybees compete with ______ bees.', '[]'::jsonb, ARRAY['wild']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Large numbers of hives "can push wild bees out."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('6fdf092b-8fb4-4b9a-94aa-8369bdcc8b9a', 'c7b9d6e7-2049-46d2-b9b8-7276dfaef124', 'note_completion', 'Problem 4: a ______ in a busy street can frighten people.', '[]'::jsonb, ARRAY['swarm']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The lecturer says "a swarm ... can be frightening if it lands in a busy street."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('8d913a94-da80-4505-b415-46749de3efcd', 'c7b9d6e7-2049-46d2-b9b8-7276dfaef124', 'note_completion', 'Pollinator ______ link gardens, parks and green roofs.', '[]'::jsonb, ARRAY['corridors']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Cities encourage "pollinator corridors: chains of gardens, parks and green roofs."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)
values ('9f87b665-bb69-439c-81ad-a7c181091852', 'aefc3b54-b041-4a2e-936c-90c87fa1c92e', 'reading', 3600, 40, NULL, 1)
on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('a84bf2b4-494c-486a-b2b9-c858663fdb70', '9f87b665-bb69-439c-81ad-a7c181091852', 1, 'VALLEY BUSES — ROUTE 12 (Town Centre to Kingsley Hospital)

Owing to road resurfacing on Station Road, the following changes will apply from Monday 16 June until Friday 25 July.

Diversion: Buses will not stop at the railway station. A temporary stop has been placed outside the post office on Queen Street, a two-minute walk away.

Frequency: Monday to Saturday, buses will run every 20 minutes (normally every 15 minutes) between 7 am and 7 pm, and every hour in the evening. The last bus from the hospital will leave at 10.40 pm. There is no change to the Sunday service.

Fares: Fares are unchanged. Passengers with a monthly pass may also use Route 14 at no extra charge during the works, as it serves the hospital via the ring road.

Accessibility: All Route 12 buses have a ramp and a space for one wheelchair. If you need help boarding, please tell the driver.

Live departure times can be found on the Valley Buses app. For questions, call the customer line on 0800 412 7700 (8 am to 8 pm daily).', NULL, NULL, 'Questions 1-6. Read the notice below and answer the questions. Write NO MORE THAN THREE WORDS AND/OR A NUMBER from the text for each answer.', '{"title":"Section 1 — Route 12 bus: summer timetable changes"}'::jsonb, 0)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('dda5c2a0-c4f6-441f-894c-4ff2787cc92a', 'a84bf2b4-494c-486a-b2b9-c858663fdb70', 'short_answer', 'What is the reason for the changes?', '[]'::jsonb, ARRAY['road resurfacing']::text[], 3, 'lenient', true, false, '{}'::jsonb, 'The changes are "Owing to road resurfacing on Station Road."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('47699f99-99c9-432c-b15a-1b0488b15bdb', 'a84bf2b4-494c-486a-b2b9-c858663fdb70', 'short_answer', 'Where is the temporary stop located?', '[]'::jsonb, ARRAY['the post office', 'post office', 'Queen Street']::text[], 3, 'lenient', true, false, '{}'::jsonb, 'The notice says "A temporary stop has been placed outside the post office on Queen Street."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('bcf492cd-6584-4fa8-af26-e98d82ab3a60', 'a84bf2b4-494c-486a-b2b9-c858663fdb70', 'short_answer', 'How often will buses run during the day on weekdays?', '[]'::jsonb, ARRAY['every 20 minutes', '20 minutes']::text[], 3, 'lenient', true, false, '{}'::jsonb, 'Buses "will run every 20 minutes (normally every 15 minutes) between 7 am and 7 pm."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('3a273b24-d52e-4c58-9b19-0eccb582a2ff', 'a84bf2b4-494c-486a-b2b9-c858663fdb70', 'short_answer', 'At what time does the last bus leave the hospital?', '[]'::jsonb, ARRAY['10.40 pm', '10.40', '10:40 pm', '10:40']::text[], 3, 'lenient', true, false, '{}'::jsonb, 'The notice says "The last bus from the hospital will leave at 10.40 pm."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('fa2462e1-9432-4579-aa50-2b07f1fab6e5', 'a84bf2b4-494c-486a-b2b9-c858663fdb70', 'short_answer', 'Which other route can monthly pass holders use for free?', '[]'::jsonb, ARRAY['Route 14', '14']::text[], 3, 'lenient', true, false, '{}'::jsonb, 'Pass holders "may also use Route 14 at no extra charge during the works."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('da23c84e-b16a-4c99-9446-9581b46311e2', 'a84bf2b4-494c-486a-b2b9-c858663fdb70', 'short_answer', 'Where can passengers find live departure times?', '[]'::jsonb, ARRAY['Valley Buses app', 'the app']::text[], 3, 'lenient', true, false, '{}'::jsonb, 'The notice says "Live departure times can be found on the Valley Buses app."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('628e4f82-4fe3-4998-bf6e-35f3d00f1c6b', '9f87b665-bb69-439c-81ad-a7c181091852', 2, 'A. Brook Farm Cottage
A restored stone cottage on a working sheep farm, sleeping up to six. Guests are welcome to help feed the lambs in spring. Well-behaved dogs are allowed for a small extra charge. Minimum stay: one week, Saturday to Saturday. The nearest shop is four miles away, so bring supplies.

B. The Harbour Lofts
Stylish apartments for two above a former fish market, just a minute from the beach and the town''s restaurants. No car needed: the train station is a short walk away. Sorry, no pets or children under twelve. Stays from two nights.

C. Pinewood Cabins
Wooden cabins in a quiet forest, each with its own hot tub. A shared games room and a children''s play area make this ideal for families. Bicycles can be hired on site. Breakfast hampers are delivered to your door each morning for an extra fee.

D. St Clement''s Guesthouse
A family-run guesthouse in the old town with eight en-suite rooms. A full cooked breakfast is included in every booking. Our owners have lived in the valley all their lives and are happy to plan walking routes for guests. Private parking for four cars only; please reserve a space.', NULL, NULL, 'Questions 7-14. Look at the four advertisements A-D. Which place to stay is described in each statement? Choose the correct letter, A-D. You may use any letter more than once.', '{"title":"Section 1 — Holiday accommodation in the Dene Valley"}'::jsonb, 1)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('56a53efb-21a7-4920-a360-de1df7336a0a', '628e4f82-4fe3-4998-bf6e-35f3d00f1c6b', 'matching_information', 'Guests can bring their pets for an additional cost.', '[{"value":"A","label":"A. Brook Farm Cottage"},{"value":"B","label":"B. The Harbour Lofts"},{"value":"C","label":"C. Pinewood Cabins"},{"value":"D","label":"D. St Clement''s Guesthouse"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'At Brook Farm "Well-behaved dogs are allowed for a small extra charge."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('cca5a99d-b9a8-4394-92a3-c87dc104bc88', '628e4f82-4fe3-4998-bf6e-35f3d00f1c6b', 'matching_information', 'Guests can reach it easily without a car.', '[{"value":"A","label":"A. Brook Farm Cottage"},{"value":"B","label":"B. The Harbour Lofts"},{"value":"C","label":"C. Pinewood Cabins"},{"value":"D","label":"D. St Clement''s Guesthouse"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The Harbour Lofts say "No car needed: the train station is a short walk away."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('11854d8b-023c-4354-9466-1c034e8a4576', '628e4f82-4fe3-4998-bf6e-35f3d00f1c6b', 'matching_information', 'The price includes a morning meal.', '[{"value":"A","label":"A. Brook Farm Cottage"},{"value":"B","label":"B. The Harbour Lofts"},{"value":"C","label":"C. Pinewood Cabins"},{"value":"D","label":"D. St Clement''s Guesthouse"}]'::jsonb, ARRAY['D']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'At St Clement''s "A full cooked breakfast is included in every booking."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('c7eb0c7f-c165-4b77-9912-02e22d1b1e84', '628e4f82-4fe3-4998-bf6e-35f3d00f1c6b', 'matching_information', 'Guests can take part in farm activities.', '[{"value":"A","label":"A. Brook Farm Cottage"},{"value":"B","label":"B. The Harbour Lofts"},{"value":"C","label":"C. Pinewood Cabins"},{"value":"D","label":"D. St Clement''s Guesthouse"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'At Brook Farm "Guests are welcome to help feed the lambs in spring."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e02481fc-92da-44ac-8645-e08a767225b6', '628e4f82-4fe3-4998-bf6e-35f3d00f1c6b', 'matching_information', 'Guests must stay for at least seven nights.', '[{"value":"A","label":"A. Brook Farm Cottage"},{"value":"B","label":"B. The Harbour Lofts"},{"value":"C","label":"C. Pinewood Cabins"},{"value":"D","label":"D. St Clement''s Guesthouse"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Brook Farm has a "Minimum stay: one week, Saturday to Saturday."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('081ac425-00b5-47e2-a0fa-821e334a9a46', '628e4f82-4fe3-4998-bf6e-35f3d00f1c6b', 'matching_information', 'Young children cannot stay here.', '[{"value":"A","label":"A. Brook Farm Cottage"},{"value":"B","label":"B. The Harbour Lofts"},{"value":"C","label":"C. Pinewood Cabins"},{"value":"D","label":"D. St Clement''s Guesthouse"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The Harbour Lofts say "no pets or children under twelve."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('076990e9-2884-44b4-bc5e-c47cc0e4b7f9', '628e4f82-4fe3-4998-bf6e-35f3d00f1c6b', 'matching_information', 'Guests can get help planning walks.', '[{"value":"A","label":"A. Brook Farm Cottage"},{"value":"B","label":"B. The Harbour Lofts"},{"value":"C","label":"C. Pinewood Cabins"},{"value":"D","label":"D. St Clement''s Guesthouse"}]'::jsonb, ARRAY['D']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The owners "are happy to plan walking routes for guests."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('b977d8cd-d77b-4484-aea3-70f25175d9e2', '628e4f82-4fe3-4998-bf6e-35f3d00f1c6b', 'matching_information', 'Cycles are available to rent.', '[{"value":"A","label":"A. Brook Farm Cottage"},{"value":"B","label":"B. The Harbour Lofts"},{"value":"C","label":"C. Pinewood Cabins"},{"value":"D","label":"D. St Clement''s Guesthouse"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'At Pinewood "Bicycles can be hired on site."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('a5acd3b2-2c49-44de-92d8-a882dfeb861b', '9f87b665-bb69-439c-81ad-a7c181091852', 3, 'Marlow & Finch recognises that flexible working can help employees balance their work with other responsibilities. This policy explains the options available and how to apply.

Who can apply: Any employee who has completed their six-month probation period may make a request. Employees may make one request in any twelve-month period.

Options available: Depending on the needs of the team, employees may request compressed hours (working full-time hours over four days), part-time hours, or hybrid working, where up to three days a week may be spent working from home. Staff in customer-facing roles at our branches are not eligible for hybrid working, but may apply for the other options.

Core hours: All staff working flexibly must be available between 10 am and 3 pm on their working days, so that meetings can be arranged.

How to apply: Complete the request form on the staff intranet and send it to your line manager, who will arrange a meeting with you within two weeks. You may bring a colleague to this meeting if you wish. A decision will be given in writing within one month of your application.

Trial periods: Most new arrangements begin with a three-month trial. At the end of the trial, you and your manager will review whether the arrangement is working.

If your request is refused: You may appeal to the HR department within ten working days of receiving the decision. The appeal will be heard by a manager from a different department.

Equipment: Employees approved for hybrid working will be provided with a laptop and headset. The company does not pay for home internet costs.', NULL, NULL, 'Questions 15-21. Read the policy below. Do the following statements agree with the information given? Write TRUE, FALSE or NOT GIVEN.', '{"title":"Section 2 — Marlow & Finch: flexible working policy"}'::jsonb, 2)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('380fc431-1df6-4fea-b9d1-e7a8321cb2b7', 'a5acd3b2-2c49-44de-92d8-a882dfeb861b', 'true_false_notgiven', 'New employees can apply for flexible working in their first month.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['FALSE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The policy says "Any employee who has completed their six-month probation period may make a request."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e64ed43a-a77d-413d-9d09-e97a2da61e31', 'a5acd3b2-2c49-44de-92d8-a882dfeb861b', 'true_false_notgiven', 'Employees can make two requests per year.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['FALSE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The policy says "Employees may make one request in any twelve-month period."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('401ab462-15cb-4110-97f7-94aae159158e', 'a5acd3b2-2c49-44de-92d8-a882dfeb861b', 'true_false_notgiven', 'Branch staff who deal with customers can request part-time hours.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['TRUE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Customer-facing staff "are not eligible for hybrid working, but may apply for the other options", which include part-time hours.', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('4c1e3418-f39c-4a67-9647-61e2e4adf7f7', 'a5acd3b2-2c49-44de-92d8-a882dfeb861b', 'true_false_notgiven', 'Flexible workers must be available from 10 am to 3 pm.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['TRUE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Staff "must be available between 10 am and 3 pm on their working days."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('b2e860f3-beb5-48f6-8d7d-8c15c262e77c', 'a5acd3b2-2c49-44de-92d8-a882dfeb861b', 'true_false_notgiven', 'Most requests are approved.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['NOT GIVEN']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The policy says "A decision will be given in writing within one month" but gives no figure for how many are approved.', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('2325da0a-8b5d-431d-bb3d-bafdd0645d1f', 'a5acd3b2-2c49-44de-92d8-a882dfeb861b', 'true_false_notgiven', 'Appeals are heard by the employee''s own line manager.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['FALSE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The appeal "will be heard by a manager from a different department."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('0e02d507-86a2-4504-b5dc-14937dcfc631', 'a5acd3b2-2c49-44de-92d8-a882dfeb861b', 'true_false_notgiven', 'Hybrid workers receive money towards their internet bills.', '[{"value":"TRUE","label":"TRUE"},{"value":"FALSE","label":"FALSE"},{"value":"NOT GIVEN","label":"NOT GIVEN"}]'::jsonb, ARRAY['FALSE']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'The policy says "The company does not pay for home internet costs."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('1a4e02a0-baf7-4f29-aa50-6603e36ce588', '9f87b665-bb69-439c-81ad-a7c181091852', 4, 'Every workplace with more than 25 employees must have at least one trained first-aider on site during working hours. To meet this requirement, we are inviting volunteers to attend a First Aid at Work course, paid for by the company.

The course lasts three days and is delivered at the Riverside Training Centre by qualified paramedics. It combines short classroom sessions with practical exercises, using life-size models to practise techniques such as resuscitation. No previous experience is needed, but participants should be reasonably fit, as some exercises involve kneeling for long periods.

At the end of the course, participants take a practical assessment. There is no written examination. Those who pass receive a certificate, which is valid for three years. Before it expires, first-aiders must attend a two-day refresher course to keep their qualification.

Staff who become first-aiders receive an extra payment of £300 a year, added to their salary in monthly instalments. They will also be given a green badge so that colleagues can easily identify them.

Lunch is provided on each day of the course. Please wear comfortable clothing. If you would like to take part, email the Health and Safety Officer, Grace Nwosu, before the end of the month. Places are limited to twelve per course.', NULL, NULL, 'Questions 22-27. Complete the notes below. Write ONE WORD ONLY from the text for each answer.', '{"title":"Section 2 — First Aid at Work: course information for staff"}'::jsonb, 3)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('0556eb21-582e-45b4-b086-44e677e30134', '1a4e02a0-baf7-4f29-aa50-6603e36ce588', 'note_completion', 'Course length: three ______', '[]'::jsonb, ARRAY['days']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The text says "The course lasts three days."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('dc9bb3e7-0c6c-44ae-bb89-f7a2427f427f', '1a4e02a0-baf7-4f29-aa50-6603e36ce588', 'note_completion', 'Trainers: qualified ______', '[]'::jsonb, ARRAY['paramedics']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The course "is delivered ... by qualified paramedics."', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('54b84262-fbd9-45dc-9271-bd695e98a8a7', '1a4e02a0-baf7-4f29-aa50-6603e36ce588', 'note_completion', 'Participants practise on life-size ______', '[]'::jsonb, ARRAY['models']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'Exercises use "life-size models to practise techniques such as resuscitation."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('70acc91f-6864-4421-ac56-2ee528f99d3a', '1a4e02a0-baf7-4f29-aa50-6603e36ce588', 'note_completion', 'Assessment: practical only, no written ______', '[]'::jsonb, ARRAY['examination', 'exam']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'The text says "There is no written examination."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('a9b694b0-d4a1-4961-aab6-4bf1fbce2326', '1a4e02a0-baf7-4f29-aa50-6603e36ce588', 'note_completion', 'Before the certificate expires, attend a ______ course', '[]'::jsonb, ARRAY['refresher']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'First-aiders "must attend a two-day refresher course to keep their qualification."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('dd1e0782-6a0e-4e19-8973-739d1f6116b6', '1a4e02a0-baf7-4f29-aa50-6603e36ce588', 'note_completion', 'First-aiders wear a green ______', '[]'::jsonb, ARRAY['badge']::text[], 1, 'lenient', true, false, '{}'::jsonb, 'They "will also be given a green badge so that colleagues can easily identify them."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('cfc0889c-6942-4f3d-8ec3-0cff903430bc', '9f87b665-bb69-439c-81ad-a7c181091852', 5, 'A. For centuries, the lighthouse keeper was one of the most romantic figures of the coast. Living alone or with a small crew on a rock far out at sea, the keeper''s job was to make sure that the light never went out. Today that figure has almost vanished. In Britain, the last lighthouse to be staffed by keepers was converted to automatic operation in 1998, and similar changes have taken place around the world. Yet the history of the keepers tells us a great deal about work, technology and isolation. It is also a history that survives largely in the memories of a few hundred people, many of them now elderly, and in the logbooks they left behind.

B. The earliest lights were simply fires, lit on hilltops or towers near dangerous rocks or harbour entrances. Keeping such a fire burning through a stormy night required huge quantities of wood or coal, and the work was exhausting. By the eighteenth century, candles and then oil lamps had replaced open fires, and a lighthouse could be run by a much smaller team. The invention of the Fresnel lens in the 1820s, which concentrated light into a powerful beam, meant that a relatively small flame could be seen more than twenty miles away.

C. Each lighthouse was given its own pattern of flashes, so that ships could identify the light at night and work out exactly where they were. Keeping that pattern accurate was the keeper''s most important duty. Clockwork machinery turned the lens, and it had to be wound by hand every few hours. Keepers also cleaned the glass, trimmed the wicks and kept a detailed log of the weather and passing ships.

D. Life on an offshore lighthouse was strictly organised. A typical station had three keepers, who worked in shifts so that one was always on watch. They spent several weeks on the rock followed by a shorter period ashore with their families. Supplies arrived by boat, but in bad weather the relief boat might be delayed for weeks, and keepers sometimes ran low on food. Many kept small gardens, fished or baked their own bread. Rules were strict: keepers could be dismissed for neglecting the light, and inspectors made surprise visits to check that the brass was polished and the logbook up to date. Relations between the men mattered enormously, since three people sharing a narrow tower for weeks had little chance of avoiding one another after a disagreement.

E. Isolation was the greatest challenge. Accounts written by former keepers describe long periods of boredom broken by moments of danger, when waves broke over the tower. Some found the solitude difficult, and there are records of keepers who became ill from the strain. Others valued it. Many took up hobbies, such as painting, model-making or playing musical instruments, which made the keepers'' isolation easier to bear. Radio, when it arrived, was welcomed as a link with the mainland. Families ashore would sometimes send messages through local radio programmes, and keepers listened eagerly for news from home.

F. The job was also surprisingly well suited to people from different backgrounds. In the early days it was often passed from father to son, and keepers'' wives frequently took on duties at shore stations. Because the work required little physical strength once oil lamps had replaced fires, some stations were run by women for many years, a rare opportunity at the time. Several became well known for their courage in rescuing sailors from wrecks.

G. Automation came gradually. Electric lamps, which could be switched on and off by a light-sensitive switch, removed the need to tend a flame. Later, remote monitoring meant that a single control centre could watch over dozens of lights, since the light could now be checked from far away. Today, many former lighthouses are museums or holiday homes, and their lights are maintained by technicians who visit only a few times a year. Some people regret the loss of the keepers, arguing that a person on watch could also raise the alarm when a ship was in trouble. But few doubt that the change was inevitable. Automated lights are cheaper to run, they do not need relief boats, and modern satellite navigation means that most ships now rely on lighthouses far less than they once did. What remains is a remarkable record, kept in logbooks, letters and photographs, of a way of life that lasted for more than two hundred years and then disappeared within a single generation.', NULL, NULL, 'Questions 28-40. Read the passage below. Questions 28-33: which paragraph, A-G, contains the following information? You may use any letter more than once. Questions 34-37: complete each sentence with the correct ending, A-F. Questions 38-40: answer the questions using NO MORE THAN TWO WORDS from the passage.', '{"title":"Section 3 — The last lighthouse keepers"}'::jsonb, 4)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('1366f7f2-3b18-4f98-a6a6-9a81b13b59b9', 'cfc0889c-6942-4f3d-8ec3-0cff903430bc', 'matching_information', 'the date when the last staffed lighthouse in Britain was automated', '[{"value":"A","label":"Paragraph A"},{"value":"B","label":"Paragraph B"},{"value":"C","label":"Paragraph C"},{"value":"D","label":"Paragraph D"},{"value":"E","label":"Paragraph E"},{"value":"F","label":"Paragraph F"},{"value":"G","label":"Paragraph G"}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph A says "the last lighthouse to be staffed by keepers was converted to automatic operation in 1998."', 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('674a4ff2-87db-4464-932d-67c20f922ac6', 'cfc0889c-6942-4f3d-8ec3-0cff903430bc', 'matching_information', 'a reference to keepers running short of food', '[{"value":"A","label":"Paragraph A"},{"value":"B","label":"Paragraph B"},{"value":"C","label":"Paragraph C"},{"value":"D","label":"Paragraph D"},{"value":"E","label":"Paragraph E"},{"value":"F","label":"Paragraph F"},{"value":"G","label":"Paragraph G"}]'::jsonb, ARRAY['D']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph D says "keepers sometimes ran low on food" when the relief boat was delayed.', 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('b6728a92-861c-44ea-925b-8812f2210b59', 'cfc0889c-6942-4f3d-8ec3-0cff903430bc', 'matching_information', 'an invention that made a small flame visible over a long distance', '[{"value":"A","label":"Paragraph A"},{"value":"B","label":"Paragraph B"},{"value":"C","label":"Paragraph C"},{"value":"D","label":"Paragraph D"},{"value":"E","label":"Paragraph E"},{"value":"F","label":"Paragraph F"},{"value":"G","label":"Paragraph G"}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph B says the Fresnel lens "meant that a relatively small flame could be seen more than twenty miles away."', 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('c8156c3d-b1cd-4939-a915-f55a50ef86c6', 'cfc0889c-6942-4f3d-8ec3-0cff903430bc', 'matching_information', 'a list of tasks that keepers carried out', '[{"value":"A","label":"Paragraph A"},{"value":"B","label":"Paragraph B"},{"value":"C","label":"Paragraph C"},{"value":"D","label":"Paragraph D"},{"value":"E","label":"Paragraph E"},{"value":"F","label":"Paragraph F"},{"value":"G","label":"Paragraph G"}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph C lists that keepers "cleaned the glass, trimmed the wicks and kept a detailed log."', 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('46bd9d2c-4f05-478a-841d-efb4bb857e17', 'cfc0889c-6942-4f3d-8ec3-0cff903430bc', 'matching_information', 'the current uses of some old lighthouse buildings', '[{"value":"A","label":"Paragraph A"},{"value":"B","label":"Paragraph B"},{"value":"C","label":"Paragraph C"},{"value":"D","label":"Paragraph D"},{"value":"E","label":"Paragraph E"},{"value":"F","label":"Paragraph F"},{"value":"G","label":"Paragraph G"}]'::jsonb, ARRAY['G']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph G says "many former lighthouses are museums or holiday homes."', 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e752e945-0429-40cc-ab57-1c50a9fe1b91', 'cfc0889c-6942-4f3d-8ec3-0cff903430bc', 'matching_information', 'an argument against removing the keepers', '[{"value":"A","label":"Paragraph A"},{"value":"B","label":"Paragraph B"},{"value":"C","label":"Paragraph C"},{"value":"D","label":"Paragraph D"},{"value":"E","label":"Paragraph E"},{"value":"F","label":"Paragraph F"},{"value":"G","label":"Paragraph G"}]'::jsonb, ARRAY['G']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph G says some argue "that a person on watch could also raise the alarm when a ship was in trouble."', 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('13aedd30-c9ab-4c16-9eb2-48b320556f53', 'cfc0889c-6942-4f3d-8ec3-0cff903430bc', 'matching_sentence_endings', 'Each lighthouse had its own pattern of flashes', '[{"value":"A","label":"A. because the work required little physical strength."},{"value":"B","label":"B. so that ships could identify the light at night."},{"value":"C","label":"C. since the light could now be checked from far away."},{"value":"D","label":"D. which made the keepers'' isolation easier to bear."},{"value":"E","label":"E. although the towers were rarely visited by inspectors."},{"value":"F","label":"F. because keepers were paid according to their results."}]'::jsonb, ARRAY['B']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph C: each lighthouse had its own pattern "so that ships could identify the light at night."', 6)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('848e7012-68c9-4a4b-8028-58d7db293725', 'cfc0889c-6942-4f3d-8ec3-0cff903430bc', 'matching_sentence_endings', 'Hobbies such as painting were common', '[{"value":"A","label":"A. because the work required little physical strength."},{"value":"B","label":"B. so that ships could identify the light at night."},{"value":"C","label":"C. since the light could now be checked from far away."},{"value":"D","label":"D. which made the keepers'' isolation easier to bear."},{"value":"E","label":"E. although the towers were rarely visited by inspectors."},{"value":"F","label":"F. because keepers were paid according to their results."}]'::jsonb, ARRAY['D']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph E says hobbies "made the keepers'' isolation easier to bear."', 7)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('7401f341-06bd-4eca-a8fc-9138120193fd', 'cfc0889c-6942-4f3d-8ec3-0cff903430bc', 'matching_sentence_endings', 'Women were able to run some stations', '[{"value":"A","label":"A. because the work required little physical strength."},{"value":"B","label":"B. so that ships could identify the light at night."},{"value":"C","label":"C. since the light could now be checked from far away."},{"value":"D","label":"D. which made the keepers'' isolation easier to bear."},{"value":"E","label":"E. although the towers were rarely visited by inspectors."},{"value":"F","label":"F. because keepers were paid according to their results."}]'::jsonb, ARRAY['A']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph F says "the work required little physical strength once oil lamps had replaced fires."', 8)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('710ced80-c3dc-4fa9-895f-0bff588129e6', 'cfc0889c-6942-4f3d-8ec3-0cff903430bc', 'matching_sentence_endings', 'One control centre could look after many lights', '[{"value":"A","label":"A. because the work required little physical strength."},{"value":"B","label":"B. so that ships could identify the light at night."},{"value":"C","label":"C. since the light could now be checked from far away."},{"value":"D","label":"D. which made the keepers'' isolation easier to bear."},{"value":"E","label":"E. although the towers were rarely visited by inspectors."},{"value":"F","label":"F. because keepers were paid according to their results."}]'::jsonb, ARRAY['C']::text[], 0, 'lenient', true, false, '{}'::jsonb, 'Paragraph G says this was possible "since the light could now be checked from far away."', 9)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('8783a2dc-2357-4d63-9288-094ef473ea75', 'cfc0889c-6942-4f3d-8ec3-0cff903430bc', 'short_answer', 'What turned the lens in early lighthouses?', '[]'::jsonb, ARRAY['clockwork machinery', 'clockwork']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Paragraph C says "Clockwork machinery turned the lens."', 10)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('c491fef7-73c0-417f-a29b-aee388e18f7c', 'cfc0889c-6942-4f3d-8ec3-0cff903430bc', 'short_answer', 'How many keepers worked at a typical offshore station?', '[]'::jsonb, ARRAY['three', '3']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Paragraph D says "A typical station had three keepers."', 11)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f2453118-7a57-46da-bf4e-355dedc4ab5c', 'cfc0889c-6942-4f3d-8ec3-0cff903430bc', 'short_answer', 'What was welcomed as a connection with the mainland?', '[]'::jsonb, ARRAY['radio']::text[], 2, 'lenient', true, false, '{}'::jsonb, 'Paragraph E says "Radio, when it arrived, was welcomed as a link with the mainland."', 12)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)
values ('bea0ab81-f062-474f-8e51-6f85e82802d6', 'aefc3b54-b041-4a2e-936c-90c87fa1c92e', 'writing', 3600, 2, NULL, 2)
on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('52a3d00a-3ee0-43e3-b90f-6c7aa6e3726c', 'bea0ab81-f062-474f-8e51-6f85e82802d6', 1, 'A friend from another country is planning to visit your town for a week next month and has asked for your advice.

Write a letter to your friend. In your letter:
  •  suggest the best places to stay
  •  recommend some things to do during the visit
  •  offer to help in some way

Begin your letter as follows:

Dear ...,', NULL, NULL, 'You should spend about 20 minutes on this task. Write at least 150 words. You do NOT need to write any addresses.', '{"title":"Task 1"}'::jsonb, 0)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f62a442a-f907-456d-9b51-42e948672460', '52a3d00a-3ee0-43e3-b90f-6c7aa6e3726c', 'short_answer', 'Task 1 response', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('9656b954-5665-4370-b65a-453339b73618', 'bea0ab81-f062-474f-8e51-6f85e82802d6', 2, 'Some people think that young people should be required to do unpaid community work in their free time. Others believe this should be a personal choice.

To what extent do you agree or disagree that community work should be compulsory for young people?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.', NULL, NULL, 'You should spend about 40 minutes on this task. Write at least 250 words.', '{"title":"Task 2"}'::jsonb, 1)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('d10b2df4-872f-441d-88cf-ad47961f300e', '9656b954-5665-4370-b65a-453339b73618', 'short_answer', 'Task 2 response', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.test_sections (id, form_id, section, time_limit_seconds, question_count, instructions, order_index)
values ('9311ec4a-1644-48b1-b920-693d01154a37', 'aefc3b54-b041-4a2e-936c-90c87fa1c92e', 'speaking', 840, 12, NULL, 3)
on conflict (id) do update set time_limit_seconds = excluded.time_limit_seconds, question_count = excluded.question_count;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('a546aaf2-dbca-4b3f-b667-291551633569', '9311ec4a-1644-48b1-b920-693d01154a37', 1, NULL, NULL, NULL, 'The examiner asks about yourself, your home, work or studies and other familiar topics. 4-5 minutes.', '{"title":"Part 1 — Introduction and familiar topics"}'::jsonb, 0)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e6bc0eab-e119-4fa1-815d-2184a7d1ce33', 'a546aaf2-dbca-4b3f-b667-291551633569', 'short_answer', 'Let''s talk about your hometown. Where is your hometown?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f05f57ce-233a-4df5-80da-1c17a342ddeb', 'a546aaf2-dbca-4b3f-b667-291551633569', 'short_answer', 'What is the best thing about living there?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('091e4a2e-4e5a-4a32-bb23-b4d3540c3b09', 'a546aaf2-dbca-4b3f-b667-291551633569', 'short_answer', 'Has your hometown changed much since you were a child?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('8c82b07e-1aa2-452b-8de1-bf8ee6776fc2', 'a546aaf2-dbca-4b3f-b667-291551633569', 'short_answer', 'Now let''s talk about cooking. Do you enjoy cooking?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('74f75739-71ee-444e-a442-8499cee2145f', 'a546aaf2-dbca-4b3f-b667-291551633569', 'short_answer', 'Who usually cooks in your home?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('94b77fba-ba12-4e75-a906-684af06809d0', 'a546aaf2-dbca-4b3f-b667-291551633569', 'short_answer', 'Is there a dish you would like to learn to make?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 5)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('35b56efc-8a8b-4726-b120-0d807883ce1e', '9311ec4a-1644-48b1-b920-693d01154a37', 2, 'Describe a time when you helped someone.

You should say:
  •  who you helped
  •  what the situation was
  •  what you did to help

and explain how you felt about helping this person.', NULL, NULL, 'You have one minute to prepare. You may make notes. Then talk for one to two minutes. The examiner will tell you when to stop.', '{"title":"Part 2 — Individual long turn"}'::jsonb, 1)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('040acac4-6da4-41d5-9362-46bbdf692fa3', '35b56efc-8a8b-4726-b120-0d807883ce1e', 'short_answer', 'Long turn response', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.item_groups (id, section_id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, order_index)
values ('bf3b8d78-7669-4837-b631-3b70a5c65fa5', '9311ec4a-1644-48b1-b920-693d01154a37', 3, NULL, NULL, NULL, 'The examiner asks further questions connected to the topic in Part 2. 4-5 minutes.', '{"title":"Part 3 — Two-way discussion"}'::jsonb, 2)
on conflict (id) do update set passage_text = excluded.passage_text, shared_instructions = excluded.shared_instructions, image_url = excluded.image_url, metadata = excluded.metadata, audio_url = coalesce(public.item_groups.audio_url, excluded.audio_url);

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('257630ef-9332-468c-ba96-7afaa7d64bc8', 'bf3b8d78-7669-4837-b631-3b70a5c65fa5', 'short_answer', 'Why do some people find it difficult to ask for help?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 0)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('e890a703-54cb-4c15-822f-172f42f69a46', 'bf3b8d78-7669-4837-b631-3b70a5c65fa5', 'short_answer', 'Should children be taught to help others at school?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 1)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('f6cba283-6f1e-4df6-9b20-6a36075a521b', 'bf3b8d78-7669-4837-b631-3b70a5c65fa5', 'short_answer', 'Do people help each other less in modern cities?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 2)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('5438fffc-70bc-4591-bfe2-3f6d7b80709c', 'bf3b8d78-7669-4837-b631-3b70a5c65fa5', 'short_answer', 'What kinds of volunteer work are popular in your country?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 3)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

insert into public.questions (id, group_id, type_code, prompt, options, accepted_answers, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, explanation, order_index)
values ('cd214e36-d6f3-4889-ab88-8a65436ea8a4', 'bf3b8d78-7669-4837-b631-3b70a5c65fa5', 'short_answer', 'Is it the government''s responsibility to help people in need, or the community''s?', '[]'::jsonb, '{}', 0, 'lenient', true, false, '{}'::jsonb, NULL, 4)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, accepted_answers = excluded.accepted_answers, word_limit = excluded.word_limit, explanation = excluded.explanation;

commit;
