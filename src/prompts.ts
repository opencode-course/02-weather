import process from "node:process";

const decoder = new TextDecoder();
const reader = Bun.stdin.stream().getReader();

let buffer = "";
let queuedLines: string[] = [];

async function readLine(): Promise<string> {
  while (queuedLines.length === 0) {
    const { done, value } = await reader.read();
    // EOF (Ctrl+D o pipe cerrado): salir limpiamente
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
  reader.cancel().catch(() => {});
}
