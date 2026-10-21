import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "./supabase";

/**
 * English / Arabic interface strings. The exam content itself stays in
 * English (it is an English exam); the chrome, navigation, headings and
 * guidance switch, and Arabic flips the document to right-to-left.
 *
 * The choice is stored in localStorage for everyone and on profiles.locale
 * for signed-in learners, so it follows them across devices.
 */
export type Locale = "en" | "ar";

const STRINGS = {
  en: {
    "nav.home": "My Tests",
    "nav.plan": "Study plan",
    "nav.practice": "Practice",
    "nav.drills": "Drills",
    "nav.review": "Review",
    "nav.writing": "Writing lab",
    "nav.vocab": "Vocabulary",
    "nav.mock": "Mock Test",
    "nav.learn": "Learn",
    "nav.pricing": "Premium",
    "nav.admin": "Admin",
    "nav.menu": "Menu",
    "common.signIn": "Sign in",
    "common.signOut": "Sign out",
    "common.loading": "Loading…",
    "common.start": "Start",
    "common.submit": "Submit",
    "common.next": "Next",
    "common.correct": "Correct",
    "common.incorrect": "Incorrect",
    "common.answer": "Answer",
    "common.why": "Why",
    "common.premium": "Premium",
    "common.free": "Free",
    "common.minutes": "min",
    "common.language": "العربية",
    "dash.streak": "Day streak",
    "dash.today": "Today",
    "dash.goal": "Daily goal",
    "dash.due": "Cards due",
    "dash.words": "Words learned",
    "dash.examIn": "Exam in",
    "dash.days": "days",
    "plan.title": "Your study plan",
    "plan.subtitle": "Built from your target, exam date and the question types costing you marks.",
    "practice.title": "Practice",
    "practice.subtitle": "Drill one question type with instant, explained feedback.",
    "review.title": "Mistake notebook",
    "review.subtitle": "Questions you got wrong come back on a spaced schedule until they stick.",
    "writing.title": "Writing lab",
    "writing.subtitle": "Write, get examiner-style feedback, rewrite, and watch the band move.",
    "vocab.title": "Vocabulary",
    "vocab.subtitle": "The topic words IELTS rewards, with Arabic meanings and examples.",
    "pricing.title": "MoreIELTS Premium",
  },
  ar: {
    "nav.home": "اختباراتي",
    "nav.plan": "خطة الدراسة",
    "nav.practice": "تدريب",
    "nav.drills": "تمارين الأسئلة",
    "nav.review": "المراجعة",
    "nav.writing": "مختبر الكتابة",
    "nav.vocab": "المفردات",
    "nav.mock": "اختبار تجريبي",
    "nav.learn": "تعلّم",
    "nav.pricing": "بريميوم",
    "nav.admin": "الإدارة",
    "nav.menu": "القائمة",
    "common.signIn": "تسجيل الدخول",
    "common.signOut": "تسجيل الخروج",
    "common.loading": "جارٍ التحميل…",
    "common.start": "ابدأ",
    "common.submit": "إرسال",
    "common.next": "التالي",
    "common.correct": "صحيح",
    "common.incorrect": "خطأ",
    "common.answer": "الإجابة",
    "common.why": "السبب",
    "common.premium": "بريميوم",
    "common.free": "مجاني",
    "common.minutes": "دقيقة",
    "common.language": "English",
    "dash.streak": "أيام متتالية",
    "dash.today": "اليوم",
    "dash.goal": "الهدف اليومي",
    "dash.due": "بطاقات للمراجعة",
    "dash.words": "كلمات تعلّمتها",
    "dash.examIn": "الامتحان بعد",
    "dash.days": "يوم",
    "plan.title": "خطة دراستك",
    "plan.subtitle": "مبنية على هدفك وموعد امتحانك وأنواع الأسئلة التي تخسر فيها درجات.",
    "practice.title": "تدريب",
    "practice.subtitle": "تدرّب على نوع واحد من الأسئلة مع تصحيح فوري وشرح.",
    "review.title": "دفتر الأخطاء",
    "review.subtitle": "الأسئلة التي أخطأت فيها تعود إليك على فترات متباعدة حتى تثبت.",
    "writing.title": "مختبر الكتابة",
    "writing.subtitle": "اكتب، واحصل على تقييم كالممتحن، ثم أعد الكتابة وراقب تحسّن درجتك.",
    "vocab.title": "المفردات",
    "vocab.subtitle": "مفردات المواضيع التي يكافئ عليها آيلتس، مع المعنى العربي وأمثلة.",
    "pricing.title": "بريميوم MoreIELTS",
  },
} as const;

export type StringKey = keyof (typeof STRINGS)["en"];

interface I18n {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: (key: StringKey | string) => string;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18n>({
  locale: "en",
  dir: "ltr",
  t: (key) => (STRINGS.en as Record<string, string>)[key] ?? key,
  setLocale: () => {},
});

function readStored(): Locale {
  try {
    return localStorage.getItem("mi.locale") === "ar" ? "ar" : "en";
  } catch {
    return "en";
  }
}

export function I18nProvider({
  children,
  profileLocale,
  userId,
}: {
  children: ReactNode;
  profileLocale?: Locale | null;
  userId?: string | null;
}) {
  // SSR always renders English; the stored choice applies after hydration.
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    setLocaleState(profileLocale ?? readStored());
  }, [profileLocale]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
      try {
        localStorage.setItem("mi.locale", next);
      } catch {
        // private mode: the choice lasts for this page only
      }
      if (userId) void supabase.from("ielts_learners").update({ locale: next }).eq("user_id", userId);
    },
    [userId],
  );

  const value = useMemo<I18n>(
    () => ({
      locale,
      dir: locale === "ar" ? "rtl" : "ltr",
      t: (key) =>
        (STRINGS[locale] as Record<string, string>)[key] ??
        (STRINGS.en as Record<string, string>)[key] ??
        key,
      setLocale,
    }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
