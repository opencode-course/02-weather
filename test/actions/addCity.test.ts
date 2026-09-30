import { describe, expect, test } from "bun:test";
import { addCity } from "../../src/actions/addCity";
import { useActionTestEnvironment } from "../helpers/actionTestEnvironment";
import { createState, location } from "../helpers/fixtures";

const { deps, output } = useActionTestEnvironment();

describe("add city", () => {
  test("adds a selected city and makes the first city default", async () => {
    deps.answers.push("Bogotá", "1");
    const state = createState({ cities: [], defaultCityId: null });
    await addCity(state);
    expect(state.cities).toEqual([{ ...location, id: 1 }]);
    expect(state.defaultCityId).toBe(1);
    expect(await Bun.file("data.json").json()).toMatchObject({ cities: state.cities, defaultCityId: 1 });
  });

  test("does nothing when the city name is empty or selection is cancelled", async () => {
    const state = createState({ cities: [], defaultCityId: null });
    deps.answers.push("");
    await addCity(state);
    deps.answers.push("Bogotá", "0");
    await addCity(state);
    expect(state.cities).toEqual([]);
  });

  test("handles geocoding errors, no results, and invalid selections", async () => {
    const state = createState({ cities: [], defaultCityId: null });
    deps.searchError = new Error("offline");
    deps.answers.push("Bogotá");
    await addCity(state);
    deps.searchError = null;
    deps.searchResults = [];
    deps.answers.push("Unknown");
    await addCity(state);
    deps.searchResults = [location];
    deps.answers.push("Bogotá", "x");
    await addCity(state);
    expect(state.cities).toEqual([]);
    expect(output()).toContain("Opción inválida.");
  });

  test("does not add a duplicate city", async () => {
    const state = createState();
    deps.answers.push("Bogotá", "1");
    await addCity(state);
    expect(state.cities).toHaveLength(1);
    expect(output()).toContain("ya está guardada");
  });
});
