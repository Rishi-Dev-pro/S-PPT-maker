import { v4 as uuidv4 } from 'uuid';

const makeId = () => uuidv4();

// Free stock images from Pexels (direct URLs, no API needed)
const IMAGES = {
  // Professional
  cityNight: '/assets/templates/cityNight.jpg',
  office: '/assets/templates/office.jpg',
  meeting: '/assets/templates/meeting.jpg',
  finance: '/assets/templates/finance.jpg',
  nature: '/assets/templates/nature.jpg',
  abstract: '/assets/templates/abstract.jpg',
  technology: '/assets/templates/technology.jpg',
  // Modern
  gradient: '/assets/templates/gradient.jpg',
  creative: '/assets/templates/creative.jpg',
  laptop: '/assets/templates/laptop.jpg',
  startup: '/assets/templates/startup.jpg',
  // Student
  lab: '/assets/templates/lab.jpg',
  books: '/assets/templates/books.jpg',
  math: '/assets/templates/math.jpg',
  history: '/assets/templates/history.jpg',
  leaves: '/assets/templates/leaves.jpg',
  flowers: '/assets/templates/flowers.jpg',
  space: '/assets/templates/space.jpg',
  mountains: '/assets/templates/mountains.jpg',
  ocean: '/assets/templates/ocean.jpg',
  architecture: '/assets/templates/architecture.jpg',
  // CS — Cloud
  cloud: '/assets/templates/cloud.jpg',
  servers: '/assets/templates/servers.jpg',
  serverRoom: '/assets/templates/server_room.jpg',
  cloudDatacenter: '/assets/templates/cloud-datacenter.jpg',
  cloudServices: '/assets/templates/cloud-services.jpg',
  // CS — ML
  ai: '/assets/templates/ai.jpg',
  data: '/assets/templates/data.jpg',
  mlNeural: '/assets/templates/ml-neural.jpg',
  mlModel: '/assets/templates/ml-model.jpg',
  // CS — Networking
  networking: '/assets/templates/networking.jpg',
  netTopology: '/assets/templates/net-topology.jpg',
  netProtocol: '/assets/templates/net-protocol.jpg',
  netInfra: '/assets/templates/net-infra.jpg',
  // CS — Software Engineering
  coding: '/assets/templates/coding.jpg',
  code: '/assets/templates/code.jpg',
  seDevops: '/assets/templates/se-devops.jpg',
  seTesting: '/assets/templates/se-testing.jpg',
  seArchitecture: '/assets/templates/se-architecture.jpg',
};

// ════════════════════════════════════════════
// SLIDE LAYOUT BUILDERS
// ════════════════════════════════════════════

// Title slide with full background image + overlay
const heroSlide = (title, subtitle, imageUrl, overlayColor, accentColor) => ({
  id: makeId(),
  elements: [
    { id: makeId(), type: 'image', x: 0, y: 0, width: 960, height: 540, content: { src: imageUrl }, style: { borderRadius: 0, opacity: 1 } },
    { id: makeId(), type: 'shape', x: 0, y: 0, width: 960, height: 540, content: { shapeType: 'rect', color: overlayColor, borderRadius: 0 }, style: { opacity: 0.55 } },
    { id: makeId(), type: 'text', x: 70, y: 155, width: 520, height: 140, content: { text: title, fontSize: 52, fontWeight: '900', fontFamily: 'Poppins', color: accentColor, lineHeight: 1.08 }, style: { textAlign: 'left' } },
    { id: makeId(), type: 'shape', x: 70, y: 315, width: 80, height: 4, content: { shapeType: 'rect', color: accentColor, borderRadius: 2 }, style: { opacity: 0.7 } },
    { id: makeId(), type: 'text', x: 70, y: 335, width: 520, height: 50, content: { text: subtitle, fontSize: 18, fontWeight: '400', fontFamily: 'Inter', color: accentColor, lineHeight: 1.5 }, style: { textAlign: 'left', opacity: 0.85 } },
  ],
  background: { type: 'solid', color: '#000000' },
  layout: 'hero'
});

// Content slide with accent bar + title
const contentSlide = (title, bullets, bg, accent, text) => ({
  id: makeId(),
  elements: [
    { id: makeId(), type: 'shape', x: 0, y: 0, width: 6, height: 540, content: { shapeType: 'rect', color: accent, borderRadius: 0 }, style: { opacity: 0.8 } },
    { id: makeId(), type: 'text', x: 40, y: 30, width: 880, height: 50, content: { text: title, fontSize: 30, fontWeight: '700', fontFamily: 'Poppins', color: accent }, style: { textAlign: 'left' } },
    { id: makeId(), type: 'shape', x: 40, y: 82, width: 60, height: 3, content: { shapeType: 'rect', color: accent, borderRadius: 2 }, style: { opacity: 0.5 } },
    { id: makeId(), type: 'text', x: 40, y: 105, width: 880, height: 410, content: { text: bullets.map(b => `${String.fromCharCode(8226)}  ${b}`).join('\n'), fontSize: 19, fontWeight: '400', fontFamily: 'Inter', color: text, lineHeight: 2.0 }, style: { textAlign: 'left' } }
  ],
  background: typeof bg === 'object' ? { type: 'solid', color: bg.solid } : { type: 'solid', color: bg },
  layout: 'content'
});

// Two-column with glass panels
const twoColumn = (title, lt, lb, rt, rb, bg, accent, text) => ({
  id: makeId(),
  elements: [
    { id: makeId(), type: 'text', x: 40, y: 28, width: 880, height: 50, content: { text: title, fontSize: 28, fontWeight: '700', fontFamily: 'Poppins', color: accent }, style: { textAlign: 'left' } },
    { id: makeId(), type: 'shape', x: 40, y: 80, width: 60, height: 3, content: { shapeType: 'rect', color: accent, borderRadius: 2 }, style: { opacity: 0.5 } },
    { id: makeId(), type: 'shape', x: 40, y: 105, width: 430, height: 400, content: { shapeType: 'rect', color: 'rgba(0,0,0,0.03)', borderRadius: 16 }, style: { opacity: 1 } },
    { id: makeId(), type: 'text', x: 60, y: 120, width: 390, height: 30, content: { text: lt, fontSize: 16, fontWeight: '700', fontFamily: 'Poppins', color: accent }, style: { textAlign: 'left' } },
    { id: makeId(), type: 'text', x: 60, y: 160, width: 390, height: 330, content: { text: lb.map(b => `${String.fromCharCode(8226)}  ${b}`).join('\n'), fontSize: 15, fontWeight: '400', fontFamily: 'Inter', color: text, lineHeight: 1.9 }, style: { textAlign: 'left' } },
    { id: makeId(), type: 'shape', x: 490, y: 105, width: 430, height: 400, content: { shapeType: 'rect', color: 'rgba(0,0,0,0.03)', borderRadius: 16 }, style: { opacity: 1 } },
    { id: makeId(), type: 'text', x: 510, y: 120, width: 390, height: 30, content: { text: rt, fontSize: 16, fontWeight: '700', fontFamily: 'Poppins', color: accent }, style: { textAlign: 'left' } },
    { id: makeId(), type: 'text', x: 510, y: 160, width: 390, height: 330, content: { text: rb.map(b => `${String.fromCharCode(8226)}  ${b}`).join('\n'), fontSize: 15, fontWeight: '400', fontFamily: 'Inter', color: text, lineHeight: 1.9 }, style: { textAlign: 'left' } },
  ],
  background: typeof bg === 'object' ? { type: 'solid', color: bg.solid } : { type: 'solid', color: bg },
  layout: 'two-column'
});

// Stats cards
const statsSlide = (title, stats, bg, accent, text) => ({
  id: makeId(),
  elements: [
    { id: makeId(), type: 'text', x: 40, y: 28, width: 880, height: 50, content: { text: title, fontSize: 28, fontWeight: '700', fontFamily: 'Poppins', color: accent }, style: { textAlign: 'left' } },
    { id: makeId(), type: 'shape', x: 40, y: 80, width: 60, height: 3, content: { shapeType: 'rect', color: accent, borderRadius: 2 }, style: { opacity: 0.5 } },
    ...stats.flatMap((stat, i) => {
      const x = 40 + (i % 3) * 300;
      const y = 115 + Math.floor(i / 3) * 200;
      return [
        { id: makeId(), type: 'shape', x, y, width: 270, height: 175, content: { shapeType: 'rect', color: 'rgba(0,0,0,0.03)', borderRadius: 16 }, style: { opacity: 1 } },
        { id: makeId(), type: 'text', x: x + 24, y: y + 30, width: 220, height: 60, content: { text: stat.value, fontSize: 42, fontWeight: '800', fontFamily: 'Poppins', color: accent, lineHeight: 1.1 }, style: { textAlign: 'left' } },
        { id: makeId(), type: 'text', x: x + 24, y: y + 100, width: 220, height: 50, content: { text: stat.label, fontSize: 14, fontWeight: '500', fontFamily: 'Inter', color: text, lineHeight: 1.4 }, style: { textAlign: 'left', opacity: 0.65 } }
      ];
    }),
  ],
  background: typeof bg === 'object' ? { type: 'solid', color: bg.solid } : { type: 'solid', color: bg },
  layout: 'stats'
});

