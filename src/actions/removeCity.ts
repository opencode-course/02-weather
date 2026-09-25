import type { AppState } from "../types/AppState";
import { showSuccess } from "../presentation/output";
import { saveCities } from "../storage/citiesStorage";
import { selectCity } from "./listCities";

export async function removeCity(state: AppState): Promise<void> {
  const city = await selectCity(state, "Número de la ciudad a eliminar: ");
  if (!city) return;

  state.cities = state.cities.filter((candidate) => candidate.id !== city.id);
  if (state.defaultCityId === city.id) state.defaultCityId = null;
  await saveCities(state.cities, state.defaultCityId);
  showSuccess(`${city.name} eliminada.`);
}
