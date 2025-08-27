"use client";
import { useEffect, useState } from "react";
import DoubtsSwiper from "../../components/DoubtsSwiper.jsx";
import styles from "./page.module.css";

const Spinner = () => (
  <div className={styles.spinnerWrapper}>
    <div className={styles.spinner}></div>
  </div>
);

export default function DisplayPage() {
  const [doubts, setDoubts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAccepted = async () => {
    try {
      const res = await fetch("/api/doubts?status=accepted");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const text = await res.text();
      const data = text ? JSON.parse(text) : [];

      if (Array.isArray(data)) {
        setDoubts(data);
        setError(null);
      } else {
        throw new Error("Data received is not in the expected format.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch doubts. Please try again later.");
      setDoubts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccepted();
    const interval = setInterval(fetchAccepted, 10000);
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <Spinner />;
    }

    if (error) {
      return (
        <div className={styles.infoBox}>
          <p>{error}</p>
        </div>
      );
    }

    if (doubts.length === 0) {
      return (
        <div className={styles.infoBox}>
          <p>No live doubts at the moment. Check back soon!</p>
        </div>
      );
    }

    return <DoubtsSwiper doubts={doubts} />;
  };

  return (
    <div className={styles.container}>
      <iframe
        src="https://interactive-background-three.vercel.app"
        className={styles.backgroundIframe}
        title="Interactive Background"
        loading="lazy"
      />
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.title}>Live Doubts Feed</h1>
        </header>
        {renderContent()}
      </main>
    </div>
  );
}