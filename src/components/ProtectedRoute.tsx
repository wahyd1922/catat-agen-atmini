import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Allow bypass for demo
  const isDemoMode = sessionStorage.getItem('demo_mode') === 'true';

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Memuat...</div>;
  }

  if (!user && !isDemoMode) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
