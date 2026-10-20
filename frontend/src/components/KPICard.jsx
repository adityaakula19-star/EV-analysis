import React from 'react';

export default function KPICard({ title, value, subtitle, icon: Icon, color = 'cyan', badge }) {
  const colorMap = {
    cyan: {
      border: 'rgba(6, 182, 212, 0.3)',
      glow: 'rgba(6, 182, 212, 0.15)',
      iconBg: 'rgba(6, 182, 212, 0.15)',
      text: '#38bdf8',
    },
    emerald: {
      border: 'rgba(16, 185, 129, 0.3)',
      glow: 'rgba(16, 185, 129, 0.15)',
      iconBg: 'rgba(16, 185, 129, 0.15)',
      text: '#34d399',
    },
    amber: {
      border: 'rgba(245, 158, 11, 0.3)',
      glow: 'rgba(245, 158, 11, 0.15)',
      iconBg: 'rgba(245, 158, 11, 0.15)',
      text: '#fbbf24',
    },
    indigo: {
      border: 'rgba(99, 102, 241, 0.3)',
      glow: 'rgba(99, 102, 241, 0.15)',
      iconBg: 'rgba(99, 102, 241, 0.15)',
      text: '#818cf8',
    },
    purple: {
      border: 'rgba(168, 85, 247, 0.3)',
      glow: 'rgba(168, 85, 247, 0.15)',
      iconBg: 'rgba(168, 85, 247, 0.15)',
      text: '#c084fc',
    },
    rose: {
      border: 'rgba(244, 63, 94, 0.3)',
      glow: 'rgba(244, 63, 94, 0.15)',
      iconBg: 'rgba(244, 63, 94, 0.15)',
      text: '#fb7185',
    },
  };

  const scheme = colorMap[color] || colorMap.cyan;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        border: `1px solid var(--border-glass)`,
        borderRadius: 'var(--radius-md)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = scheme.border;
        e.currentTarget.style.boxShadow = `0 10px 30px rgba(0,0,0,0.4), 0 0 20px ${scheme.glow}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-glass)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.35)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </span>
        {Icon && (
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: scheme.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: scheme.text,
            }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.35rem' }}>
        <span style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
          {value}
        </span>
        {badge && (
          <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.45rem', borderRadius: '4px', backgroundColor: scheme.iconBg, color: scheme.text, fontWeight: 600 }}>
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          {subtitle}
        </span>
      )}
    </div>
  );
}
