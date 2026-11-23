import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

/** Renders a string with [text](url) links. Internal paths use the router. */
export function BlogText({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  const cls = "font-medium text-brand-700 underline decoration-brand-200 underline-offset-4 hover:decoration-brand-600";
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const [, label, href] = m;
    out.push(
      href.startsWith("/") ? (
        <Link key={i++} to={href as "/"} className={cls}>{label}</Link>
      ) : (
        <a key={i++} href={href} target="_blank" rel="noopener noreferrer" className={cls}>{label}</a>
      ),
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

/** Strips link markup for meta tags and JSON-LD. */
export const plain = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
