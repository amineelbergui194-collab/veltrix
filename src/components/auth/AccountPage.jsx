import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import { supabase } from '../../supabase';
import { ProtectedRoute } from '../ui/ProtectedRoute';
import { SecondaryButton } from '../ui/SecondaryButton';
import { formatPrice } from '../../data/products';
import {
  User,
  Package,
  ShieldCheck,
  LogOut,
  Sparkles,
  ArrowRight,
  Truck,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';

const AccountContent = () => {
  const { user, signOutUser, loading: authLoading } = useAuth();
  const { navigateTo, wishlist, cart } = useShop();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'profile', 'warranty'
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const userEmail = user?.email || 'membre@veltrix.tech';
  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    userEmail.split('@')[0].toUpperCase();
  const userTier = user?.user_metadata?.tier || 'Obsidian VIP Insider';

  // Identify connected auth provider
  const getProviderInfo = () => {
    const provider = user?.app_metadata?.provider || 'email';
    if (provider === 'google') {
      return { name: 'Google Workspace OAuth', badge: 'Compte Google vérifié' };
    }
    if (provider === 'apple') {
      return { name: 'Apple ID Sign-in', badge: 'Identifiant Apple sécurisé' };
    }
    return { name: 'Authentification E-mail & Mot de passe', badge: 'Supabase Cloud Auth' };
  };

  const providerInfo = getProviderInfo();

  // Load real orders from Supabase
  useEffect(() => {
    let isSubscribed = true;

    const fetchUserOrders = async () => {
      if (!user?.id || !supabase) {
        setOrdersLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Orders fetch error (table may not exist yet):', error.message);
        } else if (isSubscribed && data) {
          setOrders(data);
        }
      } catch (err) {
        console.warn('Exception fetching orders:', err);
      } finally {
        if (isSubscribed) setOrdersLoading(false);
      }
    };

    fetchUserOrders();
    return () => {
      isSubscribed = false;
    };
  }, [user]);

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
            Accueil
          </button>
          <span>/</span>
          <span className="text-[#BBCCD7]">Espace Personnel</span>
        </div>

        {/* PROFILE HEADER CARD */}
        <div className="rounded-3xl bg-[#121214]/90 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-2xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* User Avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#B600A8] via-[#FF66EA] to-cyan-400 flex items-center justify-center p-0.5 shadow-xl shadow-[#B600A8]/30 shrink-0">
                <div className="w-full h-full bg-[#0C0C0C] rounded-[14px] flex items-center justify-center overflow-hidden">
                  {user?.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt={userName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl sm:text-3xl font-extrabold text-white">
                      {userName.charAt(0)}
                    </span>
                  )}
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
                  {userEmail} • <span className="text-neutral-500">{providerInfo.badge}</span>
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
                Explorer le Catalogue
              </SecondaryButton>
              <button
                onClick={handleSignOut}
                disabled={authLoading}
                className="px-5 py-2.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/5 text-xs">
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-neutral-400 block text-[11px] uppercase tracking-wider">Commandes Enregistrées</span>
              <span className="text-xl font-bold text-white font-mono mt-1 block">
                {ordersLoading ? '...' : orders.length}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-neutral-400 block text-[11px] uppercase tracking-wider">Articles en Favoris</span>
              <span className="text-xl font-bold text-white font-mono mt-1 block">{wishlist.length}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-neutral-400 block text-[11px] uppercase tracking-wider">Panier Actuel</span>
              <span className="text-xl font-bold text-white font-mono mt-1 block">{cart.length} articles</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-neutral-400 block text-[11px] uppercase tracking-wider">Garantie Matériel</span>
              <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block">Active (2 Ans)</span>
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
            <span>Historique des Commandes ({orders.length})</span>
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
            <span>Garanties & Certifications</span>
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
            <span>Sécurité & Compte</span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {ordersLoading ? (
              <div className="p-12 text-center rounded-3xl bg-[#121214]/60 border border-white/10">
                <span className="text-xs text-neutral-400">Chargement de vos commandes en cours...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#121214]/60 border border-white/10 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-neutral-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white uppercase">Aucune commande pour le moment</h3>
                  <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                    Toutes vos commandes validées avec PayPal, Carte Bancaire ou Apple Pay apparaîtront ici automatiquement avec leur numéro de suivi et reçus.
                  </p>
                </div>
                <div className="pt-2">
                  <SecondaryButton onClick={() => navigateTo('shop')} size="sm">
                    Découvrir les produits Veltrix
                  </SecondaryButton>
                </div>
              </div>
            ) : (
              orders.map((order) => (
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
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                            order.status === 'paid'
                              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                              : order.status === 'pending'
                              ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                              : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                          }`}
                        >
                          {order.status === 'paid' ? 'Payée & Confirmée' : order.status}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-white/5 text-neutral-400 border border-white/5">
                          {order.payment_provider || 'Paiement Sécurisé'}
                        </span>
                      </div>
                      <span className="text-xs text-neutral-400 font-light mt-0.5 block">
                        Commandé le {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-neutral-400 block">Total Réglé</span>
                      <span className="text-base font-bold text-white font-mono">
                        {formatPrice(order.total_amount)}
                      </span>
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="py-4 space-y-2">
                    {order.order_items?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-neutral-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B600A8]" />
                          <span>{item.quantity}x {item.product_name}</span>
                          {item.color_name && <span className="text-neutral-500">({item.color_name})</span>}
                        </div>
                        <span className="font-mono text-neutral-400">
                          {formatPrice(item.unit_price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-neutral-400 font-mono">
                      <Truck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Réf Transaction : {order.provider_payment_id || order.id}</span>
                    </div>

                    {order.receipt_url && (
                      <a
                        href={order.receipt_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-4 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Télécharger le Reçu Officiel</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
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
                  Garantie Veltrix 2 Ans Intégrée
                </h3>
                <p className="text-xs text-neutral-400">
                  Chaque appareil et accessoire Veltrix bénéficie d'une garantie matérielle avec échange à neuf ou réparation certifiée.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-neutral-300 space-y-2 my-4">
              <div>• <strong>Couverture :</strong> Composants internes, modules acoustiques, puces GaN et connecteurs MagSafe.</div>
              <div>• <strong>Procédure de réclamation :</strong> Contactez le support technique avec votre référence de commande.</div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="rounded-3xl bg-[#121214]/80 border border-white/10 p-6 sm:p-8 backdrop-blur-xl space-y-6">
            <div>
              <h3 className="text-lg font-bold uppercase text-white mb-1">
                Identifiants & Sécurité du Compte
              </h3>
              <p className="text-xs text-neutral-400">
                Gérez vos méthodes d’authentification sécurisées et vos préférences.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs">
                <span className="text-neutral-400 block text-[11px] uppercase tracking-wider">Adresse E-mail</span>
                <span className="text-sm font-semibold text-white block mt-1">{userEmail}</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs">
                <span className="text-neutral-400 block text-[11px] uppercase tracking-wider">Fournisseur d'Authentification</span>
                <span className="text-sm font-semibold text-white block mt-1">{providerInfo.name}</span>
              </div>
            </div>

            <div className="pt-2">
              <SecondaryButton
                onClick={() => navigateTo('reset-password')}
                size="sm"
              >
                Mettre à jour le Mot de Passe
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
