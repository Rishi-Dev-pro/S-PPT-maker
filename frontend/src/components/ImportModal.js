import React, { useState, useRef } from 'react';
import { FiUploadCloud, FiCheck, FiX, FiPlay, FiLayers, FiAlertCircle } from 'react-icons/fi';
import { importAnyPresentationFile } from '../utils/fileImporter';
import { autoSaveDraft } from '../utils/draftStorage';
import './ImportModal.css';

export default function ImportModal({ onImportComplete, onClose }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [progressStatus, setProgressStatus] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [parsedSlides, setParsedSlides] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    setSelectedFile(file);
    setErrorMsg('');
    setParsing(true);
    setProgressPercent(10);
    setProgressStatus('Reading file...');

    try {
      const slides = await importAnyPresentationFile(file, (status, percent) => {
        setProgressStatus(status);
        setProgressPercent(percent);
      });

      setParsedSlides(slides);
      setProgressStatus(`Successfully parsed ${slides.length} slides!`);
      setProgressPercent(100);
      setParsing(false);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to import file. Please ensure the file is valid.');
      setParsing(false);
    }
  };

  const handleOpenInEditor = () => {
    if (!parsedSlides) return;
    const title = selectedFile?.name?.replace(/\.[^/.]+$/, '') || 'Imported Presentation';
    onImportComplete?.({ slides: parsedSlides, title });
    onClose();
  };

  const handleSaveToDraft = () => {
    if (!parsedSlides) return;
    const title = selectedFile?.name?.replace(/\.[^/.]+$/, '') || 'Imported Presentation';
    const res = autoSaveDraft({ name: title, slides: parsedSlides });
    if (res.success) {
      setSaveSuccessMsg(`Saved to Draft Slot ${res.slotIndex + 1}!`);
    } else if (res.requiresSlotChoice) {
      // Let parent handle slot picking or notify user
      setSaveSuccessMsg('All 3 slots full. Please open in editor to choose a slot to overwrite.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="import-modal" onClick={e => e.stopPropagation()}>
        <div className="import-header">
          <div>
            <h3>Import & Edit Presentation</h3>
            <p className="import-subtitle">Upload PPTX, PDF, or Images ZIP to convert into an editable presentation</p>
          </div>
          <button className="close-btn" onClick={onClose}><FiX size={18} /></button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pptx,.pdf,.zip"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />

        <div className="import-body">
          {!parsedSlides ? (
            <div
              className={`dropzone ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !parsing && fileInputRef.current?.click()}
            >
              <div className="dropzone-icon">
                <FiUploadCloud size={36} />
              </div>
              <h4>{parsing ? 'Parsing File...' : 'Drag & drop your presentation file here'}</h4>
              <p>Supports <strong>PowerPoint (.pptx)</strong>, <strong>PDF (.pdf)</strong>, or <strong>Images (.zip)</strong></p>
              <button className="btn-primary-lg" style={{ marginTop: 14, padding: '10px 24px', fontSize: 13 }} disabled={parsing}>
                Choose File from Computer
              </button>
            </div>
          ) : (
            <div className="import-result-card">
              <div className="import-success-badge">
                <FiCheck size={20} />
              </div>
              <h4>File Ready to Edit</h4>
              <p className="import-file-name">{selectedFile?.name}</p>
              <div className="import-stats-pill">
                <FiLayers size={13} /> {parsedSlides.length} editable slides generated
              </div>

              {saveSuccessMsg && (
                <div className="save-success-banner">
                  <FiCheck size={14} /> {saveSuccessMsg}
                </div>
              )}

              <div className="import-action-buttons">
                <button className="btn-primary-lg" style={{ width: '100%', justifyContent: 'center' }} onClick={handleOpenInEditor}>
                  <FiPlay size={16} /> Open in Slide Designer
                </button>
                <button className="btn-ghost-lg" style={{ width: '100%', justifyContent: 'center' }} onClick={handleSaveToDraft}>
                  Save to Local Draft Slot
                </button>
              </div>
            </div>
          )}

          {parsing && (
            <div className="import-progress-area">
              <div className="import-progress-label">
                <span>{progressStatus}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="export-progress-bar">
                <div className="export-progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="import-error-banner">
              <FiAlertCircle size={16} /> {errorMsg}
            </div>
          )}
        </div>

        <div className="import-footer">
          <div className="format-badges">
            <span className="badge pptx">.PPTX</span>
            <span className="badge pdf">.PDF</span>
            <span className="badge zip">.ZIP Images</span>
          </div>
          <button className="topbar-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
