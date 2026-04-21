import './App.css';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ScrollToTop from './components/ScrollToTop';
import { usePageTracking } from './hooks/usePageTracking';
import { initGA } from './utils/tracking';
import { useGlobalSelector } from './components/LangModal';
import { validateNavigation } from './utils/validateRoutes';
import { ROUTES, REDIRECTS } from './config/routes';
import { VALID_LANGS, DEFAULT_LANG } from './utils/langPath';

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
import ArenaMatchesPage       from './pages/ArenaMatchesPage';
import TestLandingPage        from './pages/TestLandingPage';

validateNavigation();

// ── Language detection: /  →  detect browser/stored lang, redirect to /{lang}/
function LangDetect() {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  useEffect(() => {
    const saved = localStorage.getItem('ak_lang');
    const browser = navigator.language?.slice(0, 2) || 'it';
    const lang = VALID_LANGS.includes(saved) ? saved
                : VALID_LANGS.includes(browser) ? browser
                : DEFAULT_LANG;
    const tail = pathname === '/' ? '' : pathname;
    navigate(`/${lang}${tail}${search}`, { replace: true });
  }, [navigate, pathname, search]);
  return null;
}

// ── Language wrapper: reads /:lang from URL, syncs i18n
function LangWrapper() {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!VALID_LANGS.includes(lang)) {
      const path = pathname.replace(/^\/[^/]*/, '') || '';
      navigate(`/${DEFAULT_LANG}${path}`, { replace: true });
      return;
    }
    if (i18n.language?.slice(0, 2) !== lang) {
      i18n.changeLanguage(lang);
      localStorage.setItem('ak_lang', lang);
    }
  }, [lang, i18n, navigate, pathname]);

  return <Outlet />;
}

// ── Inner routes (rendered inside /:lang/) ──────────────────────────────────
function AppRoutes() {
  usePageTracking();
  useGlobalSelector();
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Root language redirect */}
        <Route path="/"         element={<LangDetect />} />
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<LoginPage />} />
        <Route path="/admin"    element={<AdminPage />} />
        <Route path="/admin/*"  element={<AdminPage />} />

        {/* ── LANGUAGE-PREFIXED ROUTES ── */}
        <Route path="/:lang" element={<LangWrapper />}>
          <Route index                              element={<LandingPage />} />
          <Route path="arena-system"               element={<ArenaSystemPage />} />
          <Route path="for-athletes"               element={<AthletePage />} />
          <Route path="competition"                element={<WorkoutCompetitionPage />} />
          <Route path="amrap"                      element={<AmrapPage />} />
          <Route path="crossfit"                   element={<CrossfitPage />} />
          <Route path="gamification"               element={<GamificationPage />} />
          <Route path="for-gyms-and-coaches"       element={<GymPilotPage />} />
          <Route path="arena-matches"              element={<ArenaMatchesPage />} />
          <Route path="get-the-app"                element={<GetTheAppPage />} />
          <Route path="blog"                       element={<BlogPage />} />
          <Route path="blog/:slug"                 element={<BlogArticlePage />} />
          <Route path="support"                    element={<SupportPage />} />

          {/* SEO landing pages */}
          <Route path="fitness-challenge-app"      element={<FitnessChallengePage />} />
          <Route path="fitness-level-test"         element={<TestLandingPage slug="fitness-level-test" />} />
          <Route path="crossfit-performance-test"  element={<TestLandingPage slug="crossfit-performance-test" />} />
          <Route path="amrap-test"                 element={<TestLandingPage slug="amrap-test" />} />
          <Route path="strength-test"              element={<TestLandingPage slug="strength-test" />} />

          {/* Legacy redirects within lang prefix */}
          {Object.entries(REDIRECTS).map(([from, to]) => (
            <Route key={from}
              path={from.replace(/^\//, '')}
              element={<Navigate to={to} replace />} />
          ))}
        </Route>

        {/* Catch-all: detect language and redirect */}
        <Route path="*" element={<LangDetect />} />
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
