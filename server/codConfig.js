/**
 * Configuration des Zones de Livraison et du Paiement à la Livraison (Cash on Delivery — COD)
 * Veltrix-Store
 *
 * Ce module centralise les règles d'éligibilité géographique, les frais de livraison
 * et les plafonds de sécurité pour le paiement en espèces à la livraison.
 */

export const COD_CONFIGURATION = {
  // Activation globale du paiement à la livraison
  enabled: true,

  // Plafonds de sécurité en Dirhams Marocains (MAD / DH)
  minOrderAmount: 0,
  maxOrderAmount: 15000, // Plafond maximal de sécurité pour le transport d'espèces

  // Description officielle affichée aux clients
  officialDescription: 'Commandez maintenant et payez en espèces à la réception de votre colis.',

  // Frais d'encaissement COD additionnels (0 DH = sans surcoût pour le client)
  codHandlingFee: 0,

  // Zones géographiques configurées
  zones: {
    // --------------------------------------------------------------------------
    // MAROC (Zone Principale Couverte par Veltrix Express & Partenaires Messagerie)
    // --------------------------------------------------------------------------
    MA: {
      countryCode: 'MA',
      countryNames: ['Morocco', 'Maroc', 'MA', 'Maruecos', 'Al Maghrib'],
      enabled: true,
      currency: 'MAD',
      estimatedDeliveryTime: '24h à 48h ouvrées',
      courierPartners: ['Veltrix Express', 'Amana Express', 'CTM Messagerie', 'Cathedis'],

      // Grille des frais de livraison standard/express pour le Maroc
      shippingRates: {
        standard: {
          cost: 25,
          freeThreshold: 300, // Gratuit à partir de 300 DH
          label: 'Livraison Standard Sécurisée',
          estimatedDays: '2–3 jours ouvrés',
        },
        express: {
          cost: 35,
          freeThreshold: null,
          label: 'Livraison Express Prioritaire',
          estimatedDays: '24–48 heures',
        },
        overnight: {
          cost: 60,
          freeThreshold: null,
          label: 'Livraison 24h Chrono',
          estimatedDays: 'Le lendemain avant 13h00',
        },
      },

      // Liste des villes principales où le paiement en espèces et l'encaissement sont activés
      cities: [
        { name: 'Casablanca', enabled: true, expressAvailable: true },
        { name: 'Rabat', enabled: true, expressAvailable: true },
        { name: 'Marrakech', enabled: true, expressAvailable: true },
        { name: 'Tanger', enabled: true, expressAvailable: true },
        { name: 'Agadir', enabled: true, expressAvailable: true },
        { name: 'Fès', enabled: true, expressAvailable: true },
        { name: 'Meknès', enabled: true, expressAvailable: true },
        { name: 'Oujda', enabled: true, expressAvailable: true },
        { name: 'Kenitra', enabled: true, expressAvailable: true },
        { name: 'Tétouan', enabled: true, expressAvailable: true },
        { name: 'Mohammedia', enabled: true, expressAvailable: true },
        { name: 'El Jadida', enabled: true, expressAvailable: true },
        { name: 'Safi', enabled: true, expressAvailable: true },
        { name: 'Nador', enabled: true, expressAvailable: true },
        { name: 'Béni Mellal', enabled: true, expressAvailable: true },
        { name: 'Salé', enabled: true, expressAvailable: true },
        { name: 'Témara', enabled: true, expressAvailable: true },
        { name: 'Khouribga', enabled: true, expressAvailable: true },
        { name: 'Dakhla', enabled: true, expressAvailable: false },
        { name: 'Laâyoune', enabled: true, expressAvailable: false },
        { name: 'Essaouira', enabled: true, expressAvailable: true },
        { name: 'Taza', enabled: true, expressAvailable: true },
        { name: 'Berkane', enabled: true, expressAvailable: true },
        { name: 'Al Hoceïma', enabled: true, expressAvailable: true },
        { name: 'Taroudant', enabled: true, expressAvailable: true },
        { name: 'Settat', enabled: true, expressAvailable: true },
        { name: 'Berrechid', enabled: true, expressAvailable: true },
        { name: 'Ksar El Kebir', enabled: true, expressAvailable: true },
        { name: 'Larache', enabled: true, expressAvailable: true },
        { name: 'Guelmim', enabled: true, expressAvailable: false },
      ],

      // Si false : accepte également les autres localités du Maroc avec le tarif standard
      strictCityWhitelist: false,
    },

    // --------------------------------------------------------------------------
    // ZONES INTERNATIONALES (Paiement à la livraison non disponible à l'international)
    // --------------------------------------------------------------------------
    FR: {
      countryCode: 'FR',
      countryNames: ['France', 'FR'],
      enabled: false,
      reason: 'Le paiement à la livraison (Cash on Delivery) n’est pas disponible pour les expéditions en France. Veuillez régler votre commande par Carte Bancaire ou PayPal.',
    },
    ES: {
      countryCode: 'ES',
      countryNames: ['Spain', 'Espagne', 'ES'],
      enabled: false,
      reason: 'El pago contra reembolso no está disponible para envíos a España.',
    },
    BE: {
      countryCode: 'BE',
      countryNames: ['Belgium', 'Belgique', 'BE'],
      enabled: false,
      reason: 'Le paiement à la livraison n’est pas disponible pour les expéditions en Belgique.',
    },
    US: {
      countryCode: 'US',
      countryNames: ['United States', 'USA', 'US', 'États-Unis'],
      enabled: false,
      reason: 'Cash on Delivery is not available for orders shipped to the United States.',
    },
  },
};

