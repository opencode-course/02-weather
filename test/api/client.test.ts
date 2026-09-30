import { afterEach, describe, expect, mock, spyOn, test } from "bun:test";
import { fetchJson } from "../../src/api/client";

afterEach(() => {
  mock.restore();
});

describe("fetchJson", () => {
  test("returns the decoded JSON response", async () => {
    spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ value: 42 }));
    await expect(fetchJson<{ value: number }>("https://example.test")).resolves.toEqual({ value: 42 });
  });

  test("throws an error containing the HTTP status", async () => {
    spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 503 }));
    await expect(fetchJson("https://example.test")).rejects.toThrow("HTTP 503");
  });
});
