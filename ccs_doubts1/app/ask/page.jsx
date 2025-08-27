"use client";
import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import styles from "./page.module.css";


const Loader = () => (
  <div className="loader-fullscreen-wrapper">
    <div className="loader-container">
      <div className="pl">
        <span className="pl__sr">Loading…</span>
      </div>
      <div className="pl">
        <span className="pl__sr">Loading…</span>
      </div>
      <div className="s">
        <span className="pl__sr">Loading…</span>
      </div>
    </div>
  </div>
);

export default function AskDoubt() {
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", doubt: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    
    return () => clearTimeout(timer);
  }, []); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const submissionToast = toast.loading("Submitting...");

    try {
      const res = await fetch("/api/doubts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("Your doubt has been submitted!", {
          id: submissionToast,
        });
        setForm({ name: "", email: "", doubt: "" });
      } else {
        throw new Error("Server error");
      }
    } catch (error) {
      toast.error("Something went wrong. Try again.", { id: submissionToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  
  
  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className={styles.container}>
        <h1 className={styles.title}>DOUBTS PORTAL</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
          <input
            type="text"
            name="doubt"
            placeholder="Doubt"
            value={form.doubt}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.button}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
}