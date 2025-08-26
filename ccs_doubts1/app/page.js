"use client";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import "./globals.css";

export default function Page() {
  const [form, setForm] = useState({ name: "", email: "", doubt: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // DOUBT_PORTAL title animation (unchanged)
  useEffect(() => {
    const target = document.getElementById("animated-title");
    if (!target) return;
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_1234567890";
    const originalText = "DOUBT_PORTAL";
    let interval = null;

    const run = () => {
      let iteration = 0;
      clearInterval(interval);
      interval = setInterval(() => {
        target.innerText = originalText
          .split("")
          .map((_, i) =>
            i < iteration
              ? originalText[i]
              : letters[Math.floor(Math.random() * letters.length)]
          )
          .join("");
        if (iteration >= originalText.length) clearInterval(interval);
        iteration += 1 / 5;
      }, 40);
    };

    target.onmouseover = run;
    run();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const id = toast.loading("Submitting...");
    try {
      const res = await fetch("/api/doubts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Server error");
      toast.success("Your doubt has been submitted!", { id });
      setForm({ name: "", email: "", doubt: "" });
    } catch {
      toast.error("Something went wrong. Try again.", { id });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="main-container">
        <h1 id="animated-title" className="main-title">
          DOUBT_PORTAL
        </h1>

        <form onSubmit={handleSubmit} className="form-container">
          <input
            className="form-input"
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleInputChange}
            required
          />
          <input
            className="form-input"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleInputChange}
            required
          />
          <textarea
            className="form-input textarea"
            name="doubt"
            placeholder="Doubt"
            rows={5}
            value={form.doubt}
            onChange={handleInputChange}
            required
          />
          <button className="form-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
}
