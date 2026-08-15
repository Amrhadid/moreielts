import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useAttemptResponses,
  useAttemptState,
  useDefaultForm,
  useHeartbeat,
  useSaveResponse,
  useSectionContent,
  useStartAttempt,
  useStartSection,
} from "./queries";
import { toItemGroups } from "./adapters";
import type { AnswerSheet, SectionCode } from "~/types/content";

const HEARTBEAT_MS = 30_000;
const SAVE_DEBOUNCE_MS = 600;

/**
 * Everything the four test players share: resolving the form, opening an
 * attempt, loading content, restoring saved answers, and the countdown.
 *
 * The countdown is DISPLAY ONLY. Its starting value comes from the server
 * (get_attempt_state.remaining_seconds), it is resynced by every heartbeat and
 * by every successful save, and the server independently rejects any answer
 * that arrives after section_deadline_at. A tampered client clock buys nothing.
 */
export function usePlayerAttempt(section: SectionCode) {
  const { data: form, isLoading: formLoading, error: formError } = useDefaultForm();
  const startAttempt = useStartAttempt();
  const startSection = useStartSection();
  const saveResponse = useSaveResponse();
  const heartbeat = useHeartbeat();

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [startupError, setStartupError] = useState<string | null>(null);

  const { data: content, isLoading: contentLoading } = useSectionContent(
    form?.id,
    section,
  );
  const { data: state } = useAttemptState(attemptId ?? undefined);
  const { data: savedResponses } = useAttemptResponses(attemptId ?? undefined);

  // Open (or resume) the attempt and stamp the section deadline server-side.
  const started = useRef(false);
  useEffect(() => {
    if (!form?.id || started.current) return;
    started.current = true;

    (async () => {
      try {
        const id = await startAttempt.mutateAsync(form.id);
        setAttemptId(id);
        await startSection.mutateAsync({ attemptId: id, section });
      } catch (error) {
        started.current = false;
        setStartupError((error as Error).message ?? "Could not start the attempt");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.id, section]);

  /* ---------------------------------------------------------------- timer */

  const [remaining, setRemaining] = useState<number | null>(null);

  // Seed from the server on load and on any state refresh. Never from
  // localStorage, and never from a value the client computed itself.
  useEffect(() => {
    if (state?.remaining_seconds != null) setRemaining(state.remaining_seconds);
  }, [state?.remaining_seconds]);

  // Local tick purely so the display moves between server syncs.
  useEffect(() => {
    if (remaining === null) return;
    const id = setInterval(() => {
      setRemaining((prev) => (prev === null ? prev : Math.max(0, prev - 1)));
    }, 1000);
    return () => clearInterval(id);
  }, [remaining === null]);

  // Heartbeat: keeps last_heartbeat_at fresh and resyncs the display clock.
  useEffect(() => {
    if (!attemptId) return;
    const id = setInterval(() => {
      heartbeat
        .mutateAsync({ attemptId })
        .then((result) => {
          if (result?.remaining_seconds != null) setRemaining(result.remaining_seconds);
        })
        .catch(() => {
          /* a dropped heartbeat is not fatal; the next one resyncs */
        });
    }, HEARTBEAT_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId]);

  /* -------------------------------------------------------------- answers */

  const [answers, setAnswers] = useState<AnswerSheet>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  // Restore whatever was already saved, so a refresh loses nothing.
  useEffect(() => {
    if (!savedResponses) return;
    setAnswers((prev) => {
      const next = { ...prev };
      for (const row of savedResponses) {
        if (next[row.question_id] !== undefined) continue;
        const raw = row.answer ?? "";
        if (raw.startsWith("[")) {
          try {
            next[row.question_id] = JSON.parse(raw);
            continue;
          } catch {
            /* fall through to the string form */
          }
        }
        next[row.question_id] = raw;
      }
      return next;
    });
  }, [savedResponses]);

  const setAnswer = useCallback(
    (questionId: string, value: string | string[]) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
      if (!attemptId) return;

      // Debounce per question so typing does not produce a write per keystroke.
      const existing = timers.current.get(questionId);
      if (existing) clearTimeout(existing);

      timers.current.set(
        questionId,
        setTimeout(async () => {
          setSaving(true);
          try {
            const result = await saveResponse.mutateAsync({
              attemptId,
              questionId,
              answer: Array.isArray(value) ? JSON.stringify(value) : value,
            });
            if (result?.remaining_seconds != null) {
              setRemaining(result.remaining_seconds);
            }
            setSaveError(null);
          } catch (error) {
            const message = (error as Error).message ?? "";
            setSaveError(
              message.includes("deadline_passed")
                ? "Time is up for this section — later answers are not saved."
                : "Could not save that answer. Check your connection.",
            );
          } finally {
            setSaving(false);
          }
        }, SAVE_DEBOUNCE_MS),
      );
    },
    [attemptId, saveResponse],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const timer of pending.values()) clearTimeout(timer);
    };
  }, []);

  /* -------------------------------------------------------------- content */

  const groups = useMemo(
    () => (content ? toItemGroups(content.groups, section) : []),
    [content, section],
  );

  const flat = useMemo(
    () => groups.flatMap((g) => g.questions.map((q) => ({ question: q, group: g }))),
    [groups],
  );

  const answered = useMemo(() => {
    const set = new Set<number>();
    for (const { question } of flat) {
      const value = answers[question.id];
      const filled = Array.isArray(value) ? value.length > 0 : Boolean(value);
      if (filled) set.add(question.number);
    }
    return set;
  }, [answers, flat]);

  return {
    form,
    attemptId,
    sectionMeta: content?.section ?? null,
    groups,
    flat,
    answers,
    setAnswer,
    answered,
    remaining,
    saving,
    saveError,
    expired: remaining === 0,
    loading: formLoading || contentLoading || !attemptId,
    error:
      startupError ??
      (formError ? "Could not load the test form." : null) ??
      (!formLoading && !form ? "No published test form is available yet." : null),
  };
}
