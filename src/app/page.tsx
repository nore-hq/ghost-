'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import Carousel from '@/components/Carousel';
import styles from './page.module.css';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [showUI, setShowUI] = useState(false);

  // Start video from 0 (lights off). At ~14s the lights are on → reveal UI.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.play().catch(() => {});

    const onTimeUpdate = () => {
      if (video.currentTime >= 13.5 && !showUI) {
        setShowUI(true);
      }
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    return () => video.removeEventListener('timeupdate', onTimeUpdate);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVideoEnded = () => {
    // Loop from the lit portion (14s onward)
    if (videoRef.current) {
      videoRef.current.currentTime = 14;
      videoRef.current.play();
    }
  };

  // Allow skipping the intro by tapping
  const handleSkipIntro = useCallback(() => {
    if (!showUI && videoRef.current) {
      videoRef.current.currentTime = 14;
      setShowUI(true);
    }
  }, [showUI]);

  return (
    <main className={styles.main} onClick={handleSkipIntro}>
      <div className={styles.videoContainer}>
        <video
          ref={videoRef}
          className={`${styles.videoBg} ${isZoomedIn ? styles.zoomedIn : styles.zoomedOut}`}
          muted
          playsInline
          onEnded={handleVideoEnded}
        >
          <source src="/videos/bg-video.mp4" type="video/mp4" />
        </video>

        <div className={styles.videoOverlay}></div>
      </div>

      {/* Everything fades in once the lights are on */}
      <div className={`${styles.carouselLayer} ${showUI ? styles.uiVisible : styles.uiHidden}`}>
        <Carousel isZoomedIn={isZoomedIn} onZoomToggle={() => setIsZoomedIn(!isZoomedIn)} />
      </div>

      <header className={`${styles.header} ${isZoomedIn ? styles.headerHidden : ''} ${showUI ? styles.uiVisible : styles.uiHidden}`}>
        <div className={styles.menuIcon}>
          <div className={styles.line}></div>
          <div className={styles.line}></div>
        </div>

        <h1 className={`${styles.logo} serif`}>NORE</h1>

        <div className={styles.inquiry}>
          <span>INQUIRE</span>
        </div>
      </header>

      {/* Skip intro hint */}
      {!showUI && (
        <div className={styles.skipHint}>TAP TO SKIP</div>
      )}
    </main>
  );
}
