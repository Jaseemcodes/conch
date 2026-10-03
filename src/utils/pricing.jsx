import api from "./api";
import React from "react";
import { Flame, Truck, ShieldCheck, Clock, MapPin, Zap } from "lucide-react";

let PRICING_DATA = {};
let PROVIDERS_DATA = [];
let isPricingLoaded = false;
let pricingLoadPromise = null;

export const loadPricingData = async () => {
  if (isPricingLoaded) return { PRICING_DATA, PROVIDERS_DATA };
  if (pricingLoadPromise) return pricingLoadPromise;

  pricingLoadPromise = Promise.all([
    api.get('/pricing').catch(() => ({ data: { success: false } })),
    api.get('/providers').catch(() => ({ data: { success: false } }))
  ]).then(([pricingRes, providersRes]) => {
    if (pricingRes.data && pricingRes.data.success) {
      const data = pricingRes.data.data;
      data.forEach(item => {
        PRICING_DATA[item.country.toLowerCase()] = item.providers;
      });
    }
    
    if (providersRes.data && providersRes.data.success) {
      PROVIDERS_DATA = providersRes.data.data;
    }

    isPricingLoaded = true;
    return { PRICING_DATA, PROVIDERS_DATA };
  }).catch(err => {
    console.error('Failed to load pricing or providers data', err);
    return { PRICING_DATA, PROVIDERS_DATA };
  });
  
  return pricingLoadPromise;
};

// Gas Price Calculation Engine (Conch Gas Standard Rates in UGX)
export const calculateGasPrice = (gasType = 'lpg', weightInKg = 6, serviceType = 'REFILL', hasExchangeCylinder = 'YES') => {
  let basePrice = 48000;

  const w = parseFloat(weightInKg) || 6;
  const isNew = serviceType === 'NEW_CONNECTION' || hasExchangeCylinder === 'NO';
  const gType = (gasType || '').toLowerCase();

  const isOxygen = gType.includes('oxygen');
  const isArgon = gType.includes('argon');
  const isAcetylene = gType.includes('acetylene');
  const isNitrogenCO2 = gType.includes('nitrogen') || gType.includes('co2');

  if (isOxygen) {
    basePrice = isNew ? 320000 : 85000;
  } else if (isArgon) {
    basePrice = isNew ? 450000 : 145000;
  } else if (isAcetylene) {
    basePrice = isNew ? 520000 : 195000;
  } else if (isNitrogenCO2) {
    basePrice = isNew ? 350000 : 95000;
  } else {
    // Default LPG Cooking Gas (Domestic & Commercial)
    if (w <= 6) {
      basePrice = isNew ? 165000 : 48000;
    } else if (w <= 13) {
      basePrice = isNew ? 285000 : 98000;
    } else if (w <= 40) {
      basePrice = isNew ? 580000 : 260000;
    } else {
      // 45kg commercial
      basePrice = isNew ? 680000 : 280000;
    }
  }

  return basePrice;
};

// Backward-compatible calculatePrice for quote flows
export const calculatePrice = (gasOrCountryName, providerName, weightInKg, serviceType = 'REFILL', hasExchange = 'YES') => {
  return calculateGasPrice(gasOrCountryName, weightInKg, serviceType, hasExchange);
};

export const getProvidersForCountry = () => {
  return [
    { provider: "CONCH EXPRESS", timeline: "Under 2 Hours" },
    { provider: "STANDARD TRUCK", timeline: "Within 24 Hours" },
    { provider: "BULK SUPPLY", timeline: "Same Day Dispatch" },
    { provider: "DEPOT PICKUP", timeline: "Instant (Kira Road Depot)" }
  ];
};

export const getDefaultProvider = () => {
  return {
    provider: "CONCH EXPRESS",
    timeline: "2-4 Hours Doorstep Delivery"
  };
};

