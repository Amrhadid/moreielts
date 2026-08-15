import type { AttemptSummary, UserProfile } from "~/types/result";

// TODO(backend): replace with the signed-in user loaded from the profiles table.
export const mockUser: UserProfile = {
  id: "u-001",
  name: "Amira Haddad",
  email: "amira@example.com",
  initials: "AH",
  targetBand: 7.5,
  estimatedBand: 6.5,
  variant: "academic",
  plan: "free",
  testDate: "2026-10-17",
};

export const mockAttempts: AttemptSummary[] = [
  {
    id: "a-104",
    formTitle: "Academic Mock Test 3",
    mode: "mock",
    section: "full",
    takenAt: "2026-08-11T09:20:00Z",
    overall: 6.5,
    status: "completed",
  },
  {
    id: "a-103",
    formTitle: "Reading — Matching headings drill",
    mode: "practice",
    section: "reading",
    takenAt: "2026-08-09T18:05:00Z",
    overall: 7,
    status: "completed",
  },
  {
    id: "a-102",
    formTitle: "Listening — Part 4 note completion",
    mode: "practice",
    section: "listening",
    takenAt: "2026-08-07T07:40:00Z",
    overall: 6,
    status: "completed",
  },
  {
    id: "a-101",
    formTitle: "Writing — Task 2 opinion essay",
    mode: "practice",
    section: "writing",
    takenAt: "2026-08-04T20:15:00Z",
    overall: 6,
    status: "completed",
  },
];

/** Powers the "continue where you left off" card on the dashboard. */
export const mockInProgress: AttemptSummary = {
  id: "a-105",
  formTitle: "Academic Mock Test 4",
  mode: "mock",
  section: "reading",
  takenAt: "2026-08-14T16:02:00Z",
  status: "in_progress",
  progress: 45,
};

/** Estimated band over the last six weeks, for the dashboard trend strip. */
export const mockBandTrend = [5.5, 5.5, 6, 6, 6.5, 6.5];
