import React, { useState, useEffect } from 'react';
import {
  Network,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  BatteryCharging,
  DollarSign,
  Tag,
  Zap,
  Info,
  ShieldCheck,
} from 'lucide-react';
import api from '../services/api';
import ErrorAlert from '../components/ErrorAlert';
import { KPISkeleton } from '../components/LoadingSkeleton';

export default function FactorsPage() {
  const [correlations, setCorrelations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCorrelations = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getCorrelations();
        setCorrelations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCorrelations();
  }, []);

  const corrItems = [
    {
      id: 'subsidies',
      title: 'Active Subsidy Policy vs EV Penetration',
      coeff: correlations?.corr_penetration_vs_subsidy ?? 0.206,
      direction: 'Positive Association',
      color: '#34d399',
      badgeColor: 'emerald',
      description:
        'Active fiscal purchase subsidies and consumer incentives demonstrate a statistically positive association with higher EV market share penetration across regional observations.',
      academicNote:
        'Supports academic literature indicating financial policy interventions act as an immediate demand accelerator during early and middle adoption phases.',
    },
    {
      id: 'charging_sales',
      title: 'Charging Stations vs Total EV Units Sold',
      coeff: correlations?.corr_sales_vs_charging ?? 0.1872,
      direction: 'Positive Association',
      color: '#38bdf8',
      badgeColor: 'cyan',
      description:
        'Cumulative public and semi-public charging point installations show a positive co-movement with total sales volume of electric vehicles.',
      academicNote:
        'Aligns with network externality theories where expanding physical infrastructure alleviates range anxiety for potential adopters.',
    },
    {
      id: 'charging_penetration',
      title: 'Charging Stations vs EV Penetration Rate',
      coeff: correlations?.corr_penetration_vs_charging ?? 0.0204,
      direction: 'Weak Positive Association',
      color: '#818cf8',
      badgeColor: 'indigo',
      description:
        'A modest positive statistical relationship observed between regional cumulative charging stations and proportional market penetration rate.',
      academicNote:
        'Suggests charging density alone does not dictate market share without concurrent vehicle affordability and segment diversity (e.g. 2W/3W in developing markets).',
    },
    {
      id: 'price',
      title: 'Average EV Price (USD) vs EV Penetration',
      coeff: correlations?.corr_penetration_vs_price ?? -0.0366,
      direction: 'Negative Association',
      color: '#f59e0b',
      badgeColor: 'amber',
      description:
        'Higher average retail price per electric vehicle exhibits an inverse relationship with overall market penetration in the dataset.',
      academicNote:
        'Reflects economic demand elasticity where premium price points hinder broad mass-market transition in developing demographics.',
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem 2rem' }}>
        <div className="kpi-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <KPISkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', padding: '1.5rem 2rem' }}>
      
      {/* Scientific Causality Disclaimer Banner (MANDATORY REQUIREMENT) */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.08) 0%, rgba(13, 20, 36, 0.8) 100%)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fbbf24',
            flexShrink: 0,
          }}
        >
          <AlertTriangle size={22} />
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '-0.01em' }}>
            Academic Scientific Disclaimer: Correlation Does Not Imply Causation
          </h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#fef3c7', lineHeight: '1.5', marginTop: '0.25rem' }}>
            These variables show a statistical association in the analyzed dataset (10,304 cleaned observations). 
            Empirical correlations quantify directional co-variation and do not prove causal mechanisms.
            Variables such as charging deployment, subsidies, and pricing interact dynamically within macroeconomic and policy frameworks.
          </p>
        </div>
      </div>

      {error && <ErrorAlert message={error} />}

      {/* Correlation Factor Cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
        {corrItems.map((item) => {
          const pctWidth = Math.min(Math.abs(item.coeff) * 250, 100);

          return (
            <div
              key={item.id}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
                border: '1px solid var(--border-glass)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                    {item.title}
                  </h3>
                  <span className={`badge badge-${item.badgeColor}`} style={{ fontSize: '0.7rem' }}>
                    {item.direction}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: item.color, fontFamily: 'var(--font-mono)' }}>
                    {item.coeff > 0 ? `+${item.coeff}` : item.coeff}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    Pearson Correlation Coefficient (r)
                  </span>
                </div>

                {/* Progress / Strength Bar */}
                <div
                  style={{
                    height: '6px',
                    width: '100%',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${pctWidth}%`,
                      backgroundColor: item.color,
                      borderRadius: '3px',
                      transition: 'width 0.8s ease',
                    }}
                  />
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0, marginBottom: '0.75rem' }}>
                  {item.description}
                </p>
              </div>

              <div
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  color: 'var(--text-dim)',
                  lineHeight: '1.45',
                }}
              >
                <strong style={{ color: 'var(--text-secondary)' }}>Literature Context:</strong> {item.academicNote}
              </div>
            </div>
          );
        })}
      </section>

      {/* Methodological Context Summary */}
      <section className="glass-panel" style={{ padding: '1.5rem 1.75rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, marginBottom: '0.5rem', color: '#ffffff' }}>
          Factor Analysis Methodology
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
          Pearson correlation coefficients were computed across all 10,304 clean monthly observations spanning January 2024 to August 2026. 
          The dataset harmonizes six distinct national vehicle ecosystems: 
          mature EV markets with comprehensive incentives (Norway), vast manufacturing hubs (China), mixed industrial economies (Germany, UK, USA), 
          and two/three-wheeler dominant transitions (India). 
          Regional disaggregation within each country represents coursework simulated data calibrated against empirical national benchmarks.
        </p>
      </section>

    </div>
  );
}