// Image + text split slide
const imageSplitSlide = (title, description, imageUrl, bg, accent, text) => ({
  id: makeId(),
  elements: [
    { id: makeId(), type: 'image', x: 0, y: 0, width: 440, height: 540, content: { src: imageUrl }, style: { borderRadius: 0 } },
    { id: makeId(), type: 'shape', x: 440, y: 0, width: 520, height: 540, content: { shapeType: 'rect', color: bg.solid || bg, borderRadius: 0 }, style: { opacity: 1 } },
    { id: makeId(), type: 'text', x: 470, y: 140, width: 460, height: 80, content: { text: title, fontSize: 32, fontWeight: '800', fontFamily: 'Poppins', color: accent, lineHeight: 1.15 }, style: { textAlign: 'left' } },
    { id: makeId(), type: 'shape', x: 470, y: 230, width: 60, height: 3, content: { shapeType: 'rect', color: accent, borderRadius: 2 }, style: { opacity: 0.5 } },
    { id: makeId(), type: 'text', x: 470, y: 255, width: 460, height: 120, content: { text: description, fontSize: 16, fontWeight: '400', fontFamily: 'Inter', color: text, lineHeight: 1.6 }, style: { textAlign: 'left', opacity: 0.8 } },
  ],
  background: { type: 'solid', color: '#ffffff' },
  layout: 'image-split'
});

// End/thank you slide with image background
const endSlide = (title, subtitle, imageUrl, overlayColor, accentColor) => ({
  id: makeId(),
  elements: [
    { id: makeId(), type: 'image', x: 0, y: 0, width: 960, height: 540, content: { src: imageUrl }, style: { borderRadius: 0, opacity: 1 } },
    { id: makeId(), type: 'shape', x: 0, y: 0, width: 960, height: 540, content: { shapeType: 'rect', color: overlayColor, borderRadius: 0 }, style: { opacity: 0.6 } },
    { id: makeId(), type: 'text', x: 100, y: 170, width: 760, height: 90, content: { text: title, fontSize: 48, fontWeight: '800', fontFamily: 'Poppins', color: accentColor, lineHeight: 1.1 }, style: { textAlign: 'center' } },
    { id: makeId(), type: 'shape', x: 400, y: 280, width: 160, height: 3, content: { shapeType: 'rect', color: accentColor, borderRadius: 2 }, style: { opacity: 0.6 } },
    { id: makeId(), type: 'text', x: 100, y: 300, width: 760, height: 50, content: { text: subtitle, fontSize: 17, fontWeight: '400', fontFamily: 'Inter', color: accentColor, lineHeight: 1.4 }, style: { textAlign: 'center', opacity: 0.8 } }
  ],
  background: { type: 'solid', color: '#000000' },
  layout: 'end'
});

// ════════════════════════════════════════════
// CS-SPECIFIC SLIDE BUILDERS
// ════════════════════════════════════════════

// CS Title slide: split layout — text left (~55%), image right (~45%)
const csTitleSlide = (topic, subtitle, imageUrl, bg, accent, text, metaLines) => ({
  id: makeId(),
  elements: [
    // Left panel background
    { id: makeId(), type: 'shape', x: 0, y: 0, width: 560, height: 540, content: { shapeType: 'rect', color: bg, borderRadius: 0 }, style: { opacity: 1 } },
    // Right image
    { id: makeId(), type: 'image', x: 560, y: 0, width: 400, height: 540, content: { src: imageUrl }, style: { borderRadius: 0 } },
    // Topic title
    { id: makeId(), type: 'text', x: 50, y: 80, width: 480, height: 70, content: { text: topic, fontSize: 38, fontWeight: '800', fontFamily: 'Poppins', color: accent, lineHeight: 1.1 }, style: { textAlign: 'left' } },
    // Accent bar
    { id: makeId(), type: 'shape', x: 50, y: 165, width: 60, height: 4, content: { shapeType: 'rect', color: accent, borderRadius: 2 }, style: { opacity: 0.6 } },
    // Subtitle
    { id: makeId(), type: 'text', x: 50, y: 185, width: 480, height: 40, content: { text: subtitle, fontSize: 16, fontWeight: '400', fontFamily: 'Inter', color: text, lineHeight: 1.4 }, style: { textAlign: 'left', opacity: 0.75 } },
    // Meta info block
    { id: makeId(), type: 'text', x: 50, y: 260, width: 480, height: 220, content: { text: metaLines.join('\n'), fontSize: 13, fontWeight: '500', fontFamily: 'Inter', color: text, lineHeight: 2.0 }, style: { textAlign: 'left', opacity: 0.6 } },
  ],
  background: { type: 'solid', color: bg },
  layout: 'cs-title'
});

// CS Content slide with left image
const csContentImageSlide = (title, bullets, imageUrl, bg, accent, text) => ({
  id: makeId(),
  elements: [
    // Image left
    { id: makeId(), type: 'image', x: 0, y: 0, width: 380, height: 540, content: { src: imageUrl }, style: { borderRadius: 0 } },
    // Right panel
    { id: makeId(), type: 'shape', x: 380, y: 0, width: 580, height: 540, content: { shapeType: 'rect', color: bg, borderRadius: 0 }, style: { opacity: 1 } },
    // Title
    { id: makeId(), type: 'text', x: 410, y: 40, width: 520, height: 50, content: { text: title, fontSize: 28, fontWeight: '700', fontFamily: 'Poppins', color: accent }, style: { textAlign: 'left' } },
    // Accent bar
    { id: makeId(), type: 'shape', x: 410, y: 95, width: 50, height: 3, content: { shapeType: 'rect', color: accent, borderRadius: 2 }, style: { opacity: 0.5 } },
    // Bullets
    { id: makeId(), type: 'text', x: 410, y: 115, width: 520, height: 390, content: { text: bullets.map(b => `${String.fromCharCode(8226)}  ${b}`).join('\n'), fontSize: 15, fontWeight: '400', fontFamily: 'Inter', color: text, lineHeight: 1.85 }, style: { textAlign: 'left' } },
  ],
  background: { type: 'solid', color: bg },
  layout: 'cs-content-image'
});

// CS Process flow slide — vertical process with boxes + arrows
const csProcessFlowSlide = (title, steps, bg, accent, text) => ({
  id: makeId(),
  elements: [
    // Title
    { id: makeId(), type: 'text', x: 40, y: 20, width: 880, height: 45, content: { text: title, fontSize: 28, fontWeight: '700', fontFamily: 'Poppins', color: accent }, style: { textAlign: 'left' } },
    // Accent bar
    { id: makeId(), type: 'shape', x: 40, y: 68, width: 50, height: 3, content: { shapeType: 'rect', color: accent, borderRadius: 2 }, style: { opacity: 0.5 } },
    // Process boxes
    ...steps.flatMap((step, i) => {
      const boxW = 180;
      const gap = 20;
      const totalW = steps.length * boxW + (steps.length - 1) * gap;
      const startX = (960 - totalW) / 2;
      const x = startX + i * (boxW + gap);
      const y = 100;
      const boxH = 340;
      const elems = [
        // Box
        { id: makeId(), type: 'shape', x, y, width: boxW, height: boxH, content: { shapeType: 'rect', color: accent, borderRadius: 12 }, style: { opacity: 0.12 } },
        // Step number
        { id: makeId(), type: 'text', x, y: y + 20, width: boxW, height: 36, content: { text: `${i + 1}`, fontSize: 28, fontWeight: '800', fontFamily: 'Poppins', color: accent, lineHeight: 1 }, style: { textAlign: 'center' } },
        // Step label
        { id: makeId(), type: 'text', x: x + 10, y: y + 65, width: boxW - 20, height: 70, content: { text: step.label, fontSize: 14, fontWeight: '700', fontFamily: 'Poppins', color: accent, lineHeight: 1.2 }, style: { textAlign: 'center' } },
        // Description
        { id: makeId(), type: 'text', x: x + 12, y: y + 140, width: boxW - 24, height: 180, content: { text: step.desc, fontSize: 12, fontWeight: '400', fontFamily: 'Inter', color: text, lineHeight: 1.5 }, style: { textAlign: 'center', opacity: 0.7 } },
      ];
      // Arrow between boxes
      if (i < steps.length - 1) {
        const arrowX = x + boxW + 2;
        elems.push({ id: makeId(), type: 'text', x: arrowX, y: y + 140, width: gap - 4, height: 30, content: { text: String.fromCharCode(8594), fontSize: 22, fontWeight: '400', fontFamily: 'Inter', color: accent, lineHeight: 1 }, style: { textAlign: 'center', opacity: 0.5 } });
      }
      return elems;
    }),
  ],
  background: { type: 'solid', color: bg },
  layout: 'cs-process'
});

