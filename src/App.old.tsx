import { useState } from 'react';
import './App.css';
import { generateContent, isConfigured } from './services/gemini';
import type { PostType, SkillLevel } from './services/coachPersonality';
import {
  BOWLING_TOPICS,
  generateCoachPrompt,
  BOWLING_RESOURCES,
} from './services/coachPersonality';

function App() {
  const [postType, setPostType] = useState<PostType>('Tip of the Day');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('All Levels');
  const [category, setCategory] = useState('Fundamentals');
  const [topic, setTopic] = useState('Proper Stance');
  const [customTopic, setCustomTopic] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

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

  const handleGenerate = async () => {
    if (!isConfigured()) {
      setError('Please configure your Gemini API key in the .env file first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setCopySuccess(false);

    try {
      const topicToUse = customTopic.trim() || topic;
      const audience = `high school bowlers (${skillLevel})`;
      const prompt = generateCoachPrompt(postType, topicToUse, audience, additionalContext);

      const result = await generateContent(prompt);
      setGeneratedPost(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating the post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedPost);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      setError('Failed to copy to clipboard');
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
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🎳 Bowling Coach Post Generator</h1>
          <p>Create engaging Facebook posts and tips for your high school bowling team</p>
        </div>
      </header>

      <div className="container">
        {!isConfigured() && (
          <div className="api-warning">
            <h3>⚠️ API Key Required</h3>
            <p>
              To use this app, you need to add your Google Gemini API key to the <code>.env</code> file.
            </p>
            <p>
              1. Get your API key from:{' '}
              <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                Google AI Studio
              </a>
            </p>
            <p>
              2. Copy <code>.env.example</code> to <code>.env</code>
            </p>
            <p>
              3. Add your API key to <code>VITE_GEMINI_API_KEY</code>
            </p>
            <p>4. Restart the development server</p>
          </div>
        )}

        <div className="main-grid">
          <div className="card">
            <h2>Post Configuration</h2>

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

            <div className="form-group">
              <label htmlFor="category">Topic Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {BOWLING_TOPICS.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="topic">Specific Topic</label>
              <select id="topic" value={topic} onChange={(e) => setTopic(e.target.value)}>
                {topics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="customTopic">Or Custom Topic (optional)</label>
              <input
                id="customTopic"
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Enter a custom topic..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="additionalContext">Additional Context (optional)</label>
              <textarea
                id="additionalContext"
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                placeholder="Add any specific details, recent team events, or special instructions..."
              />
            </div>

            <button className="btn btn-primary" onClick={handleGenerate} disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Generating...
                </>
              ) : (
                'Generate Post'
              )}
            </button>
          </div>

          <div className="card">
            <h2>Generated Post</h2>

            {error && <div className="error-message">{error}</div>}
            {copySuccess && <div className="success-message">✓ Copied to clipboard!</div>}

            <div className={`preview-box ${!generatedPost ? 'empty' : ''}`}>
              {generatedPost || 'Your generated post will appear here...'}
            </div>

            {generatedPost && (
              <div className="btn-group" style={{ marginTop: '1rem' }}>
                <button className="btn btn-secondary" onClick={handleCopy}>
                  📋 Copy to Clipboard
                </button>
                <button className="btn btn-primary" onClick={handleGenerate} disabled={isLoading}>
                  🔄 Regenerate
                </button>
              </div>
            )}

            <div className="resources-section">
              <h3>USBC Coaching Resources</h3>
              <div className="resources-grid">
                <a
                  href={BOWLING_RESOURCES.fundamentals}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-link"
                >
                  📚 Fundamentals
                </a>
                <a
                  href={BOWLING_RESOURCES.etiquette}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-link"
                >
                  🤝 Etiquette & Lingo
                </a>
                <a
                  href={BOWLING_RESOURCES.basicRules}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-link"
                >
                  📖 Basic Rules
                </a>
                <a
                  href={BOWLING_RESOURCES.fundamentalCoaching}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-link"
                >
                  🎯 Fundamental Coaching
                </a>
                <a
                  href={BOWLING_RESOURCES.intermediateCoaching}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-link"
                >
                  📈 Intermediate Coaching
                </a>
                <a
                  href={BOWLING_RESOURCES.advancedCoaching}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-link"
                >
                  🏆 Advanced Coaching
                </a>
                <a
                  href={BOWLING_RESOURCES.physicalFitness}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-link"
                >
                  💪 Physical Fitness
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>
          Built with React + TypeScript | Powered by Google Gemini AI
          <br />
          Resources from USBC (United States Bowling Congress)
        </p>
      </footer>
    </div>
  );
}

export default App;
