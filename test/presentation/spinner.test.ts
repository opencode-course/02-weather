import { describe, expect, test } from "bun:test";
import { withSpinner } from "../../src/presentation/spinner";

describe("spinner", () => {
  test("returns the task result", async () => {
    await expect(withSpinner("Working", async () => 7)).resolves.toBe(7);
  });

  test("propagates task failures", async () => {
    await expect(withSpinner("Working", async () => { throw new Error("failure"); })).rejects.toThrow(
      "failure",
    );
  });
});