// CS Cards slide — 6 cards in 2x3 or 3x2 grid
const csCardsSlide = (title, cards, bg, accent, text) => ({
  id: makeId(),
  elements: [
    // Title
    { id: makeId(), type: 'text', x: 40, y: 20, width: 880, height: 45, content: { text: title, fontSize: 28, fontWeight: '700', fontFamily: 'Poppins', color: accent }, style: { textAlign: 'left' } },
    // Accent bar
    { id: makeId(), type: 'shape', x: 40, y: 68, width: 50, height: 3, content: { shapeType: 'rect', color: accent, borderRadius: 2 }, style: { opacity: 0.5 } },
    // Cards
    ...cards.flatMap((card, i) => {
      const x = 40 + (i % 3) * 300;
      const y = 90 + Math.floor(i / 3) * 210;
      return [
        { id: makeId(), type: 'shape', x, y, width: 270, height: 190, content: { shapeType: 'rect', color: accent, borderRadius: 12 }, style: { opacity: 0.08 } },
        { id: makeId(), type: 'text', x: x + 20, y: y + 18, width: 230, height: 36, content: { text: card.title, fontSize: 16, fontWeight: '700', fontFamily: 'Poppins', color: accent }, style: { textAlign: 'left' } },
        { id: makeId(), type: 'text', x: x + 20, y: y + 60, width: 230, height: 110, content: { text: card.desc, fontSize: 13, fontWeight: '400', fontFamily: 'Inter', color: text, lineHeight: 1.5 }, style: { textAlign: 'left', opacity: 0.7 } },
      ];
    }),
  ],
  background: { type: 'solid', color: bg },
  layout: 'cs-cards'
});

// CS Comparison slide — two columns with section headers
const csComparisonSlide = (title, leftTitle, leftItems, rightTitle, rightItems, bg, accent, text) => ({
  id: makeId(),
  elements: [
    // Title
    { id: makeId(), type: 'text', x: 40, y: 20, width: 880, height: 45, content: { text: title, fontSize: 28, fontWeight: '700', fontFamily: 'Poppins', color: accent }, style: { textAlign: 'left' } },
    // Accent bar
    { id: makeId(), type: 'shape', x: 40, y: 68, width: 50, height: 3, content: { shapeType: 'rect', color: accent, borderRadius: 2 }, style: { opacity: 0.5 } },
    // Left panel
    { id: makeId(), type: 'shape', x: 40, y: 90, width: 430, height: 420, content: { shapeType: 'rect', color: accent, borderRadius: 14 }, style: { opacity: 0.06 } },
    { id: makeId(), type: 'text', x: 60, y: 105, width: 390, height: 36, content: { text: leftTitle, fontSize: 18, fontWeight: '700', fontFamily: 'Poppins', color: accent }, style: { textAlign: 'left' } },
    { id: makeId(), type: 'text', x: 60, y: 150, width: 390, height: 340, content: { text: leftItems.map(b => `${String.fromCharCode(8226)}  ${b}`).join('\n'), fontSize: 14, fontWeight: '400', fontFamily: 'Inter', color: text, lineHeight: 1.85 }, style: { textAlign: 'left' } },
    // Right panel
    { id: makeId(), type: 'shape', x: 490, y: 90, width: 430, height: 420, content: { shapeType: 'rect', color: accent, borderRadius: 14 }, style: { opacity: 0.06 } },
    { id: makeId(), type: 'text', x: 510, y: 105, width: 390, height: 36, content: { text: rightTitle, fontSize: 18, fontWeight: '700', fontFamily: 'Poppins', color: accent }, style: { textAlign: 'left' } },
    { id: makeId(), type: 'text', x: 510, y: 150, width: 390, height: 340, content: { text: rightItems.map(b => `${String.fromCharCode(8226)}  ${b}`).join('\n'), fontSize: 14, fontWeight: '400', fontFamily: 'Inter', color: text, lineHeight: 1.85 }, style: { textAlign: 'left' } },
  ],
  background: { type: 'solid', color: bg },
  layout: 'cs-comparison'
});

// CS Conclusion slide — concise bullet points + key takeaway box
const csConclusionSlide = (title, points, takeaway, bg, accent, text) => ({
  id: makeId(),
  elements: [
    // Title
    { id: makeId(), type: 'text', x: 40, y: 30, width: 880, height: 50, content: { text: title, fontSize: 30, fontWeight: '700', fontFamily: 'Poppins', color: accent }, style: { textAlign: 'left' } },
    // Accent bar
    { id: makeId(), type: 'shape', x: 40, y: 84, width: 60, height: 3, content: { shapeType: 'rect', color: accent, borderRadius: 2 }, style: { opacity: 0.5 } },
    // Bullet points
    { id: makeId(), type: 'text', x: 40, y: 105, width: 880, height: 200, content: { text: points.map(p => `${String.fromCharCode(8226)}  ${p}`).join('\n'), fontSize: 17, fontWeight: '400', fontFamily: 'Inter', color: text, lineHeight: 2.0 }, style: { textAlign: 'left' } },
    // Takeaway box
    { id: makeId(), type: 'shape', x: 40, y: 340, width: 880, height: 140, content: { shapeType: 'rect', color: accent, borderRadius: 14 }, style: { opacity: 0.08 } },
    { id: makeId(), type: 'text', x: 60, y: 355, width: 200, height: 30, content: { text: 'Key Takeaway', fontSize: 14, fontWeight: '700', fontFamily: 'Poppins', color: accent }, style: { textAlign: 'left' } },
    { id: makeId(), type: 'text', x: 60, y: 390, width: 840, height: 70, content: { text: takeaway, fontSize: 15, fontWeight: '400', fontFamily: 'Inter', color: text, lineHeight: 1.5 }, style: { textAlign: 'left', opacity: 0.8 } },
  ],
  background: { type: 'solid', color: bg },
  layout: 'cs-conclusion'
});

// CS Thank You slide — clean, simple
const csThankYouSlide = (bg, accent, text, topic) => ({
  id: makeId(),
  elements: [
    // Thank You text
    { id: makeId(), type: 'text', x: 100, y: 140, width: 760, height: 80, content: { text: 'Thank You', fontSize: 52, fontWeight: '800', fontFamily: 'Poppins', color: accent, lineHeight: 1.1 }, style: { textAlign: 'center' } },
    // Accent bar
    { id: makeId(), type: 'shape', x: 400, y: 240, width: 160, height: 3, content: { shapeType: 'rect', color: accent, borderRadius: 2 }, style: { opacity: 0.4 } },
    // Questions
    { id: makeId(), type: 'text', x: 100, y: 260, width: 760, height: 40, content: { text: 'Any Questions?', fontSize: 20, fontWeight: '500', fontFamily: 'Inter', color: text, lineHeight: 1.4 }, style: { textAlign: 'center', opacity: 0.7 } },
    // Topic tag
    { id: makeId(), type: 'text', x: 100, y: 320, width: 760, height: 30, content: { text: topic, fontSize: 13, fontWeight: '600', fontFamily: 'Poppins', color: accent, lineHeight: 1.2 }, style: { textAlign: 'center', opacity: 0.5 } },
    // Placeholder info
    { id: makeId(), type: 'text', x: 200, y: 380, width: 560, height: 100, content: { text: '[Your Name]\n[Student Code]  •  [Course Name]\n[College Name]', fontSize: 13, fontWeight: '400', fontFamily: 'Inter', color: text, lineHeight: 1.8 }, style: { textAlign: 'center', opacity: 0.45 } },
  ],
  background: { type: 'solid', color: bg },
  layout: 'cs-thankyou'
});

// ════════════════════════════════════════════
// PROFESSIONAL TEMPLATES
// ════════════════════════════════════════════

const professionalDark = {
  id: 'pro-dark-elegance',
  name: 'Dark Elegance',
  category: 'professional',
  description: 'Sophisticated dark theme with city imagery for executive decks',
  thumbnail: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
  slides: [
    heroSlide('Strategic Vision\n2025', 'Driving Innovation & Growth', IMAGES.cityNight, '#0f172a', '#f1f5f9'),
    statsSlide('Key Performance Metrics', [
      { value: '$4.2M', label: 'Annual Revenue' },
      { value: '23%', label: 'YoY Growth' },
      { value: '15K+', label: 'Active Users' },
      { value: '98%', label: 'Client Retention' },
      { value: '12', label: 'New Markets' },
      { value: '4.8', label: 'Satisfaction' },
    ], '#0f172a', '#f1f5f9', '#cbd5e1'),
    contentSlide('Market Opportunity', [
      'Global market size projected at $180B by 2027',
      'Digital transformation accelerating across industries',
      'Mid-market segment underserved by current solutions',
      'Geographic expansion to APAC and EMEA regions',
      'Strategic partnerships driving distribution',
    ], '#0f172a', '#f1f5f9', '#cbd5e1'),
    twoColumn('Growth Strategy', 'Revenue Streams',
      ['Enterprise licensing', 'SaaS subscriptions', 'Professional services', 'Partner ecosystem'],
      'Competitive Edge',
      ['AI-powered platform', '99.99% uptime SLA', '3x faster deployment', 'Zero-downtime updates'],
      '#0f172a', '#f1f5f9', '#cbd5e1'),
    imageSplitSlide('Our Technology', 'Proprietary AI engine powering next-generation solutions. Built for scale, designed for simplicity.', IMAGES.technology, '#0f172a', '#f1f5f9', '#cbd5e1'),
    endSlide('Let\'s Build\nthe Future', 'invest@company.com', IMAGES.abstract, '#0f172a', '#f1f5f9'),
  ]
};

