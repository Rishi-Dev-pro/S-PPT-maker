import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiLayout, FiArrowRight, FiZap, FiDownload, FiImage, FiLayers } from 'react-icons/fi';
import allTemplates, { getTemplatesByCategory } from '../data/templates';
import './Home.css';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'professional', label: 'Professional' },
  { key: 'modern', label: 'Modern' },
  { key: 'student', label: 'Student' },
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
  const [activeCategory, setActiveCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const handleUseTemplate = (template) => {
    navigate('/editor', { state: { templateId: template.id } });
  };

  const handleBlank = () => {
    navigate('/editor', { state: { blank: true } });
  };

  const displayed = activeCategory === 'all'
    ? allTemplates
    : getTemplatesByCategory(activeCategory);

  return (
    <div className="home">
      {/* Nav */}
      <nav className="navbar">
        <div className="nav-logo">
          <div className="logo-mark">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="url(#logo-grad)" />
              <path d="M8 10h12M8 14h8M8 18h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <defs><linearGradient id="logo-grad" x1="0" y1="0" x2="28" y2="28"><stop stopColor="#7c3aed" /><stop offset="1" stopColor="#a78bfa" /></linearGradient></defs>
            </svg>
          </div>
          <span className="logo-text">S-PPT-Maker</span>
        </div>
        <button className="nav-cta" onClick={handleBlank}>
          <FiPlus size={16} /> New Presentation
        </button>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-badge">
            <FiZap size={14} /> Free forever — no watermarks
          </div>
          <h1>
            Create <span className="gradient-text">stunning</span> presentations<br />
            without the price tag
          </h1>
          <p className="hero-desc">
            Professional templates, powerful editor, instant export.
            No account needed — start creating right away.
          </p>
          <div className="hero-actions">
            <button className="btn-primary-lg" onClick={handleBlank}>
              <FiPlus size={18} /> Start from Scratch
            </button>
            <a href="#templates" className="btn-ghost-lg">
              <FiLayout size={18} /> Browse Templates
            </a>
          </div>
        </div>

        <div className="hero-features">
          <div className="feature-pill"><FiImage size={16} /> Add Images</div>
          <div className="feature-pill"><FiLayers size={16} /> 12 Templates</div>
          <div className="feature-pill"><FiDownload size={16} /> Export PPTX/PDF</div>
        </div>
      </section>

      {/* Templates */}
      <section className="templates-section" id="templates">
        <div className="section-header">
          <h2>Choose a Template</h2>
          <p>Start with a professionally designed template</p>
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

        <div className="templates-grid">
          {displayed.map((template, i) => (
            <TemplateCard key={template.id} template={template} onUse={handleUseTemplate} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="how-section">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <h3>Choose a Template</h3>
            <p>Pick from 12 professionally designed templates</p>
          </div>
          <div className="step-arrow"><FiArrowRight size={20} /></div>
          <div className="step">
            <div className="step-num">2</div>
            <h3>Edit & Customize</h3>
            <p>Add text, images, shapes — make it yours</p>
          </div>
          <div className="step-arrow"><FiArrowRight size={20} /></div>
          <div className="step">
            <div className="step-num">3</div>
            <h3>Download & Share</h3>
            <p>Export as PPTX, PDF, or PNG — no watermarks</p>
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
