export type Wallpaper = {
  id: string;
  collection: string;
  collectionLabel: string;
  filename: string;
  displayName: string;
  width: number;
  height: number;
  downloadPath: string;
  thumbnailPath: string;
  previewPath: string;
};

import manifest from "@/data/wallpapers.json";

export function getWallpapers(): Wallpaper[] {
  return manifest as Wallpaper[];
}
