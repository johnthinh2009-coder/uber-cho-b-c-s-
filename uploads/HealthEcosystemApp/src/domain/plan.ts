import type { Id, ISODateString } from './common';

export type PlanId = 'personal' | 'family';
export type BillingCycle = 'monthly' | 'annual';

export type PlanBenefit = {
  id: Id;
  label: string;
  detail: string;
  includedIn: PlanId[];
};

export type Plan = {
  id: PlanId;
  name: string;
  headline: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  memberCapacity: number;
  heroUrl: string;
  highlights: string[];
};

export type SubscriptionStatus = 'active' | 'pending' | 'cancelled';

export type Subscription = {
  planId: PlanId;
  billing: BillingCycle;
  status: SubscriptionStatus;
  startedAt: ISODateString;
  renewsAt: ISODateString;
  memberIds: Id[];
};

export type PaymentMethod = {
  id: Id;
  brand: 'Visa' | 'Mastercard' | 'Amex';
  last4: string;
  expiry: string;
  isDefault: boolean;
};