const professionalClean = {
  id: 'pro-clean-corporate',
  name: 'Clean Corporate',
  category: 'professional',
  description: 'Clean white design with bold blue accents and office imagery',
  thumbnail: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%)',
  slides: [
    heroSlide('Quarterly Business\nReview', 'Q4 2024 Performance Analysis', IMAGES.office, '#1e3a5f', '#f1f5f9'),
    statsSlide('Financial Highlights', [
      { value: '$6.9M', label: 'Total Revenue' },
      { value: '62%', label: 'Gross Margin' },
      { value: '$1.2M', label: 'Net Income' },
      { value: '$2.1M', label: 'Cash Flow' },
      { value: '18.4%', label: 'Op. Margin' },
      { value: '23%', label: 'Rev. Growth' },
    ], '#ffffff', '#1e3a5f', '#334155'),
    contentSlide('Executive Summary', [
      'Revenue grew 23% year-over-year to $6.9M',
      'Customer base expanded by 15,000 active users',
      'Operating margin improved to 18.4%',
      'Three new enterprise partnerships secured',
      'Market share increased in all key segments',
    ], '#f0f9ff', '#1e3a5f', '#334155'),
    twoColumn('Team & Culture', 'People',
      ['2,500+ employees worldwide', '45 nationalities represented', '40% women in leadership', '95% employee retention'],
      'Investments',
      ['Innovation Fridays program', 'Annual learning budgets', 'Flexible remote work', 'Comprehensive health plans'],
      '#ffffff', '#1e3a5f', '#334155'),
    imageSplitSlide('Looking Ahead', 'Our roadmap for the next fiscal year — expanding into AI, cloud, and sustainability.', IMAGES.meeting, '#ffffff', '#1e3a5f', '#334155'),
    endSlide('Thank You', 'Questions & Discussion', IMAGES.cityNight, '#1e3a5f', '#f1f5f9'),
  ]
};

const professionalGreen = {
  id: 'pro-trust-green',
  name: 'Trust Green',
  category: 'professional',
  description: 'Green theme for sustainability, ESG, and finance presentations',
  thumbnail: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #10b981 100%)',
  slides: [
    heroSlide('Sustainable Growth\nFund 2025', 'Investing in Tomorrow\'s Leaders', IMAGES.leaves, '#065f46', '#ecfdf5'),
    contentSlide('Investment Thesis', [
      'ESG-compliant portfolio with 40% lower carbon footprint',
      'Long-term value creation over short-term gains',
      'Diversified across sectors and geographies',
      'Active management with below-average turnover',
      'Consistent above-benchmark risk-adjusted returns',
    ], '#ecfdf5', '#065f46', '#065f46'),
    twoColumn('Portfolio Allocation', 'Asset Classes',
      ['Equities: 55%', 'Fixed Income: 25%', 'Real Estate: 12%', 'Alternatives: 8%'],
      'Top Holdings',
      ['GreenTech Corp: 8.2%', 'SolarEdge: 6.5%', 'BioGen Plus: 5.8%', 'CleanWater Inc: 5.1%'],
      '#064e3b', '#ecfdf5', '#d1fae5'),
    statsSlide('Performance Metrics', [
      { value: '14.2%', label: 'Annual Return' },
      { value: '0.82', label: 'Sharpe Ratio' },
      { value: '-8.3%', label: 'Max Drawdown' },
      { value: 'AA', label: 'ESG Rating' },
      { value: '$2.4B', label: 'AUM' },
      { value: '312', label: 'Holdings' },
    ], '#ecfdf5', '#065f46', '#065f46'),
    imageSplitSlide('Impact Report', 'Measurable positive impact on communities and environment across all portfolio companies.', IMAGES.nature, '#064e3b', '#ecfdf5', '#d1fae5'),
    endSlide('Invest With\nConfidence', 'invest@growthfund.com', IMAGES.mountains, '#065f46', '#ecfdf5'),
  ]
};

const professionalPurple = {
  id: 'pro-gradient-purple',
  name: 'Gradient Premium',
  category: 'professional',
  description: 'Purple gradient for premium brand and annual report presentations',
  thumbnail: 'linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #a78bfa 100%)',
  slides: [
    heroSlide('Annual Report\n2024', 'Excellence Across All Divisions', IMAGES.architecture, '#4c1d95', '#f5f3ff'),
    contentSlide('Performance Overview', [
      'Total revenue exceeded targets by 18%',
      'Employee satisfaction at all-time high of 4.7/5',
      'Launched 4 major product updates this year',
      'Expanded to 12 new international markets',
      'R&D investment increased by 30%',
    ], '#faf5ff', '#581c87', '#6b21a8'),
    statsSlide('Division Performance', [
      { value: '18%', label: 'Above Target' },
      { value: '4.7', label: 'Satisfaction' },
      { value: '12', label: 'New Markets' },
      { value: '4', label: 'Launches' },
      { value: '+30%', label: 'R&D Growth' },
      { value: '92%', label: 'Goal Hit' },
    ], '#ffffff', '#581c87', '#6b21a8'),
    twoColumn('Innovation & Growth', 'Technology',
      ['AI-powered analytics', 'Cloud-native architecture', 'Real-time collaboration', 'Mobile-first design'],
      'Sustainability',
      ['Carbon neutral by 2025', '100% renewable energy', 'Zero waste to landfill', 'Green supply chain'],
      '#faf5ff', '#581c87', '#6b21a8'),
    imageSplitSlide('Product Showcase', 'Our latest innovations driving industry transformation and customer delight.', IMAGES.flowers, '#581c87', '#f5f3ff', '#e9d5ff'),
    endSlide('Building\nTomorrow', 'Annual Report 2024', IMAGES.space, '#4c1d95', '#f5f3ff'),
  ]
};

// ════════════════════════════════════════════
// MODERN TEMPLATES
// ════════════════════════════════════════════

const modernNeon = {
  id: 'modern-neon-dark',
  name: 'Neon Pulse',
  category: 'modern',
  description: 'Vibrant neon on dark for tech and startup decks',
  thumbnail: 'linear-gradient(135deg, #0a0a0a 0%, #18181b 50%, #27272a 100%)',
  slides: [
    heroSlide('The Future\nof AI', 'Revolutionizing Every Industry', IMAGES.space, '#0a0a0a', '#00ff88'),
    contentSlide('AI Capabilities', [
      'Natural Language Processing at unprecedented scale',
      'Computer Vision achieving 99.7% accuracy',
      'Predictive analytics transforming business decisions',
      'Autonomous systems reducing human error by 90%',
      'Real-time translation across 100+ languages',
    ], '#0a0a0a', '#00ff88', '#a1a1aa'),
    statsSlide('Performance Benchmarks', [
      { value: '175B', label: 'Parameters' },
      { value: '3x', label: 'Faster' },
      { value: '99.2%', label: 'Uptime' },
      { value: '40%', label: 'Less Compute' },
      { value: '100+', label: 'Languages' },
      { value: '99.7%', label: 'Accuracy' },
    ], '#0a0a0a', '#00ff88', '#a1a1aa'),
    imageSplitSlide('Deep Learning\nArchitecture', 'Neural networks powering the next generation of intelligent solutions.', IMAGES.technology, '#0a0a0a', '#00ff88', '#a1a1aa'),
    twoColumn('Use Cases', 'Enterprise',
      ['Automated customer support', 'Fraud detection & prevention', 'Supply chain optimization', 'Personalized recommendations'],
      'Research',
      ['Drug discovery acceleration', 'Climate modeling', 'Genomic analysis', 'Materials science'],
      '#0a0a0a', '#00ff88', '#a1a1aa'),
    endSlide('Welcome to\nthe Future', 'AI Revolution 2025', IMAGES.gradient, '#0a0a0a', '#ff0080'),
  ]
};

const modernSunset = {
  id: 'modern-sunset',
  name: 'Sunset Vibes',
  category: 'modern',
  description: 'Warm gradient for creative and lifestyle presentations',
  thumbnail: 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)',
  slides: [
    heroSlide('Creative\nStudio', 'Design. Create. Inspire.', IMAGES.creative, '#78350f', '#fef3c2'),
    contentSlide('Our Services', [
      'Brand Identity & Strategic Positioning',
      'UI/UX Design & Interactive Prototyping',
      'Motion Graphics & Visual Storytelling',
      'Web Development & Mobile Applications',
      'Content Strategy & Digital Marketing',
    ], '#fff7ed', '#92400e', '#78350f'),
    statsSlide('Studio Awards', [
      { value: '47', label: 'Awards Won' },
      { value: '200+', label: 'Projects' },
      { value: '98%', label: 'Happy Clients' },
      { value: '12', label: 'Team Members' },
      { value: '5', label: 'Years Running' },
      { value: '3', label: 'Locations' },
    ], '#fef3c2', '#92400e', '#78350f'),
    imageSplitSlide('Portfolio Highlight', 'Selected works from our latest collection showcasing brand transformations.', IMAGES.laptop, '#92400e', '#fef3c2', '#78350f'),
    twoColumn('Our Process', 'Discovery',
      ['Research & analysis', 'Stakeholder interviews', 'Competitive audit', 'Strategy definition'],
      'Delivery',
      ['Concept development', 'Iterative design', 'User testing', 'Final handoff'],
      '#fff7ed', '#92400e', '#78350f'),
    endSlide('Let\'s Create\nTogether', 'hello@creativestudio.co', IMAGES.flowers, '#78350f', '#fef3c2'),
  ]
};

