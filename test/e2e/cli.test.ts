import { describe, expect, test } from "bun:test";
import { createTempDir, removeTempDir } from "../helpers/tempDir";

describe("CLI end-to-end", () => {
  test("renders the menu and exits cleanly on option 9", async () => {
    const workingDirectory = createTempDir();
    try {
      const child = Bun.spawn(["bun", "run", `${import.meta.dir}/../../src/index.ts`], {
        cwd: workingDirectory,
        stdin: "pipe",
        stdout: "pipe",
        stderr: "pipe",
        env: { ...process.env, NO_COLOR: "1" },
      });
      await child.stdin.write("9\n");
      child.stdin.end();
      const [stdout, stderr, exitCode] = await Promise.all([
        new Response(child.stdout).text(),
        new Response(child.stderr).text(),
        child.exited,
      ]);
      expect(exitCode).toBe(0);
      expect(stderr).toBe("");
      expect(stdout).toContain("WEATHER CLI");
      expect(stdout).toContain("9. Salir");
    } finally {
      removeTempDir(workingDirectory);
    }
  });

  test("reports an invalid option before accepting the exit option", async () => {
    const workingDirectory = createTempDir();
    try {
      const child = Bun.spawn(["bun", "run", `${import.meta.dir}/../../src/index.ts`], {
        cwd: workingDirectory,
        stdin: "pipe",
        stdout: "pipe",
        stderr: "pipe",
        env: { ...process.env, NO_COLOR: "1" },
      });
      await child.stdin.write("invalid\n9\n");
      child.stdin.end();
      const [stdout, stderr, exitCode] = await Promise.all([
        new Response(child.stdout).text(),
        new Response(child.stderr).text(),
        child.exited,
      ]);
      expect(exitCode).toBe(0);
      expect(stderr).toBe("");
      expect(stdout).toContain("Opción inválida.");
    } finally {
      removeTempDir(workingDirectory);
    }
  });
});
