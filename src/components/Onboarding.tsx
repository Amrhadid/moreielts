import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "~/lib/auth";
import { useI18n } from "~/lib/i18n";
import { supabase } from "~/lib/supabase";
import type { Variant } from "~/types/database";

/** Saudi Arabia, then Egypt, then the rest of the Arab world. */
export const COUNTRIES: { code: string; name: string; name_en: string; dial: string }[] = [
  { code: "SA", name: "السعودية", name_en: "Saudi Arabia", dial: "966" },
  { code: "EG", name: "مصر", name_en: "Egypt", dial: "20" },
  { code: "AE", name: "الإمارات", name_en: "United Arab Emirates", dial: "971" },
  { code: "KW", name: "الكويت", name_en: "Kuwait", dial: "965" },
  { code: "QA", name: "قطر", name_en: "Qatar", dial: "974" },
  { code: "BH", name: "البحرين", name_en: "Bahrain", dial: "973" },
  { code: "OM", name: "عُمان", name_en: "Oman", dial: "968" },
  { code: "JO", name: "الأردن", name_en: "Jordan", dial: "962" },
  { code: "LB", name: "لبنان", name_en: "Lebanon", dial: "961" },
  { code: "SY", name: "سوريا", name_en: "Syria", dial: "963" },
  { code: "IQ", name: "العراق", name_en: "Iraq", dial: "964" },
  { code: "PS", name: "فلسطين", name_en: "Palestine", dial: "970" },
  { code: "YE", name: "اليمن", name_en: "Yemen", dial: "967" },
  { code: "LY", name: "ليبيا", name_en: "Libya", dial: "218" },
  { code: "TN", name: "تونس", name_en: "Tunisia", dial: "216" },
  { code: "DZ", name: "الجزائر", name_en: "Algeria", dial: "213" },
  { code: "MA", name: "المغرب", name_en: "Morocco", dial: "212" },
  { code: "SD", name: "السودان", name_en: "Sudan", dial: "249" },
  { code: "MR", name: "موريتانيا", name_en: "Mauritania", dial: "222" },
  { code: "SO", name: "الصومال", name_en: "Somalia", dial: "252" },
  { code: "DJ", name: "جيبوتي", name_en: "Djibouti", dial: "253" },
  { code: "KM", name: "جزر القمر", name_en: "Comoros", dial: "269" },
];

