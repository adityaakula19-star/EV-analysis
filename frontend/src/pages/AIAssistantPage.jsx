import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  Layers,
  HelpCircle,
  Database,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import api from '../services/api';
import AIResponseView from '../components/AIResponseView';
import ErrorAlert from '../components/ErrorAlert';
import { AISkeleton } from '../components/LoadingSkeleton';

const SUGGESTED_QUESTIONS = [
  {
    title: 'Country Comparison',
    question: 'Compare EV adoption between India and Germany',
    tag: 'Comparison',
  },
  {
    title: 'Market Penetration Leader',
    question: 'Which country has the highest EV penetration?',
    tag: 'Rankings',
  },
  {
    title: 'India Adoption Trajectory',
    question: 'How has India\'s EV adoption changed over time?',
    tag: 'Trends',
  },
  {
    title: 'India Segment Leadership',
    question: 'Which vehicle category dominates India?',
    tag: 'Categories',
  },
  {
    title: 'Macro Determinants',
    question: 'What factors are associated with EV adoption?',
    tag: 'Statistical Factors',
  },
  {
    title: 'Evidence-Grounded Policy',
    question: 'Explain India\'s EV adoption using research evidence.',
    tag: 'Literature RAG',
  },
];

export default function AIAssistantPage() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(''); // Stage 1, 2, 3
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (qToSubmit) => {
    const q = (qToSubmit || question).trim();
    if (!q || loading) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    // Multi-stage UX animations required by specification
    setLoadingStage('Analyzing EV dataset...');
    const stageTimer1 = setTimeout(() => {
      setLoadingStage('Retrieving research evidence...');
    }, 600);
    const stageTimer2 = setTimeout(() => {
      setLoadingStage('Generating evidence-grounded explanation...');
    }, 1300);

    try {
      const data = await api.sendChatMessage(q);
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      setResponse(data);
    } catch (err) {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingStage('');
    }
  };

  const handleSuggestedClick = (q) => {
    setQuestion(q);
    handleSubmit(q);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', padding: '1.5rem 2rem' }}>
      
      {/* Assistant Header Box */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          borderLeft: '4px solid var(--accent-cyan)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(99, 102, 241, 0.25) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.2)',
              flexShrink: 0,
            }}
          >
            <Bot size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                EV Intelligence Assistant
              </h2>
              <span className="badge badge-cyan">Evidence-Grounded RAG</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Ask questions about EV adoption, countries, trends, categories and research evidence.
            </p>
          </div>
        </div>

        {/* Methodology Pill */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div className="badge badge-emerald" style={{ padding: '0.45rem 0.85rem' }}>
            <Database size={12} />
            <span>Pandas Computed</span>
          </div>
          <div className="badge badge-indigo" style={{ padding: '0.45rem 0.85rem' }}>
            <BookOpen size={12} />
            <span>FAISS Grounded</span>
          </div>
        </div>
      </div>

      {/* Suggested Questions Grid */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Sparkles size={16} style={{ color: 'var(--accent-cyan)' }} />
          <h3 style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Suggested Analytical Questions
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
          {SUGGESTED_QUESTIONS.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestedClick(sq.question)}
              disabled={loading}
              className="glass-panel"
              style={{
                padding: '0.85rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '0.35rem',
                textAlign: 'left',
                cursor: 'pointer',
                border: '1px solid var(--border-glass)',
                backgroundColor: 'rgba(10, 15, 28, 0.5)',
                transition: 'var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.35)';
                e.currentTarget.style.backgroundColor = 'rgba(22, 33, 58, 0.7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-glass)';
                e.currentTarget.style.backgroundColor = 'rgba(10, 15, 28, 0.5)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600 }}>{sq.tag}</span>
                <ArrowRight size={13} style={{ color: 'var(--accent-cyan)' }} />
              </div>
              <div style={{ fontSize: '0.86rem', fontWeight: 500, color: '#f8fafc' }}>
                {sq.question}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Query Input Box */}
      <section className="glass-panel" style={{ padding: '1rem', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question about EV adoption, country comparisons, or literature..."
            disabled={loading}
            className="text-input"
            style={{
              flex: 1,
              padding: '0.85rem 1.15rem',
              fontSize: '0.95rem',
              borderRadius: 'var(--radius-sm)',
            }}
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="btn btn-primary"
            style={{
              padding: '0.85rem 1.5rem',
              fontSize: '0.95rem',
              opacity: loading || !question.trim() ? 0.6 : 1,
            }}
          >
            {loading ? (
              <RefreshCw size={17} className="animate-spin" />
            ) : (
              <Send size={17} />
            )}
            <span>Analyze</span>
          </button>
        </form>
      </section>

      {/* Loading State Animation with Progress Stages */}
      {loading && (
        <div
          className="glass-panel"
          style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            textAlign: 'center',
          }}
        >
          <div style={{ position: 'relative', width: '48px', height: '48px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: '3px solid rgba(6, 182, 212, 0.2)',
                borderTopColor: 'var(--accent-cyan)',
                animation: 'spin 1s linear infinite',
              }}
            />
          </div>

          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#38bdf8', marginBottom: '0.25rem' }}>
              {loadingStage || 'Processing Query...'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              Deterministic Python calculations + FAISS semantic vector search in progress
            </div>
          </div>

          <div style={{ width: '100%', maxWidth: '600px', marginTop: '0.5rem' }}>
            <AISkeleton />
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && <ErrorAlert message={error} onRetry={() => handleSubmit()} />}

      {/* Structured AI Response View */}
      {response && <AIResponseView responseData={response} />}

    </div>
  );
}
