import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import FitnessChallengePage from './pages/FitnessChallengePage';
import CrossfitPage from './pages/CrossfitPage';
import WorkoutCompetitionPage from './pages/WorkoutCompetitionPage';
import AmrapPage from './pages/AmrapPage';
import GamificationPage from './pages/GamificationPage';
import ForGymsPage from './pages/ForGymsPage';
import BlogPage from './pages/BlogPage';
import BlogArticlePage from './pages/BlogArticlePage';
import SupportPage from './pages/SupportPage';
import GymPilotPage from './pages/GymPilotPage';
import AdminPage from './pages/AdminPage';
import AthletePage from './pages/AthletePage';
import ArenaSystemPage from './pages/ArenaSystemPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/fitness-challenge-app" element={<FitnessChallengePage />} />
        <Route path="/crossfit-challenge" element={<CrossfitPage />} />
        <Route path="/workout-competition" element={<WorkoutCompetitionPage />} />
        <Route path="/amrap-training" element={<AmrapPage />} />
        <Route path="/fitness-gamification" element={<GamificationPage />} />
        <Route path="/for-gyms" element={<ForGymsPage />} />
        <Route path="/gym-challenge-pilot" element={<GymPilotPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogArticlePage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/for-athletes" element={<AthletePage />} />
        <Route path="/arena-system" element={<ArenaSystemPage />} />
        <Route path="/competition-system" element={<ArenaSystemPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
