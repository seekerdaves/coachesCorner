import { useState, useEffect } from 'react';
import type { GeneratedPost, CoachPersonaType, PlatformFormat } from '../types';
import { loadConfig, markPostAsUsed, deletePost, addPost } from '../services/storage';
import { generateContent } from '../services/gemini';
import { generateCoachPrompt, COACH_PERSONAS } from '../services/coachPersonality';

export function PostLibrary() {
  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  const [filter, setFilter] = useState<'all' | 'unused' | 'used'>('unused');
  const [searchTerm, setSearchTerm] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [regeneratingPost, setRegeneratingPost] = useState<string | null>(null);
  const [showPersonaSelector, setShowPersonaSelector] = useState<string | null>(null);
  const [showPlatformSelector, setShowPlatformSelector] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [personaFilter, setPersonaFilter] = useState<string>('all');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    const config = loadConfig();
    setPosts(config.posts);
  };

  const handleMarkAsUsed = (id: string) => {
    markPostAsUsed(id);
    loadPosts();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      deletePost(id);
      loadPosts();
    }
  };

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopySuccess(id);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const handleRegenerateWithPersona = async (post: GeneratedPost, newPersona: CoachPersonaType) => {
    setRegeneratingPost(post.id);
    setShowPersonaSelector(null);

    try {
      const config = loadConfig();
      const audience = `high school bowlers (${post.skillLevel})`;
      const prompt = generateCoachPrompt(
        post.postType,
        post.topic,
        audience,
        '',
        config.profile.name,
        newPersona,
        undefined,
        'change-personality',
        post.content
      );

      const result = await generateContent(prompt);

      const newPost = addPost({
        content: result,
        postType: post.postType,
        skillLevel: post.skillLevel,
        topic: post.topic,
        category: post.category,
        tags: [...post.tags.filter(t => !COACH_PERSONAS.find(p => p.type === t)), newPersona, 'regenerated'],
      });

      loadPosts();
      setExpandedPost(newPost.id);
    } catch (err) {
      alert(`Error regenerating: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setRegeneratingPost(null);
    }
  };

  const handleRegenerateWithPlatform = async (post: GeneratedPost, platform: PlatformFormat) => {
    setRegeneratingPost(post.id);
    setShowPlatformSelector(null);

    try {
      const config = loadConfig();
      const audience = `high school bowlers (${post.skillLevel})`;
      const personaTag = post.tags.find(t => COACH_PERSONAS.find(p => p.type === t)) as CoachPersonaType | undefined;

      const prompt = generateCoachPrompt(
        post.postType,
        post.topic,
        audience,
        '',
        config.profile.name,
        personaTag || 'Next Gen Hotshot',
        platform,
        undefined,
        post.content
      );

      const result = await generateContent(prompt);

      const newPost = addPost({
        content: result,
        postType: post.postType,
        skillLevel: post.skillLevel,
        topic: post.topic,
        category: post.category,
        tags: [...post.tags, platform, 'regenerated'],
      });

      loadPosts();
      setExpandedPost(newPost.id);
    } catch (err) {
      alert(`Error regenerating: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setRegeneratingPost(null);
    }
  };

  const getPreview = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const filteredPosts = posts
    .filter((post) => {
      if (filter === 'unused') return !post.isUsed;
      if (filter === 'used') return post.isUsed;
      return true;
    })
    .filter((post) => {
      if (categoryFilter !== 'all' && post.category !== categoryFilter) return false;
      if (personaFilter !== 'all' && !post.tags.includes(personaFilter)) return false;
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        post.content.toLowerCase().includes(search) ||
        post.topic.toLowerCase().includes(search) ||
        post.postType.toLowerCase().includes(search) ||
        post.category.toLowerCase().includes(search)
      );
    });

  const unusedCount = posts.filter((p) => !p.isUsed).length;
  const usedCount = posts.filter((p) => p.isUsed).length;
  const categories = ['all', ...Array.from(new Set(posts.map(p => p.category)))];
  const personas = ['all', ...COACH_PERSONAS.map(p => p.type)];

  return (
    <div className="post-library">
      <div className="library-header">
        <div className="library-stats">
          <div className="stat-card">
            <span className="stat-number">{posts.length}</span>
            <span className="stat-label">Total Posts</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{unusedCount}</span>
            <span className="stat-label">Ready to Use</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{usedCount}</span>
            <span className="stat-label">Posted</span>
          </div>
        </div>

        <div className="library-controls">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'unused' ? 'active' : ''}`}
              onClick={() => setFilter('unused')}
            >
              📝 Ready ({unusedCount})
            </button>
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              📚 All ({posts.length})
            </button>
            <button
              className={`filter-tab ${filter === 'used' ? 'active' : ''}`}
              onClick={() => setFilter('used')}
            >
              ✅ Posted ({usedCount})
            </button>
          </div>

          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="advanced-filters">
          <div className="form-group">
            <label htmlFor="categoryFilter">Category:</label>
            <select
              id="categoryFilter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="personaFilter">Persona:</label>
            <select
              id="personaFilter"
              value={personaFilter}
              onChange={(e) => setPersonaFilter(e.target.value)}
            >
              {personas.map(persona => (
                <option key={persona} value={persona}>
                  {persona === 'all' ? 'All Personas' : persona}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="posts-grid">
        {filteredPosts.length === 0 ? (
          <div className="empty-state">
            <p className="empty-emoji">📭</p>
            <p className="empty-text">
              {searchTerm || categoryFilter !== 'all' || personaFilter !== 'all'
                ? 'No posts match your filters'
                : filter === 'unused'
                ? 'No unused posts yet. Generate some posts to get started!'
                : 'No posts yet'}
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className={`post-card ${post.isUsed ? 'used' : ''} ${expandedPost === post.id ? 'expanded' : ''}`}>
              <div className="post-card-header">
                <div className="post-meta">
                  <span className="post-type">{post.postType}</span>
                  <span className="post-topic">{post.topic}</span>
                </div>
                {post.isUsed && <span className="used-badge">✅ Posted</span>}
              </div>

              <div
                className="post-content"
                onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                style={{ cursor: 'pointer' }}
              >
                {expandedPost === post.id ? post.content : getPreview(post.content)}
              </div>

              {expandedPost === post.id && (
                <div className="post-regenerate-section">
                  <h5>Regenerate with:</h5>
                  <div className="regenerate-buttons">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setShowPersonaSelector(showPersonaSelector === post.id ? null : post.id)}
                      disabled={regeneratingPost === post.id}
                    >
                      🎭 Different Persona
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setShowPlatformSelector(showPlatformSelector === post.id ? null : post.id)}
                      disabled={regeneratingPost === post.id}
                    >
                      📱 Different Platform
                    </button>
                  </div>

                  {showPersonaSelector === post.id && (
                    <div className="selector-grid">
                      {COACH_PERSONAS.map((persona) => (
                        <button
                          key={persona.type}
                          className="btn btn-outline btn-sm"
                          onClick={() => handleRegenerateWithPersona(post, persona.type)}
                          disabled={regeneratingPost === post.id}
                        >
                          {persona.emoji} {persona.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {showPlatformSelector === post.id && (
                    <div className="selector-grid">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleRegenerateWithPlatform(post, 'facebook')}
                        disabled={regeneratingPost === post.id}
                      >
                        📘 Facebook
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleRegenerateWithPlatform(post, 'instagram')}
                        disabled={regeneratingPost === post.id}
                      >
                        📸 Instagram
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleRegenerateWithPlatform(post, 'twitter')}
                        disabled={regeneratingPost === post.id}
                      >
                        𝕏 Twitter/X
                      </button>
                    </div>
                  )}

                  {regeneratingPost === post.id && (
                    <div className="loading-indicator" style={{ padding: '1rem' }}>
                      <div className="spinner"></div>
                      <p>Regenerating post...</p>
                    </div>
                  )}
                </div>
              )}

              <div className="post-card-footer">
                <div className="post-tags">
                  {post.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="post-actions">
                  <button
                    className="btn-icon"
                    onClick={() => handleCopy(post.content, post.id)}
                    title="Copy to clipboard"
                  >
                    {copySuccess === post.id ? '✅' : '📋'}
                  </button>

                  {!post.isUsed && (
                    <button
                      className="btn-icon"
                      onClick={() => handleMarkAsUsed(post.id)}
                      title="Mark as used"
                    >
                      ✓
                    </button>
                  )}

                  <button
                    className="btn-icon delete"
                    onClick={() => handleDelete(post.id)}
                    title="Delete post"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="post-date">
                Generated: {new Date(post.generatedDate).toLocaleDateString()}
                {post.usedDate && ` • Posted: ${new Date(post.usedDate).toLocaleDateString()}`}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
