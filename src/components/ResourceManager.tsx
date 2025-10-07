import { useState, useEffect } from 'react';
import type { Resource } from '../types';
import { loadConfig, saveConfig } from '../services/storage';

export function ResourceManager() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = () => {
    const config = loadConfig();
    setResources(config.resources || []);
  };

  const handleAddResource = () => {
    setError('');

    // Validate URL
    try {
      new URL(newUrl);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    if (!newTitle.trim()) {
      setError('Please enter a title');
      return;
    }

    const config = loadConfig();
    const newResource: Resource = {
      id: `resource_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: newTitle.trim(),
      url: newUrl.trim(),
      category: newCategory.trim() || 'General',
      tags: [],
      addedDate: new Date().toISOString(),
    };

    config.resources = [...(config.resources || []), newResource];
    saveConfig(config);
    loadResources();

    // Reset form
    setNewUrl('');
    setNewTitle('');
    setNewCategory('');
    setIsAdding(false);
  };

  const handleDeleteResource = (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      const config = loadConfig();
      config.resources = (config.resources || []).filter((r) => r.id !== id);
      saveConfig(config);
      loadResources();
    }
  };

  const categories = Array.from(new Set(resources.map((r) => r.category)));

  return (
    <div className="resource-manager">
      <div className="resource-header">
        <h2>📚 Resource Library</h2>
        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          Add reference URLs that Gemini can use when generating posts. These resources will be fetched and included in the AI prompt.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => setIsAdding(!isAdding)}
        >
          {isAdding ? '❌ Cancel' : '➕ Add Resource'}
        </button>
      </div>

      {isAdding && (
        <div className="resource-form" style={{ marginTop: '1rem', padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
          <h3>Add New Resource</h3>
          <div className="form-group">
            <label htmlFor="resourceUrl">URL *</label>
            <input
              id="resourceUrl"
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://bowl.com/coaching/fundamental/"
            />
          </div>

          <div className="form-group">
            <label htmlFor="resourceTitle">Title *</label>
            <input
              id="resourceTitle"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="USBC Fundamental Coaching Guide"
            />
          </div>

          <div className="form-group">
            <label htmlFor="resourceCategory">Category</label>
            <input
              id="resourceCategory"
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Coaching, Fundamentals, Equipment, etc."
              list="category-suggestions"
            />
            <datalist id="category-suggestions">
              {categories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>

          {error && <div className="error-message">❌ {error}</div>}

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button className="btn btn-primary" onClick={handleAddResource}>
              ✅ Add Resource
            </button>
            <button className="btn btn-secondary" onClick={() => {
              setIsAdding(false);
              setError('');
              setNewUrl('');
              setNewTitle('');
              setNewCategory('');
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="resources-list" style={{ marginTop: '1.5rem' }}>
        {resources.length === 0 ? (
          <div className="empty-state">
            <p className="empty-emoji">📭</p>
            <p className="empty-text">
              No resources yet. Add URLs to help Gemini generate more accurate and informed content.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="resource-card"
                style={{
                  padding: '1rem',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>{resource.title}</h4>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--primary-color)', fontSize: '0.9rem', wordBreak: 'break-all' }}
                    >
                      {resource.url}
                    </a>
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span
                        className="tag"
                        style={{
                          backgroundColor: 'var(--primary-color)',
                          color: '#fff',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                        }}
                      >
                        {resource.category}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Added: {new Date(resource.addedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn-icon delete"
                    onClick={() => handleDeleteResource(resource.id)}
                    title="Delete resource"
                    style={{ marginLeft: '1rem' }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
