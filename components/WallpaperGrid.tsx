"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { Wallpaper } from "@/lib/wallpapers";
import { shuffle } from "@/lib/shuffle";
import { WallpaperModal } from "@/components/WallpaperModal";
import styles from "./WallpaperGrid.module.css";

const BATCH_SIZE = 24;

type WallpaperGridProps = {
  wallpapers: Wallpaper[];
};

export function WallpaperGrid({ wallpapers }: WallpaperGridProps) {
  const [shuffled, setShuffled] = useState<Wallpaper[]>([]);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [selected, setSelected] = useState<Wallpaper | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setShuffled(shuffle(wallpapers));
    setVisibleCount(BATCH_SIZE);
  }, [wallpapers]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((count) =>
            Math.min(count + BATCH_SIZE, shuffled.length),
          );
        }
      },
      { rootMargin: "400px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [shuffled.length]);

  const visibleWallpapers = useMemo(
    () => shuffled.slice(0, visibleCount),
    [shuffled, visibleCount],
  );

  const closeModal = useCallback(() => setSelected(null), []);

  if (shuffled.length === 0) {
    return (
      <section
        className={styles.grid}
        aria-busy="true"
        aria-label="Loading wallpaper gallery"
      />
    );
  }

  return (
    <>
      <section className={styles.grid} aria-label="Wallpaper gallery">
        {visibleWallpapers.map((wallpaper) => (
          <button
            key={wallpaper.id}
            type="button"
            className={styles.tile}
            onClick={() => setSelected(wallpaper)}
            aria-label={`Open ${wallpaper.displayName}`}
          >
            <Image
              src={wallpaper.thumbnailPath}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className={styles.image}
            />
          </button>
        ))}
      </section>

      {visibleCount < shuffled.length ? (
        <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
      ) : null}

      {selected ? (
        <WallpaperModal wallpaper={selected} onClose={closeModal} />
      ) : null}
    </>
  );
}
