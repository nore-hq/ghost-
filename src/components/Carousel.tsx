'use client';
import { useState, useEffect } from 'react';
import styles from './Carousel.module.css';

const ITEMS = [
  { id: 1, name: 'NELSON RACING ENGINE', is3D: true, src: '/models/nelson_racing_engine_a.glb', stats: { precision: 99, power: 100, efficiency: 95, torque: 98, durability: 90, capacity: 85, voltage: 90 } },
  { id: 2, name: 'ABAC FILTER', image: '/images/abac.png', stats: { precision: 95, power: 80, efficiency: 92, torque: 70, durability: 85, capacity: 75, voltage: 60 } },
  { id: 3, name: 'ROBOTIC ARMS', image: '/images/Firefly_RemoveBackground.png', stats: { precision: 98, power: 95, efficiency: 88, torque: 90, durability: 95, capacity: 90, voltage: 85 } },
  { id: 4, name: 'PRESSURE PUMP', image: '/images/pressurepump.png', stats: { precision: 85, power: 99, efficiency: 75, torque: 85, durability: 80, capacity: 100, voltage: 95 } },
  { id: 5, name: 'WATER PUMP', image: '/images/waterpump.png', stats: { precision: 90, power: 85, efficiency: 95, torque: 75, durability: 88, capacity: 90, voltage: 80 } },
];

function StatItem({ label, value, trigger, delay = 0 }: { label: string, value: number, trigger: number, delay?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isCalculating, setIsCalculating] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsCalculating(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayValue(0);
    
    let iterations = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 100));
        iterations++;
        
        if (iterations > 15) {
          clearInterval(interval);
          setDisplayValue(value);
          setIsCalculating(false);
        }
      }, 40); // Fast calculation tick
      return () => clearInterval(interval);
    }, delay * 1000);
    
    return () => clearTimeout(timeout);
  }, [value, trigger, delay]);

  return (
    <div className={styles.statBox} style={{ animationDelay: `${delay}s` }}>
       <div className={styles.statHeader}>
         <span className={styles.statLabel}>{label}</span>
         <span className={`${styles.statValue} ${isCalculating ? styles.calculatingText : styles.calculatedText}`}>
           {isCalculating ? `[ ${displayValue}% ]` : `${displayValue}%`}
         </span>
       </div>
       <div className={styles.statBar}>
         <div 
           className={styles.statFill} 
           style={{
             width: isCalculating ? '0%' : `${value}%`, 
             transition: isCalculating ? 'none' : 'width 1s cubic-bezier(0.2, 0.8, 0.2, 1)' 
           }}
         ></div>
       </div>
    </div>
  );
}

