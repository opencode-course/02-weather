import type { AppState } from "../../src/types/AppState";
import type { City, GeoLocation } from "../../src/types/City";

export const location: GeoLocation = {
  name: "Bogotá",
  admin1: "Bogotá D.C.",
  country: "Colombia",
  latitude: 4.711,
  longitude: -74.0721,
};

export const city: City = { ...location, id: 1 };

export function createState(overrides: Partial<AppState> = {}): AppState {
  return {
    cities: [city],
    defaultCityId: city.id,
    units: "celsius",
    ...overrides,
  };
}
