import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize Supabase Auth Session and subscribe to changes
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        if (!isSupabaseConfigured || !supabase) {
          // No fake credentials or simulated accounts allowed per security specification
          if (mounted) {
            setUser(null);
            setSession(null);
            setLoading(false);
          }
          return;
        }

        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error fetching Supabase session:', error.message);
        }

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          setLoading(false);
        }
      } catch (err) {
        console.error('Auth initialization exception:', err);
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // Listen to Supabase auth state changes (OAuth redirects, token refresh, sign-in, sign-out)
    let subscription = null;
    if (isSupabaseConfigured && supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
        if (!mounted) return;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);

        // Sync user profile in Supabase database if logged in
        if (event === 'SIGNED_IN' && currentSession?.user) {
          try {
            const authUser = currentSession.user;
            await supabase.from('profiles').upsert({
              id: authUser.id,
              email: authUser.email,
              full_name:
                authUser.user_metadata?.full_name ||
                authUser.user_metadata?.name ||
                authUser.email?.split('@')[0] ||
                'Veltrix Member',
              avatar_url: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null,
              updated_at: new Date().toISOString(),
            });
          } catch {
            // Profile upsert fallback if table is not yet migrated
          }
        }
      });
      subscription = data.subscription;
    }

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Check whether backend auth is properly initialized
  const checkConfigured = () => {
    if (!isSupabaseConfigured || !supabase) {
      const msg =
        'Supabase non configuré : Veuillez renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans votre fichier .env pour activer les fonctionnalités réelles.';
      setAuthError(msg);
      return false;
    }
    return true;
  };

  // Google OAuth Sign-In (Official Google Identity standard)
  const signInWithGoogle = async () => {
    setAuthError(null);
    if (!checkConfigured()) return { success: false, error: 'Configuration Supabase manquante' };

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/account`,
          skipBrowserRedirect: true,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        setAuthError(error.message);
        return { success: false, error: error.message };
      }

      if (data?.url) {
        try {
          const preflight = await fetch(data.url);
          if (!preflight.ok) {
            const errJson = await preflight.json().catch(() => ({}));
            if (errJson.msg?.includes('provider is not enabled') || errJson.error_code === 'validation_failed') {
              const msg =
                "Le fournisseur Google n'est pas encore activé dans votre projet Supabase. Activez-le dans Supabase Dashboard > Authentication > Providers > Google.";
              setAuthError(msg);
              return { success: false, error: msg };
            }
          }
        } catch {
          // Preflight ignored if restricted by browser CORS, continue to redirect
        }

        window.location.href = data.url;
        return { success: true, data };
      }

      return { success: false, error: "URL d'autorisation Google introuvable." };
    } catch (err) {
      const msg = err.message || 'Échec de la connexion avec Google.';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // Apple Sign-In (Official Apple ID standard)
  const signInWithApple = async () => {
    setAuthError(null);
    if (!checkConfigured()) return { success: false, error: 'Configuration Supabase manquante' };

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/account`,
          skipBrowserRedirect: true,
          scopes: 'name email',
        },
      });

      if (error) {
        setAuthError(error.message);
        return { success: false, error: error.message };
      }

      if (data?.url) {
        try {
          const preflight = await fetch(data.url);
          if (!preflight.ok) {
            const errJson = await preflight.json().catch(() => ({}));
            if (errJson.msg?.includes('provider is not enabled') || errJson.error_code === 'validation_failed') {
              const msg =
                "Le fournisseur Apple n'est pas encore activé dans votre projet Supabase. Activez-le dans Supabase Dashboard > Authentication > Providers > Apple.";
              setAuthError(msg);
              return { success: false, error: msg };
            }
          }
        } catch {
          // Preflight ignored if restricted by browser CORS, continue to redirect
        }

        window.location.href = data.url;
        return { success: true, data };
      }

      return { success: false, error: "URL d'autorisation Apple introuvable." };
    } catch (err) {
      const msg = err.message || "Échec de la connexion avec l'identifiant Apple.";
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // Sign In with Email & Password
  const signInWithEmail = async (email, password) => {
    setAuthError(null);
    setLoading(true);

    if (!checkConfigured()) {
      setLoading(false);
      return { success: false, error: 'Configuration Supabase manquante' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthError(error.message);
        setLoading(false);
        return { success: false, error: error.message };
      }

      setSession(data.session);
      setUser(data.user);
      setLoading(false);
      return { success: true, user: data.user };
    } catch (err) {
      const msg = err.message || 'Impossible de se connecter. Veuillez réessayer.';
      setAuthError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  };

  // Sign Up with Email & Password
  const signUpWithEmail = async (email, password, { fullName } = {}) => {
    setAuthError(null);
    setLoading(true);

    if (!checkConfigured()) {
      setLoading(false);
      return { success: false, error: 'Configuration Supabase manquante' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || email.split('@')[0],
            tier: 'Obsidian Insider',
          },
          emailRedirectTo: `${window.location.origin}/account`,
        },
      });

      if (error) {
        setAuthError(error.message);
        setLoading(false);
        return { success: false, error: error.message };
      }

      setSession(data.session);
      setUser(data.user);
      setLoading(false);
      return {
        success: true,
        user: data.user,
        requiresEmailConfirmation: !data.session && Boolean(data.user),
      };
    } catch (err) {
      const msg = err.message || 'Impossible de créer le compte. Veuillez réessayer.';
      setAuthError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  };

  // Sign Out
  const signOutUser = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
      setUser(null);
      setSession(null);
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Send Password Reset Link
  const sendPasswordReset = async (email) => {
    setAuthError(null);
    if (!checkConfigured()) return { success: false, error: 'Configuration Supabase manquante' };

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setAuthError(error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err) {
      const msg = err.message || "Erreur lors de l'envoi de l'e-mail de réinitialisation.";
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // Update Password
  const updateUserPassword = async (newPassword) => {
    setAuthError(null);
    if (!checkConfigured()) return { success: false, error: 'Configuration Supabase manquante' };

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setAuthError(error.message);
        return { success: false, error: error.message };
      }
      return { success: true, user: data.user };
    } catch (err) {
      const msg = err.message || 'Impossible de modifier le mot de passe.';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        authError,
        setAuthError,
        isAuthenticated: Boolean(user),
        signInWithGoogle,
        signInWithApple,
        signInWithEmail,
        signUpWithEmail,
        signOutUser,
        sendPasswordReset,
        updateUserPassword,
        isSupabaseConnected: isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
