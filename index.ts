import { renderMenu } from "./src/menu";
import { loadState } from "./src/storage";
import { ask, closeInput } from "./src/prompts";
import { red } from "./src/colors";
import { menuOptions } from "./src/options";

const state = await loadState();

mainLoop: while (true) {
  console.log(renderMenu(state));
  const option = await ask("  Selecciona una opción: ");

  const selectedOption = menuOptions.find((candidate) => String(candidate.key) === option);
  if (!selectedOption) {
    console.log(red("  Opción inválida."));
    continue;
  }
  if ("exit" in selectedOption) break mainLoop;
  await selectedOption.run(state);

  await ask("\n  Presiona Enter para continuar...");
}

closeInput();
