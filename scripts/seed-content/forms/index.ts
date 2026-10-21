import type { SeedForm } from "../../../src/types/content";
import { academic1 } from "./academic-1";

/**
 * Every authored form, in catalogue order. Add a form by creating a folder
 * next to academic-1 and listing its export here; `npm run seed:validate`
 * checks it and `npm run seed:generate` writes it into supabase/seed.sql.
 */
export const FORMS: SeedForm[] = [academic1];
