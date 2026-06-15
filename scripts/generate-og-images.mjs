import { readdir, readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import sharp from "sharp";

const releasesDir = path.resolve("src/content/releases");
const outDir = path.resolve("public/og");

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 630;

await mkdir(outDir, { recursive: true });

const files = (await readdir(releasesDir)).filter((file) => file.endsWith(".md"));

for (const file of files) {
	const slug = file.replace(/\.md$/, "");
	const raw = await readFile(path.join(releasesDir, file), "utf-8");
	const { data } = matter(raw);

	const coverPath = path.resolve(releasesDir, data.cover);
	const coverBuffer = await readFile(coverPath);
	const square = await sharp(coverBuffer)
		.resize(CANVAS_HEIGHT, CANVAS_HEIGHT)
		.toBuffer();

	await sharp({
		create: {
			width: CANVAS_WIDTH,
			height: CANVAS_HEIGHT,
			channels: 3,
			background: "#ffffff",
		},
	})
		.composite([{ input: square, left: (CANVAS_WIDTH - CANVAS_HEIGHT) / 2, top: 0 }])
		.jpeg({ quality: 85 })
		.toFile(path.join(outDir, `${slug}.jpg`));

	console.log(`Generated public/og/${slug}.jpg`);
}
