import type { AppState } from "../types";
import { formatUnits } from "../format";
import { saveState } from "../storage";
import { green } from "../colors";

export async function toggleUnits(state: AppState): Promise<void> {
  state.units = state.units === "celsius" ? "fahrenheit" : "celsius";
  await saveState(state);
  console.log(green(`  Unidades: ${formatUnits(state.units)}`));
}
