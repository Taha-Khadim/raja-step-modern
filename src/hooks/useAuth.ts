import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, auth } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAdmin: false,
  });

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      let isAdmin = false;
      if (session?.user) {
        const { data } = await supabase.rpc('is_admin', { user_id: session.user.id });
        isAdmin = data || false;
      }

      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false,
        isAdmin,
      });
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        let isAdmin = false;
        if (session?.user) {
          const { data } = await supabase.rpc('is_admin', { user_id: session.user.id });
          isAdmin = data || false;
        }

        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
          isAdmin,
        });
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await auth.signInWithGoogle();
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await auth.signOut();
    if (error) throw error;
  };

  return {
    ...authState,
    signInWithGoogle,
    signOut,
  };
};