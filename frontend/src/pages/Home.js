import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiLayout, FiArrowRight, FiZap, FiDownload, FiImage, FiLayers } from 'react-icons/fi';
import allTemplates, { getTemplatesByCategory } from '../data/templates';
import TempleScrollExperience from '../components/TempleScrollExperience';
import RollingBlinds from '../components/RollingBlinds';
import RotatingCards from '../components/RotatingCards';
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
  const [activeCategory, setActiveCategory] = useState('all');
  const [showGrid, setShowGrid] = useState(false);

  const handleUseTemplate = (template) => {
    navigate('/editor', { state: { templateId: template.id } });
  };

  const handleBlank = () => {
    navigate('/editor', { state: { blank: true } });
  };

  const scrollToTemplates = () => {
    document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' });
  };

  const displayed = activeCategory === 'all'
    ? allTemplates
    : getTemplatesByCategory(activeCategory);

  return (
    <div className="home">
      {/* Cinematic Temple Experience */}
      <TempleScrollExperience onEnterApp={scrollToTemplates} />

      {/* Transition into app */}
      <section className="temple-transition">
        <RollingBlinds />
        <div className="temple-transition-inner">
          <div className="transition-badge">
            <FiZap size={14} /> Free forever — no watermarks
          </div>
          <h1 className="transition-title">
            Begin Your <span className="gradient-text">Presentation</span>
          </h1>
          <p className="transition-desc">
            Professional templates, powerful editor, instant export.
            No account needed — start creating right away.
          </p>
          <div className="transition-actions">
            <button className="btn-primary-lg" onClick={handleBlank}>
              <FiPlus size={18} /> Start from Scratch
            </button>
            <a href="#templates" className="btn-ghost-lg">
              <FiLayout size={18} /> Browse Templates
            </a>
          </div>
          <div className="transition-features">
            <div className="feature-pill"><FiImage size={16} /> Add Images</div>
            <div className="feature-pill"><FiLayers size={16} /> 16 Templates</div>
            <div className="feature-pill"><FiDownload size={16} /> Export PPTX/PDF</div>
          </div>
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

        <RotatingCards cards={displayed} onCardClick={handleUseTemplate} />

        <div className="show-grid-toggle">
          <button
            className="show-grid-btn"
            onClick={() => setShowGrid(!showGrid)}
          >
            {showGrid ? 'Hide Cards' : activeCategory === 'all' ? 'Show All Cards' : `Show All ${CATEGORIES.find(c => c.key === activeCategory)?.label} Cards`}
          </button>
        </div>

        {showGrid && (
          <div className="templates-grid templates-grid-animated">
            {displayed.map((template, i) => (
              <TemplateCard key={template.id} template={template} onUse={handleUseTemplate} />
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="how-section">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <h3>Choose a Template</h3>
            <p>Pick from 16 professionally designed templates</p>
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
