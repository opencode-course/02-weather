import { afterEach, describe, expect, test } from "bun:test";
import { chdir, cwd } from "node:process";
import { createTempDir, removeTempDir } from "../helpers/tempDir";
import { loadCities, nextCityId, saveCities } from "../../src/storage/citiesStorage";
import { city } from "../helpers/fixtures";

const originalDirectory = cwd();
let tempDirectory = "";

afterEach(() => {
  chdir(originalDirectory);
  if (tempDirectory) removeTempDir(tempDirectory);
  tempDirectory = "";
});

describe("cities storage", () => {
  test("loads safe defaults and saves city data", async () => {
    tempDirectory = createTempDir();
    chdir(tempDirectory);
    expect(await loadCities()).toEqual({ cities: [], defaultCityId: null });
    await saveCities([city], city.id);
    expect(await loadCities()).toEqual({ cities: [city], defaultCityId: city.id });
  });

  test("calculates the next ID from the maximum existing ID", () => {
    expect(nextCityId([])).toBe(1);
    expect(nextCityId([{ ...city, id: 8 }, { ...city, id: 3 }])).toBe(9);
  });
});
