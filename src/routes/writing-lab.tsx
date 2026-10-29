import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "~/components/layout/AppShell";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "~/components/ui/Card";
import { Textarea } from "~/components/ui/Field";
import { Icon } from "~/components/ui/Icon";
import { EssayFeedback } from "~/components/writing/EssayFeedback";
import { countWords } from "~/lib/answer-check";
import { PremiumGate, useAuth } from "~/lib/auth";
import { cn } from "~/lib/cn";
import { useI18n } from "~/lib/i18n";
import {
  useEssays,
  useSubmitEssay,
  useWritingPrompts,
  type EssayRow,
  type WritingPrompt,
} from "~/lib/practice-queries";
import { formatBand } from "~/lib/scoring";

export const Route = createFileRoute("/writing-lab")({
  // ?task=1|2 preselects the tab (the study plan links here with it).
  validateSearch: (s: Record<string, unknown>): { essay?: string; task?: 1 | 2 } => ({
    ...(typeof s.essay === "string" && s.essay ? { essay: s.essay } : {}),
    ...(Number(s.task) === 1 || Number(s.task) === 2 ? { task: Number(s.task) as 1 | 2 } : {}),
  }),
  component: () => (
    <PremiumGate>
      <AppShell>
        <WritingLab />
      </AppShell>
    </PremiumGate>
  ),
});

const MINIMUM: Record<1 | 2, number> = { 1: 150, 2: 250 };
const MINUTES: Record<1 | 2, number> = { 1: 20, 2: 40 };

function errorText(err: unknown): { text: string; pricing?: boolean } {
  const msg = String((err as { message?: string })?.message ?? err ?? "");
  if (msg.includes("premium_required"))
    return { text: "The writing lab is part of Premium. Enter your access code to unlock it.", pricing: true };
  if (msg.includes("essay_limit_reached")) return { text: "You have reached today's limit of 20 essays. Try again tomorrow." };
  if (msg.includes("empty_essay")) return { text: "Write your essay before submitting." };
  if (msg.includes("forbidden")) return { text: "That prompt is for Premium members.", pricing: true };
  if (msg.includes("not_authenticated")) return { text: "Please sign in again." };
  return { text: "Something went wrong submitting your essay. Please try again." };
}

