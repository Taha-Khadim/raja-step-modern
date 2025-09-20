// src/hooks/useAuth.ts
import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase'; // see client snippet below if you need it
import type { Session, User } from '@supabase/supabase-js';

type AuthState = {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
};

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isAdmin: false,
    loading: true,
    error: null,
  });

  // avoid setState on unmounted component
  const mounted = useRef(true);
  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  // helper: check admin via your SECURITY DEFINER function is_admin(user_id)
  const resolveIsAdmin = async (userId: string | null) => {
    if (!userId) return false;
    const { data, error } = await supabase.rpc('is_admin', { user_id: userId });
    if (error) {
      // don’t fail auth on admin check noise; just log and proceed
      console.error('is_admin rpc error:', error);
      return false;
    }
    return Boolean(data);
  };

  const loadSession = async () => {
    // 1) pull cached session quickly
    const { data: initial } = await supabase.auth.getSession();

    let nextSession = initial.session ?? null;
    let nextUser = nextSession?.user ?? null;

    // 2) if we’re on the OAuth callback URL, exchange code→session (PKCE)
    // This is safe to call idempotently on non-callback pages; it will no-op.
    try {
      const { data: exchanged, error: exchangeErr } =
        await supabase.auth.exchangeCodeForSession(window.location.href);
      if (!exchangeErr && exchanged?.session) {
        nextSession = exchanged.session;
        nextUser = exchanged.session.user;
      }
    } catch (_) {
      // ignore—means we weren’t on the callback URL
    }

    const admin = await resolveIsAdmin(nextUser?.id ?? null);

    if (mounted.current) {
      setState({
        user: nextUser,
        session: nextSession,
        isAdmin: admin,
        loading: false,
        error: null,
      });
    }
  };

  useEffect(() => {
    // initial load
    loadSession();

    // live updates
    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, newSession) => {
      const newUser = newSession?.user ?? null;
      const admin = await resolveIsAdmin(newUser?.id ?? null);
      if (mounted.current) {
        setState({
          user: newUser,
          session: newSession,
          isAdmin: admin,
          loading: false,
          error: null,
        });
      }
    });

    return () => {
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signInWithGoogle = async () => {
    try {
      setState((s) => ({ ...s, loading: true, error: null }));

      const redirectTo =
        typeof window !== 'undefined'
          ? `${window.location.origin}/auth/callback`
          : undefined;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          // optional but recommended UX:
          queryParams: { prompt: 'select_account' },
        },
      });

      if (error) throw error;

      // On web, this call will redirect; if not (e.g., electron), we’ll fall through.
      setState((s) => ({ ...s, loading: false }));
    } catch (err: any) {
      console.error(err);
      setState((s) => ({ ...s, loading: false, error: err.message ?? 'Sign-in failed' }));
    }
  };

  const signOut = async () => {
    try {
      setState((s) => ({ ...s, loading: true, error: null }));
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setState({ user: null, session: null, isAdmin: false, loading: false, error: null });
    } catch (err: any) {
      console.error(err);
      setState((s) => ({ ...s, loading: false, error: err.message ?? 'Sign-out failed' }));
    }
  };

  // convenience booleans your components can use
  const canManageProducts = useMemo(() => state.isAdmin, [state.isAdmin]);
  const isAuthenticated = useMemo(() => Boolean(state.user), [state.user]);

  return {
    ...state,
    isAuthenticated,
    canManageProducts,
    signInWithGoogle,
    signOut,
    refetchAuth: loadSession,
  };
}
