import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export function UserMenu() {
  const { user, signOut, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  const getThemeIcon = () => {
    if (theme === 'dark') return '🌙';
    if (theme === 'light') return '☀️';
    return '💻';
  };

  const getNextTheme = () => {
    if (theme === 'light') return 'dark';
    if (theme === 'dark') return 'system';
    return 'light';
  };

  const getThemeLabel = () => {
    if (theme === 'light') return 'Light Mode';
    if (theme === 'dark') return 'Dark Mode';
    return 'System Theme';
  };

  if (!isAuthenticated || !user) {
    // Show theme toggle even when not authenticated
    return (
      <div className="user-menu">
        <button
          className="user-menu-button"
          onClick={() => setTheme(getNextTheme())}
          title={`Switch theme (currently ${getThemeLabel()})`}
        >
          {getThemeIcon()}
        </button>
      </div>
    );
  }

  return (
    <div className="user-menu">
      <button
        className="user-menu-button"
        onClick={() => setShowMenu(!showMenu)}
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt={user.displayName || 'User'} className="user-avatar" />
        ) : (
          <div className="user-avatar-placeholder">
            {user.displayName?.[0] || user.email?.[0] || 'U'}
          </div>
        )}
        <span className="user-name">{user.displayName || user.email}</span>
        <span className="dropdown-arrow">▼</span>
      </button>

      {showMenu && (
        <>
          <div className="menu-backdrop" onClick={() => setShowMenu(false)} />
          <div className="user-menu-dropdown">
            <div className="menu-user-info">
              <strong>{user.displayName || 'User'}</strong>
              <small>{user.email}</small>
            </div>
            <button
              className="menu-item"
              onClick={() => {
                setTheme(getNextTheme());
              }}
            >
              {getThemeIcon()} {getThemeLabel()}
            </button>
            <button className="menu-item" onClick={() => { signOut(); setShowMenu(false); }}>
              🚪 Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
