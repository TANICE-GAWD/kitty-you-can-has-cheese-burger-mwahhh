"use client";
import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import styles from "./DoubtsSwiper.module.css";

export default function DoubtsSwiper({ doubts }) {
  const swiperRef = useRef(null);

  // Sort by credits (ascending - lower credits = higher priority), then by creation date
  const sortedDoubts = [...doubts].sort((a, b) => {
    // Handle missing credits - put them at the end
    const aCredits = a.credits ?? null;
    const bCredits = b.credits ?? null;
    
    // If one has credits and other doesn't, prioritize the one with credits
    if (aCredits === null && bCredits !== null) return 1;
    if (aCredits !== null && bCredits === null) return -1;
    
    // If both have no credits, sort by creation date
    if (aCredits === null && bCredits === null) {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    
    // Primary sort: by credits (ascending - 1 comes before 10)
    if (aCredits !== bCredits) {
      return aCredits - bCredits;
    }
    
    // Secondary sort: by creation date (oldest first for same credit level)
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  useEffect(() => {
    
    if (swiperRef.current) {
      swiperRef.current.focus();
    }
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.swiperContainer}>

      <Swiper
        ref={swiperRef}
        effect="coverflow"
        loop={sortedDoubts.length > 1}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={1}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{
          el: `.${styles.swiperPagination}`,
          clickable: true,
        }}
        keyboard={{
          enabled: true,
          onlyInViewport: true,
        }}
        modules={[EffectCoverflow, Pagination, Keyboard]}
        breakpoints={{
          320: {
            slidesPerView: 1.2,
          },
          580: {
            slidesPerView: 1.5,
          },
          767: {
            slidesPerView: 2,
          },
          992: {
            slidesPerView: 2.5,
          },
          1200: {
            slidesPerView: 3,
          },
          1400: {
            slidesPerView: 3.5,
          },
          1600: {
            slidesPerView: 4,
          },
        }}
        className={styles.swiper}
        tabIndex={0}
      >
        {sortedDoubts.map((doubt, index) => (
          <SwiperSlide key={doubt._id} className={styles.swiperSlide}>
            <div className={styles.slideContent}>
              <div className={styles.doubtIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
              </div>

              <div className={styles.info}>
                <span className={styles.infoItem} title="Student Name">
                  <svg className={styles.infoIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {doubt.name}
                </span>
                <span className={styles.infoItem} title="Email">
                  <svg className={styles.infoIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {doubt.email}
                </span>
                <span className={styles.infoItem} title="Question">
                  <svg className={styles.infoIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {doubt.question}
                </span>
                <span className={styles.infoItem} title="Credits">
                  <svg className={styles.infoIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Credits: {doubt.credits ?? 'N/A'}
                </span>
                <span className={styles.infoItem} title="Date">
                  <svg className={styles.infoIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(doubt.createdAt)}
                </span>
                <span className={styles.infoItem} title="Time">
                  <svg className={styles.infoIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatTime(doubt.createdAt)}
                </span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={styles.swiperPagination}></div>
    </div>
  );
}