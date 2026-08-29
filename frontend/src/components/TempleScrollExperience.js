import React, { useRef, useEffect, useState, useCallback } from 'react';
import './TempleScrollExperience.css';

const TOTAL_FRAMES = 270;
const FRAME_BASE_PATH = '/assets/temple-frames/ezgif-frame-';
const FRAME_PADDING = 3; // 001, 002, etc.
const FRAME_EXT = '.jpg';

// Text overlay definitions: [startProgress, endProgress] (0-1)
const TEXT_PHASES = [
  {
    id: 'opening',
    start: 0,
    end: 0.15,
    lines: [
      { text: 'S-PPT-MAKER', className: 'temple-title-main' },
      { text: 'Create presentations worth presenting.', className: 'temple-subtitle' },
      { text: 'Scroll to enter ↓', className: 'temple-scroll-hint' },
    ],
  },
  {
    id: 'approach',
    start: 0.18,
    end: 0.35,
    lines: [
      { text: 'Choose your subject.', className: 'temple-message' },
    ],
  },
  {
    id: 'enter',
    start: 0.38,
    end: 0.58,
    lines: [
      { text: 'Professional templates.', className: 'temple-message' },
      { text: 'Built for your ideas.', className: 'temple-message-sub' },
    ],
  },
  {
    id: 'inside',
    start: 0.62,
    end: 0.82,
    lines: [
      { text: 'Design. Edit. Present.', className: 'temple-message' },
    ],
  },
  {
    id: 'final',
    start: 0.85,
    end: 1.0,
    lines: [
      { text: 'Your presentation awaits.', className: 'temple-message' },
      { text: 'Enter S-PPT-Maker', className: 'temple-cta-text' },
    ],
  },
];

function getFrameUrl(index) {
  const num = String(index + 1).padStart(FRAME_PADDING, '0');
  return `${FRAME_BASE_PATH}${num}${FRAME_EXT}`;
}