const modernGlass = {
  id: 'modern-glass',
  name: 'Glass Morph',
  category: 'modern',
  description: 'Indigo glass effect for product launches and SaaS decks',
  thumbnail: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
  slides: [
    heroSlide('Product\nLaunch 2025', 'Introducing NextWave 3.0', IMAGES.gradient, '#312e81', '#e0e7ff'),
    contentSlide('What\'s New', [
      'Completely redesigned from the ground up',
      'AI-powered smart suggestions engine',
      'Real-time collaboration for distributed teams',
      'Advanced analytics dashboard with insights',
      'Mobile-first responsive design system',
    ], '#eef2ff', '#312e81', '#3730a3'),
    statsSlide('Impact Numbers', [
      { value: '10x', label: 'Faster Workflow' },
      { value: '5M+', label: 'Users' },
      { value: '99.9%', label: 'Uptime SLA' },
      { value: '4.9', label: 'App Rating' },
      { value: '2M+', label: 'Decks Created' },
      { value: '150+', label: 'Countries' },
    ], '#ffffff', '#312e81', '#3730a3'),
    twoColumn('Features', 'Free Tier',
      ['Up to 3 projects', 'Basic templates', 'Cloud storage (1GB)', 'PNG export'],
      'Pro Tier',
      ['Unlimited projects', '500+ templates', 'Cloud storage (100GB)', 'All export formats'],
      '#eef2ff', '#312e81', '#3730a3'),
    imageSplitSlide('Screenshot\nPreview', 'See the beautiful new interface in action — designed for speed and delight.', IMAGES.startup, '#312e81', '#e0e7ff', '#c7d2fe'),
    endSlide('Try It\nFree Today', 'nextwave.app', IMAGES.ocean, '#312e81', '#fbbf24'),
  ]
};

const modernMinimal = {
  id: 'modern-clean',
  name: 'Clean Slate',
  category: 'modern',
  description: 'Ultra-clean white with bold typography for startup pitch decks',
  thumbnail: 'linear-gradient(135deg, #fafafa 0%, #f4f4f5 50%, #e4e4e7 100%)',
  slides: [
    heroSlide('Startup\nPitch Deck', 'Disrupting the Status Quo', IMAGES.startup, '#18181b', '#fafafa'),
    contentSlide('The Problem', [
      '73% of businesses struggle with data silos',
      'Average company uses 120+ disconnected SaaS tools',
      'Teams waste 30% of time context-switching',
      'No unified view of the customer journey',
      'Security risks from fragmented systems',
    ], '#ffffff', '#18181b', '#3f3f46'),
    contentSlide('Our Solution', [
      'One platform to connect everything seamlessly',
      'AI-powered data unification and insights',
      'Single source of truth for all teams',
      'Enterprise-grade security built-in from day one',
      'Full setup complete in under 10 minutes',
    ], '#fafafa', '#18181b', '#3f3f46'),
    statsSlide('Traction', [
      { value: '$2.4M', label: 'ARR' },
      { value: '500+', label: 'Customers' },
      { value: '140%', label: 'Net Retention' },
      { value: '30 days', label: 'Free Trial' },
      { value: 'YC W24', label: 'Accelerator' },
      { value: '$12M', label: 'Series A' },
    ], '#ffffff', '#18181b', '#3f3f46'),
    imageSplitSlide('Platform Demo', 'See how our platform transforms your workflow — beautiful, fast, and intuitive.', IMAGES.laptop, '#fafafa', '#18181b', '#3f3f46'),
    endSlide('Join Our\nJourney', 'invest@startup.io', IMAGES.abstract, '#18181b', '#fafafa'),
  ]
};

// ════════════════════════════════════════════
// STUDENT TEMPLATES
// ════════════════════════════════════════════

const studentScience = {
  id: 'student-science',
  name: 'Lab Report',
  category: 'student',
  description: 'Perfect for science projects and lab reports with real imagery',
  thumbnail: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
  slides: [
    heroSlide('Photosynthesis\nExperiment', 'Biology Lab Report — Fall 2024', IMAGES.lab, '#065f46', '#ecfdf5'),
    contentSlide('Hypothesis', [
      'Plants exposed to more sunlight produce more glucose',
      'Measured via iodine starch test intensity',
      'Control group maintained in consistent conditions',
      'Variable: hours of light exposure per day',
      'Duration: 4 weeks observation period',
    ], '#ffffff', '#065f46', '#065f46'),
    twoColumn('Methodology', 'Setup',
      ['20 soybean plants', '4 light conditions', '5 plants per group', '12hr / 8hr / 6hr / dark'],
      'Measurements',
      ['Leaf surface area', 'Chlorophyll content', 'Starch presence (iodine)', 'Growth rate (cm/week)'],
      '#ecfdf5', '#065f46', '#065f46'),
    imageSplitSlide('Lab Setup', 'Experimental apparatus and plant growth chambers used for controlled light exposure studies.', IMAGES.leaves, '#065f46', '#ecfdf5', '#065f46'),
    statsSlide('Results Summary', [
      { value: '84%', label: '12hr starch +' },
      { value: '12.3cm', label: '12hr growth' },
      { value: '72%', label: '8hr starch +' },
      { value: '9.8cm', label: '8hr growth' },
      { value: '45%', label: '6hr starch +' },
      { value: '6.2cm', label: '6hr growth' },
    ], '#ffffff', '#065f46', '#065f46'),
    endSlide('Conclusion', 'Light directly impacts photosynthesis rate', IMAGES.flowers, '#065f46', '#ecfdf5'),
  ]
};

const studentHistory = {
  id: 'student-history',
  name: 'History Timeline',
  category: 'student',
  description: 'Great for history and social studies with real historical imagery',
  thumbnail: 'linear-gradient(135deg, #92400e 0%, #d97706 50%, #f59e0b 100%)',
  slides: [
    heroSlide('The\nRenaissance', 'A Cultural Rebirth — World History', IMAGES.history, '#78350f', '#fef3c2'),
    contentSlide('What Was the Renaissance?', [
      'Period of cultural rebirth in Europe (14th-17th century)',
      'Beginning in Italy, spreading across Europe',
      'Shift from medieval to modern thinking',
      'Fueled by trade, wealth, and classical texts',
      'Lasting impact on art, science, and philosophy',
    ], '#ffffff', '#78350f', '#713f12'),
    twoColumn('Key Figures', 'Artists',
      ['Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Sandro Botticelli'],
      'Thinkers',
      ['Galileo Galilei', 'Nicolaus Copernicus', 'Niccolo Machiavelli', 'Desiderius Erasmus'],
      '#fef3c2', '#78350f', '#713f12'),
    imageSplitSlide('Art & Architecture', 'Michelangelo\'s masterpieces and the grandeur of Renaissance architecture.', IMAGES.architecture, '#78350f', '#fef3c2', '#713f12'),
    contentSlide('Major Achievements', [
      'Mona Lisa and The Last Supper by da Vinci',
      'Sistine Chapel ceiling by Michelangelo',
      'Heliocentric model of the solar system',
      'Gutenberg printing press revolution',
      'Development of linear perspective in art',
    ], '#ffffff', '#78350f', '#713f12'),
    endSlide('The Renaissance\nLegacy', 'Still shaping our world today', IMAGES.abstract, '#78350f', '#fef3c2'),
  ]
};

const studentMath = {
  id: 'student-math',
  name: 'Math & Logic',
  category: 'student',
  description: 'Clean template for math, statistics, and analytical presentations',
  thumbnail: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #60a5fa 100%)',
  slides: [
    heroSlide('Calculus\nApplications', 'Real-World Uses of Derivatives', IMAGES.math, '#1e3a5f', '#eff6ff'),
    contentSlide('Why Derivatives Matter', [
      'Rate of change in physics (velocity, acceleration)',
      'Optimization in economics (max profit, min cost)',
      'Growth models in biology and medicine',
      'Engineering design and structural analysis',
      'Machine learning gradient descent algorithms',
    ], '#ffffff', '#1e3a5f', '#1e40af'),
    contentSlide('Projectile Motion Example', [
      'Position: s(t) = -4.9t\u00B2 + v\u2080t + s\u2080',
      'Velocity: v(t) = ds/dt = -9.8t + v\u2080',
      'Acceleration: a(t) = dv/dt = -9.8 m/s\u00B2',
      'Maximum height when v(t) = 0',
      'Total flight time: t = 2v\u2080 / 9.8',
    ], '#eff6ff', '#1e3a5f', '#1e40af'),
    twoColumn('Applications', 'Physics',
      ['Orbital mechanics', 'Wave analysis', 'Thermodynamics', 'Electromagnetism'],
      'Economics',
      ['Marginal cost/revenue', 'Elasticity of demand', 'Consumer surplus', 'Optimal pricing models'],
      '#ffffff', '#1e3a5f', '#1e40af'),
    imageSplitSlide('Graph\nVisualization', 'Derivative relationships visualized on coordinate plane for intuitive understanding.', IMAGES.space, '#1e3a5f', '#eff6ff', '#1e40af'),
    endSlide('Math Is\nEverywhere', 'Keep exploring, keep solving', IMAGES.ocean, '#1e3a5f', '#eff6ff'),
  ]
};

