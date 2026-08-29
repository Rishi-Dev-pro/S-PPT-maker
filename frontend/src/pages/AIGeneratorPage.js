import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiZap, FiCheck, FiPlay, FiSave, FiSliders } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import { generatePresentationFromContext } from '../utils/aiSlideGenerator';
import { autoSaveDraft } from '../utils/draftStorage';
import './AIGeneratorPage.css';

const TEMPLATE_STYLES = [
  { id: 'modern', name: 'Modern Violet', desc: 'Sleek, creative & high dynamic range', color: '#7c3aed' },
  { id: 'professional', name: 'Executive Blue', desc: 'Corporate, trust, finance & pitch', color: '#2563eb' },
  { id: 'student', name: 'Academic Emerald', desc: 'Clean, research, science & study', color: '#059669' },
  { id: 'cs', name: 'Cyber Dark', desc: 'High-tech, dev, cloud & algorithm', color: '#38bdf8' },
];

export default function AIGeneratorPage() {
  const navigate = useNavigate();
  const stageRef = useRef(null);
  const [topic, setTopic] = useState('');
  const [context, setContext] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [slideCount, setSlideCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSlides, setGeneratedSlides] = useState(null);
  const [activeSlidePreview, setActiveSlidePreview] = useState(0);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [stageScale, setStageScale] = useState(0.7);

  useEffect(() => {
    const updateStageScale = () => {
      if (stageRef.current) {
        const w = stageRef.current.clientWidth;
        setStageScale(w / 960);
      }
    };
    updateStageScale();
    window.addEventListener('resize', updateStageScale);
    return () => window.removeEventListener('resize', updateStageScale);
  }, [generatedSlides]);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setSaveSuccessMsg('');

    setTimeout(() => {
      const slides = generatePresentationFromContext({
        topic,
        context,
        templateCategory: selectedStyle,
        slideCount
      });

      setGeneratedSlides(slides);
      setActiveSlidePreview(0);
      setIsGenerating(false);
    }, 600);
  };

  const handleOpenInEditor = () => {
    if (!generatedSlides) return;
    navigate('/editor', { state: { aiSlides: generatedSlides, title: topic } });
  };

  const handleSaveToDraft = () => {
    if (!generatedSlides) return;
    const res = autoSaveDraft({ name: topic || 'AI Generated Deck', slides: generatedSlides });
    if (res.success) {
      setSaveSuccessMsg(`✓ Successfully saved to Local Draft Slot ${res.slotIndex + 1}!`);
    } else {
      setSaveSuccessMsg('Draft slots are full (3/3). You can manage them in Drafts page.');
    }
  };

  const currentPreviewSlide = generatedSlides ? generatedSlides[activeSlidePreview] : null;

  return (
    <div className="ai-page">
      <Navbar />

      <div className="ai-page-hero">
        <div className="ai-page-hero-inner">
          <div className="ai-page-badge">
            <FiZap size={14} /> AI Presentation Studio
          </div>
          <h1>Generate Complete Presentations with <span className="gradient-text">AI Context</span></h1>
          <p>Input your topic, key points, and audience details. Our engine synthesizes structured slide decks in seconds.</p>
        </div>
      </div>

      <div className="ai-page-content">
        {/* Left Config Column */}
        <div className="ai-config-panel">
          <div className="panel-card">
            <div className="panel-card-header">
              <FiSliders size={18} className="panel-icon" />
              <h3>Presentation Parameters</h3>
            </div>

            <div className="config-form">
              <div className="form-item">
                <label>Presentation Topic / Title *</label>
                <input
                  className="ai-text-input"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="e.g. Multi-Cloud Resiliency & Kubernetes Architecture"
                />
              </div>

              <div className="form-item">
                <label>Context, Bullet Points & Strategy (Optional)</label>
                <textarea
                  className="ai-text-area"
                  rows={4}
                  value={context}
                  onChange={e => setContext(e.target.value)}
                  placeholder="e.g. Focus on failover orchestration, 99.99% SLA targets, zero-trust edge boundaries, and Q4 infrastructure roadmap..."
                />
              </div>

              <div className="form-item">
                <label>Design Style Theme</label>
                <div className="theme-grid">
                  {TEMPLATE_STYLES.map(style => (
                    <div
                      key={style.id}
                      className={`theme-card ${selectedStyle === style.id ? 'active' : ''}`}
                      onClick={() => setSelectedStyle(style.id)}
                    >
                      <span className="theme-dot" style={{ background: style.color }} />
                      <div className="theme-details">
                        <div className="theme-name">{style.name}</div>
                        <div className="theme-desc">{style.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-item">
                <label>Number of Slides</label>
                <div className="slide-count-tabs">
                  {[3, 5, 8].map(count => (
                    <button
                      key={count}
                      className={`count-tab ${slideCount === count ? 'active' : ''}`}
                      onClick={() => setSlideCount(count)}
                    >
                      {count} Slides {count === 3 ? '(Brief)' : count === 5 ? '(Standard)' : '(Deep Dive)'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="ai-generate-submit-btn"
                disabled={!topic.trim() || isGenerating}
                onClick={handleGenerate}
              >
                <FiZap size={18} /> {isGenerating ? 'Synthesizing Decks...' : 'Generate Deck Now'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Preview Column */}
        <div className="ai-preview-panel">
          {!generatedSlides ? (
            <div className="preview-empty-state">
              <div className="empty-sparkle">
                <FiZap size={36} />
              </div>
              <h3>Live Deck Preview</h3>
              <p>Fill in your topic and parameters on the left to generate structured slides instantly.</p>
              <div className="empty-hints">
                <span>⚡ 100% Client-Side</span>
                <span>✨ Instant 16:9 Canvas</span>
                <span>💾 Save Directly to Drafts</span>
              </div>
            </div>
          ) : (
            <div className="preview-result-container">
              <div className="preview-topbar">
                <div className="preview-meta">
                  <FiCheck size={16} className="text-success" />
                  <h4>{topic}</h4>
                  <span className="slide-count-badge">{generatedSlides.length} Slides</span>
                </div>

                <div className="preview-cta-group">
                  <button className="btn-ghost-lg" style={{ padding: '8px 16px', fontSize: 13 }} onClick={handleSaveToDraft}>
                    <FiSave size={14} /> Save Draft
                  </button>
                  <button className="btn-primary-lg" style={{ padding: '8px 20px', fontSize: 13 }} onClick={handleOpenInEditor}>
                    <FiPlay size={14} /> Open in Designer
                  </button>
                </div>
              </div>

              {saveSuccessMsg && (
                <div className="ai-page-toast">
                  {saveSuccessMsg}
                </div>
              )}

              {/* Main Slide Stage Preview */}
              <div className="slide-stage-canvas" ref={stageRef} style={{ background: currentPreviewSlide?.background?.color || '#ffffff' }}>
                <div
                  className="slide-stage-scaler"
                  style={{
                    width: 960,
                    height: 540,
                    transform: `scale(${stageScale})`,
                    transformOrigin: 'top left',
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }}
                >
                  {currentPreviewSlide?.elements?.map(el => (
                    <div
                      key={el.id}
                      style={{
                        position: 'absolute',
                        left: el.x,
                        top: el.y,
                        width: el.width,
                        height: el.height,
                        background: el.type === 'shape' ? (el.content?.color || '#7c3aed') : 'transparent',
                        borderRadius: el.content?.borderRadius || 0,
                        color: el.content?.color || '#1e293b',
                        fontSize: el.content?.fontSize || 20,
                        fontWeight: el.content?.fontWeight || 'normal',
                        fontFamily: el.content?.fontFamily || 'Inter',
                        textAlign: el.style?.textAlign || 'left',
                        whiteSpace: 'pre-wrap',
                        lineHeight: el.content?.lineHeight || 1.4,
                        padding: el.type === 'text' ? '4px 8px' : 0,
                      }}
                    >
                      {el.type === 'text' && el.content?.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Slide Reel Thumbnails */}
              <div className="slide-reel-bar">
                {generatedSlides.map((slide, idx) => (
                  <div
                    key={slide.id}
                    className={`reel-thumb ${activeSlidePreview === idx ? 'active' : ''}`}
                    onClick={() => setActiveSlidePreview(idx)}
                  >
                    <span className="reel-num">{idx + 1}</span>
                    <div className="reel-preview-mini" style={{ background: slide.background?.color || '#ffffff' }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
