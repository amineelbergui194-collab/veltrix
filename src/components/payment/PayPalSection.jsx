import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export const PayPalSection = ({
  cartItems,
  shippingMethod,
  promoCode,
  shippingAddress,
  user,
  onSuccess,
  onError,
}) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [createdServerOrderId, setCreatedServerOrderId] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const paypalClientId =
    import.meta.env.VITE_PAYPAL_CLIENT_ID ||
    'test'; // Client ID will be read from environment

  const isConfigured = Boolean(
    import.meta.env.VITE_PAYPAL_CLIENT_ID &&
    import.meta.env.VITE_PAYPAL_CLIENT_ID !== 'test' &&
    import.meta.env.VITE_PAYPAL_CLIENT_ID !== 'your-paypal-client-id-here'
  );

  const handleCreateOrder = async () => {
    setErrorMessage(null);
    try {
      const response = await fetch('/api/paypal/create-order', {
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
          customerEmail: shippingAddress.email,
          shippingAddress,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Erreur de création de commande (${response.status})`);
      }

      const data = await response.json();
      setCreatedServerOrderId(data.orderId);
      return data.id; // Return PayPal Order ID to the PayPal SDK
    } catch (err) {
      setErrorMessage(err.message || 'Impossible d’initialiser la transaction PayPal.');
      if (onError) onError(err);
      throw err;
    }
  };

  const handleApprove = async (data) => {
    setIsCapturing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paypalOrderId: data.orderID,
          orderId: createdServerOrderId,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Erreur de capture PayPal (${response.status})`);
      }

      const result = await response.json();
      setIsCapturing(false);

      if (onSuccess) {
        onSuccess({
          orderId: result.orderId,
          captureId: result.captureId,
          status: result.status,
          method: 'paypal',
        });
      }
    } catch (err) {
      setIsCapturing(false);
      setErrorMessage(err.message || 'Échec de la validation du paiement PayPal.');
      if (onError) onError(err);
    }
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <div className="leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {isCapturing && (
        <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-2 text-cyan-300 text-xs font-mono">
          <LoadingSpinner size="sm" />
          <span>Capture et confirmation bancaire PayPal en cours...</span>
        </div>
      )}

      {!isConfigured ? (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-2">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Configuration PayPal requise</span>
          </div>
          <p className="text-[11px] text-amber-200/80 leading-relaxed">
            Pour activer les paiements réels avec PayPal, veuillez renseigner <code className="text-white">VITE_PAYPAL_CLIENT_ID</code> et <code className="text-white">PAYPAL_CLIENT_SECRET</code> dans vos variables d’environnement.
          </p>
        </div>
      ) : (
        <PayPalScriptProvider
          options={{
            clientId: paypalClientId,
            currency: 'EUR', // PayPal standard settlement for Moroccan cross-border accounts
            intent: 'capture',
            components: 'buttons',
          }}
        >
          <div className="relative z-0 min-h-[48px]">
            <PayPalButtons
              style={{
                layout: 'vertical',
                color: 'blue',
                shape: 'rect',
                label: 'pay',
                height: 48,
              }}
              createOrder={handleCreateOrder}
              onApprove={handleApprove}
              onCancel={() => {
                setErrorMessage('Transaction PayPal annulée par l’utilisateur.');
              }}
              onError={(err) => {
                setErrorMessage('Une erreur est survenue lors du processus PayPal.');
                if (onError) onError(err);
              }}
            />
          </div>
        </PayPalScriptProvider>
      )}

      <div className="text-[11px] text-neutral-500 font-mono flex items-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Protection des acheteurs PayPal & cryptage bancaire SSL</span>
      </div>
    </div>
  );
};
