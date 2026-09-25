import type { City, DailyForecast, GeoLocation, Units } from "./types";

type GeocodingResponse = { results?: GeoLocation[] };

type ForecastResponse = {
  current: {
    temperature_2m: number;
  };
};

type DailyForecastResponse = {
  daily: {
    time: string[];
    temperature_2m_min: number[];
    temperature_2m_max: number[];
  };
};

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export async function searchCities(name: string): Promise<GeoLocation[]> {
  const params = new URLSearchParams({
    name,
    count: "5",
    language: "es",
    format: "json",
  });
  const data = (await fetchJson(`${GEOCODING_URL}?${params}`)) as GeocodingResponse;
  return (data.results ?? []).map((result) => ({
    name: result.name,
    admin1: result.admin1,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude,
  }));
}

export async function getTemperature(city: City, units: Units): Promise<number> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current: "temperature_2m",
    temperature_unit: units,
  });
  const data = (await fetchJson(`${FORECAST_URL}?${params}`)) as ForecastResponse;
  return data.current.temperature_2m;
}

export async function getDailyForecast(city: City, units: Units): Promise<DailyForecast[]> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    daily: "temperature_2m_min,temperature_2m_max",
    forecast_days: "7",
    temperature_unit: units,
    timezone: "auto",
  });
  const data = (await fetchJson(`${FORECAST_URL}?${params}`)) as DailyForecastResponse;

  return data.daily.time.map((date, index) => {
    const min = data.daily.temperature_2m_min[index];
    const max = data.daily.temperature_2m_max[index];
    if (min === undefined || max === undefined) {
      throw new Error("Respuesta incompleta del pronóstico diario");
    }
    return { date, min, max };
  });
}
