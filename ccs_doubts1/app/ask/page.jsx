"use client";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import styles from "./page.module.css";

export default function AskDoubt() {
  const [form, setForm] = useState({ name: "", email: "", question: "", credits: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        setForm({ name: "", email: "", question: "", credits: "" });
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
    
    
    if (name === "credits") {
      const numValue = parseInt(value);
      if (value === "" || (numValue >= 1 && numValue <= 10)) {
        setForm((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

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
            name="question"
            placeholder="Doubt"
            value={form.question}
            onChange={handleInputChange}
            required
            className={styles.input}
          />

          <input
            type="number"
            name="credits"
            placeholder="Credits (1-10)"
            value={form.credits}
            onChange={handleInputChange}
            min="1"
            max="10"
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
