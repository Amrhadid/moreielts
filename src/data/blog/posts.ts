import type { BlogPost } from "./types";
import { PLAN } from "./plan";

import { POST_BAND_SCORES } from "./posts/ielts-band-scores-explained";

export const POSTS: BlogPost[] = [POST_BAND_SCORES];

export const postBySlug = (slug: string) => POSTS.find((p) => p.slug === slug);

/** Related reading: the post's own picks, topped up from its cluster, published only. */
export function relatedPosts(post: BlogPost, max = 6): BlogPost[] {
  const published = new Map(POSTS.map((p) => [p.slug, p]));
  const order = [
    ...post.related,
    ...PLAN.filter((x) => x.cluster === post.cluster).map((x) => x.slug),
    ...PLAN.map((x) => x.slug),
  ];
  const out: BlogPost[] = [];
  for (const slug of order) {
    const p = published.get(slug);
    if (p && p.slug !== post.slug && !out.includes(p)) out.push(p);
    if (out.length >= max) break;
  }
  return out;
}
