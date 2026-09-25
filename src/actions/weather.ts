import type { AppState, City, Units } from "../types";
import { getDailyForecast, getTemperature } from "../api";
import { formatDay, formatLocation, formatUnits } from "../format";
import { red, yellow } from "../colors";
import { withSpinner } from "../spinner";

async function weatherLine(city: City, units: Units): Promise<string> {
  try {
    const temperature = await getTemperature(city, units);
    return `${formatLocation(city)}: ${yellow(`${temperature} ${formatUnits(units)}`)}`;
  } catch {
    return red(`${formatLocation(city)}: no se pudo obtener el clima`);
  }
}

export async function showDefaultCityWeather(state: AppState): Promise<void> {
  const city = state.cities.find((candidate) => candidate.id === state.defaultCityId);
  if (!city) {
    console.log(red("  No hay ciudad default. Usa la opción 5."));
    return;
  }
  const line = await withSpinner("Consultando el clima...", () => weatherLine(city, state.units));
  console.log(`  ${line}`);
}

export async function showDefaultCityForecast(state: AppState): Promise<void> {
  const city = state.cities.find((candidate) => candidate.id === state.defaultCityId);
  if (!city) {
    console.log(red("  No hay ciudad default. Usa la opción 5."));
    return;
  }

  try {
    const forecast = await withSpinner("Consultando pronóstico...", () =>
      getDailyForecast(city, state.units),
    );
    const unit = formatUnits(state.units);

    console.log(`  Pronóstico para ${formatLocation(city)}:`);
    console.log(`  ${"Día".padEnd(12)} ${"Mín".padStart(8)} ${"Máx".padStart(8)}`);
    forecast.forEach(({ date, min, max }) => {
      const minTemperature = `${min} ${unit}`.padStart(8);
      const maxTemperature = `${max} ${unit}`.padStart(8);
      console.log(
        `  ${formatDay(date).padEnd(12)} ${yellow(minTemperature)} ${yellow(maxTemperature)}`,
      );
    });
  } catch {
    console.log(red(`  No se pudo obtener el pronóstico para ${formatLocation(city)}`));
  }
}

export async function showAllCitiesWeather(state: AppState): Promise<void> {
  if (state.cities.length === 0) {
    console.log(red("  No hay ciudades guardadas. Usa la opción 3."));
    return;
  }
  const lines = await withSpinner("Consultando el clima de todas las ciudades...", () =>
    Promise.all(state.cities.map((city) => weatherLine(city, state.units))),
  );
  lines.forEach((line) => console.log(`  ${line}`));
}
