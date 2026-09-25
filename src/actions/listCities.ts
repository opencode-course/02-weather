import type { AppState } from "../types/AppState";
import type { City } from "../types/City";
import { ask } from "../presentation/input";
import { printNumberedItems, showError } from "../presentation/output";
import { formatLocation } from "../utils/format";

export function printCities(state: AppState): void {
  printNumberedItems(
    state.cities.map((city) => {
      const isDefault = city.id === state.defaultCityId ? " (default)" : "";
      return `${formatLocation(city)}${isDefault}`;
    }),
  );
}

export async function selectCity(state: AppState, prompt: string): Promise<City | null> {
  if (state.cities.length === 0) {
    showError("No hay ciudades guardadas. Usa la opción 3.");
    return null;
  }

  printCities(state);
  const selection = await ask(`  ${prompt}`);
  if (!/^\d+$/.test(selection)) {
    showError("Opción inválida.");
    return null;
  }

  const city = state.cities[Number(selection) - 1];
  if (!city) {
    showError("Opción inválida.");
    return null;
  }
  return city;
}
