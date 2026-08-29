import { v4 as uuidv4 } from 'uuid';

const THEMES = {
  professional: {
    name: 'Executive Blue',
    bgColor: '#ffffff',
    cardBg: 'rgba(59, 130, 246, 0.05)',
    primaryColor: '#1e3a8a',
    accentColor: '#2563eb',
    textColor: '#1e293b',
    textMuted: '#64748b',
    fontFamily: 'Poppins'
  },
  modern: {
    name: 'Modern Violet',
    bgColor: '#ffffff',
    cardBg: 'rgba(124, 58, 237, 0.05)',
    primaryColor: '#6d28d9',
    accentColor: '#7c3aed',
    textColor: '#0f172a',
    textMuted: '#64748b',
    fontFamily: 'Space Grotesk'
  },
  student: {
    name: 'Academic Emerald',
    bgColor: '#ffffff',
    cardBg: 'rgba(16, 185, 129, 0.05)',
    primaryColor: '#065f46',
    accentColor: '#059669',
    textColor: '#1e293b',
    textMuted: '#64748b',
    fontFamily: 'Inter'
  },
  cs: {
    name: 'Cyber Dark',
    bgColor: '#09090b',
    cardBg: 'rgba(255, 255, 255, 0.05)',
    primaryColor: '#a78bfa',
    accentColor: '#38bdf8',
    textColor: '#f8fafc',
    textMuted: '#94a3b8',
    fontFamily: 'Space Grotesk'
  }
};

/**
 * Generate Structured Slides from User Topic & Context
 */
