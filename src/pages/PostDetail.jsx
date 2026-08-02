import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../client';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPostAndComments();
  }, [id]);

  async function fetchPostAndComments() {
    setLoading(true);

    // Fetching the post data
    const { data: postData, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching post:', error.message);
    } else {
      setPost(postData);
    }

    // Fetching the comments for the post
    const { data: commentsData } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true });

    setComments(commentsData || []);
    setLoading(false);
  }

  // Handling the upvote functionality
  async function handleUpvote() {
    const updatedCount = (post.upvotes || 0) + 1;
    setPost({ ...post, upvotes: updatedCount });

    await supabase
      .from('posts')
      .update({ upvotes: updatedCount })
      .eq('id', id);
  }

  // Adding new comment to the post
  async function handleAddComment(e) {
    e.preventDefault();
    if (!newComment.trim()) return;

    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id: id, text: newComment.trim() }])
      .select();

    if (!error && data) {
      setComments([...comments, data[0]]);
      setNewComment('');
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '60px' }}>Unboxing post details... ✨</div>;
  if (!post) return <div style={{ textAlign: 'center', padding: '60px' }}>Post not found!</div>;

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto', padding: '20px 20px 60px' }}>
      {/* Breadcrumb Navigation */}
      <div style={{ marginBottom: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <Link to="/" style={{ color: 'var(--purple-accent)', textDecoration: 'none' }}>Home</Link>
        {post.flag && <span> › {post.flag}</span>}
      </div>

      {/* Main Post Container Card */}
      <div style={{ background: '#FFF', padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
        {/* Flag Badge & Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          {post.flag && <span className="flag-badge">{post.flag}</span>}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={handleUpvote} 
              style={{ background: '#FFF0F3', color: 'var(--coral-accent)', border: 'none', padding: '8px 16px', borderRadius: '999px', fontWeight: '600', cursor: 'pointer' }}
            >
              ♡ {post.upvotes || 0}
            </button>
          </div>
        </div>

        {/* Title & Metadata */}
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.25rem', margin: '0 0 12px 0' }}>{post.title}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
          Posted on {new Date(post.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
        </p>
        
        {/* Img Display */}
        {post.image_url && (
          <div style={{ marginBottom: '24px', textAlign: 'center', background: 'linear-gradient(135deg, #FFF0F3 0%, #F3E8FF 100%)', padding: '20px', borderRadius: '16px' }}>
            <img 
              src={post.image_url} 
              alt={post.title} 
              style={{ maxWidth: '100%', maxHeight: '450px', borderRadius: '12px', objectFit: 'contain' }}
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
          </div>
        )}

        {/* Content Body Text */}
        {post.content && (
          <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--text-primary)', marginBottom: '32px' }}>
            {post.content}
          </p>
        )}

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '32px 0' }} />

        {/* Comments Section */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '16px' }}>
            Comments ({comments.length})
          </h3>

          <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="Leave a comment (e.g., 'Awesome pull!')..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{ flex: 1, padding: '12px 16px', borderRadius: '999px', border: '1px solid var(--border-light)', outline: 'none' }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '10px 20px' }}>Post</button>
          </form>

          {/* Comments List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {comments.map((comment) => (
              <div key={comment.id} style={{ background: '#FFFBF5', padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '0.95rem' }}>{comment.text}</p>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}