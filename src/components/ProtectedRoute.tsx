import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RefreshCw } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: 'admin' | 'user';
}

export default function ProtectedRoute({ children, allowedRole = 'user' }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF0] flex flex-col items-center justify-center relative z-50">
        <div className="text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-[#C5A043] animate-spin mx-auto" />
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#0B1B3D]">
            Verifying secure session...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (allowedRole === 'admin') {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  if (allowedRole === 'admin' && user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
