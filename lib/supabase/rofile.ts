// lib/supabase/queries/profile.ts
import { SupabaseClient } from '@supabase/supabase-js';

export interface ProfileUpdate {
  full_name?: string;
}

// Function to get the current user's profile
export async function getUserProfile(supabase: SupabaseClient) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  // Combine auth email with profile name
  return { email: user.email, ...profile };
}

// Function to update user's name in the 'profiles' table
export async function updateUserProfile(
  supabase: SupabaseClient,
  userId: string,
  updates: ProfileUpdate
) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Function to update the user's password
export async function updateUserPassword(supabase: SupabaseClient, newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);
}