import React, { useState, useMemo } from 'react';
import {
  Banknote,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
} from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { formatPrice } from '../../data/products';
import { isCodAvailableForZone, COD_CONFIGURATION } from '../../data/codConfig';

export const CashOnDeliverySection = ({
  cartItems,
  shippingMethod,
  promoCode,
  shippingAddress,
  user,
  totalAmount,
  onSuccess,
  onError,
}) => {
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Vérification dynamique de la zone géographique
  const zoneStatus = useMemo(() => {
    return isCodAvailableForZone(shippingAddress.country, shippingAddress.city);
  }, [shippingAddress.country, shippingAddress.city]);

  const isEligible = zoneStatus.available;

  // Soumission de la commande COD
  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation des coordonnées côté client avant envoi
    if (!shippingAddress.firstName?.trim() || !shippingAddress.lastName?.trim()) {
      setErrorMessage('Veuillez renseigner votre nom et prénom complets dans la section Coordonnées.');
      return;
    }

    if (!shippingAddress.phone?.trim() || shippingAddress.phone.replace(/\D/g, '').length < 8) {
      setErrorMessage('Veuillez renseigner un numéro de téléphone valide (ex: 06 XX XX XX XX ou +212 6 XX XX XX XX) pour que le livreur puisse vous joindre.');
      return;
    }

    if (!shippingAddress.address?.trim() || shippingAddress.address.trim().length < 5) {
      setErrorMessage('Veuillez renseigner une adresse de livraison complète (rue, numéro, bâtiment).');
      return;
    }

    if (!shippingAddress.city?.trim()) {
      setErrorMessage('Veuillez spécifier votre ville de livraison.');
      return;
    }

    if (!isEligible) {
      setErrorMessage(
        zoneStatus.reason ||
          'Le paiement à la livraison n’est pas disponible pour votre destination. Veuillez choisir une autre méthode de paiement.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/cod/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            selectedColor: item.selectedColor,
          })),
          shippingMethod,
          promoCode: promoCode?.code || null,
          userId: user?.id || null,
          customerEmail: shippingAddress.email || user?.email || null,
          shippingAddress,
          deliveryNotes,
          idempotencyKey: `cod_client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la validation de la commande.');
      }

      setIsSubmitting(false);

      if (onSuccess) {
        onSuccess({
          orderId: data.orderId,
          method: 'cod',
          methodLabel: 'Paiement à la livraison (Cash on Delivery)',
          status: data.status || 'pending_payment',
          totalPaid: data.totalAmount,
          currency: data.currency,
          shippingAddress: data.shippingAddress,
          estimatedDeliveryTime: data.estimatedDeliveryTime,
        });
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Impossible de confirmer la commande pour le moment.');
      if (onError) onError(err);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. DESCRIPTION OFFICIELLE MISE EN AVANT */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-300">
          <Banknote className="w-5 h-5 text-amber-400 shrink-0" />
          <span>Paiement en espèces à la réception du colis</span>
        </div>
        <p className="text-[12px] leading-relaxed text-amber-200/90 font-sans">
          « {COD_CONFIGURATION.officialDescription} »
        </p>
        <p className="text-[11px] text-amber-300/70 leading-relaxed font-sans">
          Aucune coordonnée bancaire n'est requise. Vous réglez directement le livreur en espèces au moment où il vous remet votre colis à votre porte.
        </p>
      </div>

      {/* 2. ÉTAT D'ÉLIGIBILITÉ DE LA ZONE GÉOGRAPHIQUE */}
      {isEligible ? (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-xs text-emerald-300 font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-emerald-200">
              Zone couverte : {shippingAddress.city || 'Maroc'}, {shippingAddress.country || 'Maroc'}
            </div>
            <div className="text-[11px] text-emerald-300/80 font-sans flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Délai estimé : {zoneStatus.zone?.estimatedDeliveryTime || '24h à 48h ouvrées'}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 space-y-2">
          <div className="flex items-center gap-2 font-bold">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Paiement à la livraison indisponible pour cette zone</span>
          </div>
          <p className="text-[11px] text-rose-200/90 leading-relaxed font-sans">
            {zoneStatus.reason ||
              `Le service d'encaissement à la livraison n'est pas actif pour « ${shippingAddress.country} ». Veuillez utiliser Apple Pay ou PayPal pour valider votre commande.`}
          </p>
        </div>
      )}

      {/* 3. RÉCAPITULATIF DU MONTANT EN ESPÈCES À PRÉPARER */}
      <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between text-neutral-400 pb-2 border-b border-white/5">
          <span>Mode de règlement :</span>
          <span className="text-white font-bold">Espèces (Dirham Marocain - MAD)</span>
        </div>
        <div className="flex items-center justify-between text-neutral-400 pb-2 border-b border-white/5">
          <span>Frais de gestion à la livraison :</span>
          <span className="text-emerald-400 font-bold">0 DH (Gratuit)</span>
        </div>
        <div className="flex items-center justify-between text-sm font-bold pt-1">
          <span className="text-white">Montant exact à payer au livreur :</span>
          <span className="text-cyan-300 text-base">{formatPrice(totalAmount)}</span>
        </div>
        <div className="text-[10px] text-neutral-500 font-sans leading-relaxed pt-1">
          💡 <em>Conseil :</em> Préparez l'appoint si possible pour faciliter le rendu de monnaie lors de la remise en main propre.
        </div>
      </div>

      {/* 4. INSTRUCTIONS SPÉCIFIQUES POUR LE LIVREUR (OPTIONNEL) */}
      <div>
        <label className="block text-xs font-mono text-neutral-400 mb-1.5 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span>Instructions pour le livreur (Optionnel)</span>
        </label>
        <textarea
          rows="2"
          value={deliveryNotes}
          onChange={(e) => setDeliveryNotes(e.target.value)}
          placeholder="Ex: Étage 3, porte gauche, appeler 10 minutes avant d'arriver au portail..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:border-cyan-400 focus:outline-none transition-colors"
        />
      </div>

      {/* 5. AFFICHAGE DES ERREURS ÉVENTUELLES */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <div className="leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {/* 6. BOUTON DE CONFIRMATION DE COMMANDE */}
      <button
        type="button"
        onClick={handleConfirmOrder}
        disabled={isSubmitting || !isEligible}
        className="w-full py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-cyan-500/20 cursor-pointer"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            <span>Enregistrement sécurisé de votre commande...</span>
          </span>
        ) : (
          <>
            <Banknote className="w-4 h-4" />
            <span>Confirmer ma commande — {formatPrice(totalAmount)} à la livraison</span>
          </>
        )}
      </button>

      {/* 7. GARANTIES ET PROCESSUS DE SÉCURITÉ */}
      <div className="pt-1 space-y-2 text-[11px] text-neutral-500 font-mono">
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Vérification téléphonique : notre service logistique vous contactera avant la livraison.</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Garantie Veltrix 2 ans & Droit de retour 30 jours applicables dès réception.</span>
        </div>
      </div>
    </div>
  );
};
