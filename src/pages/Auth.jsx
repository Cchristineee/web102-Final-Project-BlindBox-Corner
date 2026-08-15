import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../client';

export default function Auth() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleAuth(e) {
        e.preventDefault();
        setLoading(true);

        if (isSignUp) {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) alert(error.message);
            else alert('Account created! You can now log in.');
            } else {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) alert(error.message);
            else navigate('/');
            }
            setLoading(false);
        }
}

return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '30px', background: '#FFF', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
      <h2 style={{ fontFamily: 'var(--font-serif)', textAlign: 'center' }}>
        {isSignUp ? 'Create an Account ✨' : 'Welcome Back 🎀'}
      </h2>
      <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '20px' }}>
        <input
          type="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '12px 16px', borderRadius: '999px', border: '1px solid var(--border-light)', outline: 'none' }}
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '12px 16px', borderRadius: '999px', border: '1px solid var(--border-light)', outline: 'none' }}
        />
        <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '12px' }}>
          {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Log In'}
        </button>
      </form>
      <p 
        onClick={() => setIsSignUp(!isSignUp)} 
        style={{ textAlign: 'center', marginTop: '16px', color: 'var(--purple-accent)', cursor: 'pointer', fontSize: '0.85rem' }}
      >
        {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
      </p>
    </div>
); 