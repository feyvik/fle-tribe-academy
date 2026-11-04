import type { Session } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Profile } from '../data/models';
import { adminUsers, supabase } from './supabase';

interface AuthState {
  session: Session | null;
  profile: Profile | null;
  /** True until the first session check finishes. */
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<Profile>;
  signOut: () => Promise<void>;
  changePassword: (current: string, next: string) => Promise<void>;
  /** Saves the signed-in person's name (as printed on their certificate). */
  updateName: (fullName: string) => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

async function loadProfile(userId: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return data as Profile;
}

/** Who is signed in. There is no sign-up: admins create every account. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (data.session) setProfile(await loadProfile(data.session.user.id).catch(() => null));
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (!s) setProfile(null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const p = await loadProfile(data.user.id);
    setSession(data.session);
    setProfile(p);
    return p;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  }, []);

  /** Re-checks the current password, sets the new one, and clears the "must change" flag. */
  const changePassword = useCallback(
    async (current: string, next: string) => {
      if (!profile) throw new Error('Please sign in.');
      const check = await supabase.auth.signInWithPassword({ email: profile.email, password: current });
      if (check.error) throw new Error(profile.must_change_password ? 'The temporary password is wrong.' : 'Your current password is wrong.');
      const { error } = await supabase.auth.updateUser({ password: next });
      if (error) throw error;
      const done = await supabase.rpc('password_changed');
      if (done.error) throw done.error;
      setProfile({ ...profile, must_change_password: false });
      // Confirmation email. The password has already changed, so a failure here mustn't show as an error.
      adminUsers({ action: 'password_changed' }).catch(() => {});
    },
    [profile],
  );

  const updateName = useCallback(async (fullName: string) => {
    const { data, error } = await supabase.rpc('update_my_profile', { p_full_name: fullName });
    if (error) throw error;
    setProfile(data as Profile);
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, profile, loading, isAdmin: profile?.role === 'admin', signIn, signOut, changePassword, updateName }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
