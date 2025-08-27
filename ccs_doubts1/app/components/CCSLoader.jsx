"use client";
import { useEffect, useState } from "react";
import styles from "./CCSLoader.module.css";

export default function CCSLoader({ onFinish }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    
    const timeout = setTimeout(() => {
      setFade(true);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 600);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [onFinish]);

  return (
    <div className={`${styles.loaderOverlay} ${fade ? styles.fadeOut : ''}`}>
      <div className={styles.container}>
        <div className={styles.pl}>
          <span className={styles.sr}>Loading…</span>
        </div>
        <div className={styles.pl}>
          <span className={styles.sr}>Loading…</span>
        </div>
        <div className={styles.s}>
          <span className={styles.sr}>Loading…</span>
        </div>
      </div>
    </div>
  );
}