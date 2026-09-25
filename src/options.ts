import type { AppState, MenuOption } from "./types";
import {
  removeCity,
  searchAndAddCity,
  setDefaultCity,
} from "./actions/cities";
import {
  showAllCitiesWeather,
  showDefaultCityForecast,
  showDefaultCityWeather,
} from "./actions/weather";
import { toggleUnits } from "./actions/settings";
import { formatUnits } from "./format";

export const menuOptions: MenuOption[] = [
  { key: 1, label: "Clima de ciudad default", run: showDefaultCityWeather },
  {
    key: 2,
    label: (state) => `Clima de todas las ciudades (${state.cities.length})`,
    run: showAllCitiesWeather,
  },
  { key: 3, label: "Buscar y agregar ciudad", run: searchAndAddCity },
  { key: 4, label: "Eliminar ciudad", run: removeCity },
  { key: 5, label: "Establecer ciudad default", run: setDefaultCity },
  { key: 6, label: "Pronóstico 7 días (ciudad default)", run: showDefaultCityForecast },
  {
    key: 8,
    label: (state) => `Ajustes (${formatUnits(state.units)})`,
    run: toggleUnits,
  },
  { key: 9, label: "Salir", exit: true },
];

export function getMenuLabel(option: MenuOption, state: AppState): string {
  return typeof option.label === "function" ? option.label(state) : option.label;
}
