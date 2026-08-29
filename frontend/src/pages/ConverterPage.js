import React, { useState, useRef } from 'react';
import { FiRefreshCw, FiUploadCloud, FiDownload, FiCheck, FiFile, FiAlertCircle, FiArrowRight, FiShield } from 'react-icons/fi';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import jsPDF from 'jspdf';
import pptxgen from 'pptxgenjs';
import Navbar from '../components/Navbar';
import { importAnyPresentationFile } from '../utils/fileImporter';
import './ConverterPage.css';

export default function ConverterPage() {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState('pdf');
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
      const slides = await importAnyPresentationFile(selectedFile, (status, pct) => {
        setProgressStatus(status);
        setProgressPercent(Math.round(pct * 0.5));
      });

      const baseName = selectedFile.name.replace(/\.[^/.]+$/, '');
      setProgressStatus(`Generating ${targetFormat.toUpperCase()} file...`);
      setProgressPercent(60);

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
      setErrorMsg(err.message || 'Conversion failed. Please verify the file format.');
      setConverting(false);
    }
  };

  return (
    <div className="converter-page">
      <Navbar />

      <div className="converter-page-hero">
        <div className="converter-page-hero-inner">
          <div className="converter-badge">
            <FiRefreshCw size={14} /> Direct Format Converter
          </div>
          <h1>Convert PPTX, PDF & Images <span className="gradient-text">Instantly</span></h1>
          <p>Lightning fast, zero-server conversions done completely in your browser with 100% privacy.</p>
        </div>
      </div>

      <div className="converter-page-content">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pptx,.pdf,.zip"
          onChange={e => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
          style={{ display: 'none' }}
        />

        <div className="converter-card-main">
          {!selectedFile ? (
            <div
              className={`converter-dropzone ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="converter-dropzone-icon">
                <FiUploadCloud size={44} />
              </div>
              <h3>Drag & drop presentation file</h3>
              <p>Supports <strong>PowerPoint (.pptx)</strong>, <strong>PDF (.pdf)</strong>, or <strong>Images (.zip)</strong></p>
              <button className="btn-primary-lg" style={{ marginTop: 18, padding: '12px 28px', fontSize: 14 }}>
                Choose File from Device
              </button>
            </div>
          ) : (
            <div className="converter-flow-box">
              <div className="flow-file-row">
                <div className="source-file-chip">
                  <FiFile size={22} className="source-icon" />
                  <div className="file-info-stack">
                    <span className="file-name-text">{selectedFile.name}</span>
                    <span className="file-size-text">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>

                <div className="flow-direction-indicator">
                  <FiArrowRight size={24} />
                </div>

                <div className="target-format-selector">
                  <span className="target-label">Target Format:</span>
                  <div className="format-pills-row">
                    <button
                      className={`target-pill ${targetFormat === 'pptx' ? 'active' : ''}`}
                      onClick={() => setTargetFormat('pptx')}
                    >
                      .PPTX (PowerPoint)
                    </button>
                    <button
                      className={`target-pill ${targetFormat === 'pdf' ? 'active' : ''}`}
                      onClick={() => setTargetFormat('pdf')}
                    >
                      .PDF (Document)
                    </button>
                    <button
                      className={`target-pill ${targetFormat === 'png' ? 'active' : ''}`}
                      onClick={() => setTargetFormat('png')}
                    >
                      .PNG (ZIP Images)
                    </button>
                  </div>
                </div>
              </div>

              {converting && (
                <div className="converter-progress-section">
                  <div className="progress-text-row">
                    <span>{progressStatus}</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="export-progress-bar">
                    <div className="export-progress-fill" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              )}

              {convertedResult && (
                <div className="converter-complete-banner">
                  <FiCheck size={20} />
                  <span>Success! Your {targetFormat.toUpperCase()} file has been downloaded.</span>
                </div>
              )}

              {errorMsg && (
                <div className="converter-error-banner">
                  <FiAlertCircle size={18} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="converter-action-footer">
                <button
                  className="btn-primary-lg"
                  style={{ width: '100%', justifyContent: 'center', padding: '14px 24px' }}
                  onClick={handleConvert}
                  disabled={converting}
                >
                  <FiDownload size={18} /> {converting ? 'Converting in Browser...' : `Convert & Download ${targetFormat.toUpperCase()}`}
                </button>
                <button
                  className="btn-ghost-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => { setSelectedFile(null); setConvertedResult(null); }}
                >
                  Select Another File
                </button>
              </div>
            </div>
          )}

          <div className="converter-security-badge">
            <FiShield size={16} />
            <span>100% Client-Side Conversion • Files never touch a remote server • Private & Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
}
