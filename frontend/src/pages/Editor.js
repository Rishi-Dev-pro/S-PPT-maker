import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiPlus, FiTrash2, FiCopy, FiArrowUp, FiArrowDown, FiDownload,
  FiType, FiSquare, FiCircle, FiImage, FiAlignLeft, FiAlignCenter, FiAlignRight,
  FiBold, FiItalic, FiArrowLeft, FiChevronDown, FiVideo
} from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import { createSlidesFromTemplate, getTemplateById, createNewSlideForTemplate } from '../data/templates';
import ExportModal from '../components/ExportModal';
import './Editor.css';

const FONTS = ['Inter', 'Poppins', 'Space Grotesk', 'Arial', 'Georgia', 'Courier New', 'Verdana', 'Times New Roman'];
const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 72, 80];

function createBlankSlide() {
  return { id: uuidv4(), elements: [], background: { type: 'solid', color: '#ffffff' }, layout: 'blank' };
}

function createBlankElement(type) {
  if (type === 'text') {
    return { id: uuidv4(), type: 'text', x: 100, y: 200, width: 500, height: 80, content: { text: 'Double-click to edit', fontSize: 24, fontWeight: 'normal', fontFamily: 'Inter', color: '#333333' }, style: {} };
  }
  if (type === 'rect') {
    return { id: uuidv4(), type: 'shape', x: 200, y: 150, width: 200, height: 150, content: { shapeType: 'rect', color: '#7c3aed', borderRadius: 12 }, style: {} };
  }
  if (type === 'circle') {
    return { id: uuidv4(), type: 'shape', x: 250, y: 150, width: 150, height: 150, content: { shapeType: 'circle', color: '#ef4444', borderRadius: 999 }, style: {} };
  }
  return null;
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
        {/* Show images */}
        {slide.elements.filter(e => e.type === 'image').map(el => (
          <div key={el.id} style={{
            position: 'absolute',
            left: `${(el.x / 960) * 100}%`,
            top: `${(el.y / 540) * 100}%`,
            width: `${(el.width / 960) * 100}%`,
            height: `${(el.height / 540) * 100}%`,
            overflow: 'hidden',
            backgroundImage: `url(${el.content.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: el.style?.opacity || 1,
          }} />
        ))}
        {/* Show shapes (as colored overlays) */}
        {slide.elements.filter(e => e.type === 'shape' && e.content.color !== 'transparent' && e.content.color !== 'rgba(0,0,0,0.03)' && !e.content.color.startsWith('rgba(255,255,255')).map(el => (
          <div key={el.id} style={{
            position: 'absolute',
            left: `${(el.x / 960) * 100}%`,
            top: `${(el.y / 540) * 100}%`,
            width: `${(el.width / 960) * 100}%`,
            height: `${(el.height / 540) * 100}%`,
            background: el.content.color,
            borderRadius: el.content.borderRadius > 20 ? '2px' : '0',
            opacity: el.style?.opacity || 1,
          }} />
        ))}
        {/* Show text - fixed overflow */}
        {slide.elements.filter(e => e.type === 'text').slice(0, 3).map(el => (
          <div key={el.id} style={{
            position: 'absolute',
            left: `${(el.x / 960) * 100}%`,
            top: `${(el.y / 540) * 100}%`,
            width: `${(el.width / 960) * 100}%`,
            fontSize: '4px',
            fontWeight: el.content.fontWeight >= 700 ? '700' : '400',
            color: el.content.color,
            overflow: 'hidden',
            lineHeight: 1.25,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}>
            {el.content.text?.split('\n')[0]?.substring(0, 50)}
          </div>
        ))}
      </div>
      <div className="slide-thumb-footer">
        <span className="slide-number">{index + 1}</span>
        <div className="slide-thumb-actions" onClick={e => e.stopPropagation()}>
          {index > 0 && <button onClick={onMoveUp}><FiArrowUp size={11} /></button>}
          {index < total - 1 && <button onClick={onMoveDown}><FiArrowDown size={11} /></button>}
          <button onClick={onDuplicate}><FiCopy size={11} /></button>
          {total > 1 && <button onClick={onDelete} className="del-btn"><FiTrash2 size={11} /></button>}
        </div>
      </div>
    </div>
  );
}

// ── Editable Element ──
function EditableElement({ element, isSelected, onSelect, onDrag, onResize, scale }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(element.content.text || '');
  const textRef = useRef(null);
  const dragRef = useRef({ dragging: false, startX: 0, startY: 0, origX: 0, origY: 0 });
  const resizeRef = useRef({ resizing: false, startX: 0, startY: 0, origW: 0, origH: 0, origX: 0, origY: 0, handle: '' });

  useEffect(() => { setText(element.content.text || ''); }, [element.content.text]);

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (element.type === 'text') {
      setEditing(true);
      setTimeout(() => textRef.current?.focus(), 10);
    }
  };

  const handleBlur = () => { setEditing(false); element.content.text = text; };
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { setEditing(false); element.content.text = text; }
  };

  const handleMouseDown = (e) => {
    if (editing) return;
    e.stopPropagation();
    onSelect();
    dragRef.current = { dragging: true, startX: e.clientX, startY: e.clientY, origX: element.x, origY: element.y };
    const handleMouseMove = (ev) => {
      if (!dragRef.current.dragging) return;
      const dx = (ev.clientX - dragRef.current.startX) / scale;
      const dy = (ev.clientY - dragRef.current.startY) / scale;
      onDrag(element.id, dragRef.current.origX + dx, dragRef.current.origY + dy);
    };
    const handleMouseUp = () => { dragRef.current.dragging = false; document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp); };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeStart = (e, handle) => {
    e.stopPropagation(); e.preventDefault();
    resizeRef.current = { resizing: true, startX: e.clientX, startY: e.clientY, origW: element.width, origH: element.height, origX: element.x, origY: element.y, handle };
    const handleMouseMove = (ev) => {
      if (!resizeRef.current.resizing) return;
      const dx = (ev.clientX - resizeRef.current.startX) / scale;
      const dy = (ev.clientY - resizeRef.current.startY) / scale;
      let newW = resizeRef.current.origW, newH = resizeRef.current.origH;
      let newX = resizeRef.current.origX, newY = resizeRef.current.origY;
      const h = resizeRef.current.handle;
      if (h.includes('e')) newW = Math.max(40, resizeRef.current.origW + dx);
      if (h.includes('w')) { newW = Math.max(40, resizeRef.current.origW - dx); newX = resizeRef.current.origX + dx; }
      if (h.includes('s')) newH = Math.max(20, resizeRef.current.origH + dy);
      if (h.includes('n')) { newH = Math.max(20, resizeRef.current.origH - dy); newY = resizeRef.current.origY + dy; }
      onResize(element.id, newX, newY, newW, newH);
    };
    const handleMouseUp = () => { resizeRef.current.resizing = false; document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp); };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const ResizeHandles = () => isSelected && !editing ? (
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
    cursor: editing ? 'text' : (element.type === 'image' || element.type === 'video' ? 'move' : 'move'),
    opacity: element.style?.opacity || 1,
    zIndex: isSelected ? 10 : 1,
  };

  if (element.type === 'text') {
    const textStyle = {
      fontSize: element.content.fontSize * scale,
      fontWeight: element.content.fontWeight || 'normal',
      fontStyle: element.content.fontStyle || 'normal',
      fontFamily: element.content.fontFamily || 'Inter',
      color: element.content.color || '#333',
      textAlign: element.style?.textAlign || 'left',
      lineHeight: element.content.lineHeight || 1.5,
      width: '100%', height: '100%',
      padding: '4px 8px',
      wordBreak: 'break-word', whiteSpace: 'pre-wrap',
      outline: 'none', border: 'none', background: 'transparent',
      resize: 'none', overflow: 'hidden',
    };
    return (
      <div style={style} onMouseDown={handleMouseDown} onDoubleClick={handleDoubleClick}>
        {editing ? (
          <textarea ref={textRef} value={text} onChange={e => setText(e.target.value)} onBlur={handleBlur} onKeyDown={handleKeyDown} style={{ ...textStyle, resize: 'none' }} />
        ) : (
          <div style={textStyle}>{element.content.text}</div>
        )}
        <ResizeHandles />
      </div>
    );
  }

  if (element.type === 'shape') {
    const isCircle = element.content.shapeType === 'circle';
    const isBgShape = element.width >= 950 && element.height >= 530; // full-slide background shape
    return (
      <div style={{
        ...style,
        background: element.content.color || '#7c3aed',
        borderRadius: isCircle ? '50%' : (element.content.borderRadius || 0),
        border: isSelected ? '2px solid var(--accent)' : 'none',
        pointerEvents: isBgShape ? 'none' : 'auto',
      }} onMouseDown={isBgShape ? undefined : handleMouseDown}>
        {!isBgShape && <ResizeHandles />}
      </div>
    );
  }

  if (element.type === 'image') {
    return (
      <div style={{ ...style, border: isSelected ? '2px solid var(--accent)' : 'none', borderRadius: element.style?.borderRadius || 0, overflow: 'hidden' }} onMouseDown={handleMouseDown}>
        <img src={element.content.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
        <ResizeHandles />
      </div>
    );
  }

  if (element.type === 'video') {
    // Render YouTube video embed as iframe
    const videoId = element.content.videoId || '';
    return (
      <div style={{ ...style, border: isSelected ? '2px solid var(--accent)' : 'none', borderRadius: element.style?.borderRadius || 0, overflow: 'hidden', background: '#000' }} onMouseDown={handleMouseDown}>
        {videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0`}
            style={{ width: '100%', height: '100%', border: 'none' }}
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

// ── Video URL Modal ──
function VideoUrlModal({ onClose, onAdd }) {
  const [url, setUrl] = useState('');
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const extractVideoId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    for (const p of patterns) {
      const m = url.match(p);
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
        <p className="export-subtitle">Paste a YouTube video URL or video ID</p>
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
            Add Video
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Editor ──
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
  const [canvasScale, setCanvasScale] = useState(0.7);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeTemplateId, setActiveTemplateId] = useState(null);

  const addUndo = useCallback(() => {
    setUndoStack(prev => [...prev.slice(-30), JSON.parse(JSON.stringify(slides))]);
    setRedoStack([]);
  }, [slides]);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    setRedoStack(prev => [...prev, JSON.parse(JSON.stringify(slides))]);
    setSlides(undoStack[undoStack.length - 1]);
    setUndoStack(u => u.slice(0, -1));
  }, [undoStack, slides]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    setUndoStack(prev => [...prev, JSON.parse(JSON.stringify(slides))]);
    setSlides(redoStack[redoStack.length - 1]);
    setRedoStack(r => r.slice(0, -1));
  }, [redoStack, slides]);

  // Load template
  useEffect(() => {
    if (location.state?.templateId) {
      const tid = location.state.templateId;
      setActiveTemplateId(tid);
      const newSlides = createSlidesFromTemplate(tid);
      setSlides(newSlides);
      const template = getTemplateById(tid);
      setPresentationTitle(template?.name + ' Presentation' || 'Untitled');
    }
  }, [location.state]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); redo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); setShowExport(true); }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElement && !e.target.closest('textarea') && !e.target.closest('input')) {
        deleteElement(selectedElement);
      }
      if (e.key === 'Escape') { setSelectedElement(null); setShowAddMenu(false); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, slides, undo, redo]);

  // Canvas scale
  useEffect(() => {
    const updateScale = () => {
      if (!canvasRef.current) return;
      const parent = canvasRef.current.parentElement;
      if (!parent) return;
      const availW = parent.clientWidth - 60;
      const availH = parent.clientHeight - 60;
      setCanvasScale(Math.min(availW / 960, availH / 540, 1));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const slide = slides[currentSlide] || slides[0];

  // ── Slide Operations ──
  const addSlide = (afterIndex) => {
    addUndo();
    let newSlide;
    if (activeTemplateId) {
      newSlide = createNewSlideForTemplate(activeTemplateId);
    } else {
      // Use current slide's style as base
      const base = JSON.parse(JSON.stringify(slides[afterIndex] || slides[0]));
      newSlide = {
        ...base,
        id: uuidv4(),
        elements: base.elements
          .filter(el => el.type !== 'image' && el.type !== 'image-placeholder')
          .map(el => ({ ...el, id: uuidv4() }))
      };
    }
    const newSlides = [...slides];
    newSlides.splice(afterIndex + 1, 0, newSlide);
    setSlides(newSlides);
    setCurrentSlide(afterIndex + 1);
  };

  const deleteSlide = (index) => {
    if (slides.length <= 1) return;
    addUndo();
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    if (currentSlide >= newSlides.length) setCurrentSlide(newSlides.length - 1);
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
    addUndo();
    const el = createBlankElement(type);
    if (!el) return;
    const newSlides = [...slides];
    newSlides[currentSlide] = { ...newSlides[currentSlide], elements: [...newSlides[currentSlide].elements, el] };
    setSlides(newSlides);
    setSelectedElement(el.id);
    setShowAddMenu(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      addUndo();
      const el = { id: uuidv4(), type: 'image', x: 100, y: 100, width: 400, height: 300, content: { src: ev.target.result }, style: { borderRadius: 8 } };
      const newSlides = [...slides];
      newSlides[currentSlide] = { ...newSlides[currentSlide], elements: [...newSlides[currentSlide].elements, el] };
      setSlides(newSlides);
      setSelectedElement(el.id);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const addVideo = (videoId) => {
    addUndo();
    const el = { id: uuidv4(), type: 'video', x: 80, y: 80, width: 500, height: 280, content: { videoId }, style: { borderRadius: 12 } };
    const newSlides = [...slides];
    newSlides[currentSlide] = { ...newSlides[currentSlide], elements: [...newSlides[currentSlide].elements, el] };
    setSlides(newSlides);
    setSelectedElement(el.id);
  };

  const deleteElement = (elementId) => {
    addUndo();
    const newSlides = [...slides];
    newSlides[currentSlide] = { ...newSlides[currentSlide], elements: newSlides[currentSlide].elements.filter(el => el.id !== elementId) };
    setSlides(newSlides);
    setSelectedElement(null);
  };

  const updateElement = (elementId, updates) => {
    const newSlides = [...slides];
    newSlides[currentSlide] = {
      ...newSlides[currentSlide],
      elements: newSlides[currentSlide].elements.map(el =>
        el.id === elementId ? { ...el, ...updates, content: { ...el.content, ...updates.content }, style: { ...el.style, ...updates.style } } : el
      )
    };
    setSlides(newSlides);
  };

  const onDrag = (elementId, x, y) => updateElement(elementId, { x: Math.max(0, x), y: Math.max(0, y) });
  const onResize = (elementId, x, y, width, height) => updateElement(elementId, { x, y, width, height });

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

  const selectedEl = slide?.elements?.find(e => e.id === selectedElement);

  return (
    <div className="editor">
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />

      {/* Top Bar */}
      <div className="editor-topbar">
        <div className="topbar-left">
          <button className="back-btn" onClick={() => navigate('/')}><FiArrowLeft size={18} /></button>
          <input className="title-input" value={presentationTitle} onChange={e => setPresentationTitle(e.target.value)} placeholder="Untitled" />
        </div>
        <div className="topbar-right">
          <button className="topbar-btn" onClick={undo} title="Undo (Ctrl+Z)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10h10a5 5 0 015 5v2M3 10l5 5M3 10l5-5"/></svg>
          </button>
          <button className="topbar-btn" onClick={redo} title="Redo (Ctrl+Y)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10H11a5 5 0 00-5 5v2M21 10l-5 5M21 10l-5-5"/></svg>
          </button>
          <div className="topbar-divider" />
          <button className="topbar-btn export-btn" onClick={() => setShowExport(true)}>
            <FiDownload size={15} /> Export
          </button>
        </div>
      </div>

      <div className="editor-body">
        {/* Slide Panel */}
        <div className="slide-panel">
          <div className="slide-panel-header">
            <span>Slides</span>
            <button className="add-slide-btn" onClick={() => addSlide(currentSlide)}><FiPlus size={14} /></button>
          </div>
          <div className="slide-list">
            {slides.map((s, i) => (
              <SlideThumbnail key={s.id} slide={s} index={i} isActive={i === currentSlide}
                onClick={() => { setCurrentSlide(i); setSelectedElement(null); }}
                onDelete={() => deleteSlide(i)} onDuplicate={() => duplicateSlide(i)}
                onMoveUp={() => moveSlide(i, i - 1)} onMoveDown={() => moveSlide(i, i + 1)} total={slides.length} />
            ))}
          </div>
          <button className="add-slide-full" onClick={() => addSlide(currentSlide)}>
            <FiPlus size={15} /> Add Slide
          </button>
        </div>

        {/* Toolbar & Canvas */}
        <div className="toolbar-canvas-area">
          <div className="toolbar">
            <div className="toolbar-group">
              <div className="add-dropdown">
                <button className="toolbar-btn accent" onClick={() => setShowAddMenu(!showAddMenu)}>
                  <FiPlus size={14} /> Add
                </button>
                {showAddMenu && (
                  <div className="dropdown-menu">
                    <button onClick={() => addElement('text')}><FiType size={14} /> Text</button>
                    <button onClick={() => addElement('rect')}><FiSquare size={14} /> Rectangle</button>
                    <button onClick={() => addElement('circle')}><FiCircle size={14} /> Circle</button>
                    <button onClick={() => addElement('image')}><FiImage size={14} /> Image</button>
                    <button onClick={() => addElement('video')}><FiVideo size={14} /> YouTube Video</button>
                  </div>
                )}
              </div>
            </div>

            {selectedEl?.type === 'text' && (
              <>
                <div className="tb-div" />
                <div className="toolbar-group">
                  <select className="tb-select" value={selectedEl.content.fontFamily || 'Inter'} onChange={e => updateElement(selectedElement, { content: { fontFamily: e.target.value } })}>
                    {FONTS.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
                  </select>
                  <select className="tb-select sm" value={selectedEl.content.fontSize || 24} onChange={e => updateElement(selectedElement, { content: { fontSize: parseInt(e.target.value) } })}>
                    {FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="tb-div" />
                <div className="toolbar-group">
                  <button className={`tb-icon ${selectedEl.content.fontWeight >= 700 ? 'on' : ''}`} onClick={() => updateElement(selectedElement, { content: { fontWeight: selectedEl.content.fontWeight >= 700 ? 'normal' : 'bold' } })}><FiBold size={14} /></button>
                  <button className={`tb-icon ${selectedEl.content.fontStyle === 'italic' ? 'on' : ''}`} onClick={() => updateElement(selectedElement, { content: { fontStyle: selectedEl.content.fontStyle === 'italic' ? 'normal' : 'italic' } })}><FiItalic size={14} /></button>
                </div>
                <div className="tb-div" />
                <div className="toolbar-group">
                  <button className={`tb-icon ${!selectedEl.style?.textAlign || selectedEl.style?.textAlign === 'left' ? 'on' : ''}`} onClick={() => updateElement(selectedElement, { style: { textAlign: 'left' } })}><FiAlignLeft size={14} /></button>
                  <button className={`tb-icon ${selectedEl.style?.textAlign === 'center' ? 'on' : ''}`} onClick={() => updateElement(selectedElement, { style: { textAlign: 'center' } })}><FiAlignCenter size={14} /></button>
                  <button className={`tb-icon ${selectedEl.style?.textAlign === 'right' ? 'on' : ''}`} onClick={() => updateElement(selectedElement, { style: { textAlign: 'right' } })}><FiAlignRight size={14} /></button>
                </div>
                <div className="tb-div" />
                <div className="toolbar-group">
                  <label className="color-label">
                    <span className="color-dot" style={{ background: selectedEl.content.color }} />
                    <input type="color" value={selectedEl.content.color || '#333333'} onChange={e => updateElement(selectedElement, { content: { color: e.target.value } })} className="color-input" />
                  </label>
                </div>
              </>
            )}

            {selectedEl?.type === 'shape' && (
              <>
                <div className="tb-div" />
                <div className="toolbar-group">
                  <label className="color-label">
                    <span>Fill</span>
                    <span className="color-dot" style={{ background: selectedEl.content.color }} />
                    <input type="color" value={selectedEl.content.color || '#7c3aed'} onChange={e => updateElement(selectedElement, { content: { color: e.target.value } })} className="color-input" />
                  </label>
                </div>
              </>
            )}

            {selectedEl?.type === 'video' && (
              <>
                <div className="tb-div" />
                <div className="toolbar-group" style={{ gap: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>YouTube ID:</span>
                  <input
                    style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '4px 8px', fontSize: 12, color: 'var(--text-primary)', width: 140 }}
                    value={selectedEl.content.videoId || ''}
                    onChange={e => {
                      const url = e.target.value;
                      const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/) || url.match(/^([a-zA-Z0-9_-]{11})$/);
                      updateElement(selectedElement, { content: { videoId: m ? m[1] : url } });
                    }}
                    placeholder="Paste YouTube URL"
                  />
                </div>
              </>
            )}

            <div className="tb-spacer" />

            {selectedElement && (
              <button className="toolbar-btn danger" onClick={() => deleteElement(selectedElement)}>
                <FiTrash2 size={13} /> Delete
              </button>
            )}
          </div>

          {/* Background bar */}
          <div className="bg-bar">
            <span className="bg-label">Background</span>
            <div className="bg-colors">
              {['#ffffff', '#f8fafc', '#0f172a', '#18181b', '#0a0a0a', '#1e293b', '#ecfdf5', '#eff6ff', '#fef3c2', '#fff7ed', '#faf5ff', '#064e3b'].map(c => (
                <button key={c} className={`bg-btn ${slide?.background?.color === c ? 'on' : ''}`} style={{ background: c }} onClick={() => updateSlideBackground(c)} />
              ))}
              <label className="color-label bg-custom">
                <input type="color" value={slide?.background?.color || '#ffffff'} onChange={e => updateSlideBackground(e.target.value)} className="color-input" />
                <FiChevronDown size={10} />
              </label>
            </div>
          </div>

          {/* Canvas */}
          <div className="canvas-area">
            <div className="canvas-wrapper" ref={canvasRef}>
              <div className="canvas" style={{ width: 960 * canvasScale, height: 540 * canvasScale, ...getSlideBg() }}
                onClick={(e) => { if (e.target === e.currentTarget) { setSelectedElement(null); setShowAddMenu(false); } }}>
                {slide?.elements?.filter(el => el.type !== 'text' && el.type !== 'shape').map(element => (
                  <EditableElement key={element.id} element={element} isSelected={selectedElement === element.id}
                    onSelect={() => setSelectedElement(element.id)} onDrag={onDrag} onResize={onResize} scale={canvasScale} />
                ))}
                {slide?.elements?.filter(el => el.type === 'shape' && el.width < 950).map(element => (
                  <EditableElement key={element.id} element={element} isSelected={selectedElement === element.id}
                    onSelect={() => setSelectedElement(element.id)} onDrag={onDrag} onResize={onResize} scale={canvasScale} />
                ))}
                {slide?.elements?.filter(el => el.type === 'text').map(element => (
                  <EditableElement key={element.id} element={element} isSelected={selectedElement === element.id}
                    onSelect={() => setSelectedElement(element.id)} onDrag={onDrag} onResize={onResize} scale={canvasScale} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showExport && <ExportModal slides={slides} title={presentationTitle} onClose={() => setShowExport(false)} />}
      {showVideoModal && <VideoUrlModal onClose={() => setShowVideoModal(false)} onAdd={addVideo} />}
    </div>
  );
}
