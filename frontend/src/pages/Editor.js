import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiPlus, FiTrash2, FiCopy, FiArrowUp, FiArrowDown, FiDownload,
  FiType, FiSquare, FiCircle, FiImage, FiAlignLeft, FiAlignCenter, FiAlignRight,
  FiBold, FiItalic, FiUnderline, FiArrowLeft, FiChevronDown, FiVideo,
  FiMaximize, FiLayers, FiMove, FiCheck, FiLock, FiUnlock, FiPlay, FiHelpCircle, FiX,
  FiSave, FiFolder, FiZap, FiRefreshCw, FiUploadCloud
} from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import { createSlidesFromTemplate, getTemplateById } from '../data/templates';
import { getOccupiedDraftCount, autoSaveDraft } from '../utils/draftStorage';
import ExportModal from '../components/ExportModal';
import DraftModal from '../components/DraftModal';
import ImportModal from '../components/ImportModal';
import AIGeneratorModal from '../components/AIGeneratorModal';
import FormatConverterModal from '../components/FormatConverterModal';
import './Editor.css';

const FONTS = [
  'Inter', 'Poppins', 'Space Grotesk', 'Arial', 'Georgia',
  'Courier New', 'Verdana', 'Times New Roman', 'Impact', 'Trebuchet MS'
];

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 54, 60, 72, 84];

const PRESET_COLORS = [
  '#000000', '#ffffff', '#1e293b', '#64748b', '#94a3b8',
  '#7c3aed', '#8b5cf6', '#a78bfa', '#6366f1', '#3b82f6',
  '#06b6d4', '#10b981', '#22c55e', '#eab308', '#f97316',
  '#ef4444', '#ec4899', '#f43f5e', '#14b8a6', '#0ea5e9'
];

const SLIDE_LAYOUT_PRESETS = [
  { id: 'blank', name: 'Blank Slide', desc: 'Empty canvas' },
  { id: 'title', name: 'Title Slide', desc: 'Hero heading & subtitle' },
  { id: 'content', name: 'Title & Bullets', desc: 'Header with bulleted list' },
  { id: 'two-column', name: 'Two Columns', desc: 'Side-by-side comparison' },
  { id: 'stats', name: 'Stats & Metrics', desc: '3 key stat highlight cards' },
  { id: 'image-split', name: 'Image & Story', desc: 'Visual card with descriptive text' },
  { id: 'process', name: '3-Step Flow', desc: 'Numbered process flow' },
];

function createBlankSlide() {
  return { id: uuidv4(), elements: [], background: { type: 'solid', color: '#ffffff' }, layout: 'blank' };
}

function createSlideByLayout(layoutType, currentBgColor = '#ffffff') {
  const isDark = currentBgColor === '#000000' || currentBgColor === '#0f172a' || currentBgColor === '#18181b' || currentBgColor === '#09090b';
  const textColor = isDark ? '#f8fafc' : '#1e293b';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const accentColor = '#7c3aed';
  const cardBg = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)';

  switch (layoutType) {
    case 'title':
      return {
        id: uuidv4(),
        background: { type: 'solid', color: currentBgColor },
        layout: 'title',
        elements: [
          { id: uuidv4(), type: 'text', x: 80, y: 160, width: 800, height: 110, content: { text: 'Presentation Title', fontSize: 48, fontWeight: '800', fontFamily: 'Poppins', color: accentColor }, style: { textAlign: 'left' } },
          { id: uuidv4(), type: 'shape', x: 80, y: 285, width: 80, height: 4, content: { shapeType: 'rect', color: accentColor, borderRadius: 2 }, style: {} },
          { id: uuidv4(), type: 'text', x: 80, y: 310, width: 800, height: 60, content: { text: 'Subtitle or presenter name goes here', fontSize: 20, fontWeight: '400', fontFamily: 'Inter', color: textMuted }, style: { textAlign: 'left' } },
        ]
      };
    case 'content':
      return {
        id: uuidv4(),
        background: { type: 'solid', color: currentBgColor },
        layout: 'content',
        elements: [
          { id: uuidv4(), type: 'shape', x: 0, y: 0, width: 8, height: 540, content: { shapeType: 'rect', color: accentColor, borderRadius: 0 }, style: {} },
          { id: uuidv4(), type: 'text', x: 50, y: 40, width: 860, height: 50, content: { text: 'Section Overview', fontSize: 32, fontWeight: '700', fontFamily: 'Poppins', color: accentColor }, style: { textAlign: 'left' } },
          { id: uuidv4(), type: 'shape', x: 50, y: 95, width: 60, height: 3, content: { shapeType: 'rect', color: accentColor, borderRadius: 2 }, style: {} },
          { id: uuidv4(), type: 'text', x: 50, y: 120, width: 860, height: 380, content: { text: '• First key takeaway or primary objective\n• Supporting detail with evidence or background\n• Actionable insight or implementation strategy\n• Next steps and measurable outcomes', fontSize: 18, fontWeight: '400', fontFamily: 'Inter', color: textColor, lineHeight: 1.8 }, style: { textAlign: 'left' } },
        ]
      };
    case 'two-column':
      return {
        id: uuidv4(),
        background: { type: 'solid', color: currentBgColor },
        layout: 'two-column',
        elements: [
          { id: uuidv4(), type: 'text', x: 50, y: 35, width: 860, height: 50, content: { text: 'Comparison & Analysis', fontSize: 30, fontWeight: '700', fontFamily: 'Poppins', color: accentColor }, style: { textAlign: 'left' } },
          { id: uuidv4(), type: 'shape', x: 50, y: 90, width: 60, height: 3, content: { shapeType: 'rect', color: accentColor, borderRadius: 2 }, style: {} },
          { id: uuidv4(), type: 'shape', x: 50, y: 115, width: 410, height: 385, content: { shapeType: 'rect', color: cardBg, borderRadius: 16 }, style: {} },
          { id: uuidv4(), type: 'text', x: 75, y: 135, width: 360, height: 40, content: { text: 'Approach Option A', fontSize: 18, fontWeight: '700', fontFamily: 'Poppins', color: accentColor }, style: { textAlign: 'left' } },
          { id: uuidv4(), type: 'text', x: 75, y: 180, width: 360, height: 300, content: { text: '• High speed of initial deployment\n• Reduced infrastructure overhead\n• Flexible scaling capability', fontSize: 15, fontWeight: '400', fontFamily: 'Inter', color: textColor, lineHeight: 1.7 }, style: { textAlign: 'left' } },
          { id: uuidv4(), type: 'shape', x: 500, y: 115, width: 410, height: 385, content: { shapeType: 'rect', color: cardBg, borderRadius: 16 }, style: {} },
          { id: uuidv4(), type: 'text', x: 525, y: 135, width: 360, height: 40, content: { text: 'Approach Option B', fontSize: 18, fontWeight: '700', fontFamily: 'Poppins', color: accentColor }, style: { textAlign: 'left' } },
          { id: uuidv4(), type: 'text', x: 525, y: 180, width: 360, height: 300, content: { text: '• Greater long-term customizability\n• Dedicated on-premise governance\n• Tailored security compliance', fontSize: 15, fontWeight: '400', fontFamily: 'Inter', color: textColor, lineHeight: 1.7 }, style: { textAlign: 'left' } },
        ]
      };
    case 'stats':
      return {
        id: uuidv4(),
        background: { type: 'solid', color: currentBgColor },
        layout: 'stats',
        elements: [
          { id: uuidv4(), type: 'text', x: 50, y: 35, width: 860, height: 50, content: { text: 'Key Performance Indicators', fontSize: 30, fontWeight: '700', fontFamily: 'Poppins', color: accentColor }, style: { textAlign: 'left' } },
          { id: uuidv4(), type: 'shape', x: 50, y: 90, width: 60, height: 3, content: { shapeType: 'rect', color: accentColor, borderRadius: 2 }, style: {} },
          { id: uuidv4(), type: 'shape', x: 50, y: 130, width: 265, height: 260, content: { shapeType: 'rect', color: themeColorFromBg(currentBgColor), borderRadius: 16 }, style: {} },
          { id: uuidv4(), type: 'text', x: 75, y: 165, width: 215, height: 75, content: { text: '99.9%', fontSize: 44, fontWeight: '800', fontFamily: 'Poppins', color: accentColor }, style: { textAlign: 'left' } },
          { id: uuidv4(), type: 'text', x: 75, y: 245, width: 215, height: 120, content: { text: 'Uptime SLA delivered across all distributed cloud regions.', fontSize: 15, fontWeight: '400', fontFamily: 'Inter', color: textMuted, lineHeight: 1.5 }, style: { textAlign: 'left' } },
          { id: uuidv4(), type: 'shape', x: 345, y: 130, width: 265, height: 260, content: { shapeType: 'rect', color: themeColorFromBg(currentBgColor), borderRadius: 16 }, style: {} },
          { id: uuidv4(), type: 'text', x: 370, y: 165, width: 215, height: 75, content: { text: '4.8x', fontSize: 44, fontWeight: '800', fontFamily: 'Poppins', color: accentColor }, style: { textAlign: 'left' } },
          { id: uuidv4(), type: 'text', x: 370, y: 245, width: 215, height: 120, content: { text: 'Increase in developer deployment throughput per sprint.', fontSize: 15, fontWeight: '400', fontFamily: 'Inter', color: textMuted, lineHeight: 1.5 }, style: { textAlign: 'left' } },
          { id: uuidv4(), type: 'shape', x: 640, y: 130, width: 265, height: 260, content: { shapeType: 'rect', color: themeColorFromBg(currentBgColor), borderRadius: 16 }, style: {} },
          { id: uuidv4(), type: 'text', x: 665, y: 165, width: 215, height: 75, content: { text: '<50ms', fontSize: 44, fontWeight: '800', fontFamily: 'Poppins', color: accentColor }, style: { textAlign: 'left' } },
          { id: uuidv4(), type: 'text', x: 665, y: 245, width: 215, height: 120, content: { text: 'Global edge response latency achieved at 95th percentile.', fontSize: 15, fontWeight: '400', fontFamily: 'Inter', color: textMuted, lineHeight: 1.5 }, style: { textAlign: 'left' } },
        ]
      };
    case 'image-split':
      return {
        id: uuidv4(),
        background: { type: 'solid', color: currentBgColor },
        layout: 'image-split',
        elements: [
          { id: uuidv4(), type: 'shape', x: 40, y: 40, width: 400, height: 460, content: { shapeType: 'rect', color: accentColor, borderRadius: 16 }, style: { opacity: 0.15 } },
          { id: uuidv4(), type: 'text', x: 80, y: 220, width: 320, height: 60, content: { text: '[ Add Image Here ]', fontSize: 18, fontWeight: '600', fontFamily: 'Poppins', color: accentColor }, style: { textAlign: 'center' } },
          { id: uuidv4(), type: 'text', x: 480, y: 80, width: 440, height: 80, content: { text: 'Engaging Headline & Visual Story', fontSize: 32, fontWeight: '800', fontFamily: 'Poppins', color: accentColor, lineHeight: 1.2 }, style: { textAlign: 'left' } },
          { id: uuidv4(), type: 'shape', x: 480, y: 175, width: 60, height: 3, content: { shapeType: 'rect', color: accentColor, borderRadius: 2 }, style: {} },
          { id: uuidv4(), type: 'text', x: 480, y: 200, width: 440, height: 260, content: { text: 'Explain the deeper narrative behind your project, product, or findings. Combine impactful visuals with concise arguments to keep the audience focused on your central thesis.', fontSize: 16, fontWeight: '400', fontFamily: 'Inter', color: textColor, lineHeight: 1.6 }, style: { textAlign: 'left' } },
        ]
      };
    case 'process':
      return {
        id: uuidv4(),
        background: { type: 'solid', color: currentBgColor },
        layout: 'process',
        elements: [
          { id: uuidv4(), type: 'text', x: 50, y: 35, width: 860, height: 50, content: { text: 'Step-by-Step Implementation', fontSize: 30, fontWeight: '700', fontFamily: 'Poppins', color: accentColor }, style: { textAlign: 'left' } },
          { id: uuidv4(), type: 'shape', x: 50, y: 90, width: 60, height: 3, content: { shapeType: 'rect', color: accentColor, borderRadius: 2 }, style: {} },
          { id: uuidv4(), type: 'shape', x: 50, y: 140, width: 260, height: 330, content: { shapeType: 'rect', color: themeColorFromBg(currentBgColor), borderRadius: 16 }, style: {} },
          { id: uuidv4(), type: 'text', x: 75, y: 165, width: 210, height: 50, content: { text: '01', fontSize: 36, fontWeight: '800', fontFamily: 'Poppins', color: accentColor }, style: { textAlign: 'left' } },
          { id: uuidv4(), type: 'text', x: 75, y: 225, width: 210, height: 40, content: { text: 'Discovery & Plan', fontSize: 18, fontWeight: '700', fontFamily: 'Poppins', color: accentColor }, style: { textAlign: 'left' } },
          { id: uuidv4(), type: 'text', x: 75, y: 275, width: 210, height: 160, content: { text: 'Identify constraints, stakeholder requirements, and technical boundaries.', fontSize: 14, fontWeight: '400', fontFamily: 'Inter', color: textMuted, lineHeight: 1.6 }, style: { textAlign: 'left' } },
          { id: uuidv4(), type: 'shape', x: 350, y: 140, width: 260, height: 330, content: { shapeType: 'rect', color: themeColorFromBg(currentBgColor), borderRadius: 16 }, style: {} },
          { id: uuidv4(), type: 'text', x: 375, y: 165, width: 210, height: 50, content: { text: '02', fontSize: 36, fontWeight: '800', fontFamily: 'Poppins', color: accentColor }, style: { textAlign: 'left' } },
          { id: uuidv4(), type: 'text', x: 375, y: 225, width: 210, height: 40, content: { text: 'Build & Iterate', fontSize: 18, fontWeight: '700', fontFamily: 'Poppins', color: accentColor }, style: { textAlign: 'left' } },
          { id: uuidv4(), type: 'text', x: 375, y: 275, width: 210, height: 160, content: { text: 'Rapid prototyping and validation in targeted test environments.', fontSize: 14, fontWeight: '400', fontFamily: 'Inter', color: textMuted, lineHeight: 1.6 }, style: { textAlign: 'left' } },
          { id: uuidv4(), type: 'shape', x: 650, y: 140, width: 260, height: 330, content: { shapeType: 'rect', color: themeColorFromBg(currentBgColor), borderRadius: 16 }, style: {} },
          { id: uuidv4(), type: 'text', x: 675, y: 165, width: 210, height: 50, content: { text: '03', fontSize: 36, fontWeight: '800', fontFamily: 'Poppins', color: accentColor }, style: { textAlign: 'left' } },
          { id: uuidv4(), type: 'text', x: 675, y: 225, width: 210, height: 40, content: { text: 'Launch & Scale', fontSize: 18, fontWeight: '700', fontFamily: 'Poppins', color: accentColor }, style: { textAlign: 'left' } },
          { id: uuidv4(), type: 'text', x: 675, y: 275, width: 210, height: 160, content: { text: 'Continuous monitoring, telemetry evaluation, and automated rollout.', fontSize: 14, fontWeight: '400', fontFamily: 'Inter', color: textMuted, lineHeight: 1.6 }, style: { textAlign: 'left' } },
        ]
      };
    case 'blank':
    default:
      return createBlankSlide();
  }
}

