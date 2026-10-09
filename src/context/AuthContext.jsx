import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize Supabase Auth Session
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        if (!isSupabaseConfigured || !supabase) {
          // If no supabase credentials provided, check localStorage for simulated session
          const savedLocalUser = localStorage.getItem('veltrix_auth_user');
          if (savedLocalUser) {
            setUser(JSON.parse(savedLocalUser));
          }
          setLoading(false);
          return;
        }

        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Error fetching Supabase session:', error.message);
        }

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          setLoading(false);
        }
      } catch (err) {
        console.warn('Auth initialization exception:', err);
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // Listen to Supabase auth state changes
    let subscription = null;
    if (isSupabaseConfigured && supabase) {
      const { data } = supabase.auth.onAuthStateChange((_event, currentSession) => {
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setLoading(false);
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

  // Sign In with Email & Password
  const signInWithEmail = async (email, password) => {
    setAuthError(null);
    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
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
      } else {
        // Fallback simulated sign in for development/offline
        const mockUser = {
          id: 'user_' + Date.now(),
          email,
          user_metadata: {
            full_name: email.split('@')[0].toUpperCase(),
            tier: 'Obsidian Insider'
          },
          created_at: new Date().toISOString()
        };
        localStorage.setItem('veltrix_auth_user', JSON.stringify(mockUser));
        setUser(mockUser);
        setLoading(false);
        return { success: true, user: mockUser };
      }
    } catch (err) {
      const msg = err.message || 'Failed to sign in. Please try again.';
      setAuthError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  };

  // Sign Up with Email & Password
  const signUpWithEmail = async (email, password, { fullName } = {}) => {
    setAuthError(null);
    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName || email.split('@')[0],
              tier: 'Obsidian Insider'
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
      } else {
        // Fallback simulated sign up
        const mockUser = {
          id: 'user_' + Date.now(),
          email,
          user_metadata: {
            full_name: fullName || email.split('@')[0],
            tier: 'Obsidian Insider'
          },
          created_at: new Date().toISOString()
        };
        localStorage.setItem('veltrix_auth_user', JSON.stringify(mockUser));
        setUser(mockUser);
        setLoading(false);
        return { success: true, user: mockUser, requiresEmailConfirmation: false };
      }
    } catch (err) {
      const msg = err.message || 'Failed to register account. Please try again.';
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
      localStorage.removeItem('veltrix_auth_user');
      setUser(null);
      setSession(null);
    } catch (err) {
      console.warn('Sign out error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Send Password Reset Link
  const sendPasswordReset = async (email) => {
    setAuthError(null);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
          setAuthError(error.message);
          return { success: false, error: error.message };
        }
        return { success: true };
      } else {
        return { success: true, message: 'Password recovery email sent (simulated).' };
      }
    } catch (err) {
      const msg = err.message || 'Error sending password reset email.';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // Update Password
  const updateUserPassword = async (newPassword) => {
    setAuthError(null);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) {
          setAuthError(error.message);
          return { success: false, error: error.message };
        }
        return { success: true, user: data.user };
      } else {
        return { success: true };
      }
    } catch (err) {
      const msg = err.message || 'Failed to update password.';
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
