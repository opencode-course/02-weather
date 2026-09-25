const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const canAnimate = Boolean(process.stdout.isTTY) && process.env.NO_COLOR === undefined;

export async function withSpinner<T>(message: string, task: () => Promise<T>): Promise<T> {
  if (!canAnimate) return task();

  let frameIndex = 0;
  const render = () => {
    process.stdout.write(`\r\x1b[K${frames[frameIndex]} ${message}`);
    frameIndex = (frameIndex + 1) % frames.length;
  };

  render();
  const interval = setInterval(render, 100);
  try {
    return await task();
  } finally {
    clearInterval(interval);
    process.stdout.write("\r\x1b[K");
  }
}
