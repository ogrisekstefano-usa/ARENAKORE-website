import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import ScrollToTop from './components/ScrollToTop';
import { usePageTracking } from './hooks/usePageTracking';
import { initGA } from './utils/tracking';
import { useGlobalSelector } from './components/LangModal';
import { validateNavigation } from './utils/validateRoutes';
import { ROUTES, REDIRECTS } from './config/routes';

import LoginPage              from './pages/LoginPage';
import LandingPage            from './LandingPage';
import ArenaSystemPage        from './pages/ArenaSystemPage';
import FitnessChallengePage   from './pages/FitnessChallengePage';
import CrossfitPage           from './pages/CrossfitPage';
import WorkoutCompetitionPage from './pages/WorkoutCompetitionPage';
import AmrapPage              from './pages/AmrapPage';
import GamificationPage       from './pages/GamificationPage';
import ForGymsPage            from './pages/ForGymsPage';
import GymPilotPage           from './pages/GymPilotPage';
import GetTheAppPage          from './pages/GetTheAppPage';
import AthletePage            from './pages/AthletePage';
import BlogPage               from './pages/BlogPage';
import BlogArticlePage        from './pages/BlogArticlePage';
import SupportPage            from './pages/SupportPage';
import AdminPage              from './pages/AdminPage';

import ArenaMatchesPage        from './pages/ArenaMatchesPage';

// Validate routes at startup (dev mode only)
validateNavigation();

function AppRoutes() {
  usePageTracking();
  useGlobalSelector();
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* ── CANONICAL ROUTES ── */}
        <Route path={ROUTES.home}         element={<LandingPage />} />
        <Route path={ROUTES.arenaSystem}  element={<ArenaSystemPage />} />
        <Route path={ROUTES.athletes}     element={<AthletePage />} />
        <Route path={ROUTES.competition}  element={<WorkoutCompetitionPage />} />
        <Route path={ROUTES.amrap}        element={<AmrapPage />} />
        <Route path={ROUTES.crossfit}     element={<CrossfitPage />} />
        <Route path={ROUTES.gamification} element={<GamificationPage />} />
        <Route path={ROUTES.gyms}         element={<GymPilotPage />} />
        <Route path={ROUTES.app}          element={<GetTheAppPage />} />
        <Route path={ROUTES.blog}         element={<BlogPage />} />
        <Route path="/blog/:slug"         element={<BlogArticlePage />} />
        <Route path={ROUTES.support}      element={<SupportPage />} />
        <Route path={ROUTES.login}        element={<LoginPage />} />
        <Route path="/register"           element={<LoginPage />} />
        <Route path={ROUTES.admin}        element={<AdminPage />} />
        <Route path="/admin/*"            element={<AdminPage />} />

        <Route path="/arena-matches"     element={<ArenaMatchesPage />} />

        {/* ── SEO PAGES (not in main nav, kept for backlinks) ── */}
        <Route path={ROUTES.fitnessApp}   element={<FitnessChallengePage />} />
        <Route path="/for-gyms-seo"       element={<ForGymsPage />} />

        {/* ── LEGACY REDIRECTS (301-equivalent) ── */}
        {Object.entries(REDIRECTS).map(([from, to]) => (
          <Route key={from} path={from} element={<Navigate to={to} replace />} />
        ))}
      </Routes>
    </>
  );
}

function App() {
  useEffect(() => { initGA(); }, []);
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
