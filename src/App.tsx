
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import FoodPage from './pages/FoodPage';
import WorkoutPage from './pages/WorkoutPage';
import ActiveWorkoutPage from './pages/ActiveWorkoutPage';
import CreateTemplatePage from './pages/CreateTemplatePage';
import DatabaseAdminPage from './pages/DatabaseAdminPage';
import JournalPage from './pages/JournalPage';
import AICoachPage from './pages/AICoachPage';
import CalculatorPage from './pages/CalculatorPage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        
        <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
          <Route path="/food" element={<FoodPage />} />
          <Route path="/workout" element={<WorkoutPage />} />
          <Route path="/active-workout" element={<ActiveWorkoutPage />} />
          <Route path="/create-template" element={<CreateTemplatePage />} />
          <Route path="/database-admin" element={<DatabaseAdminPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/ai-coach" element={<AICoachPage />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
