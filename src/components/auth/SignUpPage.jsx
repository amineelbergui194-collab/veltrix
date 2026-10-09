import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import { AuthLayout } from '../ui/AuthLayout';
import { FormInput } from '../ui/FormInput';
import { PasswordInput } from '../ui/PasswordInput';
import { PrimaryButton } from '../ui/PrimaryButton';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { User, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const SignUpPage = () => {
  const { signUpWithEmail, loading, authError, setAuthError, user } = useAuth();
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
      errors.fullName = 'Full name is required';
    }
    if (!email) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!agreeTerms) {
      errors.terms = 'You must agree to the Terms & Privacy Policy to register';
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
          message: `A confirmation link has been dispatched to ${email}. Please verify your email to activate your account.`,
        });
      } else {
        navigateTo('account');
      }
    }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join the Veltrix collective to unlock member pricing, 2-year warranty registrations, and expedited delivery."
      badgeText="New Membership Registration"
    >
      {successInfo ? (
        <div className="text-center py-6 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold uppercase text-white">
            Registration Dispatched
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
              Proceed to Sign In
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Auth Error Banner */}
          {authError && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <div className="leading-relaxed">{authError}</div>
            </div>
          )}

          {/* Full Name */}
          <FormInput
            id="signup-name"
            name="fullName"
            label="Full Name"
            placeholder="John Doe"
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
            label="Email Address"
            type="email"
            placeholder="your.email@domain.com"
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
            label="Password"
            placeholder="Minimum 6 characters"
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
            label="Confirm Password"
            placeholder="Re-enter password"
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
                I agree to the <span className="text-white underline underline-offset-2">Terms of Service</span> and <span className="text-white underline underline-offset-2">Privacy Policy</span>.
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
                  <span>Creating Account...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </PrimaryButton>
          </div>

          {/* Login Redirect */}
          <div className="pt-4 text-center border-t border-white/5">
            <p className="text-xs text-neutral-400">
              Already have an active account?{' '}
              <button
                type="button"
                onClick={() => navigateTo('login')}
                className="text-white font-bold hover:text-[#BBCCD7] underline underline-offset-4 ml-1 cursor-pointer"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
