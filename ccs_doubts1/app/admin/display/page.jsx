"use client";
import { useEffect, useState } from "react";
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
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setDoubts(sortedData);
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

    return (
      <div className={styles.doubtsGrid}>
        {doubts.map((d) => (
          <div key={d._id} className={styles.doubtCard}>
            <div className={styles.cardHeader}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.icon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className={styles.cardQuestion}>{d.question}</p>
            </div>
            <p className={styles.cardAuthor}>— {d.name}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* ADDED: Iframe for the background */}
      <iframe
        src="https://interactive-background-three.vercel.app"
        className={styles.backgroundIframe}
        title="Interactive Background"
        loading="lazy"
      />
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.title}>Live Doubts Feed</h1>
          <p className={styles.subtitle}>
            Accepted questions from students, updated in real-time.
          </p>
        </header>
        {renderContent()}
      </main>
    </div>
  );
}