function themeColorFromBg(bg) {
  const isDark = bg === '#000000' || bg === '#0f172a' || bg === '#18181b' || bg === '#09090b';
  return isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)';
}

function createBlankElement(type) {
  if (type === 'text') {
    return {
      id: uuidv4(),
      type: 'text',
      x: 100, y: 180, width: 480, height: 80,
      content: { text: 'Double-click to edit text', fontSize: 24, fontWeight: 'normal', fontFamily: 'Inter', color: '#1e293b', lineHeight: 1.4 },
      style: { textAlign: 'left', opacity: 1 }
    };
  }
  if (type === 'rect') {
    return {
      id: uuidv4(),
      type: 'shape',
      x: 200, y: 150, width: 200, height: 150,
      content: { shapeType: 'rect', color: '#7c3aed', borderRadius: 12, borderColor: 'transparent', borderWidth: 0 },
      style: { opacity: 1 }
    };
  }
  if (type === 'circle') {
    return {
      id: uuidv4(),
      type: 'shape',
      x: 250, y: 150, width: 150, height: 150,
      content: { shapeType: 'circle', color: '#ef4444', borderRadius: 999, borderColor: 'transparent', borderWidth: 0 },
      style: { opacity: 1 }
    };
  }
  return null;
}

function textToHtml(text) {
  if (!text) return '';
  if (text.includes('<') && text.includes('>')) return text;
  return text
    .split('\n')
    .map(line => line === '' ? '<br>' : `<div>${line}</div>`)
    .join('');
}

