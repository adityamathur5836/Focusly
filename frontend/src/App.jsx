import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import NotesPage from './pages/NotesPage';
import NoteEditorPage from './pages/NoteEditorPage';

function AppContent() {
  const location = useLocation();
  
  const isAuthenticatedPage = location.pathname.startsWith('/dashboard') || 
    location.pathname.startsWith('/settings') || 
    location.pathname.startsWith('/notes') ||
    location.pathname.startsWith('/flashcards');

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {!isAuthenticatedPage && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/notes" 
          element={
            <ProtectedRoute>
              <NotesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/notes/new" 
          element={
            <ProtectedRoute>
              <NoteEditorPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/notes/:id/edit" 
          element={
            <ProtectedRoute>
              <NoteEditorPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
      {!isAuthenticatedPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
