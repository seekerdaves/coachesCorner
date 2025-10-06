import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function UserMenu() {
  const { user, signOut, isAuthenticated } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  if (!isAuthenticated || !user) {
    return null;
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
            <button className="menu-item" onClick={() => { signOut(); setShowMenu(false); }}>
              🚪 Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
