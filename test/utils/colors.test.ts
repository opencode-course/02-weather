import { describe, expect, test } from "bun:test";
import { cyan, green, red, yellow } from "../../src/utils/colors";

describe("terminal colors", () => {
  test("returns plain text when NO_COLOR is enabled", () => {
    for (const color of [cyan, green, red, yellow]) {
      expect(color("message")).toBe("message");
    }
  });
});
