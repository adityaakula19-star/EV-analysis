import React from 'react';

export function KPISkeleton() {
  return (
    <div className="glass-panel" style={{ padding: '1.25rem', height: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeleton" style={{ width: '90px', height: '14px' }} />
        <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
      </div>
      <div className="skeleton" style={{ width: '130px', height: '30px' }} />
      <div className="skeleton" style={{ width: '110px', height: '12px' }} />
    </div>
  );
}

export function ChartSkeleton({ height = '340px' }) {
  return (
    <div className="glass-panel" style={{ padding: '1.25rem', height, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div className="skeleton" style={{ width: '180px', height: '18px' }} />
          <div className="skeleton" style={{ width: '260px', height: '12px' }} />
        </div>
        <div className="skeleton" style={{ width: '80px', height: '24px', borderRadius: '12px' }} />
      </div>
      <div className="skeleton" style={{ flex: 1, width: '100%', borderRadius: 'var(--radius-sm)' }} />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="glass-panel" style={{ padding: '1.25rem' }}>
      <div className="skeleton" style={{ width: '100%', height: '36px', marginBottom: '0.75rem' }} />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton" style={{ width: '100%', height: '44px', marginBottom: '0.5rem' }} />
      ))}
    </div>
  );
}

export function AISkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div className="skeleton" style={{ width: '140px', height: '16px' }} />
        <div className="skeleton" style={{ width: '100%', height: '18px' }} />
        <div className="skeleton" style={{ width: '92%', height: '18px' }} />
        <div className="skeleton" style={{ width: '65%', height: '18px' }} />
      </div>
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div className="skeleton" style={{ width: '120px', height: '16px' }} />
        <div className="skeleton" style={{ width: '85%', height: '16px' }} />
        <div className="skeleton" style={{ width: '88%', height: '16px' }} />
        <div className="skeleton" style={{ width: '70%', height: '16px' }} />
      </div>
    </div>
  );
}

export default {
  KPISkeleton,
  ChartSkeleton,
  TableSkeleton,
  AISkeleton,
};
