import { describe, expect, test } from "bun:test";
import { printCities, selectCity } from "../../src/actions/listCities";
import { useActionTestEnvironment } from "../helpers/actionTestEnvironment";
import { city, createState } from "../helpers/fixtures";

const { deps, output } = useActionTestEnvironment();

describe("list cities", () => {
  test("prints cities and validates a city selection", async () => {
    const state = createState();
    printCities(state);
    expect(output()).toContain("(default)");
    deps.answers.push("1");
    await expect(selectCity(state, "Choose: ")).resolves.toEqual(city);
    deps.answers.push("0");
    await expect(selectCity(state, "Choose: ")).resolves.toBeNull();
  });

  test("returns early when selecting from an empty city list", async () => {
    await expect(selectCity(createState({ cities: [] }), "Choose: ")).resolves.toBeNull();
  });
});
