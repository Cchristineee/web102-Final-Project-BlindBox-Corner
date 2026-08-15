import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../client';
import './Components/Navbar.css';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetching active user's session on initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth state changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/');
  }

  return (
    <nav className="navbar">
      {/* Logo & Brand Name */}
      <Link to="/" className="nav-brand">
        <div className="brand-icon">
          📦
        </div>
        <div className="brand-title">
          <span className="brand-title-top">Blind Box</span>
          <span className="brand-title-bottom">Corner</span>
        </div>
      </Link>

      {/* Navigation Actions & Auth State */}
      <div className="nav-actions">
        <Link to="/create" className="btn-new-post">
          + New Post
        </Link>

        {user ? (
          <div className="user-auth-group">
            <span className="user-email-badge" title={user.email}>
              👤 {user.email}
            </span>
            <button onClick={handleLogout} className="btn-logout">
              Log Out
            </button>
          </div>
        ) : (
          <Link to="/auth" className="btn-auth-link">
            Log In / Sign Up
          </Link>
        )}
      </div>
    </nav>
  );
}