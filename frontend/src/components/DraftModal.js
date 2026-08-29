import React, { useState, useEffect } from 'react';
import { FiClock, FiTrash2, FiSave, FiCheck, FiFolder, FiX, FiLayers } from 'react-icons/fi';
import { getDrafts, saveDraftToSlot, deleteDraft } from '../utils/draftStorage';
import './DraftModal.css';

export default function DraftModal({
  mode = 'manage', // 'manage' | 'save'
  currentData = null, // { name, slides } if mode === 'save'
  onSelectDraft, // (draft) => void
  onSaved, // (slotIndex) => void
  onClose
}) {
  const [drafts, setDrafts] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    setDrafts(getDrafts());
  }, []);

  const handleSaveToSlot = (slotIndex) => {
    if (!currentData) return;
    const res = saveDraftToSlot(slotIndex, currentData);
    if (res.success) {
      setDrafts(getDrafts());
      setFeedbackMsg(`Saved successfully to Slot ${slotIndex + 1}!`);
      setTimeout(() => {
        onSaved?.(slotIndex);
        onClose();
      }, 700);
    }
  };

  const handleDeleteSlot = (e, slotIndex) => {
    e.stopPropagation();
    deleteDraft(slotIndex);
    setDrafts(getDrafts());
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="draft-modal" onClick={e => e.stopPropagation()}>
        <div className="draft-header">
          <div className="draft-header-title">
            <FiFolder size={20} className="draft-icon-badge" />
            <div>
              <h3>{mode === 'save' ? 'Save to Draft Slot' : 'My Saved Drafts'}</h3>
              <p className="draft-subtitle">
                {mode === 'save'
                  ? 'Choose a slot (Max 3 slots stored locally on this machine)'
                  : 'Resume editing or manage your local drafts (Max 3 slots)'}
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}><FiX size={18} /></button>
        </div>

        {feedbackMsg && (
          <div className="draft-feedback">
            <FiCheck size={16} /> {feedbackMsg}
          </div>
        )}

        <div className="draft-slots-grid">
          {drafts.map((slot, index) => {
            const isCurrentSlotSelected = selectedSlot === index;
            return (
              <div
                key={index}
                className={`draft-slot-card ${slot.isEmpty ? 'empty' : 'occupied'} ${isCurrentSlotSelected ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedSlot(index);
                  if (mode === 'manage' && !slot.isEmpty) {
                    onSelectDraft?.(slot);
                    onClose();
                  }
                }}
              >
                <div className="draft-slot-header">
                  <span className="slot-number-badge">Slot {index + 1}</span>
                  {!slot.isEmpty && (
                    <button
                      className="slot-delete-btn"
                      onClick={(e) => handleDeleteSlot(e, index)}
                      title="Clear this slot"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  )}
                </div>

                {slot.isEmpty ? (
                  <div className="empty-slot-body">
                    <div className="empty-slot-icon">
                      <FiSave size={24} />
                    </div>
                    <span className="empty-slot-label">Empty Slot</span>
                    <span className="empty-slot-desc">Available for new draft</span>
                    {mode === 'save' && (
                      <button
                        className="slot-action-btn primary"
                        onClick={(e) => { e.stopPropagation(); handleSaveToSlot(index); }}
                      >
                        <FiSave size={14} /> Save Here
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="occupied-slot-body">
                    <div className="slot-preview-box" style={{ background: slot.dominantBg || '#ffffff' }}>
                      <div className="mini-preview-content">
                        {slot.slides?.slice(0, 2).map((s, si) => (
                          <div key={si} className="mini-slide-bar" />
                        ))}
                      </div>
                      <span className="slot-slide-count">
                        <FiLayers size={11} /> {slot.slideCount} slides
                      </span>
                    </div>

                    <h4 className="slot-presentation-name">{slot.name}</h4>

                    <div className="slot-meta-row">
                      <FiClock size={12} />
                      <span>{formatDate(slot.updatedAt)}</span>
                    </div>

                    <div className="slot-card-actions">
                      {mode === 'save' ? (
                        <button
                          className="slot-action-btn overwrite"
                          onClick={(e) => { e.stopPropagation(); handleSaveToSlot(index); }}
                        >
                          <FiSave size={14} /> Overwrite Slot {index + 1}
                        </button>
                      ) : (
                        <button
                          className="slot-action-btn primary"
                          onClick={(e) => { e.stopPropagation(); onSelectDraft?.(slot); onClose(); }}
                        >
                          Resume Editing
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="draft-modal-footer">
          <span className="draft-privacy-note">
            🔒 Drafts are saved securely in your browser's local storage. No login required.
          </span>
          <button className="topbar-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