export default function TempleScrollExperience({ onEnterApp }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const loadedRef = useRef(new Set());
  const currentFrameRef = useRef(0);
  const rafRef = useRef(null);
  const scrollProgressRef = useRef(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Preload frames progressively
  useEffect(() => {
    framesRef.current = new Array(TOTAL_FRAMES).fill(null);
    let loaded = 0;
    let cancelled = false;

    const loadFrame = (index) => {
      if (cancelled) return Promise.resolve();
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (!cancelled) {
            framesRef.current[index] = img;
            loadedRef.current.add(index);
            loaded++;
            // Update progress
            setLoadingProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
            // Show app after first frame loads (fastest possible)
            if (loaded === 1) {
              setIsLoaded(true);
              // Draw the first frame immediately
              const canvas = canvasRef.current;
              if (canvas) {
                const ctx = canvas.getContext('2d');
                drawFrameOnCanvas(ctx, canvas, img);
              }
            }
          }
          resolve();
        };
        img.onerror = () => {
          loaded++;
          setLoadingProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
          resolve();
        };
        img.src = getFrameUrl(index);
      });
    };

    // Load ALL frames concurrently (browsers handle this efficiently)
    // but in controlled batches to avoid overwhelming the network
    const loadAll = async () => {
      // Batch 1: first 6 frames (critical path)
      const batch1 = [];
      for (let i = 0; i < Math.min(6, TOTAL_FRAMES); i++) {
        batch1.push(loadFrame(i));
      }
      await Promise.all(batch1);

      // Batch 2+: remaining frames in groups of 12
      for (let i = 6; i < TOTAL_FRAMES; i += 12) {
        if (cancelled) break;
        const batch = [];
        for (let j = i; j < Math.min(i + 12, TOTAL_FRAMES); j++) {
          batch.push(loadFrame(j));
        }
        await Promise.all(batch);
      }
    };

    loadAll();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Draw frame on canvas
  const drawFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = framesRef.current[frameIndex];
    if (!img) {
      // Find nearest loaded frame
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const above = frameIndex - offset;
        const below = frameIndex + offset;
        if (above >= 0 && framesRef.current[above]) {
          drawFrameOnCanvas(ctx, canvas, framesRef.current[above]);
          return;
        }
        if (below < TOTAL_FRAMES && framesRef.current[below]) {
          drawFrameOnCanvas(ctx, canvas, framesRef.current[below]);
          return;
        }
      }
      return;
    }
    drawFrameOnCanvas(ctx, canvas, img);
  }, []);

  function drawFrameOnCanvas(ctx, canvas, img) {
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Cover behavior: scale to fill, then crop
    const scale = Math.max(cw / iw, ch / ih);
    const sw = cw / scale;
    const sh = ch / scale;
    const sx = (iw - sw) / 2;
    const sy = (ih - sh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
  }

  // Scroll handler using requestAnimationFrame
  useEffect(() => {
    if (reducedMotion) return;

    let ticking = false;

    const updateFrame = () => {
      const section = sectionRef.current;
      if (!section) { ticking = false; return; }

      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollable = sectionHeight - viewportHeight;

      if (scrollable <= 0) { ticking = false; return; }

      // Progress: 0 when section top hits viewport, 1 when section bottom hits viewport top
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollable));

      scrollProgressRef.current = progress;

      const frameIndex = Math.round(progress * (TOTAL_FRAMES - 1));

      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        drawFrame(frameIndex);
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafRef.current = requestAnimationFrame(updateFrame);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial draw
    updateFrame();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drawFrame, reducedMotion]);

  // Handle reduced motion: show static first frame
  useEffect(() => {
    if (reducedMotion && isLoaded) {
      drawFrame(0);
    }
  }, [reducedMotion, isLoaded, drawFrame]);

  // Calculate text opacity based on scroll progress
  const getPhaseOpacity = (phase) => {
    const p = scrollProgressRef.current;
    if (p < phase.start || p > phase.end) return 0;
    const range = phase.end - phase.start;
    const fadeInEnd = phase.start + range * 0.3;
    const fadeOutStart = phase.end - range * 0.3;

    if (p < fadeInEnd) {
      return (p - phase.start) / (fadeInEnd - phase.start);
    }
    if (p > fadeOutStart) {
      return (phase.end - p) / (phase.end - fadeOutStart);
    }
    return 1;
  };

  // Use state to force re-render for text opacity (only on scroll, throttled)
  const [textProgress, setTextProgress] = useState(0);
  const textRafRef = useRef(null);
  const lastTextUpdateRef = useRef(0);

  useEffect(() => {
    if (reducedMotion) return;

    let ticking = false;
    const onScroll = () => {
      const now = Date.now();
      if (now - lastTextUpdateRef.current < 50) return; // Throttle to 20fps for text
      lastTextUpdateRef.current = now;

      if (!ticking) {
        ticking = true;
        textRafRef.current = requestAnimationFrame(() => {
          setTextProgress(scrollProgressRef.current);
          ticking = false;
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (textRafRef.current) cancelAnimationFrame(textRafRef.current);
    };
  }, [reducedMotion]);

  const computeOpacity = (phase) => {
    const p = textProgress;
    if (p < phase.start || p > phase.end) return 0;
    const range = phase.end - phase.start;
    const fadeInEnd = phase.start + range * 0.25;
    const fadeOutStart = phase.end - range * 0.25;

    // At exact start, show at full opacity (no invisible beginning)
    if (p === phase.start) return 1;

    if (p <= fadeInEnd) {
      return Math.min(1, (p - phase.start) / Math.max(0.001, fadeInEnd - phase.start));
    }
    if (p >= fadeOutStart) {
      return Math.min(1, (phase.end - p) / Math.max(0.001, phase.end - fadeOutStart));
    }
    return 1;
  };

  return (
    <div className="temple-scroll-section" ref={sectionRef}>
      <div className="temple-sticky">
        {/* Canvas for frame rendering */}
        <canvas
          ref={canvasRef}
          className="temple-canvas"
          width={1280}
          height={720}
        />

        {/* Gradient overlays */}
        <div className="temple-overlay-top" />
        <div className="temple-overlay-bottom" />

        {/* Loading bar — subtle top indicator, non-blocking */}
        {loadingProgress < 100 && (
          <div className="temple-loading-bar-container">
            <div className="temple-loading-bar">
              <div className="temple-loading-fill" style={{ width: `${loadingProgress}%` }} />
            </div>
          </div>
        )}

        {/* Text overlays */}
        {TEXT_PHASES.map((phase) => {
          const opacity = reducedMotion ? (phase.id === 'opening' ? 1 : 0) : computeOpacity(phase);
          if (opacity <= 0) return null;
          return (
            <div
              key={phase.id}
              className="temple-text-overlay"
              style={{ opacity }}
            >
              {phase.lines.map((line, i) => (
                <div key={i} className={`temple-text-line ${line.className}`}>
                  {line.className === 'temple-cta-text' ? (
                    <button
                      className="temple-enter-btn"
                      onClick={onEnterApp}
                    >
                      {line.text}
                    </button>
                  ) : (
                    line.text
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
