const colorsEnabled = process.stdout.isTTY && process.env.NO_COLOR === undefined;

function color(code: string, text: string): string {
  return colorsEnabled ? `\x1b[${code}m${text}\x1b[0m` : text;
}

export const cyan = (text: string): string => color("36", text);
export const yellow = (text: string): string => color("33", text);
export const green = (text: string): string => color("32", text);
export const red = (text: string): string => color("31", text);
