export interface NavItem {
  label: string;
  to: string;
  /** Emoji stand-in. TODO(design): swap for the icon set once chosen. */
  icon: string;
  blurb: string;
}

export const PRIMARY_NAV: NavItem[] = [
  { label: "My Tests", to: "/", icon: "🏠", blurb: "Dashboard and progress" },
  { label: "Practice", to: "/practice", icon: "🎯", blurb: "Drill one question type" },
  { label: "Mock Test", to: "/mock", icon: "📝", blurb: "Full timed exam" },
  { label: "Learn", to: "/learn", icon: "📖", blurb: "Strategy and format" },
  { label: "Enhance", to: "/enhance", icon: "✨", blurb: "Targeted improvement" },
];
