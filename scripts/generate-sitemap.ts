/**
 * Writes public/sitemap.xml from the public routes and the strategy guides.
 * Run after adding a guide: `npm run sitemap`.
 */
import { writeFileSync } from "node:fs";
import { QUESTION_GUIDES } from "../src/data/question-guides";
import { POSTS } from "../src/data/blog/posts";

const SITE = (process.env.SITE_URL ?? "https://moreielts.com").replace(/\/$/, "");
const paths = ["/", "/learn", "/guides", "/pricing", "/blog", ...POSTS.map((p) => `/blog/${p.slug}`), ...QUESTION_GUIDES.map((g) => `/guides/${g.slug}`)];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...paths.map((p) => `  <url><loc>${SITE}${p}</loc></url>`),
  "</urlset>",
  "",
].join("\n");

writeFileSync("public/sitemap.xml", xml);
console.log(`Wrote public/sitemap.xml (${paths.length} urls)`);
