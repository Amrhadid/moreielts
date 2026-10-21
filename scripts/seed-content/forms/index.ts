import type { SeedForm } from "../../../src/types/content";
import { academic1 } from "./academic-1";
import { academic2 } from "./academic-2";
import { academic3 } from "./academic-3";
import { academic4 } from "./academic-4";
import { general1 } from "./general-1";
import { general2 } from "./general-2";

/**
 * Every authored form, in catalogue order. Add a form by creating a folder
 * next to academic-1 and listing its export here; `npm run seed:validate`
 * checks it and `npm run seed:generate` writes it into supabase/seed.sql.
 */
export const FORMS: SeedForm[] = [academic1, academic2, academic3, academic4, general1, general2];
