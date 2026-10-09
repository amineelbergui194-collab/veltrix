import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import { AuthLayout } from '../ui/AuthLayout';
import { PasswordInput } from '../ui/PasswordInput';
import { PrimaryButton } from '../ui/PrimaryButton';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ResetPasswordPage = () => {
  const { updateUserPassword, authError, setAuthError } = useAuth();
  const { navigateTo } = useShop();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!password) {
      errors.password = 'New password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    const result = await updateUserPassword(password);
    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Define a new secure password for your Veltrix account credentials."
      badgeText="Credential Update"
    >
      {isSuccess ? (
        <div className="text-center py-6 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold uppercase text-white">
            Password Updated
          </h2>

          <p className="text-sm text-neutral-300 leading-relaxed max-w-sm mx-auto">
            Your Veltrix account password has been successfully updated. You may now sign in with your updated credentials.
          </p>

          <div className="pt-4">
            <PrimaryButton
              onClick={() => navigateTo('login')}
              fullWidth
              size="md"
            >
              Sign In Now
            </PrimaryButton>
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

          {/* New Password */}
          <PasswordInput
            id="reset-password"
            name="password"
            label="New Password"
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
            id="reset-confirm-password"
            name="confirmPassword"
            label="Confirm New Password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (validationErrors.confirmPassword) setValidationErrors((prev) => ({ ...prev, confirmPassword: '' }));
            }}
            required
            autoComplete="new-password"
            error={validationErrors.confirmPassword}
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
                  <span>Updating Password...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>Save New Password</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </PrimaryButton>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
