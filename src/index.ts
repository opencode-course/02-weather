import type { AppState } from "./types/AppState";
import { loadCities } from "./storage/citiesStorage";
import { loadUnits } from "./storage/settingsStorage";
import { ask, closeInput } from "./presentation/input";
import { renderMenu, menuOptions } from "./presentation/menu";
import { showError } from "./presentation/output";

const [savedCities, units] = await Promise.all([loadCities(), loadUnits()]);
const state: AppState = { ...savedCities, units };

mainLoop: while (true) {
  console.log(renderMenu(state));
  const option = await ask("  Selecciona una opción: ");

  const selectedOption = menuOptions.find((candidate) => String(candidate.key) === option);
  if (!selectedOption) {
    showError("Opción inválida.");
    continue;
  }
  if ("exit" in selectedOption) break mainLoop;
  await selectedOption.run(state);

  await ask("\n  Presiona Enter para continuar...");
}

closeInput();
