import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProgress } from '../types/game';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Fetch progress from Supabase for a given user ID
 */
export async function fetchUserProgress(userId: string): Promise<UserProgress | null> {
  if (!supabase) return null;
  
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.warn("Supabase fetch progress error:", error.message);
      return null;
    }
    
    return data as UserProgress | null;
  } catch (err) {
    console.error("Failed to fetch user progress from Supabase:", err);
    return null;
  }
}

/**
 * Save / Upsert user progress to Supabase
 */
export async function saveUserProgress(progress: UserProgress): Promise<boolean> {
  if (!supabase || !progress.user_id) return false;
  
  try {
    const payload = {
      ...progress,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('user_progress')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) {
      console.warn("Supabase upsert error:", error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Failed to save progress to Supabase:", err);
    return false;
  }
}
