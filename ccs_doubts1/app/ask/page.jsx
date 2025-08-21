"use client";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import styles from "./page.module.css";


const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={styles.icon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const EmailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={styles.icon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const QuestionIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={styles.icon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);


export default function AskDoubt() {
  const [form, setForm] = useState({ name: "", email: "", question: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const submissionToast = toast.loading("Submitting your question...");

    try {
      const res = await fetch("/api/doubts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("Your question has been sent successfully!", {
          id: submissionToast,
        });
        setForm({ name: "", email: "", question: "" }); 
      } else {
        throw new Error("Server responded with an error.");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Something went wrong. Please try again later.", {
        id: submissionToast,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#2d3748", 
            color: "#e2e8f0",
          },
        }}
      />
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>Have a Question?</h1>
            <p className={styles.subtitle}>
              Fill out the form below, and we'll get back to you as soon as
              possible.
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Name Input */}
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>
                Full Name
              </label>
              <div className={styles.inputWrapper}>
                <UserIcon />
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={styles.input}
                  placeholder="e.g., Jane Doe"
                  value={form.name}
                  onChange={handleInputChange}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <div className={styles.inputWrapper}>
                <EmailIcon />
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={styles.input}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleInputChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Question Textarea */}
            <div className={styles.inputGroup}>
              <label htmlFor="question" className={styles.label}>
                Your Question
              </label>
              <div className={styles.inputWrapper}>
                <QuestionIcon />
                <textarea
                  id="question"
                  name="question"
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder="Describe your question in detail here..."
                  value={form.question}
                  onChange={handleInputChange}
                  required
                  rows="5"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? (
                <>
                  <div className={styles.spinner}></div>
                  <span>Sending...</span>
                </>
              ) : (
                "Submit Question"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
