import { describe, expect, test } from "bun:test";
import { getForecast } from "../../src/actions/getForecast";
import { useActionTestEnvironment } from "../helpers/actionTestEnvironment";
import { createState } from "../helpers/fixtures";

const { deps, output } = useActionTestEnvironment();

describe("get forecast", () => {
  test("prints selected city's daily forecast", async () => {
    deps.answers.push("1");
    await getForecast(createState());
    expect(output()).toContain("Pronóstico para Bogotá");
    expect(output()).toContain("18 °C");
  });
});
