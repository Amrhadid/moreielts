import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-xs text-muted sm:flex-row sm:justify-between sm:px-6">
        <p>© 2026 MoreIELTS. Not affiliated with or endorsed by the IELTS partners.</p>
        <nav className="flex gap-5" aria-label="Legal">
          <Link to="/privacy" className="hover:text-ink">Privacy</Link>
          <Link to="/terms" className="hover:text-ink">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}