function WritingLab() {
  const { t } = useI18n();
  const { essay: essayId, task: taskParam } = Route.useSearch();
  const navigate = useNavigate({ from: "/writing-lab" });
  const essays = useEssays();
  const selected = essays.data?.find((e) => e.id === essayId);

  const [task, setTask] = useState<1 | 2>(taskParam ?? 2);
  const [prompt, setPrompt] = useState<WritingPrompt | null>(null);
  const [custom, setCustom] = useState("");
  const [body, setBody] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const rewrite = (e: EssayRow) => {
    setTask(e.task_number);
    setBody(e.body);
    setParentId(e.id);
    setPrompt(null);
    setCustom(e.prompt);
    pendingPromptGroup.current = e.group_id;
    navigate({ search: {} });
    setTimeout(() => editorRef.current?.focus(), 50);
  };
  const pendingPromptGroup = useRef<string | null>(null);

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("writing.title")}</h1>
        <p className="mt-1 text-sm text-muted">{t("writing.subtitle")}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          {selected ? (
            <EssayDetail essay={selected} all={essays.data ?? []} onBack={() => navigate({ search: {} })} onRewrite={rewrite} />
          ) : (
            <Composer
              task={task}
              setTask={setTask}
              prompt={prompt}
              setPrompt={setPrompt}
              custom={custom}
              setCustom={setCustom}
              body={body}
              setBody={setBody}
              parentId={parentId}
              setParentId={setParentId}
              editorRef={editorRef}
              pendingGroup={pendingPromptGroup}
              onSubmitted={(id) => navigate({ search: { essay: id } })}
            />
          )}
        </div>
        <History essays={essays.data ?? []} loading={essays.isLoading} activeId={essayId} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Composer(p: {
  task: 1 | 2;
  setTask: (t: 1 | 2) => void;
  prompt: WritingPrompt | null;
  setPrompt: (p: WritingPrompt | null) => void;
  custom: string;
  setCustom: (s: string) => void;
  body: string;
  setBody: (s: string) => void;
  parentId: string | null;
  setParentId: (s: string | null) => void;
  editorRef: React.RefObject<HTMLTextAreaElement | null>;
  pendingGroup: React.MutableRefObject<string | null>;
  onSubmitted: (id: string) => void;
}) {
  const { isPremium, profile } = useAuth();
  const prompts = useWritingPrompts();
  const submit = useSubmitEssay();
  const [useCustom, setUseCustom] = useState(false);
  const [allVariants, setAllVariants] = useState(false);
  const variant = profile?.variant ?? null;
  // Academic Task 1 is a chart; General Training Task 1 is a letter. A learner
  // who has chosen their exam sees its prompts unless they ask for all.
  const list = (prompts.data ?? []).filter(
    (x) => x.task_number === p.task && (allVariants || !variant || x.variant === variant),
  );

  // A rewrite carries the original group: reselect its prompt once prompts load.
  useEffect(() => {
    const g = p.pendingGroup.current;
    if (!g || !prompts.data) return;
    const found = prompts.data.find((x) => x.group_id === g);
    p.pendingGroup.current = null;
    if (found) {
      p.setPrompt(found);
      setUseCustom(false);
    } else setUseCustom(true);
  }, [prompts.data, p.custom]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (p.parentId && !p.prompt && p.custom) setUseCustom(true);
  }, [p.parentId, p.prompt, p.custom]);

  const words = countWords(p.body);
  const min = MINIMUM[p.task];
  const promptText = useCustom ? p.custom.trim() : (p.prompt?.prompt ?? "");
  const canSubmit = promptText.length > 0 && words > 0 && !submit.isPending;

  const onSubmit = () => {
    submit.mutate(
      {
        taskNumber: p.task,
        prompt: promptText,
        body: p.body,
        groupId: useCustom ? null : (p.prompt?.group_id ?? null),
        parentId: p.parentId,
      },
      {
        onSuccess: (id) => {
          p.setBody("");
          p.setParentId(null);
          p.onSubmitted(id);
        },
      },
    );
  };

  const err = submit.error ? errorText(submit.error) : null;

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Choose a prompt</CardTitle>
            <div className="inline-flex rounded-lg border border-line bg-paper p-0.5" role="tablist">
              {([1, 2] as const).map((n) => (
                <button
                  key={n}
                  role="tab"
                  aria-selected={p.task === n}
                  onClick={() => {
                    p.setTask(n);
                    p.setPrompt(null);
                  }}
                  className={cn(
                    "rounded-md px-3 py-1 text-sm font-medium",
                    p.task === n ? "bg-surface text-ink shadow-sm" : "text-muted",
                  )}
                >
                  Task {n}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardBody className="space-y-3 px-5 pb-5">
          <div className="flex gap-2 text-sm">
            <Button size="sm" variant={useCustom ? "ghost" : "secondary"} onClick={() => setUseCustom(false)}>
              From the library
            </Button>
            <Button size="sm" variant={useCustom ? "secondary" : "ghost"} onClick={() => setUseCustom(true)}>
              <Icon name="pen" size={14} /> Write your own prompt
            </Button>
          </div>

          {!useCustom && variant && (
            <p className="flex flex-wrap items-center gap-2 text-xs text-muted">
              <span>{allVariants ? "All prompts" : variant === "academic" ? "Academic prompts" : "General Training prompts"}</span>
              <button type="button" className="font-medium text-brand-600 hover:underline" onClick={() => setAllVariants((v) => !v)}>
                {allVariants ? "Show mine only" : "Show all"}
              </button>
            </p>
          )}

          {useCustom ? (
            <Textarea
              rows={4}
              value={p.custom}
              onChange={(e) => p.setCustom(e.target.value)}
              placeholder={`Paste or type a Task ${p.task} question…`}
            />
          ) : prompts.isLoading ? (
            <p className="text-sm text-muted">Loading prompts…</p>
          ) : list.length === 0 ? (
            <p className="text-sm text-muted">No Task {p.task} prompts yet — write your own instead.</p>
          ) : (
            <ul className="grid max-h-72 gap-2 overflow-y-auto sm:grid-cols-2">
              {list.map((x) => {
                const locked = x.is_premium && !isPremium;
                const active = p.prompt?.group_id === x.group_id;
                return (
                  <li key={x.group_id}>
                    {locked ? (
                      <Link
                        to="/pricing"
                        className="flex h-full items-center justify-between gap-2 rounded-lg border border-line bg-paper p-3 text-start text-sm text-muted"
                      >
                        <span className="line-clamp-2">{x.form_title}</span>
                        <span className="flex shrink-0 items-center gap-1 text-xs">
                          <Icon name="lock" size={14} /> Premium
                        </span>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => p.setPrompt(x)}
                        className={cn(
                          "h-full w-full rounded-lg border p-3 text-start text-sm",
                          active ? "border-brand-600 bg-brand-50" : "border-line hover:bg-paper",
                        )}
                      >
                        <span className="line-clamp-2 font-medium">{x.form_title}</span>
                        <span className="text-xs text-muted">
                          {x.variant === "academic" ? "Academic" : "General Training"}
                        </span>
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {!useCustom && p.prompt && (
            <div className="rounded-lg border border-line bg-paper p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{p.prompt.prompt}</p>
              {p.task === 1 && p.prompt.image_url && (
                <img src={p.prompt.image_url} alt="Task 1 chart" className="mt-3 max-h-80 rounded-md border border-line" />
              )}
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>
              Your essay{" "}
              {p.parentId && (
                <Badge tone="brand" className="ms-2">
                  Rewrite
                </Badge>
              )}
            </CardTitle>
            <Timer minutes={MINUTES[p.task]} />
          </div>
        </CardHeader>
        <CardBody className="space-y-3 px-5 pb-5">
          <Textarea
            ref={p.editorRef}
            rows={16}
            value={p.body}
            onChange={(e) => p.setBody(e.target.value)}
            placeholder="Start writing…"
            spellCheck={false}
            className="font-[inherit] leading-relaxed"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className={cn("text-sm", words > 0 && words < min ? "text-warn" : "text-muted")}>
              {words} / {min} words{words > 0 && words < min ? ` · ${min - words} to go` : words >= min ? " · minimum reached" : ""}
            </span>
            <div className="flex gap-2">
              {p.parentId && (
                <Button variant="ghost" size="sm" onClick={() => p.setParentId(null)}>
                  Not a rewrite
                </Button>
              )}
              <Button onClick={onSubmit} disabled={!canSubmit}>
                {submit.isPending ? "Submitting…" : "Submit for feedback"}
              </Button>
            </div>
          </div>
          {err && (
            <p className="rounded-lg border border-bad/20 bg-bad-soft p-3 text-sm text-bad">
              {err.text}{" "}
              {err.pricing && (
                <Link to="/pricing" className="font-semibold underline">
                  See Premium
                </Link>
              )}
            </p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

function Timer({ minutes }: { minutes: number }) {
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!endsAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [endsAt]);
  useEffect(() => setEndsAt(null), [minutes]);

  if (!endsAt)
    return (
      <Button size="sm" variant="outline" onClick={() => { setNow(Date.now()); setEndsAt(Date.now() + minutes * 60000); }}>
        Start {minutes}-min timer
      </Button>
    );
  const left = Math.max(0, Math.round((endsAt - now) / 1000));
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <div className="flex items-center gap-2">
      <span className={cn("font-mono text-sm tabular-nums", left === 0 ? "text-bad" : left < 300 ? "text-warn" : "text-ink")}>
        {left === 0 ? "Time's up" : `${mm}:${ss}`}
      </span>
      <Button size="sm" variant="ghost" onClick={() => setEndsAt(null)}>
        Stop
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const groupKey = (e: EssayRow) => e.group_id ?? `custom:${e.task_number}:${e.prompt.trim().slice(0, 200)}`;

function StatusPill({ e }: { e: EssayRow }) {
  if (e.status === "pending")
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted">
        <span className="size-3 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
        Grading… usually under a minute
      </span>
    );
  if (e.status === "failed") return <Badge tone="bad">Grading failed</Badge>;
  return <Badge tone="good">Band {e.task_band == null ? "–" : formatBand(Number(e.task_band))}</Badge>;
}

function History({ essays, loading, activeId }: { essays: EssayRow[]; loading: boolean; activeId?: string }) {
  const groups = useMemo(() => {
    const m = new Map<string, EssayRow[]>();
    for (const e of essays) {
      const k = groupKey(e);
      m.set(k, [...(m.get(k) ?? []), e]);
    }
    return [...m.values()];
  }, [essays]);

  return (
    <aside className="min-w-0">
      <Card>
        <CardHeader>
          <CardTitle>Your essays</CardTitle>
        </CardHeader>
        <CardBody className="space-y-4 px-5 pb-5">
          {loading ? (
            <p className="text-sm text-muted">Loading…</p>
          ) : groups.length === 0 ? (
            <p className="text-sm text-muted">Nothing yet. Your graded essays will appear here.</p>
          ) : (
            groups.map((g) => {
              const drafts = [...g].reverse(); // oldest first
              return (
                <div key={groupKey(g[0])} className="border-b border-line pb-3 last:border-0 last:pb-0">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <p className="line-clamp-2 text-sm font-medium">
                      <span className="text-muted">T{g[0].task_number} · </span>
                      {g[0].prompt}
                    </p>
                    <Trend values={drafts.map((d) => d.task_band)} />
                  </div>
                  <ul className="space-y-1">
                    {g.map((e) => (
                      <li key={e.id}>
                        <Link
                          to="/writing-lab"
                          search={{ essay: e.id }}
                          className={cn(
                            "flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-paper",
                            activeId === e.id && "bg-brand-50",
                          )}
                        >
                          <span className="text-muted">{new Date(e.created_at).toLocaleDateString()}</span>
                          <StatusPill e={e} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })
          )}
        </CardBody>
      </Card>
    </aside>
  );
}

function Trend({ values }: { values: Array<number | null> }) {
  const pts = values.map((v) => (v == null ? null : Number(v)));
  const nums = pts.filter((v): v is number => v != null);
  if (nums.length < 2) return null;
  const w = 64, h = 22, lo = Math.min(...nums, 4), hi = Math.max(...nums, 7);
  const coords = pts
    .map((v, i) => (v == null ? null : [(i / (pts.length - 1)) * (w - 4) + 2, h - 2 - ((v - lo) / (hi - lo || 1)) * (h - 4)]))
    .filter((c): c is number[] => c != null);
  const up = nums[nums.length - 1] >= nums[0];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className={cn("shrink-0", up ? "text-good" : "text-bad")} aria-label={`Band trend: ${nums.join(", ")}`}>
      <polyline points={coords.map((c) => c.join(",")).join(" ")} fill="none" stroke="currentColor" strokeWidth={1.5} />
      {coords.map((c, i) => (
        <circle key={i} cx={c[0]} cy={c[1]} r={2} fill="currentColor" />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */

function EssayDetail({
  essay,
  all,
  onBack,
  onRewrite,
}: {
  essay: EssayRow;
  all: EssayRow[];
  onBack: () => void;
  onRewrite: (e: EssayRow) => void;
}) {
  const drafts = all.filter((e) => groupKey(e) === groupKey(essay)).reverse();
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <Icon name="arrowRight" size={14} className="rotate-180 rtl:rotate-0" /> Back to editor
        </Button>
        <div className="flex items-center gap-3">
          {drafts.length > 1 && <Trend values={drafts.map((d) => d.task_band)} />}
          <Button size="sm" onClick={() => onRewrite(essay)}>
            <Icon name="repeat" size={14} /> Rewrite this essay
          </Button>
        </div>
      </div>

      <Card>
        <CardBody className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Task {essay.task_number} prompt</p>
          <p className="mt-1 whitespace-pre-wrap text-sm">{essay.prompt}</p>
        </CardBody>
      </Card>

      {essay.status === "pending" ? (
        <Card>
          <CardBody className="flex items-center gap-3 p-5 text-sm text-muted">
            <span className="size-4 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
            Grading… usually under a minute. This page updates by itself.
          </CardBody>
        </Card>
      ) : essay.status === "failed" ? (
        <Card>
          <CardBody className="p-5 text-sm text-bad">
            We could not grade this essay. You can submit it again with “Rewrite this essay”.
          </CardBody>
        </Card>
      ) : (
        <EssayFeedback
          taskNumber={essay.task_number}
          task_band={essay.task_band}
          task_achievement={essay.task_achievement}
          coherence_cohesion={essay.coherence_cohesion}
          lexical_resource={essay.lexical_resource}
          grammatical_range={essay.grammatical_range}
          feedback={essay.feedback}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            Your essay <span className="text-sm font-normal text-muted">· {countWords(essay.body)} words</span>
          </CardTitle>
        </CardHeader>
        <CardBody className="whitespace-pre-wrap px-5 pb-5 text-sm leading-relaxed">{essay.body}</CardBody>
      </Card>
    </div>
  );
}
