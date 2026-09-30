import { afterEach, describe, expect, mock, spyOn, test } from "bun:test";
import { getDailyForecast, getTemperature } from "../../src/api/weather";
import { city } from "../helpers/fixtures";

afterEach(() => {
  mock.restore();
});

describe("weather API", () => {
  test("requests current temperature in the selected units", async () => {
    const fetchSpy = spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json({ current: { temperature_2m: 18.5 } }),
    );
    expect(await getTemperature(city, "fahrenheit")).toBe(18.5);
    const requestUrl = new URL(String(fetchSpy.mock.calls[0]?.[0]));
    expect(requestUrl.searchParams.get("latitude")).toBe(String(city.latitude));
    expect(requestUrl.searchParams.get("longitude")).toBe(String(city.longitude));
    expect(requestUrl.searchParams.get("temperature_unit")).toBe("fahrenheit");
  });

  test("maps daily minimum and maximum temperatures", async () => {
    spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json({ daily: { time: ["2024-01-01"], temperature_2m_min: [10], temperature_2m_max: [20] } }),
    );
    expect(await getDailyForecast(city, "celsius")).toEqual([
      { date: "2024-01-01", min: 10, max: 20 },
    ]);
  });

  test("requests seven forecast days and rejects incomplete data", async () => {
    const fetchSpy = spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json({ daily: { time: ["2024-01-01"], temperature_2m_min: [], temperature_2m_max: [20] } }),
    );
    await expect(getDailyForecast(city, "celsius")).rejects.toThrow(
      "Respuesta incompleta del pronóstico diario",
    );
    const requestUrl = new URL(String(fetchSpy.mock.calls[0]?.[0]));
    expect(requestUrl.searchParams.get("forecast_days")).toBe("7");
    expect(requestUrl.searchParams.get("timezone")).toBe("auto");
  });
});
