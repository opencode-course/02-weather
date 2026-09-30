import { describe, expect, test } from "bun:test";
import { getWeather, getWeatherLine } from "../../src/actions/getWeather";
import { useActionTestEnvironment } from "../helpers/actionTestEnvironment";
import { city, createState } from "../helpers/fixtures";

const { deps, output } = useActionTestEnvironment();

describe("get weather", () => {
  test("formats current weather and reports API failure", async () => {
    await expect(getWeatherLine(city, "celsius")).resolves.toContain("16 °C");
    deps.temperatureError = new Error("offline");
    await expect(getWeatherLine(city, "fahrenheit")).resolves.toContain("no se pudo obtener el clima");
  });

  test("reports missing default city or prints current weather", async () => {
    await getWeather(createState({ defaultCityId: null }));
    expect(output()).toContain("No hay ciudad default");
    await getWeather(createState());
    expect(output()).toContain("16 °C");
  });
});
