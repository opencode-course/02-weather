import type { AppState } from "../types/AppState";
import type { City, GeoLocation } from "../types/City";
import { searchCities } from "../api/geocoding";
import { ask } from "../presentation/input";
import { printNumberedItems, showError, showInfo, showSuccess } from "../presentation/output";
import { withSpinner } from "../presentation/spinner";
import { nextCityId, saveCities } from "../storage/citiesStorage";
import { formatLocation } from "../utils/format";

export async function addCity(state: AppState): Promise<void> {
  const name = await ask("  Nombre de la ciudad: ");
  if (!name) return;

  let locations: GeoLocation[];
  try {
    locations = await withSpinner(`Buscando "${name}"...`, () => searchCities(name));
  } catch {
    showError("No se pudo conectar con la API de geocoding.");
    return;
  }
  if (locations.length === 0) {
    showError(`No se encontró "${name}".`);
    return;
  }

  printNumberedItems(locations.map(formatLocation));
  const selection = await ask("  Número de la ciudad a agregar (0 para cancelar): ");
  if (selection === "0") return;
  if (!/^\d+$/.test(selection)) {
    showError("Opción inválida.");
    return;
  }

  const location = locations[Number(selection) - 1];
  if (!location) {
    showError("Opción inválida.");
    return;
  }

  const isDuplicate = state.cities.some(
    (city) =>
      city.name === location.name &&
      city.admin1 === location.admin1 &&
      city.country === location.country,
  );
  if (isDuplicate) {
    showInfo(`${formatLocation(location)} ya está guardada.`);
    return;
  }

  const city: City = { ...location, id: nextCityId(state.cities) };
  state.cities.push(city);
  state.defaultCityId ??= city.id;
  await saveCities(state.cities, state.defaultCityId);
  showSuccess(`${formatLocation(city)} agregada.`);
}
