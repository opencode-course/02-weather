import type { AppState } from "./types";
import { cyan } from "./colors";
import { getMenuLabel, menuOptions } from "./options";

const LINE = "═".repeat(40);

export function renderMenu(state: AppState): string {
  return [
    cyan(LINE),
    cyan("         WEATHER CLI"),
    cyan(LINE),
    ...menuOptions.map((option) => `  ${option.key}. ${getMenuLabel(option, state)}`),
    cyan(LINE),
  ].join("\n");
}
