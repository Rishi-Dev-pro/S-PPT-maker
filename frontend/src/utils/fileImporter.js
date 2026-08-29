import JSZip from 'jszip';
import { v4 as uuidv4 } from 'uuid';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
}

/**
 * Convert English Metric Units (EMU) to 960x540 canvas coordinates
 * (PowerPoint standard 16:9 is 12,192,000 x 6,858,000 EMU)
 */
function emuToCanvas(emuX, emuY, emuW, emuH, maxSlideW = 12192000, maxSlideH = 6858000) {
  const scaleX = 960 / maxSlideW;
  const scaleY = 540 / maxSlideH;
  return {
    x: Math.max(0, Math.min(920, Math.round(emuX * scaleX))),
    y: Math.max(0, Math.min(500, Math.round(emuY * scaleY))),
    width: Math.max(40, Math.min(960, Math.round(emuW * scaleX))),
    height: Math.max(20, Math.min(540, Math.round(emuH * scaleY))),
  };
}

/**
 * Import and Parse PowerPoint (.pptx) file into Native Slide format
 */
export async function importPptxFile(file, onProgress) {
  onProgress?.('Reading PowerPoint file...', 10);
  const zip = new JSZip();
  const content = await zip.loadAsync(file);

  onProgress?.('Extracting media and slides...', 30);

  // Extract embedded media images
  const mediaMap = {};
  for (const [filename, zipEntry] of Object.entries(content.files)) {
    if (filename.startsWith('ppt/media/') && !zipEntry.dir) {
      const base64 = await zipEntry.async('base64');
      const ext = filename.split('.').pop().toLowerCase();
      const mime = ext === 'png' ? 'image/png' : ext === 'svg' ? 'image/svg+xml' : 'image/jpeg';
      mediaMap[filename.replace('ppt/media/', '')] = `data:${mime};base64,${base64}`;
    }
  }

  // Find all slide XML files
  const slideFiles = Object.keys(content.files)
    .filter(name => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)[0], 10);
      const numB = parseInt(b.match(/\d+/)[0], 10);
      return numA - numB;
    });

  if (slideFiles.length === 0) {
    throw new Error('No slides found in the uploaded PowerPoint file.');
  }

  const slides = [];
  const parser = new DOMParser();

  for (let i = 0; i < slideFiles.length; i++) {
    const slideFileName = slideFiles[i];
    onProgress?.(`Parsing slide ${i + 1} of ${slideFiles.length}...`, 40 + Math.round((i / slideFiles.length) * 50));

    const slideXmlText = await content.files[slideFileName].async('string');
    const xmlDoc = parser.parseFromString(slideXmlText, 'application/xml');

    const elements = [];

    // 1. Extract Shapes and Text boxes
    const spNodes = xmlDoc.getElementsByTagName('p:sp');
    for (let j = 0; j < spNodes.length; j++) {
      const sp = spNodes[j];

      // Extract geometry/position
      const xfrm = sp.getElementsByTagName('a:xfrm')[0];
      const off = xfrm?.getElementsByTagName('a:off')[0];
      const ext = xfrm?.getElementsByTagName('a:ext')[0];

      const emuX = parseInt(off?.getAttribute('x') || '0', 10);
      const emuY = parseInt(off?.getAttribute('y') || '0', 10);
      const emuW = parseInt(ext?.getAttribute('cx') || '2000000', 10);
      const emuH = parseInt(ext?.getAttribute('cy') || '1000000', 10);

      const pos = emuToCanvas(emuX, emuY, emuW, emuH);

      // Extract text lines
      const textParagraphs = sp.getElementsByTagName('a:p');
      const textLines = [];
      let fontSize = 20;
      let fontColor = '#1e293b';
      let isBold = false;

      for (let p = 0; p < textParagraphs.length; p++) {
        const textRuns = textParagraphs[p].getElementsByTagName('a:r');
        let lineText = '';
        for (let r = 0; r < textRuns.length; r++) {
          const run = textRuns[r];
          const tNode = run.getElementsByTagName('a:t')[0];
          if (tNode) lineText += tNode.textContent;

          const rPr = run.getElementsByTagName('a:rPr')[0];
          if (rPr) {
            const sz = rPr.getAttribute('sz');
            if (sz) fontSize = Math.round(parseInt(sz, 10) / 100);
            if (rPr.getAttribute('b') === '1') isBold = true;

            const srgb = rPr.getElementsByTagName('a:srgbClr')[0];
            if (srgb?.getAttribute('val')) fontColor = `#${srgb.getAttribute('val')}`;
          }
        }
        if (lineText.trim()) textLines.push(lineText);
      }

      if (textLines.length > 0) {
        elements.push({
          id: uuidv4(),
          type: 'text',
          x: pos.x,
          y: pos.y,
          width: pos.width,
          height: Math.max(pos.height, textLines.length * 30),
          content: {
            text: textLines.join('\n'),
            fontSize: Math.max(14, Math.min(54, fontSize)),
            fontWeight: isBold ? '700' : 'normal',
            fontFamily: 'Inter',
            color: fontColor,
            lineHeight: 1.4
          },
          style: { textAlign: 'left', opacity: 1 }
        });
      } else if (pos.width > 20 && pos.height > 10) {
        // Decorative Shape
        elements.push({
          id: uuidv4(),
          type: 'shape',
          x: pos.x,
          y: pos.y,
          width: pos.width,
          height: pos.height,
          content: { shapeType: 'rect', color: '#7c3aed', borderRadius: 8 },
          style: { opacity: 0.8 }
        });
      }
    }

    // 2. Extract Pictures / Images
    const picNodes = xmlDoc.getElementsByTagName('p:pic');
    for (let j = 0; j < picNodes.length; j++) {
      const pic = picNodes[j];
      const xfrm = pic.getElementsByTagName('a:xfrm')[0];
      const off = xfrm?.getElementsByTagName('a:off')[0];
      const ext = xfrm?.getElementsByTagName('a:ext')[0];

      const emuX = parseInt(off?.getAttribute('x') || '0', 10);
      const emuY = parseInt(off?.getAttribute('y') || '0', 10);
      const emuW = parseInt(ext?.getAttribute('cx') || '3000000', 10);
      const emuH = parseInt(ext?.getAttribute('cy') || '2000000', 10);

      const pos = emuToCanvas(emuX, emuY, emuW, emuH);

      // Find first available media or placeholder
      const mediaKey = Object.keys(mediaMap)[j] || Object.keys(mediaMap)[0];
      const imgSrc = mediaMap[mediaKey];

      if (imgSrc) {
        elements.push({
          id: uuidv4(),
          type: 'image',
          x: pos.x,
          y: pos.y,
          width: pos.width,
          height: pos.height,
          content: { src: imgSrc },
          style: { borderRadius: 8, opacity: 1 }
        });
      }
    }

    slides.push({
      id: uuidv4(),
      layout: 'custom',
      background: { type: 'solid', color: '#ffffff' },
      elements: elements.length > 0 ? elements : [
        {
          id: uuidv4(),
          type: 'text',
          x: 100, y: 200, width: 760, height: 100,
          content: { text: `Slide ${i + 1}`, fontSize: 36, fontWeight: '700', fontFamily: 'Poppins', color: '#1e293b' },
          style: { textAlign: 'center' }
        }
      ]
    });
  }

  onProgress?.('Done!', 100);
  return slides;
}

