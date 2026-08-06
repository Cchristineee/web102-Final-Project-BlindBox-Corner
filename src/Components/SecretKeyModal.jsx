import React, { useState } from 'react';

export default function SecretKeyModal({ isOpen, title, onClose, onSubmit }) {
  const [keyInput, setKeyInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(keyInput);
    setKeyInput('');
  };

  const handleCancel = () => {
    setKeyInput('');
    onClose();
  };
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#FFF',
        borderRadius: 'var(--radius-lg, 24px)',
        padding: '32px',
        maxWidth: '420px',
        width: '90%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
        border: '1px solid var(--border-light, #F0E6EE)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔐</div>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
          Secret Key Required
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
          {title || 'Enter your secret key to authorize this action:'}
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            autoFocus
            placeholder="Enter key or PIN..."
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '999px',
              border: '1px solid var(--border-light, #E2D8E4)',
              outline: 'none',
              marginBottom: '20px',
              boxSizing: 'border-box',
              textAlign: 'center',
              fontSize: '1rem'
            }}
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={handleCancel}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '999px',
                border: '1px solid var(--border-light, #E2D8E4)',
                background: '#FFF',
                color: 'var(--text-muted)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 1, padding: '10px' }}
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}