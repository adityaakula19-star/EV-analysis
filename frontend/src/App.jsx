import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import CountryComparisonPage from './pages/CountryComparisonPage';
import TrendsPage from './pages/TrendsPage';
import CategoriesPage from './pages/CategoriesPage';
import FactorsPage from './pages/FactorsPage';
import ResearchPage from './pages/ResearchPage';
import AIAssistantPage from './pages/AIAssistantPage';
import AboutPage from './pages/AboutPage';
import ErrorAlert from './components/ErrorAlert';
import api from './services/api';
import './App.css';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Global State
  const [healthData, setHealthData] = useState(null);
  const [overviewStats, setOverviewStats] = useState(null);
  const [countryTrends, setCountryTrends] = useState(null);
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [globalError, setGlobalError] = useState(null);

  // Load all initial global analytics datasets
  const fetchGlobalData = useCallback(async () => {
    setIsRefreshing(true);
    setGlobalError(null);

    try {
      const [healthRes, overviewRes, trendsRes, catsRes] = await Promise.all([
        api.getHealth().catch((err) => ({ status: 'error', error: err.message })),
        api.getOverview().catch((err) => { throw err; }),
        api.getCountryTrends('yearly').catch((err) => { throw err; }),
        api.getCategories().catch((err) => { throw err; }),
      ]);

      setHealthData(healthRes);
      setOverviewStats(overviewRes);
      setCountryTrends(trendsRes);
      setCategoriesData(Array.isArray(catsRes) ? catsRes : []);
    } catch (err) {
      console.error('Initial data fetch failed:', err);
      setGlobalError(err.message || 'Backend unavailable. Please start the FastAPI server at http://localhost:8000.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchGlobalData();
  }, [fetchGlobalData]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-dark)' }}>
      
      {/* 1. Collapsible Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        healthData={healthData}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: '100vh' }}>
        
        {/* 2. Top Header / Navbar */}
        <Navbar
          activePage={activePage}
          onRefresh={fetchGlobalData}
          isRefreshing={isRefreshing}
          healthData={healthData}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
        />

        {/* Global Connection Error Banner (if FastAPI is down) */}
        {globalError && (
          <div style={{ padding: '0 2rem' }}>
            <ErrorAlert message={globalError} onRetry={fetchGlobalData} />
          </div>
        )}

        {/* 3. Page Views */}
        <main style={{ flex: 1 }}>
          {activePage === 'dashboard' && (
            <DashboardPage
              overviewStats={overviewStats}
              countryTrends={countryTrends}
              categoriesData={categoriesData}
              loading={loading}
              onNavigate={(pageId) => setActivePage(pageId)}
            />
          )}

          {activePage === 'comparison' && (
            <CountryComparisonPage countryTrends={countryTrends} />
          )}

          {activePage === 'trends' && (
            <TrendsPage />
          )}

          {activePage === 'categories' && (
            <CategoriesPage />
          )}

          {activePage === 'factors' && (
            <FactorsPage />
          )}

          {activePage === 'research' && (
            <ResearchPage />
          )}

          {activePage === 'assistant' && (
            <AIAssistantPage />
          )}

          {activePage === 'about' && (
            <AboutPage />
          )}
        </main>

        {/* 4. Academic Footer */}
        <footer
          style={{
            marginTop: 'auto',
            borderTop: '1px solid var(--border-glass)',
            backgroundColor: 'rgba(5, 8, 16, 0.95)',
            padding: '1.25rem 2rem',
            fontSize: '0.78rem',
            color: 'var(--text-dim)',
          }}
        >
          <div
            style={{
              maxWidth: '1600px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div>
              <strong>EV Adoption Intelligence System</strong> • Academic Project (10,304 Cleaned Observations)
            </div>
            <div>
              Deterministic Pandas Engine • FAISS Vector Search • LLM Explanation Layer
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
