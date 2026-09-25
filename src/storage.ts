import type { AppState, City } from "./types";

const FILE_PATH = "data.json";

function defaultState(): AppState {
  return { defaultCityId: null, cities: [], units: "celsius" };
}

export function nextCityId(cities: City[]): number {
  return cities.reduce((max, city) => Math.max(max, city.id), 0) + 1;
}

export async function loadState(): Promise<AppState> {
  const file = Bun.file(FILE_PATH);
  if (!(await file.exists())) return defaultState();

  try {
    const raw = (await file.json()) as Partial<AppState>;
    return {
      defaultCityId: raw.defaultCityId ?? null,
      cities: Array.isArray(raw.cities) ? raw.cities : [],
      units: raw.units === "fahrenheit" ? "fahrenheit" : "celsius",
    };
  } catch {
    // data.json corrupto: arrancar desde cero
    return defaultState();
  }
}

export async function saveState(state: AppState): Promise<void> {
  await Bun.write(FILE_PATH, JSON.stringify(state, null, 2));
}
