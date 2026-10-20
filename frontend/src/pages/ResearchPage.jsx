import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  FileText,
  Search,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Award,
} from 'lucide-react';
import api from '../services/api';
import ErrorAlert from '../components/ErrorAlert';
import { TableSkeleton } from '../components/LoadingSkeleton';

export default function ResearchPage() {
  const [researchData, setResearchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPaper, setExpandedPaper] = useState(null);
  const [activeTheme, setActiveTheme] = useState(0);

  useEffect(() => {
    const fetchResearch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getResearch();
        setResearchData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResearch();
  }, []);

  const papers = researchData?.papers || [];
  const themes = researchData?.themes || [];

  // Filter papers by search
  const filteredPapers = useMemo(() => {
    if (!searchQuery.trim()) return papers;
    const q = searchQuery.toLowerCase();
    return papers.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.authors_year.toLowerCase().includes(q) ||
        p.pros.toLowerCase().includes(q)
    );
  }, [papers, searchQuery]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem 2rem' }}>
        <TableSkeleton rows={6} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', padding: '1.5rem 2rem' }}>
      
      {/* Research Grounding Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#a5b4fc',
              flexShrink: 0,
            }}
          >
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                Academic Literature & RAG Evidence Grounding
              </h2>
              <span className="badge badge-indigo">FAISS Indexed</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              AI explanations are strictly grounded in 15 peer-reviewed scientific studies and project literature review metadata.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div className="badge badge-cyan" style={{ padding: '0.45rem 0.85rem' }}>
            15 Research Papers
          </div>
          <div className="badge badge-emerald" style={{ padding: '0.45rem 0.85rem' }}>
            5 Core Themes
          </div>
        </div>
      </div>

      {error && <ErrorAlert message={error} />}

      {/* Core Literature Themes Tabs */}
      <section className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Sparkles size={18} style={{ color: 'var(--accent-cyan)' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
            Core Literature Themes (Literature_Review_and_Metadata.docx)
          </h3>
        </div>

        {/* Theme Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
          {themes.map((th, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTheme(idx)}
              className={activeTheme === idx ? 'btn btn-primary' : 'btn btn-secondary'}
              style={{
                fontSize: '0.8rem',
                whiteSpace: 'nowrap',
                padding: '0.45rem 0.9rem',
              }}
            >
              {th.theme.replace(/^\d+(\.\d+)*\s*/, '')}
            </button>
          ))}
        </div>

        {/* Active Theme Content */}
        {themes[activeTheme] && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: 'rgba(10, 15, 28, 0.7)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              lineHeight: '1.65',
              color: 'var(--text-secondary)',
              whiteSpace: 'pre-line',
            }}
          >
            <h4 style={{ color: 'var(--accent-cyan-light)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              {themes[activeTheme].theme}
            </h4>
            {themes[activeTheme].content}
          </div>
        )}
      </section>

      {/* 15 Research Papers Comparison Matrix */}
      <section className="glass-panel" style={{ padding: '1.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
              Peer-Reviewed EV Research Papers Comparison (15 Studies)
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Systematic evaluation of methodologies, strengths, and research gaps from <code>EV_Adoption_Research_Papers_Comparison.xlsx</code>
            </p>
          </div>

          {/* Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
              />
              <input
                type="text"
                placeholder="Search paper title, author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-input"
                style={{ paddingLeft: '32px', width: '260px' }}
              />
            </div>
          </div>
        </div>

        {/* Papers List / Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredPapers.map((paper) => {
            const isExpanded = expandedPaper === paper.id;
            return (
              <div
                key={paper.id}
                style={{
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isExpanded ? 'rgba(255,255,255,0.03)' : 'rgba(10, 15, 28, 0.5)',
                  overflow: 'hidden',
                  transition: 'var(--transition-fast)',
                }}
              >
                <div
                  onClick={() => setExpandedPaper(isExpanded ? null : paper.id)}
                  style={{
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(6, 182, 212, 0.15)',
                        color: 'var(--accent-cyan)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      #{paper.id}
                    </span>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 600, color: '#ffffff' }}>
                        {paper.title}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {paper.authors_year}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="badge badge-gray" style={{ fontSize: '0.65rem' }}>Paper #{paper.id}</span>
                    {isExpanded ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                  </div>
                </div>

                {isExpanded && (
                  <div
                    style={{
                      padding: '1.25rem 1.5rem',
                      borderTop: '1px solid var(--border-glass)',
                      backgroundColor: 'rgba(5, 8, 16, 0.6)',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '1.25rem',
                      fontSize: '0.85rem',
                    }}
                  >
                    <div>
                      <strong style={{ color: '#34d399', display: 'block', marginBottom: '0.35rem' }}>
                        Pros & Methodological Strengths:
                      </strong>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        {paper.pros || 'Not specified in matrix.'}
                      </p>
                    </div>

                    <div>
                      <strong style={{ color: '#fda4af', display: 'block', marginBottom: '0.35rem' }}>
                        Research Gaps & What's Missing (Cons):
                      </strong>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        {paper.cons || 'Not specified in matrix.'}
                      </p>
                    </div>

                    <div>
                      <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '0.35rem' }}>
                        Future Work & What Could Be Done Better:
                      </strong>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        {paper.recommendations || 'Not specified in matrix.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
