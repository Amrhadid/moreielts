import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { AppShell } from "~/components/layout/AppShell";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card, CardBody } from "~/components/ui/Card";
import { Input } from "~/components/ui/Field";
import { Icon } from "~/components/ui/Icon";
import { Progress } from "~/components/ui/Progress";
import vocabulary from "~/data/vocabulary.json";
import { PremiumGate, useAuth } from "~/lib/auth";
import { cn } from "~/lib/cn";
import { useI18n } from "~/lib/i18n";
import { useLearnedWords, useToggleLearned } from "~/lib/practice-queries";

interface Word {
  slug: string;
  word: string;
  pos: string;
  band: number;
  definition: string;
  meaning_ar: string;
  example: string;
  collocations: string[];
}
interface Topic {
  slug: string;
  name: string;
  name_ar: string;
  words: Word[];
}
const TOPICS = (vocabulary as { topics: Topic[] }).topics;

export const Route = createFileRoute("/vocabulary")({
  validateSearch: (s: Record<string, unknown>): { topic?: string } =>
    typeof s.topic === "string" && s.topic ? { topic: s.topic } : {},
  component: () => (
    <PremiumGate>
      <AppShell>
        <VocabularyPage />
      </AppShell>
    </PremiumGate>
  ),
});

type BandFilter = "all" | 5 | 6 | 7 | 8;

function VocabularyPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { topic: topicSlug } = Route.useSearch();
  const navigate = useNavigate({ from: "/vocabulary" });
  const learnedQ = useLearnedWords(!!user);
  const learned = user ? (learnedQ.data ?? new Set<string>()) : new Set<string>();
  const toggle = useToggleLearned(user?.id);
  const [signInHint, setSignInHint] = useState(false);

  const [query, setQuery] = useState("");
  const [band, setBand] = useState<BandFilter>("all");
  const [hideLearned, setHideLearned] = useState(false);
  const [flash, setFlash] = useState(false);

  const topic = TOPICS.find((x) => x.slug === topicSlug);

  const onToggle = (slug: string, value: boolean) => {
    if (!user) {
      setSignInHint(true);
      return;
    }
    toggle.mutate({ slug, learned: value });
  };

  const q = query.trim().toLowerCase();
  const sourceWords: Array<Word & { topic: Topic }> = useMemo(() => {
    const base = q ? TOPICS : topic ? [topic] : [];
    return base.flatMap((tp) =>
      tp.words
        .filter(
          (w) =>
            !q ||
            w.word.toLowerCase().includes(q) ||
            w.definition.toLowerCase().includes(q) ||
            w.meaning_ar.includes(query.trim()),
        )
        .map((w) => ({ ...w, topic: tp })),
    );
  }, [q, query, topic]);
  const words = sourceWords.filter(
    (w) => (band === "all" || w.band === band) && !(hideLearned && learned.has(w.slug)),
  );

  const totalLearned = learned.size;
  const showList = !!q || !!topic;

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("vocab.title")}</h1>
          <p className="mt-1 text-sm text-muted">{t("vocab.subtitle")}</p>
        </div>
        {user && (
          <div className="rounded-xl border border-line bg-surface px-4 py-2 text-center">
            <div className="text-2xl font-bold text-brand-700">{totalLearned}</div>
            <div className="text-xs text-muted">words learned</div>
          </div>
        )}
      </header>

      <div className="mb-5 relative">
        <Icon name="book" size={16} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search all topics…"
          className="ps-9"
          aria-label="Search words"
        />
      </div>

      {signInHint && !user && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-brand-100 bg-brand-50 p-3 text-sm text-brand-700">
          <span>Sign in to keep track of the words you know.</span>
          <Button asChild size="sm">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      )}

      {!showList ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((tp) => {
            const n = tp.words.filter((w) => learned.has(w.slug)).length;
            return (
              <Link key={tp.slug} to="/vocabulary" search={{ topic: tp.slug }} className="block">
                <Card className="h-full hover:border-brand-100">
                  <CardBody className="p-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-semibold">{tp.name}</h3>
                      <span dir="rtl" lang="ar" className="text-sm text-muted">
                        {tp.name_ar}
                      </span>
                    </div>
                    <Progress value={(n / Math.max(1, tp.words.length)) * 100} tone="good" className="mt-3" />
                    <p className="mt-1.5 text-xs text-muted">
                      {n}/{tp.words.length} learned
                    </p>
                  </CardBody>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {topic && !q && (
                <Button variant="ghost" size="sm" onClick={() => navigate({ search: {} })}>
                  <Icon name="arrowRight" size={14} className="rotate-180 rtl:rotate-0" /> All topics
                </Button>
              )}
              <h2 className="text-lg font-semibold">
                {q ? `Results for “${query.trim()}”` : topic?.name}
                {!q && topic && (
                  <span dir="rtl" lang="ar" className="ms-2 text-sm font-normal text-muted">
                    {topic.name_ar}
                  </span>
                )}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <div className="inline-flex rounded-lg border border-line bg-paper p-0.5">
                {(["all", 5, 6, 7, 8] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBand(b)}
                    aria-pressed={band === b}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-xs font-medium",
                      band === b ? "bg-surface text-ink shadow-sm" : "text-muted",
                    )}
                  >
                    {b === "all" ? "All" : `Band ${b}`}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-1.5 text-xs text-muted">
                <input type="checkbox" checked={hideLearned} onChange={(e) => setHideLearned(e.target.checked)} />
                Hide learned
              </label>
              <Button size="sm" variant={flash ? "secondary" : "outline"} onClick={() => setFlash((f) => !f)} disabled={!words.length}>
                <Icon name="repeat" size={14} /> {flash ? "List" : "Flashcards"}
              </Button>
            </div>
          </div>

          {words.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">No words match.</p>
          ) : flash ? (
            <Flashcards key={`${topicSlug}:${band}:${q}:${hideLearned}`} words={words} onKnow={(s) => onToggle(s, true)} />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {words.map((w) => (
                <WordCard
                  key={`${w.topic.slug}:${w.slug}`}
                  w={w}
                  topicName={q ? w.topic.name : undefined}
                  learned={learned.has(w.slug)}
                  onToggle={(v) => onToggle(w.slug, v)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function highlight(example: string, word: string): ReactNode {
  const stem = word.length > 4 ? word.slice(0, word.length - (word.endsWith("e") ? 1 : 0)) : word;
  const re = new RegExp(`(\\b${stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\w*)`, "i");
  const parts = example.split(re);
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded bg-brand-50 px-0.5 font-semibold text-brand-700">
        {p}
      </mark>
    ) : (
      p
    ),
  );
}

function WordCard({
  w,
  learned,
  onToggle,
  topicName,
}: {
  w: Word;
  learned: boolean;
  onToggle: (v: boolean) => void;
  topicName?: string;
}) {
  return (
    <Card className={cn(learned && "border-good/30")}>
      <CardBody className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-baseline gap-2">
              <h3 className="text-lg font-semibold">{w.word}</h3>
              <span className="text-xs italic text-muted">{w.pos}</span>
              <Badge tone={w.band >= 7 ? "brand" : "neutral"}>Band {w.band}</Badge>
              {topicName && <span className="text-xs text-muted">· {topicName}</span>}
            </div>
            <p className="mt-1 text-sm text-ink-soft">{w.definition}</p>
          </div>
          <span dir="rtl" lang="ar" className="shrink-0 text-base font-medium">
            {w.meaning_ar}
          </span>
        </div>
        <p className="mt-2 text-sm italic">{highlight(w.example, w.word)}</p>
        {w.collocations.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {w.collocations.map((c) => (
              <span key={c} className="rounded-md bg-paper px-1.5 py-0.5 text-xs text-muted">
                {c}
              </span>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => onToggle(!learned)}
          aria-pressed={learned}
          className={cn(
            "mt-3 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium",
            learned ? "border-good/30 bg-good-soft text-good" : "border-line text-muted hover:bg-paper",
          )}
        >
          <Icon name="check" size={14} /> {learned ? "Learned" : "I know this"}
        </button>
      </CardBody>
    </Card>
  );
}

function Flashcards({ words: initial, onKnow }: { words: Word[]; onKnow: (slug: string) => void }) {
  // Freeze the deck so marking a word (with "hide learned" on) does not shift it.
  const [words] = useState(initial);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  if (i >= words.length)
    return (
      <Card>
        <CardBody className="p-8 text-center">
          <p className="font-semibold">Deck finished.</p>
          <Button className="mt-4" variant="outline" onClick={() => { setI(0); setFlipped(false); }}>
            Start again
          </Button>
        </CardBody>
      </Card>
    );
  const w = words[i];
  const next = () => {
    setFlipped(false);
    setI((x) => x + 1);
  };
  return (
    <div className="mx-auto max-w-lg">
      <p className="mb-2 text-center text-xs text-muted">
        {i + 1} / {words.length}
      </p>
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="block w-full rounded-card border border-line bg-surface p-8 text-center shadow-sm"
      >
        <div className="text-2xl font-bold">{w.word}</div>
        <div className="mt-1 text-xs italic text-muted">
          {w.pos} · Band {w.band}
        </div>
        {flipped ? (
          <div className="mt-5 space-y-2">
            <p dir="rtl" lang="ar" className="text-lg font-medium">
              {w.meaning_ar}
            </p>
            <p className="text-sm text-ink-soft">{w.definition}</p>
            <p className="text-sm italic">{highlight(w.example, w.word)}</p>
          </div>
        ) : (
          <p className="mt-5 text-xs text-muted">Tap to reveal</p>
        )}
      </button>
      <div className="mt-4 flex justify-center gap-3">
        <Button variant="outline" onClick={next}>
          Still learning
        </Button>
        <Button
          onClick={() => {
            onKnow(w.slug);
            next();
          }}
        >
          <Icon name="check" size={14} /> Know it
        </Button>
      </div>
    </div>
  );
}
