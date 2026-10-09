import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import { Lock, AlertCircle, ShieldCheck } from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

const ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '13px',
      color: '#FFFFFF',
      fontFamily: 'Kanit, sans-serif',
      '::placeholder': {
        color: '#737373',
      },
      iconColor: '#22D3EE',
    },
    invalid: {
      color: '#FB7185',
      iconColor: '#FB7185',
    },
  },
};

export const StripeCardForm = ({
  orderId,
  clientSecret,
  totalFormatted,
  billingDetails,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      setErrorMessage(
        'Le système de paiement sécurisé Stripe est en cours de chargement. Veuillez patienter un instant.'
      );
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: `${billingDetails.firstName} ${billingDetails.lastName}`.trim(),
            email: billingDetails.email,
            phone: billingDetails.phone,
            address: {
              line1: billingDetails.address,
              line2: billingDetails.apartment,
              city: billingDetails.city,
              state: billingDetails.state,
              postal_code: billingDetails.zip,
              country: 'MA', // Morocco
            },
          },
        },
      });

      if (error) {
        setErrorMessage(error.message || 'La transaction par carte a été refusée par la banque émettrice.');
        setIsProcessing(false);
        if (onError) onError(error);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        setIsProcessing(false);
        if (onSuccess) {
          onSuccess({
            paymentIntentId: paymentIntent.id,
            orderId,
            status: paymentIntent.status,
          });
        }
      } else {
        setErrorMessage(`Statut de paiement inattendu : ${paymentIntent?.status}`);
        setIsProcessing(false);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Une exception de communication est survenue avec le processeur bancaire.');
      setIsProcessing(false);
      if (onError) onError(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <div className="leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {/* Numéro de carte sécurisé Stripe Elements */}
      <div>
        <label className="block text-xs font-mono text-neutral-400 mb-1.5">
          Numéro de Carte Bancaire (Visa, Mastercard, CMI compatible)
        </label>
        <div className="w-full px-3.5 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus-within:border-cyan-400 transition-colors">
          <CardNumberElement options={ELEMENT_OPTIONS} />
        </div>
      </div>

      {/* Date d'expiration & Code CVC */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-neutral-400 mb-1.5">
            Date d'expiration
          </label>
          <div className="w-full px-3.5 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus-within:border-cyan-400 transition-colors">
            <CardExpiryElement options={ELEMENT_OPTIONS} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-neutral-400 mb-1.5">
            Code de Sécurité (CVC)
          </label>
          <div className="w-full px-3.5 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus-within:border-cyan-400 transition-colors">
            <CardCvcElement options={ELEMENT_OPTIONS} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Chiffrement TLS 256 bits conforme à la norme bancaire PCI-DSS Niveau 1</span>
      </div>

      {/* Bouton de confirmation du paiement */}
      <button
        type="submit"
        disabled={isProcessing || !stripe || !clientSecret}
        className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-cyan-500/20 cursor-pointer mt-4"
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            <span>Validation Bancaire 3D Secure en cours...</span>
          </span>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            <span>Régler par Carte Bancaire — {totalFormatted}</span>
          </>
        )}
      </button>
    </form>
  );
};
