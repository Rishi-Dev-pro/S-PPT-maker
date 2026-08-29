import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiPlus, FiArrowRight, FiZap, FiSearch, FiFolder, FiRefreshCw, FiUploadCloud
} from 'react-icons/fi';
import allTemplates, { getTemplatesByCategory } from '../data/templates';
import { getOccupiedDraftCount } from '../utils/draftStorage';
import TempleScrollExperience from '../components/TempleScrollExperience';
import RollingBlinds from '../components/RollingBlinds';
import RotatingCards from '../components/RotatingCards';
import Navbar from '../components/Navbar';
import './Home.css';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'professional', label: 'Professional' },
  { key: 'modern', label: 'Modern' },
  { key: 'student', label: 'Student' },
  { key: 'cs', label: 'CS' },
];

function TemplateCard({ template, onUse }) {
  return (
    <div className="template-card" onClick={() => onUse(template)}>
      <div className="template-preview" style={{ background: template.thumbnail }}>
        <div className="template-stack">
          {template.slides.slice(0, 3).map((slide, i) => {
            const bg = slide.background?.includes?.('gradient') || slide.background?.includes?.('linear') ? slide.background : (slide.background?.color || slide.background || '#fff');
            return (
              <div key={i} className="stack-slide" style={{
                background: bg,
                transform: `rotate(${(i - 1) * 3}deg) translateY(${-i * 6}px)`,
                zIndex: 3 - i,
                opacity: 1 - i * 0.15
              }}>
                {slide.elements.filter(e => e.type === 'text').slice(0, 2).map(el => (
                  <div key={el.id} style={{
                    fontSize: '3.5px',
                    fontWeight: el.content.fontWeight >= 700 ? '700' : '400',
                    color: el.content.color,
                    padding: '2px 4px',
                    overflow: 'hidden',
                    lineHeight: 1.2,
                  }}>
                    {el.content.text?.split('\n')[0]?.substring(0, 30)}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <div className="template-badge">{template.slides.length} slides</div>
      </div>
      <div className="template-info">
        <h3>{template.name}</h3>
        <p>{template.description}</p>
        <div className="template-meta">
          <span className={`template-cat cat-${template.category}`}>{template.category}</span>
        </div>
      </div>
      <div className="template-overlay">
        <div className="overlay-content">
          <FiPlus size={28} />
          <span>Use Template</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const transitionRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGrid, setShowGrid] = useState(false);
  const [isStickyNavbarVisible, setIsStickyNavbarVisible] = useState(false);
  const [draftCount, setDraftCount] = useState(0);

  useEffect(() => {
    setDraftCount(getOccupiedDraftCount());

    const handleScroll = () => {
      if (!transitionRef.current) return;
      const rect = transitionRef.current.getBoundingClientRect();
      // Reveal navbar only once the temple scroll experience is finished and we enter the transition section
      if (rect.top <= 100) {
        setIsStickyNavbarVisible(true);
      } else {
        setIsStickyNavbarVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUseTemplate = (template) => {
    navigate('/editor', { state: { templateId: template.id } });
  };

  const handleBlank = () => {
    navigate('/editor', { state: { blank: true } });
  };

  const scrollToTemplates = () => {
    document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' });
  };

  const baseTemplates = activeCategory === 'all'
    ? allTemplates
    : getTemplatesByCategory(activeCategory);

  const displayed = searchQuery.trim() === ''
    ? baseTemplates
    : baseTemplates.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="home">
      {/* Sticky Global Navbar - appears ONLY after scrolling past the Temple Scroll Experience */}
      <Navbar isHome={true} isStickyVisible={isStickyNavbarVisible} />

      {/* Cinematic Temple Experience (Fullscreen Scroll) */}
      <TempleScrollExperience onEnterApp={scrollToTemplates} />

      {/* Transition into main presentation suite */}
      <section className="temple-transition" ref={transitionRef}>
        <RollingBlinds />
        <div className="temple-transition-inner">
          <div className="transition-badge">
            <FiZap size={14} /> Free forever — zero login, 100% private browser storage
          </div>
          <h1 className="transition-title">
            Next-Gen <span className="gradient-text">Presentation Suite</span>
          </h1>
          <p className="transition-desc">
            Professional slide designer, AI-powered generation, direct multi-format conversion, and instant PowerPoint / PDF exports.
          </p>

          <div className="transition-actions">
            <button className="btn-primary-lg" onClick={handleBlank}>
              <FiPlus size={18} /> Start from Scratch
            </button>
            <button className="btn-ai-hero" onClick={() => navigate('/ai-generator')}>
              <FiZap size={18} /> ✨ AI Deck Builder
            </button>
            <button onClick={() => navigate('/import')} className="btn-ghost-lg">
              <FiUploadCloud size={18} /> Import File
            </button>
          </div>
        </div>
      </section>

      {/* Modern Dedicated Tools Hub */}
      <section className="tools-hub-section">
        <div className="section-header">
          <h2>Creative Presentation Tools</h2>
          <p>Everything you need to create, convert, and manage slides without clutter</p>
        </div>

        <div className="tools-cards-grid">
          {/* Tool Card 1: AI Generator */}
          <div className="tool-feature-card ai-glow" onClick={() => navigate('/ai-generator')}>
            <div className="tool-card-icon-wrap ai">
              <FiZap size={26} />
            </div>
            <div className="tool-card-body">
              <div className="tool-card-header">
                <h3>AI Presentation Generator</h3>
                <span className="tool-tag ai">Smart AI</span>
              </div>
              <p>Type your topic, key objectives, and audience context. Our engine synthesizes complete styled decks.</p>
              <div className="tool-card-cta">
                <span>Launch AI Studio</span>
                <FiArrowRight size={16} />
              </div>
            </div>
          </div>

          {/* Tool Card 2: Multi-Format Import */}
          <div className="tool-feature-card" onClick={() => navigate('/import')}>
            <div className="tool-card-icon-wrap import">
              <FiUploadCloud size={26} />
            </div>
            <div className="tool-card-body">
              <div className="tool-card-header">
                <h3>Multi-Format Importer</h3>
                <span className="tool-tag import">PPTX • PDF • ZIP</span>
              </div>
              <p>Upload existing PowerPoint files, PDF documents, or image archives into fully editable slide sequences.</p>
              <div className="tool-card-cta">
                <span>Import Presentation</span>
                <FiArrowRight size={16} />
              </div>
            </div>
          </div>

          {/* Tool Card 3: Format Converter */}
          <div className="tool-feature-card" onClick={() => navigate('/converter')}>
            <div className="tool-card-icon-wrap converter">
              <FiRefreshCw size={26} />
            </div>
            <div className="tool-card-body">
              <div className="tool-card-header">
                <h3>Direct Format Converter</h3>
                <span className="tool-tag converter">Instant Conversion</span>
              </div>
              <p>Direct client-side conversion between PPTX, PDF, and high-res PNG ZIPs with 1-click download.</p>
              <div className="tool-card-cta">
                <span>Open Converter</span>
                <FiArrowRight size={16} />
              </div>
            </div>
          </div>

          {/* Tool Card 4: Drafts Manager */}
          <div className="tool-feature-card" onClick={() => navigate('/drafts')}>
            <div className="tool-card-icon-wrap drafts">
              <FiFolder size={26} />
            </div>
            <div className="tool-card-body">
              <div className="tool-card-header">
                <h3>Saved Presentation Drafts</h3>
                <span className="tool-tag drafts">{draftCount}/3 Slots</span>
              </div>
              <p>Save and manage up to 3 presentation projects in your browser's private local storage.</p>
              <div className="tool-card-cta">
                <span>Manage Saved Drafts</span>
                <FiArrowRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Showcase Section */}
      <section className="templates-section" id="templates">
        <div className="section-header">
          <h2>Choose a Designer Template</h2>
          <p>Start with a professionally crafted design or blank canvas</p>
        </div>

        {/* Search & Category Filter */}
        <div className="template-filter-bar">
          <div className="template-search-wrapper">
            <FiSearch size={16} className="search-icon" />
            <input
              className="template-search-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search templates by name, keyword, or topic..."
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>
            )}
          </div>

          <div className="category-tabs">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                className={`cat-tab ${activeCategory === cat.key ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.key)}
              >
                {cat.label}
                <span className="cat-count">
                  {cat.key === 'all' ? allTemplates.length : getTemplatesByCategory(cat.key).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {displayed.length === 0 ? (
          <div className="empty-search">
            <p>No templates found matching "{searchQuery}"</p>
            <button className="btn-ghost-lg" style={{ padding: '8px 20px', fontSize: '13px', marginTop: '12px' }} onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
              Clear Filter
            </button>
          </div>
        ) : (
          <>
            <RotatingCards cards={displayed} onCardClick={handleUseTemplate} />

            <div className="show-grid-toggle">
              <button
                className="show-grid-btn"
                onClick={() => setShowGrid(!showGrid)}
              >
                {showGrid ? 'Hide Template Grid' : activeCategory === 'all' ? 'View All Templates Grid' : `View All ${CATEGORIES.find(c => c.key === activeCategory)?.label} Templates`}
              </button>
            </div>

            {showGrid && (
              <div className="templates-grid templates-grid-animated">
                {displayed.map((template) => (
                  <TemplateCard key={template.id} template={template} onUse={handleUseTemplate} />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* How it works */}
      <section className="how-section">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <h3>Pick or Generate</h3>
            <p>Select a template, generate with AI, or import an existing file</p>
          </div>
          <div className="step-arrow"><FiArrowRight size={20} /></div>
          <div className="step">
            <div className="step-num">2</div>
            <h3>Edit & Design</h3>
            <p>In-place rich text editing, magnetic snapping, and 3-slot draft system</p>
          </div>
          <div className="step-arrow"><FiArrowRight size={20} /></div>
          <div className="step">
            <div className="step-num">3</div>
            <h3>Export Instantly</h3>
            <p>Download as editable PowerPoint (.pptx), PDF, or PNG ZIP</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="url(#logo-grad2)" />
              <path d="M8 10h12M8 14h8M8 18h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <defs><linearGradient id="logo-grad2" x1="0" y1="0" x2="28" y2="28"><stop stopColor="#7c3aed" /><stop offset="1" stopColor="#a78bfa" /></linearGradient></defs>
            </svg>
            <span>S-PPT-Maker</span>
          </div>
          <p>Free presentations. No watermarks. No limits. Open source.</p>
        </div>
      </footer>
    </div>
  );
}
