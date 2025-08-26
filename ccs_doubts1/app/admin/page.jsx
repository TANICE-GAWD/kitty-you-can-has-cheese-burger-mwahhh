"use client";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

const Spinner = ({ size = "large" }) => (
  <div
    className={
      size === "large" ? styles.spinnerWrapper : styles.buttonSpinnerWrapper
    }
  >
    <div className={size === "large" ? styles.spinner : styles.buttonSpinner} />
  </div>
);

export default function AdminPage() {
  const [doubts, setDoubts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const router = useRouter();

  const fetchPending = async () => {
    try {
      const res = await fetch("/api/doubts?status=pending");
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();

      const sortedData = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setDoubts(sortedData);
    } catch (error) {
      toast.error("Could not fetch pending doubts.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/doubts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Doubt has been ${status}.`);

        fetchPending();
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred while updating.");
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <Spinner />;
    }
    if (doubts.length === 0) {
      return (
        <div className={styles.infoBox}>
          <p> All clear! No pending doubts.</p>
        </div>
      );
    }
    return (
      <div className={styles.doubtsGrid}>
        {doubts.map((d) => (
          <div key={d._id} className={styles.doubtCard}>
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.studentName}>{d.name}</h2>
                <p className={styles.studentEmail}>{d.email}</p>
              </div>
            </div>
            <p className={styles.questionText}>{d.question}</p>
            <div className={styles.buttonGroup}>
              <button
                onClick={() => updateStatus(d._id, "accepted")}
                className={`${styles.button} ${styles.acceptButton}`}
                disabled={updatingId === d._id}
              >
                {updatingId === d._id ? <Spinner size="small" /> : "Accept"}
              </button>
              <button
                onClick={() => updateStatus(d._id, "rejected")}
                className={`${styles.button} ${styles.rejectButton}`}
                disabled={updatingId === d._id}
              >
                {updatingId === d._id ? <Spinner size="small" /> : "Reject"}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Toaster component for notifications, styled for dark mode */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#e5e7eb",
            border: "1px solid #4b5563",
          },
        }}
      />
      <div className={styles.container}>
        <main className={styles.mainContent}>
          <header className={styles.header}>
            <h1 className={styles.title}>Admin Review Panel</h1>
            <p className={styles.subtitle}>
              Review and manage all pending student doubts from here.
            </p>
            <div
              className="w-full flex items-center justify-center
			"
            >
              <button
                className={`${styles.button}`}
                onClick={() => router.push("/admin/display")}
              >
                All Doubts
              </button>
            </div>
          </header>
          {renderContent()}
        </main>
      </div>
    </>
  );
}
