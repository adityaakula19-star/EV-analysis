import React from 'react';
import {
  Info,
  ShieldCheck,
  Cpu,
  Database,
  Layers,
  Sparkles,
  GitCompare,
  TrendingUp,
  BookOpen,
  CheckCircle2,
  Workflow,
} from 'lucide-react';

export default function AboutPage() {
  const innovations = [
    {
      title: 'Cross-Country Benchmark Comparison',
      desc: 'Standardized head-to-head metrics across 6 key global EV markets (India, China, USA, Norway, Germany, UK).',
      icon: GitCompare,
    },
    {
      title: 'Vehicle Category Disaggregation',
      desc: 'Granular analysis separating 2-Wheelers, 3-Wheelers, 4-Wheelers, and Electric Buses, capturing regional dynamics.',
      icon: Layers,
    },
    {
      title: 'Longitudinal Time-Series (2024–2026)',
      desc: 'Monthly tracking of EV sales ramp-up, market share penetration, infrastructure growth, and pricing trajectories.',
      icon: TrendingUp,
    },
    {
      title: 'Empirical Statistical Analysis',
      desc: 'Rigorous calculation of Pearson correlation coefficients examining infrastructure, pricing, and fiscal subsidies.',
      icon: Cpu,
    },
    {
      title: 'RAG-Based Research Evidence',
      desc: 'Vector retrieval over 15 peer-reviewed scientific papers and literature review metadata using FAISS indexing.',
      icon: BookOpen,
    },
    {
      title: 'Evidence-Grounded LLM Layer',
      desc: 'Strict prohibition of LLM arithmetic; natural language synthesis is strictly tethered to pre-computed backend metrics.',
      icon: Sparkles,
    },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', padding: '1.5rem 2rem' }}>
      
      {/* Hero Header */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(99, 102, 241, 0.12) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
        }}
      >
        <div style={{ maxWidth: '900px' }}>
          <span className="badge badge-cyan" style={{ marginBottom: '0.65rem' }}>Academic Research Project</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            EV Adoption Intelligence System
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
            An evidence-grounded academic platform harmonizing quantitative electric vehicle data, empirical statistical correlation, 
            FAISS-driven literature retrieval, and natural language synthesis.
          </p>
        </div>
      </div>

      {/* Core Architectural Principle Banner (MANDATORY REQUIREMENT) */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(13, 20, 36, 0.8) 100%)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#34d399',
            flexShrink: 0,
          }}
        >
          <ShieldCheck size={24} />
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Authoritative Architectural Principle
          </h4>
          <p style={{ margin: 0, fontSize: '0.92rem', color: '#f8fafc', fontWeight: 500, marginTop: '0.2rem' }}>
            "The LLM is used strictly as an explanation layer, while numerical analysis is performed deterministically using Python/Pandas."
          </p>
        </div>
      </div>

      {/* Problem Statement & Research Gap */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        
        {/* The Problem */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
            1. The Problem
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.65', margin: 0 }}>
            Electric vehicle adoption data is inherently fragmented across disparate national registries, disparate vehicle categories, 
            disparate time horizons, and isolated academic research papers. Comparing transition velocity between emerging two-wheeler dominant markets 
            (such as India) and passenger-car oriented Western markets (such as Norway and Germany) has historically been cumbersome and prone to misleading aggregations.
          </p>
        </div>

        {/* The Research Gap */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
            2. Research Gap
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.65', margin: 0 }}>
            Existing analytical tools either present static numerical charts without scientific literature context, or deploy ungrounded LLMs that hallucinate 
            statistical percentages, inflation-adjusted prices, and fabricated citations. 
            This project bridges this gap by unifying deterministic Python/Pandas calculation with localized FAISS semantic retrieval over peer-reviewed academic literature.
          </p>
        </div>

      </section>

      {/* System Architecture Flow Diagram */}
      <section className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Workflow size={20} style={{ color: 'var(--accent-cyan)' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
            System Architecture & Data Flow
          </h3>
        </div>

        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'rgba(7, 10, 18, 0.8)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.8',
            overflowX: 'auto',
          }}
        >
          <div style={{ textAlign: 'center', color: '#38bdf8', fontWeight: 700 }}>USER QUERY (Frontend Interface)</div>
          <div style={{ textAlign: 'center' }}>↓</div>
          <div style={{ textAlign: 'center', color: '#ffffff' }}>FASTAPI BACKEND (/api/chat, /api/analytics/*)</div>
          <div style={{ textAlign: 'center' }}>↓</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '0.75rem 0', textAlign: 'center' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px' }}>
              <div style={{ color: '#34d399', fontWeight: 700 }}>[ PANDAS ENGINE ]</div>
              <div style={{ fontSize: '0.75rem' }}>10,304 Cleaned Observations</div>
              <div style={{ fontSize: '0.75rem', color: '#34d399' }}>Deterministic Pre-Calculated Numbers</div>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '6px' }}>
              <div style={{ color: '#a5b4fc', fontWeight: 700 }}>[ FAISS VECTOR STORE ]</div>
              <div style={{ fontSize: '0.75rem' }}>15 Papers + Review Metadata</div>
              <div style={{ fontSize: '0.75rem', color: '#a5b4fc' }}>384-dim Semantic Retrieval</div>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>↓</div>
          <div style={{ textAlign: 'center', color: '#fbbf24', fontWeight: 700 }}>LLM EXPLANATION SYNTHESIS (Zero Arithmetic Permitted)</div>
          <div style={{ textAlign: 'center' }}>↓</div>
          <div style={{ textAlign: 'center', color: '#34d399', fontWeight: 700 }}>EVIDENCE-GROUNDED STRUCTURED RESPONSE</div>
        </div>
      </section>

      {/* Project Innovations Grid */}
      <section>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', margin: 0, marginBottom: '1rem' }}>
          Core Innovations Delivered
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {innovations.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel"
                style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(6, 182, 212, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-cyan)',
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 600, color: '#ffffff' }}>
                    {item.title}
                  </h4>
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