export function flag(code: string) {
  return String.fromCodePoint(...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

/** Splits "+9665..." into a known country code and the local number. */
export function splitPhone(e164: string | null): { dial: string; local: string } {
  const digits = (e164 ?? "").replace(/\D/g, "");
  const match = [...COUNTRIES]
    .sort((a, b) => b.dial.length - a.dial.length)
    .find((c) => digits.startsWith(c.dial));
  return match ? { dial: match.dial, local: digits.slice(match.dial.length) } : { dial: "966", local: "" };
}

const SKIP = ["/admin", "/auth", "/login", "/signup", "/unsubscribe", "/test/"];

const fieldBase =
  "rounded-lg border border-line-strong bg-surface px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-brand-600";
const field = `w-full ${fieldBase}`;

/**
 * Asks every signed-in learner for a name, nationality and which IELTS they
 * are taking. In the interface language, skippable once (the skip is
 * remembered on the learner row), and the WhatsApp number is optional: it is
 * asked for again on the Premium page, where a code has to be sent.
 */
export function OnboardingGate() {
  const { user, profile } = useAuth();
  const { pathname } = useLocation();
  const { t, locale } = useI18n();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [nationality, setNationality] = useState("SA");
  const [variant, setVariant] = useState<Variant | "">("");
  const [dial, setDial] = useState("966");
  const [local, setLocal] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    if (!profile || seeded) return;
    setName(profile.full_name ?? "");
    const phone = splitPhone(profile.whatsapp);
    setDial(phone.dial);
    setLocal(phone.local);
    if (profile.nationality) setNationality(profile.nationality);
    if (profile.variant) setVariant(profile.variant);
    setSeeded(true);
  }, [profile, seeded]);

  if (!user || !profile || profile.onboarded_at || profile.onboarding_skipped_at) return null;
  if (SKIP.some((p) => pathname.startsWith(p))) return null;

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["profile", user!.id] });

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const number = local.replace(/\D/g, "").replace(/^0+/, "");
    if (name.trim().length < 2) return setError(t("onboard.err.name"));
    if (number && (number.length < 6 || number.length > 12)) return setError(t("onboard.err.whatsapp"));
    setSaving(true);
    const { error: rpcError } = await supabase.rpc("ielts_complete_onboarding", {
      p_full_name: name,
      p_nationality: nationality,
      p_whatsapp: number ? `+${dial}${number}` : null,
      p_variant: variant || null,
    });
    setSaving(false);
    if (rpcError) return setError(t("onboard.err.save"));
    await refresh();
  }

  async function skip() {
    setSaving(true);
    const { error: rpcError } = await supabase.rpc("ielts_skip_onboarding");
    setSaving(false);
    if (rpcError) return setError(t("onboard.err.save"));
    await refresh();
  }

  const countryName = (c: (typeof COUNTRIES)[number]) => (locale === "ar" ? c.name : c.name_en);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={submit}
        className="max-h-[calc(100vh-2rem)] w-full max-w-md space-y-4 overflow-y-auto rounded-2xl bg-surface p-6 shadow-xl"
        aria-labelledby="onboarding-title"
      >
        <div>
          <h2 id="onboarding-title" className="text-xl font-bold">
            {t("onboard.title")}
          </h2>
          <p className="mt-1 text-sm text-muted">{t("onboard.subtitle")}</p>
        </div>

        <label className="block space-y-1">
          <span className="text-sm font-medium">{t("onboard.name")}</span>
          <input
            className={field}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            autoComplete="name"
            required
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium">{t("onboard.nationality")}</span>
          <select className={field} value={nationality} onChange={(e) => setNationality(e.target.value)}>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {flag(c.code)} {countryName(c)}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">{t("onboard.variant")}</legend>
          <div className="grid grid-cols-3 gap-2" role="radiogroup">
            {(
              [
                ["academic", t("onboard.variant.academic")],
                ["general_training", t("onboard.variant.general")],
                ["", t("onboard.variant.unsure")],
              ] as Array<[Variant | "", string]>
            ).map(([value, label]) => (
              <button
                key={value || "unsure"}
                type="button"
                role="radio"
                aria-checked={variant === value}
                onClick={() => setVariant(value)}
                className={
                  "rounded-lg border px-2 py-2.5 text-sm font-medium transition-colors " +
                  (variant === value
                    ? "border-brand-600 bg-brand-50 text-brand-700"
                    : "border-line-strong bg-surface text-ink-soft hover:bg-paper")
                }
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="space-y-1">
          <span className="text-sm font-medium">{t("onboard.whatsapp")}</span>
          <div dir="ltr" className="flex gap-2">
            <select
              aria-label={t("onboard.dial")}
              className={`${fieldBase} w-32 shrink-0`}
              value={dial}
              onChange={(e) => setDial(e.target.value)}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.dial}>
                  {flag(c.code)} +{c.dial}
                </option>
              ))}
            </select>
            <input
              aria-label={t("onboard.number")}
              className={`${field} min-w-0 flex-1`}
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="5xxxxxxxx"
              value={local}
              onChange={(e) => setLocal(e.target.value)}
            />
          </div>
          <p className="text-xs text-muted">{t("onboard.whatsapp.hint")}</p>
        </div>

        {error && (
          <p role="alert" className="text-sm text-bad">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row-reverse">
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-brand-600 px-4 py-2.5 font-semibold text-white disabled:opacity-60"
          >
            {saving ? t("onboard.saving") : t("onboard.start")}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={skip}
            className="w-full rounded-lg border border-line-strong px-4 py-2.5 font-medium text-ink-soft hover:bg-paper disabled:opacity-60"
          >
            {t("onboard.skip")}
          </button>
        </div>
      </form>
    </div>
  );
}
