import React, { useState } from 'react';
import { FiZap, FiCheck, FiX, FiPlay, FiSave, FiLayers } from 'react-icons/fi';
import { generatePresentationFromContext } from '../utils/aiSlideGenerator';
import { autoSaveDraft } from '../utils/draftStorage';
import './AIGeneratorModal.css';

const TEMPLATE_STYLES = [
  { id: 'modern', name: 'Modern Violet', desc: 'Sleek, creative & dynamic', color: '#7c3aed' },
  { id: 'professional', name: 'Executive Blue', desc: 'Corporate, finance & trust', color: '#2563eb' },
  { id: 'student', name: 'Academic Emerald', desc: 'Clean, education & research', color: '#059669' },
  { id: 'cs', name: 'Cyber Dark', desc: 'High-tech, dev & coding', color: '#38bdf8' },
];

export default function AIGeneratorModal({ onGenerated, onClose }) {
  const [topic, setTopic] = useState('');
  const [context, setContext] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [slideCount, setSlideCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSlides, setGeneratedSlides] = useState(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      const slides = generatePresentationFromContext({
        topic,
        context,
        templateCategory: selectedStyle,
        slideCount
      });

      setGeneratedSlides(slides);
      setIsGenerating(false);
    }, 600);
  };

  const handleOpenInEditor = () => {
    if (!generatedSlides) return;
    onGenerated?.({ slides: generatedSlides, title: topic });
    onClose();
  };

  const handleSaveToDraft = () => {
    if (!generatedSlides) return;
    const res = autoSaveDraft({ name: topic || 'AI Generated Deck', slides: generatedSlides });
    if (res.success) {
      setSaveSuccessMsg(`Saved to Draft Slot ${res.slotIndex + 1}!`);
    } else {
      setSaveSuccessMsg('Drafts full. Please open in editor to overwrite a slot.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="ai-modal" onClick={e => e.stopPropagation()}>
        <div className="ai-header">
          <div className="ai-header-title">
            <div className="ai-icon-badge">
              <FiZap size={20} />
            </div>
            <div>
              <h3>AI Presentation Creator</h3>
              <p className="ai-subtitle">Enter your topic and context to generate a structured, ready-to-use deck</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}><FiX size={18} /></button>
        </div>

        <div className="ai-body">
          {!generatedSlides ? (
            <div className="ai-form">
              <div className="form-group">
                <label>Presentation Topic or Title *</label>
                <input
                  className="ai-input"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="e.g. AI-Powered Healthcare Diagnostics"
                />
              </div>

              <div className="form-group">
                <label>Context, Audience & Key Points (Optional)</label>
                <textarea
                  className="ai-textarea"
                  rows={3}
                  value={context}
                  onChange={e => setContext(e.target.value)}
                  placeholder="e.g. Focus on early tumor detection, surgical robotics, compliance challenges, and 2027 market milestones..."
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Template Style</label>
                  <div className="style-chips-grid">
                    {TEMPLATE_STYLES.map(style => (
                      <button
                        key={style.id}
                        className={`style-chip ${selectedStyle === style.id ? 'active' : ''}`}
                        onClick={() => setSelectedStyle(style.id)}
                      >
                        <span className="style-color-dot" style={{ background: style.color }} />
                        <div className="style-info">
                          <span className="style-name">{style.name}</span>
                          <span className="style-desc">{style.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ width: 140 }}>
                  <label>Slide Count</label>
                  <select
                    className="ai-select"
                    value={slideCount}
                    onChange={e => setSlideCount(parseInt(e.target.value, 10))}
                  >
                    <option value={3}>3 Slides (Brief)</option>
                    <option value={5}>5 Slides (Standard)</option>
                    <option value={8}>8 Slides (Detailed)</option>
                  </select>
                </div>
              </div>

              <button
                className="btn-primary-lg"
                style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
                disabled={!topic.trim() || isGenerating}
                onClick={handleGenerate}
              >
                <FiZap size={16} /> {isGenerating ? 'Synthesizing Slides...' : 'Generate Presentation'}
              </button>
            </div>
          ) : (
            <div className="ai-result-card">
              <div className="ai-result-badge">
                <FiCheck size={24} />
              </div>
              <h4>Presentation Generated!</h4>
              <p className="ai-result-topic">{topic}</p>
              <div className="import-stats-pill">
                <FiLayers size={13} /> {generatedSlides.length} formatted slides created
              </div>

              {saveSuccessMsg && (
                <div className="save-success-banner">
                  <FiCheck size={14} /> {saveSuccessMsg}
                </div>
              )}

              <div className="ai-result-actions">
                <button
                  className="btn-primary-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={handleOpenInEditor}
                >
                  <FiPlay size={16} /> Open & Customize in Editor
                </button>
                <button
                  className="btn-ghost-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={handleSaveToDraft}
                >
                  <FiSave size={16} /> Save to Local Draft Slot
                </button>
                <button
                  className="btn-ghost-lg"
                  style={{ width: '100%', justifyContent: 'center', opacity: 0.8 }}
                  onClick={() => { setGeneratedSlides(null); setSaveSuccessMsg(''); }}
                >
                  Generate Another
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="ai-footer">
          <span className="privacy-badge">✨ Instant client-side presentation synthesis</span>
          <button className="topbar-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
