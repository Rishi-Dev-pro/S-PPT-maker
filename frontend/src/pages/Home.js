import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiPlus, FiLayout, FiArrowRight, FiZap, FiDownload, FiLayers,
  FiSearch, FiFolder, FiTrash2, FiClock, FiPlay, FiRefreshCw, FiUploadCloud
} from 'react-icons/fi';
import allTemplates, { getTemplatesByCategory } from '../data/templates';
import { getDrafts, deleteDraft, getOccupiedDraftCount } from '../utils/draftStorage';
import TempleScrollExperience from '../components/TempleScrollExperience';
import RollingBlinds from '../components/RollingBlinds';
import RotatingCards from '../components/RotatingCards';
import DraftModal from '../components/DraftModal';
import ImportModal from '../components/ImportModal';
import AIGeneratorModal from '../components/AIGeneratorModal';
import FormatConverterModal from '../components/FormatConverterModal';
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

  // Modals state
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showConverterModal, setShowConverterModal] = useState(false);

  // Drafts state
  const [drafts, setDrafts] = useState([]);
  const [draftCount, setDraftCount] = useState(0);

  const reloadDrafts = () => {
    const loaded = getDrafts();
    setDrafts(loaded);
    setDraftCount(getOccupiedDraftCount());
  };

  useEffect(() => {
    reloadDrafts();
  }, []);

  const handleUseTemplate = (template) => {
    navigate('/editor', { state: { templateId: template.id } });
  };

  const handleBlank = () => {
    navigate('/editor', { state: { blank: true } });
  };

  const handleResumeDraft = (draft) => {
    if (!draft?.slides) return;
    navigate('/editor', { state: { draftSlides: draft.slides, title: draft.name } });
  };

  const handleDeleteDraftSlot = (slotIndex, e) => {
    e.stopPropagation();
    if (window.confirm(`Delete draft in Slot ${slotIndex + 1}?`)) {
      deleteDraft(slotIndex);
      reloadDrafts();
    }
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

  const occupiedDrafts = drafts.filter(d => !d.isEmpty);

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

        <div className="nav-actions">
          <button className="nav-tool-btn ai-highlight" onClick={() => setShowAIModal(true)}>
            <FiZap size={14} /> <span>✨ AI Creator</span>
          </button>
          <button className="nav-tool-btn" onClick={() => setShowImportModal(true)}>
            <FiUploadCloud size={14} /> <span>Import</span>
          </button>
          <button className="nav-tool-btn" onClick={() => setShowConverterModal(true)}>
            <FiRefreshCw size={14} /> <span>Converter</span>
          </button>
          <button className="nav-tool-btn" onClick={() => setShowDraftModal(true)}>
            <FiFolder size={14} /> <span>Drafts ({draftCount}/3)</span>
          </button>

          <button className="btn-ghost-lg" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={scrollToTemplates}>
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
            <FiZap size={14} /> Free forever — zero server login, 100% private local storage
          </div>
          <h1 className="transition-title">
            Begin Your <span className="gradient-text">Presentation</span>
          </h1>
          <p className="transition-desc">
            Modern slide designer, AI-powered generation, multi-format import (.pptx, .pdf, .zip), and direct file conversion.
          </p>

          <div className="transition-actions">
            <button className="btn-primary-lg" onClick={handleBlank}>
              <FiPlus size={18} /> Start from Scratch
            </button>
            <button className="btn-ai-hero" onClick={() => setShowAIModal(true)}>
              <FiZap size={18} /> ✨ AI Deck Builder
            </button>
            <button onClick={() => setShowImportModal(true)} className="btn-ghost-lg">
              <FiUploadCloud size={18} /> Import PPTX / PDF
            </button>
          </div>

          <div className="transition-features">
            <div className="feature-pill" onClick={() => setShowDraftModal(true)} style={{ cursor: 'pointer' }}>
              <FiFolder size={16} /> Saved Drafts ({draftCount}/3)
            </div>
            <div className="feature-pill" onClick={() => setShowConverterModal(true)} style={{ cursor: 'pointer' }}>
              <FiRefreshCw size={16} /> Quick Format Converter
            </div>
            <div className="feature-pill"><FiDownload size={16} /> Export PPTX / PDF / PNG</div>
          </div>
        </div>
      </section>

      {/* Saved Drafts Shelf (if any drafts exist) */}
      {occupiedDrafts.length > 0 && (
        <section className="drafts-shelf-section">
          <div className="section-header">
            <div className="drafts-shelf-title">
              <FiFolder size={22} className="shelf-icon" />
              <div>
                <h2>My Saved Drafts ({occupiedDrafts.length}/3)</h2>
                <p>Saved securely in your browser's local storage</p>
              </div>
            </div>
            <button className="btn-ghost-lg" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => setShowDraftModal(true)}>
              Manage Slots
            </button>
          </div>

          <div className="drafts-cards-grid">
            {occupiedDrafts.map(draft => (
              <div key={draft.slotIndex} className="draft-shelf-card" onClick={() => handleResumeDraft(draft)}>
                <div className="draft-shelf-preview" style={{ background: draft.dominantBg || '#1e293b' }}>
                  <div className="draft-shelf-slide-chip">
                    <FiLayers size={12} /> {draft.slideCount} Slides
                  </div>
                  <div className="draft-shelf-play">
                    <FiPlay size={20} />
                  </div>
                </div>

                <div className="draft-shelf-details">
                  <div className="draft-shelf-header">
                    <span className="slot-pill">Slot {draft.slotIndex + 1}</span>
                    <button
                      className="draft-del-btn"
                      onClick={(e) => handleDeleteDraftSlot(draft.slotIndex, e)}
                      title="Delete Draft"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                  <h4 className="draft-shelf-name">{draft.name}</h4>
                  <span className="draft-shelf-date">
                    <FiClock size={11} /> {new Date(draft.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button className="resume-btn">Resume Editing</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
            <h3>Pick or Generate</h3>
            <p>Select a template, generate with AI, or import .pptx, .pdf, or .zip</p>
          </div>
          <div className="step-arrow"><FiArrowRight size={20} /></div>
          <div className="step">
            <div className="step-num">2</div>
            <h3>Edit & Auto-Draft</h3>
            <p>In-place rich text editing, magnetic snapping, and 3-slot draft system</p>
          </div>
          <div className="step-arrow"><FiArrowRight size={20} /></div>
          <div className="step">
            <div className="step-num">3</div>
            <h3>Export or Convert</h3>
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

      {/* Global Action Modals */}
      {showDraftModal && (
        <DraftModal
          mode="manage"
          onSelectDraft={handleResumeDraft}
          onSaved={reloadDrafts}
          onClose={() => { setShowDraftModal(false); reloadDrafts(); }}
        />
      )}

      {showImportModal && (
        <ImportModal
          onImportComplete={({ slides, title }) => {
            navigate('/editor', { state: { importedSlides: slides, title } });
          }}
          onClose={() => { setShowImportModal(false); reloadDrafts(); }}
        />
      )}

      {showAIModal && (
        <AIGeneratorModal
          onGenerated={({ slides, title }) => {
            navigate('/editor', { state: { aiSlides: slides, title } });
          }}
          onClose={() => { setShowAIModal(false); reloadDrafts(); }}
        />
      )}

      {showConverterModal && (
        <FormatConverterModal onClose={() => setShowConverterModal(false)} />
      )}
    </div>
  );
}
