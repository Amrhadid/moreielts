export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-8 text-xs text-muted sm:flex-row sm:justify-between sm:px-6">
        <p>© 2026 MoreIELTS. Not affiliated with or endorsed by the IELTS partners.</p>
        <nav className="flex gap-5">
          <a href="#" className="hover:text-ink">About</a>
          <a href="#" className="hover:text-ink">Privacy</a>
          <a href="#" className="hover:text-ink">Terms</a>
        </nav>
      </div>
    </footer>
  );
}
