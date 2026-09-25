import type { City } from "./City";
import type { Units } from "./Weather";

export type AppState = {
  defaultCityId: number | null;
  cities: City[];
  units: Units;
};
