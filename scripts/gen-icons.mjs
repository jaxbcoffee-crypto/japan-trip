import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const outputDir = join(projectRoot, "public", "icons");

mkdirSync(outputDir, { recursive: true });

const background = { r: 31, g: 41, b: 55, alpha: 1 };

for (const size of [192, 512]) {
  await sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .png()
    .toFile(join(outputDir, `icon-${size}.png`));

  console.log(`Generated public/icons/icon-${size}.png`);
}
