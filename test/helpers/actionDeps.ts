import { spyOn } from "bun:test";
import type { GeoLocation } from "../../src/types/City";
import type { DailyForecast } from "../../src/types/Weather";
import * as geocoding from "../../src/api/geocoding";
import * as input from "../../src/presentation/input";
import * as weather from "../../src/api/weather";
import { location } from "./fixtures";

export type ActionDeps = {
  answers: string[];
  searchResults: GeoLocation[];
  searchError: Error | null;
  temperature: number;
  temperatureError: Error | null;
  forecast: DailyForecast[];
};

export function defaultActionDeps(): ActionDeps {
  return {
    answers: [],
    searchResults: [location],
    searchError: null,
    temperature: 16,
    temperatureError: null,
    forecast: [{ date: "2024-01-01", min: 8, max: 18 }],
  };
}

export function resetActionDeps(deps: ActionDeps): void {
  Object.assign(deps, defaultActionDeps());
}

// Parcha los módulos externos de las acciones con espías que leen de `deps`.
export function spyOnActionModules(deps: ActionDeps): void {
  spyOn(input, "ask").mockImplementation(async () => deps.answers.shift() ?? "");
  spyOn(geocoding, "searchCities").mockImplementation(async () => {
    if (deps.searchError) throw deps.searchError;
    return deps.searchResults;
  });
  spyOn(weather, "getTemperature").mockImplementation(async () => {
    if (deps.temperatureError) throw deps.temperatureError;
    return deps.temperature;
  });
  spyOn(weather, "getDailyForecast").mockImplementation(async () => deps.forecast);
}
