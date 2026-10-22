import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "~/lib/auth";
import { supabase } from "~/lib/supabase";

/** Saudi Arabia, then Egypt, then the rest of the Arab world. */
const COUNTRIES: { code: string; name: string; dial: string }[] = [
  { code: "SA", name: "السعودية", dial: "966" },
  { code: "EG", name: "مصر", dial: "20" },
  { code: "AE", name: "الإمارات", dial: "971" },
  { code: "KW", name: "الكويت", dial: "965" },
  { code: "QA", name: "قطر", dial: "974" },
  { code: "BH", name: "البحرين", dial: "973" },
  { code: "OM", name: "عُمان", dial: "968" },
  { code: "JO", name: "الأردن", dial: "962" },
  { code: "LB", name: "لبنان", dial: "961" },
  { code: "SY", name: "سوريا", dial: "963" },
  { code: "IQ", name: "العراق", dial: "964" },
  { code: "PS", name: "فلسطين", dial: "970" },
  { code: "YE", name: "اليمن", dial: "967" },
  { code: "LY", name: "ليبيا", dial: "218" },
  { code: "TN", name: "تونس", dial: "216" },
  { code: "DZ", name: "الجزائر", dial: "213" },
  { code: "MA", name: "المغرب", dial: "212" },
  { code: "SD", name: "السودان", dial: "249" },
  { code: "MR", name: "موريتانيا", dial: "222" },
  { code: "SO", name: "الصومال", dial: "252" },
  { code: "DJ", name: "جيبوتي", dial: "253" },
  { code: "KM", name: "جزر القمر", dial: "269" },
];

function flag(code: string) {
  return String.fromCodePoint(...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

/** Splits "+9665..." into a known country code and the local number. */
function splitPhone(e164: string | null): { dial: string; local: string } {
  const digits = (e164 ?? "").replace(/\D/g, "");
  const match = [...COUNTRIES]
    .sort((a, b) => b.dial.length - a.dial.length)
    .find((c) => digits.startsWith(c.dial));
  return match ? { dial: match.dial, local: digits.slice(match.dial.length) } : { dial: "966", local: "" };
}

const SKIP = ["/admin", "/auth", "/login", "/signup", "/unsubscribe"];

/** Asks every signed-in learner for name, nationality and WhatsApp, once. */
export function OnboardingGate() {
  const { user, profile } = useAuth();
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [nationality, setNationality] = useState("SA");
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
    setSeeded(true);
  }, [profile, seeded]);

  if (!user || !profile || profile.onboarded_at) return null;
  if (SKIP.some((p) => pathname.startsWith(p))) return null;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const number = local.replace(/\D/g, "").replace(/^0+/, "");
    if (name.trim().length < 2) return setError("اكتب اسمك من فضلك.");
    if (number.length < 6 || number.length > 12) return setError("رقم الواتساب غير صحيح.");
    setSaving(true);
    const { error: rpcError } = await supabase.rpc("ielts_complete_onboarding", {
      p_full_name: name,
      p_nationality: nationality,
      p_whatsapp: `+${dial}${number}`,
    });
    setSaving(false);
    if (rpcError) return setError("تعذّر الحفظ، حاول مرة أخرى.");
    await queryClient.invalidateQueries({ queryKey: ["profile", user!.id] });
  }

  const field =
    "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-brand-600";

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4">
      <form
        dir="rtl"
        lang="ar"
        onSubmit={submit}
        className="w-full max-w-md space-y-4 rounded-2xl bg-surface p-6 shadow-xl"
        aria-labelledby="onboarding-title"
      >
        <div>
          <h2 id="onboarding-title" className="text-xl font-bold">
            أهلاً بك في MoreIELTS
          </h2>
          <p className="mt-1 text-sm text-muted">خطوة قصيرة قبل أن تبدأ.</p>
        </div>

        <label className="block space-y-1">
          <span className="text-sm font-medium">اسمك :</span>
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
          <span className="text-sm font-medium">جنسيتك :</span>
          <select className={field} value={nationality} onChange={(e) => setNationality(e.target.value)}>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {flag(c.code)} {c.name}
              </option>
            ))}
          </select>
        </label>

        <div className="space-y-1">
          <span className="text-sm font-medium">واتساب :</span>
          <div dir="ltr" className="flex gap-2">
            <select
              aria-label="رمز الدولة"
              className={`${field} w-36 shrink-0`}
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
              aria-label="رقم الواتساب"
              className={field}
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="5xxxxxxxx"
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              required
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-brand-600 px-4 py-2.5 font-semibold text-white disabled:opacity-60"
        >
          {saving ? "جارٍ الحفظ…" : "ابدأ"}
        </button>
      </form>
    </div>
  );
}
