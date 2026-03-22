import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const syncProfileOnSignIn = async (signedInUser: User) => {
    const nowIso = new Date().toISOString();

    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({
        last_login_at: nowIso,
        email: signedInUser.email ?? '',
      })
      .eq('user_id', signedInUser.id)
      .select('user_id')
      .maybeSingle();

    if (updateError) {
      console.error('Error updating profile on sign in:', updateError);
      return;
    }

    if (updatedProfile) return;

    const firstName = (signedInUser.user_metadata?.first_name as string | undefined) ?? '';
    const lastName = (signedInUser.user_metadata?.last_name as string | undefined) ?? '';

    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        user_id: signedInUser.id,
        email: signedInUser.email ?? '',
        role: signedInUser.email === 'admin@admin.com' ? 'admin' : 'student',
        first_name: firstName,
        last_name: lastName,
        last_login_at: nowIso,
      });

    if (insertError) {
      console.error('Error creating missing profile on sign in:', insertError);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (event === 'SIGNED_IN' && session?.user) {
          // Keep auth callback non-blocking to avoid sign-in/sign-out deadlocks.
          setTimeout(async () => {
            await syncProfileOnSignIn(session.user);
          }, 0);
        }
        
        if (session?.user) {
          // Fetch user profile
          setTimeout(async () => {
            try {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', session.user.id)
                .single();
              
              setProfile(profileData);
            } catch (error) {
              console.error('Error fetching profile:', error);
            }
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signOut();

    // Immediately clear local auth state so the UI updates even if the auth listener lags
    setUser(null);
    setSession(null);
    setProfile(null);

    if (error) {
      console.error('Error signing out:', error);
    }

    setLoading(false);
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}