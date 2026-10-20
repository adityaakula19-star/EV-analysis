import React from 'react';
import {
  LayoutDashboard,
  GitCompare,
  TrendingUp,
  PieChart,
  Network,
  BookOpen,
  Bot,
  Info,
  ChevronLeft,
  ChevronRight,
  Database,
  ShieldCheck,
  Zap
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { id: 'comparison', label: 'Country Comparison', icon: GitCompare, badge: null },
  { id: 'trends', label: 'Trends', icon: TrendingUp, badge: '2024-26' },
  { id: 'categories', label: 'Categories', icon: PieChart, badge: '4 Types' },
  { id: 'factors', label: 'Factors', icon: Network, badge: null },
  { id: 'research', label: 'Research', icon: BookOpen, badge: '15 Papers' },
  { id: 'assistant', label: 'AI Assistant', icon: Bot, badge: 'RAG' },
  { id: 'about', label: 'About', icon: Info, badge: null },
];

export default function Sidebar({ activePage, setActivePage, collapsed, setCollapsed, isMobileOpen, setIsMobileOpen, healthData }) {
  const isHealthy = healthData?.status === 'ok';
  const recordCount = healthData?.cleaned_records_count || 10304;

  const handleNavClick = (id) => {
    setActivePage(id);
    if (isMobileOpen && setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar Container */}
      <aside
        style={{
          width: collapsed ? '76px' : '260px',
          minWidth: collapsed ? '76px' : '260px',
          backgroundColor: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-glass)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 45,
          overflow: 'hidden',
          userSelect: 'none',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: collapsed ? '1.25rem 0.75rem' : '1.25rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            borderBottom: '1px solid var(--border-glass)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(16, 185, 129, 0.25) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
                boxShadow: '0 0 15px rgba(6, 182, 212, 0.25)',
                flexShrink: 0,
              }}
            >
              <Zap size={20} className="text-cyan-400" />
            </div>
            {!collapsed && (
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
                  ⚡ EV Intelligence
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                  Academic RAG Platform
                </div>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              title="Collapse sidebar"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                borderRadius: '6px',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav style={{ padding: '1rem 0.5rem', flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: collapsed ? '0.75rem' : '0.65rem 0.85rem',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    borderRadius: 'var(--radius-sm)',
                    background: isActive
                      ? 'linear-gradient(90deg, rgba(6, 182, 212, 0.16) 0%, rgba(6, 182, 212, 0.04) 100%)'
                      : 'transparent',
                    border: isActive ? '1px solid rgba(6, 182, 212, 0.35)' : '1px solid transparent',
                    color: isActive ? '#38bdf8' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                    outline: 'none',
                    fontFamily: 'inherit',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.color = 'var(--text-main)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }
                  }}
                >
                  <Icon size={19} style={{ flexShrink: 0 }} />
                  {!collapsed && (
                    <span style={{ fontSize: '0.85rem', fontWeight: isActive ? 600 : 500, flex: 1, textAlign: 'left', whiteSpace: 'nowrap' }}>
                      {item.label}
                    </span>
                  )}
                  {!collapsed && item.badge && (
                    <span
                      style={{
                        fontSize: '0.65rem',
                        padding: '0.15rem 0.4rem',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: 'var(--text-dim)',
                        fontWeight: 600,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer Info Box */}
        <div
          style={{
            padding: collapsed ? '0.75rem 0.5rem' : '1rem',
            borderTop: '1px solid var(--border-glass)',
            backgroundColor: 'rgba(5, 8, 16, 0.5)',
          }}
        >
          {collapsed ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => setCollapsed(false)}
                title="Expand sidebar"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                }}
              >
                <ChevronRight size={18} />
              </button>
              <span className={`status-dot ${isHealthy ? 'status-dot-active' : 'status-dot-error'}`} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span className={`status-dot ${isHealthy ? 'status-dot-active' : 'status-dot-error'}`} />
                  <span>{isHealthy ? 'FastAPI Online' : 'FastAPI Offline'}</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>:8000</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                <Database size={13} />
                <span>{recordCount.toLocaleString()} Cleaned Records</span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
