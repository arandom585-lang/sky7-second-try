import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuth = authService.isAuthenticated();
  const isAdmin = authService.isAdminUser();

  if (!isAuth || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
