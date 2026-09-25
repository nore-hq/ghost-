'use client';
import { useRef, useEffect, useState } from 'react';
import Carousel from '@/components/Carousel';
import LoadingScreen from '@/components/LoadingScreen';
import styles from './page.module.css';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasStarted = useRef(false);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (videoRef.current && !hasStarted.current) {
      videoRef.current.currentTime = 14;
      videoRef.current.play().catch(e => console.log('Autoplay prevented', e));
      hasStarted.current = true;
    }
  }, []);

  const handleLoadedMetadata = () => {
    if (videoRef.current && !hasStarted.current) {
      videoRef.current.currentTime = 14;
    }
  };

  const handleVideoEnded = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 15;
      videoRef.current.play();
    }
  };

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <main className={styles.main}>
        <div className={styles.videoContainer}>
          <video 
            ref={videoRef}
            className={`${styles.videoBg} ${isZoomedIn ? styles.zoomedIn : styles.zoomedOut}`} 
            muted 
            playsInline
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleVideoEnded}
          >
            <source src="/videos/bg-video.mp4#t=14" type="video/mp4" />
          </video>
          
          <div className={styles.videoOverlay}></div>
        </div>

        <div className={styles.carouselLayer}>
          <Carousel isZoomedIn={isZoomedIn} onZoomToggle={() => setIsZoomedIn(!isZoomedIn)} />
        </div>

        <header className={`${styles.header} ${isZoomedIn ? styles.headerHidden : ''}`}>
          <div className={styles.menuIcon}>
            <div className={styles.line}></div>
            <div className={styles.line}></div>
          </div>
          
          <h1 className={`${styles.logo} serif`}>NORE</h1>
          
          <div className={styles.inquiry}>
            <span>INQUIRE</span>
          </div>
        </header>
      </main>
    </>
  );
}
