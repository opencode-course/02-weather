import { describe, expect, test } from "bun:test";
import { setDefaultCity } from "../../src/actions/setDefaultCity";
import { useActionTestEnvironment } from "../helpers/actionTestEnvironment";
import { city, createState } from "../helpers/fixtures";

const { deps, output } = useActionTestEnvironment();

describe("set default city", () => {
  test("sets selected city as default", async () => {
    const secondCity = { ...city, id: 2, name: "Medellín" };
    const state = createState({ cities: [city, secondCity] });
    deps.answers.push("2");
    await setDefaultCity(state);
    expect(state.defaultCityId).toBe(2);
  });
});
