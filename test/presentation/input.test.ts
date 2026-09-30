import { afterEach, beforeEach, describe, expect, spyOn, test } from "bun:test";

const encoder = new TextEncoder();
let stdin: ReadableStreamDefaultController<Uint8Array<ArrayBuffer>> | undefined;
let cancelRequested = false;

const stdinStream = new ReadableStream<Uint8Array<ArrayBuffer>>({
  start: (controller) => (stdin = controller),
  cancel: () => {
    cancelRequested = true;
  },
});

// El módulo crea su reader en la primera lectura: se espía stdin antes de preguntar.
spyOn(Bun.stdin, "stream").mockReturnValue(stdinStream);
const { ask, closeInput } = await import("../../src/presentation/input");

let writeSpy: ReturnType<typeof spyOn>;

beforeEach(() => {
  writeSpy = spyOn(process.stdout, "write").mockImplementation(() => true);
});

afterEach(() => {
  writeSpy.mockRestore();
});

function givenStdin(text: string): void {
  stdin?.enqueue(encoder.encode(text));
}

describe("stdin input", () => {
  test("prints the question and returns the trimmed answer", async () => {
    givenStdin("  Bogotá\r\n");
    expect(await ask("  City name: ")).toBe("Bogotá");
    expect(writeSpy).toHaveBeenCalledWith("  City name: ");
  });

  test("keeps reading until a complete line arrives", async () => {
    givenStdin("Bogo");
    givenStdin("tá D.C.\n");
    expect(await ask("  City name: ")).toBe("Bogotá D.C.");
  });

  test("serves queued lines in order", async () => {
    givenStdin("first\nsecond\n");
    expect(await ask("One: ")).toBe("first");
    expect(await ask("Two: ")).toBe("second");
  });

  test("cancels the stdin reader on close", async () => {
    closeInput();
    await Bun.sleep(0);
    expect(cancelRequested).toBe(true);
  });
});
