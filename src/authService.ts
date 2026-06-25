import { supabase, isSupabaseConfigured } from './lib/supabase';

export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@sky7.in';


export interface UserSession {
  email: string;
  id: string;
  role: 'admin' | 'user';
  expiresAt?: number;
}

const STORAGE_KEY = 'corporate_auth_session';

const withTimeout = async (promise: Promise<any>, label: string, ms = 5000): Promise<any> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<any>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
      })
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
};

export const authService = {
  async signUp(email: string, password: string): Promise<UserSession | null> {
    console.log('[authService] signUp initiated for email:', email);
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase client is not configured. Registration services are currently unavailable.');
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('[authService] Supabase signUp returned error:', error);
        throw new Error(error.message);
      }

      if (!data.user) {
        console.error('[authService] Supabase signUp did not return a user.');
        throw new Error('Sign up returned no user record.');
      }

      console.log('[authService] Supabase signUp success. User ID:', data.user.id);

      if (data.session) {
        console.log('[authService] Supabase signUp automatically signed in user (email confirmation disabled).');
        const session: UserSession = {
          email: data.user.email || email,
          id: data.user.id,
          role: 'user',
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        return session;
      } else {
        console.log('[authService] Supabase signUp requires email confirmation.');
        return null;
      }
    } catch (err: any) {
      console.error('[authService] Exception in signUp:', err);
      throw err;
    }
  },

  async login(email: string, password: string): Promise<UserSession> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase client is not configured. Authentication services are currently unavailable.');
    }

    console.log('[authService] login initiated for email:', email);

    let data;
    let error;
    try {
      ({ data, error } = await withTimeout(
        supabase.auth.signInWithPassword({ email, password }),
        'Supabase signInWithPassword'
      ));
    } catch (err: any) {
      console.error('[authService] signInWithPassword failed or timed out:', err);
      throw new Error(err?.message || 'Login request timed out.');
    }

    if (error) {
      console.error('[authService] Supabase signIn returned error:', error);
      throw new Error(error.message);
    }

    if (!data.user) {
      console.error('[authService] Supabase signIn returned no user record.');
      throw new Error('Authentication returned no user record.');
    }

    // Securely verify role from the database user_profiles table
    const userEmail = data.user.email || email;
    let isUserAdmin = userEmail === ADMIN_EMAIL;
    let profile: any = null;
    let profileError: any = null;
    try {
      const result = await withTimeout(
        supabase
          .from('user_profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle(),
        'user_profiles role lookup'
      );
      profile = result ? result.data : null;
      profileError = result ? result.error : null;
      if (profileError) {
        console.warn('[authService] user_profiles lookup failed:', profileError);
      }
      if (profile?.role === 'admin') {
        isUserAdmin = true;
      }
    } catch (profileErr) {
      console.warn('[authService] Could not verify profile role from db on login:', profileErr);
    }

    const userRole = profile?.role || 'user';
    console.log('[authService.login] Debug Auth Info:', {
      'Current User Email': userEmail,
      'Current User Role': userRole,
      'Current Session': data.session ? 'Active' : 'No Session',
      'Authorization Result': isUserAdmin ? 'AUTHORIZED' : 'UNAUTHORIZED'
    });

    if (!isUserAdmin) {
      console.log('[authService.login] Authorization failed because email ' + userEmail + ' is not the configured admin email (' + ADMIN_EMAIL + ') and the database profile role is "' + userRole + '" instead of "admin".');
    }

    const session: UserSession = {
      email: userEmail,
      id: data.user.id,
      role: isUserAdmin ? 'admin' : 'user',
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    console.log('[authService] login completed with role:', session.role);
    return session;
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
