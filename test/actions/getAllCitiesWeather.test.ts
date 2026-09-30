import { describe, expect, test } from "bun:test";
import { getAllCitiesWeather } from "../../src/actions/getAllCitiesWeather";
import { useActionTestEnvironment } from "../helpers/actionTestEnvironment";
import { createState } from "../helpers/fixtures";

const { deps, output } = useActionTestEnvironment();

describe("get all cities weather", () => {
  test("prints all city temperatures or reports an empty list", async () => {
    await getAllCitiesWeather(createState({ cities: [] }));
    expect(output()).toContain("No hay ciudades guardadas");
    await getAllCitiesWeather(createState());
    expect(output()).toContain("Bogotá");
  });
});