function TiltImage({ src, alt, isActive, isZoomedIn }: { src: string; alt: string; isActive: boolean, isZoomedIn: boolean }) {
  const [style, setStyle] = useState({});

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isActive || !isZoomedIn) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setStyle({
      transform: `perspective(1000px) rotateY(${x * 20}deg) rotateX(${-y * 20}deg) scale3d(1.05, 1.05, 1.05)`,
      transition: 'none'
    });
  };

  const handleMouseLeave = () => {
    if (!isActive || !isZoomedIn) return;
    setStyle({
      transform: `perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)`,
      transition: 'transform 0.5s ease'
    });
  };

  return (
    <img 
      src={src} 
      alt={alt} 
      className={styles.image} 
      style={{ ...style, pointerEvents: isActive && isZoomedIn ? 'auto' : 'none' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
  );
}

interface CarouselProps {
  isZoomedIn: boolean;
  onZoomToggle: () => void;
}

export default function Carousel({ isZoomedIn, onZoomToggle }: CarouselProps) {
  const [position, setPosition] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const next = () => setPosition(p => p + 1);
  const prev = () => setPosition(p => p - 1);

  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    if (!isZoomedIn) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomedIn]);

  useEffect(() => {
    if (!isZoomedIn) return;
    let isScrolling = false;
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) return;
      if (e.target && (e.target as HTMLElement).tagName.toLowerCase() === 'model-viewer') {
        return;
      }
      isScrolling = true;
      if (e.deltaY > 0) next();
      else if (e.deltaY < 0) prev();
      setTimeout(() => { isScrolling = false; }, 800);
    };
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isZoomedIn]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isZoomedIn) return;
    if (e.target && (e.target as HTMLElement).tagName.toLowerCase() === 'model-viewer') return;
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isZoomedIn || touchStart === null) return;
    if (e.target && (e.target as HTMLElement).tagName.toLowerCase() === 'model-viewer') return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) next();
    if (diff < -50) prev();
    setTouchStart(null);
  };

  if (!isMounted) return null;

  const angle = 60; 
  const radius = 550; 
  const currentIndex = ((position % ITEMS.length) + ITEMS.length) % ITEMS.length;

  return (
    <div 
      className={styles.carouselContainer}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      
      {/* Side Details Panel (Left) */}
      <div className={`${styles.sidePanel} ${isZoomedIn ? styles.visiblePanel : ''}`}>
         {/* Key forces remounting to trigger the CSS text reveal animation */}
         <h2 key={`title-${currentIndex}`} className={styles.title}>
           {ITEMS[currentIndex].name}
         </h2>
         
         <div key={`stats-${currentIndex}`} className={styles.statsCol}>
            <StatItem label="PRECISION" value={ITEMS[currentIndex].stats.precision} trigger={currentIndex} delay={0.1} />
            <StatItem label="POWER" value={ITEMS[currentIndex].stats.power} trigger={currentIndex} delay={0.2} />
            <StatItem label="EFFICIENCY" value={ITEMS[currentIndex].stats.efficiency} trigger={currentIndex} delay={0.3} />
            <StatItem label="TORQUE" value={ITEMS[currentIndex].stats.torque} trigger={currentIndex} delay={0.4} />
            <StatItem label="DURABILITY" value={ITEMS[currentIndex].stats.durability} trigger={currentIndex} delay={0.5} />
            <StatItem label="CAPACITY" value={ITEMS[currentIndex].stats.capacity} trigger={currentIndex} delay={0.6} />
            <StatItem label="VOLTAGE" value={ITEMS[currentIndex].stats.voltage} trigger={currentIndex} delay={0.7} />
         </div>
      </div>

      {/* Side Controls Panel (Right) */}
      <div className={`${styles.controlsPanel} ${isZoomedIn ? styles.visiblePanel : ''}`}>
         <button onClick={prev} className={styles.navBtn}>&#8593; PREV</button>
         <button onClick={next} className={styles.navBtn}>NEXT &#8595;</button>
         
         <button 
           onClick={(e) => { e.stopPropagation(); onZoomToggle(); }} 
           className={styles.closeBtn}
         >
           MINIMIZE &#10005;
         </button>
      </div>

      <div 
        className={`${styles.zoomWrapper} ${isZoomedIn ? styles.zoomedIn : styles.zoomedOut}`}
        onClick={() => { if (!isZoomedIn) onZoomToggle(); }}
      >
        <div 
          className={styles.stage}
          style={{ transform: `translateZ(${-radius}px) rotateY(${position * -angle}deg)` }}
        >
          {ITEMS.map((item, index) => {
            const itemAngle = index * angle;
            const isActive = index === currentIndex;
            return (
              <div 
                key={item.id} 
                className={`${styles.card} ${isActive ? styles.activeCard : ''}`}
                style={{ transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)` }}
                onClick={(e) => {
                  if (isZoomedIn && !isActive) {
                     e.stopPropagation();
                     let diff = index - currentIndex;
                     if (diff > ITEMS.length / 2) diff -= ITEMS.length;
                     if (diff < -ITEMS.length / 2) diff += ITEMS.length;
                     setPosition(p => p + diff);
                  }
                }}
              >
                {item.is3D ? (
                    (() => {
                      const ModelViewer = 'model-viewer' as any;
                      return (
                        <ModelViewer
                          src={item.src}
                          alt={item.name}
                          auto-rotate="true"
                          rotation-per-second="30deg"
                          camera-controls="camera-controls"
                          interaction-prompt="none"
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            outline: 'none', 
                            pointerEvents: isActive ? 'auto' : 'none' 
                          }}
                          exposure="1.2"
                          shadow-intensity="1"
                          environment-image="neutral"
                        ></ModelViewer>
                      );
                    })()
                ) : (
                  <TiltImage src={item.image as string} alt={item.name} isActive={isActive} isZoomedIn={isZoomedIn} />
                )}
              </div>
            );
          })}
        </div>
        
        {!isZoomedIn && (
          <div className={styles.clickHint}>CLICK TO ENTER</div>
        )}
      </div>

      {/* Bottom Thumbnail Navigation Bar */}
      <div className={`${styles.thumbnailBar} ${isZoomedIn ? styles.visiblePanel : ''}`}>
        {ITEMS.map((item, index) => (
          <div 
            key={item.id} 
            className={`${styles.thumbnail} ${index === currentIndex ? styles.thumbnailActive : ''}`}
            onClick={(e) => {
               e.stopPropagation();
               if (!isZoomedIn) return;
               let diff = index - currentIndex;
               if (diff > ITEMS.length / 2) diff -= ITEMS.length;
               if (diff < -ITEMS.length / 2) diff += ITEMS.length;
               setPosition(p => p + diff);
            }}
          >
            <span className={styles.thumbnailText}>{item.name.split(' ')[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
