import { useState, useEffect } from 'react';
import { generateContent } from '../services/gemini';
import { generateCoachPrompt, COACH_PERSONAS } from '../services/coachPersonality';
import type { PostType, SkillLevel, GeneratedPost, CoachPersonaType, RegenerateStyle, PlatformFormat } from '../types';
import { addPost, loadConfig, getPersonaPreferences } from '../services/storage';

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
  const [customTopic, setCustomTopic] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<CoachPersonaType>('Next Gen Hotshot');
  const [enabledPersonas, setEnabledPersonas] = useState<CoachPersonaType[]>(COACH_PERSONAS.map(p => p.type));
  const [platformFormat, setPlatformFormat] = useState<PlatformFormat>('standard');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPersonaSelector, setShowPersonaSelector] = useState(false);
  const [lastGenerateParams, setLastGenerateParams] = useState<{
    postType: PostType;
    topic: string;
    skillLevel: SkillLevel;
    additionalContext: string;
  } | null>(null);

  // Load persona preferences on mount
  useEffect(() => {
    const prefs = getPersonaPreferences();
    setSelectedPersona(prefs.defaultPersona);
    setEnabledPersonas(prefs.enabledPersonas);
    setPlatformFormat(prefs.defaultPlatformFormat);
  }, []);

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
        selectedPersona,
        platformFormat
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
    if (!customTopic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedPost('');

    try {
      const config = loadConfig();
      const topicToUse = customTopic.trim();
      const defaultPostType: PostType = 'Tip of the Day';
      const defaultSkillLevel: SkillLevel = 'All Levels';
      const audience = `high school bowlers (${defaultSkillLevel})`;
      const prompt = generateCoachPrompt(
        defaultPostType,
        topicToUse,
        audience,
        additionalContext,
        config.profile.name,
        selectedPersona,
        platformFormat
      );

      const result = await generateContent(prompt);
      setGeneratedPost(result);

      // Save last generate params for regeneration
      setLastGenerateParams({
        postType: defaultPostType,
        topic: topicToUse,
        skillLevel: defaultSkillLevel,
        additionalContext,
      });

      // Save to library
      const post = addPost({
        content: result,
        postType: defaultPostType,
        skillLevel: defaultSkillLevel,
        topic: topicToUse,
        category: 'Custom',
        tags: [defaultPostType, 'Custom', defaultSkillLevel, selectedPersona],
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
        undefined,
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
        category: 'Regenerated',
        tags: [lastGenerateParams.postType, lastGenerateParams.topic, personaToUse, style],
      });

      onPostGenerated?.(post);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="post-generator">
      <div className="persona-section">
        <h3>Choose Your Coach Persona:</h3>
        <div className="persona-grid">
          {COACH_PERSONAS.filter(persona => enabledPersonas.includes(persona.type)).map((persona) => (
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
          <div className="form-group">
            <label htmlFor="platformFormat">Platform Format</label>
            <select
              id="platformFormat"
              value={platformFormat}
              onChange={(e) => setPlatformFormat(e.target.value as PlatformFormat)}
            >
              <option value="standard">📱 Standard</option>
              <option value="facebook">📘 Facebook</option>
              <option value="instagram">📸 Instagram</option>
              <option value="twitter">𝕏 Twitter/X</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="customTopic">Topic</label>
            <input
              id="customTopic"
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="Enter your topic (e.g., 'How to improve spare shooting' or 'Ball maintenance tips')..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="additionalContext">Additional Context</label>
            <textarea
              id="additionalContext"
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Any specific details, recent events, or special instructions..."
              rows={4}
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
              <h4>Adjust Style:</h4>
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
                  onClick={() => setShowPersonaSelector(!showPersonaSelector)}
                  disabled={isLoading}
                >
                  🎭 {showPersonaSelector ? 'Cancel' : 'Change Persona'}
                </button>
              </div>

              {showPersonaSelector && (
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: '8px' }}>
                  <h4 style={{ marginBottom: '0.75rem' }}>Select New Persona:</h4>
                  <div className="persona-selector-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                    {COACH_PERSONAS.filter(persona => enabledPersonas.includes(persona.type) && persona.type !== selectedPersona).map((persona) => (
                      <button
                        key={persona.type}
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          setSelectedPersona(persona.type);
                          setShowPersonaSelector(false);
                          handleRegenerate('change-personality');
                        }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', padding: '0.75rem' }}
                      >
                        <span style={{ fontSize: '1.5rem' }}>{persona.emoji}</span>
                        <span style={{ fontSize: '0.85rem' }}>{persona.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
