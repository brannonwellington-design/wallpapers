import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <p className={styles.title}>
        <span className={styles.brand}>Listen Labs /</span>
        <span className={styles.project}> Wallpapers</span>
      </p>
    </header>
  );
}
