import React from 'react';
import { AlertCircle, RefreshCw, Terminal } from 'lucide-react';

export default function ErrorAlert({ message, onRetry }) {
  const isBackendDown = message && message.includes('http://localhost:8000');

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.25rem 1.5rem',
        border: '1px solid rgba(244, 63, 94, 0.35)',
        backgroundColor: 'rgba(244, 63, 94, 0.08)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        margin: '1rem 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'rgba(244, 63, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fb7185',
              flexShrink: 0,
            }}
          >
            <AlertCircle size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#fda4af' }}>
              Connection Alert
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#fecdd3' }}>
              {message || 'An unexpected error occurred while communicating with the analytics API.'}
            </p>
          </div>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem', borderColor: 'rgba(244, 63, 94, 0.3)' }}
          >
            <RefreshCw size={14} />
            <span>Retry Connection</span>
          </button>
        )}
      </div>

      {isBackendDown && (
        <div
          style={{
            backgroundColor: 'rgba(10, 15, 28, 0.85)',
            border: '1px solid var(--border-glass)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Terminal size={14} style={{ color: 'var(--accent-cyan)' }} />
          <span>Launch backend: <code>py -m uvicorn app.main:app --reload --port 8000</code></span>
        </div>
      )}
    </div>
  );
}
