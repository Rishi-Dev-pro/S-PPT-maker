import React, { useState, useRef } from 'react';
import { FiRefreshCw, FiUploadCloud, FiDownload, FiCheck, FiX, FiFile, FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import jsPDF from 'jspdf';
import pptxgen from 'pptxgenjs';
import { importAnyPresentationFile } from '../utils/fileImporter';
import './FormatConverterModal.css';

export default function FormatConverterModal({ onClose }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState('pdf'); // 'pdf' | 'pptx' | 'png'
  const [converting, setConverting] = useState(false);
  const [progressStatus, setProgressStatus] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [convertedResult, setConvertedResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

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
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    setSelectedFile(file);
    setErrorMsg('');
    setConvertedResult(null);

    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'pptx') setTargetFormat('pdf');
    else if (ext === 'pdf') setTargetFormat('pptx');
    else if (ext === 'zip') setTargetFormat('pptx');
  };

  const handleConvert = async () => {
    if (!selectedFile) return;
    setConverting(true);
    setErrorMsg('');
    setProgressPercent(15);
    setProgressStatus('Reading input file...');

    try {
      // 1. Parse slides from input file
      const slides = await importAnyPresentationFile(selectedFile, (status, pct) => {
        setProgressStatus(status);
        setProgressPercent(Math.round(pct * 0.5));
      });

      const baseName = selectedFile.name.replace(/\.[^/.]+$/, '');
      setProgressStatus(`Generating ${targetFormat.toUpperCase()} file...`);
      setProgressPercent(60);

      // 2. Convert to Target Format
      if (targetFormat === 'pptx') {
        const pres = new pptxgen();
        pres.layout = 'LAYOUT_16x9';

        for (let i = 0; i < slides.length; i++) {
          const s = slides[i];
          const pptxSlide = pres.addSlide();
          const bg = s.background?.color || (typeof s.background === 'string' ? s.background : '#ffffff');
          pptxSlide.background = { color: bg.replace('#', '') };

          for (const el of s.elements) {
            const x = (el.x / 960) * 10;
            const y = (el.y / 540) * 5.625;
            const w = (el.width / 960) * 10;
            const h = (el.height / 540) * 5.625;

            if (el.type === 'text') {
              pptxSlide.addText(el.content.text || '', {
                x, y, w, h,
                fontSize: Math.round((el.content.fontSize || 20) * 0.75),
                color: (el.content.color || '#333333').replace('#', ''),
                bold: el.content.fontWeight === 'bold' || el.content.fontWeight >= 700,
                align: el.style?.textAlign || 'left',
              });
            } else if (el.type === 'shape') {
              pptxSlide.addShape(
                el.content.shapeType === 'circle' ? pres.ShapeType.oval : pres.ShapeType.roundRect,
                { x, y, w, h, fill: { color: (el.content.color || '#7c3aed').replace('#', '') } }
              );
            } else if (el.type === 'image' && el.content.src) {
              pptxSlide.addImage({ data: el.content.src, x, y, w, h });
            }
          }
        }

        const outBlob = await pres.write({ outputType: 'blob' });
        saveAs(outBlob, `${baseName}.pptx`);
      } else if (targetFormat === 'pdf') {
        const doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: [960, 540] });

        for (let i = 0; i < slides.length; i++) {
          if (i > 0) doc.addPage([960, 540], 'landscape');
          const s = slides[i];
          const bg = s.background?.color || '#ffffff';
          doc.setFillColor(bg);
          doc.rect(0, 0, 960, 540, 'F');

          for (const el of s.elements) {
            if (el.type === 'text') {
              doc.setFontSize(el.content.fontSize || 20);
              doc.setTextColor(el.content.color || '#333333');
              doc.text(el.content.text || '', el.x + 8, el.y + (el.content.fontSize || 20));
            } else if (el.type === 'shape') {
              doc.setFillColor(el.content.color || '#7c3aed');
              doc.roundedRect(el.x, el.y, el.width, el.height, el.content.borderRadius || 4, el.content.borderRadius || 4, 'F');
            } else if (el.type === 'image' && el.content.src) {
              doc.addImage(el.content.src, 'PNG', el.x, el.y, el.width, el.height);
            }
          }
        }

        doc.save(`${baseName}.pdf`);
      } else if (targetFormat === 'png') {
        const zip = new JSZip();
        for (let i = 0; i < slides.length; i++) {
          const s = slides[i];
          const canvas = document.createElement('canvas');
          canvas.width = 1920;
          canvas.height = 1080;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = s.background?.color || '#ffffff';
          ctx.fillRect(0, 0, 1920, 1080);
          ctx.scale(2, 2);

          for (const el of s.elements) {
            if (el.type === 'text') {
              ctx.font = `${el.content.fontSize || 20}px Inter, sans-serif`;
              ctx.fillStyle = el.content.color || '#333333';
              ctx.fillText(el.content.text?.split('\n')[0] || '', el.x + 8, el.y + (el.content.fontSize || 20));
            } else if (el.type === 'shape') {
              ctx.fillStyle = el.content.color || '#7c3aed';
              ctx.fillRect(el.x, el.y, el.width, el.height);
            }
          }

          const base64 = canvas.toDataURL('image/png').split(',')[1];
          zip.file(`slide_${i + 1}.png`, base64, { base64: true });
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, `${baseName}_images.zip`);
      }

      setProgressPercent(100);
      setProgressStatus('Conversion complete!');
      setConvertedResult(true);
      setConverting(false);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Conversion failed. Please verify the file.');
      setConverting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="converter-modal" onClick={e => e.stopPropagation()}>
        <div className="converter-header">
          <div className="converter-header-title">
            <FiRefreshCw size={20} className="converter-icon-badge" />
            <div>
              <h3>Direct Presentation Converter</h3>
              <p className="converter-subtitle">Fast client-side file conversion • PPTX ↔ PDF ↔ PNG</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}><FiX size={18} /></button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pptx,.pdf,.zip"
          onChange={e => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
          style={{ display: 'none' }}
        />

        <div className="converter-body">
          {!selectedFile ? (
            <div
              className={`dropzone ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="dropzone-icon">
                <FiUploadCloud size={34} />
              </div>
              <h4>Drop file to convert</h4>
              <p>Supports <strong>.PPTX</strong>, <strong>.PDF</strong>, and <strong>.ZIP Images</strong></p>
              <button className="btn-primary-lg" style={{ marginTop: 14, padding: '10px 24px', fontSize: 13 }}>
                Select File
              </button>
            </div>
          ) : (
            <div className="conversion-flow-card">
              <div className="conversion-flow-step">
                <div className="file-chip source">
                  <FiFile size={16} />
                  <span className="file-chip-name">{selectedFile.name}</span>
                </div>
                <div className="flow-arrow">
                  <FiArrowRight size={20} />
                </div>
                <div className="format-picker">
                  <span className="picker-label">Convert to:</span>
                  <div className="format-buttons">
                    <button
                      className={`fmt-btn ${targetFormat === 'pptx' ? 'active' : ''}`}
                      onClick={() => setTargetFormat('pptx')}
                    >
                      .PPTX
                    </button>
                    <button
                      className={`fmt-btn ${targetFormat === 'pdf' ? 'active' : ''}`}
                      onClick={() => setTargetFormat('pdf')}
                    >
                      .PDF
                    </button>
                    <button
                      className={`fmt-btn ${targetFormat === 'png' ? 'active' : ''}`}
                      onClick={() => setTargetFormat('png')}
                    >
                      .PNG (ZIP)
                    </button>
                  </div>
                </div>
              </div>

              {converting && (
                <div className="import-progress-area" style={{ width: '100%', marginTop: 20 }}>
                  <div className="import-progress-label">
                    <span>{progressStatus}</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="export-progress-bar">
                    <div className="export-progress-fill" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              )}

              {convertedResult && (
                <div className="converter-success">
                  <FiCheck size={18} /> File downloaded automatically!
                </div>
              )}

              {errorMsg && (
                <div className="import-error-banner" style={{ width: '100%' }}>
                  <FiAlertCircle size={16} /> {errorMsg}
                </div>
              )}

              <div className="converter-actions">
                <button
                  className="btn-primary-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={handleConvert}
                  disabled={converting}
                >
                  <FiDownload size={16} /> {converting ? 'Converting...' : `Convert & Download ${targetFormat.toUpperCase()}`}
                </button>
                <button
                  className="btn-ghost-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => { setSelectedFile(null); setConvertedResult(null); }}
                >
                  Choose Different File
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="converter-footer">
          <span className="privacy-badge">⚡ Instant client-side conversion • Zero files uploaded to any server</span>
          <button className="topbar-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
