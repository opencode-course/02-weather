import type { GeoLocation } from "../types/City";
import { GEOCODING_URL } from "../utils/constants";
import { fetchJson } from "./client";

type GeocodingResponse = { results?: GeoLocation[] };

export async function searchCities(name: string): Promise<GeoLocation[]> {
  const params = new URLSearchParams({ name, count: "5", language: "es", format: "json" });
  const data = await fetchJson<GeocodingResponse>(`${GEOCODING_URL}?${params}`);
  return (data.results ?? []).map(({ name, admin1, country, latitude, longitude }) => ({
    name,
    admin1,
    country,
    latitude,
    longitude,
  }));
}
