import { describe, expect, test } from "bun:test";
import { getMenuLabel, menuOptions, renderMenu } from "../../src/presentation/menu";
import { createState } from "../helpers/fixtures";

describe("menu presentation", () => {
  test("renders available options and current settings", () => {
    const output = renderMenu(createState());
    expect(output).toContain("WEATHER CLI");
    expect(output).toContain("1. Clima de ciudad default");
    expect(output).toContain("2. Clima de todas las ciudades (1)");
    expect(output).toContain("8. Ajustes (°C)");
    expect(output).toContain("9. Salir");
  });

  test("renders labels from the current app state", () => {
    expect(getMenuLabel(menuOptions[1]!, createState({ cities: [] }))).toBe(
      "Clima de todas las ciudades (0)",
    );
  });
});
