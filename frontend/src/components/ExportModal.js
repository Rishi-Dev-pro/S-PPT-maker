import React, { useState, useCallback } from 'react';
import { FiX, FiFileText, FiFile, FiDownload, FiCheck } from 'react-icons/fi';
import './ExportModal.css';

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const SLIDE_W = 960;
const SLIDE_H = 540;
const EXPORT_SCALE = 2;

// ═══════════════════════════════════════════════════════════════
// COLOR UTILITIES
// ═══════════════════════════════════════════════════════════════

function parseColor(color) {
  if (!color) return { hex: '000000', alpha: 1 };
  if (color.startsWith('#')) {
    const h = color.replace('#', '');
    const normalized = h.length === 3 ? h[0]+h[0]+h[1]+h[1]+h[2]+h[2] : h.substring(0, 6);
    return { hex: normalized.toUpperCase(), alpha: 1 };
  }
  const rgbaMatch = color.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1]).toString(16).padStart(2, '0');
    const g = parseInt(rgbaMatch[2]).toString(16).padStart(2, '0');
    const b = parseInt(rgbaMatch[3]).toString(16).padStart(2, '0');
    const alpha = rgbaMatch[4] != null ? parseFloat(rgbaMatch[4]) : 1;
    return { hex: (r + g + b).toUpperCase(), alpha };
  }
  return { hex: '000000', alpha: 1 };
}

function resolveBackgroundHex(bg) {
  if (!bg) return 'FFFFFF';
  if (typeof bg === 'string') {
    if (bg.startsWith('#')) return parseColor(bg).hex;
    return 'FFFFFF';
  }
  const color = bg.color || bg.solid || null;
  if (color) return parseColor(color).hex;
  if (bg.gradient) {
    const m = bg.gradient.match(/#[0-9a-fA-F]{3,8}/);
    if (m) return parseColor(m[0]).hex;
    return 'FFFFFF';
  }
  return 'FFFFFF';
}

function resolveBackgroundCSS(bg) {
  if (!bg) return '#ffffff';
  if (typeof bg === 'string') return bg;
  if (bg.color) return bg.color;
  if (bg.solid) return bg.solid;
  if (bg.gradient) return bg.gradient;
  return '#ffffff';
}

// ═══════════════════════════════════════════════════════════════
// IMAGE ASSET PIPELINE
// ═══════════════════════════════════════════════════════════════

const imageCache = new Map();

function loadImage(src, timeoutMs = 15000) {
  if (!src) return Promise.reject(new Error('No image source'));
  if (imageCache.has(src)) return imageCache.get(src);

  const promise = new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'sync';
    let timer = null;
    const cleanup = () => { if (timer) { clearTimeout(timer); timer = null; } };

    img.onload = () => {
      cleanup();
      const doResolve = () => {
        if (img.naturalWidth > 0 && img.naturalHeight > 0) resolve(img);
        else reject(new Error(`Image zero dimensions: ${src.substring(0, 80)}`));
      };
      if (img.decode) img.decode().then(doResolve).catch(doResolve);
      else doResolve();
    };

    img.onerror = () => { cleanup(); reject(new Error(`Image load failed: ${src.substring(0, 80)}`)); };
    timer = setTimeout(() => { img.onload = null; img.onerror = null; reject(new Error(`Image timeout: ${src.substring(0, 60)}`)); }, timeoutMs);
    img.src = src;
  });

  imageCache.set(src, promise);
  return promise;
}

function srcToDataUrl(src) {
  if (!src) return Promise.reject(new Error('No source'));
  if (src.startsWith('data:')) return Promise.resolve(src);
  return loadImage(src, 20000).then((img) => {
    const c = document.createElement('canvas');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    c.getContext('2d').drawImage(img, 0, 0);
    return c.toDataURL('image/png');
  });
}

function cropImageToCover(src, boxW, boxH) {
  return loadImage(src, 15000).then((img) => {
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    if (!imgW || !imgH || boxW <= 0 || boxH <= 0) return srcToDataUrl(src);

    const imgAspect = imgW / imgH;
    const boxAspect = boxW / boxH;
    let sx, sy, sw, sh;

    if (imgAspect > boxAspect) {
      sh = imgH;
      sw = imgH * boxAspect;
      sy = 0;
      sx = (imgW - sw) / 2;
    } else {
      sw = imgW;
      sh = imgW / boxAspect;
      sx = 0;
      sy = (imgH - sh) / 2;
    }

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(boxW);
    canvas.height = Math.round(boxH);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, boxW, boxH);
    return canvas.toDataURL('image/png');
  });
}

