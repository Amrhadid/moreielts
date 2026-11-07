import {
  BarChart3,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Target,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: "/" | "/practice" | "/mock" | "/results" | "/learn";
  icon: LucideIcon;
  blurb: string;
}

/**
 * The one navigation. Desktop renders it as the left rail, phones as the
 * bottom tab bar. Enhance folded into the dashboard as the Focus block.
 */
export const PRIMARY_NAV: NavItem[] = [
  { label: "Today", to: "/", icon: LayoutDashboard, blurb: "Your next step and your band" },
  { label: "Practice", to: "/practice", icon: Target, blurb: "Drill one question type" },
  { label: "Mock test", to: "/mock", icon: ClipboardList, blurb: "Full timed exam" },
  { label: "Results", to: "/results", icon: BarChart3, blurb: "Every attempt" },
  { label: "Learn", to: "/learn", icon: GraduationCap, blurb: "Format and question types" },
];
