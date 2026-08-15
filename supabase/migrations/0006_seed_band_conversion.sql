-- 0006_seed_band_conversion.sql
-- Raw score (out of 40) to band conversion for Listening and Reading.
--
-- IMPORTANT -- THESE ARE ESTIMATES, NOT OFFICIAL IELTS CONVERSION TABLES.
-- The real conversion is set per test form during equating and is not
-- published. The boundaries below are the commonly cited approximations used
-- by practice material, and they will differ from an official result.
--
-- Everything is keyed by `version` precisely so these can be recalibrated
-- later: insert a new set of rows under version 'v2', point new test forms at
-- scoring_version 'v2', and previously scored attempts keep reproducing their
-- original bands because attempt_scores records the version it used. Rows are
-- never edited in place.

-- Listening (identical boundaries for Academic and General Training).
insert into public.band_conversion (variant, section, raw_min, raw_max, band, version)
select v.variant, 'listening', t.raw_min, t.raw_max, t.band, 'v1'
from (values
  (39, 40, 9.0), (37, 38, 8.5), (35, 36, 8.0), (32, 34, 7.5), (30, 31, 7.0),
  (26, 29, 6.5), (23, 25, 6.0), (18, 22, 5.5), (16, 17, 5.0), (13, 15, 4.5),
  (10, 12, 4.0), (8, 9, 3.5), (6, 7, 3.0), (4, 5, 2.5), (3, 3, 2.0),
  (2, 2, 1.5), (1, 1, 1.0), (0, 0, 0.0)
) as t(raw_min, raw_max, band)
cross join (values ('academic'), ('general_training')) as v(variant)
on conflict (variant, section, raw_min, version) do nothing;

-- Academic Reading.
insert into public.band_conversion (variant, section, raw_min, raw_max, band, version)
values
  ('academic', 'reading', 39, 40, 9.0, 'v1'),
  ('academic', 'reading', 37, 38, 8.5, 'v1'),
  ('academic', 'reading', 35, 36, 8.0, 'v1'),
  ('academic', 'reading', 33, 34, 7.5, 'v1'),
  ('academic', 'reading', 30, 32, 7.0, 'v1'),
  ('academic', 'reading', 27, 29, 6.5, 'v1'),
  ('academic', 'reading', 23, 26, 6.0, 'v1'),
  ('academic', 'reading', 19, 22, 5.5, 'v1'),
  ('academic', 'reading', 15, 18, 5.0, 'v1'),
  ('academic', 'reading', 13, 14, 4.5, 'v1'),
  ('academic', 'reading', 10, 12, 4.0, 'v1'),
  ('academic', 'reading', 8, 9, 3.5, 'v1'),
  ('academic', 'reading', 6, 7, 3.0, 'v1'),
  ('academic', 'reading', 4, 5, 2.5, 'v1'),
  ('academic', 'reading', 3, 3, 2.0, 'v1'),
  ('academic', 'reading', 2, 2, 1.5, 'v1'),
  ('academic', 'reading', 1, 1, 1.0, 'v1'),
  ('academic', 'reading', 0, 0, 0.0, 'v1')
on conflict (variant, section, raw_min, version) do nothing;

-- General Training Reading. A higher raw score is needed for the same band,
-- because the texts are less demanding than the Academic passages.
insert into public.band_conversion (variant, section, raw_min, raw_max, band, version)
values
  ('general_training', 'reading', 40, 40, 9.0, 'v1'),
  ('general_training', 'reading', 39, 39, 8.5, 'v1'),
  ('general_training', 'reading', 37, 38, 8.0, 'v1'),
  ('general_training', 'reading', 36, 36, 7.5, 'v1'),
  ('general_training', 'reading', 34, 35, 7.0, 'v1'),
  ('general_training', 'reading', 32, 33, 6.5, 'v1'),
  ('general_training', 'reading', 30, 31, 6.0, 'v1'),
  ('general_training', 'reading', 27, 29, 5.5, 'v1'),
  ('general_training', 'reading', 23, 26, 5.0, 'v1'),
  ('general_training', 'reading', 19, 22, 4.5, 'v1'),
  ('general_training', 'reading', 15, 18, 4.0, 'v1'),
  ('general_training', 'reading', 12, 14, 3.5, 'v1'),
  ('general_training', 'reading', 9, 11, 3.0, 'v1'),
  ('general_training', 'reading', 6, 8, 2.5, 'v1'),
  ('general_training', 'reading', 4, 5, 2.0, 'v1'),
  ('general_training', 'reading', 3, 3, 1.5, 'v1'),
  ('general_training', 'reading', 1, 2, 1.0, 'v1'),
  ('general_training', 'reading', 0, 0, 0.0, 'v1')
on conflict (variant, section, raw_min, version) do nothing;

-- Guard: a gap in the table would make a raw score unscoreable at run time, so
-- fail the migration here rather than at submission time.
do $$
declare
  v_variant text;
  v_section text;
  v_raw int;
begin
  foreach v_variant in array array['academic', 'general_training'] loop
    foreach v_section in array array['listening', 'reading'] loop
      for v_raw in 0..40 loop
        if not exists (
          select 1 from public.band_conversion
          where variant = v_variant
            and section = v_section
            and version = 'v1'
            and v_raw between raw_min and raw_max
        ) then
          raise exception 'band_conversion v1 has no row for %/% raw %',
            v_variant, v_section, v_raw;
        end if;
      end loop;
    end loop;
  end loop;
end;
$$;
