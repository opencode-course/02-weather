import type { AppState } from "../types/AppState";
import { DATA_FILE } from "../utils/constants";

export async function readStateFile(): Promise<Partial<AppState>> {
  const file = Bun.file(DATA_FILE);
  if (!(await file.exists())) return {};

  try {
    const data: unknown = await file.json();
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
    return data as Partial<AppState>;
  } catch {
    return {};
  }
}

export async function updateStateFile(update: Partial<AppState>): Promise<void> {
  const currentState = await readStateFile();
  await Bun.write(DATA_FILE, JSON.stringify({ ...currentState, ...update }, null, 2));
}
