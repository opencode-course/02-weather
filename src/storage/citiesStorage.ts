import type { City } from "../types/City";
import { readStateFile, updateStateFile } from "./stateFile";

export type SavedCities = { cities: City[]; defaultCityId: number | null };

export async function loadCities(): Promise<SavedCities> {
  const state = await readStateFile();
  return {
    cities: Array.isArray(state.cities) ? state.cities : [],
    defaultCityId: typeof state.defaultCityId === "number" ? state.defaultCityId : null,
  };
}

export async function saveCities(cities: City[], defaultCityId: number | null): Promise<void> {
  await updateStateFile({ cities, defaultCityId });
}

export function nextCityId(cities: City[]): number {
  return cities.reduce((max, city) => Math.max(max, city.id), 0) + 1;
}
