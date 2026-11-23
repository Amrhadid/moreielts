import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "~/components/layout/AppShell";
import { BlogText } from "~/components/BlogText";
import { CLUSTERS } from "~/data/blog/plan";
import { POSTS } from "~/data/blog/posts";

const SITE = "https://moreielts.com";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "مدونة MoreIELTS: دليلك لاختبار الآيلتس بالعربية" },
      {
        name: "description",
        content:
          "مقالات عربية عن اختبار الآيلتس: الاستماع والقراءة والكتابة والمحادثة، ودليل الدرجات وخطط المذاكرة والمفردات.",
      },
      { property: "og:title", content: "مدونة MoreIELTS: دليلك لاختبار الآيلتس بالعربية" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/blog` },
      { property: "og:locale", content: "ar_AR" },
    ],
    links: [
      { rel: "canonical", href: `${SITE}/blog` },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <AppShell>
      <div dir="rtl" lang="ar" className="font-[family-name:'IBM_Plex_Sans_Arabic',sans-serif]">
        <h1 className="text-[1.75rem] font-bold leading-tight sm:text-[2.25rem]">مدونة MoreIELTS</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft">
          شروحات عربية لاختبار الآيلتس: استراتيجيات كل مهارة، ونظام الدرجات، وخطط المذاكرة، والمفردات.
        </p>
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {POSTS.map((post) => (
            <li key={post.slug}>
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="-mx-2 block rounded-lg px-2 py-5 hover:bg-surface"
              >
                <p className="text-xs text-muted">
                  {CLUSTERS[post.cluster]} · {post.readMins} دقائق قراءة
                </p>
                <h2 className="mt-1 text-lg font-semibold leading-snug">{post.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted"><BlogText text={post.description} /></p>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-muted">
          تفضّل أيضًا بقراءة <Link to="/guides" className="font-medium text-brand-700 underline underline-offset-4">استراتيجيات أنواع الأسئلة</Link>.
        </p>
      </div>
    </AppShell>
  );
}
