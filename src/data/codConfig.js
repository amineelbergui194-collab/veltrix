/**
 * Configuration côté client pour le paiement à la livraison (Cash on Delivery)
 * Utilisé par CheckoutPage et les composants de paiement pour la validation interactive.
 */

export {
  COD_CONFIGURATION,
  isCodAvailableForZone,
  getCodZoneByCountry,
  calculateCodShippingFee,
} from '../../server/codConfig.js';
