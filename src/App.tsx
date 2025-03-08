
import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';
import FoodPage from './pages/FoodPage';
import WorkoutPage from './pages/WorkoutPage';
import ActiveWorkoutPage from './pages/ActiveWorkoutPage';
import CalculatorPage from './pages/CalculatorPage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import JournalPage from './pages/JournalPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/calculator" element={<CalculatorPage />} />
      
      <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/food" element={<FoodPage />} />
        <Route path="/workout" element={<WorkoutPage />} />
        <Route path="/active-workout" element={<ActiveWorkoutPage />} />
        <Route path="/journal" element={<JournalPage />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
