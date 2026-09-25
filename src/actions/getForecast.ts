import type { AppState } from "../types/AppState";
import { getDailyForecast } from "../api/weather";
import { showError, showInfo } from "../presentation/output";
import { withSpinner } from "../presentation/spinner";
import { yellow } from "../utils/colors";
import { formatDay, formatLocation, formatUnits } from "../utils/format";
import { selectCity } from "./listCities";

export async function getForecast(state: AppState): Promise<void> {
  const city = await selectCity(state, "Número de la ciudad para el pronóstico: ");
  if (!city) return;

  try {
    const forecast = await withSpinner("Consultando pronóstico...", () =>
      getDailyForecast(city, state.units),
    );
    const unit = formatUnits(state.units);

    showInfo(`Pronóstico para ${formatLocation(city)}:`);
    console.log(`  ${"Día".padEnd(12)} ${"Mín".padStart(8)} ${"Máx".padStart(8)}`);
    forecast.forEach(({ date, min, max }) => {
      const minTemperature = `${min} ${unit}`.padStart(8);
      const maxTemperature = `${max} ${unit}`.padStart(8);
      console.log(
        `  ${formatDay(date).padEnd(12)} ${yellow(minTemperature)} ${yellow(maxTemperature)}`,
      );
    });
  } catch {
    showError(`No se pudo obtener el pronóstico para ${formatLocation(city)}`);
  }
}
