import React, { useRef, useEffect, useState } from 'react';
import './RollingBlinds.css';

const BAND_COUNT = 12;

export default function RollingBlinds() {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const vh = window.innerHeight;
            // Progress: 0 when top enters viewport, 1 when bottom leaves
            const progress = Math.max(0, Math.min(1, 1 - (rect.top / vh)));
            setScrollProgress(progress);
          }
          ticking = false;
        });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="rolling-blinds-container" ref={containerRef}>
      {Array.from({ length: BAND_COUNT }, (_, i) => {
        const bandProgress = Math.max(0, Math.min(1,
          (scrollProgress * BAND_COUNT - i + 2) / 3
        ));
        const height = 30 + bandProgress * 70; // 30% → 100%
        const glowOpacity = bandProgress * 0.6;
        const delay = i * 0.04;

        return (
          <div
            key={i}
            className="rolling-blind-band"
            style={{
              height: `${height}%`,
              transition: `height 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
            }}
          >
            <div
              className="blind-glow"
              style={{
                opacity: glowOpacity,
                transition: `opacity 0.5s ease ${delay}s`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
