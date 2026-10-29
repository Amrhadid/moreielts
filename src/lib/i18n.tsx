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
    "onboard.title": "Welcome to MoreIELTS",
    "onboard.subtitle": "A short step before you start. You can skip it for now.",
    "onboard.name": "Your name",
    "onboard.nationality": "Nationality",
    "onboard.variant": "Which IELTS are you taking?",
    "onboard.variant.academic": "Academic",
    "onboard.variant.general": "General Training",
    "onboard.variant.unsure": "Not sure yet",
    "onboard.whatsapp": "WhatsApp (optional)",
    "onboard.whatsapp.hint": "We send your Premium code here. You can add it later on the Premium page.",
    "onboard.dial": "Country code",
    "onboard.number": "WhatsApp number",
    "onboard.start": "Start",
    "onboard.skip": "Skip for now",
    "onboard.saving": "Saving…",
    "onboard.err.name": "Please enter your name.",
    "onboard.err.whatsapp": "That WhatsApp number does not look right.",
    "onboard.err.save": "Could not save. Please try again.",
    "exit.title": "Leave this section?",
    "exit.body": "The clock keeps running while you are away. You can come back from the dashboard until the time runs out.",
    "exit.timeLeft": "Time left",
    "exit.stay": "Keep working",
    "exit.leave": "Leave the test",
    "mock.onlyVariant": "Showing {variant} exams",
    "mock.showAll": "Show all exams",
    "mock.showMine": "Show my exams only",
    "variant.academic": "Academic",
    "variant.general_training": "General Training",
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
    "onboard.title": "أهلاً بك في MoreIELTS",
    "onboard.subtitle": "خطوة قصيرة قبل أن تبدأ. يمكنك تخطّيها الآن.",
    "onboard.name": "اسمك",
    "onboard.nationality": "جنسيتك",
    "onboard.variant": "أي اختبار آيلتس ستقدّم؟",
    "onboard.variant.academic": "أكاديمي",
    "onboard.variant.general": "التدريب العام",
    "onboard.variant.unsure": "لم أقرر بعد",
    "onboard.whatsapp": "واتساب (اختياري)",
    "onboard.whatsapp.hint": "نرسل لك كود البريميوم هنا. يمكنك إضافته لاحقاً من صفحة البريميوم.",
    "onboard.dial": "رمز الدولة",
    "onboard.number": "رقم الواتساب",
    "onboard.start": "ابدأ",
    "onboard.skip": "تخطّ الآن",
    "onboard.saving": "جارٍ الحفظ…",
    "onboard.err.name": "اكتب اسمك من فضلك.",
    "onboard.err.whatsapp": "رقم الواتساب غير صحيح.",
    "onboard.err.save": "تعذّر الحفظ، حاول مرة أخرى.",
    "exit.title": "تريد مغادرة هذا القسم؟",
    "exit.body": "الوقت يستمر في العدّ أثناء غيابك. يمكنك العودة من لوحة التحكم قبل انتهاء الوقت.",
    "exit.timeLeft": "الوقت المتبقي",
    "exit.stay": "أكمل العمل",
    "exit.leave": "غادر الاختبار",
    "mock.onlyVariant": "عرض اختبارات {variant}",
    "mock.showAll": "عرض كل الاختبارات",
    "mock.showMine": "عرض اختباراتي فقط",
    "variant.academic": "الأكاديمي",
    "variant.general_training": "التدريب العام",
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
