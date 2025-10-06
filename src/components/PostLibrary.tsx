import { useState, useEffect } from 'react';
import type { GeneratedPost } from '../types';
import { loadConfig, markPostAsUsed, deletePost } from '../services/storage';

export function PostLibrary() {
  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  const [filter, setFilter] = useState<'all' | 'unused' | 'used'>('unused');
  const [searchTerm, setSearchTerm] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

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

  const filteredPosts = posts
    .filter((post) => {
      if (filter === 'unused') return !post.isUsed;
      if (filter === 'used') return post.isUsed;
      return true;
    })
    .filter((post) => {
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
      </div>

      <div className="posts-grid">
        {filteredPosts.length === 0 ? (
          <div className="empty-state">
            <p className="empty-emoji">📭</p>
            <p className="empty-text">
              {searchTerm
                ? 'No posts match your search'
                : filter === 'unused'
                ? 'No unused posts yet. Generate some posts to get started!'
                : 'No posts yet'}
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className={`post-card ${post.isUsed ? 'used' : ''}`}>
              <div className="post-card-header">
                <div className="post-meta">
                  <span className="post-type">{post.postType}</span>
                  <span className="post-topic">{post.topic}</span>
                </div>
                {post.isUsed && <span className="used-badge">✅ Posted</span>}
              </div>

              <div className="post-content">{post.content}</div>

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
