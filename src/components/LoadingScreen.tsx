'use client';
import { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.css';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Show loading screen for a few seconds before fading out
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1000);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 1800); // 0.8s for the fade-out animation

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`${styles.container} ${isFadingOut ? styles.fadeOut : ''}`}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          <span className={styles.letter} style={{ animationDelay: '0.1s' }}>N</span>
          <span className={styles.letter} style={{ animationDelay: '0.3s' }}>O</span>
          <span className={styles.letter} style={{ animationDelay: '0.5s' }}>R</span>
          <span className={styles.letter} style={{ animationDelay: '0.7s' }}>E</span>
        </h1>
        <div className={styles.line}></div>
      </div>
    </div>
  );
}
