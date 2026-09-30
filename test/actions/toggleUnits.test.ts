import { describe, expect, test } from "bun:test";
import { toggleUnits } from "../../src/actions/toggleUnits";
import { useActionTestEnvironment } from "../helpers/actionTestEnvironment";
import { createState } from "../helpers/fixtures";

const { output } = useActionTestEnvironment();

describe("toggle units", () => {
  test("changes and persists units", async () => {
    const state = createState();
    await toggleUnits(state);
    expect(state.units).toBe("fahrenheit");
    expect(await Bun.file("data.json").json()).toMatchObject({ units: "fahrenheit" });
  });
});
