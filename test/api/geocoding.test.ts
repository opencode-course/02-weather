import { afterEach, describe, expect, mock, spyOn, test } from "bun:test";
import { searchCities } from "../../src/api/geocoding";
import { location } from "../helpers/fixtures";

afterEach(() => {
  mock.restore();
});

describe("city geocoding", () => {
  test("requests Spanish results and maps the returned locations", async () => {
    const fetchSpy = spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ results: [location] }));
    expect(await searchCities("Bogotá")).toEqual([location]);
    const requestUrl = new URL(String(fetchSpy.mock.calls[0]?.[0]));
    expect(requestUrl.origin).toBe("https://geocoding-api.open-meteo.com");
    expect(requestUrl.searchParams.get("name")).toBe("Bogotá");
    expect(requestUrl.searchParams.get("count")).toBe("5");
    expect(requestUrl.searchParams.get("language")).toBe("es");
  });

  test("returns an empty list when the API has no results", async () => {
    spyOn(globalThis, "fetch").mockResolvedValue(Response.json({}));
    expect(await searchCities("Unknown")).toEqual([]);
  });
});
