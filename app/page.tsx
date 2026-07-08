import { Header } from "@/components/Header";
import { WallpaperGrid } from "@/components/WallpaperGrid";
import { getWallpapers } from "@/lib/wallpapers";
import styles from "./page.module.css";

export default function HomePage() {
  const wallpapers = getWallpapers();

  return (
    <main className={styles.main}>
      <Header />
      <WallpaperGrid wallpapers={wallpapers} />
    </main>
  );
}
