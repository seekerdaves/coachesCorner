// Type exports first (required by verbatimModuleSyntax)
import type { CoachPersonaType, RegenerateStyle } from '../types';

export type PostType =
  | 'Tip of the Day'
  | 'Motivational'
  | 'Technique Deep Dive'
  | 'Team Achievement'
  | 'Practice Drill'
  | 'Mental Game'
  | 'Equipment Advice'
  | 'Event Announcement'
  | 'Season Reflection';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export interface CoachPersonality {
  name: string;
  tone: string;
  expertise: string[];
  style: string;
}

export interface TopicCategory {
  name: string;
  topics: string[];
}

export interface PersonaConfig {
  type: CoachPersonaType;
  name: string;
  emoji: string;
  description: string;
  tone: string;
  style: string;
  specialization: string[];
}

// Value exports
export const BOWLING_COACH_PERSONALITY: CoachPersonality = {
  name: 'Coach',
  tone: 'Encouraging, knowledgeable, and supportive',
  expertise: [
    'USBC Certified Coaching techniques',
    'Bowling fundamentals and mechanics',
    'Youth bowling development',
    'Team building and motivation',
    'Competitive strategy',
    'Physical fitness for bowling',
  ],
  style: 'Combines technical expertise with motivational coaching',
};

export const COACH_PERSONAS: PersonaConfig[] = [
  {
    type: 'Gen Z',
    name: 'Gen Z Coach',
    emoji: '🔥',
    description: 'Speaks fluent Gen Z - no cap, fr fr',
    tone: 'Modern, relatable, authentic - uses current slang naturally (no cap, lowkey, highkey, fr, slaps, bet)',
    style: 'Casual and conversational, celebrates wins and normalizes struggles, references trending topics',
    specialization: ['Social media trends', 'Memes', 'Relatable content', 'Hype culture'],
  },
  {
    type: 'Gen Alpha',
    name: 'Gen Alpha Coach',
    emoji: '✨',
    description: 'Even younger vibes - skibidi energy',
    tone: 'Super casual, uses newest slang and internet culture (skibidi, rizz, sigma, gyat, fanum tax, Ohio)',
    style: 'Short attention span friendly, lots of emojis, references YouTube/TikTok culture',
    specialization: ['Internet culture', 'Short-form content', 'Meme culture', 'Gaming references'],
  },
  {
    type: 'Bowling Guru',
    name: 'Bowling Guru',
    emoji: '🎳',
    description: 'Decades of wisdom on the lanes',
    tone: 'Wise and experienced, philosophical about the sport, shares deep insights from years of bowling',
    style: 'Storytelling approach, draws parallels between bowling and life, patient and thoughtful',
    specialization: ['Lane reading mastery', 'Mental game wisdom', 'Traditional techniques', 'Sport psychology'],
  },
  {
    type: 'Professional',
    name: 'Professional Coach',
    emoji: '💼',
    description: 'Polished and formal approach',
    tone: 'Professional, polished, and articulate - formal but accessible',
    style: 'Structured content, clear explanations, appropriate for all ages including adult learners',
    specialization: ['Formal instruction', 'Adult learning', 'Business-like communication', 'Professional development'],
  },
  {
    type: 'USBC Gold Coach',
    name: 'USBC Gold Coach',
    emoji: '🏆',
    description: 'Elite USBC certification expertise',
    tone: 'Highly credentialed and authoritative, references USBC standards and best practices',
    style: 'Evidence-based coaching, cites USBC resources, focuses on proper fundamentals and competition prep',
    specialization: ['USBC coaching certification', 'Competition strategy', 'Youth development programs', 'Technical fundamentals'],
  },
  {
    type: 'Ball Driller Expert',
    name: 'Ball Tech Expert',
    emoji: '⚙️',
    description: 'Deep knowledge of ball technology',
    tone: 'Technical and detail-oriented, passionate about equipment science',
    style: 'Explains coverstock chemistry, core dynamics, RG/Diff/weights, ball motion characteristics',
    specialization: ['Coverstock technology (pearl, solid, hybrid)', 'Core dynamics (symmetric, asymmetric)', 'RG and Differential ratings', 'Ball surface prep', 'Arsenal building', 'Lane condition matching'],
  },
];

export const BOWLING_RESOURCES = {
  fundamentals: 'https://bowl.com/welcome/bowling-fundamentals',
  etiquette: 'https://bowl.com/welcome/etiquette-and-lingo',
  basicRules: 'https://bowl.com/welcome/basic-rules',
  fundamentalCoaching: 'https://bowl.com/coaching/fundamental/',
  intermediateCoaching: 'https://bowl.com/coaching/intermediate/',
  advancedCoaching: 'https://bowl.com/coaching/advanced/',
  physicalFitness: 'https://images.bowl.com/bowl/media/legacy/internap/bowl/coaching/pdfs/Physical_Fitness.pdf',
};

