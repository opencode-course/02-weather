import type { AppState } from "../types/AppState";
import type { MenuOption } from "../types/MenuOption";
import { addCity } from "../actions/addCity";
import { getAllCitiesWeather } from "../actions/getAllCitiesWeather";
import { getForecast } from "../actions/getForecast";
import { getWeather } from "../actions/getWeather";
import { removeCity } from "../actions/removeCity";
import { setDefaultCity } from "../actions/setDefaultCity";
import { toggleUnits } from "../actions/toggleUnits";
import { MENU_WIDTH } from "../utils/constants";
import { cyan } from "../utils/colors";
import { formatUnits } from "../utils/format";

export const menuOptions: MenuOption[] = [
  { key: 1, label: "Clima de ciudad default", run: getWeather },
  {
    key: 2,
    label: (state) => `Clima de todas las ciudades (${state.cities.length})`,
    run: getAllCitiesWeather,
  },
  { key: 3, label: "Buscar y agregar ciudad", run: addCity },
  { key: 4, label: "Eliminar ciudad", run: removeCity },
  { key: 5, label: "Establecer ciudad default", run: setDefaultCity },
  { key: 6, label: "Pronóstico 7 días", run: getForecast },
  {
    key: 8,
    label: (state) => `Ajustes (${formatUnits(state.units)})`,
    run: toggleUnits,
  },
  { key: 9, label: "Salir", exit: true },
];

const LINE = "═".repeat(MENU_WIDTH);

export function renderMenu(state: AppState): string {
  return [
    cyan(LINE),
    cyan("         WEATHER CLI"),
    cyan(LINE),
    ...menuOptions.map((option) => `  ${option.key}. ${getMenuLabel(option, state)}`),
    cyan(LINE),
  ].join("\n");
}

export function getMenuLabel(option: MenuOption, state: AppState): string {
  return typeof option.label === "function" ? option.label(state) : option.label;
}
