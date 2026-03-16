import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  provider: string;
  created_at: string;
  updated_at: string;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return null;
    
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function getCurrentProfile(): Promise<Profile | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const supabase = await createSupabaseServerClient();
    if (!supabase) return null;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) throw error;
    return profile;
  } catch (error) {
    console.error("Error getting current profile:", error);
    return null;
  }
}

export async function updateProfile(updates: Partial<Profile>): Promise<Profile | null> {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("No authenticated user");

    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("No Supabase client");

    const { data: profile, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;
    return profile;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  return { data, error };
}

export async function signUpWithEmail(email: string, password: string, fullName?: string) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        full_name: fullName?.trim() || null,
        provider: 'email'
      },
    },
  });
  return { data, error };
}

export async function signInWithGoogle() {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
  return { data, error };
}

export async function signOut() {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function uploadAvatar(file: File): Promise<string | null> {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("No authenticated user");

    const supabase = createSupabaseBrowserClient();
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Update profile with new avatar URL
    await updateProfile({ avatar_url: publicUrl });

    return publicUrl;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
}

export async function deleteAvatar(): Promise<void> {
  try {
    const profile = await getCurrentProfile();
    if (!profile?.avatar_url) return;

    const supabase = createSupabaseBrowserClient();
    
    // Extract file path from URL
    const urlParts = profile.avatar_url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `avatars/${fileName}`;

    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from('avatars')
      .remove([filePath]);

    if (deleteError) throw deleteError;

    // Update profile to remove avatar URL
    await updateProfile({ avatar_url: null });
  } catch (error) {
    console.error("Error deleting avatar:", error);
    throw error;
  }
}