const studentLiterature = {
  id: 'student-literature',
  name: 'Book Report',
  category: 'student',
  description: 'Literary themed template for book reports and literary analysis',
  thumbnail: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #f97316 100%)',
  slides: [
    heroSlide('To Kill a\nMockingbird', 'Literary Analysis — English 101', IMAGES.books, '#7c2d12', '#fff7ed'),
    contentSlide('Novel Overview', [
      'Author: Harper Lee, published in 1960',
      'Setting: Maycomb, Alabama during the 1930s',
      'Narrator: Scout Finch, a young girl',
      'Core themes: Racial injustice, moral growth',
      'Pulitzer Prize winner and enduring classic',
    ], '#ffffff', '#7c2d12', '#78350f'),
    twoColumn('Characters', 'Main Characters',
      ['Scout Finch — narrator', 'Atticus Finch — father, lawyer', 'Jem Finch — Scout\'s brother', 'Boo Radley — mysterious neighbor'],
      'Symbolic Figures',
      ['Tom Robinson — injustice', 'Bob Ewell — prejudice', 'Miss Maudie — wisdom', 'Calpurnia — bridge between worlds'],
      '#fff7ed', '#7c2d12', '#78350f'),
    imageSplitSlide('The American\nSouth', 'The rich cultural backdrop that defines this literary masterpiece.', IMAGES.nature, '#7c2d12', '#fff7ed', '#78350f'),
    contentSlide('Key Themes', [
      'Racial inequality in the American South',
      'Loss of innocence through lived experience',
      'Moral courage and standing up for what is right',
      'Empathy — "walking in someone\'s shoes"',
      'The coexistence of good and evil in humanity',
    ], '#ffffff', '#7c2d12', '#78350f'),
    endSlide('Personal Reflection', '"You never really understand a person until you see things from his point of view"', IMAGES.mountains, '#7c2d12', '#fff7ed'),
  ]
};

// ════════════════════════════════════════════
// CS (COMPUTER SCIENCE) TEMPLATES — 10 SLIDES EACH
// ════════════════════════════════════════════

// Shared color tokens
const csCloudBg = '#0c1929';
const csCloudAccent = '#38bdf8';
const csCloudText = '#cbd5e1';

const csMLBg = '#1e1b4b';
const csMLAccent = '#a5b4fc';
const csMLText = '#c7d2fe';

const csNetBg = '#0a1628';
const csNetAccent = '#22d3ee';
const csNetText = '#cbd5e1';

const csSEBg = '#18181b';
const csSEAccent = '#e4e4e7';
const csSEText = '#a1a1aa';

const csCloud = {
  id: 'cs-cloud-computing',
  name: 'Cloud Computing',
  category: 'cs',
  description: 'Professional cloud architecture and infrastructure presentation',
  thumbnail: 'linear-gradient(135deg, #0c1929 0%, #162544 50%, #1e3a5f 100%)',
  slides: [
    // Slide 1 — Title
    csTitleSlide('Cloud Computing', 'Infrastructure, Services & Modern Applications', IMAGES.cloud, csCloudBg, csCloudAccent, csCloudText, [
      'Presented By:',
      '[Your Name]',
      'Student Code: [Student Code]',
      'Course: [Course Name]',
      'College: [College Name]',
    ]),
    // Slide 2 — What Is Cloud Computing?
    csContentImageSlide('What is Cloud Computing?', [
      'Computing resources delivered over the internet',
      'Servers, storage, databases, software & processing power',
      'Users access resources without owning physical infrastructure',
      '',
      'Why Do We Need It?',
      'Lower upfront infrastructure requirements',
      'Access from different locations',
      'Easier storage and sharing',
      'Resources can scale with demand',
    ], IMAGES.cloudServices, csCloudBg, csCloudAccent, csCloudText),
    // Slide 3 — How Does Cloud Computing Work?
    csProcessFlowSlide('How Does Cloud Computing Work?', [
      { label: 'User\nDevice', desc: 'Access cloud services via browser or app' },
      { label: 'Internet', desc: 'Data transmitted securely over the network' },
      { label: 'Cloud\nInfrastructure', desc: 'Data centers with servers and storage' },
      { label: 'Cloud\nService', desc: 'Processing, storage, or application delivered' },
      { label: 'Response', desc: 'Results sent back to the user device' },
    ], csCloudBg, csCloudAccent, csCloudText),
    // Slide 4 — Key Characteristics
    csCardsSlide('Key Characteristics', [
      { title: 'On-Demand Access', desc: 'Resources available instantly when needed, without human intervention from the service provider.' },
      { title: 'Scalability', desc: 'Scale resources up or down automatically based on workload demands and traffic patterns.' },
      { title: 'Resource Sharing', desc: 'Multiple users share the same physical infrastructure through virtualization technology.' },
      { title: 'Pay-as-you-use', desc: 'Only pay for the resources you actually consume, reducing waste and overhead costs.' },
      { title: 'Broad Network Access', desc: 'Access services from any device with an internet connection, anywhere in the world.' },
      { title: 'High Availability', desc: 'Built-in redundancy and failover mechanisms ensure continuous service delivery.' },
    ], csCloudBg, csCloudAccent, csCloudText),
    // Slide 5 — Types of Cloud & Service Models
    csComparisonSlide('Cloud Types & Service Models', 'Deployment Models', [
      'Public Cloud — shared infrastructure, pay-per-use',
      'Private Cloud — dedicated to a single organization',
      'Hybrid Cloud — combination of public and private',
      'Multi-Cloud — using multiple cloud providers',
    ], 'Service Models', [
      'IaaS — virtual machines, storage, networking',
      'PaaS — development platforms and tools',
      'SaaS — ready-to-use applications',
      'FaaS — serverless function execution',
    ], csCloudBg, csCloudAccent, csCloudText),
    // Slide 6 — Providers & Applications
    csContentImageSlide('Providers & Real-World Applications', [
      'Major Cloud Providers:',
      'AWS — Amazon Web Services',
      'Microsoft Azure',
      'Google Cloud Platform',
      '',
      'Applications:',
      'Cloud Storage (Google Drive, Dropbox)',
      'Video Streaming (Netflix, YouTube)',
      'Online Gaming (Xbox Cloud, GeForce)',
      'AI & Machine Learning services',
    ], IMAGES.cloudDatacenter, csCloudBg, csCloudAccent, csCloudText),
    // Slide 7 — Advantages
    csCardsSlide('Advantages', [
      { title: 'Cost Efficiency', desc: 'Eliminates upfront capital expenditure. Pay only for what you use with operational expense models.' },
      { title: 'Scalability', desc: 'Instantly scale resources to match demand. Handle traffic spikes without provisioning hardware.' },
      { title: 'Accessibility', desc: 'Access your data and applications from anywhere with an internet connection.' },
      { title: 'Fast Deployment', desc: 'Deploy applications in minutes, not weeks. Rapid prototyping and iteration.' },
      { title: 'Backup & Recovery', desc: 'Automated backups and disaster recovery across multiple geographic regions.' },
      { title: 'Reduced Maintenance', desc: 'Cloud provider manages hardware, networking, and physical security.' },
    ], csCloudBg, csCloudAccent, csCloudText),
    // Slide 8 — Challenges
    csCardsSlide('Challenges & Disadvantages', [
      { title: 'Security & Privacy', desc: 'Shared responsibility model requires careful configuration and compliance management.' },
      { title: 'Internet Dependency', desc: 'Requires stable internet connectivity. Downtime affects access to all services.' },
      { title: 'Unexpected Costs', desc: 'Pay-per-use can lead to unexpectedly high bills without proper monitoring and budgets.' },
      { title: 'Service Downtime', desc: 'Even major providers experience outages. Plan for redundancy across providers.' },
      { title: 'Vendor Lock-in', desc: 'Migrating between providers can be complex and costly due to proprietary services.' },
      { title: 'Limited Control', desc: 'Less direct control over underlying infrastructure and hardware specifications.' },
    ], csCloudBg, csCloudAccent, csCloudText),
    // Slide 9 — Conclusion
    csConclusionSlide('Conclusion', [
      'Cloud computing delivers computing resources over a network',
      'Provides flexibility, scalability and accessibility',
      'Supports applications such as storage, streaming, gaming and AI',
      'Security, cost and reliability must be managed carefully',
    ], 'Cloud computing enables organizations and individuals to access scalable computing resources without owning all of the underlying infrastructure.', csCloudBg, csCloudAccent, csCloudText),
    // Slide 10 — Thank You
    csThankYouSlide(csCloudBg, csCloudAccent, csCloudText, 'Cloud Computing Presentation'),
  ]
};

