import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../client';

// EditPost component for editing an existing post
export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [flag, setFlag] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);

  const flags = ['✨ Secret Found', '📦 Haul Showcase', '🔍 ISO / Trade', '🎀 Display Setup', '❓ Question'];

  useEffect(() => {
    fetchPost();
  }, [id]);

  async function fetchPost() {
    setLoading(true);
    const { data: postData, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching post:', error.message);
    } else if (postData) {
      setTitle(postData.title || '');
      setFlag(postData.flag || '');
      setContent(postData.content || '');
      setImageUrl(postData.image_url || '');
    }
    setLoading(false);
  }

  // Handling update to post 
  async function handleUpdate(e) {
    e.preventDefault();

    const { error } = await supabase
      .from('posts')
      .update({
        title,
        flag,
        content,
        image_url: imageUrl,
      })
      .eq('id', id);

    if (error) {
      alert(`Error updating post: ${error.message}`);
    } else {
      navigate(`/post/${id}`);
    }
  }

  // Handling deletion of post
  async function handleDelete() {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      alert(`Error deleting post: ${error.message}`);
    } else {
      navigate('/');
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '60px' }}>Loading post details... ✨</div>;

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto', padding: '20px 20px 60px' }}>
      <Link to={`/post/${id}`} style={{ color: 'var(--purple-accent)', textDecoration: 'none', fontSize: '0.9rem' }}>
        ‹ Back to post
      </Link>

      <div style={{ textAlign: 'center', margin: '24px 0 32px' }}>
        <span style={{ color: 'var(--coral-accent)', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700 }}>
          Update Your Story
        </span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', margin: '8px 0' }}>
          Edit Post
        </h1>
      </div>

      <form onSubmit={handleUpdate} style={{ background: '#FFF', padding: '36px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Post Title *</label>
          <input
            type="text"
            required
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
            {flags.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Details</label>
          <textarea
            rows="5"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-light)', outline: 'none', fontFamily: 'inherit' }}
          />
        </div>

        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Image URL</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-light)', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" className="btn-primary" style={{ flex: 1, padding: '14px' }}>
            Update Post
          </button>
          <button
            type="button"
            onClick={handleDelete}
            style={{
              background: '#FFF0F3',
              color: 'var(--coral-accent)',
              border: '1px solid #FFD1D7',
              borderRadius: 'var(--radius-pill)',
              padding: '14px 24px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            🗑️ Delete
          </button>
        </div>
      </form>
    </div>
  );
}