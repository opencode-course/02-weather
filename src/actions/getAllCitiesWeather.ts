import type { AppState } from "../types/AppState";
import { getWeatherLine } from "./getWeather";
import { showError } from "../presentation/output";
import { withSpinner } from "../presentation/spinner";

export async function getAllCitiesWeather(state: AppState): Promise<void> {
  if (state.cities.length === 0) {
    showError("No hay ciudades guardadas. Usa la opción 3.");
    return;
  }

  const lines = await withSpinner("Consultando el clima de todas las ciudades...", () =>
    Promise.all(state.cities.map((city) => getWeatherLine(city, state.units))),
  );
  lines.forEach((line) => console.log(`  ${line}`));
}
