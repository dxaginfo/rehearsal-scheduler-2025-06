import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';

// Layout Components
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Main App Pages
import DashboardPage from './pages/DashboardPage';
import BandsPage from './pages/BandsPage';
import BandDetailsPage from './pages/BandDetailsPage';
import RehearsalsPage from './pages/RehearsalsPage';
import RehearsalDetailsPage from './pages/RehearsalDetailsPage';
import SongsPage from './pages/SongsPage';
import SongDetailsPage from './pages/SongDetailsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>
      
      {/* Main App Routes */}
      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/bands" element={<BandsPage />} />
        <Route path="/bands/:bandId" element={<BandDetailsPage />} />
        <Route path="/rehearsals" element={<RehearsalsPage />} />
        <Route path="/rehearsals/:rehearsalId" element={<RehearsalDetailsPage />} />
        <Route path="/songs" element={<SongsPage />} />
        <Route path="/songs/:songId" element={<SongDetailsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;