import type { AppState } from "../types/AppState";
import { showSuccess } from "../presentation/output";
import { saveUnits } from "../storage/settingsStorage";
import { formatUnits } from "../utils/format";

export async function toggleUnits(state: AppState): Promise<void> {
  state.units = state.units === "celsius" ? "fahrenheit" : "celsius";
  await saveUnits(state.units);
  showSuccess(`Unidades: ${formatUnits(state.units)}`);
}
