import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../client';

export default function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [flag, setFlag] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const flags = ['✨ Secret Found', '📦 Haul Showcase', '🔍 ISO / Trade', '🎀 Display Setup', '❓ Question'];

  // Submit handler for creating a new post
  async function handleSubmit(e) {
    e.preventDefault();

    if (!title || !flag || !secretKey) {
      alert('Please fill in all required fields, including your secret key.');
      return;
    }
    // Checking if the secretKey is present alongside title and flag
    console.log('Sending post data to Supabase...', { title, flag, content, image_url: imageUrl });
  
    if (!title || !flag) {
        alert('Please fill in the required fields.');
        return;
        }
        console.log('Sending post data to Supabase...', { title, flag, content, image_url: imageUrl });

        const { data, error } = await supabase
            .from('posts')
            .insert([{ 
                title, flag, content, image_url: imageUrl, secret_key: secretKey, upvotes: 0 }
             ])
             .select();
        
    if (error) {
      console.error('Supabase Insert Error:', error.message, error.details);
      alert((`Failed to create post: ${error.message}`));
    } else {
        console.log('Post created successfully:', data);
        navigate('/');
    }
 }

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto', padding: '20px 20px 60px' }}>
      <Link to="/" style={{ color: 'var(--purple-accent)', textDecoration: 'none', fontSize: '0.9rem' }}>‹ Back to corner</Link>
      
      <div style={{ textAlign: 'center', margin: '24px 0 32px' }}>
        <span style={{ color: 'var(--coral-accent)', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700 }}>Your Turn To Share</span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', margin: '8px 0' }}>Share Your Find</h1>
        <p style={{ color: 'var(--text-muted)' }}>Every pull has a story. Tell the corner what made you smile.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ background: '#FFF', padding: '36px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Post Title *</label>
          <input
            type="text"
            required
            placeholder="Give your post a fun title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-light)', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Category *</label>
          <select
            required
            value={flag}
            onChange={(e) => setFlag(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-light)', outline: 'none', background: '#FFF' }}
          >
            <option value="" disabled>What kind of post is this?</option>
            {flags.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Details <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
          <textarea
            rows="5"
            placeholder="Share more about your pull, haul, or question..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-light)', outline: 'none', fontFamily: 'inherit' }}
          />
        </div>

        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Image URL <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
          <input
            type="url"
            placeholder="Paste an image link (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-light)', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Secret Key * <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(used to edit or delete later)</span></label>
          <input
            type="password"
            required
            placeholder="Create a secret key or PIN..."
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-light)', outline: 'none' }}
          />
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px' }}>Create Post</button>
      </form>
    </div>
  );
}