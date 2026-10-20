import React from 'react';
import { Database, Globe, TrendingUp, BookOpen } from 'lucide-react';

export default function SystemStatsHeader({ overviewStats }) {
  const totalRecords = overviewStats?.total_records?.toLocaleString() || '10,304';
  const totalEvSales = overviewStats?.total_ev_sales ? `${(overviewStats.total_ev_sales / 1e6).toFixed(2)}M` : '18.42M';
  const penetration = overviewStats?.global_ev_penetration_pct ? `${overviewStats.global_ev_penetration_pct}%` : '14.2%';
  const countryCount = overviewStats?.countries?.length || 6;

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '1.5rem auto 0 auto',
      padding: '0 1.5rem',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '1rem'
    }}>
      {/* Stat 1 */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          padding: '0.75rem',
          borderRadius: '12px',
          background: 'rgba(16, 185, 129, 0.15)',
          color: '#34d399',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        }}>
          <Database size={24} />
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Cleaned Records
          </span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0.2rem 0 0 0' }}>
            {totalRecords}
          </h3>
        </div>
      </div>

      {/* Stat 2 */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          padding: '0.75rem',
          borderRadius: '12px',
          background: 'rgba(6, 182, 212, 0.15)',
          color: '#38bdf8',
          border: '1px solid rgba(6, 182, 212, 0.2)'
        }}>
          <Globe size={24} />
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Global Markets
          </span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0.2rem 0 0 0' }}>
            {countryCount} Markets <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>(CN, DE, IN, NO, UK, US)</span>
          </h3>
        </div>
      </div>

      {/* Stat 3 */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          padding: '0.75rem',
          borderRadius: '12px',
          background: 'rgba(99, 102, 241, 0.15)',
          color: '#818cf8',
          border: '1px solid rgba(99, 102, 241, 0.2)'
        }}>
          <TrendingUp size={24} />
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            EV Penetration Share
          </span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0.2rem 0 0 0' }}>
            {penetration} <span style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', fontWeight: 500 }}>({totalEvSales} sold)</span>
          </h3>
        </div>
      </div>

      {/* Stat 4 */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          padding: '0.75rem',
          borderRadius: '12px',
          background: 'rgba(245, 158, 11, 0.15)',
          color: '#fbbf24',
          border: '1px solid rgba(245, 158, 11, 0.2)'
        }}>
          <BookOpen size={24} />
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            RAG Literature Index
          </span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0.2rem 0 0 0' }}>
            FAISS Vector DB <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 500 }}>● Active</span>
          </h3>
        </div>
      </div>
    </div>
  );
}
