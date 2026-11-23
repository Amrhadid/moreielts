import type { Cluster } from "./plan";

/** Inline links use [text](/path) inside any string. */
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  cluster: Cluster;
  /** ISO date. */
  date: string;
  readMins: number;
  intro: string;
  sections: { h: string; p?: string[]; ul?: string[]; ol?: string[] }[];
  faq: { q: string; a: string }[];
  /** Plan slugs to link as related reading. Unpublished ones are hidden. */
  related: string[];
}
