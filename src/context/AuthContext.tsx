import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { authService, UserSession } from '../authService';

async function withTimeout<T>(promise: Promise<T>, label: string, ms = 5000): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
      })
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

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
          const { data: { session } } = await withTimeout(
            supabase.auth.getSession(),
            'Supabase getSession'
          );
          if (session && mounted) {
            let isUserAdmin = session.user.email === 'admin@corporate.com';

            // Securely verify role from the database user_profiles table
            try {
              const { data: profile } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();
              if (profile?.role === 'admin') {
                isUserAdmin = true;
              }
            } catch (profileErr) {
              console.warn('Could not verify profile role from db:', profileErr);
            }

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
      const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!mounted) return;
        if (session) {
          let isUserAdmin = session.user.email === 'admin@corporate.com';

          try {
            const { data: profile } = await withTimeout(
              supabase
                .from('user_profiles')
                .select('role')
                .eq('id', session.user.id)
                .maybeSingle(),
              'auth state user_profiles lookup'
            );
            if (profile?.role === 'admin') {
              isUserAdmin = true;
            }
          } catch (profileErr) {
            console.warn('Could not verify profile role on auth state change:', profileErr);
          }

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
