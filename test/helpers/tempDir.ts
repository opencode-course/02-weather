import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export function createTempDir(): string {
  return mkdtempSync(join(tmpdir(), "weather-test-"));
}

export function removeTempDir(path: string): void {
  rmSync(path, { recursive: true, force: true });
}
