import type { AppState, City, GeoLocation } from "../types";
import { searchCities } from "../api";
import { formatLocation } from "../format";
import { nextCityId, saveState } from "../storage";
import { ask } from "../prompts";
import { green, red } from "../colors";
import { withSpinner } from "../spinner";

function listCities(state: AppState): void {
  state.cities.forEach((city, index) => {
    const isDefault = city.id === state.defaultCityId ? " (default)" : "";
    console.log(`  ${index + 1}. ${formatLocation(city)}${isDefault}`);
  });
}

async function selectCity(state: AppState, prompt: string): Promise<City | null> {
  if (state.cities.length === 0) {
    console.log(red("  No hay ciudades guardadas. Usa la opción 3."));
    return null;
  }
  listCities(state);
  const city = state.cities[Number(await ask(`  ${prompt}`)) - 1];
  if (!city) {
    console.log(red("  Opción inválida."));
    return null;
  }
  return city;
}

export async function searchAndAddCity(state: AppState): Promise<void> {
  const name = await ask("  Nombre de la ciudad: ");
  if (!name) return;

  let locations: GeoLocation[];
  try {
    locations = await withSpinner(`Buscando "${name}"...`, () => searchCities(name));
  } catch {
    console.log(red("  No se pudo conectar con la API de geocoding."));
    return;
  }
  if (locations.length === 0) {
    console.log(red(`  No se encontró "${name}".`));
    return;
  }

  locations.forEach((location, index) => {
    console.log(`  ${index + 1}. ${formatLocation(location)}`);
  });

  const selection = (await ask("  Número de la ciudad a agregar (0 para cancelar): ")).trim();
  if (selection === "0") return;

  const selectedIndex = Number(selection) - 1;
  if (!/^\d+$/.test(selection) || selectedIndex < 0 || selectedIndex >= locations.length) {
    console.log(red("  Opción inválida."));
    return;
  }

  const location = locations[selectedIndex];
  if (!location) {
    console.log(red("  Opción inválida."));
    return;
  }

  const isDuplicate = state.cities.some(
    (city) =>
      city.name === location.name &&
      city.admin1 === location.admin1 &&
      city.country === location.country,
  );
  if (isDuplicate) {
    console.log(`  ${formatLocation(location)} ya está guardada.`);
    return;
  }

  const city: City = { ...location, id: nextCityId(state.cities) };
  state.cities.push(city);
  state.defaultCityId ??= city.id;
  await saveState(state);
  console.log(green(`  ${formatLocation(city)} agregada.`));
}

export async function removeCity(state: AppState): Promise<void> {
  const city = await selectCity(state, "Número de la ciudad a eliminar: ");
  if (!city) return;
  state.cities = state.cities.filter((candidate) => candidate.id !== city.id);
  if (state.defaultCityId === city.id) state.defaultCityId = null;
  await saveState(state);
  console.log(green(`  ${city.name} eliminada.`));
}

export async function setDefaultCity(state: AppState): Promise<void> {
  const city = await selectCity(state, "Número de la ciudad default: ");
  if (!city) return;
  state.defaultCityId = city.id;
  await saveState(state);
  console.log(green(`  Ciudad default: ${city.name}.`));
}
