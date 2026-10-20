import React from 'react';

export default function ChartCard({ title, subtitle, badge, action, children, style = {} }) {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-md)',
        minHeight: '340px',
        ...style,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, letterSpacing: '-0.01em', margin: 0, color: '#ffffff' }}>
              {title}
            </h3>
            {badge && (
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              {subtitle}
            </p>
          )}
        </div>

        {action && <div>{action}</div>}
      </div>

      {/* Chart Body */}
      <div style={{ flex: 1, width: '100%', minHeight: '260px', position: 'relative' }}>
        {children}
      </div>
    </div>
  );
}
