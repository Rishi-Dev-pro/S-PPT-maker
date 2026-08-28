import React, { useState } from 'react';
import { FiX, FiFileText, FiFile, FiDownload, FiCheck } from 'react-icons/fi';
import './ExportModal.css';

// Render slide to canvas for PDF/PNG export
function renderSlideToCanvas(slide, canvas) {
  return new Promise((resolve) => {
    const ctx = canvas.getContext('2d');
    const W = 960, H = 540;
    canvas.width = W;
    canvas.height = H;

    // Background
    const bgColor = slide.background?.color || slide.background?.solid || '#ffffff';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, W, H);

    // Sort elements by z-order: shapes first, then images, then text
    const sorted = [...(slide.elements || [])].sort((a, b) => {
      const order = { 'shape': 0, 'image': 1, 'image-placeholder': 1, 'video': 2, 'text': 3 };
      return (order[a.type] || 0) - (order[b.type] || 0);
    });

    let pendingImages = 0;
    const checkDone = () => { if (pendingImages === 0) resolve(); };
    checkDone();

    for (const el of sorted) {
      if (el.type === 'text') {
        ctx.save();
        ctx.globalAlpha = el.style?.opacity || 1;
        ctx.fillStyle = el.content.color || '#333';
        const size = el.content.fontSize || 24;
        const weight = el.content.fontWeight >= 700 ? 'bold' : 'normal';
        const style = el.content.fontStyle === 'italic' ? 'italic' : 'normal';
        const family = el.content.fontFamily || 'Inter';
        ctx.font = `${style} ${weight} ${size}px ${family}, sans-serif`;
        ctx.textAlign = el.style?.textAlign || 'left';
        ctx.textBaseline = 'top';
        const x = el.style?.textAlign === 'center' ? el.x + el.width / 2
          : el.style?.textAlign === 'right' ? el.x + el.width : el.x;
        const lines = (el.content.text || '').split('\n');
        const lineHeight = size * (el.content.lineHeight || 1.5);
        lines.forEach((line, i) => {
          ctx.fillText(line, x, el.y + i * lineHeight, el.width);
        });
        ctx.restore();
      } else if (el.type === 'shape') {
        ctx.save();
        ctx.globalAlpha = el.style?.opacity || 1;
        ctx.fillStyle = el.content.color || '#7c3aed';
        if (el.content.shapeType === 'circle') {
          ctx.beginPath();
          ctx.arc(el.x + el.width / 2, el.y + el.height / 2, Math.min(el.width, el.height) / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const r = Math.min(el.content.borderRadius || 0, el.width / 2, el.height / 2);
          if (r > 0) {
            ctx.beginPath();
            ctx.roundRect(el.x, el.y, el.width, el.height, r);
            ctx.fill();
          } else {
            ctx.fillRect(el.x, el.y, el.width, el.height);
          }
        }
        ctx.restore();
      } else if (el.type === 'image' && el.content.src) {
        pendingImages++;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.save();
          ctx.globalAlpha = el.style?.opacity || 1;
          const r = Math.min(el.content.borderRadius || 0, el.width / 2, el.height / 2);
          if (r > 0) {
            ctx.beginPath();
            ctx.roundRect(el.x, el.y, el.width, el.height, r);
            ctx.clip();
          }
          ctx.drawImage(img, el.x, el.y, el.width, el.height);
          ctx.restore();
          pendingImages--;
          checkDone();
        };
        img.onerror = () => {
          // Draw placeholder on error
          ctx.fillStyle = '#f0f0f0';
          ctx.fillRect(el.x, el.y, el.width, el.height);
          ctx.fillStyle = '#999';
          ctx.font = '14px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Image', el.x + el.width / 2, el.y + el.height / 2);
          pendingImages--;
          checkDone();
        };
        img.src = el.content.src;
      } else if (el.type === 'video') {
        // Draw video placeholder
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(el.x, el.y, el.width, el.height);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(el.x + el.width / 2, el.y + el.height / 2, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.moveTo(el.x + el.width / 2 + 8, el.y + el.height / 2);
        ctx.lineTo(el.x + el.width / 2 - 5, el.y + el.height / 2 - 10);
        ctx.lineTo(el.x + el.width / 2 - 5, el.y + el.height / 2 + 10);
        ctx.closePath();
        ctx.fill();
      }
    }
    checkDone();
  });
}

