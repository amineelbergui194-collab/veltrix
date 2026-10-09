import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import { AuthLayout } from '../ui/AuthLayout';
import { FormInput } from '../ui/FormInput';
import { PrimaryButton } from '../ui/PrimaryButton';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Mail, ArrowLeft, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const { sendPasswordReset, authError, setAuthError } = useAuth();
  const { navigateTo } = useShop();

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setValidationError('');

    if (!email) {
      setValidationError('Please enter your email address');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    const result = await sendPasswordReset(email);
    setIsSubmitting(false);

    if (result.success) {
      setIsSubmitted(true);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="Enter the email associated with your Veltrix account, and we'll send you an encrypted password recovery link."
      badgeText="Security & Recovery"
    >
      {isSubmitted ? (
        <div className="text-center py-6 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold uppercase text-white">
            Recovery Email Sent
          </h2>

          <p className="text-sm text-neutral-300 leading-relaxed max-w-sm mx-auto">
            If an account exists for <strong className="text-white">{email}</strong>, a reset link with instructions has been dispatched. Please check your inbox and spam folder.
          </p>

          <div className="pt-4 flex flex-col gap-3">
            <PrimaryButton
              onClick={() => navigateTo('login')}
              fullWidth
              size="md"
            >
              Return to Sign In
            </PrimaryButton>

            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setEmail('');
              }}
              className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer py-1"
            >
              Need to try another email?
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Auth Error Banner */}
          {authError && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <div className="leading-relaxed">{authError}</div>
            </div>
          )}

          {/* Email input */}
          <FormInput
            id="forgot-email"
            name="email"
            label="Account Email"
            type="email"
            placeholder="your.email@domain.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (validationError) setValidationError('');
            }}
            icon={Mail}
            required
            autoComplete="email"
            error={validationError}
            helperText="We will never share your email with third parties."
          />

          {/* Submit */}
          <div className="pt-2">
            <PrimaryButton
              type="submit"
              fullWidth
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span>Sending Link...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </PrimaryButton>
          </div>

          {/* Back to Login */}
          <div className="pt-4 text-center border-t border-white/5">
            <button
              type="button"
              onClick={() => navigateTo('login')}
              className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
