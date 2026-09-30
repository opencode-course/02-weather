import { afterEach, describe, expect, test } from "bun:test";
import { mkdirSync, writeFileSync } from "node:fs";
import { chdir, cwd } from "node:process";
import { createTempDir, removeTempDir } from "../helpers/tempDir";
import { readStateFile, updateStateFile } from "../../src/storage/stateFile";
import { city } from "../helpers/fixtures";

const originalDirectory = cwd();
let tempDirectory = "";

afterEach(() => {
  chdir(originalDirectory);
  if (tempDirectory) removeTempDir(tempDirectory);
  tempDirectory = "";
});

function useTempDirectory(): string {
  tempDirectory = createTempDir();
  chdir(tempDirectory);
  return tempDirectory;
}

describe("state file storage", () => {
  test("returns empty state if the file does not exist", async () => {
    useTempDirectory();
    expect(await readStateFile()).toEqual({});
  });

  test("returns empty state for invalid JSON or non-object JSON", async () => {
    const directory = useTempDirectory();
    writeFileSync(`${directory}/data.json`, "{");
    expect(await readStateFile()).toEqual({});
    writeFileSync(`${directory}/data.json`, "[]");
    expect(await readStateFile()).toEqual({});
  });

  test("merges updates with existing state", async () => {
    const directory = useTempDirectory();
    writeFileSync(`${directory}/data.json`, JSON.stringify({ units: "fahrenheit" }));
    await updateStateFile({ cities: [city] });
    expect(await readStateFile()).toEqual({ units: "fahrenheit", cities: [city] });
  });
});
