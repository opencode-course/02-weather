export type Units = "celsius" | "fahrenheit";

export type GeoLocation = {
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
};

export type City = GeoLocation & { id: number };

export type DailyForecast = {
  date: string;
  min: number;
  max: number;
};

export type AppState = {
  defaultCityId: number | null;
  cities: City[];
  units: Units;
};

export type MenuLabel = string | ((state: AppState) => string);

export type MenuOption =
  | { key: number; label: MenuLabel; run: (state: AppState) => Promise<void> }
  | { key: number; label: MenuLabel; exit: true };
