import type { IconName } from "~/components/ui/Icon";

export interface NavItem {
  label: string;
  /** Key into src/lib/i18n.ts for the Arabic interface. */
  labelKey: string;
  to: string;
  icon: IconName;
  blurb: string;
  /** One of the four phone tabs; everything else sits behind "More". */
  inTabs?: boolean;
}

/**
 * The one navigation. Desktop renders it as the left rail, phones as four
 * bottom tabs plus a More sheet that lists the rest.
 */
export const PRIMARY_NAV: NavItem[] = [
  { label: "Today", labelKey: "nav.home", to: "/", icon: "home", inTabs: true, blurb: "Your next step and your band" },
  { label: "Study plan", labelKey: "nav.plan", to: "/enhance", icon: "calendar", inTabs: true, blurb: "Today's tasks and weak spots" },
  { label: "Practice", labelKey: "nav.practice", to: "/practice", icon: "target", inTabs: true, blurb: "Short sets with AI correction" },
  { label: "Drills", labelKey: "nav.drills", to: "/drills", icon: "sparkles", blurb: "Drill one question type" },
  { label: "Review", labelKey: "nav.review", to: "/review", icon: "repeat", blurb: "Your mistake notebook" },
  { label: "Writing lab", labelKey: "nav.writing", to: "/writing-lab", icon: "pen", blurb: "Essays with AI feedback" },
  { label: "Vocabulary", labelKey: "nav.vocab", to: "/vocabulary", icon: "language", blurb: "Topic words for IELTS" },
  { label: "Mock Test", labelKey: "nav.mock", to: "/mock", icon: "clipboard", inTabs: true, blurb: "Full timed exam" },
  { label: "Learn", labelKey: "nav.learn", to: "/learn", icon: "cap", blurb: "Strategy and format" },
];
