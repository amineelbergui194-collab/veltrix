import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export const PasswordInput = ({
  id,
  name,
  label,
  placeholder = '••••••••',
  value,
  onChange,
  required = false,
  error = '',
  helperText = '',
  className = '',
  disabled = false,
  autoComplete = 'current-password',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs uppercase tracking-wider font-semibold text-[#D7E2EA] font-kanit flex items-center justify-between"
        >
          <span>
            {label} {required && <span className="text-[#FF66EA]">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none text-neutral-400">
          <Lock className="w-4 h-4" />
        </div>

        <input
          id={id}
          name={name || id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`w-full py-3.5 pl-11 pr-12 rounded-2xl bg-[#141416] border text-sm text-[#D7E2EA] placeholder-neutral-500 font-kanit transition-all duration-200 outline-none ${
            error
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50'
              : 'border-white/10 hover:border-white/20 focus:border-[#B600A8] focus:ring-1 focus:ring-[#B600A8]/40'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {error ? (
        <span className="text-xs text-rose-400 font-kanit tracking-wide">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-neutral-400 font-kanit">{helperText}</span>
      ) : null}
    </div>
  );
};
