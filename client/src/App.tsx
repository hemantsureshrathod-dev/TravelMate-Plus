import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Explore } from './pages/Explore';
import { Planner } from './pages/Planner';
import { Dashboard } from './pages/Dashboard';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="explore" element={<Explore />} />
        <Route path="planner" element={<ProtectedRoute><Planner /></ProtectedRoute>} />
        <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        {/* Fallback */}
        <Route path="*" element={<div className="p-8 text-center text-xl">404 - Page Not Found</div>} />
      </Route>
    </Routes>
  );
}

export default App;