const csML = {
  id: 'cs-machine-learning',
  name: 'Machine Learning',
  category: 'cs',
  description: 'AI and machine learning research presentation template',
  thumbnail: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
  slides: [
    // Slide 1 — Title
    csTitleSlide('Machine Learning', 'Learning Patterns from Data', IMAGES.mlNeural, csMLBg, csMLAccent, csMLText, [
      'Presented By:',
      '[Your Name]',
      'Student Code: [Student Code]',
      'Course: [Course Name]',
      'College: [College Name]',
    ]),
    // Slide 2 — Introduction
    csContentImageSlide('What is Machine Learning?', [
      'Machine learning enables systems to learn patterns from data',
      'Models use data to make predictions or decisions',
      'A major area of artificial intelligence',
      '',
      'Why is it important?',
      'Automation of repetitive tasks',
      'Predictive analytics for decision making',
      'Pattern recognition in large datasets',
      'Data-driven decision making',
    ], IMAGES.ai, csMLBg, csMLAccent, csMLText),
    // Slide 3 — How ML Works
    csProcessFlowSlide('How Does Machine Learning Work?', [
      { label: 'Data\nCollection', desc: 'Gather relevant data from various sources' },
      { label: 'Preprocessing', desc: 'Clean, normalize and prepare the data' },
      { label: 'Feature\nEngineering', desc: 'Select and transform relevant features' },
      { label: 'Model\nTraining', desc: 'Algorithm learns patterns from training data' },
      { label: 'Evaluation', desc: 'Test model performance on unseen data' },
    ], csMLBg, csMLAccent, csMLText),
    // Slide 4 — Types of ML
    csComparisonSlide('Types of Machine Learning', 'Supervised Learning', [
      'Uses labeled training data',
      'Classification — spam, fraud, diagnosis',
      'Regression — pricing, forecasting',
      'Examples: SVM, Random Forest, Neural Net',
    ], 'Unsupervised Learning', [
      'No labeled data required',
      'Clustering — customer segmentation',
      'Dimensionality reduction — PCA, t-SNE',
      'Examples: K-Means, DBSCAN, Autoencoders',
    ], csMLBg, csMLAccent, csMLText),
    // Slide 5 — Common Algorithms
    csCardsSlide('Common ML Algorithms', [
      { title: 'Linear Regression', desc: 'Predicts continuous values by fitting a linear relationship between input features and output.' },
      { title: 'Decision Tree', desc: 'Tree-like model of decisions. Easy to interpret and visualize the decision-making process.' },
      { title: 'K-Nearest Neighbors', desc: 'Classifies data points based on the majority class of their nearest neighbors in feature space.' },
      { title: 'Support Vector Machine', desc: 'Finds optimal hyperplane to separate classes. Effective in high-dimensional spaces.' },
      { title: 'Neural Networks', desc: 'Inspired by biological neurons. Layers of interconnected nodes that learn complex patterns.' },
      { title: 'Random Forest', desc: 'Ensemble of decision trees. Reduces overfitting through bootstrap aggregation.' },
    ], csMLBg, csMLAccent, csMLText),
    // Slide 6 — Model Training & Evaluation
    csComparisonSlide('Model Training & Evaluation', 'Data Split', [
      'Training Data — model learns from this (70%)',
      'Validation Data — tune hyperparameters (15%)',
      'Testing Data — final performance check (15%)',
      'Cross-validation for robust estimation',
    ], 'Evaluation Metrics', [
      'Accuracy — overall correctness of predictions',
      'Precision — true positives / predicted positives',
      'Recall — true positives / actual positives',
      'F1 Score — harmonic mean of precision and recall',
    ], csMLBg, csMLAccent, csMLText),
    // Slide 7 — Advantages
    csCardsSlide('Advantages', [
      { title: 'Automation', desc: 'Automates complex decision-making processes that would take humans hours or days.' },
      { title: 'Pattern Recognition', desc: 'Identifies hidden patterns in massive datasets that humans cannot detect manually.' },
      { title: 'Prediction', desc: 'Forecasts future trends, behaviors, and outcomes based on historical data patterns.' },
      { title: 'Scalability', desc: 'Handles millions of data points and can scale to meet growing data demands.' },
      { title: 'Adaptability', desc: 'Models can be retrained and updated as new data becomes available.' },
      { title: 'Data-Driven', desc: 'Eliminates guesswork by basing decisions on statistical evidence and data patterns.' },
    ], csMLBg, csMLAccent, csMLText),
    // Slide 8 — Limitations
    csCardsSlide('Challenges & Limitations', [
      { title: 'Data Quality', desc: 'Models are only as good as their training data. Garbage in, garbage out principle applies.' },
      { title: 'Overfitting', desc: 'Model learns noise instead of patterns. Performs well on training data but poorly on new data.' },
      { title: 'Bias', desc: 'Biased training data leads to biased predictions. Fairness requires careful data curation.' },
      { title: 'Computational Cost', desc: 'Training large models requires significant GPU/TPU resources and energy consumption.' },
      { title: 'Interpretability', desc: 'Complex models like deep neural networks are difficult to explain and interpret.' },
      { title: 'Privacy', desc: 'Training on personal data raises privacy concerns and regulatory compliance challenges.' },
    ], csMLBg, csMLAccent, csMLText),
    // Slide 9 — Applications & Conclusion
    csContentImageSlide('Applications & Conclusion', [
      'Real-World Applications:',
      'Computer Vision — image recognition, autonomous driving',
      'NLP — chatbots, translation, sentiment analysis',
      'Recommendation Systems — Netflix, Spotify, Amazon',
      'Fraud Detection — banking, insurance, e-commerce',
      '',
      'Machine learning transforms industries by enabling',
      'data-driven automation and intelligent decision making.',
    ], IMAGES.data, csMLBg, csMLAccent, csMLText),
    // Slide 10 — Thank You
    csThankYouSlide(csMLBg, csMLAccent, csMLText, 'Machine Learning Presentation'),
  ]
};

const csNetworking = {
  id: 'cs-networking',
  name: 'Computer Networking',
  category: 'cs',
  description: 'Professional networking infrastructure and protocols presentation',
  thumbnail: 'linear-gradient(135deg, #0a1628 0%, #0c2d48 50%, #0e4d6e 100%)',
  slides: [
    // Slide 1 — Title
    csTitleSlide('Computer Networking', 'Connecting Devices, Systems & Data', IMAGES.netTopology, csNetBg, csNetAccent, csNetText, [
      'Presented By:',
      '[Your Name]',
      'Student Code: [Student Code]',
      'Course: [Course Name]',
      'College: [College Name]',
    ]),
    // Slide 2 — Introduction
    csContentImageSlide('Introduction to Computer Networking', [
      'Definition:',
      'A computer network connects devices so they can communicate and share resources',
      '',
      'Key Purposes:',
      'Communication — email, messaging, video calls',
      'Resource Sharing — printers, files, processing power',
      'Data Transfer — move information between devices',
      'Internet Access — connect to global information resources',
    ], IMAGES.netInfra, csNetBg, csNetAccent, csNetText),
    // Slide 3 — How Networking Works
    csProcessFlowSlide('How Does Computer Networking Work?', [
      { label: 'Device', desc: 'Source device initiates communication' },
      { label: 'Switch', desc: 'Directs data to the correct local network path' },
      { label: 'Router', desc: 'Routes data between different networks' },
      { label: 'Internet', desc: 'Global network of interconnected routers' },
      { label: 'Server', desc: 'Destination server processes the request' },
    ], csNetBg, csNetAccent, csNetText),
    // Slide 4 — Types of Networks
    csCardsSlide('Types of Networks', [
      { title: 'LAN', desc: 'Local Area Network — connects devices within a limited area like a building or campus.' },
      { title: 'MAN', desc: 'Metropolitan Area Network — spans a city or large campus with high-speed connections.' },
      { title: 'WAN', desc: 'Wide Area Network — covers large geographical areas, connecting multiple LANs.' },
      { title: 'PAN', desc: 'Personal Area Network — short-range network connecting personal devices via Bluetooth.' },
      { title: 'WLAN', desc: 'Wireless LAN — uses Wi-Fi technology for wireless device connectivity in a local area.' },
      { title: 'VPN', desc: 'Virtual Private Network — encrypted tunnel over public networks for secure remote access.' },
    ], csNetBg, csNetAccent, csNetText),
    // Slide 5 — Network Devices
    csCardsSlide('Network Devices', [
      { title: 'Router', desc: 'Routes data packets between different networks. Determines the best path for data transmission.' },
      { title: 'Switch', desc: 'Connects devices within a LAN. Uses MAC addresses to forward data to the correct port.' },
      { title: 'Hub', desc: 'Broadcasts data to all connected devices. Less efficient than switches but simpler to use.' },
      { title: 'Access Point', desc: 'Provides wireless connectivity. Extends network coverage using Wi-Fi technology.' },
      { title: 'Modem', desc: 'Modulates and demodulates signals. Connects home networks to the internet service provider.' },
      { title: 'Firewall', desc: 'Monitors and filters network traffic. Protects networks from unauthorized access and threats.' },
    ], csNetBg, csNetAccent, csNetText),
    // Slide 6 — OSI Model (all 7 layers)
    csCardsSlide('OSI Model — 7 Layers', [
      { title: '7. Application', desc: 'HTTP, FTP, SMTP, DNS. User-facing network services and protocols.' },
      { title: '6. Presentation', desc: 'Data encryption, compression, format translation for the application layer.' },
      { title: '5. Session', desc: 'Manages sessions, connections, and dialog control between applications.' },
      { title: '4. Transport', desc: 'TCP/UDP. Reliable or fast data delivery with error checking and flow control.' },
      { title: '3. Network', desc: 'IP addressing and routing. Determines the best path across interconnected networks.' },
      { title: '2. Data Link', desc: 'Frame formatting and MAC addressing. Error-free transfer between adjacent network nodes.' },
    ], csNetBg, csNetAccent, csNetText),
    // Slide 7 — Protocols
    csCardsSlide('Network Protocols', [
      { title: 'HTTP / HTTPS', desc: 'Hypertext Transfer Protocol. HTTPS adds SSL/TLS encryption for secure web communication.' },
      { title: 'TCP / UDP', desc: 'TCP provides reliable, ordered delivery. UDP offers faster, connectionless communication.' },
      { title: 'IP', desc: 'Internet Protocol. Provides unique addressing (IPv4/IPv6) for devices across networks.' },
      { title: 'DNS', desc: 'Domain Name System. Translates human-readable domain names to IP addresses.' },
      { title: 'DHCP', desc: 'Dynamic Host Configuration Protocol. Automatically assigns IP addresses to network devices.' },
      { title: 'FTP', desc: 'File Transfer Protocol. Standard protocol for transferring files between client and server.' },
    ], csNetBg, csNetAccent, csNetText),
    // Slide 8 — Advantages & Challenges
    csComparisonSlide('Advantages & Challenges', 'Advantages', [
      'Fast and reliable communication',
      'Resource sharing across devices',
      'Scalable network infrastructure',
      'Centralized management and administration',
      'Cost-effective resource utilization',
    ], 'Challenges', [
      'Security threats and vulnerabilities',
      'Network congestion during peak usage',
      'Latency affecting real-time applications',
      'Single point of failure risks',
      'Maintenance and upgrade complexity',
    ], csNetBg, csNetAccent, csNetText),
    // Slide 9 — Applications & Conclusion
    csContentImageSlide('Applications & Conclusion', [
      'Real-World Applications:',
      'Internet — global information access',
      'Cloud Computing — remote resource delivery',
      'Video Conferencing — real-time communication',
      'Online Gaming — low-latency multiplayer',
      'IoT — connected smart devices and sensors',
      '',
      'Networking is the backbone of modern digital',
      'infrastructure connecting billions of devices.',
    ], IMAGES.netProtocol, csNetBg, csNetAccent, csNetText),
    // Slide 10 — Thank You
    csThankYouSlide(csNetBg, csNetAccent, csNetText, 'Computer Networking Presentation'),
  ]
};

