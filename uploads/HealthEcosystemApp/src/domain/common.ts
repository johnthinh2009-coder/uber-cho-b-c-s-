/** The five ecosystem pillars. Everything in the app belongs to one of them. */
export type Pillar = 'care' | 'food' | 'medication' | 'fitness' | 'family';

export type ISODateString = string;

/** Demo-only identifier type – replaced by backend IDs later. */
export type Id = string;

export type Rating = {
  /** 0 – 5 */
  average: number;
  count: number;
};

export type GeoPoint = {
  latitude: number;
  longitude: number;
};

export type Address = {
  id: Id;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  /** Coarse area shown to providers before acceptance (privacy). */
  approximateArea: string;
  location: GeoPoint;
};

/**
 * Internal settlement breakdown for a marketplace transaction.
 * The customer only ever sees `gross`; the platform commission is taken from
 * the provider share, never added on top of the customer price.
 */
export type Settlement = {
  gross: number;
  commissionRate: number;
  platformFee: number;
  providerNet: number;
  currency: string;
};

export function computeSettlement(gross: number, commissionRate: number, currency: string): Settlement {
  const platformFee = Math.round(gross * commissionRate * 100) / 100;
  return {
    gross,
    commissionRate,
    platformFee,
    providerNet: Math.round((gross - platformFee) * 100) / 100,
    currency,
  };
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';
