import type { AppState } from "./AppState";

export type MenuLabel = string | ((state: AppState) => string);

export type MenuOption =
  | { key: number; label: MenuLabel; run: (state: AppState) => Promise<void> }
  | { key: number; label: MenuLabel; exit: true };