// ═══════════════════════════════════════════════════════════════
// CANVAS DRAWING HELPERS
// ═══════════════════════════════════════════════════════════════

function roundedRectPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  if (radius <= 0) { ctx.rect(x, y, w, h); return; }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + radius, radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
  ctx.lineTo(x + radius, y + h);
  ctx.arcTo(x, y + h, x, y + h - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

function drawImageCover(ctx, img, x, y, w, h) {
  const imgW = img.naturalWidth || img.width;
  const imgH = img.naturalHeight || img.height;
  if (!imgW || !imgH || w <= 0 || h <= 0) return;
  const imgAspect = imgW / imgH;
  const boxAspect = w / h;
  let sx, sy, sw, sh;
  if (imgAspect > boxAspect) { sh = imgH; sw = imgH * boxAspect; sy = 0; sx = (imgW - sw) / 2; }
  else { sw = imgW; sh = imgW / boxAspect; sx = 0; sy = (imgH - sh) / 2; }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

// Strip HTML tags for clean text wrapping while preserving line structures
function htmlToPlainText(html) {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<div[^>]*>/gi, '')
    .replace(/<\/p>/gi, '\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function wrapText(ctx, rawContent, x, y, maxWidth, lineHeight) {
  const plain = htmlToPlainText(rawContent);
  const lines = [];
  const paragraphs = plain.split('\n');
  let currentY = y;

  for (const paragraph of paragraphs) {
    if (paragraph.trim() === '') {
      currentY += lineHeight * 0.8;
      continue;
    }
    const words = paragraph.split(/(\s+)/);
    let currentLine = '';
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine + word;
      if (ctx.measureText(testLine).width > maxWidth && currentLine.trim() !== '') {
        lines.push({ text: currentLine.trim(), y: currentY });
        currentLine = word.trimStart();
        currentY += lineHeight;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine.trim()) {
      lines.push({ text: currentLine.trim(), y: currentY });
      currentY += lineHeight;
    }
  }
  return lines;
}

async function waitForFonts() {
  if (document.fonts && document.fonts.ready) await document.fonts.ready;
  await new Promise(r => setTimeout(r, 150));
}

// ═══════════════════════════════════════════════════════════════
// TWO-PHASE CANVAS RENDERER (for PDF/PNG)
// ═══════════════════════════════════════════════════════════════

async function renderSlideToCanvas(slide, canvas) {
  canvas.width = SLIDE_W * EXPORT_SCALE;
  canvas.height = SLIDE_H * EXPORT_SCALE;
  const ctx = canvas.getContext('2d');
  ctx.scale(EXPORT_SCALE, EXPORT_SCALE);

  const elements = slide.elements || [];
  const imageAssets = new Map();
  const imageLoadPromises = [];

  for (const el of elements) {
    if (el.type === 'image' && el.content?.src) {
      const p = loadImage(el.content.src, 15000)
        .then(img => imageAssets.set(el.id, img))
        .catch(err => { console.warn(`Export: image preload failed [${el.id}]: ${err.message}`); imageAssets.set(el.id, null); });
      imageLoadPromises.push(p);
    }
  }
  await Promise.all(imageLoadPromises);

  const bgCSS = resolveBackgroundCSS(slide.background);
  ctx.fillStyle = bgCSS;
  ctx.fillRect(0, 0, SLIDE_W, SLIDE_H);

  // Render elements in their exact array z-index order
  for (const el of elements) {
    switch (el.type) {
      case 'text': drawText(ctx, el); break;
      case 'shape': drawShape(ctx, el); break;
      case 'image': {
        const img = imageAssets.get(el.id);
        if (img) drawImage(ctx, el, img);
        else drawImagePlaceholder(ctx, el);
        break;
      }
      case 'video': drawVideoPlaceholder(ctx, el); break;
      default: break;
    }
  }
}

function drawText(ctx, el) {
  ctx.save();
  ctx.globalAlpha = el.style?.opacity ?? 1;
  const size = el.content.fontSize || 20;
  const weight = (el.content.fontWeight === 'bold' || el.content.fontWeight >= 700) ? 'bold' : 'normal';
  const fontStyle = el.content.fontStyle === 'italic' ? 'italic' : 'normal';
  const family = el.content.fontFamily || 'Inter';
  ctx.font = `${fontStyle} ${weight} ${size}px "${family}", sans-serif`;
  ctx.fillStyle = el.content.color || '#333333';
  const textAlign = el.style?.textAlign || 'left';
  ctx.textAlign = textAlign;
  ctx.textBaseline = 'top';
  const padX = 8, padY = 4;
  const contentWidth = el.width - padX * 2;
  const drawX = el.x + padX;
  const drawY = el.y + padY;
  const lineHeight = size * (el.content.lineHeight || 1.4);

  ctx.save();
  ctx.beginPath();
  ctx.rect(el.x, el.y, el.width, el.height);
  ctx.clip();

  const wrappedLines = wrapText(ctx, el.content.text || '', drawX, drawY, contentWidth, lineHeight);
  for (const line of wrappedLines) {
    let lineX = drawX;
    if (textAlign === 'center') lineX = el.x + el.width / 2;
    else if (textAlign === 'right') lineX = el.x + el.width - padX;
    ctx.fillText(line.text, lineX, line.y);
  }
  ctx.restore();
  ctx.restore();
}

function drawShape(ctx, el) {
  ctx.save();
  ctx.globalAlpha = el.style?.opacity ?? 1;
  ctx.fillStyle = el.content.color || '#7c3aed';

  if (el.content.shapeType === 'circle') {
    ctx.beginPath();
    ctx.ellipse(el.x + el.width / 2, el.y + el.height / 2, el.width / 2, el.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    if (el.content.borderWidth && el.content.borderColor) {
      ctx.lineWidth = el.content.borderWidth;
      ctx.strokeStyle = el.content.borderColor;
      ctx.stroke();
    }
  } else {
    const r = el.content.borderRadius || 0;
    if (r > 0) {
      ctx.beginPath();
      roundedRectPath(ctx, el.x, el.y, el.width, el.height, r);
      ctx.fill();
      if (el.content.borderWidth && el.content.borderColor) {
        ctx.lineWidth = el.content.borderWidth;
        ctx.strokeStyle = el.content.borderColor;
        ctx.stroke();
      }
    } else {
      ctx.fillRect(el.x, el.y, el.width, el.height);
      if (el.content.borderWidth && el.content.borderColor) {
        ctx.lineWidth = el.content.borderWidth;
        ctx.strokeStyle = el.content.borderColor;
        ctx.strokeRect(el.x, el.y, el.width, el.height);
      }
    }
  }
  ctx.restore();
}

function drawImage(ctx, el, img) {
  ctx.save();
  ctx.globalAlpha = el.style?.opacity ?? 1;
  const borderRadius = el.style?.borderRadius || 0;
  if (borderRadius > 0) { ctx.beginPath(); roundedRectPath(ctx, el.x, el.y, el.width, el.height, borderRadius); ctx.clip(); }
  drawImageCover(ctx, img, el.x, el.y, el.width, el.height);
  ctx.restore();
}

function drawImagePlaceholder(ctx, el) {
  ctx.save();
  ctx.globalAlpha = el.style?.opacity ?? 1;
  ctx.fillStyle = '#d4d4d8';
  ctx.fillRect(el.x, el.y, el.width, el.height);
  ctx.fillStyle = '#71717a';
  ctx.font = `${Math.min(14, el.width / 10)}px Inter, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Image', el.x + el.width / 2, el.y + el.height / 2);
  ctx.restore();
}

function drawVideoPlaceholder(ctx, el) {
  ctx.save();
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(el.x, el.y, el.width, el.height);
  const cx = el.x + el.width / 2, cy = el.y + el.height / 2;
  const r = Math.min(28, el.width / 5, el.height / 5);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.moveTo(cx + r * 0.3, cy);
  ctx.lineTo(cx - r * 0.2, cy - r * 0.38);
  ctx.lineTo(cx - r * 0.2, cy + r * 0.38);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = `${Math.min(11, el.width / 20)}px Inter, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText('YouTube Video', cx, el.y + el.height - 8);
  ctx.restore();
}

// ═══════════════════════════════════════════════════════════════
// PPTX EXPORT UTILITIES
// ═══════════════════════════════════════════════════════════════

function pxToInchX(px) { return (px / SLIDE_W) * 10; }
function pxToInchY(px) { return (px / SLIDE_H) * 5.625; }

async function preloadAndCropImages(slides) {
  const cache = new Map();
  const cropTasks = [];

  for (const slide of slides) {
    for (const el of (slide.elements || [])) {
      if (el.type === 'image' && el.content?.src) {
        const key = `${el.content.src}|${el.width}|${el.height}`;
        if (!cache.has(key)) {
          const p = cropImageToCover(el.content.src, el.width, el.height)
            .then(dataUrl => cache.set(key, dataUrl))
            .catch(err => {
              console.warn(`PPTX crop failed [${el.id}]: ${err.message}`);
              return srcToDataUrl(el.content.src)
                .then(raw => cache.set(key, raw))
                .catch(() => cache.set(key, null));
            });
          cropTasks.push(p);
        }
      }
    }
  }

  await Promise.all(cropTasks);
  return cache;
}

// ═══════════════════════════════════════════════════════════════
// EXPORT MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function ExportModal({ slides, title, onClose }) {
  const [exporting, setExporting] = useState(null); // 'pdf' | 'png' | 'pptx' | null
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [done, setDone] = useState(null);

  // ────────────────────────────────
  // PDF EXPORT
  // ────────────────────────────────
  const exportPDF = useCallback(async () => {
    setExporting('pdf');
    setProgress(5);
    setStatusText('Preparing typography...');
    try {
      await waitForFonts();
      const jsPDF = (await import('jspdf')).default;
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'in', format: [10, 5.625] });
      const canvas = document.createElement('canvas');

      for (let i = 0; i < slides.length; i++) {
        setStatusText(`Rendering slide ${i + 1} of ${slides.length}...`);
        setProgress(Math.round(((i + 1) / slides.length) * 90));
        if (i > 0) pdf.addPage([10, 5.625], 'landscape');
        await renderSlideToCanvas(slides[i], canvas);
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 10, 5.625);
      }

      setStatusText('Saving PDF document...');
      setProgress(100);
      pdf.save(`${title || 'presentation'}.pdf`);
      setDone('pdf');
    } catch (err) {
      console.error('PDF export error:', err);
      alert('PDF export failed: ' + err.message);
    }
    setExporting(null);
  }, [slides, title]);

  // ────────────────────────────────
  // PNG EXPORT
  // ────────────────────────────────
  const exportPNG = useCallback(async () => {
    setExporting('png');
    setProgress(5);
    setStatusText('Preparing slide images...');
    try {
      await waitForFonts();
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      const canvas = document.createElement('canvas');

      for (let i = 0; i < slides.length; i++) {
        setStatusText(`Rendering slide image ${i + 1} of ${slides.length}...`);
        setProgress(Math.round(((i + 1) / slides.length) * 85));
        await renderSlideToCanvas(slides[i], canvas);
        const blob = await new Promise(r => canvas.toBlob(r, 'image/png'));
        if (blob) zip.file(`slide-${i + 1}.png`, blob);
      }

      setStatusText('Packaging ZIP archive...');
      setProgress(95);
      const content = await zip.generateAsync({ type: 'blob' });
      const { saveAs } = await import('file-saver');
      saveAs(content, `${title || 'presentation'}.zip`);
      setProgress(100);
      setDone('png');
    } catch (err) {
      console.error('PNG export error:', err);
      alert('PNG export failed: ' + err.message);
    }
    setExporting(null);
  }, [slides, title]);

  // ────────────────────────────────
  // PPTX EXPORT
  // ────────────────────────────────
  const exportPPTX = useCallback(async () => {
    setExporting('pptx');
    setProgress(10);
    setStatusText('Preloading images for PowerPoint...');
    try {
      await waitForFonts();
      const PptxGenJS = (await import('pptxgenjs')).default;
      const pptx = new PptxGenJS();
      pptx.layout = 'LAYOUT_16x9';
      pptx.title = title || 'Presentation';

      const imgCache = await preloadAndCropImages(slides);

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        setStatusText(`Converting slide ${i + 1} of ${slides.length}...`);
        setProgress(15 + Math.round(((i + 1) / slides.length) * 75));

        const presSlide = pptx.addSlide();
        presSlide.background = { color: resolveBackgroundHex(slide.background) };

        for (const el of (slide.elements || [])) {
          const ex = pxToInchX(el.x);
          const ey = pxToInchY(el.y);
          const ew = pxToInchX(el.width);
          const eh = pxToInchY(el.height);
          const transp = el.style?.opacity != null ? Math.round((1 - el.style.opacity) * 100) : 0;

          if (el.type === 'text') {
            const rawText = htmlToPlainText(el.content.text || '');
            presSlide.addText(rawText, {
              x: ex, y: ey, w: ew, h: eh,
              fontSize: el.content.fontSize || 20,
              fontFace: el.content.fontFamily || 'Arial',
              color: parseColor(el.content.color || '#333333').hex,
              bold: el.content.fontWeight === 'bold' || el.content.fontWeight >= 700,
              italic: el.content.fontStyle === 'italic',
              underline: el.content.textDecoration === 'underline',
              align: el.style?.textAlign || 'left',
              valign: 'top',
              wrap: true,
              lineSpacingMultiple: el.content.lineHeight || 1.4,
              transparency: transp,
              margin: 0,
              fit: 'shrink',
            });

          } else if (el.type === 'shape') {
            const shapeColor = parseColor(el.content.color || '#7c3aed');
            const shapeTransp = transp + Math.round((1 - shapeColor.alpha) * 100);
            const opts = {
              x: ex, y: ey, w: ew, h: eh,
              fill: { color: shapeColor.hex, transparency: Math.min(shapeTransp, 100) },
            };
            if (el.content.borderWidth && el.content.borderColor) {
              const bColor = parseColor(el.content.borderColor);
              opts.line = { color: bColor.hex, width: el.content.borderWidth };
            }
            if (el.content.shapeType === 'circle') {
              presSlide.addShape(pptx.shapes.OVAL, opts);
            } else {
              opts.rectRadius = Math.min((el.content.borderRadius || 0) / SLIDE_W * 10, 0.2);
              presSlide.addShape(pptx.shapes.RECTANGLE, opts);
            }

          } else if (el.type === 'image' && el.content?.src) {
            const cropKey = `${el.content.src}|${el.width}|${el.height}`;
            const dataUrl = imgCache.get(cropKey);
            if (!dataUrl) continue;

            try {
              presSlide.addImage({
                data: dataUrl,
                x: ex, y: ey, w: ew, h: eh,
                transparency: transp,
              });
            } catch (err) {
              console.error(`PPTX: image add failed [${el.id}]: ${err.message}`);
            }

          } else if (el.type === 'video' && el.content?.videoId) {
            presSlide.addShape(pptx.shapes.RECTANGLE, {
              x: ex, y: ey, w: ew, h: eh,
              fill: { color: '1A1A1A' },
            });
            presSlide.addText('[YouTube Video]', {
              x: ex, y: ey, w: ew, h: eh,
              fontSize: 14, color: '999999',
              align: 'center', valign: 'middle',
            });
          }
        }
      }

      setStatusText('Generating .pptx file...');
      setProgress(98);
      const blob = await pptx.write({ outputType: 'blob' });
      const { saveAs } = await import('file-saver');
      saveAs(blob, `${title || 'presentation'}.pptx`);
      setProgress(100);
      setDone('pptx');
    } catch (err) {
      console.error('PPTX export error:', err);
      alert('PPTX export failed: ' + err.message);
    }
    setExporting(null);
  }, [slides, title]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="export-modal" onClick={e => e.stopPropagation()}>
        <div className="export-header">
          <h3>Export Presentation</h3>
          <button className="close-btn" onClick={onClose}><FiX size={18} /></button>
        </div>
        <p className="export-subtitle">"{title}" — {slides.length} slide{slides.length !== 1 ? 's' : ''}</p>

        {exporting && (
          <div className="export-progress-container">
            <div className="export-progress-status">{statusText}</div>
            <div className="export-progress-bar">
              <div className="export-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <div className="export-options">
          <button className="export-option" onClick={exportPPTX} disabled={!!exporting}>
            <div className="export-icon pptx"><FiFileText size={26} /></div>
            <div className="export-info">
              <h4>PowerPoint (.pptx)</h4>
              <p>Fully editable file for PowerPoint, Google Slides & Keynote</p>
            </div>
            {done === 'pptx' ? <FiCheck size={18} className="done-icon" /> : exporting === 'pptx' && <span className="spinner" />}
          </button>

          <button className="export-option" onClick={exportPDF} disabled={!!exporting}>
            <div className="export-icon pdf"><FiFile size={26} /></div>
            <div className="export-info">
              <h4>PDF Document (.pdf)</h4>
              <p>High-resolution vector document ready for sharing or printing</p>
            </div>
            {done === 'pdf' ? <FiCheck size={18} className="done-icon" /> : exporting === 'pdf' && <span className="spinner" />}
          </button>

          <button className="export-option" onClick={exportPNG} disabled={!!exporting}>
            <div className="export-icon png"><FiDownload size={26} /></div>
            <div className="export-info">
              <h4>PNG Images (.zip)</h4>
              <p>Individual high-definition slide images packed in a ZIP</p>
            </div>
            {done === 'png' ? <FiCheck size={18} className="done-icon" /> : exporting === 'png' && <span className="spinner" />}
          </button>
        </div>
      </div>
    </div>
  );
}
