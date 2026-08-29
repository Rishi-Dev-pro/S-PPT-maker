import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiPlus, FiLayout, FiZap, FiRefreshCw, FiUploadCloud, FiFolder } from 'react-icons/fi';
import { getOccupiedDraftCount } from '../utils/draftStorage';
import './Navbar.css';

export default function Navbar({ isHome = false, isStickyVisible = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [draftCount, setDraftCount] = useState(0);

  useEffect(() => {
    setDraftCount(getOccupiedDraftCount());
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`global-navbar ${isHome ? 'home-navbar' : ''} ${!isStickyVisible && isHome ? 'navbar-hidden' : 'navbar-visible'}`}>
      <div className="navbar-container">
        <div className="nav-brand" onClick={() => navigate('/')} role="button" tabIndex={0}>
          <div className="brand-logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="url(#nav-brand-grad)" />
              <path d="M8 10h12M8 14h8M8 18h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <defs>
                <linearGradient id="nav-brand-grad" x1="0" y1="0" x2="28" y2="28">
                  <stop stopColor="#7c3aed" />
                  <stop offset="1" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="brand-title">S-PPT-Maker</span>
        </div>

        <nav className="nav-links">
          <button
            className={`nav-link-btn ${isActive('/') ? 'active' : ''}`}
            onClick={() => {
              if (location.pathname === '/') {
                document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' });
              } else {
                navigate('/');
              }
            }}
          >
            <FiLayout size={15} /> <span>Templates</span>
          </button>

          <button
            className={`nav-link-btn ai-highlight ${isActive('/ai-generator') ? 'active' : ''}`}
            onClick={() => navigate('/ai-generator')}
          >
            <FiZap size={15} /> <span>✨ AI Generator</span>
          </button>

          <button
            className={`nav-link-btn ${isActive('/import') ? 'active' : ''}`}
            onClick={() => navigate('/import')}
          >
            <FiUploadCloud size={15} /> <span>Import</span>
          </button>

          <button
            className={`nav-link-btn ${isActive('/converter') ? 'active' : ''}`}
            onClick={() => navigate('/converter')}
          >
            <FiRefreshCw size={15} /> <span>Converter</span>
          </button>

          <button
            className={`nav-link-btn ${isActive('/drafts') ? 'active' : ''}`}
            onClick={() => navigate('/drafts')}
          >
            <FiFolder size={15} /> <span>Drafts ({draftCount}/3)</span>
          </button>
        </nav>

        <div className="nav-cta-wrapper">
          <button className="nav-cta-btn" onClick={() => navigate('/editor', { state: { blank: true } })}>
            <FiPlus size={16} /> <span>New Presentation</span>
          </button>
        </div>
      </div>
    </header>
  );
}
