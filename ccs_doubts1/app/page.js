"use client";
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import CCSLoader from "./components/CCSLoader.jsx";
import AskDoubt from "./ask/page.jsx";
import styles from "./page.module.css";

export default function Page() {
  const [showLoader, setShowLoader] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const handleLoaderFinish = () => {
    setShowLoader(false);
    setShowContent(true);
  };

  return (
    <div className={styles.pageContainer}>
      <Toaster position="top-center" />
      
      {showLoader && (
        <CCSLoader onFinish={handleLoaderFinish} />
      )}
      
      {showContent && (
        <div className={styles.contentContainer}>
          <AskDoubt />
        </div>
      )}
    </div>
  );
}