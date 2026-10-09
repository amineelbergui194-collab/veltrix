import React from 'react';
import { motion } from 'framer-motion';

export const PrimaryButton = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  icon: Icon,
  size = 'md', // 'sm', 'md', 'lg'
  fullWidth = false,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-5 py-2 text-xs font-semibold',
    md: 'px-7 py-3 text-sm font-semibold tracking-wide',
    lg: 'px-8 py-4 text-base font-bold tracking-wider',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { y: -2, scale: 1.01 }}
      whileTap={disabled ? {} : { y: 1, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`btn-accent-gradient ${sizeStyles[size] || sizeStyles.md} ${
        fullWidth ? 'w-full' : ''
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      {...props}
    >
      <span>{children}</span>
      {Icon && <Icon className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />}
    </motion.button>
  );
};
