import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './pages/Home';
import Editor from './pages/Editor';
import AIGeneratorPage from './pages/AIGeneratorPage';
import ConverterPage from './pages/ConverterPage';
import ImportPage from './pages/ImportPage';
import DraftsPage from './pages/DraftsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/ai-generator" element={<AIGeneratorPage />} />
        <Route path="/converter" element={<ConverterPage />} />
        <Route path="/import" element={<ImportPage />} />
        <Route path="/drafts" element={<DraftsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
