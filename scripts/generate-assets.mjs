import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const WALLPAPERS_DIR = path.join(ROOT, "public", "wallpapers");
const THUMBNAILS_DIR = path.join(ROOT, "public", "thumbnails");
const PREVIEWS_DIR = path.join(ROOT, "public", "previews");
const DATA_DIR = path.join(ROOT, "data");
const MANIFEST_PATH = path.join(DATA_DIR, "wallpapers.json");

const COLLECTIONS = ["paper", "blue"];
const THUMB_WIDTH = 640;
const PREVIEW_WIDTH = 1920;
const FULL_WIDTH = 5760;
const FULL_HEIGHT = 3240;

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function getPngFiles(dir) {
  const entries = await fs.readdir(dir);
  return entries.filter((name) => name.toLowerCase().endsWith(".png")).sort();
}

async function generateImageVariant(sourcePath, destPath, width, quality) {
  const destStat = await fs.stat(destPath).catch(() => null);
  const sourceStat = await fs.stat(sourcePath);

  if (destStat && destStat.mtimeMs >= sourceStat.mtimeMs) {
    return false;
  }

  await sharp(sourcePath)
    .resize(width, null, { withoutEnlargement: true })
    .webp({ quality })
    .toFile(destPath);

  return true;
}

async function main() {
  await ensureDir(THUMBNAILS_DIR);
  await ensureDir(PREVIEWS_DIR);
  await ensureDir(DATA_DIR);

  const wallpapers = [];
  let generated = 0;
  let skipped = 0;

  for (const collection of COLLECTIONS) {
    const collectionDir = path.join(WALLPAPERS_DIR, collection);
    const thumbCollectionDir = path.join(THUMBNAILS_DIR, collection);
    const previewCollectionDir = path.join(PREVIEWS_DIR, collection);
    await ensureDir(thumbCollectionDir);
    await ensureDir(previewCollectionDir);

    const files = await getPngFiles(collectionDir);

    for (const filename of files) {
      const id = filename.replace(/\.png$/i, "");
      const sourcePath = path.join(collectionDir, filename);
      const thumbFilename = `${id}.webp`;
      const previewFilename = `${id}.webp`;
      const thumbPath = path.join(thumbCollectionDir, thumbFilename);
      const previewPath = path.join(previewCollectionDir, previewFilename);

      const thumbCreated = await generateImageVariant(
        sourcePath,
        thumbPath,
        THUMB_WIDTH,
        82,
      );
      const previewCreated = await generateImageVariant(
        sourcePath,
        previewPath,
        PREVIEW_WIDTH,
        88,
      );

      if (thumbCreated || previewCreated) generated += 1;
      else skipped += 1;

      const displayName = id
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      wallpapers.push({
        id: `${collection}-${id}`,
        collection,
        collectionLabel: collection.charAt(0).toUpperCase() + collection.slice(1),
        filename,
        displayName,
        width: FULL_WIDTH,
        height: FULL_HEIGHT,
        downloadPath: `/wallpapers/${collection}/${filename}`,
        thumbnailPath: `/thumbnails/${collection}/${thumbFilename}`,
        previewPath: `/previews/${collection}/${previewFilename}`,
      });
    }
  }

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(wallpapers, null, 2));

  console.log(`Manifest: ${wallpapers.length} wallpapers`);
  console.log(`Thumbnails: ${generated} generated, ${skipped} up to date`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
