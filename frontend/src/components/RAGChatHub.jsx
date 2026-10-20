import React, { useState } from 'react';
import { Send, Sparkles, AlertCircle, FileText, CheckCircle2, ChevronRight, HelpCircle, Table, Layers, ArrowUpRight } from 'lucide-react';

const PRESET_QUERIES = [
  {
    title: 'Country Comparison',
    subtitle: 'India vs Germany EV Adoption',
    query: 'Compare EV adoption between India and Germany',
    icon: '⚖️',
    type: 'country_comparison'
  },
  {
    title: 'Trend Analysis',
    subtitle: 'China Historical Growth & YoY',
    query: 'How has EV adoption changed over time in China?',
    icon: '📈',
    type: 'trend_analysis'
  },
  {
    title: 'Statistical Correlations',
    subtitle: 'Charging vs Price vs Adoption',
    query: 'What is the correlation between charging stations and EV penetration?',
    icon: '🔬',
    type: 'statistical_questions'
  },
  {
    title: 'Factor Analysis',
    subtitle: 'Norway Policy Drivers & Subsidies',
    query: 'What factors and subsidies drive EV adoption in Norway?',
    icon: '⚡',
    type: 'factor_analysis'
  },
];

export default function RAGChatHub() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [activeResponseTab, setActiveResponseTab] = useState('formatted');

  const handleSubmit = async (queryToRun) => {
    const targetQ = queryToRun || question;
    if (!targetQ.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: targetQ.trim() }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message || 'Failed to communicate with RAG Backend.');
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (q) => {
    setQuestion(q);
    handleSubmit(q);
  };

  // Helper to parse sections from answer text
  const parseAnswerSections = (text) => {
    if (!text) return {};
    const sections = {};
    const keys = ['Direct Answer', 'Key Findings', 'Comparison / Analytical Breakdown', 'Evidence', 'Sources', 'Limitations'];

    let currentKey = 'Direct Answer';
    let currentLines = [];

    const lines = text.split('\n');
    for (const line of lines) {
      const matchedKey = keys.find(k => line.trim() === k);
      if (matchedKey) {
        if (currentLines.length > 0) {
          sections[currentKey] = currentLines.join('\n').trim();
        }
        currentKey = matchedKey;
        currentLines = [];
      } else {
        currentLines.push(line);
      }
    }
    if (currentLines.length > 0) {
      sections[currentKey] = currentLines.join('\n').trim();
    }
    return sections;
  };

  const parsedSections = response ? parseAnswerSections(response.answer) : {};

  return (
    <div style={{ maxWidth: '1400px', margin: '2rem auto', padding: '0 1.5rem' }}>
      
      {/* Preset Query Cards */}
      <div style={{ margin: '0 0 1.5rem 0' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.85rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="var(--accent-emerald)" />
          Preset RAG Intelligence Queries
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem'
        }}>
          {PRESET_QUERIES.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel"
              onClick={() => handlePresetClick(item.query)}
              style={{
                padding: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem',
                transition: 'var(--transition-fast)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(52, 211, 153, 0.4)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: '1.5rem', padding: '0.4rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)' }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.2rem 0', color: 'var(--text-main)' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                  {item.subtitle}
                </p>
              </div>
              <ArrowUpRight size={16} color="var(--text-dim)" />
            </div>
          ))}
        </div>
      </div>

      {/* Query Input Box */}
      <div className="glass-panel" style={{ padding: '1.25rem', margin: '0 0 1.5rem 0' }}>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <input
              id="rag-query-input"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask any question about EV sales, penetration %, charging infrastructure, policies, or paper findings..."
              style={{
                flex: 1,
                padding: '0.9rem 1.2rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                background: 'rgba(15, 23, 42, 0.6)',
                color: 'var(--text-main)',
                fontSize: '0.95rem',
                outline: 'none',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
                transition: 'var(--transition-fast)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-emerald)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
            />
            <button
              id="rag-submit-btn"
              type="submit"
              disabled={loading || !question.trim()}
              style={{
                padding: '0.9rem 1.5rem',
                borderRadius: '12px',
                border: 'none',
                background: loading || !question.trim() ? 'rgba(51, 65, 85, 0.5)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: loading || !question.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: loading || !question.trim() ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.3)',
                transition: 'var(--transition-fast)'
              }}
            >
              {loading ? (
                <>
                  <span className="status-dot status-dot-active" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Analyze
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div style={{
            margin: '1rem 0 0 0',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}
      </div>

      {/* Response Display Section */}
      {response && (
        <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', margin: '0 0 2rem 0' }}>
          
          {/* Metadata Banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            paddingBottom: '1rem',
            marginBottom: '1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{
                padding: '0.25rem 0.65rem',
                borderRadius: '9999px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase'
              }}>
                Query Type: {response.analysis?.question_type}
              </span>

              {response.analysis?.countries?.map((c, i) => (
                <span key={i} style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: '9999px',
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: '#38bdf8',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  Country: {c}
                </span>
              ))}

              <span style={{
                padding: '0.25rem 0.65rem',
                borderRadius: '9999px',
                background: response.analysis?.llm_used ? 'rgba(99, 102, 241, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                color: response.analysis?.llm_used ? '#818cf8' : '#fbbf24',
                border: `1px solid ${response.analysis?.llm_used ? 'rgba(99, 102, 241, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                {response.analysis?.llm_used ? `Generative Synthesized (${response.analysis?.model})` : 'Deterministic Evidence Engine'}
              </span>
            </div>

            {/* View Tabs */}
            <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(15, 23, 42, 0.6)', padding: '3px', borderRadius: '8px' }}>
              <button
                onClick={() => setActiveResponseTab('formatted')}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: activeResponseTab === 'formatted' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  color: activeResponseTab === 'formatted' ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                Structured Synthesis
              </button>

              <button
                onClick={() => setActiveResponseTab('evidence')}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: activeResponseTab === 'evidence' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  color: activeResponseTab === 'evidence' ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                Pre-Calculated Metrics ({response.evidence?.length || 0})
              </button>

              <button
                onClick={() => setActiveResponseTab('sources')}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: activeResponseTab === 'sources' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  color: activeResponseTab === 'sources' ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                FAISS RAG Sources ({response.sources?.length || 0})
              </button>
            </div>
          </div>

          {/* Tab 1: Formatted Answer */}
          {activeResponseTab === 'formatted' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Direct Answer */}
              {parsedSections['Direct Answer'] && (
                <div style={{
                  padding: '1.15rem',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}>
                  <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#34d399', margin: '0 0 0.5rem 0', fontWeight: 700 }}>
                    🎯 Direct Answer
                  </h4>
                  <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#f1f5f9', margin: 0 }}>
                    {parsedSections['Direct Answer']}
                  </p>
                </div>
              )}

              {/* Key Findings */}
              {parsedSections['Key Findings'] && (
                <div style={{
                  padding: '1.15rem',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#38bdf8', margin: '0 0 0.5rem 0', fontWeight: 700 }}>
                    💡 Key Findings
                  </h4>
                  <pre style={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    color: '#e2e8f0',
                    margin: 0
                  }}>
                    {parsedSections['Key Findings']}
                  </pre>
                </div>
              )}

              {/* Analytical Breakdown */}
              {parsedSections['Comparison / Analytical Breakdown'] && (
                <div style={{
                  padding: '1.15rem',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#818cf8', margin: '0 0 0.5rem 0', fontWeight: 700 }}>
                    📊 Analytical Breakdown & Literature Context
                  </h4>
                  <pre style={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    color: '#e2e8f0',
                    margin: 0
                  }}>
                    {parsedSections['Comparison / Analytical Breakdown']}
                  </pre>
                </div>
              )}

              {/* Limitations */}
              {parsedSections['Limitations'] && (
                <div style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.2)'
                }}>
                  <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fbbf24', margin: '0 0 0.35rem 0', fontWeight: 700 }}>
                    ⚠️ Dataset Boundaries & Safeguards
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: '1.5' }}>
                    {parsedSections['Limitations']}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Exact Backend Evidence */}
          {activeResponseTab === 'evidence' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399', margin: '0 0 0.5rem 0' }}>
                Pre-Calculated Python Metrics (Deterministic Pandas Output)
              </h4>
              {response.evidence?.map((item, idx) => (
                <div key={idx} style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(52, 211, 153, 0.2)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem'
                }}>
                  <CheckCircle2 size={16} color="#34d399" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.88rem', color: '#f1f5f9', fontFamily: 'var(--font-mono)' }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: FAISS RAG Sources */}
          {activeResponseTab === 'sources' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {response.sources?.map((src, idx) => (
                <div key={idx} style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}>
                  <div style={{ display: 'flex', itemsAlign: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
                      {src.source}
                    </span>
                    <span style={{
                      fontSize: '0.7rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {src.chunk_id}
                    </span>
                  </div>

                  {src.paper && (
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                      {src.paper}
                    </div>
                  )}

                  {src.authors && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Authors: {src.authors} ({src.year || 'N/A'})
                    </div>
                  )}

                  {src.section && (
                    <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                      Section: {src.section}
                    </div>
                  )}

                  {src.page_or_row && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 'auto' }}>
                      Location: {src.page_or_row}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
