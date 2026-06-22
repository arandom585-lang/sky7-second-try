import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { authService, UserSession } from '../authService';

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserSession>;
  signUp: (email: string, password: string) => Promise<UserSession | null>;
  logout: () => Promise<void>;
  error: string | null;
  setError: (error: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session && mounted) {
            const isUserAdmin = session.user.user_metadata?.role === 'admin' || 
                                session.user.user_metadata?.is_admin === true || 
                                session.user.email === 'admin@corporate.com';
            const userSession: UserSession = {
              email: session.user.email || '',
              id: session.user.id,
              role: isUserAdmin ? 'admin' : 'user',
            };
            localStorage.setItem('corporate_auth_session', JSON.stringify(userSession));
            setUser(userSession);
          } else if (mounted) {
            const localSession = authService.getCurrentSession();
            setUser(localSession);
          }
        } else {
          const localSession = authService.getCurrentSession();
          setUser(localSession);
        }
      } catch (err: any) {
        console.error('Failed to initialize auth:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    let subscription: any = null;

    if (isSupabaseConfigured && supabase) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!mounted) return;
        if (session) {
          const isUserAdmin = session.user.user_metadata?.role === 'admin' || 
                              session.user.user_metadata?.is_admin === true || 
                              session.user.email === 'admin@corporate.com';
          const userSession: UserSession = {
            email: session.user.email || '',
            id: session.user.id,
            role: isUserAdmin ? 'admin' : 'user',
          };
          localStorage.setItem('corporate_auth_session', JSON.stringify(userSession));
          setUser(userSession);
        } else {
          localStorage.removeItem('corporate_auth_session');
          setUser(null);
        }
        setLoading(false);
      });
      subscription = data.subscription;
    }

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const session = await authService.login(email, password);
      setUser(session);
      return session;
    } catch (err: any) {
      setError(err?.message || 'Login failed');
      throw err;
    }
  };

  const signUp = async (email: string, password: string) => {
    setError(null);
    try {
      const session = await authService.signUp(email, password);
      if (session) {
        setUser(session);
      }
      return session;
    } catch (err: any) {
      setError(err?.message || 'Signup failed');
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await authService.logout();
      setUser(null);
    } catch (err: any) {
      setError(err?.message || 'Logout failed');
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signUp, logout, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
