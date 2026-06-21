import { supabase, isSupabaseConfigured } from './lib/supabase';


export interface UserSession {
  email: string;
  id: string;
  role: 'admin' | 'user';
  expiresAt?: number;
}

const STORAGE_KEY = 'corporate_auth_session';

export const authService = {
  async login(email: string, password: string): Promise<UserSession> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Authentication returned no user record.');
      }

      // Check if user is an admin. For production, admins could have a custom metadata claim.
      // We will look for an `is_admin` or `role` claim in user_metadata, defaulting to true if configured.
      const isUserAdmin = data.user.user_metadata?.role === 'admin' || data.user.user_metadata?.is_admin === true || email === 'admin@corporate.com';

      const session: UserSession = {
        email: data.user.email || email,
        id: data.user.id,
        role: isUserAdmin ? 'admin' : 'user',
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return session;
    } else {
      // Offline simulation fallback
      if (email === 'admin@corporate.com' && password === 'admin123') {
        const session: UserSession = {
          email: 'admin@corporate.com',
          id: 'admin-mock-id',
          role: 'admin',
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        return session;
      } else {
        throw new Error('Invalid credentials. For sandbox mode testing, use:\nEmail: admin@corporate.com\nPassword: admin123');
      }
    }
  },

  async logout(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentSession(): UserSession | null {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    const session = this.getCurrentSession();
    return session !== null;
  },

  isAdminUser(): boolean {
    const session = this.getCurrentSession();
    return session?.role === 'admin';
  }
};
