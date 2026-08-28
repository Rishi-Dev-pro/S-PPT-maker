const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ override: true });

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ppt-maker';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.log('MongoDB connection failed, using in-memory storage');
  });

// Presentation Schema
const slideElementSchema = new mongoose.Schema({
  id: String,
  type: { type: String, enum: ['text', 'image', 'shape', 'icon'] },
  x: Number,
  y: Number,
  width: Number,
  height: Number,
  content: mongoose.Schema.Types.Mixed,
  style: mongoose.Schema.Types.Mixed,
}, { _id: false });

const slideSchema = new mongoose.Schema({
  id: String,
  elements: [slideElementSchema],
  background: mongoose.Schema.Types.Mixed,
  layout: String,
}, { _id: false });

const presentationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, default: 'Anonymous' },
  thumbnail: String,
  slides: [slideSchema],
  templateId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Presentation = mongoose.model('Presentation', presentationSchema);

// In-memory fallback storage
let inMemoryPresentations = [];
let useInMemory = false;

// Check if mongoose is connected
mongoose.connection.on('error', () => { useInMemory = true; });
mongoose.connection.on('disconnected', () => { useInMemory = true; });

// API Routes

// Get all presentations
app.get('/api/presentations', async (req, res) => {
  try {
    if (useInMemory || mongoose.connection.readyState !== 1) {
      return res.json(inMemoryPresentations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
    }
    const presentations = await Presentation.find().sort({ updatedAt: -1 });
    res.json(presentations);
  } catch (err) {
    res.json(inMemoryPresentations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
  }
});

// Get single presentation
app.get('/api/presentations/:id', async (req, res) => {
  try {
    if (useInMemory || mongoose.connection.readyState !== 1) {
      const pres = inMemoryPresentations.find(p => p._id === req.params.id);
      if (!pres) return res.status(404).json({ error: 'Not found' });
      return res.json(pres);
    }
    const presentation = await Presentation.findById(req.params.id);
    if (!presentation) return res.status(404).json({ error: 'Not found' });
    res.json(presentation);
  } catch (err) {
    const pres = inMemoryPresentations.find(p => p._id === req.params.id);
    if (!pres) return res.status(404).json({ error: 'Not found' });
    res.json(pres);
  }
});

// Create presentation
app.post('/api/presentations', async (req, res) => {
  try {
    const { title, author, slides, templateId, thumbnail } = req.body;
    if (useInMemory || mongoose.connection.readyState !== 1) {
      const newPres = {
        _id: require('uuid').v4(),
        title: title || 'Untitled Presentation',
        author: author || 'Anonymous',
        slides: slides || [],
        templateId: templateId || '',
        thumbnail: thumbnail || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      inMemoryPresentations.push(newPres);
      return res.status(201).json(newPres);
    }
    const presentation = new Presentation({
      title: title || 'Untitled Presentation',
      author: author || 'Anonymous',
      slides: slides || [],
      templateId: templateId || '',
      thumbnail: thumbnail || '',
    });
    await presentation.save();
    res.status(201).json(presentation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update presentation
app.put('/api/presentations/:id', async (req, res) => {
  try {
    const { title, author, slides, thumbnail } = req.body;
    const updateData = { updatedAt: new Date() };
    if (title) updateData.title = title;
    if (author) updateData.author = author;
    if (slides) updateData.slides = slides;
    if (thumbnail) updateData.thumbnail = thumbnail;

    if (useInMemory || mongoose.connection.readyState !== 1) {
      const idx = inMemoryPresentations.findIndex(p => p._id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: 'Not found' });
      inMemoryPresentations[idx] = { ...inMemoryPresentations[idx], ...updateData };
      return res.json(inMemoryPresentations[idx]);
    }
    const presentation = await Presentation.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!presentation) return res.status(404).json({ error: 'Not found' });
    res.json(presentation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete presentation
app.delete('/api/presentations/:id', async (req, res) => {
  try {
    if (useInMemory || mongoose.connection.readyState !== 1) {
      const idx = inMemoryPresentations.findIndex(p => p._id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: 'Not found' });
      inMemoryPresentations.splice(idx, 1);
      return res.json({ message: 'Deleted' });
    }
    await Presentation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', storage: useInMemory ? 'in-memory' : 'mongodb' });
});

const PORT = parseInt(process.env.PORT, 10) || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
