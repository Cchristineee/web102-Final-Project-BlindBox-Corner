import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../client';
import SecretKeyModal from '../components/SecretKeyModal';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentSecretKey, setCommentSecretKey] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State Management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'DELETE_POST' or 'DELETE_COMMENT'
  const [targetComment, setTargetComment] = useState(null); // stores { id, secret_key }

  useEffect(() => {
    fetchPostAndComments();
  }, [id]);

  async function fetchPostAndComments() {
    setLoading(true);

    // Fetching post data
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

    // Fetching comments for the post
    const { data: commentsData } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true });

    setComments(commentsData || []);
    setLoading(false);
  }

  // Open modal for post deletion
  function triggerPostDelete() {
    setModalAction('DELETE_POST');
    setIsModalOpen(true);
  }

  // Open modal for comment deletion
  function triggerCommentDelete(commentId, originalKey) {
    setTargetComment({ id: commentId, secret_key: originalKey });
    setModalAction('DELETE_COMMENT');
    setIsModalOpen(true);
  }

  // Process key input from SecretKeyModal
  async function handleModalSubmit(enteredKey) {
    setIsModalOpen(false);

    if (modalAction === 'DELETE_POST') {
      if (enteredKey !== post.secret_key) {
        alert('Incorrect secret key! Deletion cancelled.');
        return;
      }
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) {
        alert(`Error deleting post: ${error.message}`);
      } else {
        navigate('/');
      }
    } else if (modalAction === 'DELETE_COMMENT') {
      if (enteredKey !== targetComment.secret_key) {
        alert('Incorrect secret key! You can only delete your own comments.');
        return;
      }
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', targetComment.id);

      if (error) {
        alert(`Error deleting comment: ${error.message}`);
      } else {
        setComments(comments.filter((c) => c.id !== targetComment.id));
      }
    }
  }

  // Handling upvotes
  async function handleUpvote() {
    const updatedCount = (post.upvotes || 0) + 1;
    setPost({ ...post, upvotes: updatedCount });

    await supabase
      .from('posts')
      .update({ upvotes: updatedCount })
      .eq('id', id);
  }

  // Adding new comment with secret key
  async function handleAddComment(e) {
    e.preventDefault();
    if (!newComment.trim() || !commentSecretKey) {
      alert('Please enter a comment and a secret key.');
      return;
    }

    const { data, error } = await supabase
      .from('comments')
      .insert([{ 
        post_id: id, 
        text: newComment.trim(),
        secret_key: commentSecretKey 
      }])
      .select();

    if (!error && data) {
      setComments([...comments, data[0]]);
      setNewComment('');
      setCommentSecretKey('');
    } else if (error) {
      alert(`Error adding comment: ${error.message}`);
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '60px' }}>Unboxing post details... ✨</div>;
  if (!post) return <div style={{ textAlign: 'center', padding: '60px' }}>Post not found!</div>;

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto', padding: '20px 20px 60px' }}>
      {/* Secret Key Custom Modal Component */}
      <SecretKeyModal
        isOpen={isModalOpen}
        title={
          modalAction === 'DELETE_POST'
            ? 'Enter your secret key to delete this post:'
            : 'Enter your secret key to delete your comment:'
        }
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      {/* Breadcrumb Navigation */}
      <div style={{ marginBottom: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <Link to="/" style={{ color: 'var(--purple-accent)', textDecoration: 'none' }}>Home</Link>
        {post.flag && <span> › {post.flag}</span>}
      </div>

      {/* Main Post Container Card */}
      <div style={{ background: '#FFF', padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
        {/* Flag Badge & Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          {post.flag ? <span className="flag-badge">{post.flag}</span> : <div />}
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Edit Icon Button */}
            <Link 
              to={`/edit/${post.id}`} 
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                background: '#FFF',
                color: 'var(--purple-accent)',
                fontSize: '0.9rem'
              }}
              title="Edit Post"
            >
              ✏️
            </Link>

            {/* Delete Icon Button */}
            <button
              onClick={triggerPostDelete}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid #FFD1D7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#FFF0F3',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
              title="Delete Post"
            >
              🗑️
            </button>

            {/* Upvote Button */}
            <button 
              onClick={handleUpvote} 
              style={{ 
                background: '#FFF0F3', 
                color: 'var(--coral-accent)', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '999px', 
                fontWeight: '600', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
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
        
        {/* Image Display */}
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

          {/* Form with Comment Text & Secret Key */}
          <form onSubmit={handleAddComment} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Leave a comment (e.g., 'Awesome pull!')..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{ flex: 2, padding: '12px 16px', borderRadius: '999px', border: '1px solid var(--border-light)', outline: 'none' }}
              />
              <input
                type="password"
                placeholder="Secret key..."
                value={commentSecretKey}
                onChange={(e) => setCommentSecretKey(e.target.value)}
                style={{ flex: 1, padding: '12px 16px', borderRadius: '999px', border: '1px solid var(--border-light)', outline: 'none' }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>Post</button>
            </div>
          </form>

          {/* Comments List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {comments.map((comment) => (
              <div 
                key={comment.id} 
                style={{ 
                  background: '#FFFBF5', 
                  padding: '14px 18px', 
                  borderRadius: '12px', 
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.95rem' }}>{comment.text}</p>
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </small>
                </div>

                {/* Individual Comment Delete Button */}
                <button
                  onClick={() => triggerCommentDelete(comment.id, comment.secret_key)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    opacity: 0.6
                  }}
                  title="Delete Comment"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}