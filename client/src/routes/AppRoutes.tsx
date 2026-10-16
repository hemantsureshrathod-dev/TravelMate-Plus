import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// Pages
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DestinationExplorerPage } from '../pages/DestinationExplorerPage';
import { TripPlannerPage } from '../pages/TripPlannerPage';
import { ItineraryStudioPage } from '../pages/ItineraryStudioPage';
import { DashboardPage } from '../pages/DashboardPage';
import { TripDetailPage } from '../pages/TripDetailPage';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner label="Authenticating session..." size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F3F5F4] text-[#26333A]">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/destinations" element={<DestinationExplorerPage />} />
          <Route path="/plan" element={<TripPlannerPage />} />
          <Route path="/studio" element={<ItineraryStudioPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips/:id"
            element={
              <ProtectedRoute>
                <TripDetailPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="max-w-md mx-auto text-center py-24 px-4 space-y-4">
                <span className="text-4xl font-extrabold text-[#5E8CA6]">404</span>
                <h2 className="text-xl font-bold text-[#26333A]">Page Not Found</h2>
                <p className="text-xs text-[#6C7A80]">
                  The page you are looking for does not exist or has been moved.
                </p>
                <a
                  href="/"
                  className="inline-flex items-center px-4 py-2 rounded-xl bg-[#5E8CA6] text-white text-xs font-semibold hover:bg-[#4D768E]"
                >
                  Return to Home
                </a>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};
