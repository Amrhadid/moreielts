import { describe, expect, it } from "vitest";
import { describeStartupError } from "./player-errors";

describe("describeStartupError", () => {
  it("sends an out-of-order learner to the first unfinished section", () => {
    const r = describeStartupError("section_out_of_order", "writing", "f1", ["listening"]);
    expect(r.action?.to).toBe("/test/reading");
    expect(r.action?.search).toEqual({ form: "f1" });
    expect(r.text).toMatch(/Finish Reading before opening Writing/);
  });

  it("continues past a section that is already submitted", () => {
    const r = describeStartupError("section_already_submitted", "reading", "f1", ["listening", "reading"]);
    expect(r.action?.to).toBe("/test/writing");
  });

  it("points at the results once every section is submitted", () => {
    const r = describeStartupError("section_already_submitted", "speaking", undefined, [
      "listening",
      "reading",
      "writing",
      "speaking",
    ]);
    expect(r.action?.to).toBe("/results");
    expect(r.action?.search).toBeUndefined();
  });

  it("passes unknown errors through", () => {
    const r = describeStartupError("attempt_not_found", "listening", undefined, []);
    expect(r.text).toBe("attempt_not_found");
    expect(r.action).toBeNull();
  });
});
