import type { Units } from "../types/Weather";
import { readStateFile, updateStateFile } from "./stateFile";

export async function loadUnits(): Promise<Units> {
  const state = await readStateFile();
  return state.units === "fahrenheit" ? "fahrenheit" : "celsius";
}

export async function saveUnits(units: Units): Promise<void> {
  await updateStateFile({ units });
}
