import type { AppState } from "../types/AppState";
import { showSuccess } from "../presentation/output";
import { saveCities } from "../storage/citiesStorage";
import { selectCity } from "./listCities";

export async function setDefaultCity(state: AppState): Promise<void> {
  const city = await selectCity(state, "Número de la ciudad default: ");
  if (!city) return;

  state.defaultCityId = city.id;
  await saveCities(state.cities, state.defaultCityId);
  showSuccess(`Ciudad default: ${city.name}.`);
}
