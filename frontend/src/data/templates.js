import { v4 as uuidv4 } from 'uuid';

const makeId = () => uuidv4();

// Free stock images from Pexels (direct URLs, no API needed)
const IMAGES = {
  // Professional
  cityNight: 'https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg?auto=compress&cs=tinysrgb&w=800',
  office: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
  meeting: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
  finance: 'https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg?auto=compress&cs=tinysrgb&w=800',
  nature: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=800',
  abstract: 'https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg?auto=compress&cs=tinysrgb&w=800',
  technology: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=800',
  // Modern
  gradient: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=800',
  creative: 'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&cs=tinysrgb&w=800',
  laptop: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800',
  startup: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800',
  // Student
  lab: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800',
  books: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=800',
  math: 'https://images.pexels.com/photos/6238050/pexels-photo-6238050.jpeg?auto=compress&cs=tinysrgb&w=800',
  history: 'https://images.pexels.com/photos/544966/pexels-photo-544966.jpeg?auto=compress&cs=tinysrgb&w=800',
  leaves: 'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=800',
  flowers: 'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=800',
  space: 'https://images.pexels.com/photos/956999/milky-way-starry-sky-night-sky-star-956999.jpeg?auto=compress&cs=tinysrgb&w=800',
  mountains: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800',
  ocean: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=800',
  architecture: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800',
};

// ── Slide layout builders ──

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

const allTemplates = [
  professionalDark, professionalClean, professionalGreen, professionalPurple,
  modernNeon, modernSunset, modernGlass, modernMinimal,
  studentScience, studentHistory, studentMath, studentLiterature,
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
  const firstContentSlide = template.slides.find(s => s.layout === 'content');
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
