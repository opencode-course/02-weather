import { describe, expect, test } from "bun:test";
import { removeCity } from "../../src/actions/removeCity";
import { useActionTestEnvironment } from "../helpers/actionTestEnvironment";
import { createState } from "../helpers/fixtures";

const { deps, output } = useActionTestEnvironment();

describe("remove city", () => {
  test("removes selected city and clears the default when needed", async () => {
    const state = createState();
    deps.answers.push("1");
    await removeCity(state);
    expect(state.cities).toEqual([]);
    expect(state.defaultCityId).toBeNull();
  });
});
