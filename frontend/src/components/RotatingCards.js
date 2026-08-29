import React, { useRef, useState, useCallback, useEffect } from 'react';
import './RotatingCards.css';

export default function RotatingCards({ cards, onCardClick }) {
  const containerRef = useRef(null);
  const rotationRef = useRef(0);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragStartRef = useRef({ x: 0, rotation: 0 });
  const autoRotateRef = useRef(null);
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);

  const count = cards.length;
  const anglePerCard = 360 / count;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isTablet = typeof window !== 'undefined' && window.innerWidth < 1024;
  const translateZ = isMobile ? 360 : isTablet ? 480 : 600;

  // Auto-rotate when not dragging and not hovered
  useEffect(() => {
    if (isDragging || isHovered) {
      if (autoRotateRef.current) cancelAnimationFrame(autoRotateRef.current);
      return;
    }

    let rafId;
    const autoRotate = () => {
      rotationRef.current -= 0.12;
      setRotation(rotationRef.current);
      rafId = requestAnimationFrame(autoRotate);
    };

    const timeout = setTimeout(() => {
      rafId = requestAnimationFrame(autoRotate);
    }, 2000);

    return () => {
      clearTimeout(timeout);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isDragging, isHovered]);

  // Momentum after drag release
  useEffect(() => {
    if (isDragging) return;

    let rafId;
    const applyMomentum = () => {
      if (Math.abs(velocityRef.current) < 0.01) return;
      velocityRef.current *= 0.94;
      rotationRef.current += velocityRef.current;
      setRotation(rotationRef.current);
      rafId = requestAnimationFrame(applyMomentum);
    };

    if (Math.abs(velocityRef.current) > 0.01) {
      rafId = requestAnimationFrame(applyMomentum);
    }

    return () => { if (rafId) cancelAnimationFrame(rafId); };
  }, [isDragging]);

  const handlePointerDown = useCallback((e) => {
    setIsDragging(true);
    velocityRef.current = 0;
    dragStartRef.current = { x: e.clientX, rotation: rotationRef.current };
    lastXRef.current = e.clientX;
    lastTimeRef.current = Date.now();
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const newRotation = dragStartRef.current.rotation + dx * 0.28;
    rotationRef.current = newRotation;
    setRotation(newRotation);

    const now = Date.now();
    const dt = now - lastTimeRef.current;
    if (dt > 0) {
      velocityRef.current = (e.clientX - lastXRef.current) * 0.28 / Math.max(dt / 16, 1);
    }
    lastXRef.current = e.clientX;
    lastTimeRef.current = now;
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const activeIndex = Math.round(-rotation / anglePerCard) % count;

  return (
    <div
      className="rotating-cards-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="rotating-cards-container"
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div className="rotating-cards-track" style={{ transform: `rotateY(${rotation}deg)` }}>
          {cards.map((card, i) => {
            const angle = i * anglePerCard;
            return (
              <div
                key={card.id}
                className={`rotating-card ${i === ((activeIndex % count) + count) % count ? 'rotating-card-active' : ''}`}
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${translateZ}px)`,
                }}
                onClick={() => {
                  if (Math.abs(velocityRef.current) < 0.6) {
                    onCardClick?.(card);
                  }
                }}
              >
                <div className="rotating-card-inner">
                  <div className="rotating-card-preview" style={{ background: card.thumbnail }}>
                    <div className="rotating-card-stack">
                      {card.slides.slice(0, 3).map((slide, si) => {
                        const bg = slide.background?.includes?.('gradient') || slide.background?.includes?.('linear')
                          ? slide.background
                          : (slide.background?.color || slide.background || '#fff');
                        return (
                          <div key={si} className="rotating-stack-slide" style={{
                            background: bg,
                            transform: `rotate(${(si - 1) * 3}deg) translateY(${-si * 5}px)`,
                            zIndex: 3 - si,
                            opacity: 1 - si * 0.15,
                          }}>
                            {slide.elements.filter(e => e.type === 'text').slice(0, 2).map(el => (
                              <div key={el.id} style={{
                                fontSize: '3px',
                                fontWeight: el.content.fontWeight >= 700 ? '700' : '400',
                                color: el.content.color,
                                padding: '2px 3px',
                                overflow: 'hidden',
                                lineHeight: 1.2,
                              }}>
                                {el.content.text?.split('\n')[0]?.substring(0, 25)}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                    <div className="rotating-card-badge">{card.slides.length} slides</div>
                  </div>
                  <div className="rotating-card-info">
                    <h3>{card.name}</h3>
                    <span className={`rotating-card-cat cat-${card.category}`}>{card.category}</span>
                  </div>
                  <div className="rotating-card-hover">
                    <span>Use Template</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rotating-cards-hint">
        <span>← Drag to explore templates • Click any template to edit →</span>
      </div>
    </div>
  );
}
