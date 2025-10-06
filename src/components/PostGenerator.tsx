import { useState } from 'react';
import { generateContent } from '../services/gemini';
import { generateCoachPrompt, BOWLING_TOPICS, COACH_PERSONAS } from '../services/coachPersonality';
import type { PostType, SkillLevel, GeneratedPost, CoachPersonaType, RegenerateStyle } from '../types';
import { addPost, loadConfig } from '../services/storage';

interface Props {
  onPostGenerated?: (post: GeneratedPost) => void;
}

const QUICK_TEMPLATES = [
  { emoji: '💡', label: 'Quick Tip', postType: 'Tip of the Day' as PostType, topic: 'Proper Stance' },
  { emoji: '🔥', label: 'Motivation', postType: 'Motivational' as PostType, topic: 'Mental Game' },
  { emoji: '🎯', label: 'Technique', postType: 'Technique Deep Dive' as PostType, topic: 'Hook Ball Technique' },
  { emoji: '💪', label: 'Practice Drill', postType: 'Practice Drill' as PostType, topic: 'Spare Shooting' },
];

export function PostGenerator({ onPostGenerated }: Props) {
  const [mode, setMode] = useState<'quick' | 'custom'>('quick');
  const [postType, setPostType] = useState<PostType>('Tip of the Day');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('All Levels');
  const [category, setCategory] = useState('Fundamentals');
  const [topic, setTopic] = useState('Proper Stance');
  const [customTopic, setCustomTopic] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<CoachPersonaType>('Gen Z');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastGenerateParams, setLastGenerateParams] = useState<{
    postType: PostType;
    topic: string;
    skillLevel: SkillLevel;
    additionalContext: string;
  } | null>(null);

  const postTypes: PostType[] = [
    'Tip of the Day',
    'Motivational',
    'Technique Deep Dive',
    'Team Achievement',
    'Practice Drill',
    'Mental Game',
    'Equipment Advice',
    'Event Announcement',
    'Season Reflection',
  ];

  const skillLevels: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
  const selectedCategory = BOWLING_TOPICS.find((cat) => cat.name === category);
  const topics = selectedCategory?.topics || [];

  const handleQuickGenerate = async (template: typeof QUICK_TEMPLATES[0]) => {
    setIsLoading(true);
    setError('');
    setGeneratedPost('');

    try {
      const config = loadConfig();
      const audience = `high school bowlers (All Levels)`;
      const prompt = generateCoachPrompt(
        template.postType,
        template.topic,
        audience,
        '',
        config.profile.name,
        selectedPersona
      );

      const result = await generateContent(prompt);
      setGeneratedPost(result);

      // Save last generate params for regeneration
      setLastGenerateParams({
        postType: template.postType,
        topic: template.topic,
        skillLevel: 'All Levels',
        additionalContext: '',
      });

      // Save to library
      const post = addPost({
        content: result,
        postType: template.postType,
        skillLevel: 'All Levels',
        topic: template.topic,
        category: 'Quick Generate',
        tags: [template.postType, template.topic, selectedPersona],
      });

      onPostGenerated?.(post);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomGenerate = async () => {
    setIsLoading(true);
    setError('');
    setGeneratedPost('');

    try {
      const config = loadConfig();
      const topicToUse = customTopic.trim() || topic;
      const audience = `high school bowlers (${skillLevel})`;
      const prompt = generateCoachPrompt(
        postType,
        topicToUse,
        audience,
        additionalContext,
        config.profile.name,
        selectedPersona
      );

      const result = await generateContent(prompt);
      setGeneratedPost(result);

      // Save last generate params for regeneration
      setLastGenerateParams({
        postType,
        topic: topicToUse,
        skillLevel,
        additionalContext,
      });

      // Save to library
      const post = addPost({
        content: result,
        postType,
        skillLevel,
        topic: topicToUse,
        category,
        tags: [postType, category, skillLevel, selectedPersona],
      });

      onPostGenerated?.(post);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async (style: RegenerateStyle) => {
    if (!lastGenerateParams || !generatedPost) return;

    setIsLoading(true);
    setError('');

    try {
      const config = loadConfig();
      const audience = `high school bowlers (${lastGenerateParams.skillLevel})`;

      // For change-personality, use a random different persona
      let personaToUse = selectedPersona;
      if (style === 'change-personality') {
        const otherPersonas = COACH_PERSONAS.filter(p => p.type !== selectedPersona);
        const randomPersona = otherPersonas[Math.floor(Math.random() * otherPersonas.length)];
        personaToUse = randomPersona.type;
        setSelectedPersona(personaToUse);
      }

      const prompt = generateCoachPrompt(
        lastGenerateParams.postType,
        lastGenerateParams.topic,
        audience,
        lastGenerateParams.additionalContext,
        config.profile.name,
        personaToUse,
        style,
        generatedPost
      );

      const result = await generateContent(prompt);
      setGeneratedPost(result);

      // Save to library
      const post = addPost({
        content: result,
        postType: lastGenerateParams.postType,
        skillLevel: lastGenerateParams.skillLevel,
        topic: lastGenerateParams.topic,
        category: mode === 'quick' ? 'Quick Generate' : category,
        tags: [lastGenerateParams.postType, lastGenerateParams.topic, personaToUse, style],
      });

      onPostGenerated?.(post);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    const newCategoryTopics = BOWLING_TOPICS.find((cat) => cat.name === newCategory);
    if (newCategoryTopics && newCategoryTopics.topics.length > 0) {
      setTopic(newCategoryTopics.topics[0]);
    }
  };

  return (
    <div className="post-generator">
      <div className="persona-section">
        <h3>Choose Your Coach Persona:</h3>
        <div className="persona-grid">
          {COACH_PERSONAS.map((persona) => (
            <button
              key={persona.type}
              className={`persona-card ${selectedPersona === persona.type ? 'active' : ''}`}
              onClick={() => setSelectedPersona(persona.type)}
              disabled={isLoading}
            >
              <span className="persona-emoji">{persona.emoji}</span>
              <span className="persona-name">{persona.name}</span>
              <span className="persona-desc">{persona.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mode-toggle">
        <button
          className={`mode-btn ${mode === 'quick' ? 'active' : ''}`}
          onClick={() => setMode('quick')}
        >
          ⚡ Quick Generate
        </button>
        <button
          className={`mode-btn ${mode === 'custom' ? 'active' : ''}`}
          onClick={() => setMode('custom')}
        >
          🎨 Custom
        </button>
      </div>

      {mode === 'quick' ? (
        <div className="quick-templates">
          <h3>Choose a template:</h3>
          <div className="template-grid">
            {QUICK_TEMPLATES.map((template) => (
              <button
                key={template.label}
                className="template-card"
                onClick={() => handleQuickGenerate(template)}
                disabled={isLoading}
              >
                <span className="template-emoji">{template.emoji}</span>
                <span className="template-label">{template.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="custom-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="postType">Post Type</label>
              <select
                id="postType"
                value={postType}
                onChange={(e) => setPostType(e.target.value as PostType)}
              >
                {postTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="skillLevel">Skill Level</label>
              <select
                id="skillLevel"
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value as SkillLevel)}
              >
                {skillLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
                {BOWLING_TOPICS.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="topic">Topic</label>
              <select id="topic" value={topic} onChange={(e) => setTopic(e.target.value)}>
                {topics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="customTopic">Custom Topic (optional)</label>
            <input
              id="customTopic"
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="Enter a custom topic..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="additionalContext">Additional Context</label>
            <textarea
              id="additionalContext"
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Any specific details, recent events, or special instructions..."
              rows={3}
            />
          </div>

          <button className="btn btn-primary" onClick={handleCustomGenerate} disabled={isLoading}>
            {isLoading ? '⏳ Generating...' : '✨ Generate Post'}
          </button>
        </div>
      )}

      {isLoading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Generating your post...</p>
        </div>
      )}

      {error && <div className="error-message">❌ {error}</div>}

      {generatedPost && (
        <div className="generated-result">
          <h3>Generated Post:</h3>
          <div className="post-preview">{generatedPost}</div>
          <div className="post-actions-section">
            <div className="post-actions">
              <button
                className="btn btn-secondary"
                onClick={() => navigator.clipboard.writeText(generatedPost)}
              >
                📋 Copy
              </button>
            </div>
            <div className="regenerate-section">
              <h4>Regenerate Options:</h4>
              <div className="regenerate-options">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleRegenerate('shorter')}
                  disabled={isLoading}
                >
                  📏 Shorter
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleRegenerate('nicer')}
                  disabled={isLoading}
                >
                  😊 Nicer
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleRegenerate('hipper')}
                  disabled={isLoading}
                >
                  🔥 Hipper
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleRegenerate('change-personality')}
                  disabled={isLoading}
                >
                  🎭 Change Personality
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
