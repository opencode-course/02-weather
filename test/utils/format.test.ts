import { describe, expect, test } from "bun:test";
import { formatDay, formatLocation, formatUnits } from "../../src/utils/format";
import { location } from "../helpers/fixtures";

describe("format utilities", () => {
  test("formats units", () => {
    expect(formatUnits("celsius")).toBe("°C");
    expect(formatUnits("fahrenheit")).toBe("°F");
  });

  test("formats location and omits absent administrative area", () => {
    expect(formatLocation(location)).toBe("Bogotá, Bogotá D.C., Colombia");
    expect(formatLocation({ ...location, admin1: undefined })).toBe("Bogotá, Colombia");
  });

  test("formats dates in Spanish independent of local timezone", () => {
    expect(formatDay("2024-01-01")).toBe("lun, 01 ene");
  });
});