/**
 * Normalise une chaîne de caractères (suppression des accents et casse)
 */
export function normalizeString(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Recherche une configuration de zone pays
 */
export function getCodZoneByCountry(countryInput) {
  if (!countryInput) return null;
  const clean = normalizeString(countryInput);

  for (const [, zone] of Object.entries(COD_CONFIGURATION.zones)) {
    if (
      normalizeString(zone.countryCode) === clean ||
      zone.countryNames.some((name) => normalizeString(name) === clean)
    ) {
      return zone;
    }
  }

  // Par défaut, si aucune correspondance exacte, tester si le mot-clé 'maroc' ou 'morocco' est présent
  if (clean.includes('maroc') || clean.includes('morocco')) {
    return COD_CONFIGURATION.zones.MA;
  }

  return null;
}

/**
 * Vérifie l'éligibilité au paiement à la livraison pour une destination donnée
 *
 * @param {string} country - Pays de destination (ex: "Morocco", "Maroc", "France")
 * @param {string} city - Ville de destination (ex: "Casablanca", "Rabat")
 * @returns {{ available: boolean, reason?: string, zone?: object, cityDetails?: object }}
 */
export function isCodAvailableForZone(country, city) {
  if (!COD_CONFIGURATION.enabled) {
    return {
      available: false,
      reason: 'Le paiement à la livraison est temporairement indisponible sur la boutique.',
    };
  }

  const zone = getCodZoneByCountry(country);
  if (!zone) {
    return {
      available: false,
      reason: `Le paiement à la livraison n’est pas activé pour le pays « ${country || 'inconnu'} ».`,
    };
  }

  if (!zone.enabled) {
    return {
      available: false,
      reason: zone.reason || `Le service d'encaissement à la livraison n'est pas disponible pour « ${country} ».`,
    };
  }

  // Vérifier la ville si spécifiée
  if (city && zone.cities && zone.cities.length > 0) {
    const cleanCity = normalizeString(city);
    const matchedCity = zone.cities.find((c) => normalizeString(c.name) === cleanCity);

    if (matchedCity) {
      if (!matchedCity.enabled) {
        return {
          available: false,
          reason: `Le paiement à la livraison est temporairement suspendu pour la ville de ${matchedCity.name}.`,
        };
      }
      return {
        available: true,
        zone,
        cityDetails: matchedCity,
      };
    }

    // Si la ville n'est pas dans la liste officielle
    if (zone.strictCityWhitelist) {
      return {
        available: false,
        reason: `La ville « ${city} » n'est pas éligible au paiement à la livraison. Villes desservies : ${zone.cities.map((c) => c.name).join(', ')}.`,
      };
    }
  }

  return {
    available: true,
    zone,
    cityDetails: city ? { name: city, expressAvailable: false } : null,
  };
}

/**
 * Calcule les frais de livraison pour le paiement à la livraison
 */
export function calculateCodShippingFee({ country, shippingMethod = 'standard', subtotal = 0, promoFreeShipping = false }) {
  const zone = getCodZoneByCountry(country) || COD_CONFIGURATION.zones.MA;
  const rates = zone.shippingRates || COD_CONFIGURATION.zones.MA.shippingRates;
  const rateConfig = rates[shippingMethod] || rates.standard;

  let cost = rateConfig.cost;
  if (rateConfig.freeThreshold && subtotal >= rateConfig.freeThreshold) {
    cost = 0;
  }
  if (promoFreeShipping && shippingMethod === 'standard') {
    cost = 0;
  }

  return {
    shippingCost: cost,
    codHandlingFee: COD_CONFIGURATION.codHandlingFee,
    totalShippingFee: cost + COD_CONFIGURATION.codHandlingFee,
    estimatedDays: rateConfig.estimatedDays,
    label: rateConfig.label,
  };
}
