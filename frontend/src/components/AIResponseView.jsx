import React from 'react';
import {
  FileText,
  CheckCircle2,
  Database,
  BookOpen,
  AlertTriangle,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function AIResponseView({ responseData }) {
  if (!responseData) return null;

  const { answer = '', evidence = [], sources = [], analysis = {} } = responseData;

  // Parse structured sections from the text answer
  const parseSections = (text) => {
    const sectionNames = [
      'Direct Answer',
      'Key Findings',
      'Comparison / Analytical Breakdown',
      'Evidence',
      'Sources',
      'Limitations',
    ];

    const parsed = {};
    let currentSection = 'Direct Answer';
    let currentContent = [];

    const lines = text.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      const matchedSec = sectionNames.find((s) => trimmed.toLowerCase() === s.toLowerCase());

      if (matchedSec) {
        if (currentContent.length > 0) {
          parsed[currentSection] = currentContent.join('\n').trim();
        }
        currentSection = matchedSec;
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    }

    if (currentContent.length > 0) {
      parsed[currentSection] = currentContent.join('\n').trim();
    }

    return parsed;
  };

  const sections = parseSections(answer);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Classification & Metadata Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          borderLeft: '4px solid var(--accent-cyan)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Sparkles size={17} style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Evidence-Grounded Synthesis
          </span>
          {analysis.question_type && (
            <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
              {analysis.question_type.replace(/_/g, ' ')}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          <span>Model: <code style={{ color: 'var(--text-secondary)' }}>{analysis.model || 'gpt-4o-mini'}</code></span>
          <span>•</span>
          <span>Deterministic Backend: <strong style={{ color: '#34d399' }}>Active</strong></span>
        </div>
      </div>

      {/* 1. DIRECT ANSWER Card */}
      {sections['Direct Answer'] && (
        <div
          className="glass-panel"
          style={{
            padding: '1.5rem',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            background: 'linear-gradient(180deg, rgba(13, 20, 36, 0.9) 0%, rgba(13, 20, 36, 0.7) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-cyan)' }} />
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-cyan-light)', margin: 0 }}>
              DIRECT ANSWER
            </h4>
          </div>
          <p style={{ fontSize: '1rem', lineHeight: '1.65', color: '#f8fafc', margin: 0, fontWeight: 400 }}>
            {sections['Direct Answer']}
          </p>
        </div>
      )}

      {/* 2. KEY FINDINGS Card */}
      {sections['Key Findings'] && (
        <div className="glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)' }} />
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-emerald-light)', margin: 0 }}>
              KEY FINDINGS
            </h4>
          </div>
          <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
            {sections['Key Findings']}
          </div>
        </div>
      )}

      {/* 3. COMPARISON / ANALYTICAL BREAKDOWN Card */}
      {sections['Comparison / Analytical Breakdown'] && (
        <div className="glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Layers size={16} style={{ color: 'var(--accent-indigo)' }} />
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#a5b4fc', margin: 0 }}>
              COMPARISON / ANALYTICAL BREAKDOWN
            </h4>
          </div>
          <div style={{ fontSize: '0.88rem', lineHeight: '1.6', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
            {sections['Comparison / Analytical Breakdown']}
          </div>
        </div>
      )}

      {/* 4. DATA EVIDENCE Card (Python/Pandas Pre-Calculated Numbers) */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', borderColor: 'rgba(16, 185, 129, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={16} style={{ color: 'var(--accent-emerald)' }} />
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-emerald-light)', margin: 0 }}>
              DATA EVIDENCE (DETERMINISTIC PYTHON/PANDAS)
            </h4>
          </div>
          <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>Authoritative</span>
        </div>
        
        {evidence && evidence.length > 0 ? (
          <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {evidence.map((item, idx) => (
              <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', margin: 0 }}>
            No specific numerical filter matched for this query.
          </p>
        )}
      </div>

      {/* 5. RESEARCH EVIDENCE Card (Retrieved Literature Chunks) */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', borderColor: 'rgba(99, 102, 241, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={16} style={{ color: 'var(--accent-indigo)' }} />
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#a5b4fc', margin: 0 }}>
              RESEARCH EVIDENCE (FAISS VECTOR RETRIEVAL)
            </h4>
          </div>
          <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>Grounding</span>
        </div>

        {sources && sources.filter((s) => s.chunk_id !== 'dataset_cleaned_data').length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {sources
              .filter((s) => s.chunk_id !== 'dataset_cleaned_data')
              .map((src, i) => (
                <div
                  key={i}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(10, 15, 28, 0.6)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <strong style={{ color: '#ffffff' }}>
                      {src.paper || src.section || src.source}
                    </strong>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                      {src.chunk_id}
                    </span>
                  </div>
                  {src.authors && (
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                      Authors/Year: {src.authors} {src.year ? `(${src.year})` : ''}
                    </div>
                  )}
                  {src.page_or_row && (
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>
                      Citation Location: {src.page_or_row}
                    </div>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', margin: 0 }}>
            Standard project calibration literature cited.
          </p>
        )}
      </div>

      {/* 6. SOURCES Card */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <FileText size={16} style={{ color: 'var(--accent-cyan)' }} />
          <h4 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-cyan-light)', margin: 0 }}>
            SOURCES
          </h4>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          <div>• <strong>Primary Dataset:</strong> Cleaned EV Adoption Dataset (10,304 observations across 6 countries and 4 vehicle categories)</div>
          <div>• <strong>Literature Reference:</strong> <code>Literature_Review_and_Metadata.docx</code> (Global & India Adoption Review)</div>
          <div>• <strong>Paper Comparison Matrix:</strong> <code>EV_Adoption_Research_Papers_Comparison.xlsx</code> (15 Peer-Reviewed Studies)</div>
        </div>
      </div>

      {/* 7. LIMITATIONS Card */}
      {sections['Limitations'] && (
        <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', borderColor: 'rgba(245, 158, 11, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <AlertTriangle size={16} style={{ color: 'var(--accent-amber)' }} />
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#fbbf24', margin: 0 }}>
              LIMITATIONS & METHODOLOGY BOUNDARIES
            </h4>
          </div>
          <p style={{ fontSize: '0.82rem', lineHeight: '1.5', color: 'var(--text-secondary)', margin: 0 }}>
            {sections['Limitations']}
          </p>
        </div>
      )}

    </div>
  );
}
