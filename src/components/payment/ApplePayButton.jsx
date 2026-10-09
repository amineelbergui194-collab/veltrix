import React, { useState } from 'react';
import { useStripe, useElements, ExpressCheckoutElement } from '@stripe/react-stripe-js';
import { AlertCircle, Smartphone } from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

/**
 * Apple Pay on the Web Component
 * Uses Stripe's modern ExpressCheckoutElement to provide native Apple Pay support
 * Automatically verifies device, Safari browser, and Apple Wallet compatibility.
 */
export const ApplePayButton = ({
  clientSecret,
  orderId,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [hasExpressMethods, setHasExpressMethods] = useState(true);

  const handleConfirm = async () => {
    if (!stripe || !elements || !clientSecret) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { paymentIntent, error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/account`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'La transaction Apple Pay a été refusée.');
        setIsProcessing(false);
        if (onError) onError(error);
      } else if (paymentIntent && (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing')) {
        setIsProcessing(false);
        if (onSuccess) {
          onSuccess({
            paymentIntentId: paymentIntent.id,
            orderId,
            status: paymentIntent.status,
            method: 'apple_pay',
          });
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Erreur de communication Apple Pay.');
      setIsProcessing(false);
      if (onError) onError(err);
    }
  };

  const handleReady = ({ availablePaymentMethods }) => {
    setIsReady(true);
    // If no one-click methods like Apple Pay are available on the user's browser/device
    if (!availablePaymentMethods || Object.keys(availablePaymentMethods).length === 0) {
      setHasExpressMethods(false);
    }
  };

  return (
    <div className="space-y-3">
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <div className="leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {isProcessing && (
        <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-2 text-cyan-300 text-xs font-mono">
          <LoadingSpinner size="sm" />
          <span>Autorisation Apple Pay en cours de traitement...</span>
        </div>
      )}

      {!isReady && (
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center gap-2 text-xs text-neutral-400">
          <LoadingSpinner size="sm" />
          <span>Détection de compatibilité Apple Pay...</span>
        </div>
      )}

      {!hasExpressMethods && isReady && (
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-400 space-y-2">
          <div className="flex items-center gap-2 text-neutral-300 font-medium">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>Apple Pay non disponible sur cet appareil</span>
          </div>
          <p className="text-[11px] text-neutral-500 leading-relaxed font-sans">
            Apple Pay nécessite un appareil Apple compatible (iPhone, iPad, Mac avec Touch ID) et le navigateur Safari avec une carte configurée dans Apple Wallet.
          </p>
          <p className="text-[11px] text-cyan-400 font-medium">
            Vous pouvez régler immédiatement par Carte Bancaire ou PayPal ci-dessus.
          </p>
        </div>
      )}

      <div className={`w-full ${!hasExpressMethods ? 'hidden' : ''}`}>
        <ExpressCheckoutElement
          onConfirm={handleConfirm}
          onReady={handleReady}
          options={{
            buttonType: {
              applePay: 'buy',
            },
            buttonTheme: {
              applePay: 'black',
            },
            buttonHeight: 48,
          }}
        />
      </div>
    </div>
  );
};