export const PROVIDER_UI_CONFIG = {
  "CONCH EXPRESS": {
    themeColor: "bg-red-600",
    themeText: "text-red-600",
    hoverBg: "hover:bg-red-700",
    badgeLabel: "Fastest / Doorstep",
    logoNode: (
      <div className="h-7 w-full flex items-center justify-center bg-red-600 px-3 py-1 rounded-lg text-white font-black text-xs tracking-wider shadow-xs uppercase select-none">
        <Flame className="w-3.5 h-3.5 mr-1 fill-white" /> Conch Express
      </div>
    )
  },
  "STANDARD DELIVERY": {
    themeColor: "bg-slate-800",
    themeText: "text-slate-800",
    hoverBg: "hover:bg-slate-900",
    badgeLabel: "Standard / Best Value",
    logoNode: (
      <div className="h-7 w-full flex items-center justify-center bg-slate-800 px-3 py-1 rounded-lg text-white font-black text-xs tracking-wider shadow-xs uppercase select-none">
        <Truck className="w-3.5 h-3.5 mr-1 text-red-400" /> Standard Dispatch
      </div>
    )
  },
  "BULK TRUCK SUPPLY": {
    themeColor: "bg-amber-600",
    themeText: "text-amber-600",
    hoverBg: "hover:bg-amber-700",
    badgeLabel: "Commercial / 45kg+",
    logoNode: (
      <div className="h-7 w-full flex items-center justify-center bg-amber-600 px-3 py-1 rounded-lg text-white font-black text-xs tracking-wider shadow-xs uppercase select-none">
        <Zap className="w-3.5 h-3.5 mr-1 text-white" /> Bulk Truck Supply
      </div>
    )
  },
  "STATION PICKUP": {
    themeColor: "bg-emerald-600",
    themeText: "text-emerald-600",
    hoverBg: "hover:bg-emerald-700",
    badgeLabel: "Self Pickup (Free)",
    logoNode: (
      <div className="h-7 w-full flex items-center justify-center bg-emerald-600 px-3 py-1 rounded-lg text-white font-black text-xs tracking-wider shadow-xs uppercase select-none">
        <MapPin className="w-3.5 h-3.5 mr-1 text-white" /> Depot Pickup
      </div>
    )
  },
  // Fallbacks for carrier names
  "DHL": {
    themeColor: "bg-red-600",
    themeText: "text-red-600",
    hoverBg: "hover:bg-red-700",
    badgeLabel: "Conch Express",
    logoNode: (
      <div className="h-7 w-full flex items-center justify-center bg-red-600 px-3 py-1 rounded-lg text-white font-black text-xs tracking-wider shadow-xs uppercase select-none">
        <Flame className="w-3.5 h-3.5 mr-1 fill-white" /> Conch Express
      </div>
    )
  },
  "UPS": {
    themeColor: "bg-slate-800",
    themeText: "text-slate-800",
    hoverBg: "hover:bg-slate-900",
    badgeLabel: "Standard Delivery",
    logoNode: (
      <div className="h-7 w-full flex items-center justify-center bg-slate-800 px-3 py-1 rounded-lg text-white font-black text-xs tracking-wider shadow-xs uppercase select-none">
        <Truck className="w-3.5 h-3.5 mr-1 text-red-400" /> Standard Dispatch
      </div>
    )
  },
  "FedEx": {
    themeColor: "bg-amber-600",
    themeText: "text-amber-600",
    hoverBg: "hover:bg-amber-700",
    badgeLabel: "Commercial Bulk",
    logoNode: (
      <div className="h-7 w-full flex items-center justify-center bg-amber-600 px-3 py-1 rounded-lg text-white font-black text-xs tracking-wider shadow-xs uppercase select-none">
        <Zap className="w-3.5 h-3.5 mr-1 text-white" /> Bulk Truck Supply
      </div>
    )
  },
  "ECONOMY POST": {
    themeColor: "bg-emerald-600",
    themeText: "text-emerald-600",
    hoverBg: "hover:bg-emerald-700",
    badgeLabel: "Depot Pickup",
    logoNode: (
      <div className="h-7 w-full flex items-center justify-center bg-emerald-600 px-3 py-1 rounded-lg text-white font-black text-xs tracking-wider shadow-xs uppercase select-none">
        <MapPin className="w-3.5 h-3.5 mr-1 text-white" /> Depot Pickup
      </div>
    )
  }
};

export const getProviderUI = (providerName) => {
  return PROVIDER_UI_CONFIG[providerName] || {
    themeColor: "bg-slate-800",
    themeText: "text-slate-800",
    hoverBg: "hover:bg-slate-900",
    badgeLabel: "Conch Gas Delivery",
    logoNode: (
      <div className="h-7 flex items-center justify-center bg-red-600 text-white px-2 py-0.5 rounded font-black text-xs uppercase">
        <Flame className="w-3.5 h-3.5 mr-1" /> Conch Gas Express
      </div>
    )
  };
};

export const getProviderImage = (providerName) => {
  return null;
};

