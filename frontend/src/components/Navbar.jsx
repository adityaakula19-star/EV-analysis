import React from 'react';
import { Menu, RefreshCw, Cpu, Database, CheckCircle2, AlertCircle } from 'lucide-react';

const PAGE_TITLES = {
  dashboard: {
    title: 'Executive Analytics Dashboard',
    subtitle: 'Evidence-grounded analysis of electric vehicle adoption across countries, categories and time.',
  },
  comparison: {
    title: 'Cross-Country Comparative Intelligence',
    subtitle: 'Direct deterministic head-to-head metrics, percentage differences, and trend trajectories.',
  },
  trends: {
    title: 'Longitudinal Adoption Trends (2024–2026)',
    subtitle: 'Multi-metric time-series trajectory tracking sales, market penetration, infrastructure, and pricing.',
  },
  categories: {
    title: 'Vehicle Category Disaggregation',
    subtitle: 'Comprehensive distribution across 2-Wheelers, 3-Wheelers, 4-Wheelers, and Electric Buses.',
  },
  factors: {
    title: 'Statistical Factor & Correlation Analysis',
    subtitle: 'Empirical associations between charging infrastructure, pricing, subsidies, and vehicle adoption.',
  },
  research: {
    title: 'Research & Literature Grounding (RAG)',
    subtitle: '15 systematically reviewed research papers and core academic literature review themes.',
  },
  assistant: {
    title: 'EV Intelligence Assistant',
    subtitle: 'Ask questions about EV adoption, countries, trends, categories and research evidence.',
  },
  about: {
    title: 'Academic Project Methodology & Architecture',
    subtitle: 'System architecture, deterministic calculations, FAISS vector retrieval, and LLM explanation layer.',
  },
};

export default function Navbar({ activePage, onRefresh, isRefreshing, healthData, onOpenMobileMenu }) {
  const current = PAGE_TITLES[activePage] || PAGE_TITLES.dashboard;
  const isHealthy = healthData?.status === 'ok';
  const recordCount = healthData?.cleaned_records_count || 10304;
  const llmEnabled = healthData?.llm_enabled;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        backgroundColor: 'rgba(7, 10, 18, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-glass)',
        padding: '0.85rem 1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}
    >
      {/* Left: Mobile Toggle & Page Headings */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
        <button
          onClick={onOpenMobileMenu}
          className="btn-secondary"
          style={{
            display: 'none',
            padding: '0.5rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-glass)',
            background: 'transparent',
            color: 'var(--text-main)',
            cursor: 'pointer',
          }}
          id="mobile-menu-btn"
        >
          <Menu size={20} />
        </button>

        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.01em', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {current.title}
          </h1>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {current.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Status Pills & Refresh */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
        {/* Dataset Status Pill */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.75rem',
            fontSize: '0.75rem',
            borderRadius: 'var(--radius-full)',
          }}
        >
          <Database size={13} style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ color: 'var(--text-secondary)' }}>{recordCount.toLocaleString()} Records</span>
        </div>

        {/* System Health Pill */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.75rem',
            fontSize: '0.75rem',
            borderRadius: 'var(--radius-full)',
          }}
        >
          <span className={`status-dot ${isHealthy ? 'status-dot-active' : 'status-dot-error'}`} />
          <span style={{ color: isHealthy ? '#34d399' : '#fda4af', fontWeight: 500 }}>
            {isHealthy ? 'API Connected' : 'Offline'}
          </span>
        </div>

        {/* LLM Status Pill */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.75rem',
            fontSize: '0.75rem',
            borderRadius: 'var(--radius-full)',
            color: 'var(--text-muted)',
          }}
        >
          <Cpu size={13} style={{ color: 'var(--accent-indigo)' }} />
          <span>RAG / FAISS</span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="btn btn-secondary"
          title="Refresh analytics data"
          style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          <span style={{ display: 'none' }} className="sm:inline">Sync</span>
        </button>
      </div>
    </header>
  );
}
