import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import { AuthLayout } from '../ui/AuthLayout';
import { FormInput } from '../ui/FormInput';
import { PasswordInput } from '../ui/PasswordInput';
import { PrimaryButton } from '../ui/PrimaryButton';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Mail, ArrowRight, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const { signInWithEmail, loading, authError, setAuthError, user } = useAuth();
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
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
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
      title="Welcome Back"
      subtitle="Sign in with your Veltrix credentials to access your orders, warranties, and member benefits."
      badgeText="Veltrix Portal Access"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Auth Error Banner */}
        {authError && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div className="leading-relaxed">{authError}</div>
          </div>
        )}

        {/* Email Field */}
        <FormInput
          id="login-email"
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

        {/* Password Field */}
        <div>
          <PasswordInput
            id="login-password"
            name="password"
            label="Password"
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
              <span>Remember me</span>
            </label>

            <button
              type="button"
              onClick={() => navigateTo('forgot-password')}
              className="text-[#D7E2EA] hover:text-white underline underline-offset-4 decoration-white/20 transition-colors cursor-pointer"
            >
              Forgot password?
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
                <span>Signing In...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </PrimaryButton>
        </div>

        {/* Sign Up Redirect */}
        <div className="pt-4 text-center border-t border-white/5">
          <p className="text-xs text-neutral-400">
            Don't have a Veltrix account yet?{' '}
            <button
              type="button"
              onClick={() => navigateTo('signup')}
              className="text-white font-bold hover:text-[#BBCCD7] underline underline-offset-4 ml-1 cursor-pointer"
            >
              Create Account
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};
