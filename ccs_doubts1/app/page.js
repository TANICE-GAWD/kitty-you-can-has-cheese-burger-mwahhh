"use client";
import React, { useEffect } from "react";
import "./globals.css";

const Page = () => {
  useEffect(() => {
    const target = document.getElementById('animated-title');
    if (!target) return;

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_1234567890";
    let interval = null;
    const originalText = "DOUBT_PORTAL";

    const runAnimation = () => {
      let iteration = 0;
      clearInterval(interval);
      interval = setInterval(() => {
        target.innerText = originalText
          .split("")
          .map((letter, index) => {
            if(index < iteration) {
              return originalText[index];
            }
            return letters[Math.floor(Math.random() * letters.length)]
          })
          .join("");
        
        if(iteration >= originalText.length){
          clearInterval(interval);
        }
        iteration += 1 / 5;
      }, 40);
    };

    target.onmouseover = runAnimation;
    runAnimation();
  }, []);

  return (
    <>
      <div className="main-container">
        <iframe
          src="https://interactive-background-three.vercel.app/"
          className="background-iframe"
          title="Background Embed"
          sandbox="allow-scripts allow-same-origin"
        />

        <h1 id="animated-title" className="main-title">
          DOUBT_PORTAL
        </h1>
        
        <div className="buttons-container">
          <a href="/ask" className="query-link">
            <span className="futuristic-button-text query-text-cyan">
              INITIATE QUERY
            </span>
          </a>
          
          <a href="/display" className="query-link">
            <span className="futuristic-button-text query-text-cyan">
              VIEW ARCHIVES
            </span>
          </a>
          
          <a href="/admin" className="query-link">
            <span className="futuristic-button-text query-text-pink">
              ADMIN ACCESS
            </span>
          </a>
        </div>
      </div>
    </>
  );
};

export default Page;