const csSoftwareEng = {
  id: 'cs-software-engineering',
  name: 'Software Engineering',
  category: 'cs',
  description: 'Software development lifecycle and architecture presentation',
  thumbnail: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%)',
  slides: [
    // Slide 1 — Title
    csTitleSlide('Software Engineering', 'Designing Reliable Software Systems', IMAGES.coding, csSEBg, csSEAccent, csSEText, [
      'Presented By:',
      '[Your Name]',
      'Student Code: [Student Code]',
      'Course: [Course Name]',
      'College: [College Name]',
    ]),
    // Slide 2 — What is SE?
    csContentImageSlide('What is Software Engineering?', [
      'The systematic approach to designing, developing,',
      'testing and maintaining software systems',
      '',
      'Why is it needed?',
      'Quality — deliver reliable, bug-free software',
      'Reliability — ensure consistent performance',
      'Maintainability — easy to update and modify',
      'Scalability — handle growing user demands',
      'Team Collaboration — coordinate large development teams',
    ], IMAGES.seDevops, csSEBg, csSEAccent, csSEText),
    // Slide 3 — SDLC (all phases)
    csCardsSlide('Software Development Life Cycle', [
      { title: 'Requirements', desc: 'Define what the system must do. Gather stakeholder needs and document specifications.' },
      { title: 'Planning', desc: 'Estimate timeline, resources, and project scope. Create development roadmap.' },
      { title: 'Design', desc: 'Architecture, UI/UX, database schemas and API contracts.' },
      { title: 'Development', desc: 'Write clean, maintainable, well-documented code following best practices.' },
      { title: 'Testing', desc: 'Unit, integration, system and acceptance testing. Ensure quality and reliability.' },
      { title: 'Deployment', desc: 'CI/CD pipelines, containerization, cloud hosting and ongoing maintenance.' },
    ], csSEBg, csSEAccent, csSEText),
    // Slide 4 — Development Models
    csComparisonSlide('Software Development Models', 'Waterfall', [
      'Sequential, linear approach',
      'Each phase completed before next',
      'Well-documented requirements upfront',
      'Best for small, well-defined projects',
    ], 'Agile', [
      'Iterative, incremental approach',
      'Sprints with working software each cycle',
      'Adapts to changing requirements',
      'Best for dynamic, evolving projects',
    ], csSEBg, csSEAccent, csSEText),
    // Slide 5 — Architecture
    csContentImageSlide('Software Architecture', [
      'User / Client',
      '     ↓',
      'Frontend — React, Vue, Angular',
      '     ↓',
      'API / Backend — Node.js, Python, Java',
      '     ↓',
      'Database — SQL, NoSQL, MongoDB',
      '',
      'Supporting services:',
      'Authentication, caching, message queues, monitoring',
    ], IMAGES.seArchitecture, csSEBg, csSEAccent, csSEText),
    // Slide 6 — Testing
    csCardsSlide('Software Testing', [
      { title: 'Unit Testing', desc: 'Test individual functions and components in isolation. Fast, focused, automated.' },
      { title: 'Integration Testing', desc: 'Test how multiple components work together. Verifies interfaces and data flow.' },
      { title: 'System Testing', desc: 'Test the complete application end-to-end. Validates against all requirements.' },
      { title: 'Acceptance Testing', desc: 'Validates the software meets business requirements. Often performed by stakeholders.' },
      { title: 'Regression Testing', desc: 'Ensures new changes don\'t break existing functionality. Critical for continuous delivery.' },
      { title: 'Performance Testing', desc: 'Evaluates speed, scalability, and stability under various load conditions.' },
    ], csSEBg, csSEAccent, csSEText),
    // Slide 7 — Principles
    csCardsSlide('SE Principles', [
      { title: 'Modularity', desc: 'Break software into smaller, independent modules that can be developed and tested separately.' },
      { title: 'Abstraction', desc: 'Hide complex implementation details behind simple interfaces for easier use and maintenance.' },
      { title: 'Encapsulation', desc: 'Bundle data and methods together, controlling access through defined interfaces.' },
      { title: 'Reusability', desc: 'Design components to be reusable across different parts of the system or different projects.' },
      { title: 'Maintainability', desc: 'Write code that is easy to understand, modify, and extend over time.' },
      { title: 'Scalability', desc: 'Design systems that can handle increased load by adding resources without rewriting code.' },
    ], csSEBg, csSEAccent, csSEText),
    // Slide 8 — Advantages & Challenges
    csComparisonSlide('Advantages & Challenges', 'Advantages', [
      'Better software quality and reliability',
      'Easier long-term maintenance',
      'Effective team collaboration',
      'Predictable development process',
      'Scalable and extensible systems',
    ], 'Challenges', [
      'Increasing system complexity',
      'Tight project deadlines and budgets',
      'Evolving technology requirements',
      'Managing technical debt',
      'Balancing speed vs. quality',
    ], csSEBg, csSEAccent, csSEText),
    // Slide 9 — Applications & Conclusion
    csContentImageSlide('Applications & Conclusion', [
      'Applications:',
      'Web Applications — e-commerce, social media',
      'Mobile Applications — iOS, Android apps',
      'Cloud Systems — SaaS, PaaS platforms',
      'Enterprise Software — ERP, CRM, HRM',
      '',
      'Software engineering provides the framework',
      'for building reliable, scalable and maintainable',
      'software systems that power modern technology.',
    ], IMAGES.code, csSEBg, csSEAccent, csSEText),
    // Slide 10 — Thank You
    csThankYouSlide(csSEBg, csSEAccent, csSEText, 'Software Engineering Presentation'),
  ]
};

const allTemplates = [
  professionalDark, professionalClean, professionalGreen, professionalPurple,
  modernNeon, modernSunset, modernGlass, modernMinimal,
  studentScience, studentHistory, studentMath, studentLiterature,
  csCloud, csML, csNetworking, csSoftwareEng,
];

export const getTemplatesByCategory = (category) =>
  allTemplates.filter(t => t.category === category);

export const getTemplateById = (id) =>
  allTemplates.find(t => t.id === id);

export const createSlidesFromTemplate = (templateId) => {
  const template = getTemplateById(templateId);
  if (!template) return [];
  return template.slides.map(slide => ({
    ...slide,
    id: makeId(),
    elements: slide.elements.map(el => ({ ...el, id: makeId() }))
  }));
};

// Get the slide layout types used in a template (for new slide creation)
export const getTemplateLayouts = (templateId) => {
  const template = getTemplateById(templateId);
  if (!template) return [];
  return template.slides.map(s => s.layout);
};

// Create a new slide that matches the template's style
export const createNewSlideForTemplate = (templateId) => {
  const template = getTemplateById(templateId);
  if (!template) {
    return { id: makeId(), elements: [], background: { type: 'solid', color: '#ffffff' }, layout: 'blank' };
  }
  // Return a content-style slide matching the template's color scheme
  const firstContentSlide = template.slides.find(s => s.layout === 'content' || s.layout === 'cs-content-image');
  if (firstContentSlide) {
    return {
      ...JSON.parse(JSON.stringify(firstContentSlide)),
      id: makeId(),
      elements: firstContentSlide.elements.map(el => ({
        ...el,
        id: makeId(),
        content: { ...el.content, text: el.content.text === firstContentSlide.elements.find(e => e.type === 'text')?.content.text ? 'New Section Title' : el.content.text }
      }))
    };
  }
  // Fallback: clone first slide but strip hero images
  const slide = JSON.parse(JSON.stringify(template.slides[0]));
  slide.id = makeId();
  slide.elements = slide.elements
    .filter(el => el.type !== 'image' && el.type !== 'image-placeholder')
    .map(el => ({ ...el, id: makeId() }));
  slide.background = template.slides[1]?.background || slide.background;
  return slide;
};

export default allTemplates;