// ── Slide Thumbnail ──
function SlideThumbnail({ slide, index, isActive, onClick, onDelete, onDuplicate, onMoveUp, onMoveDown, total }) {
  const getBg = () => {
    if (typeof slide.background === 'string') return { background: slide.background };
    if (slide.background?.gradient) return { background: slide.background.gradient };
    return { background: slide.background?.color || '#ffffff' };
  };

  return (
    <div className={`slide-thumb ${isActive ? 'active' : ''}`} onClick={onClick}>
      <div className="slide-thumb-preview" style={getBg()}>
        <div style={{
          width: 960,
          height: 540,
          transform: 'scale(0.188)',
          transformOrigin: 'top left',
          position: 'absolute',
          left: 0,
          top: 0,
          pointerEvents: 'none',
          userSelect: 'none',
          overflow: 'hidden',
          ...getBg()
        }}>
          {slide.elements.map(el => {
            const elStyle = {
              position: 'absolute',
              left: el.x,
              top: el.y,
              width: el.width,
              height: el.height,
              opacity: el.style?.opacity ?? 1,
            };

            if (el.type === 'image' && el.content?.src) {
              return (
                <div key={el.id} style={{ ...elStyle, borderRadius: el.style?.borderRadius || 0, overflow: 'hidden' }}>
                  <img src={el.content.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
                </div>
              );
            }

            if (el.type === 'shape') {
              const isCircle = el.content.shapeType === 'circle';
              return (
                <div key={el.id} style={{
                  ...elStyle,
                  background: el.content.color || '#7c3aed',
                  borderRadius: isCircle ? '50%' : (el.content.borderRadius || 0),
                  border: el.content.borderWidth ? `${el.content.borderWidth}px solid ${el.content.borderColor || 'transparent'}` : 'none'
                }} />
              );
            }

            if (el.type === 'text') {
              const textContent = el.content.text || '';
              const isHtml = textContent.includes('<') && textContent.includes('>');
              const textStyle = {
                fontSize: el.content.fontSize || 20,
                fontWeight: el.content.fontWeight || 'normal',
                fontStyle: el.content.fontStyle || 'normal',
                fontFamily: el.content.fontFamily || 'Inter',
                color: el.content.color || '#333',
                textAlign: el.style?.textAlign || 'left',
                lineHeight: el.content.lineHeight || 1.4,
                width: '100%',
                height: '100%',
                padding: '4px 8px',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
                overflow: 'hidden'
              };

              return (
                <div key={el.id} style={elStyle}>
                  {isHtml ? (
                    <div style={textStyle} dangerouslySetInnerHTML={{ __html: textContent }} />
                  ) : (
                    <div style={textStyle}>{textContent}</div>
                  )}
                </div>
              );
            }

            if (el.type === 'video') {
              return (
                <div key={el.id} style={{ ...elStyle, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24 }}>
                  ▶ Video
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
      <div className="slide-thumb-footer">
        <span className="slide-number">{index + 1}</span>
        <div className="slide-thumb-actions" onClick={e => e.stopPropagation()}>
          {index > 0 && <button onClick={onMoveUp} title="Move Up"><FiArrowUp size={12} /></button>}
          {index < total - 1 && <button onClick={onMoveDown} title="Move Down"><FiArrowDown size={12} /></button>}
          <button onClick={onDuplicate} title="Duplicate Slide"><FiCopy size={12} /></button>
          {total > 1 && <button onClick={onDelete} className="del-btn" title="Delete Slide"><FiTrash2 size={12} /></button>}
        </div>
      </div>
    </div>
  );
}

// ── In-Place Editable Element ──
function EditableElement({
  element,
  isSelected,
  onSelect,
  onContextMenu,
  onDrag,
  onDragStart,
  onDragEnd,
  onResize,
  onResizeStart,
  onResizeEnd,
  onTextUpdate,
  scale
}) {
  const [editing, setEditing] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const textRef = useRef(null);
  const dragRef = useRef({ dragging: false, startX: 0, startY: 0, origX: 0, origY: 0, hasMoved: false });
  const resizeRef = useRef({ resizing: false, startX: 0, startY: 0, origW: 0, origH: 0, origX: 0, origY: 0, handle: '', hasResized: false });

  useEffect(() => {
    if (editing && textRef.current) {
      textRef.current.innerHTML = textToHtml(element.content.text || '');
      textRef.current.focus();
      try {
        const range = document.createRange();
        range.selectNodeContents(textRef.current);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      } catch (err) {}
    }
  }, [editing, element.content.text]);

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (element.type === 'text' && !element.isLocked) {
      setEditing(true);
    }
  };

  const handleBlur = (e) => {
    if (!editing) return;
    setEditing(false);
    const newHtml = textRef.current ? textRef.current.innerHTML : '';
    if (newHtml !== element.content.text) {
      onTextUpdate(element.id, newHtml);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      setEditing(false);
      const newHtml = textRef.current ? textRef.current.innerHTML : '';
      onTextUpdate(element.id, newHtml);
    }
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b' || e.key === 'B') {
        document.execCommand('bold', false, null);
        e.preventDefault();
      } else if (e.key === 'i' || e.key === 'I') {
        document.execCommand('italic', false, null);
        e.preventDefault();
      } else if (e.key === 'u' || e.key === 'U') {
        document.execCommand('underline', false, null);
        e.preventDefault();
      }
    }
  };

  const handleMouseDown = (e) => {
    if (editing || element.isLocked) return;
    e.stopPropagation();
    onSelect();

    dragRef.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: element.x,
      origY: element.y,
      hasMoved: false
    };

    setIsInteracting(true);
    onDragStart();

    const handleMouseMove = (ev) => {
      if (!dragRef.current.dragging) return;
      const dx = (ev.clientX - dragRef.current.startX) / scale;
      const dy = (ev.clientY - dragRef.current.startY) / scale;

      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        dragRef.current.hasMoved = true;
      }

      let nextX = Math.round(dragRef.current.origX + dx);
      let nextY = Math.round(dragRef.current.origY + dy);

      const elementMidX = nextX + element.width / 2;
      const elementMidY = nextY + element.height / 2;

      if (Math.abs(elementMidX - 480) < 6) nextX = Math.round(480 - element.width / 2);
      if (Math.abs(elementMidY - 270) < 6) nextY = Math.round(270 - element.height / 2);
      if (Math.abs(nextX - 40) < 6) nextX = 40;
      if (Math.abs(nextX - (920 - element.width)) < 6) nextX = 920 - element.width;
      if (Math.abs(nextY - 40) < 6) nextY = 40;

      onDrag(element.id, Math.max(0, nextX), Math.max(0, nextY));
    };

    const handleMouseUp = () => {
      dragRef.current.dragging = false;
      setIsInteracting(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (dragRef.current.hasMoved) {
        onDragEnd();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeStart = (e, handle) => {
    if (element.isLocked) return;
    e.stopPropagation();
    e.preventDefault();
    resizeRef.current = {
      resizing: true,
      startX: e.clientX,
      startY: e.clientY,
      origW: element.width,
      origH: element.height,
      origX: element.x,
      origY: element.y,
      aspectRatio: element.width / Math.max(1, element.height),
      handle,
      hasResized: false
    };

    setIsInteracting(true);
    onResizeStart();

    const handleMouseMove = (ev) => {
      if (!resizeRef.current.resizing) return;
      const dx = (ev.clientX - resizeRef.current.startX) / scale;
      const dy = (ev.clientY - resizeRef.current.startY) / scale;

      const { origX, origY, origW, origH, aspectRatio, handle: h } = resizeRef.current;
      const minW = 30;
      const minH = 20;
      const preserveAspect = ev.shiftKey || element.type === 'circle';

      let newW = origW;
      let newH = origH;
      let newX = origX;
      let newY = origY;

      if (h.includes('e')) newW = Math.max(minW, origW + dx);
      if (h.includes('w')) {
        newW = Math.max(minW, origW - dx);
        newX = origX + (origW - newW);
      }
      if (h.includes('s')) newH = Math.max(minH, origH + dy);
      if (h.includes('n')) {
        newH = Math.max(minH, origH - dy);
        newY = origY + (origH - newH);
      }

      if (preserveAspect && (h === 'nw' || h === 'ne' || h === 'se' || h === 'sw')) {
        if (newW / aspectRatio > newH) newW = Math.round(newH * aspectRatio);
        else newH = Math.round(newW / aspectRatio);
        if (h.includes('w')) newX = origX + (origW - newW);
        if (h.includes('n')) newY = origY + (origH - newH);
      }

      resizeRef.current.hasResized = true;
      onResize(element.id, Math.round(newX), Math.round(newY), Math.round(newW), Math.round(newH));
    };

    const handleMouseUp = () => {
      resizeRef.current.resizing = false;
      setIsInteracting(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (resizeRef.current.hasResized) {
        onResizeEnd();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const ResizeHandles = () => isSelected && !editing && !element.isLocked ? (
    <>
      <div className="resize-handle ne" onMouseDown={e => handleResizeStart(e, 'ne')} />
      <div className="resize-handle nw" onMouseDown={e => handleResizeStart(e, 'nw')} />
      <div className="resize-handle se" onMouseDown={e => handleResizeStart(e, 'se')} />
      <div className="resize-handle sw" onMouseDown={e => handleResizeStart(e, 'sw')} />
      <div className="resize-handle n" onMouseDown={e => handleResizeStart(e, 'n')} />
      <div className="resize-handle s" onMouseDown={e => handleResizeStart(e, 's')} />
      <div className="resize-handle e" onMouseDown={e => handleResizeStart(e, 'e')} />
      <div className="resize-handle w" onMouseDown={e => handleResizeStart(e, 'w')} />
    </>
  ) : null;

  const style = {
    position: 'absolute',
    left: element.x * scale,
    top: element.y * scale,
    width: element.width * scale,
    height: element.height * scale,
    cursor: element.isLocked ? 'default' : (editing ? 'text' : 'move'),
    opacity: element.style?.opacity ?? 1,
    zIndex: isSelected ? 40 : 1,
  };

  if (element.type === 'text') {
    const textStyle = {
      fontSize: (element.content.fontSize || 20) * scale,
      fontWeight: element.content.fontWeight || 'normal',
      fontStyle: element.content.fontStyle || 'normal',
      fontFamily: element.content.fontFamily || 'Inter',
      color: element.content.color || '#333333',
      textAlign: element.style?.textAlign || 'left',
      lineHeight: element.content.lineHeight || 1.4,
      width: '100%',
      height: '100%',
      padding: '4px 8px',
      wordBreak: 'break-word',
      outline: editing ? '2px solid var(--accent)' : (isSelected ? '1px dashed var(--accent)' : 'none'),
      background: editing ? 'rgba(124, 58, 237, 0.04)' : 'transparent',
      borderRadius: 4,
      overflow: 'hidden',
      userSelect: editing ? 'text' : 'none',
      whiteSpace: 'pre-wrap',
    };

    const isHtml = element.content.text && element.content.text.includes('<') && element.content.text.includes('>');

    return (
      <div
        style={style}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        onContextMenu={(e) => onContextMenu(e, element.id)}
      >
        {isInteracting && (
          <div className="dimension-badge">
            {Math.round(element.width)} × {Math.round(element.height)} px
          </div>
        )}
        {element.isLocked && isSelected && (
          <div className="element-lock-badge" title="Element is locked">
            <FiLock size={10} />
          </div>
        )}
        {editing ? (
          <div
            ref={textRef}
            contentEditable
            suppressContentEditableWarning
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={{ ...textStyle, outline: '2px solid var(--accent)', background: 'rgba(255,255,255,0.08)' }}
          />
        ) : isHtml ? (
          <div style={textStyle} dangerouslySetInnerHTML={{ __html: element.content.text }} />
        ) : (
          <div style={textStyle}>{element.content.text}</div>
        )}
        <ResizeHandles />
      </div>
    );
  }

  if (element.type === 'shape') {
    const isCircle = element.content.shapeType === 'circle';
    return (
      <div
        style={{
          ...style,
          background: element.content.color || '#7c3aed',
          borderRadius: isCircle ? '50%' : (element.content.borderRadius || 0),
          border: element.content.borderWidth ? `${element.content.borderWidth}px solid ${element.content.borderColor || '#333'}` : (isSelected ? '2px solid var(--accent)' : 'none'),
          boxShadow: isSelected ? '0 0 0 1px rgba(124, 58, 237, 0.5)' : 'none',
        }}
        onMouseDown={handleMouseDown}
        onContextMenu={(e) => onContextMenu(e, element.id)}
      >
        {isInteracting && (
          <div className="dimension-badge">
            {Math.round(element.width)} × {Math.round(element.height)} px
          </div>
        )}
        {element.isLocked && isSelected && (
          <div className="element-lock-badge" title="Element is locked">
            <FiLock size={10} />
          </div>
        )}
        <ResizeHandles />
      </div>
    );
  }

  if (element.type === 'image') {
    return (
      <div
        style={{
          ...style,
          border: isSelected ? '2px solid var(--accent)' : 'none',
          borderRadius: element.style?.borderRadius || 0,
          overflow: 'hidden'
        }}
        onMouseDown={handleMouseDown}
        onContextMenu={(e) => onContextMenu(e, element.id)}
      >
        {isInteracting && (
          <div className="dimension-badge">
            {Math.round(element.width)} × {Math.round(element.height)} px
          </div>
        )}
        {element.isLocked && isSelected && (
          <div className="element-lock-badge" title="Element is locked">
            <FiLock size={10} />
          </div>
        )}
        <img src={element.content.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} crossOrigin="anonymous" />
        <ResizeHandles />
      </div>
    );
  }

  if (element.type === 'video') {
    const videoId = element.content.videoId || '';
    return (
      <div
        style={{
          ...style,
          border: isSelected ? '2px solid var(--accent)' : 'none',
          borderRadius: element.style?.borderRadius || 0,
          overflow: 'hidden',
          background: '#000'
        }}
        onMouseDown={handleMouseDown}
        onContextMenu={(e) => onContextMenu(e, element.id)}
      >
        {videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0`}
            style={{ width: '100%', height: '100%', border: 'none', pointerEvents: isSelected ? 'none' : 'auto' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Video"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a1a', color: '#888', fontSize: 14 * scale }}>
            <FiVideo size={24 * scale} /> <span style={{ marginLeft: 8 }}>Add video URL</span>
          </div>
        )}
        <ResizeHandles />
      </div>
    );
  }

  return null;
}

// ── Fullscreen Presenter Mode Component ──
function PresenterMode({ slides, initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        setCurrentIndex(c => Math.min(slides.length - 1, c + 1));
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentIndex(c => Math.max(0, c - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, onClose]);

  const curSlide = slides[currentIndex];
  const getBg = () => {
    if (typeof curSlide?.background === 'string') return { background: curSlide.background };
    if (curSlide?.background?.gradient) return { background: curSlide.background.gradient };
    return { background: curSlide?.background?.color || '#ffffff' };
  };

  const scale = Math.min(window.innerWidth / 960, window.innerHeight / 540) * 0.95;

  return (
    <div className="presenter-overlay" onClick={() => setCurrentIndex(c => (c < slides.length - 1 ? c + 1 : c))}>
      <div
        className="presenter-canvas"
        style={{
          width: 960 * scale,
          height: 540 * scale,
          ...getBg()
        }}
      >
        <div style={{ width: 960, height: 540, transform: `scale(${scale})`, transformOrigin: 'top left', position: 'absolute', left: 0, top: 0 }}>
          {curSlide?.elements?.map(el => {
            const elStyle = {
              position: 'absolute',
              left: el.x,
              top: el.y,
              width: el.width,
              height: el.height,
              opacity: el.style?.opacity ?? 1,
            };

            if (el.type === 'image' && el.content?.src) {
              return (
                <div key={el.id} style={{ ...elStyle, borderRadius: el.style?.borderRadius || 0, overflow: 'hidden' }}>
                  <img src={el.content.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
                </div>
              );
            }

            if (el.type === 'shape') {
              const isCircle = el.content.shapeType === 'circle';
              return (
                <div key={el.id} style={{
                  ...elStyle,
                  background: el.content.color || '#7c3aed',
                  borderRadius: isCircle ? '50%' : (el.content.borderRadius || 0),
                  border: el.content.borderWidth ? `${el.content.borderWidth}px solid ${el.content.borderColor || 'transparent'}` : 'none'
                }} />
              );
            }

            if (el.type === 'text') {
              const textContent = el.content.text || '';
              const isHtml = textContent.includes('<') && textContent.includes('>');
              const textStyle = {
                fontSize: el.content.fontSize || 20,
                fontWeight: el.content.fontWeight || 'normal',
                fontStyle: el.content.fontStyle || 'normal',
                fontFamily: el.content.fontFamily || 'Inter',
                color: el.content.color || '#333',
                textAlign: el.style?.textAlign || 'left',
                lineHeight: el.content.lineHeight || 1.4,
                width: '100%',
                height: '100%',
                padding: '4px 8px',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
                overflow: 'hidden'
              };

              return (
                <div key={el.id} style={elStyle}>
                  {isHtml ? (
                    <div style={textStyle} dangerouslySetInnerHTML={{ __html: textContent }} />
                  ) : (
                    <div style={textStyle}>{textContent}</div>
                  )}
                </div>
              );
            }

            if (el.type === 'video') {
              return (
                <div key={el.id} style={{ ...elStyle, borderRadius: 12, overflow: 'hidden', background: '#000' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${el.content.videoId}?rel=0`}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Video"
                  />
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>

      <div className="presenter-controls" onClick={e => e.stopPropagation()}>
        <button onClick={() => setCurrentIndex(c => Math.max(0, c - 1))} disabled={currentIndex === 0}><FiArrowLeft size={16} /></button>
        <span>{currentIndex + 1} / {slides.length}</span>
        <button onClick={() => setCurrentIndex(c => Math.min(slides.length - 1, c + 1))} disabled={currentIndex === slides.length - 1}><FiArrowDown size={16} style={{ transform: 'rotate(-90deg)' }} /></button>
        <button className="presenter-exit" onClick={onClose} title="Exit (Esc)"><FiX size={16} /></button>
      </div>
    </div>
  );
}

// ── Shortcuts Help Modal ──
function ShortcutsModal({ onClose }) {
  const shortcuts = [
    { key: 'Ctrl + B', action: 'Bold selected text' },
    { key: 'Ctrl + I', action: 'Italicize selected text' },
    { key: 'Ctrl + U', action: 'Underline selected text' },
    { key: 'Ctrl + Z', action: 'Undo last change' },
    { key: 'Ctrl + Y', action: 'Redo last change' },
    { key: 'Ctrl + C / V', action: 'Copy & Paste selected element' },
    { key: 'Ctrl + D', action: 'Duplicate selected element' },
    { key: 'Delete / Backspace', action: 'Delete selected element' },
    { key: 'Arrow Keys', action: 'Nudge element by 1px (Shift for 10px)' },
    { key: 'Ctrl + ] / [', action: 'Bring forward / Send backward' },
    { key: 'Ctrl + Shift + ] / [', action: 'Bring to front / Send to back' },
    { key: 'Ctrl + S', action: 'Open Export menu' },
    { key: 'F5 / Present', action: 'Start Fullscreen Slide Show' },
    { key: 'Escape', action: 'Deselect / Exit full screen' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="shortcuts-modal" onClick={e => e.stopPropagation()}>
        <div className="export-header">
          <h3>Keyboard Shortcuts</h3>
          <button className="close-btn" onClick={onClose}><FiX size={18} /></button>
        </div>
        <p className="export-subtitle">PowerPoint-grade shortcuts for rapid presentation design</p>
        <div className="shortcuts-grid">
          {shortcuts.map((s, i) => (
            <div key={i} className="shortcut-row">
              <span className="shortcut-key">{s.key}</span>
              <span className="shortcut-desc">{s.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── YouTube Video Modal ──
function VideoUrlModal({ onClose, onAdd }) {
  const [url, setUrl] = useState('');
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const extractVideoId = (rawUrl) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    for (const p of patterns) {
      const m = rawUrl.match(p);
      if (m) return m[1];
    }
    return null;
  };

  const handleAdd = () => {
    const videoId = extractVideoId(url.trim());
    if (videoId) { onAdd(videoId); onClose(); }
    else alert('Please enter a valid YouTube URL or video ID');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="export-modal" onClick={e => e.stopPropagation()} style={{ width: 440 }}>
        <div className="export-header">
          <h3>Add YouTube Video</h3>
          <button className="close-btn" onClick={onClose}><FiChevronDown size={18} style={{ transform: 'rotate(90deg)' }} /></button>
        </div>
        <p className="export-subtitle">Paste a YouTube video URL or 11-character video ID</p>
        <div style={{ padding: '0 24px 24px' }}>
          <input
            ref={inputRef}
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="https://youtube.com/watch?v=..."
            style={{
              width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: 'var(--text-primary)',
              fontSize: 14, marginBottom: 16, boxSizing: 'border-box'
            }}
          />
          <button className="topbar-btn export-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={handleAdd}>
            Insert Video
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Color Picker Popover ──
function ColorPickerPopover({ value, onChange, label, onClose }) {
  return (
    <div className="color-popover" onClick={e => e.stopPropagation()}>
      <div className="color-popover-header">
        <span>{label || 'Color'}</span>
        <button className="popover-close" onClick={onClose}><FiChevronDown size={14} /></button>
      </div>
      <div className="preset-swatches">
        {PRESET_COLORS.map(c => (
          <button
            key={c}
            className={`color-swatch ${value === c ? 'active' : ''}`}
            style={{ background: c }}
            onClick={() => { onChange(c); }}
          >
            {value === c && <FiCheck size={10} color={c === '#ffffff' || c === '#94a3b8' ? '#000' : '#fff'} />}
          </button>
        ))}
      </div>
      <div className="custom-color-row">
        <label className="custom-color-input-wrapper">
          <input type="color" value={value || '#7c3aed'} onChange={e => onChange(e.target.value)} />
          <span>Custom Hex:</span>
        </label>
        <input
          className="hex-text-input"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder="#7c3aed"
        />
      </div>
    </div>
  );
}

// ── Right-Click Context Menu ──
function ContextMenu({ x, y, element, onAction, onClose }) {
  useEffect(() => {
    const handleOutside = () => onClose();
    window.addEventListener('click', handleOutside);
    return () => window.removeEventListener('click', handleOutside);
  }, [onClose]);

  return (
    <div
      className="context-menu"
      style={{ left: x, top: y }}
      onClick={e => e.stopPropagation()}
    >
      <button className="ctx-item" onClick={() => onAction('copy')}>
        <span>Copy</span> <span className="ctx-shortcut">Ctrl+C</span>
      </button>
      <button className="ctx-item" onClick={() => onAction('duplicate')}>
        <span>Duplicate</span> <span className="ctx-shortcut">Ctrl+D</span>
      </button>
      <button className="ctx-item danger" onClick={() => onAction('delete')}>
        <span>Delete</span> <span className="ctx-shortcut">Del</span>
      </button>
      <div className="ctx-divider" />
      <button className="ctx-item" onClick={() => onAction('bring-forward')}>
        <span>Bring Forward</span> <span className="ctx-shortcut">Ctrl+]</span>
      </button>
      <button className="ctx-item" onClick={() => onAction('bring-to-front')}>
        <span>Bring to Front</span> <span className="ctx-shortcut">Ctrl+Shift+]</span>
      </button>
      <button className="ctx-item" onClick={() => onAction('send-backward')}>
        <span>Send Backward</span> <span className="ctx-shortcut">Ctrl+[</span>
      </button>
      <button className="ctx-item" onClick={() => onAction('send-to-back')}>
        <span>Send to Back</span> <span className="ctx-shortcut">Ctrl+Shift+[</span>
      </button>
      <div className="ctx-divider" />
      <button className="ctx-item" onClick={() => onAction('align-center-h')}>
        <span>Center Horizontally</span>
      </button>
      <button className="ctx-item" onClick={() => onAction('align-center-v')}>
        <span>Center Vertically</span>
      </button>
      <div className="ctx-divider" />
      <button className="ctx-item" onClick={() => onAction('toggle-lock')}>
        <span>{element?.isLocked ? 'Unlock Element' : 'Lock Element'}</span>
      </button>
    </div>
  );
}

// ── MAIN EDITOR COMPONENT ──
export default function Editor() {
  const navigate = useNavigate();
  const location = useLocation();
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [slides, setSlides] = useState([createBlankSlide()]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedElement, setSelectedElement] = useState(null);
  const [presentationTitle, setPresentationTitle] = useState('Untitled Presentation');
  const [showExport, setShowExport] = useState(false);
  const [showPresent, setShowPresent] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftModalMode, setDraftModalMode] = useState('manage'); // 'manage' | 'save'
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showConverterModal, setShowConverterModal] = useState(false);
  const [draftCount, setDraftCount] = useState(0);

  const [canvasScale, setCanvasScale] = useState(0.7);
  const [zoomLevel, setZoomLevel] = useState('fit');
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [clipboard, setClipboard] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeColorPicker, setActiveColorPicker] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [savedStatus, setSavedStatus] = useState('Saved');

  const snapshotRef = useRef(null);

  const refreshDraftCount = useCallback(() => {
    setDraftCount(getOccupiedDraftCount());
  }, []);

  useEffect(() => {
    refreshDraftCount();
  }, [refreshDraftCount]);

  const addUndo = useCallback(() => {
    setUndoStack(prev => [...prev.slice(-30), JSON.parse(JSON.stringify(slides))]);
    setRedoStack([]);
    setSavedStatus('Saving...');
    setTimeout(() => setSavedStatus('Saved'), 400);
  }, [slides]);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    setRedoStack(prev => [...prev, JSON.parse(JSON.stringify(slides))]);
    const previous = undoStack[undoStack.length - 1];
    setSlides(previous);
    setUndoStack(u => u.slice(0, -1));
    if (currentSlide >= previous.length) {
      setCurrentSlide(previous.length - 1);
    }
  }, [undoStack, slides, currentSlide]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    setUndoStack(prev => [...prev, JSON.parse(JSON.stringify(slides))]);
    const next = redoStack[redoStack.length - 1];
    setSlides(next);
    setRedoStack(r => r.slice(0, -1));
    if (currentSlide >= next.length) {
      setCurrentSlide(next.length - 1);
    }
  }, [redoStack, slides, currentSlide]);

  // Handle incoming templates, imports, drafts, or AI generations
  useEffect(() => {
    if (location.state?.templateId) {
      const tid = location.state.templateId;
      const newSlides = createSlidesFromTemplate(tid);
      setSlides(newSlides);
      const template = getTemplateById(tid);
      setPresentationTitle(template?.name ? `${template.name} Presentation` : 'Untitled');
    } else if (location.state?.importedSlides || location.state?.draftSlides || location.state?.aiSlides) {
      const incomingSlides = location.state.importedSlides || location.state.draftSlides || location.state.aiSlides;
      setSlides(incomingSlides);
      if (location.state.title) setPresentationTitle(location.state.title);
    } else if (location.state?.blank) {
      setSlides([createBlankSlide()]);
      setPresentationTitle('Untitled Presentation');
    }
  }, [location.state]);

  // Save Draft directly or open picker
  const handleQuickSaveDraft = () => {
    const res = autoSaveDraft({ name: presentationTitle, slides });
    if (res.success) {
      setSavedStatus(`Saved to Slot ${res.slotIndex + 1}!`);
      refreshDraftCount();
      setTimeout(() => setSavedStatus('Saved'), 1500);
    } else if (res.requiresSlotChoice) {
      setDraftModalMode('save');
      setShowDraftModal(true);
    }
  };

  const handleLoadDraft = (draft) => {
    if (draft?.slides?.length > 0) {
      addUndo();
      setSlides(draft.slides);
      setPresentationTitle(draft.name || 'Saved Draft');
      setCurrentSlide(0);
      setSelectedElement(null);
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInputActive = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) ||
        document.activeElement?.isContentEditable;

      if (e.key === 'F5') {
        e.preventDefault();
        setShowPresent(true);
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (!e.shiftKey) { e.preventDefault(); undo(); }
        else { e.preventDefault(); redo(); }
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault(); redo(); return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault(); handleQuickSaveDraft(); return;
      }

      if (isInputActive) return;

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        setShowShortcuts(true);
        return;
      }

      // Copy & Paste Elements
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c' && selectedElement) {
        const curSlide = slides[currentSlide];
        const el = curSlide?.elements?.find(item => item.id === selectedElement);
        if (el) {
          setClipboard(JSON.parse(JSON.stringify(el)));
          e.preventDefault();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v' && clipboard) {
        e.preventDefault();
        addUndo();
        const clone = {
          ...JSON.parse(JSON.stringify(clipboard)),
          id: uuidv4(),
          x: Math.min(900, clipboard.x + 24),
          y: Math.min(480, clipboard.y + 24),
        };
        const newSlides = [...slides];
        newSlides[currentSlide] = {
          ...newSlides[currentSlide],
          elements: [...newSlides[currentSlide].elements, clone]
        };
        setSlides(newSlides);
        setSelectedElement(clone.id);
        setClipboard(clone);
      }

      // Duplicate Element (Ctrl+D)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd' && selectedElement) {
        e.preventDefault();
        duplicateSelectedElement();
      }

      // Layer Shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === ']') {
        e.preventDefault();
        if (e.shiftKey) bringToFront(selectedElement);
        else bringForward(selectedElement);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '[') {
        e.preventDefault();
        if (e.shiftKey) sendToBack(selectedElement);
        else sendBackward(selectedElement);
      }

      // Delete Element
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElement) {
        const curSlide = slides[currentSlide];
        const el = curSlide?.elements?.find(item => item.id === selectedElement);
        if (el && !el.isLocked) {
          e.preventDefault();
          deleteElement(selectedElement);
        }
      }

      // Arrow Key Nudging
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key) && selectedElement) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const curSlide = slides[currentSlide];
        const el = curSlide?.elements?.find(item => item.id === selectedElement);
        if (el && !el.isLocked) {
          let nx = el.x, ny = el.y;
          if (e.key === 'ArrowLeft') nx = Math.max(0, el.x - step);
          if (e.key === 'ArrowRight') nx = Math.min(940, el.x + step);
          if (e.key === 'ArrowUp') ny = Math.max(0, el.y - step);
          if (e.key === 'ArrowDown') ny = Math.min(520, el.y + step);
          updateElement(selectedElement, { x: nx, y: ny });
        }
      }

      // Escape
      if (e.key === 'Escape') {
        setSelectedElement(null);
        setShowAddMenu(false);
        setShowLayoutMenu(false);
        setActiveColorPicker(null);
        setContextMenu(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedElement, slides, currentSlide, undo, redo, clipboard]);

  // Canvas Scale & Zoom computation
  useEffect(() => {
    const updateScale = () => {
      if (!canvasRef.current) return;
      const parent = canvasRef.current.parentElement;
      if (!parent) return;

      if (zoomLevel === 'fit') {
        const availW = parent.clientWidth - 80;
        const availH = parent.clientHeight - 80;
        const fitScale = Math.min(availW / 960, availH / 540, 1.2);
        setCanvasScale(Math.max(0.35, fitScale));
      } else {
        setCanvasScale(parseFloat(zoomLevel) / 100);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [zoomLevel]);

  const slide = slides[currentSlide] || slides[0] || createBlankSlide();

  // ── Slide Operations ──
  const addSlideWithLayout = (layoutType) => {
    addUndo();
    const currentBg = slide.background?.color || '#ffffff';
    const newSlide = createSlideByLayout(layoutType, currentBg);
    const newSlides = [...slides];
    newSlides.splice(currentSlide + 1, 0, newSlide);
    setSlides(newSlides);
    setCurrentSlide(currentSlide + 1);
    setSelectedElement(null);
    setShowLayoutMenu(false);
  };

  const deleteSlide = (index) => {
    if (slides.length <= 1) return;
    addUndo();
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    if (currentSlide >= newSlides.length) setCurrentSlide(newSlides.length - 1);
    setSelectedElement(null);
  };

  const duplicateSlide = (index) => {
    addUndo();
    const dup = JSON.parse(JSON.stringify(slides[index]));
    dup.id = uuidv4();
    dup.elements = dup.elements.map(el => ({ ...el, id: uuidv4() }));
    const newSlides = [...slides];
    newSlides.splice(index + 1, 0, dup);
    setSlides(newSlides);
    setCurrentSlide(index + 1);
    setSelectedElement(null);
  };

  const moveSlide = (from, to) => {
    if (to < 0 || to >= slides.length) return;
    addUndo();
    const newSlides = [...slides];
    const [moved] = newSlides.splice(from, 1);
    newSlides.splice(to, 0, moved);
    setSlides(newSlides);
    setCurrentSlide(to);
  };

  // ── Element Operations ──
  const addElement = (type) => {
    if (type === 'image') { fileInputRef.current?.click(); setShowAddMenu(false); return; }
    if (type === 'video') { setShowVideoModal(true); setShowAddMenu(false); return; }
    if (type === 'import') { setShowImportModal(true); setShowAddMenu(false); return; }
    if (type === 'ai') { setShowAIModal(true); setShowAddMenu(false); return; }
    addUndo();
    const el = createBlankElement(type);
    if (!el) return;
    const newSlides = [...slides];
    newSlides[currentSlide] = {
      ...newSlides[currentSlide],
      elements: [...newSlides[currentSlide].elements, el]
    };
    setSlides(newSlides);
    setSelectedElement(el.id);
    setShowAddMenu(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      addUndo();
      const el = {
        id: uuidv4(),
        type: 'image',
        x: 120, y: 80,
        width: 440, height: 320,
        content: { src: ev.target.result },
        style: { borderRadius: 12, opacity: 1 }
      };
      const newSlides = [...slides];
      newSlides[currentSlide] = {
        ...newSlides[currentSlide],
        elements: [...newSlides[currentSlide].elements, el]
      };
      setSlides(newSlides);
      setSelectedElement(el.id);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const addVideo = (videoId) => {
    addUndo();
    const el = {
      id: uuidv4(),
      type: 'video',
      x: 100, y: 80,
      width: 520, height: 300,
      content: { videoId },
      style: { borderRadius: 12 }
    };
    const newSlides = [...slides];
    newSlides[currentSlide] = {
      ...newSlides[currentSlide],
      elements: [...newSlides[currentSlide].elements, el]
    };
    setSlides(newSlides);
    setSelectedElement(el.id);
  };

  const deleteElement = (elementId) => {
    addUndo();
    const newSlides = [...slides];
    newSlides[currentSlide] = {
      ...newSlides[currentSlide],
      elements: newSlides[currentSlide].elements.filter(el => el.id !== elementId)
    };
    setSlides(newSlides);
    setSelectedElement(null);
  };

  const duplicateSelectedElement = () => {
    if (!selectedElement) return;
    const curSlide = slides[currentSlide];
    const el = curSlide?.elements?.find(item => item.id === selectedElement);
    if (!el) return;
    addUndo();
    const clone = {
      ...JSON.parse(JSON.stringify(el)),
      id: uuidv4(),
      x: Math.min(920, el.x + 20),
      y: Math.min(500, el.y + 20),
    };
    const newSlides = [...slides];
    newSlides[currentSlide] = {
      ...newSlides[currentSlide],
      elements: [...newSlides[currentSlide].elements, clone]
    };
    setSlides(newSlides);
    setSelectedElement(clone.id);
  };

  const toggleLockElement = (elementId) => {
    const el = slide?.elements?.find(item => item.id === elementId);
    if (!el) return;
    addUndo();
    updateElement(elementId, { isLocked: !el.isLocked });
  };

  const updateElement = (elementId, updates) => {
    const newSlides = [...slides];
    newSlides[currentSlide] = {
      ...newSlides[currentSlide],
      elements: newSlides[currentSlide].elements.map(el =>
        el.id === elementId
          ? {
              ...el,
              ...updates,
              content: { ...el.content, ...(updates.content || {}) },
              style: { ...el.style, ...(updates.style || {}) }
            }
          : el
      )
    };
    setSlides(newSlides);
  };

  const onDragStart = () => {
    snapshotRef.current = JSON.parse(JSON.stringify(slides));
  };
  const onDrag = (elementId, x, y) => {
    updateElement(elementId, { x: Math.max(0, x), y: Math.max(0, y) });
  };
  const onDragEnd = () => {
    if (snapshotRef.current) {
      setUndoStack(prev => [...prev.slice(-30), snapshotRef.current]);
      setRedoStack([]);
      snapshotRef.current = null;
    }
  };

  const onResizeStart = () => {
    snapshotRef.current = JSON.parse(JSON.stringify(slides));
  };
  const onResize = (elementId, x, y, width, height) => {
    updateElement(elementId, { x, y, width, height });
  };
  const onResizeEnd = () => {
    if (snapshotRef.current) {
      setUndoStack(prev => [...prev.slice(-30), snapshotRef.current]);
      setRedoStack([]);
      snapshotRef.current = null;
    }
  };

  const onTextUpdate = (elementId, newText) => {
    addUndo();
    updateElement(elementId, { content: { text: newText } });
  };

  // ── Layering Management (Z-Index) ──
  const bringToFront = (elementId) => {
    if (!elementId) return;
    addUndo();
    const curSlide = slides[currentSlide];
    const items = [...curSlide.elements];
    const idx = items.findIndex(el => el.id === elementId);
    if (idx === -1 || idx === items.length - 1) return;
    const [item] = items.splice(idx, 1);
    items.push(item);
    const newSlides = [...slides];
    newSlides[currentSlide] = { ...curSlide, elements: items };
    setSlides(newSlides);
  };

  const sendToBack = (elementId) => {
    if (!elementId) return;
    addUndo();
    const curSlide = slides[currentSlide];
    const items = [...curSlide.elements];
    const idx = items.findIndex(el => el.id === elementId);
    if (idx === -1 || idx === 0) return;
    const [item] = items.splice(idx, 1);
    items.unshift(item);
    const newSlides = [...slides];
    newSlides[currentSlide] = { ...curSlide, elements: items };
    setSlides(newSlides);
  };

  const bringForward = (elementId) => {
    if (!elementId) return;
    addUndo();
    const curSlide = slides[currentSlide];
    const items = [...curSlide.elements];
    const idx = items.findIndex(el => el.id === elementId);
    if (idx === -1 || idx === items.length - 1) return;
    const [item] = items.splice(idx, 1);
    items.splice(idx + 1, 0, item);
    const newSlides = [...slides];
    newSlides[currentSlide] = { ...curSlide, elements: items };
    setSlides(newSlides);
  };

  const sendBackward = (elementId) => {
    if (!elementId) return;
    addUndo();
    const curSlide = slides[currentSlide];
    const items = [...curSlide.elements];
    const idx = items.findIndex(el => el.id === elementId);
    if (idx === -1 || idx === 0) return;
    const [item] = items.splice(idx, 1);
    items.splice(idx - 1, 0, item);
    const newSlides = [...slides];
    newSlides[currentSlide] = { ...curSlide, elements: items };
    setSlides(newSlides);
  };

  // ── Element Alignment Helpers ──
  const alignElement = (alignment) => {
    if (!selectedElement) return;
    const el = slide?.elements?.find(item => item.id === selectedElement);
    if (!el) return;
    addUndo();
    let updates = {};
    if (alignment === 'center-h') updates.x = Math.round((960 - el.width) / 2);
    if (alignment === 'center-v') updates.y = Math.round((540 - el.height) / 2);
    if (alignment === 'left') updates.x = 40;
    if (alignment === 'right') updates.x = 960 - el.width - 40;
    if (alignment === 'top') updates.y = 40;
    if (alignment === 'bottom') updates.y = 540 - el.height - 40;
    updateElement(selectedElement, updates);
  };

  const updateSlideBackground = (color) => {
    addUndo();
    const newSlides = [...slides];
    newSlides[currentSlide] = { ...newSlides[currentSlide], background: { type: 'solid', color } };
    setSlides(newSlides);
  };

  const getSlideBg = () => {
    if (typeof slide?.background === 'string') return { background: slide.background };
    if (slide?.background?.gradient) return { background: slide.background.gradient };
    return { background: slide?.background?.color || '#ffffff' };
  };

  const handleFormatText = (command, val = null) => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      document.execCommand(command, false, val);
    } else if (selectedElement) {
      const el = slide?.elements?.find(item => item.id === selectedElement);
      if (!el || el.type !== 'text') return;
      addUndo();
      if (command === 'bold') {
        const isBold = el.content.fontWeight === 'bold' || el.content.fontWeight >= 700;
        updateElement(selectedElement, { content: { fontWeight: isBold ? 'normal' : 'bold' } });
      } else if (command === 'italic') {
        const isItalic = el.content.fontStyle === 'italic';
        updateElement(selectedElement, { content: { fontStyle: isItalic ? 'normal' : 'italic' } });
      } else if (command === 'underline') {
        const isUnderline = el.content.textDecoration === 'underline';
        updateElement(selectedElement, { content: { textDecoration: isUnderline ? 'none' : 'underline' } });
      }
    }
  };

  const handleContextMenu = (e, elementId) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedElement(elementId);
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, targetId: elementId });
  };

  const handleContextAction = (action) => {
    const targetId = contextMenu?.targetId || selectedElement;
    if (!targetId) return;

    if (action === 'copy') {
      const el = slide?.elements?.find(item => item.id === targetId);
      if (el) setClipboard(JSON.parse(JSON.stringify(el)));
    } else if (action === 'duplicate') {
      duplicateSelectedElement();
    } else if (action === 'delete') {
      deleteElement(targetId);
    } else if (action === 'bring-forward') {
      bringForward(targetId);
    } else if (action === 'bring-to-front') {
      bringToFront(targetId);
    } else if (action === 'send-backward') {
      sendBackward(targetId);
    } else if (action === 'send-to-back') {
      sendToBack(targetId);
    } else if (action === 'align-center-h') {
      alignElement('center-h');
    } else if (action === 'align-center-v') {
      alignElement('center-v');
    } else if (action === 'toggle-lock') {
      toggleLockElement(targetId);
    }

    setContextMenu(null);
  };

  const selectedEl = slide?.elements?.find(e => e.id === selectedElement);

  return (
    <div className="editor" onClick={() => { setActiveColorPicker(null); setContextMenu(null); }}>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />

      {/* Top Bar */}
      <div className="editor-topbar">
        <div className="topbar-left">
          <button className="back-btn" onClick={() => navigate('/')} title="Back to Templates">
            <FiArrowLeft size={18} />
          </button>
          <input
            className="title-input"
            value={presentationTitle}
            onChange={e => setPresentationTitle(e.target.value)}
            placeholder="Untitled Presentation"
          />
          <span className="saved-badge">{savedStatus}</span>

          {/* Save Draft & Drafts Manager Button */}
          <button
            className="topbar-btn draft-btn"
            onClick={handleQuickSaveDraft}
            title="Save to local storage draft (Ctrl+S)"
          >
            <FiSave size={14} /> <span>Save Draft</span>
          </button>
          <button
            className="topbar-btn"
            onClick={() => { setDraftModalMode('manage'); setShowDraftModal(true); }}
            title="Open local draft manager"
          >
            <FiFolder size={14} /> <span>Drafts ({draftCount}/3)</span>
          </button>
        </div>

        <div className="topbar-right">
          <button
            className="topbar-btn ai-btn"
            onClick={() => setShowAIModal(true)}
            title="AI Presentation Creator"
          >
            <FiZap size={14} /> <span>AI Creator</span>
          </button>

          <button
            className="topbar-btn"
            onClick={() => setShowConverterModal(true)}
            title="Convert PPTX, PDF, PNG"
          >
            <FiRefreshCw size={14} /> <span>Converter</span>
          </button>

          <div className="topbar-divider" />

          <button className="topbar-btn" onClick={() => setShowShortcuts(true)} title="Keyboard Shortcuts (?)">
            <FiHelpCircle size={15} />
          </button>
          <button className="topbar-btn" onClick={() => setShowPresent(true)} title="Start Fullscreen Slide Show (F5)">
            <FiPlay size={15} /> <span>Present</span>
          </button>
          <div className="topbar-divider" />
          <button className="topbar-btn" onClick={undo} disabled={undoStack.length === 0} title="Undo (Ctrl+Z)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10h10a5 5 0 015 5v2M3 10l5 5M3 10l5-5"/></svg>
            <span>Undo</span>
          </button>
          <button className="topbar-btn" onClick={redo} disabled={redoStack.length === 0} title="Redo (Ctrl+Y)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10H11a5 5 0 00-5 5v2M21 10l-5 5M21 10l-5-5"/></svg>
            <span>Redo</span>
          </button>
          <div className="topbar-divider" />
          <button className="topbar-btn export-btn" onClick={() => setShowExport(true)} title="Export Presentation">
            <FiDownload size={15} /> Export
          </button>
        </div>
      </div>

      <div className="editor-body">
        {/* Slide Panel */}
        <div className="slide-panel">
          <div className="slide-panel-header">
            <span>Slides ({slides.length})</span>
            <div className="add-slide-dropdown-wrapper">
              <button
                className="add-slide-btn"
                onClick={(e) => { e.stopPropagation(); setShowLayoutMenu(!showLayoutMenu); }}
                title="New Slide Layouts"
              >
                <FiPlus size={14} />
              </button>
              {showLayoutMenu && (
                <div className="layout-dropdown-menu" onClick={e => e.stopPropagation()}>
                  <div className="layout-menu-title">Select Slide Layout</div>
                  {SLIDE_LAYOUT_PRESETS.map(preset => (
                    <button key={preset.id} className="layout-menu-item" onClick={() => addSlideWithLayout(preset.id)}>
                      <span className="layout-name">{preset.name}</span>
                      <span className="layout-desc">{preset.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="slide-list">
            {slides.map((s, i) => (
              <SlideThumbnail
                key={s.id}
                slide={s}
                index={i}
                isActive={i === currentSlide}
                onClick={() => { setCurrentSlide(i); setSelectedElement(null); }}
                onDelete={() => deleteSlide(i)}
                onDuplicate={() => duplicateSlide(i)}
                onMoveUp={() => moveSlide(i, i - 1)}
                onMoveDown={() => moveSlide(i, i + 1)}
                total={slides.length}
              />
            ))}
          </div>
          <button className="add-slide-full" onClick={(e) => { e.stopPropagation(); setShowLayoutMenu(true); }}>
            <FiPlus size={15} /> Add Slide
          </button>
        </div>

        {/* Toolbar & Canvas */}
        <div className="toolbar-canvas-area">
          {/* Main Toolbar */}
          <div className="toolbar" onClick={e => e.stopPropagation()}>
            <div className="toolbar-group">
              <div className="add-dropdown">
                <button className="toolbar-btn accent" onClick={() => setShowAddMenu(!showAddMenu)}>
                  <FiPlus size={14} /> Insert
                </button>
                {showAddMenu && (
                  <div className="dropdown-menu" onClick={e => e.stopPropagation()}>
                    <button onClick={() => addElement('text')}><FiType size={14} /> Text Box</button>
                    <button onClick={() => addElement('rect')}><FiSquare size={14} /> Rectangle</button>
                    <button onClick={() => addElement('circle')}><FiCircle size={14} /> Circle</button>
                    <button onClick={() => addElement('image')}><FiImage size={14} /> Upload Image</button>
                    <button onClick={() => addElement('video')}><FiVideo size={14} /> YouTube Video</button>
                    <div className="ctx-divider" />
                    <button onClick={() => addElement('import')}><FiUploadCloud size={14} /> Import File (PPTX, PDF, ZIP)</button>
                    <button onClick={() => addElement('ai')}><FiZap size={14} /> Generate with AI</button>
                  </div>
                )}
              </div>
            </div>

            {/* Typography Controls for Text Elements */}
            {selectedEl?.type === 'text' && (
              <>
                <div className="tb-div" />
                <div className="toolbar-group">
                  <select
                    className="tb-select"
                    value={selectedEl.content.fontFamily || 'Inter'}
                    onChange={e => updateElement(selectedElement, { content: { fontFamily: e.target.value } })}
                  >
                    {FONTS.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
                  </select>

                  <div className="font-size-stepper">
                    <button
                      className="stepper-btn"
                      onClick={() => updateElement(selectedElement, { content: { fontSize: Math.max(10, (selectedEl.content.fontSize || 20) - 2) } })}
                      title="Decrease Font Size"
                    >
                      -
                    </button>
                    <select
                      className="tb-select sm"
                      value={selectedEl.content.fontSize || 20}
                      onChange={e => updateElement(selectedElement, { content: { fontSize: parseInt(e.target.value) } })}
                    >
                      {FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button
                      className="stepper-btn"
                      onClick={() => updateElement(selectedElement, { content: { fontSize: Math.min(120, (selectedEl.content.fontSize || 20) + 2) } })}
                      title="Increase Font Size"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="tb-div" />
                <div className="toolbar-group">
                  <button
                    className={`tb-icon ${(selectedEl.content.fontWeight === 'bold' || selectedEl.content.fontWeight >= 700) ? 'on' : ''}`}
                    onClick={() => handleFormatText('bold')}
                    title="Bold (Ctrl+B)"
                  >
                    <FiBold size={14} />
                  </button>
                  <button
                    className={`tb-icon ${selectedEl.content.fontStyle === 'italic' ? 'on' : ''}`}
                    onClick={() => handleFormatText('italic')}
                    title="Italic (Ctrl+I)"
                  >
                    <FiItalic size={14} />
                  </button>
                  <button
                    className={`tb-icon ${selectedEl.content.textDecoration === 'underline' ? 'on' : ''}`}
                    onClick={() => handleFormatText('underline')}
                    title="Underline (Ctrl+U)"
                  >
                    <FiUnderline size={14} />
                  </button>
                </div>

                <div className="tb-div" />
                <div className="toolbar-group">
                  <button
                    className={`tb-icon ${!selectedEl.style?.textAlign || selectedEl.style?.textAlign === 'left' ? 'on' : ''}`}
                    onClick={() => updateElement(selectedElement, { style: { textAlign: 'left' } })}
                    title="Align Left"
                  >
                    <FiAlignLeft size={14} />
                  </button>
                  <button
                    className={`tb-icon ${selectedEl.style?.textAlign === 'center' ? 'on' : ''}`}
                    onClick={() => updateElement(selectedElement, { style: { textAlign: 'center' } })}
                    title="Align Center"
                  >
                    <FiAlignCenter size={14} />
                  </button>
                  <button
                    className={`tb-icon ${selectedEl.style?.textAlign === 'right' ? 'on' : ''}`}
                    onClick={() => updateElement(selectedElement, { style: { textAlign: 'right' } })}
                    title="Align Right"
                  >
                    <FiAlignRight size={14} />
                  </button>
                </div>

                <div className="tb-div" />
                <div className="toolbar-group">
                  <div className="color-btn-wrapper">
                    <button
                      className="color-picker-trigger"
                      onClick={() => setActiveColorPicker(activeColorPicker === 'text' ? null : 'text')}
                      title="Text Color"
                    >
                      <span className="color-dot" style={{ background: selectedEl.content.color || '#333333' }} />
                      <span className="color-btn-label">Color</span>
                    </button>
                    {activeColorPicker === 'text' && (
                      <ColorPickerPopover
                        value={selectedEl.content.color || '#333333'}
                        label="Text Color"
                        onChange={c => {
                          handleFormatText('foreColor', c);
                          updateElement(selectedElement, { content: { color: c } });
                        }}
                        onClose={() => setActiveColorPicker(null)}
                      />
                    )}
                  </div>

                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 6 }}>Opacity:</span>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={Math.round((selectedEl.style?.opacity ?? 1) * 100)}
                    onChange={e => updateElement(selectedElement, { style: { opacity: parseInt(e.target.value) / 100 } })}
                    style={{ width: 50 }}
                    title="Text Opacity"
                  />
                </div>
              </>
            )}

            {/* Shape Controls */}
            {selectedEl?.type === 'shape' && (
              <>
                <div className="tb-div" />
                <div className="toolbar-group">
                  <div className="color-btn-wrapper">
                    <button
                      className="color-picker-trigger"
                      onClick={() => setActiveColorPicker(activeColorPicker === 'shape-fill' ? null : 'shape-fill')}
                      title="Shape Fill"
                    >
                      <span className="color-dot" style={{ background: selectedEl.content.color || '#7c3aed' }} />
                      <span className="color-btn-label">Fill</span>
                    </button>
                    {activeColorPicker === 'shape-fill' && (
                      <ColorPickerPopover
                        value={selectedEl.content.color || '#7c3aed'}
                        label="Fill Color"
                        onChange={c => updateElement(selectedElement, { content: { color: c } })}
                        onClose={() => setActiveColorPicker(null)}
                      />
                    )}
                  </div>

                  <div className="color-btn-wrapper">
                    <button
                      className="color-picker-trigger"
                      onClick={() => setActiveColorPicker(activeColorPicker === 'shape-border' ? null : 'shape-border')}
                      title="Border Color"
                    >
                      <span className="color-dot" style={{ background: selectedEl.content.borderColor || '#333333' }} />
                      <span className="color-btn-label">Border</span>
                    </button>
                    {activeColorPicker === 'shape-border' && (
                      <ColorPickerPopover
                        value={selectedEl.content.borderColor || '#333333'}
                        label="Border Color"
                        onChange={c => updateElement(selectedElement, { content: { borderColor: c, borderWidth: selectedEl.content.borderWidth || 2 } })}
                        onClose={() => setActiveColorPicker(null)}
                      />
                    )}
                  </div>

                  {selectedEl.content.shapeType !== 'circle' && (
                    <div className="stepper-item" title="Corner Radius">
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Radius:</span>
                      <input
                        type="range"
                        min="0"
                        max="40"
                        value={selectedEl.content.borderRadius || 0}
                        onChange={e => updateElement(selectedElement, { content: { borderRadius: parseInt(e.target.value) } })}
                        style={{ width: 50 }}
                      />
                    </div>
                  )}

                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>Opacity:</span>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={Math.round((selectedEl.style?.opacity ?? 1) * 100)}
                    onChange={e => updateElement(selectedElement, { style: { opacity: parseInt(e.target.value) / 100 } })}
                    style={{ width: 50 }}
                    title="Shape Opacity"
                  />
                </div>
              </>
            )}

            {/* Image Controls */}
            {selectedEl?.type === 'image' && (
              <>
                <div className="tb-div" />
                <div className="toolbar-group">
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Radius:</span>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={selectedEl.style?.borderRadius || 0}
                    onChange={e => updateElement(selectedElement, { style: { borderRadius: parseInt(e.target.value) } })}
                    style={{ width: 50 }}
                  />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>Opacity:</span>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={Math.round((selectedEl.style?.opacity ?? 1) * 100)}
                    onChange={e => updateElement(selectedElement, { style: { opacity: parseInt(e.target.value) / 100 } })}
                    style={{ width: 50 }}
                  />
                </div>
              </>
            )}

            {/* Layer, Alignment & Lock Controls when element is selected */}
            {selectedElement && (
              <>
                <div className="tb-div" />
                <div className="toolbar-group">
                  <button className="tb-icon" onClick={() => bringForward(selectedElement)} title="Bring Forward (Ctrl+])">
                    <FiLayers size={13} />
                  </button>
                  <button className="tb-icon" onClick={() => sendBackward(selectedElement)} title="Send Backward (Ctrl+[)">
                    <FiLayers size={13} style={{ transform: 'rotate(180deg)' }} />
                  </button>
                  <button className="tb-icon" onClick={() => alignElement('center-h')} title="Center Horizontally">
                    <FiAlignCenter size={13} />
                  </button>
                  <button className="tb-icon" onClick={() => alignElement('center-v')} title="Center Vertically">
                    <FiMove size={13} />
                  </button>
                  <button className="tb-icon" onClick={duplicateSelectedElement} title="Duplicate Element (Ctrl+D)">
                    <FiCopy size={13} />
                  </button>
                  <button
                    className={`tb-icon ${selectedEl?.isLocked ? 'on' : ''}`}
                    onClick={() => toggleLockElement(selectedElement)}
                    title={selectedEl?.isLocked ? 'Unlock Element' : 'Lock Element Position'}
                  >
                    {selectedEl?.isLocked ? <FiLock size={13} /> : <FiUnlock size={13} />}
                  </button>
                </div>
              </>
            )}

            <div className="tb-spacer" />

            {selectedElement && (
              <button
                className="toolbar-btn danger"
                onClick={() => deleteElement(selectedElement)}
                disabled={selectedEl?.isLocked}
                title="Delete Element (Del)"
              >
                <FiTrash2 size={13} /> Delete
              </button>
            )}
          </div>

          {/* Background Bar */}
          <div className="bg-bar" onClick={e => e.stopPropagation()}>
            <span className="bg-label">Slide Background:</span>
            <div className="bg-colors">
              {['#ffffff', '#f8fafc', '#0f172a', '#18181b', '#09090b', '#1e293b', '#ecfdf5', '#eff6ff', '#fef3c7', '#fff7ed', '#faf5ff', '#064e3b'].map(c => (
                <button
                  key={c}
                  className={`bg-btn ${slide?.background?.color === c ? 'on' : ''}`}
                  style={{ background: c }}
                  onClick={() => updateSlideBackground(c)}
                  title={c}
                />
              ))}
              <div className="color-btn-wrapper">
                <button
                  className="bg-btn bg-custom"
                  onClick={() => setActiveColorPicker(activeColorPicker === 'bg' ? null : 'bg')}
                  title="Custom Slide Background"
                >
                  <FiChevronDown size={10} />
                </button>
                {activeColorPicker === 'bg' && (
                  <ColorPickerPopover
                    value={slide?.background?.color || '#ffffff'}
                    label="Background Color"
                    onChange={updateSlideBackground}
                    onClose={() => setActiveColorPicker(null)}
                  />
                )}
              </div>
            </div>

            <div className="tb-spacer" />

            {/* Zoom Controls */}
            <div className="zoom-controls">
              <button
                className="zoom-btn"
                onClick={() => setZoomLevel(zoomLevel === 'fit' ? '100' : 'fit')}
                title="Fit Canvas"
              >
                <FiMaximize size={12} /> {zoomLevel === 'fit' ? 'Fit' : '100%'}
              </button>
              <select
                className="zoom-select"
                value={zoomLevel}
                onChange={e => setZoomLevel(e.target.value)}
              >
                <option value="fit">Auto Fit</option>
                <option value="50">50%</option>
                <option value="75">75%</option>
                <option value="100">100%</option>
                <option value="125">125%</option>
                <option value="150">150%</option>
              </select>
            </div>
          </div>

          {/* Canvas Area */}
          <div
            className="canvas-area"
            onClick={() => { setSelectedElement(null); setContextMenu(null); }}
          >
            <div className="canvas-wrapper" ref={canvasRef}>
              <div
                className="canvas"
                style={{
                  width: 960 * canvasScale,
                  height: 540 * canvasScale,
                  ...getSlideBg()
                }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setSelectedElement(null);
                    setShowAddMenu(false);
                    setContextMenu(null);
                  }
                }}
              >
                {slide?.elements?.map(element => (
                  <EditableElement
                    key={element.id}
                    element={element}
                    isSelected={selectedElement === element.id}
                    onSelect={() => setSelectedElement(element.id)}
                    onContextMenu={handleContextMenu}
                    onDrag={onDrag}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onResize={onResize}
                    onResizeStart={onResizeStart}
                    onResizeEnd={onResizeEnd}
                    onTextUpdate={onTextUpdate}
                    scale={canvasScale}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right-Click Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          element={selectedEl}
          onAction={handleContextAction}
          onClose={() => setContextMenu(null)}
        />
      )}

      {showPresent && (
        <PresenterMode
          slides={slides}
          initialIndex={currentSlide}
          onClose={() => setShowPresent(false)}
        />
      )}

      {showShortcuts && (
        <ShortcutsModal onClose={() => setShowShortcuts(false)} />
      )}

      {showDraftModal && (
        <DraftModal
          mode={draftModalMode}
          currentData={{ name: presentationTitle, slides }}
          onSelectDraft={handleLoadDraft}
          onSaved={() => refreshDraftCount()}
          onClose={() => setShowDraftModal(false)}
        />
      )}

      {showImportModal && (
        <ImportModal
          onImportComplete={({ slides: impSlides, title: impTitle }) => {
            addUndo();
            setSlides(impSlides);
            if (impTitle) setPresentationTitle(impTitle);
            setCurrentSlide(0);
          }}
          onClose={() => setShowImportModal(false)}
        />
      )}

      {showAIModal && (
        <AIGeneratorModal
          onGenerated={({ slides: aiSlides, title: aiTitle }) => {
            addUndo();
            setSlides(aiSlides);
            if (aiTitle) setPresentationTitle(aiTitle);
            setCurrentSlide(0);
          }}
          onClose={() => setShowAIModal(false)}
        />
      )}

      {showConverterModal && (
        <FormatConverterModal onClose={() => setShowConverterModal(false)} />
      )}

      {showExport && <ExportModal slides={slides} title={presentationTitle} onClose={() => setShowExport(false)} />}
      {showVideoModal && <VideoUrlModal onClose={() => setShowVideoModal(false)} onAdd={addVideo} />}
    </div>
  );
}
