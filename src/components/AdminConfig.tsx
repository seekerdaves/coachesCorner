import { useState, useEffect } from 'react';
import type { CoachProfile, Resource } from '../types';
import { loadConfig, updateProfile, addResource, updateResource, deleteResource } from '../services/storage';
import { getUserApiKey, saveUserApiKey, clearUserApiKey } from '../services/userApiKey';

export function AdminConfig() {
  const [activeTab, setActiveTab] = useState<'apikey' | 'profile' | 'resources'>('apikey');
  const [profile, setProfile] = useState<CoachProfile>({
    name: 'Coach',
    schoolName: 'High School',
    teamName: 'Bowling Team',
  });
  const [resources, setResources] = useState<Resource[]>([]);
  const [editingResource, setEditingResource] = useState<string | null>(null);
  const [newResource, setNewResource] = useState({
    title: '',
    url: '',
    category: '',
    tags: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // API Key state
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeySaveSuccess, setApiKeySaveSuccess] = useState(false);

  useEffect(() => {
    const config = loadConfig();
    setProfile(config.profile);
    setResources(config.resources);

    // Load API key
    const savedApiKey = getUserApiKey();
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleProfileSave = () => {
    updateProfile(profile);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleAddResource = () => {
    if (!newResource.title || !newResource.url) {
      alert('Title and URL are required');
      return;
    }

    const resource = addResource({
      title: newResource.title,
      url: newResource.url,
      category: newResource.category || 'General',
      tags: newResource.tags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setResources([...resources, resource]);
    setNewResource({ title: '', url: '', category: '', tags: '' });
    setShowAddForm(false);
  };

  const handleUpdateResource = (id: string, updates: Partial<Resource>) => {
    updateResource(id, updates);
    setResources(resources.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    setEditingResource(null);
  };

  const handleDeleteResource = (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      deleteResource(id);
      setResources(resources.filter((r) => r.id !== id));
    }
  };

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      alert('Please enter a valid API key');
      return;
    }
    saveUserApiKey(apiKey.trim());
    setApiKeySaveSuccess(true);
    setTimeout(() => setApiKeySaveSuccess(false), 2000);
  };

  const handleClearApiKey = () => {
    if (confirm('Are you sure you want to remove your API key? You will not be able to generate posts without it.')) {
      clearUserApiKey();
      setApiKey('');
    }
  };

  const maskApiKey = (key: string): string => {
    if (key.length <= 8) return '••••••••';
    return key.slice(0, 4) + '••••••••••••' + key.slice(-4);
  };

  return (
    <div className="admin-config">
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'apikey' ? 'active' : ''}`}
          onClick={() => setActiveTab('apikey')}
        >
          🔑 API Key
        </button>
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Profile
        </button>
        <button
          className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveTab('resources')}
        >
          📚 Resources
        </button>
      </div>

      {activeTab === 'apikey' && (
        <div className="apikey-section">
          <h3>Gemini API Configuration</h3>
          <div className="api-key-info card" style={{ backgroundColor: '#fef3c7', borderColor: '#f59e0b', marginBottom: '1.5rem', border: '2px solid' }}>
            <h4 style={{ color: '#92400e', marginBottom: '0.5rem' }}>🔒 Your API Key is Secure</h4>
            <p style={{ color: '#78350f', marginBottom: '0.5rem' }}>
              Your API key is stored locally in your browser only. It is never sent to any server except Google's Gemini API.
            </p>
            <p style={{ color: '#78350f', marginBottom: '0.5rem' }}>
              <strong>Why you need your own API key:</strong>
            </p>
            <ul style={{ color: '#78350f', marginLeft: '1.5rem', marginBottom: 0 }}>
              <li>No cost to you - Google provides generous free tier (1,500 requests/day)</li>
              <li>Better privacy - only you control your data</li>
              <li>Your usage, your limits</li>
            </ul>
          </div>

          <div className="api-key-setup card">
            <h4>Get Your Free API Key</h4>
            <ol style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>
                Visit{' '}
                <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
                  Google AI Studio
                </a>
              </li>
              <li>Sign in with your Google account</li>
              <li>Click "Create API Key"</li>
              <li>Copy the API key and paste it below</li>
            </ol>

            <div className="form-group">
              <label htmlFor="apiKey">
                Your Gemini API Key {getUserApiKey() && '(Currently Set ✅)'}
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  id="apiKey"
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => setShowApiKey(!showApiKey)}
                  title={showApiKey ? 'Hide API key' : 'Show API key'}
                >
                  {showApiKey ? '🙈' : '👁️'}
                </button>
              </div>
              {apiKey && !showApiKey && (
                <small style={{ color: 'var(--text-light)', marginTop: '0.5rem', display: 'block' }}>
                  Preview: {maskApiKey(apiKey)}
                </small>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-primary" onClick={handleSaveApiKey}>
                {apiKeySaveSuccess ? '✅ Saved!' : '💾 Save API Key'}
              </button>
              {getUserApiKey() && (
                <button className="btn btn-secondary" onClick={handleClearApiKey}>
                  🗑️ Remove Key
                </button>
              )}
            </div>
          </div>

          <div className="api-key-status card" style={{ marginTop: '1.5rem' }}>
            <h4>Status</h4>
            {getUserApiKey() ? (
              <p style={{ color: 'var(--success-color)', marginBottom: 0 }}>
                ✅ API Key configured - You're ready to generate posts!
              </p>
            ) : (
              <p style={{ color: 'var(--error-color)', marginBottom: 0 }}>
                ⚠️ No API key set - Add your API key above to start generating posts
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="profile-section">
          <h3>Coach Profile</h3>
          <p className="section-description">
            This information will be used to personalize your generated posts
          </p>

          <div className="form-group">
            <label htmlFor="coachName">Coach Name</label>
            <input
              id="coachName"
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Coach Smith"
            />
          </div>

          <div className="form-group">
            <label htmlFor="schoolName">School Name</label>
            <input
              id="schoolName"
              type="text"
              value={profile.schoolName}
              onChange={(e) => setProfile({ ...profile, schoolName: e.target.value })}
              placeholder="Lincoln High School"
            />
          </div>

          <div className="form-group">
            <label htmlFor="teamName">Team Name</label>
            <input
              id="teamName"
              type="text"
              value={profile.teamName}
              onChange={(e) => setProfile({ ...profile, teamName: e.target.value })}
              placeholder="Lightning Bowlers"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email (optional)</label>
            <input
              id="email"
              type="email"
              value={profile.email || ''}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="coach@school.edu"
            />
          </div>

          <div className="form-group">
            <label htmlFor="socialHandle">Social Handle (optional)</label>
            <input
              id="socialHandle"
              type="text"
              value={profile.socialHandle || ''}
              onChange={(e) => setProfile({ ...profile, socialHandle: e.target.value })}
              placeholder="@teamhandle"
            />
          </div>

          <button className="btn btn-primary" onClick={handleProfileSave}>
            {saveSuccess ? '✅ Saved!' : '💾 Save Profile'}
          </button>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="resources-section">
          <div className="section-header">
            <div>
              <h3>Resource Library</h3>
              <p className="section-description">
                Manage links and resources that help generate better content
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? '❌ Cancel' : '➕ Add Resource'}
            </button>
          </div>

          {showAddForm && (
            <div className="add-resource-form card">
              <h4>Add New Resource</h4>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={newResource.title}
                  onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                  placeholder="USBC Coaching Guide"
                />
              </div>
              <div className="form-group">
                <label>URL *</label>
                <input
                  type="url"
                  value={newResource.url}
                  onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={newResource.category}
                  onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
                  placeholder="Coaching, Fundamentals, etc."
                />
              </div>
              <div className="form-group">
                <label>Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newResource.tags}
                  onChange={(e) => setNewResource({ ...newResource, tags: e.target.value })}
                  placeholder="beginner, technique, video"
                />
              </div>
              <button className="btn btn-primary" onClick={handleAddResource}>
                ✅ Add Resource
              </button>
            </div>
          )}

          <div className="resources-list">
            {resources.map((resource) => (
              <div key={resource.id} className="resource-card card">
                {editingResource === resource.id ? (
                  <div className="edit-resource-form">
                    <input
                      type="text"
                      value={resource.title}
                      onChange={(e) =>
                        setResources(
                          resources.map((r) =>
                            r.id === resource.id ? { ...r, title: e.target.value } : r
                          )
                        )
                      }
                    />
                    <input
                      type="url"
                      value={resource.url}
                      onChange={(e) =>
                        setResources(
                          resources.map((r) =>
                            r.id === resource.id ? { ...r, url: e.target.value } : r
                          )
                        )
                      }
                    />
                    <div className="edit-actions">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleUpdateResource(resource.id, resource)}
                      >
                        ✅ Save
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setEditingResource(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="resource-header">
                      <div>
                        <h4>{resource.title}</h4>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-url">
                          🔗 {resource.url}
                        </a>
                      </div>
                      <div className="resource-actions">
                        <button
                          className="btn-icon"
                          onClick={() => setEditingResource(resource.id)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon delete"
                          onClick={() => handleDeleteResource(resource.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <div className="resource-meta">
                      <span className="resource-category">{resource.category}</span>
                      {resource.tags.map((tag, i) => (
                        <span key={i} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
