import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFolder, FiPlus, FiTrash2, FiPlay, FiClock, FiLayers, FiShield, FiUploadCloud } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import { getDrafts, deleteDraft, clearAllDrafts } from '../utils/draftStorage';
import './DraftsPage.css';

export default function DraftsPage() {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState([]);

  const refreshDrafts = () => {
    setDrafts(getDrafts());
  };

  useEffect(() => {
    refreshDrafts();
  }, []);

  const handleResume = (draft) => {
    if (!draft?.slides) return;
    navigate('/editor', { state: { draftSlides: draft.slides, title: draft.name } });
  };

  const handleDelete = (slotIndex) => {
    if (window.confirm(`Delete draft in Slot ${slotIndex + 1}?`)) {
      deleteDraft(slotIndex);
      refreshDrafts();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all 3 draft slots? This action cannot be undone.')) {
      clearAllDrafts();
      refreshDrafts();
    }
  };

  const occupiedCount = drafts.filter(d => !d.isEmpty).length;

  return (
    <div className="drafts-page">
      <Navbar />

      <div className="drafts-page-hero">
        <div className="drafts-page-hero-inner">
          <div className="drafts-badge">
            <FiFolder size={14} /> Local Storage Draft Manager
          </div>
          <h1>My Saved Presentation <span className="gradient-text">Drafts ({occupiedCount}/3)</span></h1>
          <p>Preserve up to 3 presentation projects in your browser's private storage. Zero sign-up required.</p>
        </div>
      </div>

      <div className="drafts-page-content">
        <div className="drafts-header-actions">
          <div className="slot-indicator">
            <span className="dot active" />
            <span>{occupiedCount} of 3 Slots Occupied</span>
          </div>

          <div className="draft-btn-group">
            {occupiedCount > 0 && (
              <button className="btn-danger-ghost" onClick={handleClearAll}>
                <FiTrash2 size={14} /> Clear All Drafts
              </button>
            )}
            <button className="btn-primary-lg" style={{ padding: '8px 20px', fontSize: 13 }} onClick={() => navigate('/editor', { state: { blank: true } })}>
              <FiPlus size={15} /> Create New
            </button>
          </div>
        </div>

        {/* 3 Large Dedicated Slot Cards */}
        <div className="draft-slots-container">
          {drafts.map((draft, idx) => (
            <div key={idx} className={`draft-slot-card ${draft.isEmpty ? 'empty' : 'occupied'}`}>
              <div className="slot-card-header">
                <span className="slot-badge">Slot {idx + 1}</span>
                {!draft.isEmpty && (
                  <button className="slot-delete-icon" onClick={() => handleDelete(idx)} title="Delete Slot">
                    <FiTrash2 size={14} />
                  </button>
                )}
              </div>

              {!draft.isEmpty ? (
                <div className="slot-card-body">
                  <div className="slot-card-preview" style={{ background: draft.dominantBg || '#1e293b' }} onClick={() => handleResume(draft)}>
                    <div className="slot-card-slide-chip">
                      <FiLayers size={13} /> {draft.slideCount} Slides
                    </div>
                    <div className="slot-play-circle">
                      <FiPlay size={22} />
                    </div>
                  </div>

                  <div className="slot-card-info">
                    <h3 className="slot-title" onClick={() => handleResume(draft)}>{draft.name}</h3>
                    <span className="slot-timestamp">
                      <FiClock size={12} /> Last updated: {new Date(draft.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>

                    <button className="slot-resume-btn" onClick={() => handleResume(draft)}>
                      <FiPlay size={14} /> Resume Editing
                    </button>
                  </div>
                </div>
              ) : (
                <div className="slot-empty-body">
                  <div className="empty-icon-circle">
                    <FiPlus size={28} />
                  </div>
                  <h4>Empty Slot {idx + 1}</h4>
                  <p>Ready to save an exported or in-progress presentation.</p>
                  <div className="empty-slot-actions">
                    <button className="btn-ghost-lg" style={{ padding: '8px 16px', fontSize: 12 }} onClick={() => navigate('/editor', { state: { blank: true } })}>
                      <FiPlus size={13} /> Blank Canvas
                    </button>
                    <button className="btn-ghost-lg" style={{ padding: '8px 16px', fontSize: 12 }} onClick={() => navigate('/import')}>
                      <FiUploadCloud size={13} /> Import File
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="drafts-security-card">
          <FiShield size={18} className="shield-icon" />
          <div className="security-text">
            <h4>Private & Machine-Isolated Storage</h4>
            <p>Drafts are stored exclusively inside your browser's private local cache. No data is ever sent to or readable by external machines.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
