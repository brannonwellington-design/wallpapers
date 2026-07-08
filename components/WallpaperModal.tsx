"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Download, X } from "lucide-react";
import type { Wallpaper } from "@/lib/wallpapers";
import styles from "./WallpaperModal.module.css";

type WallpaperModalProps = {
  wallpaper: Wallpaper;
  onClose: () => void;
};

export function WallpaperModal({ wallpaper, onClose }: WallpaperModalProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`${wallpaper.displayName} preview`}
      onClick={onClose}
    >
      <div className={styles.panel} onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close preview"
        >
          <X size={16} strokeWidth={1.25} aria-hidden="true" />
        </button>

        <div className={styles.preview}>
          <Image
            src={wallpaper.previewPath}
            alt={wallpaper.displayName}
            fill
            sizes="(max-width: 1024px) 100vw, 80vw"
            className={styles.previewImage}
            priority
          />
        </div>

        <div className={styles.meta}>
          <div className={styles.copy}>
            <p className={styles.name}>{wallpaper.displayName}</p>
            <p className={styles.details}>
              {wallpaper.collectionLabel} · {wallpaper.width}×
              {wallpaper.height} · PNG
            </p>
          </div>

          <a
            className={styles.downloadButton}
            href={wallpaper.downloadPath}
            download={wallpaper.filename}
          >
            <Download size={16} strokeWidth={1.25} aria-hidden="true" />
            Download
          </a>
        </div>
      </div>
    </div>
  );
}
