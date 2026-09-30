import { describe, expect, test } from "bun:test";
import { DATA_FILE, FORECAST_DAYS, FORECAST_URL, GEOCODING_URL, MENU_WIDTH } from "../../src/utils/constants";

describe("app constants", () => {
  test("points to the OpenMeteo APIs", () => {
    expect(GEOCODING_URL).toBe("https://geocoding-api.open-meteo.com/v1/search");
    expect(FORECAST_URL).toBe("https://api.open-meteo.com/v1/forecast");
  });

  test("defines forecast days, data file and menu width", () => {
    expect(FORECAST_DAYS).toBe(7);
    expect(DATA_FILE).toBe("data.json");
    expect(MENU_WIDTH).toBe(40);
  });
});
