import { afterEach, describe, expect, test } from "bun:test";
import { chdir, cwd } from "node:process";
import { createTempDir, removeTempDir } from "../helpers/tempDir";
import { loadUnits, saveUnits } from "../../src/storage/settingsStorage";

const originalDirectory = cwd();
let tempDirectory = "";

afterEach(() => {
  chdir(originalDirectory);
  if (tempDirectory) removeTempDir(tempDirectory);
  tempDirectory = "";
});

describe("settings storage", () => {
  test("defaults to Celsius and persists selected units", async () => {
    tempDirectory = createTempDir();
    chdir(tempDirectory);
    expect(await loadUnits()).toBe("celsius");
    await saveUnits("fahrenheit");
    expect(await loadUnits()).toBe("fahrenheit");
  });
});
