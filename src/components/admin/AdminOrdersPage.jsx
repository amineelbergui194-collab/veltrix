import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../data/products';
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
} from 'lucide-react';

export const AdminOrdersPage = () => {
  const { navigateTo, addToast } = useShop();
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

  useEffect(() => {
    fetchOrders();
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

  return (
    <div className="py-10 bg-[#0C0C0C] text-[#D7E2EA] font-kanit min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
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
                Gestion des Commandes
              </h1>
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase">
                Console Administrateur
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 font-sans">
              Consultez, validez et modifiez le statut des commandes en ligne et des règlements à la livraison (Cash on Delivery).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
              <span>Actualiser</span>
            </button>
          </div>
        </div>

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
                    {/* Left: Transaction ID / Notes */}
                    <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-2">
                      <Truck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>
                        Paiement : {order.provider_payment_id || (isPending ? 'En attente d’encaissement' : order.id)}
                      </span>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Action 1 : Marquer comme payé (Encaissé en espèces) */}
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

                      {/* Action 2 : Sélecteur de statut rapide */}
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
      </div>
    </div>
  );
};
