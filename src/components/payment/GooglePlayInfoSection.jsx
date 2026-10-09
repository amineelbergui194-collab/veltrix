import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, AlertTriangle, CreditCard } from 'lucide-react';

/**
 * Google Play Gift Cards Information Section
 * Strictly complies with:
 * - Google Play Terms of Service & Gift Card policies
 * - Anti-Money Laundering (AML) regulations
 * - E-commerce legal compliance (Physical Hardware vs Digital Goods)
 */
export const GooglePlayInfoSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 text-xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left text-neutral-300 hover:text-white transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <span className="font-semibold text-neutral-200">
            Information officielle : Cartes Cadeaux Google Play
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-neutral-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-neutral-400" />
        )}
      </button>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-neutral-800/80 space-y-3 font-sans text-neutral-400 text-[11px] leading-relaxed animate-in fade-in">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <strong>Non utilisable pour les commandes sur ce site :</strong> Les codes de cartes cadeaux Google Play ne sont pas des cartes bancaires et ne peuvent pas être saisis comme moyen de paiement sur Veltrix Tech.
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-medium text-xs">
              Pourquoi cette restriction s’applique-t-elle ?
            </h4>
            <p>
              1. <strong>Règles officielles de Google Play :</strong> Conformément aux conditions d'utilisation de Google Payment Corporation, le solde d'une carte cadeau Google Play est strictement restreint à l'achat de contenus numériques sur le Google Play Store (applications Android, jeux mobiles, abonnements intégrés aux applications, livres et films numériques).
            </p>
            <p>
              2. <strong>Produits matériels physiques :</strong> Veltrix Tech commercialise des équipements physiques (écouteurs, montres connectées, chargeurs GaN, câbles certifiés). Les conditions de Google interdisent formellement l'utilisation de cartes Google Play pour l'achat de biens matériels physiques sur des sites web indépendants.
            </p>
            <p>
              3. <strong>Conformité légale et anti-blanchiment :</strong> La législation financière et les règles anti-fraude interdisent la conversion de cartes cadeaux ou de codes prépayés en espèces ou en équivalent monétaire marchand.
            </p>
          </div>

          <div className="pt-2 border-t border-neutral-800/60 flex items-center gap-2 text-cyan-400 font-medium">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Alternatives recommandées et sécurisées : Carte Bancaire (Visa / Mastercard), Apple Pay ou PayPal.</span>
          </div>
        </div>
      )}
    </div>
  );
};
