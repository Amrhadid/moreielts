import type { BlogPost } from "./types";
import type { Cluster } from "./plan";

export const b = (slug: string, text: string) => `[${text}](/blog/${slug})`;
export const g = (slug: string, text: string) => `[${text}](/guides/${slug})`;
export const PRICING = "[الباقات والأسعار](/pricing)";

type Sec = BlogPost["sections"][number];

/** Builds a post and appends the standard MoreIELTS section (paid product, pricing link). */
export function mk(
  slug: string,
  cluster: Cluster,
  title: string,
  description: string,
  readMins: number,
  intro: string,
  sections: Sec[],
  faq: BlogPost["faq"],
  related: string[],
  ctaLine: string,
): BlogPost {
  return {
    slug,
    title,
    description,
    cluster,
    date: "2026-11-24",
    readMins,
    intro,
    sections: [
      ...sections,
      {
        h: "كيف تساعدك MoreIELTS",
        p: [`${ctaLine} MoreIELTS منصة مدفوعة، وتجد تفاصيلها في صفحة ${PRICING}. الدرجات داخل المنصة تقديرية وليست نتيجة رسمية.`],
      },
    ],
    faq,
    related,
  };
}
