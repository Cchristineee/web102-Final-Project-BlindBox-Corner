import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../client';

export default function HomeFeed() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'top'
  const [selectedFlag, setSelectedFlag] = useState('All');

  const flags = ['All', '✨ Secret Found', '📦 Haul Showcase', '🔍 ISO / Trade', '🎀 Display Setup', '❓ Question'];

  // 1. Fetch posts on mount & when sortBy changes
  useEffect(() => {
    fetchPosts();
    testConnection(); 
  }, [sortBy]);

  // Testing Supabase connection helper function
  async function testConnection() {
    const { data, error } = await supabase.from('posts').select('*');
    if (error) {
      console.error('Error connecting to Supabase:', error.message);
    } else {
      console.log('Successfully connected to Supabase! Posts:', data);
    }
  }

  async function fetchPosts() {
    let query = supabase.from('posts').select('*');
    if (sortBy === 'latest') {
      query = query.order('created_at', { ascending: false });
    } else {
      query = query.order('upvotes', { ascending: false });
    }
    const { data } = await query;
    setPosts(data || []);
  }

  // Filtering logic for search and flag selection
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase());
    const matchesFlag = selectedFlag === 'All' || post.flag === selectedFlag;
    return matchesSearch && matchesFlag;
  });

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px 60px' }}>
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-sub">The Happy Little Collector Club</div>
        <h1 className="hero-title">Open a box.<br /><span>Find your new favorite.</span></h1>
        <p className="hero-desc">Pulls, trades, shelf tours, and the tiny joys in between. Come see what everyone found today.</p>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="🔍  Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '16px 24px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--border-light)',
            outline: 'none',
            fontSize: '1rem'
          }}
        />
      </div>

      {/* Controls Bar: Sorting & Post Count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setSortBy('latest')}
            className={sortBy === 'latest' ? 'btn-primary' : 'btn-secondary'}
            style={sortBy !== 'latest' ? { background: '#FFF', border: '1px solid #EEE', borderRadius: '999px', padding: '8px 16px', cursor: 'pointer' } : { padding: '8px 16px' }}
          >
            Latest
          </button>
          <button
            onClick={() => setSortBy('top')}
            className={sortBy === 'top' ? 'btn-primary' : 'btn-secondary'}
            style={sortBy !== 'top' ? { background: '#FFF', border: '1px solid #EEE', borderRadius: '999px', padding: '8px 16px', cursor: 'pointer' } : { padding: '8px 16px' }}
          >
            Top Voted
          </button>
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>✨ {filteredPosts.length} cozy posts</span>
      </div>

      {/* Filter Tag Pills */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
        {flags.map(flag => (
          <button
            key={flag}
            onClick={() => setSelectedFlag(flag)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill)',
              border: selectedFlag === flag ? '1px solid var(--purple-accent)' : '1px solid var(--border-light)',
              background: selectedFlag === flag ? 'var(--purple-light)' : '#FFF',
              color: selectedFlag === flag ? 'var(--purple-accent)' : 'var(--text-primary)',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            {flag}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div>
        {filteredPosts.map((post, index) => (
          <Link to={`/post/${post.id}`} key={post.id} className="feed-card">
            <div className="card-left">
              <span className="post-number">0{index + 1}</span>
              <div className="post-meta">
                {post.flag && <span className="flag-badge">{post.flag}</span>}
                <h3 className="post-title-text">{post.title}</h3>
                <span className="post-timestamp">{new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
            <div className="upvote-pill">
              ♡ {post.upvotes}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}