/**
 * Import and Parse PDF (.pdf) file by rendering pages to High-Resolution Canvas Slides
 */
export async function importPdfFile(file, onProgress) {
  onProgress?.('Loading PDF document...', 15);
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;

  const numPages = pdfDoc.numPages;
  const slides = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    onProgress?.(`Rendering page ${pageNum} of ${numPages}...`, 20 + Math.round((pageNum / numPages) * 70));

    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: ctx, viewport }).promise;

    const pageImage = canvas.toDataURL('image/png', 0.95);

    slides.push({
      id: uuidv4(),
      layout: 'pdf-page',
      background: { type: 'solid', color: '#ffffff' },
      elements: [
        {
          id: uuidv4(),
          type: 'image',
          x: 0,
          y: 0,
          width: 960,
          height: 540,
          content: { src: pageImage },
          style: { borderRadius: 0, opacity: 1 }
        }
      ]
    });
  }

  onProgress?.('Done!', 100);
  return slides;
}

/**
 * Import Images from a ZIP archive or multiple image files
 */
export async function importImagesZipFile(file, onProgress) {
  onProgress?.('Unpacking images...', 20);
  const zip = new JSZip();
  const content = await zip.loadAsync(file);

  const imageEntries = Object.entries(content.files).filter(([name, entry]) => {
    return !entry.dir && /\.(png|jpe?g|webp|svg|gif)$/i.test(name);
  });

  if (imageEntries.length === 0) {
    throw new Error('No valid image files found inside the ZIP archive.');
  }

  // Sort alphabetically
  imageEntries.sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true }));

  const slides = [];

  for (let i = 0; i < imageEntries.length; i++) {
    const [name, entry] = imageEntries[i];
    onProgress?.(`Processing image ${i + 1} of ${imageEntries.length}...`, 30 + Math.round((i / imageEntries.length) * 60));

    const base64 = await entry.async('base64');
    const ext = name.split('.').pop().toLowerCase();
    const mime = ext === 'png' ? 'image/png' : ext === 'svg' ? 'image/svg+xml' : 'image/jpeg';
    const imgSrc = `data:${mime};base64,${base64}`;

    slides.push({
      id: uuidv4(),
      layout: 'image-slide',
      background: { type: 'solid', color: '#09090b' },
      elements: [
        {
          id: uuidv4(),
          type: 'image',
          x: 80,
          y: 40,
          width: 800,
          height: 460,
          content: { src: imgSrc },
          style: { borderRadius: 12, opacity: 1 }
        }
      ]
    });
  }

  onProgress?.('Done!', 100);
  return slides;
}

/**
 * Smart file dispatcher based on file extension
 */
export async function importAnyPresentationFile(file, onProgress) {
  const name = file.name.toLowerCase();

  if (name.endsWith('.pptx')) {
    return await importPptxFile(file, onProgress);
  }
  if (name.endsWith('.pdf')) {
    return await importPdfFile(file, onProgress);
  }
  if (name.endsWith('.zip')) {
    return await importImagesZipFile(file, onProgress);
  }

  throw new Error('Unsupported file format. Please upload a .pptx, .pdf, or .zip file.');
}
