import type { AppState } from "../types/AppState";
import type { City } from "../types/City";
import type { Units } from "../types/Weather";
import { getTemperature } from "../api/weather";
import { showError } from "../presentation/output";
import { withSpinner } from "../presentation/spinner";
import { red, yellow } from "../utils/colors";
import { formatLocation, formatUnits } from "../utils/format";

export async function getWeatherLine(city: City, units: Units): Promise<string> {
  try {
    const temperature = await getTemperature(city, units);
    return `${formatLocation(city)}: ${yellow(`${temperature} ${formatUnits(units)}`)}`;
  } catch {
    return red(`${formatLocation(city)}: no se pudo obtener el clima`);
  }
}

export async function getWeather(state: AppState): Promise<void> {
  const city = state.cities.find((candidate) => candidate.id === state.defaultCityId);
  if (!city) {
    showError("No hay ciudad default. Usa la opción 5.");
    return;
  }

  const line = await withSpinner("Consultando el clima...", () =>
    getWeatherLine(city, state.units),
  );
  console.log(`  ${line}`);
}
