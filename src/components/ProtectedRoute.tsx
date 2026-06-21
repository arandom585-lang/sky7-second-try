import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { authService } from '../authService';
import { RefreshCw } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [authenticated, setAuthenticated] = useState(() => {
    if (!isSupabaseConfigured) {
      return authService.isAuthenticated() && authService.isAdminUser();
    }
    return false;
  });

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let mounted = true;

    async function checkAuth() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (mounted) {
          if (session) {
            const userSession = {
              email: session.user.email || '',
              id: session.user.id,
              role: 'admin' as const,
            };
            localStorage.setItem('corporate_auth_session', JSON.stringify(userSession));
            setAuthenticated(true);
          } else {
            localStorage.removeItem('corporate_auth_session');
            setAuthenticated(false);
          }
        }
      } catch (err) {
        console.error('Error verifying Supabase auth session:', err);
        if (mounted) {
          setAuthenticated(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        if (session) {
          const userSession = {
            email: session.user.email || '',
            id: session.user.id,
            role: 'admin' as const,
          };
          localStorage.setItem('corporate_auth_session', JSON.stringify(userSession));
          setAuthenticated(true);
        } else {
          localStorage.removeItem('corporate_auth_session');
          setAuthenticated(false);
        }
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF0] flex flex-col items-center justify-center relative z-50">
        <div className="text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-[#C5A043] animate-spin mx-auto" />
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#0B1B3D]">
            Verifying administrative session...
          </p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

