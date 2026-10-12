import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { PRODUCTS, formatPrice, setProductPrice, resetProductPrice } from '../../data/products';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import {
  Package,
  CheckCircle2,
  Truck,
  Phone,
  MapPin,
  Search,
  RefreshCw,
  Banknote,
  CreditCard,
  ArrowLeft,
  User,
  Calendar,
  SlidersHorizontal,
  Tag,
  Save,
  RotateCcw,
  ExternalLink,
  Check,
  Sparkles,
} from 'lucide-react';

export const AdminOrdersPage = () => {
  const { navigateTo, addToast } = useShop();
  
  // Navigation tabs: 'orders' | 'products'
  const [activeAdminTab, setActiveAdminTab] = useState('orders');

  // Orders state
  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    pendingCodOrders: 0,
    paidOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'pending_payment', 'paid', 'shipped', 'delivered', 'cancelled'
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Products catalog & price editing state
  const [productsList, setProductsList] = useState(PRODUCTS);
  const [editingPrices, setEditingPrices] = useState({});
  const [updatingProductId, setUpdatingProductId] = useState(null);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = `/api/admin/orders?status=${activeFilter}&search=${encodeURIComponent(searchQuery)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des commandes.');
      }
      const data = await response.json();
      setOrders(data.orders || []);
      if (data.metrics) {
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error('Fetch admin orders error:', err);
      addToast('Erreur de synchronisation des commandes : ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        if (data.products && Array.isArray(data.products)) {
          setProductsList(data.products);
          return;
        }
      }
    } catch {
      // Fallback to local catalog
    }
    setProductsList([...PRODUCTS]);
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, [activeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  // Mettre à jour le statut d'une commande
  const handleUpdateStatus = async (orderId, newStatus, adminNote = null) => {
    setUpdatingOrderId(orderId);
    try {
      const response = await fetch('/api/admin/orders/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          status: newStatus,
          adminNotes: adminNote,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Échec de la mise à jour.');
      }

      addToast(
        `Commande ${orderId} : statut changé en « ${formatStatusLabel(newStatus)} »`,
        'success'
      );
      fetchOrders();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Marquer une commande COD comme payée (encaissée en espèces)
  const handleMarkAsPaid = async (orderId) => {
    const confirmation = window.confirm(
      `Confirmez-vous avoir reçu l'encaissement en espèces pour la commande ${orderId} ?`
    );
    if (!confirmation) return;

    await handleUpdateStatus(orderId, 'paid', 'Montant encaissé en espèces par le transporteur.');
  };

  // Mettre à jour le prix d'un produit (ex: Apple EarPods)
  const handleSavePrice = async (productId) => {
    const newPriceVal = editingPrices[productId];
    if (newPriceVal === undefined || newPriceVal === '') return;
    const numPrice = Number(newPriceVal);
    if (isNaN(numPrice) || numPrice <= 0) {
      addToast('Veuillez saisir un prix valide supérieur à 0 MAD.', 'error');
      return;
    }

    setUpdatingProductId(productId);
    try {
      const res = await fetch('/api/admin/products/update-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, price: numPrice }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Erreur lors de la mise à jour du prix.');
      }

      setProductPrice(productId, numPrice);
      setProductsList((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, price: numPrice, isPriceOverridden: true } : p))
      );
      setEditingPrices((prev) => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });

      const prod = productsList.find((p) => p.id === productId);
      addToast(
        `Prix de « ${prod?.name || productId} » mis à jour avec succès : ${formatPrice(numPrice)} (${numPrice} MAD)`,
        'success'
      );
    } catch (_err) {
      setProductPrice(productId, numPrice);
      setProductsList((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, price: numPrice, isPriceOverridden: true } : p))
      );
      addToast(`Prix mis à jour en local : ${formatPrice(numPrice)} (${numPrice} MAD)`, 'success');
    } finally {
      setUpdatingProductId(null);
    }
  };

  // Réinitialiser le prix au tarif initial standard
  const handleResetPrice = async (productId) => {
    const success = resetProductPrice(productId);
    if (success) {
      const prod = PRODUCTS.find((p) => p.id === productId);
      const defaultPrice = prod ? prod.price : 70;
      setProductsList((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, price: defaultPrice, isPriceOverridden: false } : p))
      );
      setEditingPrices((prev) => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });

      try {
        await fetch('/api/admin/products/update-price', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, price: defaultPrice }),
        });
      } catch {}

      addToast(`Prix réinitialisé à la valeur standard : ${formatPrice(defaultPrice)} (${defaultPrice} MAD)`, 'info');
    }
  };

  const formatStatusLabel = (status) => {
    switch (status) {
      case 'pending_payment':
      case 'pending':
        return 'En attente de paiement';
      case 'paid':
        return 'Payée & Encaissée';
      case 'processing':
        return 'En préparation';
      case 'shipped':
        return 'En cours de livraison';
      case 'delivered':
        return 'Colis livré';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending_payment':
      case 'pending':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-300';
      case 'paid':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300';
      case 'shipped':
        return 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300';
      case 'delivered':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-300';
      case 'cancelled':
        return 'bg-rose-500/10 border-rose-500/30 text-rose-300';
      default:
        return 'bg-neutral-800 border-neutral-700 text-neutral-300';
    }
  };

  const filteredProducts = productsList.filter((p) => {
    if (productCategoryFilter !== 'all') {
      if (p.categorySlug !== productCategoryFilter && p.category?.toLowerCase() !== productCategoryFilter) {
        return false;
      }
    }
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchCat = p.category?.toLowerCase().includes(q);
      const matchBrand = p.brand?.toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchBrand) return false;
    }
    return true;
  });

  return (
    <div className="py-10 bg-[#0C0C0C] text-[#D7E2EA] font-kanit min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <button
              onClick={() => navigateTo('home')}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white mb-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour à la Boutique</span>
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
                {activeAdminTab === 'orders' ? 'Gestion des Commandes' : 'Catalogue & Gestion des Tarifs'}
              </h1>
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase">
                Console Administrateur
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 font-sans">
              {activeAdminTab === 'orders'
                ? 'Consultez, validez et modifiez le statut des commandes en ligne et des règlements à la livraison (Cash on Delivery).'
                : 'Consultez le catalogue Veltrix Store et ajustez les prix de vente en temps réel (en Dirhams Marocains / MAD).'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (activeAdminTab === 'orders') fetchOrders();
                else fetchProducts();
              }}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
              <span>Actualiser</span>
            </button>
          </div>
        </div>

        {/* ADMIN TAB NAVIGATION: Commandes vs Catalogue Produits */}
        <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveAdminTab('orders')}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${
              activeAdminTab === 'orders'
                ? 'bg-cyan-400 text-neutral-950 shadow-lg shadow-cyan-400/20'
                : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Commandes ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('products')}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${
              activeAdminTab === 'products'
                ? 'bg-cyan-400 text-neutral-950 shadow-lg shadow-cyan-400/20'
                : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Catalogue & Tarifs ({productsList.length} Produits)</span>
          </button>
        </div>

        {/* TAB 1: GESTION DES COMMANDES (ORDERS) */}
        {activeAdminTab === 'orders' && (
          <>
            {/* METRICS CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-[#121214] border border-white/10 space-y-1">
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                  Total Commandes
                </span>
                <div className="text-2xl font-bold font-mono text-white">
                  {metrics.totalOrders}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-amber-300/80 uppercase tracking-wider block">
                    En Attente COD (Espèces)
                  </span>
                  <Banknote className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-amber-300">
                  {metrics.pendingCodOrders}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-emerald-300/80 uppercase tracking-wider block">
                    Commandes Payées
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-300">
                  {metrics.paidOrders}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#121214] border border-white/10 space-y-1">
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                  Recettes Encaissées
                </span>
                <div className="text-2xl font-bold font-mono text-cyan-300">
                  {formatPrice(metrics.totalRevenue)}
                </div>
              </div>
            </div>

            {/* CONTROLS: FILTERS & SEARCH */}
            <div className="p-4 rounded-2xl bg-[#121214] border border-white/10 mb-8 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {[
                    { id: 'all', label: 'Toutes les Commandes' },
                    { id: 'pending_payment', label: 'En attente COD' },
                    { id: 'paid', label: 'Payées & Encaissées' },
                    { id: 'shipped', label: 'En cours de livraison' },
                    { id: 'delivered', label: 'Livrées' },
                    { id: 'cancelled', label: 'Annulées' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFilter(tab.id)}
                      className={`px-3.5 py-2 rounded-xl font-medium tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                        activeFilter === tab.id
                          ? 'bg-cyan-400 text-neutral-950 font-bold shadow-md shadow-cyan-400/20'
                          : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Search Box */}
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-sm w-full">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ID commande, client, tél, ville..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-mono text-white cursor-pointer"
                  >
                    Filtrer
                  </button>
                </form>
              </div>
            </div>

            {/* ORDERS LIST */}
            {loading ? (
              <div className="p-16 rounded-3xl bg-[#121214] border border-white/10 text-center space-y-3">
                <LoadingSpinner size="md" />
                <p className="text-xs text-neutral-400 font-mono">Chargement des commandes en cours...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-16 rounded-3xl bg-[#121214] border border-white/10 text-center space-y-3">
                <Package className="w-12 h-12 text-neutral-600 mx-auto" />
                <h3 className="text-base font-bold uppercase text-white">Aucune commande trouvée</h3>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  {searchQuery
                    ? `Aucun résultat pour la recherche « ${searchQuery} ».`
                    : 'Les commandes passées par vos clients apparaîtront ici automatiquement.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const isCod = order.payment_provider === 'cod';
                  const isPending = order.status === 'pending_payment' || order.status === 'pending';
                  const addr = order.shipping_address || {};
                  const customerName =
                    addr.fullName || `${addr.firstName || ''} ${addr.lastName || ''}`.trim() || 'Client Veltrix';
                  const orderDate = new Date(order.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={order.id}
                      className="rounded-3xl bg-[#121214] border border-white/10 p-5 sm:p-6 backdrop-blur-xl transition-all hover:border-white/20 shadow-xl space-y-4"
                    >
                      {/* Row 1: Order Header & Status Badge */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <span className="font-bold text-white font-mono text-base tracking-wide">
                              {order.id}
                            </span>

                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${getStatusBadgeClass(
                                order.status
                              )}`}
                            >
                              {formatStatusLabel(order.status)}
                            </span>

                            {isCod ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center gap-1">
                                <Banknote className="w-3 h-3" />
                                <span>Paiement à la livraison</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 flex items-center gap-1">
                                <CreditCard className="w-3 h-3" />
                                <span>{order.payment_provider?.toUpperCase() || 'EN LIGNE'}</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-neutral-400 font-light mt-1">
                            <Calendar className="w-3 h-3 text-neutral-500" />
                            <span>Enregistrée le {orderDate}</span>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-[11px] text-neutral-400 font-mono block">Montant Total</span>
                          <span className="text-lg font-bold text-cyan-300 font-mono">
                            {formatPrice(order.total_amount)}
                          </span>
                        </div>
                      </div>

                      {/* Row 2: Customer & Delivery Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-neutral-950/60 border border-white/5 text-xs font-mono">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-neutral-300 font-bold">
                            <User className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{customerName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-neutral-400">
                            <Phone className="w-3.5 h-3.5 text-amber-400" />
                            <a
                              href={`tel:${addr.phone}`}
                              className="hover:text-cyan-300 underline underline-offset-2"
                            >
                              {addr.phone || 'Non renseigné'}
                            </a>
                            {addr.phone && (
                              <a
                                href={`https://wa.me/${addr.phone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                              >
                                WhatsApp
                              </a>
                            )}
                          </div>
                          <div className="text-neutral-500 text-[11px]">
                            Email : {order.guest_email || addr.email || 'N/A'}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-start gap-2 text-neutral-300">
                            <MapPin className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                            <div>
                              <div>{addr.address || 'Adresse standard'} {addr.apartment ? `(${addr.apartment})` : ''}</div>
                              <div className="text-neutral-400">
                                {addr.city}, {addr.state || ''} {addr.zip || ''} — <strong>{addr.country || 'Maroc'}</strong>
                              </div>
                            </div>
                          </div>
                          {addr.deliveryNotes && (
                            <div className="text-[11px] text-amber-300/80 italic bg-amber-500/5 p-2 rounded-xl border border-amber-500/10">
                              Note livreur : « {addr.deliveryNotes} »
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Row 3: Items Ordered */}
                      <div className="py-2 space-y-2">
                        <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono">
                          Articles Commandés ({order.items?.length || 0}) :
                        </div>
                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                          {order.items?.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs py-1 px-2.5 rounded-xl bg-white/[0.02]"
                            >
                              <div className="flex items-center gap-2 text-neutral-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                <span className="font-bold text-white">{item.quantity}x</span>
                                <span>{item.product_name || item.productName || item.product_id}</span>
                                {(item.color_name || item.colorName) && (
                                  <span className="text-neutral-500 text-[11px]">
                                    ({item.color_name || item.colorName})
                                  </span>
                                )}
                              </div>
                              <span className="font-mono text-neutral-400">
                                {formatPrice((item.unit_price || item.unitPrice || 0) * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Row 4: Admin Action Bar */}
                      <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
                        <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-2">
                          <Truck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>
                            Paiement : {order.provider_payment_id || (isPending ? 'En attente d’encaissement' : order.id)}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => handleMarkAsPaid(order.id)}
                              disabled={updatingOrderId === order.id}
                              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Marquer Encaissé ({formatPrice(order.total_amount)})</span>
                            </button>
                          )}

                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            disabled={updatingOrderId === order.id}
                            className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none cursor-pointer"
                          >
                            <option value="pending_payment">Statut : En attente de paiement</option>
                            <option value="processing">Statut : En préparation</option>
                            <option value="shipped">Statut : En cours de livraison</option>
                            <option value="delivered">Statut : Livrée au client</option>
                            <option value="paid">Statut : Payée & Encaissée</option>
                            <option value="cancelled">Statut : Annulée</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* TAB 2: GESTION DU CATALOGUE & DES PRIX (PRODUCTS) */}
        {activeAdminTab === 'products' && (
          <div className="space-y-6">
            {/* CATALOG METRICS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-[#121214] border border-white/10 space-y-1">
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                  Total Produits Actifs
                </span>
                <div className="text-2xl font-bold font-mono text-white">
                  {productsList.length}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-cyan-300 uppercase tracking-wider block">
                    Apple EarPods (Initial 70 MAD)
                  </span>
                  <Tag className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-cyan-300">
                  {formatPrice(productsList.find((p) => p.id === 'apple-earpods-lightning')?.price || 70)}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-emerald-300/80 uppercase tracking-wider block">
                    Disponibilité en Stock
                  </span>
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-300">
                  {productsList.filter((p) => p.inStock).length} / {productsList.length}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#121214] border border-white/10 space-y-1">
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                  Devise de la Boutique
                </span>
                <div className="text-2xl font-bold font-mono text-white">
                  MAD (DH)
                </div>
              </div>
            </div>

            {/* FILTER & SEARCH BAR FOR PRODUCTS */}
            <div className="p-4 rounded-2xl bg-[#121214] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto text-xs">
                {[
                  { id: 'all', label: 'Tous les Produits' },
                  { id: 'headphones', label: 'Audio & Écouteurs' },
                  { id: 'airpods', label: 'AirPods' },
                  { id: 'cables-adapters', label: 'Câbles & Chargeurs' },
                  { id: 'accessories', label: 'Accessoires' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setProductCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-xl font-medium tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                      productCategoryFilter === cat.id
                        ? 'bg-cyan-400 text-neutral-950 font-bold'
                        : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Rechercher par nom, marque..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            {/* PRODUCT CARDS LIST WITH INLINE PRICE EDITOR */}
            <div className="space-y-4">
              {filteredProducts.map((product) => {
                const isTargetEarPods = product.id === 'apple-earpods-lightning';
                const currentDraftPrice =
                  editingPrices[product.id] !== undefined ? editingPrices[product.id] : product.price;
                const isModified = editingPrices[product.id] !== undefined && Number(editingPrices[product.id]) !== product.price;

                return (
                  <div
                    key={product.id}
                    className={`p-5 rounded-3xl bg-[#121214] border transition-all ${
                      isTargetEarPods
                        ? 'border-cyan-400/40 shadow-lg shadow-cyan-500/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                      {/* Product Thumbnail & Core Info */}
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded-2xl bg-neutral-950 border border-white/10 p-2 shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src={product.images?.[0] || '/images/apple.jpg'}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain"
                          />
                          {isTargetEarPods && (
                            <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold text-white tracking-wide">
                              {product.name}
                            </h3>
                            {isTargetEarPods && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Photo Officielle Apple
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/5 border border-white/10 text-neutral-400">
                              {product.brand || 'Veltrix'}
                            </span>
                          </div>

                          <p className="text-xs text-neutral-400 max-w-xl line-clamp-1">
                            {product.subtitle || product.description}
                          </p>

                          <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-500">
                            <span>ID: <code className="text-neutral-300">{product.id}</code></span>
                            <span>•</span>
                            <span>Catégorie: <span className="text-cyan-400">{product.category}</span></span>
                            <span>•</span>
                            <span className="text-emerald-400">En stock ({product.stockCount || 50})</span>
                          </div>
                        </div>
                      </div>

                      {/* Product Price Editor Controls */}
                      <div className="flex flex-wrap items-center gap-3 self-end md:self-center">
                        <div className="text-right mr-2 hidden sm:block">
                          <span className="text-[10px] uppercase font-mono text-neutral-400 block">
                            Prix Boutique Actuel
                          </span>
                          <span className="text-lg font-bold font-mono text-white">
                            {formatPrice(product.price)}
                          </span>
                        </div>

                        {/* Editable Price Input */}
                        <div className="flex items-center gap-2 bg-neutral-950 p-1.5 rounded-2xl border border-white/10">
                          <div className="relative">
                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={currentDraftPrice}
                              onChange={(e) =>
                                setEditingPrices((prev) => ({
                                  ...prev,
                                  [product.id]: e.target.value,
                                }))
                              }
                              className="w-24 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-sm font-mono font-bold text-white text-right focus:border-cyan-400 focus:outline-none"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] font-mono text-neutral-400">
                              MAD
                            </span>
                          </div>

                          {/* Save Price Button */}
                          <button
                            type="button"
                            onClick={() => handleSavePrice(product.id)}
                            disabled={updatingProductId === product.id || !isModified}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                              isModified
                                ? 'bg-cyan-400 hover:bg-cyan-300 text-neutral-950 shadow-md shadow-cyan-400/20'
                                : 'bg-white/5 text-neutral-500 cursor-not-allowed'
                            }`}
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{updatingProductId === product.id ? '...' : 'Sauvegarder'}</span>
                          </button>

                          {/* Reset Button */}
                          <button
                            type="button"
                            title="Réinitialiser au tarif initial par défaut"
                            onClick={() => handleResetPrice(product.id)}
                            className="p-2 rounded-xl text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* View in Store Button */}
                        <button
                          type="button"
                          onClick={() => navigateTo('product-detail', product)}
                          className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white cursor-pointer"
                          title="Voir la page produit dans le store"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
