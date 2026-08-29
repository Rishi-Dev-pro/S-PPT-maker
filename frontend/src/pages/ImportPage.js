import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiCheck, FiPlay, FiLayers, FiAlertCircle, FiSave } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import { importAnyPresentationFile } from '../utils/fileImporter';
import { autoSaveDraft } from '../utils/draftStorage';
import './ImportPage.css';

export default function ImportPage() {
  const navigate = useNavigate();
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
    setProgressStatus('Reading uploaded file...');

    try {
      const slides = await importAnyPresentationFile(file, (status, percent) => {
        setProgressStatus(status);
        setProgressPercent(percent);
      });

      setParsedSlides(slides);
      setProgressStatus(`Parsed ${slides.length} slides successfully!`);
      setProgressPercent(100);
      setParsing(false);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to import file. Please check file format.');
      setParsing(false);
    }
  };

  const handleOpenInEditor = () => {
    if (!parsedSlides) return;
    const title = selectedFile?.name?.replace(/\.[^/.]+$/, '') || 'Imported Presentation';
    navigate('/editor', { state: { importedSlides: parsedSlides, title } });
  };

  const handleSaveToDraft = () => {
    if (!parsedSlides) return;
    const title = selectedFile?.name?.replace(/\.[^/.]+$/, '') || 'Imported Presentation';
    const res = autoSaveDraft({ name: title, slides: parsedSlides });
    if (res.success) {
      setSaveSuccessMsg(`✓ Saved to Local Draft Slot ${res.slotIndex + 1}!`);
    } else {
      setSaveSuccessMsg('All 3 draft slots are full. You can manage drafts in the Drafts tab.');
    }
  };

  return (
    <div className="import-page">
      <Navbar />

      <div className="import-page-hero">
        <div className="import-page-hero-inner">
          <div className="import-page-badge">
            <FiUploadCloud size={14} /> Multi-Format Import Studio
          </div>
          <h1>Upload PPTX, PDF or Images to <span className="gradient-text">Edit Immediately</span></h1>
          <p>Seamlessly import existing decks or documents into editable canvas slides with vector precision.</p>
        </div>
      </div>

      <div className="import-page-content">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pptx,.pdf,.zip"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />

        <div className="import-card-main">
          {!parsedSlides ? (
            <div
              className={`import-dropzone-large ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !parsing && fileInputRef.current?.click()}
            >
              <div className="import-dropzone-icon">
                <FiUploadCloud size={44} />
              </div>
              <h3>{parsing ? 'Parsing Slides...' : 'Drop your presentation file here'}</h3>
              <p>Supports <strong>PowerPoint (.pptx)</strong>, <strong>PDF (.pdf)</strong>, or <strong>Images (.zip)</strong></p>
              <button className="btn-primary-lg" style={{ marginTop: 18, padding: '12px 28px', fontSize: 14 }} disabled={parsing}>
                Choose File from Computer
              </button>

              <div className="format-chips-showcase">
                <span className="fmt-pill pptx">.PPTX</span>
                <span className="fmt-pill pdf">.PDF</span>
                <span className="fmt-pill zip">.ZIP Images</span>
              </div>
            </div>
          ) : (
            <div className="import-result-stage">
              <div className="import-success-icon-wrap">
                <FiCheck size={28} />
              </div>
              <h3>Presentation Ready for Editing</h3>
              <p className="import-source-filename">{selectedFile?.name}</p>

              <div className="import-slide-stat-pill">
                <FiLayers size={14} /> {parsedSlides.length} editable slides parsed
              </div>

              {saveSuccessMsg && (
                <div className="import-toast-banner">
                  {saveSuccessMsg}
                </div>
              )}

              {/* Parsed Slides Preview Reel */}
              <div className="parsed-slides-reel">
                {parsedSlides.slice(0, 6).map((s, i) => (
                  <div key={s.id || i} className="parsed-slide-card">
                    <span className="slide-num-badge">{i + 1}</span>
                    <div className="parsed-slide-inner" style={{ background: s.background?.color || '#ffffff' }}>
                      {s.elements?.filter(e => e.type === 'text').slice(0, 2).map(el => (
                        <div key={el.id} className="parsed-text-preview">
                          {el.content?.text?.split('\n')[0]?.substring(0, 25)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {parsedSlides.length > 6 && (
                  <div className="parsed-more-card">
                    +{parsedSlides.length - 6} more slides
                  </div>
                )}
              </div>

              <div className="import-result-actions">
                <button className="btn-primary-lg" style={{ width: '100%', justifyContent: 'center', padding: '14px 24px' }} onClick={handleOpenInEditor}>
                  <FiPlay size={18} /> Open & Customize in Slide Designer
                </button>
                <button className="btn-ghost-lg" style={{ width: '100%', justifyContent: 'center' }} onClick={handleSaveToDraft}>
                  <FiSave size={16} /> Save to Local Draft Slot
                </button>
                <button className="btn-ghost-lg" style={{ width: '100%', justifyContent: 'center', opacity: 0.8 }} onClick={() => { setParsedSlides(null); setSaveSuccessMsg(''); }}>
                  Upload Another File
                </button>
              </div>
            </div>
          )}

          {parsing && (
            <div className="import-progress-box">
              <div className="progress-text-row">
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
              <FiAlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
