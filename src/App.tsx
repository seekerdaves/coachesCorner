import { useState } from 'react';
import './App.css';
import { isConfigured } from './services/gemini';
import { PostGenerator } from './components/PostGenerator';
import { PostLibrary } from './components/PostLibrary';
import { AdminConfig } from './components/AdminConfig';
import { AuthGate } from './components/AuthGate';
import { UserMenu } from './components/UserMenu';

type Tab = 'generate' | 'library' | 'admin';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('generate');
  const [refreshLibrary, setRefreshLibrary] = useState(0);

  const handlePostGenerated = () => {
    setRefreshLibrary((prev) => prev + 1);
  };

  return (
    <AuthGate>
      <div className="app">
        <header className="header">
          <div className="header-content">
            <div>
              <h1>🎳 Bowling Coach Social Hub</h1>
              <p>Generate, manage, and track your team's social media content</p>
            </div>
            <UserMenu />
          </div>
        </header>

      {!isConfigured() && (
        <div className="api-warning">
          <h3>⚠️ API Key Required</h3>
          <p>
            To use this app, you need to add your Google Gemini API key to the <code>.env</code> file.
          </p>
          <p>
            1. Get your API key from:{' '}
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
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

      <nav className="main-nav">
        <button
          className={`nav-tab ${activeTab === 'generate' ? 'active' : ''}`}
          onClick={() => setActiveTab('generate')}
        >
          ✨ Generate
        </button>
        <button
          className={`nav-tab ${activeTab === 'library' ? 'active' : ''}`}
          onClick={() => setActiveTab('library')}
        >
          📚 Library
        </button>
        <button
          className={`nav-tab ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveTab('admin')}
        >
          ⚙️ Settings
        </button>
      </nav>

      <div className="container">
        <main className="main-content">
          {activeTab === 'generate' && <PostGenerator onPostGenerated={handlePostGenerated} />}
          {activeTab === 'library' && <PostLibrary key={refreshLibrary} />}
          {activeTab === 'admin' && <AdminConfig />}
        </main>
      </div>

        <footer className="footer">
          <p>
            Built with React + TypeScript | Powered by Google Gemini AI
            <br />
            Resources from USBC (United States Bowling Congress)
          </p>
        </footer>
      </div>
    </AuthGate>
  );
}

export default App;
