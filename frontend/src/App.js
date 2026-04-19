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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
