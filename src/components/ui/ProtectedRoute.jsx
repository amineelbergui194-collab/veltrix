import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import { LoadingSpinner } from './LoadingSpinner';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { navigateTo } = useShop();

  useEffect(() => {
    if (!loading && !user) {
      navigateTo('login');
    }
  }, [user, loading, navigateTo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] flex flex-col items-center justify-center gap-4 text-[#D7E2EA] font-kanit">
        <LoadingSpinner size="lg" />
        <span className="text-xs uppercase tracking-widest text-neutral-400">
          Verifying Session...
        </span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};
