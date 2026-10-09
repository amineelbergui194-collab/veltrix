import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import { AuthLayout } from '../ui/AuthLayout';
import { FormInput } from '../ui/FormInput';
import { PasswordInput } from '../ui/PasswordInput';
import { PrimaryButton } from '../ui/PrimaryButton';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { SocialAuthButtons } from '../ui/SocialAuthButtons';
import { Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

export const LoginPage = () => {
  const { signInWithEmail, loading, authError, setAuthError, user, isSupabaseConnected } = useAuth();
  const { navigateTo } = useShop();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // If already logged in, redirect to account page
  useEffect(() => {
    if (user) {
      navigateTo('account');
    }
  }, [user, navigateTo]);

  const validate = () => {
    const errors = {};
    if (!email) {
      errors.email = 'L’adresse e-mail est requise';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Veuillez saisir une adresse e-mail valide';
    }
    if (!password) {
      errors.password = 'Le mot de passe est requis';
    } else if (password.length < 6) {
      errors.password = 'Le mot de passe doit comporter au moins 6 caractères';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    const result = await signInWithEmail(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigateTo('account');
    }
  };

  return (
    <AuthLayout
      title="Bienvenue sur Veltrix"
      subtitle="Connectez-vous à votre espace personnel sécurisé pour accéder à vos commandes, garanties et avantages exclusifs."
      badgeText="Portail Sécurisé Veltrix"
    >
      <div className="space-y-5">
        {/* Supabase status warning if missing */}
        {!isSupabaseConnected && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-amber-300 text-xs">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div className="leading-relaxed">
              Configuration Supabase requise : configurez vos clés OAuth Google et Apple dans votre projet Supabase pour activer la connexion en production.
            </div>
          </div>
        )}

        {/* Global Auth Error Banner */}
        {authError && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div className="leading-relaxed">{authError}</div>
          </div>
        )}

        {/* 1. Official Google & Apple Sign-In Buttons + "OU" Divider */}
        <SocialAuthButtons mode="login" />

        {/* 2. Standard Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <FormInput
            id="login-email"
            name="email"
            label="Adresse E-mail"
            type="email"
            placeholder="votre.email@domaine.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (validationErrors.email) setValidationErrors((prev) => ({ ...prev, email: '' }));
            }}
            icon={Mail}
            required
            autoComplete="email"
            error={validationErrors.email}
          />

          {/* Password Field */}
          <div>
            <PasswordInput
              id="login-password"
              name="password"
              label="Mot de passe"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (validationErrors.password) setValidationErrors((prev) => ({ ...prev, password: '' }));
              }}
              required
              autoComplete="current-password"
              error={validationErrors.password}
            />

            <div className="flex items-center justify-between mt-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-400 hover:text-neutral-200">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#141416] border-white/20 text-[#B600A8] focus:ring-[#B600A8] accent-[#B600A8]"
                />
                <span>Se souvenir de moi</span>
              </label>

              <button
                type="button"
                onClick={() => navigateTo('forgot-password')}
                className="text-[#D7E2EA] hover:text-white underline underline-offset-4 decoration-white/20 transition-colors cursor-pointer"
              >
                Mot de passe oublié ?
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <PrimaryButton
              type="submit"
              fullWidth
              disabled={isSubmitting || loading}
              size="lg"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span>Connexion en cours...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>Se connecter</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </PrimaryButton>
          </div>

          {/* Sign Up Redirect */}
          <div className="pt-4 text-center border-t border-white/5">
            <p className="text-xs text-neutral-400">
              Vous n’avez pas encore de compte Veltrix ?{' '}
              <button
                type="button"
                onClick={() => navigateTo('signup')}
                className="text-white font-bold hover:text-[#BBCCD7] underline underline-offset-4 ml-1 cursor-pointer"
              >
                Créer un compte
              </button>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};