export function generatePresentationFromContext({ topic, context, templateCategory = 'modern', slideCount = 5 }) {
  const theme = THEMES[templateCategory] || THEMES.modern;
  const cleanTopic = topic?.trim() || 'Project Overview & Strategy';
  const cleanContext = context?.trim() || 'Comprehensive strategic analysis, core architectural pillars, performance metrics, and implementation timeline.';

  // Extract key sentences or concepts from context
  const contextSentences = cleanContext.split(/[.\n]+/).map(s => s.trim()).filter(s => s.length > 5);
  const getContextSnippet = (idx, fallback) => contextSentences[idx] || fallback;

  const slides = [];

  // Slide 1: Title Slide (Hero)
  slides.push({
    id: uuidv4(),
    layout: 'title',
    background: { type: 'solid', color: theme.bgColor },
    elements: [
      {
        id: uuidv4(),
        type: 'shape',
        x: 60, y: 120, width: 8, height: 160,
        content: { shapeType: 'rect', color: theme.accentColor, borderRadius: 4 },
        style: { opacity: 1 }
      },
      {
        id: uuidv4(),
        type: 'text',
        x: 90, y: 120, width: 800, height: 110,
        content: { text: cleanTopic, fontSize: 44, fontWeight: '800', fontFamily: theme.fontFamily, color: theme.primaryColor, lineHeight: 1.15 },
        style: { textAlign: 'left' }
      },
      {
        id: uuidv4(),
        type: 'shape',
        x: 90, y: 245, width: 100, height: 4,
        content: { shapeType: 'rect', color: theme.accentColor, borderRadius: 2 },
        style: { opacity: 1 }
      },
      {
        id: uuidv4(),
        type: 'text',
        x: 90, y: 270, width: 800, height: 80,
        content: { text: getContextSnippet(0, 'Strategic roadmap, core value architecture, and actionable execution milestones.'), fontSize: 19, fontWeight: '400', fontFamily: 'Inter', color: theme.textMuted, lineHeight: 1.5 },
        style: { textAlign: 'left' }
      }
    ]
  });

  // Slide 2: Problem & Market Context (Two Columns)
  if (slideCount >= 2) {
    slides.push({
      id: uuidv4(),
      layout: 'two-column',
      background: { type: 'solid', color: theme.bgColor },
      elements: [
        {
          id: uuidv4(),
          type: 'text',
          x: 50, y: 35, width: 860, height: 50,
          content: { text: 'Key Challenges & Strategic Opportunity', fontSize: 30, fontWeight: '700', fontFamily: theme.fontFamily, color: theme.primaryColor },
          style: { textAlign: 'left' }
        },
        {
          id: uuidv4(),
          type: 'shape',
          x: 50, y: 90, width: 60, height: 3,
          content: { shapeType: 'rect', color: theme.accentColor, borderRadius: 2 },
          style: {}
        },
        {
          id: uuidv4(),
          type: 'shape',
          x: 50, y: 115, width: 410, height: 385,
          content: { shapeType: 'rect', color: theme.cardBg, borderRadius: 16 },
          style: {}
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 75, y: 135, width: 360, height: 40,
          content: { text: 'Current Status & Bottlenecks', fontSize: 18, fontWeight: '700', fontFamily: theme.fontFamily, color: theme.accentColor },
          style: { textAlign: 'left' }
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 75, y: 180, width: 360, height: 300,
          content: {
            text: `• ${getContextSnippet(1, 'Legacy fragmentation and siloed operational flows')}\n• High latency in decision-making pipelines\n• Escalating overhead across manual verifications\n• Need for modern scalable foundation`,
            fontSize: 15, fontWeight: '400', fontFamily: 'Inter', color: theme.textColor, lineHeight: 1.7
          },
          style: { textAlign: 'left' }
        },
        {
          id: uuidv4(),
          type: 'shape',
          x: 500, y: 115, width: 410, height: 385,
          content: { shapeType: 'rect', color: theme.cardBg, borderRadius: 16 },
          style: {}
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 525, y: 135, width: 360, height: 40,
          content: { text: 'Proposed Solution Pillars', fontSize: 18, fontWeight: '700', fontFamily: theme.fontFamily, color: theme.accentColor },
          style: { textAlign: 'left' }
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 525, y: 180, width: 360, height: 300,
          content: {
            text: `• ${getContextSnippet(2, 'Automated, resilient workflow orchestration')}\n• Real-time visibility and consolidated metrics\n• Standardized compliance and governance\n• 3x acceleration in delivery throughput`,
            fontSize: 15, fontWeight: '400', fontFamily: 'Inter', color: theme.textColor, lineHeight: 1.7
          },
          style: { textAlign: 'left' }
        }
      ]
    });
  }

  // Slide 3: Performance Metrics & Key KPIs (Stats Grid)
  if (slideCount >= 3) {
    slides.push({
      id: uuidv4(),
      layout: 'stats',
      background: { type: 'solid', color: theme.bgColor },
      elements: [
        {
          id: uuidv4(),
          type: 'text',
          x: 50, y: 35, width: 860, height: 50,
          content: { text: 'Measurable Impact & Milestones', fontSize: 30, fontWeight: '700', fontFamily: theme.fontFamily, color: theme.primaryColor },
          style: { textAlign: 'left' }
        },
        {
          id: uuidv4(),
          type: 'shape',
          x: 50, y: 90, width: 60, height: 3,
          content: { shapeType: 'rect', color: theme.accentColor, borderRadius: 2 },
          style: {}
        },
        // Card 1
        {
          id: uuidv4(),
          type: 'shape',
          x: 50, y: 130, width: 265, height: 260,
          content: { shapeType: 'rect', color: theme.cardBg, borderRadius: 16 },
          style: {}
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 75, y: 165, width: 215, height: 75,
          content: { text: '85%', fontSize: 44, fontWeight: '800', fontFamily: theme.fontFamily, color: theme.accentColor },
          style: { textAlign: 'left' }
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 75, y: 245, width: 215, height: 120,
          content: { text: 'Reduction in processing friction across automated pipelines.', fontSize: 15, fontWeight: '400', fontFamily: 'Inter', color: theme.textMuted, lineHeight: 1.5 },
          style: { textAlign: 'left' }
        },
        // Card 2
        {
          id: uuidv4(),
          type: 'shape',
          x: 345, y: 130, width: 265, height: 260,
          content: { shapeType: 'rect', color: theme.cardBg, borderRadius: 16 },
          style: {}
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 370, y: 165, width: 215, height: 75,
          content: { text: '4.2x', fontSize: 44, fontWeight: '800', fontFamily: theme.fontFamily, color: theme.accentColor },
          style: { textAlign: 'left' }
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 370, y: 245, width: 215, height: 120,
          content: { text: 'Increase in operational efficiency and stakeholder confidence.', fontSize: 15, fontWeight: '400', fontFamily: 'Inter', color: theme.textMuted, lineHeight: 1.5 },
          style: { textAlign: 'left' }
        },
        // Card 3
        {
          id: uuidv4(),
          type: 'shape',
          x: 640, y: 130, width: 265, height: 260,
          content: { shapeType: 'rect', color: theme.cardBg, borderRadius: 16 },
          style: {}
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 665, y: 165, width: 215, height: 75,
          content: { text: '99.9%', fontSize: 44, fontWeight: '800', fontFamily: theme.fontFamily, color: theme.accentColor },
          style: { textAlign: 'left' }
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 665, y: 245, width: 215, height: 120,
          content: { text: 'Reliability and adherence to defined strategic targets.', fontSize: 15, fontWeight: '400', fontFamily: 'Inter', color: theme.textMuted, lineHeight: 1.5 },
          style: { textAlign: 'left' }
        }
      ]
    });
  }

  // Slide 4: 3-Step Execution Roadmap (Process)
  if (slideCount >= 4) {
    slides.push({
      id: uuidv4(),
      layout: 'process',
      background: { type: 'solid', color: theme.bgColor },
      elements: [
        {
          id: uuidv4(),
          type: 'text',
          x: 50, y: 35, width: 860, height: 50,
          content: { text: 'Phased Implementation Roadmap', fontSize: 30, fontWeight: '700', fontFamily: theme.fontFamily, color: theme.primaryColor },
          style: { textAlign: 'left' }
        },
        {
          id: uuidv4(),
          type: 'shape',
          x: 50, y: 90, width: 60, height: 3,
          content: { shapeType: 'rect', color: theme.accentColor, borderRadius: 2 },
          style: {}
        },
        // Step 1
        {
          id: uuidv4(),
          type: 'shape',
          x: 50, y: 140, width: 260, height: 330,
          content: { shapeType: 'rect', color: theme.cardBg, borderRadius: 16 },
          style: {}
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 75, y: 165, width: 210, height: 50,
          content: { text: '01', fontSize: 36, fontWeight: '800', fontFamily: theme.fontFamily, color: theme.accentColor },
          style: { textAlign: 'left' }
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 75, y: 225, width: 210, height: 40,
          content: { text: 'Assessment & Alignment', fontSize: 18, fontWeight: '700', fontFamily: theme.fontFamily, color: theme.primaryColor },
          style: { textAlign: 'left' }
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 75, y: 275, width: 210, height: 160,
          content: { text: 'Establish telemetry baseline, requirements matrix, and security guardrails.', fontSize: 14, fontWeight: '400', fontFamily: 'Inter', color: theme.textMuted, lineHeight: 1.6 },
          style: { textAlign: 'left' }
        },
        // Step 2
        {
          id: uuidv4(),
          type: 'shape',
          x: 350, y: 140, width: 260, height: 330,
          content: { shapeType: 'rect', color: theme.cardBg, borderRadius: 16 },
          style: {}
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 375, y: 165, width: 210, height: 50,
          content: { text: '02', fontSize: 36, fontWeight: '800', fontFamily: theme.fontFamily, color: theme.accentColor },
          style: { textAlign: 'left' }
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 375, y: 225, width: 210, height: 40,
          content: { text: 'Iterative Deployment', fontSize: 18, fontWeight: '700', fontFamily: theme.fontFamily, color: theme.primaryColor },
          style: { textAlign: 'left' }
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 375, y: 275, width: 210, height: 160,
          content: { text: 'Rapid pilot validation, feedback integration, and automated rollouts.', fontSize: 14, fontWeight: '400', fontFamily: 'Inter', color: theme.textMuted, lineHeight: 1.6 },
          style: { textAlign: 'left' }
        },
        // Step 3
        {
          id: uuidv4(),
          type: 'shape',
          x: 650, y: 140, width: 260, height: 330,
          content: { shapeType: 'rect', color: theme.cardBg, borderRadius: 16 },
          style: {}
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 675, y: 165, width: 210, height: 50,
          content: { text: '03', fontSize: 36, fontWeight: '800', fontFamily: theme.fontFamily, color: theme.accentColor },
          style: { textAlign: 'left' }
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 675, y: 225, width: 210, height: 40,
          content: { text: 'Continuous Optimization', fontSize: 18, fontWeight: '700', fontFamily: theme.fontFamily, color: theme.primaryColor },
          style: { textAlign: 'left' }
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 675, y: 275, width: 210, height: 160,
          content: { text: 'Scale architecture globally with performance benchmarking and governance.', fontSize: 14, fontWeight: '400', fontFamily: 'Inter', color: theme.textMuted, lineHeight: 1.6 },
          style: { textAlign: 'left' }
        }
      ]
    });
  }

  // Slide 5: Strategic Takeaways & Next Steps
  if (slideCount >= 5) {
    slides.push({
      id: uuidv4(),
      layout: 'content',
      background: { type: 'solid', color: theme.bgColor },
      elements: [
        {
          id: uuidv4(),
          type: 'shape',
          x: 0, y: 0, width: 8, height: 540,
          content: { shapeType: 'rect', color: theme.accentColor, borderRadius: 0 },
          style: {}
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 50, y: 40, width: 860, height: 50,
          content: { text: 'Executive Summary & Next Actions', fontSize: 32, fontWeight: '700', fontFamily: theme.fontFamily, color: theme.primaryColor },
          style: { textAlign: 'left' }
        },
        {
          id: uuidv4(),
          type: 'shape',
          x: 50, y: 95, width: 60, height: 3,
          content: { shapeType: 'rect', color: theme.accentColor, borderRadius: 2 },
          style: {}
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 50, y: 130, width: 860, height: 360,
          content: {
            text: `• Clear alignment achieved across core business and technical objectives\n• Targeted milestones scoped for immediate execution in next sprint\n• Resource allocation optimized for highest velocity and risk mitigation\n• Ready for stakeholder authorization and immediate deployment`,
            fontSize: 18, fontWeight: '400', fontFamily: 'Inter', color: theme.textColor, lineHeight: 1.8
          },
          style: { textAlign: 'left' }
        }
      ]
    });
  }

  return slides;
}
