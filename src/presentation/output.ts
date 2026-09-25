import { green, red } from "../utils/colors";

export function showSuccess(message: string): void {
  console.log(green(`  ${message}`));
}

export function showError(message: string): void {
  console.log(red(`  ${message}`));
}

export function showInfo(message: string): void {
  console.log(`  ${message}`);
}

export function printNumberedItems(items: string[]): void {
  items.forEach((item, index) => console.log(`  ${index + 1}. ${item}`));
}
