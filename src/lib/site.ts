/**
 * Which site this build is. MoreIELTS (moreielts.com) and MoreTOEFL
 * (moretoefl.com) share one Supabase project and one `profiles` table;
 * `profiles.sites` records which site(s) an account has signed in to, so each
 * admin dashboard filters on its own value (migration 0007_profile_sites).
 */
export type Site = "toefl" | "ielts";

export const SITE: Site = "ielts";
