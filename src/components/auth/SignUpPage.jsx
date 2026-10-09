import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import { AuthLayout } from '../ui/AuthLayout';
import { FormInput } from '../ui/FormInput';
import { PasswordInput } from '../ui/PasswordInput';
import { PrimaryButton } from '../ui/PrimaryButton';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { SocialAuthButtons } from '../ui/SocialAuthButtons';
import { User, Mail, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

export const SignUpPage = () => {
  const { signUpWithEmail, loading, authError, setAuthError, user, isSupabaseConnected } = useAuth();
  const { navigateTo } = useShop();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (user) {
      navigateTo('account');
    }
  }, [user, navigateTo]);

  const validate = () => {
    const errors = {};
    if (!fullName.trim()) {
      errors.fullName = 'Le nom complet est requis';
    }
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
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    if (!agreeTerms) {
      errors.terms = 'Vous devez accepter les conditions d’utilisation pour créer un compte';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    const result = await signUpWithEmail(email, password, { fullName });
    setIsSubmitting(false);

    if (result.success) {
      if (result.requiresEmailConfirmation) {
        setSuccessInfo({
          type: 'verification_sent',
          message: `Un lien de confirmation a été envoyé à ${email}. Veuillez valider votre e-mail pour activer votre compte.`,
        });
      } else {
        navigateTo('account');
      }
    }
  };

  return (
    <AuthLayout
      title="Créer votre Compte"
      subtitle="Rejoignez le collectif Veltrix pour débloquer les tarifs membres, les garanties 2 ans et la livraison accélérée."
      badgeText="Nouvelle Adhésion Veltrix"
    >
      {successInfo ? (
        <div className="text-center py-6 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold uppercase text-white">
            Inscription Validée
          </h2>

          <p className="text-sm text-neutral-300 leading-relaxed max-w-sm mx-auto">
            {successInfo.message}
          </p>

          <div className="pt-4">
            <PrimaryButton
              onClick={() => navigateTo('login')}
              fullWidth
              size="md"
            >
              Passer à la Connexion
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {!isSupabaseConnected && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-amber-300 text-xs">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <div className="leading-relaxed">
                Supabase non configuré : Ajoutez vos clés de projet dans le fichier .env pour activer la création de comptes et le stockage des profils.
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
          <SocialAuthButtons mode="signup" />

          {/* 2. Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <FormInput
              id="signup-name"
              name="fullName"
              label="Nom Complet"
              placeholder="Karim El Amrani"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (validationErrors.fullName) setValidationErrors((prev) => ({ ...prev, fullName: '' }));
              }}
              icon={User}
              required
              autoComplete="name"
              error={validationErrors.fullName}
            />

            {/* Email Address */}
            <FormInput
              id="signup-email"
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

            {/* Password */}
            <PasswordInput
              id="signup-password"
              name="password"
              label="Mot de passe"
              placeholder="6 caractères minimum"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (validationErrors.password) setValidationErrors((prev) => ({ ...prev, password: '' }));
              }}
              required
              autoComplete="new-password"
              error={validationErrors.password}
            />

            {/* Confirm Password */}
            <PasswordInput
              id="signup-confirm-password"
              name="confirmPassword"
              label="Confirmer le mot de passe"
              placeholder="Retapez le mot de passe"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (validationErrors.confirmPassword) setValidationErrors((prev) => ({ ...prev, confirmPassword: '' }));
              }}
              required
              autoComplete="new-password"
              error={validationErrors.confirmPassword}
            />

            {/* Terms and conditions */}
            <div>
              <label className="flex items-start gap-2.5 text-xs text-neutral-400 hover:text-neutral-200 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    if (validationErrors.terms) setValidationErrors((prev) => ({ ...prev, terms: '' }));
                  }}
                  className="w-4 h-4 mt-0.5 rounded bg-[#141416] border-white/20 text-[#B600A8] focus:ring-[#B600A8] accent-[#B600A8]"
                />
                <span className="leading-snug">
                  J'accepte les <span className="text-white underline underline-offset-2">Conditions Générales</span> et la <span className="text-white underline underline-offset-2">Politique de Confidentialité</span>.
                </span>
              </label>
              {validationErrors.terms && (
                <span className="text-xs text-rose-400 mt-1 block font-kanit">
                  {validationErrors.terms}
                </span>
              )}
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
                    <span>Création du compte...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>Créer mon Compte</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </PrimaryButton>
            </div>

            {/* Login Redirect */}
            <div className="pt-4 text-center border-t border-white/5">
              <p className="text-xs text-neutral-400">
                Vous avez déjà un compte actif ?{' '}
                <button
                  type="button"
                  onClick={() => navigateTo('login')}
                  className="text-white font-bold hover:text-[#BBCCD7] underline underline-offset-4 ml-1 cursor-pointer"
                >
                  Se connecter
                </button>
              </p>
            </div>
          </form>
        </div>
      )}
    </AuthLayout>
  );
};
