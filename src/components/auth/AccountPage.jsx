import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import { ProtectedRoute } from '../ui/ProtectedRoute';
import { SecondaryButton } from '../ui/SecondaryButton';
import {
  User,
  Package,
  ShieldCheck,
  LogOut,
  Sparkles,
  ArrowRight,
  Truck
} from 'lucide-react';

const AccountContent = () => {
  const { user, signOutUser, loading } = useAuth();
  const { navigateTo, wishlist, cart } = useShop();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'profile', 'warranty'

  const userEmail = user?.email || 'member@veltrix.tech';
  const userName =
    user?.user_metadata?.full_name ||
    userEmail.split('@')[0].toUpperCase();
  const userTier = user?.user_metadata?.tier || 'Obsidian VIP Insider';

  const mockOrders = [
    {
      id: 'VELT-94281',
      date: 'October 4, 2026',
      status: 'In Transit',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      total: '120.00 DH',
      items: [
        { name: 'AirPods Pro 2 (USB-C MagSafe)', qty: 1, color: 'White Gloss' }
      ],
      trackingNumber: 'MA-EXP-9021482'
    },
    {
      id: 'VELT-81903',
      date: 'September 18, 2026',
      status: 'Delivered',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      total: '190.00 DH',
      items: [
        { name: 'USB-C Fast Charging Cable 100W', qty: 2, color: 'Stealth Black' },
        { name: 'MagSafe Wireless Charger 15W', qty: 1, color: 'Silver' }
      ],
      trackingNumber: 'MA-EXP-7729103'
    }
  ];

  const handleSignOut = async () => {
    await signOutUser();
    navigateTo('login');
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#D7E2EA] font-kanit pt-8 pb-20">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,rgba(182,0,168,0.12)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 mb-6">
          <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors cursor-pointer">
            Home
          </button>
          <span>/</span>
          <span className="text-[#BBCCD7]">Account Portal</span>
        </div>

        {/* PROFILE HEADER CARD */}
        <div className="rounded-3xl bg-[#121214]/90 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-2xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* User Avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-accent-gradient flex items-center justify-center p-0.5 shadow-xl shadow-[#B600A8]/30 shrink-0">
                <div className="w-full h-full bg-[#0C0C0C] rounded-[14px] flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">
                    {userName.charAt(0)}
                  </span>
                </div>
              </div>

              {/* User Information */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider text-[#FF66EA] mb-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>{userTier}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
                  {userName}
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 font-light mt-0.5">
                  {userEmail}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <SecondaryButton
                onClick={() => navigateTo('shop')}
                size="sm"
                icon={ArrowRight}
              >
                Browse Catalog
              </SecondaryButton>
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="px-5 py-2.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/5 text-xs">
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-neutral-400 block text-[11px] uppercase tracking-wider">Active Orders</span>
              <span className="text-xl font-bold text-white font-mono mt-1 block">1</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-neutral-400 block text-[11px] uppercase tracking-wider">Wishlisted Items</span>
              <span className="text-xl font-bold text-white font-mono mt-1 block">{wishlist.length}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-neutral-400 block text-[11px] uppercase tracking-wider">Cart Reserve</span>
              <span className="text-xl font-bold text-white font-mono mt-1 block">{cart.length} items</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-neutral-400 block text-[11px] uppercase tracking-wider">Hardware Warranty</span>
              <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block">Active (2 Yrs)</span>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex items-center gap-2 border-b border-white/10 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History ({mockOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('warranty')}
            className={`px-5 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'warranty'
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Warranties & Serial Claims</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Security & Preferences</span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-3xl bg-[#121214]/80 border border-white/10 p-6 backdrop-blur-xl transition-all hover:border-white/20"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white font-mono text-base">
                        {order.id}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-400 font-light mt-0.5 block">
                      Ordered on {order.date}
                    </span>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-neutral-400 block">Total</span>
                    <span className="text-base font-bold text-white font-mono">
                      {order.total}
                    </span>
                  </div>
                </div>

                <div className="py-4 space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-neutral-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B600A8]" />
                        <span>{item.qty}x {item.name}</span>
                        <span className="text-neutral-500">({item.color})</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-neutral-400 font-mono">
                    <Truck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Tracking: {order.trackingNumber}</span>
                  </div>

                  <button
                    onClick={() => navigateTo('shop')}
                    className="text-xs text-[#BBCCD7] hover:text-white underline underline-offset-4 cursor-pointer"
                  >
                    View Order Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'warranty' && (
          <div className="rounded-3xl bg-[#121214]/80 border border-white/10 p-6 sm:p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold uppercase text-white">
                  2-Year Veltrix Protection Plan
                </h3>
                <p className="text-xs text-neutral-400">
                  Every Veltrix device includes comprehensive thermal, component, and sound calibration guarantees.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-neutral-300 space-y-2 my-4">
              <div>• <strong>Serial #VTX-739281-H2:</strong> AirPods Pro 2 (Coverage until October 2028)</div>
              <div>• <strong>Serial #VTX-119280-CAB:</strong> 100W Kevlar Braided Cable (Lifetime replacement eligible)</div>
            </div>

            <div className="pt-2">
              <SecondaryButton
                onClick={() => alert('Support team notified. An agent will contact your account email.')}
                size="sm"
              >
                File a Warranty Claim
              </SecondaryButton>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="rounded-3xl bg-[#121214]/80 border border-white/10 p-6 sm:p-8 backdrop-blur-xl space-y-6">
            <div>
              <h3 className="text-lg font-bold uppercase text-white mb-1">
                Account Credentials
              </h3>
              <p className="text-xs text-neutral-400">
                Manage your authenticated email and password preferences.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs">
                <span className="text-neutral-400 block text-[11px] uppercase tracking-wider">Registered Email</span>
                <span className="text-sm font-semibold text-white block mt-1">{userEmail}</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs">
                <span className="text-neutral-400 block text-[11px] uppercase tracking-wider">Auth Provider</span>
                <span className="text-sm font-semibold text-white block mt-1">Supabase Secure Cloud</span>
              </div>
            </div>

            <div className="pt-2">
              <SecondaryButton
                onClick={() => navigateTo('reset-password')}
                size="sm"
              >
                Update Password
              </SecondaryButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const AccountPage = () => {
  return (
    <ProtectedRoute>
      <AccountContent />
    </ProtectedRoute>
  );
};
