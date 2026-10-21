import type { IconName } from "~/components/ui/Icon";

export interface NavItem {
  label: string;
  /** Key into src/lib/i18n.ts for the Arabic interface. */
  labelKey: string;
  to: string;
  icon: IconName;
  blurb: string;
  /** Shown in the desktop header; everything is in the sidebar and mobile menu. */
  inHeader?: boolean;
}

export const PRIMARY_NAV: NavItem[] = [
  { label: "My Tests", labelKey: "nav.home", to: "/", icon: "home", blurb: "Dashboard and progress" },
  { label: "Study plan", labelKey: "nav.plan", to: "/enhance", inHeader: true, icon: "calendar", blurb: "Today's tasks and weak spots" },
  { label: "Practice", labelKey: "nav.practice", to: "/practice", inHeader: true, icon: "target", blurb: "Short sets with AI correction" },
  { label: "Drills", labelKey: "nav.drills", to: "/drills", icon: "sparkles", blurb: "Drill one question type" },
  { label: "Review", labelKey: "nav.review", to: "/review", icon: "repeat", blurb: "Your mistake notebook" },
  { label: "Writing lab", labelKey: "nav.writing", to: "/writing-lab", icon: "pen", blurb: "Essays with AI feedback" },
  { label: "Vocabulary", labelKey: "nav.vocab", to: "/vocabulary", icon: "language", blurb: "Topic words for IELTS" },
  { label: "Mock Test", labelKey: "nav.mock", to: "/mock", inHeader: true, icon: "clipboard", blurb: "Full timed exam" },
  { label: "Learn", labelKey: "nav.learn", to: "/learn", inHeader: true, icon: "book", blurb: "Strategy and format" },
];
