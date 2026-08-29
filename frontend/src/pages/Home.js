import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiLayout, FiArrowRight, FiZap, FiDownload, FiImage, FiLayers, FiSearch } from 'react-icons/fi';
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
  const [searchQuery, setSearchQuery] = useState('');
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
      {/* Sticky Global Top Header */}
      <header className="navbar">
        <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
          <div className="logo-mark">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="url(#nav-logo-grad)" />
              <path d="M8 10h12M8 14h8M8 18h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <defs><linearGradient id="nav-logo-grad" x1="0" y1="0" x2="28" y2="28"><stop stopColor="#7c3aed" /><stop offset="1" stopColor="#a78bfa" /></linearGradient></defs>
            </svg>
          </div>
          <span className="logo-text">S-PPT-Maker</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn-ghost-lg" style={{ padding: '8px 18px', fontSize: '13px' }} onClick={scrollToTemplates}>
            <FiLayout size={15} /> Templates
          </button>
          <button className="nav-cta" onClick={handleBlank}>
            <FiPlus size={16} /> Create Presentation
          </button>
        </div>
      </header>

      {/* Cinematic Temple Experience */}
      <TempleScrollExperience onEnterApp={scrollToTemplates} />

      {/* Transition into app */}
      <section className="temple-transition">
        <RollingBlinds />
        <div className="temple-transition-inner">
          <div className="transition-badge">
            <FiZap size={14} /> Free forever — no watermarks, no sign-up
          </div>
          <h1 className="transition-title">
            Begin Your <span className="gradient-text">Presentation</span>
          </h1>
          <p className="transition-desc">
            Modern slide designer, rich text editing, professional templates, and instantaneous export.
          </p>
          <div className="transition-actions">
            <button className="btn-primary-lg" onClick={handleBlank}>
              <FiPlus size={18} /> Start from Scratch
            </button>
            <button onClick={scrollToTemplates} className="btn-ghost-lg">
              <FiLayout size={18} /> Browse 16 Templates
            </button>
          </div>
          <div className="transition-features">
            <div className="feature-pill"><FiImage size={16} /> Rich Media</div>
            <div className="feature-pill"><FiLayers size={16} /> 16 Templates</div>
            <div className="feature-pill"><FiDownload size={16} /> Export PPTX / PDF / PNG</div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="templates-section" id="templates">
        <div className="section-header">
          <h2>Choose a Template</h2>
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
            <h3>Pick a Template</h3>
            <p>Choose from curated academic, tech, and corporate designs</p>
          </div>
          <div className="step-arrow"><FiArrowRight size={20} /></div>
          <div className="step">
            <div className="step-num">2</div>
            <h3>Edit & Customize</h3>
            <p>In-place rich text editing, precision resizing, and shapes</p>
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
