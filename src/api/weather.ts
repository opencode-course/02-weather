import type { City } from "../types/City";
import type { DailyForecast, Units } from "../types/Weather";
import { FORECAST_DAYS, FORECAST_URL } from "../utils/constants";
import { fetchJson } from "./client";

type CurrentWeatherResponse = { current: { temperature_2m: number } };

type DailyForecastResponse = {
  daily: {
    time: string[];
    temperature_2m_min: number[];
    temperature_2m_max: number[];
  };
};

export async function getTemperature(city: City, units: Units): Promise<number> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current: "temperature_2m",
    temperature_unit: units,
  });
  const data = await fetchJson<CurrentWeatherResponse>(`${FORECAST_URL}?${params}`);
  return data.current.temperature_2m;
}

export async function getDailyForecast(city: City, units: Units): Promise<DailyForecast[]> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    daily: "temperature_2m_min,temperature_2m_max",
    forecast_days: String(FORECAST_DAYS),
    temperature_unit: units,
    timezone: "auto",
  });
  const data = await fetchJson<DailyForecastResponse>(`${FORECAST_URL}?${params}`);

  return data.daily.time.map((date, index) => {
    const min = data.daily.temperature_2m_min[index];
    const max = data.daily.temperature_2m_max[index];
    if (min === undefined || max === undefined) {
      throw new Error("Respuesta incompleta del pronóstico diario");
    }
    return { date, min, max };
  });
}
