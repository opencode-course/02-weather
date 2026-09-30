import { afterEach, beforeEach, mock, spyOn } from "bun:test";
import { chdir, cwd } from "node:process";
import { defaultActionDeps, resetActionDeps, spyOnActionModules, type ActionDeps } from "./actionDeps";
import { createTempDir, removeTempDir } from "./tempDir";

// Entorno común de los tests de acciones: cwd temporal (para data.json),
// salida de console.log capturada y módulos externos parchados por test.
export function useActionTestEnvironment(): { deps: ActionDeps; output: () => string } {
  const deps = defaultActionDeps();
  const originalDirectory = cwd();
  let tempDirectory = "";
  let logSpy: ReturnType<typeof spyOn> | undefined;

  beforeEach(() => {
    tempDirectory = createTempDir();
    chdir(tempDirectory);
    resetActionDeps(deps);
    logSpy = spyOn(console, "log").mockImplementation(() => {});
    spyOnActionModules(deps);
  });

  afterEach(() => {
    mock.restore();
    chdir(originalDirectory);
    if (tempDirectory) removeTempDir(tempDirectory);
    tempDirectory = "";
  });

  return { deps, output: () => logSpy?.mock.calls.flat().join(" ") ?? "" };
}
