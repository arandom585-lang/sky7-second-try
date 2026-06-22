import { supabase, isSupabaseConfigured } from './supabase';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  company_name: string;
  created_at: string;
  updated_at: string;
}

export const profileService = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    console.log('[profileService] Fetching profile for user ID:', userId);
    
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          // If no row exists, we return null so the frontend knows to seed or prompt
          if (error.code === 'PGRST116') {
            console.warn('[profileService] No profile row found in database for ID:', userId);
            return null;
          }
          console.error('[profileService] Supabase select profile failed:', error);
          throw new Error(error.message);
        }

        console.log('[profileService] Successfully fetched profile from database:', data);
        return data as UserProfile;
      } catch (err: any) {
        console.error('[profileService] Exception in getProfile:', err);
        throw err;
      }
    } else {
      // Offline/Local Sandbox simulation mode
      console.log('[profileService] Offline mode active. Reading from localStorage.');
      const localKey = `mock_profile_${userId}`;
      const saved = localStorage.getItem(localKey);
      
      if (saved) {
        try {
          const profile = JSON.parse(saved) as UserProfile;
          console.log('[profileService] Simulated profile read success:', profile);
          return profile;
        } catch {
          // Ignore parse errors and fall back to generation
        }
      }

      // Fallback: Generate a mock profile if it doesn't exist
      const newMockProfile: UserProfile = {
        id: userId,
        email: 'member@sky7.com',
        full_name: '',
        phone: '',
        company_name: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Check if session has the email to pre-fill it
      const currentSession = localStorage.getItem('corporate_auth_session');
      if (currentSession) {
        try {
          const parsed = JSON.parse(currentSession);
          if (parsed && parsed.email) {
            newMockProfile.email = parsed.email;
          }
        } catch {
          // Ignore
        }
      }

      localStorage.setItem(localKey, JSON.stringify(newMockProfile));
      console.log('[profileService] Simulated profile generated and seeded:', newMockProfile);
      return newMockProfile;
    }
  },

  async updateProfile(profile: Partial<UserProfile> & { id: string }): Promise<UserProfile> {
    console.log('[profileService] Updating profile for user ID:', profile.id, profile);
    const updatedTime = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .update({
            ...profile,
            updated_at: updatedTime
          })
          .eq('id', profile.id)
          .select()
          .single();

        if (error) {
          console.error('[profileService] Supabase update profile failed:', error);
          throw new Error(error.message);
        }

        console.log('[profileService] Successfully updated profile in database:', data);
        return data as UserProfile;
      } catch (err: any) {
        console.error('[profileService] Exception in updateProfile:', err);
        throw err;
      }
    } else {
      // Offline/Local Sandbox simulation mode
      const localKey = `mock_profile_${profile.id}`;
      const existing = await this.getProfile(profile.id);
      
      const newProfile: UserProfile = {
        id: profile.id,
        email: profile.email || existing?.email || 'member@sky7.com',
        full_name: profile.full_name !== undefined ? profile.full_name : (existing?.full_name || ''),
        phone: profile.phone !== undefined ? profile.phone : (existing?.phone || ''),
        company_name: profile.company_name !== undefined ? profile.company_name : (existing?.company_name || ''),
        created_at: existing?.created_at || updatedTime,
        updated_at: updatedTime
      };

      localStorage.setItem(localKey, JSON.stringify(newProfile));
      console.log('[profileService] Simulated profile write success:', newProfile);
      return newProfile;
    }
  }
};
