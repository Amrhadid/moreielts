import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "~/components/layout/AppShell";
import { BlogText, plain } from "~/components/BlogText";
import { WhatsAppIcon } from "~/components/WhatsApp";
import { CLUSTERS } from "~/data/blog/plan";
import { postBySlug, relatedPosts } from "~/data/blog/posts";
import { whatsappLink } from "~/lib/whatsapp";

const SITE = "https://moreielts.com";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = postBySlug(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData: post }) => {
    if (!post) return {};
    const url = `${SITE}/blog/${post.slug}`;
    const article = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.description,
      inLanguage: "ar",
      datePublished: post.date,
      dateModified: post.date,
      mainEntityOfPage: url,
      author: { "@type": "Person", name: "عمرو حديد", alternateName: "Sir Amr Hadid" },
      publisher: { "@type": "Organization", name: "MoreIELTS", url: SITE },
    };
    const faq = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: plain(f.a) },
      })),
    };
    return {
      meta: [
        { title: `${post.title} | MoreIELTS` },
        { name: "description", content: post.description },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:locale", content: "ar_AR" },
      ],
      links: [
        { rel: "canonical", href: url },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap",
        },
      ],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(article) },
        { type: "application/ld+json", children: JSON.stringify(faq) },
      ],
    };
  },
  component: BlogArticle,
});

function BlogArticle() {
  const post = Route.useLoaderData();
  const related = relatedPosts(post);
  const wa = whatsappLink(`مرحبًا، قرأت مقال "${post.title}" وأريد الاستفسار عن MoreIELTS`);

  return (
    <AppShell>
      <div dir="rtl" lang="ar" className="font-[family-name:'IBM_Plex_Sans_Arabic',sans-serif]">
        <nav className="text-sm text-muted" aria-label="مسار التنقل">
          <Link to="/blog" className="hover:text-ink">المدونة</Link> / <span className="text-ink">{CLUSTERS[post.cluster]}</span>
        </nav>
        <div className="mt-6 grid gap-10 lg:grid-cols-[2fr_1fr] lg:gap-12">
          <article>
            <p className="text-xs text-muted">{post.readMins} دقائق قراءة · بقلم عمرو حديد</p>
            <h1 className="mt-2 text-[1.75rem] font-bold leading-tight sm:text-[2.25rem]">{post.title}</h1>
            <p className="mt-4 text-base leading-8 text-ink-soft"><BlogText text={post.intro} /></p>

            {post.sections.map((s) => (
              <section key={s.h} className="mt-10">
                <h2 className="text-xl font-semibold tracking-tight">{s.h}</h2>
                {s.p?.map((t) => (
                  <p key={t} className="mt-3 text-base leading-8 text-ink-soft"><BlogText text={t} /></p>
                ))}
                {s.ul && (
                  <ul className="mt-3 grid list-disc gap-2 ps-6 text-base leading-8 text-ink-soft">
                    {s.ul.map((t) => <li key={t}><BlogText text={t} /></li>)}
                  </ul>
                )}
                {s.ol && (
                  <ol className="mt-3 grid list-decimal gap-2 ps-6 text-base leading-8 text-ink-soft">
                    {s.ol.map((t) => <li key={t}><BlogText text={t} /></li>)}
                  </ol>
                )}
              </section>
            ))}

            <section className="mt-12">
              <h2 className="text-xl font-semibold tracking-tight">أسئلة شائعة</h2>
              <dl className="mt-3 divide-y divide-line border-y border-line">
                {post.faq.map((f) => (
                  <div key={f.q} className="py-4">
                    <dt className="font-semibold">{f.q}</dt>
                    <dd className="mt-1 text-base leading-8 text-ink-soft"><BlogText text={f.a} /></dd>
                  </div>
                ))}
              </dl>
            </section>

            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 flex items-center justify-between gap-4 rounded-card border border-line bg-surface p-5 hover:border-[#25D366]"
            >
              <span>
                <span className="block font-semibold">عندك سؤال عن MoreIELTS؟</span>
                <span className="mt-1 block text-sm text-muted">تحدث مع خدمة العملاء على واتساب</span>
              </span>
              <span className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-semibold text-white">
                <WhatsAppIcon className="h-5 w-5" />
                واتساب
              </span>
            </a>

            <section className="mt-12 rounded-card border border-line p-5">
              <h2 className="text-lg font-semibold">من هو عمرو حديد؟</h2>
              <ul className="mt-3 grid list-disc gap-1.5 ps-6 text-sm leading-7 text-ink-soft">
                <li>مدرس لغة إنجليزية متخصص في الإنجليزية للوظائف والاختبارات الدولية.</li>
                <li>أكثر من 600 ألف متابع على إنستجرام ويوتيوب وتيك توك.</li>
                <li>مؤلف كتابي Speak Professional English وModern Business English.</li>
                <li>مؤسس MoreIELTS وMoreTOEFL وEnglishX50 وLocrativ.</li>
              </ul>
            </section>
          </article>

          <aside className="grid content-start gap-6">
            <div className="rounded-card border border-line bg-surface p-5">
              <p className="font-semibold">تدرّب على اختبار حقيقي الشكل</p>
              <p className="mt-1 text-sm leading-7 text-muted">
                MoreIELTS منصة مدفوعة: اختبارات تجريبية كاملة، تدريبات لكل نوع سؤال، تصحيح للكتابة، وتقييم للمحادثة.
              </p>
              <Link
                to="/pricing"
                className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-brand-600 text-sm font-medium text-white hover:bg-brand-700"
              >
                اطّلع على الباقات
              </Link>
            </div>
            {related.length > 0 && (
              <div>
                <p className="text-sm font-semibold">اقرأ أيضًا</p>
                <ul className="mt-2 divide-y divide-line border-y border-line">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link to="/blog/$slug" params={{ slug: r.slug }} className="block py-2.5 text-sm font-medium hover:text-brand-700">
                        {r.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <p className="text-sm font-semibold">استراتيجيات أنواع الأسئلة</p>
              <ul className="mt-2 divide-y divide-line border-y border-line text-sm font-medium">
                <li><Link to="/guides/$slug" params={{ slug: "true-false-not-given" }} className="block py-2.5 hover:text-brand-700">True / False / Not Given</Link></li>
                <li><Link to="/guides/$slug" params={{ slug: "matching-headings" }} className="block py-2.5 hover:text-brand-700">Matching Headings</Link></li>
                <li><Link to="/guides" className="block py-2.5 hover:text-brand-700">كل الاستراتيجيات</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
