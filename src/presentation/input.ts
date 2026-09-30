import process from "node:process";

const decoder = new TextDecoder();

function createStdinReader() {
  return Bun.stdin.stream().getReader();
}

let stdinReader: ReturnType<typeof createStdinReader> | undefined;
let buffer = "";
let queuedLines: string[] = [];

// El reader se crea en la primera lectura: importar el módulo no debe capturar stdin.
function getStdinReader(): ReturnType<typeof createStdinReader> {
  if (!stdinReader) stdinReader = createStdinReader();
  return stdinReader;
}

async function readLine(): Promise<string> {
  while (queuedLines.length === 0) {
    const { done, value } = await getStdinReader().read();
    if (done) process.exit(0);
    buffer += decoder.decode(value);
    const parts = buffer.split("\n");
    buffer = parts.pop() ?? "";
    queuedLines.push(...parts);
  }
  return queuedLines.shift() ?? "";
}

export async function ask(question: string): Promise<string> {
  process.stdout.write(question);
  return (await readLine()).trim();
}

export function closeInput(): void {
  stdinReader?.cancel().catch(() => {});
}
