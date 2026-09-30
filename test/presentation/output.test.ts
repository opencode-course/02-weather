import { afterEach, describe, expect, mock, spyOn, test } from "bun:test";
import { printNumberedItems, showError, showInfo, showSuccess } from "../../src/presentation/output";

afterEach(() => mock.restore());

describe("console output", () => {
  test("prints success, error, info, and numbered items", () => {
    const logSpy = spyOn(console, "log").mockImplementation(() => {});
    showSuccess("Saved");
    showError("Failed");
    showInfo("Details");
    printNumberedItems(["First", "Second"]);
    expect(logSpy.mock.calls.map(([message]) => message)).toEqual([
      "  Saved",
      "  Failed",
      "  Details",
      "  1. First",
      "  2. Second",
    ]);
  });
});
