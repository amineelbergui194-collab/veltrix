import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';
import { AlertCircle } from 'lucide-react';

/**
 * Official Google & Apple Sign-In buttons
 * Strictly compliant with:
 * - Google Identity Branding Guidelines
 * - Apple Human Interface Guidelines (Sign in with Apple)
 */
export const SocialAuthButtons = ({ mode = 'login' }) => {
  const { signInWithGoogle, signInWithApple, loading: authLoading } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState(null);
  const [providerError, setProviderError] = useState(null);

  const actionText = mode === 'signup' ? "S'inscrire" : 'Continuer';

  const handleGoogleSignIn = async () => {
    setProviderError(null);
    setLoadingProvider('google');
    const result = await signInWithGoogle();
    if (!result.success) {
      setProviderError(result.error);
      setLoadingProvider(null);
    }
  };

  const handleAppleSignIn = async () => {
    setProviderError(null);
    setLoadingProvider('apple');
    const result = await signInWithApple();
    if (!result.success) {
      setProviderError(result.error);
      setLoadingProvider(null);
    }
  };

  const isGoogleLoading = loadingProvider === 'google';
  const isAppleLoading = loadingProvider === 'apple';
  const isDisabled = Boolean(loadingProvider) || authLoading;

  return (
    <div className="space-y-3 w-full">
      {providerError && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <div className="leading-relaxed">{providerError}</div>
        </div>
      )}

      {/* 1. Official Google Sign-In Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isDisabled}
        className="w-full h-11 px-4 rounded-xl bg-white hover:bg-neutral-100 active:bg-neutral-200 text-neutral-800 font-medium text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-3 border border-neutral-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4285F4]/40"
        aria-label={`${actionText} avec Google`}
      >
        {isGoogleLoading ? (
          <div className="flex items-center gap-2 text-neutral-700">
            <LoadingSpinner size="sm" />
            <span className="font-sans">Connexion à Google...</span>
          </div>
        ) : (
          <>
            {/* Official 4-Color Google "G" Logo */}
            <svg
              className="w-4 h-4 shrink-0"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span className="font-sans font-medium tracking-tight">
              {actionText} avec Google
            </span>
          </>
        )}
      </button>

      {/* 2. Official Apple Sign-In Button */}
      <button
        type="button"
        onClick={handleAppleSignIn}
        disabled={isDisabled}
        className="w-full h-11 px-4 rounded-xl bg-black hover:bg-neutral-900 active:bg-neutral-950 text-white font-medium text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-3 border border-white/20 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40"
        aria-label={`${actionText} avec Apple`}
      >
        {isAppleLoading ? (
          <div className="flex items-center gap-2 text-white">
            <LoadingSpinner size="sm" />
            <span className="font-sans">Connexion à Apple...</span>
          </div>
        ) : (
          <>
            {/* Official Apple Logo */}
            <svg
              className="w-4 h-4 shrink-0 fill-current text-white"
              viewBox="0 0 170 170"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.6-7.79-11.74-14.25-5.97-9.33-10.74-19.98-14.32-31.94-3.58-11.96-5.37-23.3-5.37-34.02 0-14.67 3.77-26.96 11.31-36.87 7.55-9.91 17.2-14.95 28.98-15.14 5.34 0 10.98 1.34 16.92 4.02 5.94 2.68 9.94 4.09 12 4.22 2.62-.33 6.94-1.87 12.95-4.63 6.01-2.76 11.45-4.04 16.32-3.83 14.56.78 25.84 5.92 33.82 15.42-12.82 7.76-19.11 18.25-18.87 31.47.24 10.3 4.23 19 11.97 26.09 7.74 7.09 17.15 11.03 28.23 11.82-2.14 6.74-4.8 13.36-7.98 19.86zM119.22 33.15c0-7.39 2.69-14.42 8.07-21.08 5.38-6.66 12.06-10.99 20.04-12.98.24 1.13.36 2.05.36 2.76 0 7.39-2.76 14.48-8.28 21.27-5.52 6.79-12.3 11.12-20.35 13-0.08-.85-.12-1.84-.12-2.97z" />
            </svg>
            <span className="font-sans font-medium tracking-tight">
              {actionText} avec Apple
            </span>
          </>
        )}
      </button>

      {/* Visual divider "OU" */}
      <div className="relative py-2 flex items-center">
        <div className="flex-grow border-t border-white/10" />
        <span className="shrink-0 mx-4 text-[11px] font-mono uppercase tracking-widest text-neutral-400">
          OU
        </span>
        <div className="flex-grow border-t border-white/10" />
      </div>
    </div>
  );
};