export default function ExportModal({ slides, title, onClose }) {
  const [exporting, setExporting] = useState(null);
  const [done, setDone] = useState(null);

  const exportPPTX = async () => {
    setExporting('pptx');
    try {
      const PptxGenJS = (await import('pptxgenjs')).default;
      const { saveAs } = await import('file-saver');
      const pptx = new PptxGenJS();
      pptx.layout = 'LAYOUT_16x9';
      pptx.title = title;

      for (const slide of slides) {
        const presSlide = pptx.addSlide();

        // Background
        const bgColor = slide.background?.color || slide.background?.solid || '#ffffff';
        presSlide.background = { color: bgColor.replace('#', '') };

        // Sort elements by type for proper layering
        const sorted = [...(slide.elements || [])].sort((a, b) => {
          const order = { 'shape': 0, 'image': 1, 'video': 2, 'text': 3 };
          return (order[a.type] || 0) - (order[b.type] || 0);
        });

        for (const el of sorted) {
          if (el.type === 'text') {
            presSlide.addText(el.content.text || '', {
              x: el.x / 960 * 10, y: el.y / 540 * 5.625,
              w: el.width / 960 * 10, h: el.height / 540 * 5.625,
              fontSize: el.content.fontSize || 24,
              fontFace: el.content.fontFamily || 'Arial',
              color: (el.content.color || '#333333').replace('#', ''),
              bold: el.content.fontWeight >= 700,
              italic: el.content.fontStyle === 'italic',
              align: el.style?.textAlign || 'left',
              valign: 'top',
              lineSpacing: (el.content.lineHeight || 1.5) * 100,
              transparency: el.style?.opacity ? Math.round((1 - el.style.opacity) * 100) : 0,
            });
          } else if (el.type === 'shape') {
            // Skip full-slide background shapes (they're the background)
            if (el.width >= 950 && el.height >= 530) continue;
            const color = (el.content.color || '#7c3aed').replace('#', '');
            if (el.content.shapeType === 'circle') {
              presSlide.addShape(pptx.shapes.OVAL, {
                x: el.x / 960 * 10, y: el.y / 540 * 5.625,
                w: el.width / 960 * 10, h: el.height / 540 * 5.625,
                fill: { color },
                transparency: el.style?.opacity ? Math.round((1 - el.style.opacity) * 100) : 0,
              });
            } else {
              presSlide.addShape(pptx.shapes.RECTANGLE, {
                x: el.x / 960 * 10, y: el.y / 540 * 5.625,
                w: el.width / 960 * 10, h: el.height / 540 * 5.625,
                fill: { color },
                rectRadius: Math.min((el.content.borderRadius || 0) / 960 * 10, 0.2),
                transparency: el.style?.opacity ? Math.round((1 - el.style.opacity) * 100) : 0,
              });
            }
          } else if (el.type === 'image' && el.content.src) {
            try {
              presSlide.addImage({
                data: el.content.src,
                x: el.x / 960 * 10, y: el.y / 540 * 5.625,
                w: el.width / 960 * 10, h: el.height / 540 * 5.625,
                rounding: el.content.borderRadius > 0,
              });
            } catch (e) {
              console.warn('Failed to add image to PPTX:', e);
            }
          } else if (el.type === 'video' && el.content.videoId) {
            // Add YouTube link as shape with text
            presSlide.addText('[Video: YouTube]', {
              x: el.x / 960 * 10, y: el.y / 540 * 5.625,
              w: el.width / 960 * 10, h: el.height / 540 * 5.625,
              fontSize: 14, color: '666666', align: 'center', valign: 'middle',
              fill: { color: '1a1a1a' },
            });
          }
        }
      }

      const blob = await pptx.write({ outputType: 'blob' });
      saveAs(blob, `${title || 'presentation'}.pptx`);
      setDone('pptx');
    } catch (err) {
      console.error('PPTX export error:', err);
      alert('PPTX export failed: ' + err.message);
    }
    setExporting(null);
  };

  const exportPDF = async () => {
    setExporting('pdf');
    try {
      const jsPDF = (await import('jspdf')).default;
      const { saveAs } = await import('file-saver');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [960, 540] });
      const canvas = document.createElement('canvas');

      for (let i = 0; i < slides.length; i++) {
        if (i > 0) pdf.addPage([960, 540], 'landscape');
        await renderSlideToCanvas(slides[i], canvas);
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, 960, 540);
      }

      pdf.save(`${title || 'presentation'}.pdf`);
      setDone('pdf');
    } catch (err) {
      console.error('PDF export error:', err);
      alert('PDF export failed: ' + err.message);
    }
    setExporting(null);
  };

  const exportPNG = async () => {
    setExporting('png');
    try {
      const JSZip = (await import('jszip')).default;
      const { saveAs } = await import('file-saver');
      const zip = new JSZip();
      const canvas = document.createElement('canvas');

      for (let i = 0; i < slides.length; i++) {
        await renderSlideToCanvas(slides[i], canvas);
        const blob = await new Promise(r => canvas.toBlob(r, 'image/png'));
        zip.file(`slide-${i + 1}.png`, blob);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${title || 'presentation'}.zip`);
      setDone('png');
    } catch (err) {
      console.error('PNG export error:', err);
      alert('PNG export failed: ' + err.message);
    }
    setExporting(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="export-modal" onClick={e => e.stopPropagation()}>
        <div className="export-header">
          <h3>Export Presentation</h3>
          <button className="close-btn" onClick={onClose}><FiX size={18} /></button>
        </div>
        <p className="export-subtitle">"{title}" — {slides.length} slides</p>
        <div className="export-options">
          <button className="export-option" onClick={exportPPTX} disabled={!!exporting}>
            <div className="export-icon pptx"><FiFileText size={26} /></div>
            <div className="export-info"><h4>PowerPoint (.pptx)</h4><p>Editable file for PowerPoint, Google Slides, Keynote</p></div>
            {done === 'pptx' ? <FiCheck size={18} className="done-icon" /> : exporting === 'pptx' && <span className="spinner" />}
          </button>
          <button className="export-option" onClick={exportPDF} disabled={!!exporting}>
            <div className="export-icon pdf"><FiFile size={26} /></div>
            <div className="export-info"><h4>PDF Document (.pdf)</h4><p>Universal format for sharing and printing</p></div>
            {done === 'pdf' ? <FiCheck size={18} className="done-icon" /> : exporting === 'pdf' && <span className="spinner" />}
          </button>
          <button className="export-option" onClick={exportPNG} disabled={!!exporting}>
            <div className="export-icon png"><FiDownload size={26} /></div>
            <div className="export-info"><h4>PNG Images (.zip)</h4><p>Individual high-quality slide images</p></div>
            {done === 'png' ? <FiCheck size={18} className="done-icon" /> : exporting === 'png' && <span className="spinner" />}
          </button>
        </div>
      </div>
    </div>
  );
}