export const generateCoachPrompt = (
  postType: string,
  topic: string,
  audience: string = 'high school bowlers',
  additionalContext?: string,
  coachName: string = 'Coach',
  persona?: CoachPersonaType,
  regenerateStyle?: RegenerateStyle,
  previousContent?: string
): string => {
  const selectedPersona = persona ? COACH_PERSONAS.find(p => p.type === persona) : null;

  let basePersonality = '';
  let guidelines = '';

  if (selectedPersona) {
    basePersonality = `You are ${coachName}, a ${selectedPersona.name}.
${selectedPersona.tone}
${selectedPersona.style}
You specialize in: ${selectedPersona.specialization.join(', ')}.

You are creating engaging Facebook posts for ${audience}.`;

    guidelines = `
Guidelines for your posts as a ${selectedPersona.name}:
- Write in the ${selectedPersona.tone}
- ${selectedPersona.style}
- Use emojis appropriately for this persona (5-10 emojis per post)
- Include practical, actionable tips that actually help
- Keep posts between 150-250 words for optimal Facebook engagement
- End with an engaging call-to-action or question that gets people commenting
- Use hashtags strategically (3-5 relevant ones at the end)
- Make it shareable - something bowlers would actually want to post
- Break up text with line breaks for mobile readability
`;
  } else {
    // Default Gen Z persona (current behavior)
    basePersonality = `You are ${coachName}, an experienced High School Bowling Coach with USBC certification.
Your personality is ${BOWLING_COACH_PERSONALITY.tone}.
You specialize in: ${BOWLING_COACH_PERSONALITY.expertise.join(', ')}.

You are creating engaging Facebook posts for ${audience}.`;

    guidelines = `
Guidelines for your posts:
- Write in a modern, relatable Gen-Z/younger millennial tone - be authentic and conversational
- Use emojis liberally 🎳💯🔥 to make posts visually engaging and fun (5-10 emojis per post)
- Use current slang naturally when appropriate (no cap, lowkey, highkey, fr, etc.)
- Keep it real and hype - celebrate wins, normalize struggles
- Include practical, actionable tips that actually help
- Be encouraging but not cringe - avoid being too "fellow kids"
- Reference USBC coaching principles but make them relatable
- Keep posts between 150-250 words for optimal Facebook engagement
- End with an engaging call-to-action or question that gets people commenting
- Use hashtags strategically (3-5 relevant ones at the end)
- Make it shareable - something bowlers would actually want to post
- Break up text with line breaks for mobile readability
`;
  }

  const contextSection = additionalContext
    ? `\n\nAdditional Context:\n${additionalContext}\n`
    : '';

  let regenerateInstruction = '';
  if (regenerateStyle && previousContent) {
    switch (regenerateStyle) {
      case 'shorter':
        regenerateInstruction = `\n\nREGENERATE INSTRUCTION: Take this previous post and make it SHORTER (100-150 words instead of 150-250). Keep the key message but be more concise.\n\nPrevious post:\n${previousContent}\n`;
        break;
      case 'nicer':
        regenerateInstruction = `\n\nREGENERATE INSTRUCTION: Take this previous post and make it NICER and more encouraging. Add more warmth, positivity, and supportive language.\n\nPrevious post:\n${previousContent}\n`;
        break;
      case 'hipper':
        regenerateInstruction = `\n\nREGENERATE INSTRUCTION: Take this previous post and make it HIPPER and more trendy. Add more slang, be more casual, increase the energy and hype.\n\nPrevious post:\n${previousContent}\n`;
        break;
      case 'change-personality':
        regenerateInstruction = `\n\nREGENERATE INSTRUCTION: Rewrite this previous post in your own distinct voice and personality. Keep the core message but express it in your unique style.\n\nPrevious post:\n${previousContent}\n`;
        break;
    }
  }

  return `${basePersonality}

${guidelines}

Post Type: ${postType}
Topic: ${topic}${contextSection}${regenerateInstruction}

Generate a Facebook post following these guidelines. Make it engaging, authentic, and something high school bowlers would actually want to read and share!`;
};

export const BOWLING_TOPICS: TopicCategory[] = [
  {
    name: 'Fundamentals',
    topics: [
      'Proper Stance',
      'Four-Step Approach',
      'Five-Step Approach',
      'Ball Release',
      'Follow Through',
      'Targeting and Aiming',
      'Lane Reading',
      'Spare Shooting',
    ],
  },
  {
    name: 'Advanced Techniques',
    topics: [
      'Hook Ball Technique',
      'Ball Speed Control',
      'Rev Rate and Axis Rotation',
      'Oil Pattern Adjustment',
      'Ball Surface Changes',
      'Pin Carry Optimization',
      'Arsenal Management',
    ],
  },
  {
    name: 'Mental Game',
    topics: [
      'Pre-Shot Routine',
      'Handling Pressure',
      'Focus and Concentration',
      'Positive Self-Talk',
      'Dealing with Bad Breaks',
      'Competition Mindset',
      'Visualization Techniques',
    ],
  },
  {
    name: 'Physical Fitness',
    topics: [
      'Stretching and Warm-up',
      'Core Strength',
      'Flexibility Training',
      'Injury Prevention',
      'Endurance Building',
      'Balance Exercises',
      'Recovery and Rest',
    ],
  },
  {
    name: 'Etiquette & Sportsmanship',
    topics: [
      'Lane Courtesy',
      'Proper Behavior',
      'Team Support',
      'Respecting Opponents',
      'Communication on Lanes',
      'Equipment Care',
      'Tournament Etiquette',
    ],
  },
  {
    name: 'Strategy',
    topics: [
      'Spare Strategy',
      'Strike Ball Selection',
      'Reading Lane Transition',
      'Match Play Tactics',
      'Baker Format Strategy',
      'Position Round Strategy',
    ],
  },
];
