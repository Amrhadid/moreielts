import { useEffect, useState } from "react";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("moreielts-theme");
    const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;
    const next = saved ? saved === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("moreielts-theme", next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
      title={`Switch to ${dark ? "light" : "dark"} mode`}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-line bg-surface px-2.5 text-sm text-ink-soft hover:bg-paper hover:text-ink"
    >
      <span aria-hidden>{dark ? "☀" : "☾"}</span>
      {!compact && <span className="hidden sm:inline">{dark ? "Light" : "Dark"}</span>}
    </button>
  );
}
