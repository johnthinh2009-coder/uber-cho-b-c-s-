import { tLabel } from '@/i18n';

import type { CareCategory } from './care';
import type { Id, ISODateString, Rating } from './common';

/**
 * Healthcare professions on the platform. Doctors are the flagship role, but
 * the care marketplace deliberately covers the wider home-healthcare team.
 */
export type ProviderRole =
  | 'doctor_general'
  | 'doctor_specialist'
  | 'nurse'
  | 'physiotherapist'
  | 'rehabilitation'
  | 'musculoskeletal'
  | 'elderly_caregiver'
  | 'post_treatment_care'
  | 'nutritionist'
  | 'mental_health';

/** Patient-facing home-care services a person can request. */
export type CareServiceType =
  | 'home_doctor'
  | 'home_nursing'
  | 'physiotherapy'
  | 'rehabilitation'
  | 'musculoskeletal'
  | 'post_treatment'
  | 'elderly_care'
  | 'nutrition'
  | 'mental_health';

export const careServiceOrder: CareServiceType[] = [
  'home_doctor',
  'home_nursing',
  'physiotherapy',
  'rehabilitation',
  'musculoskeletal',
  'post_treatment',
  'elderly_care',
  'nutrition',
  'mental_health',
];

/** Which professions can deliver each service. Used by matching. */
export const careServiceRoles: Record<CareServiceType, ProviderRole[]> = {
  home_doctor: ['doctor_general', 'doctor_specialist'],
  home_nursing: ['nurse', 'post_treatment_care'],
  physiotherapy: ['physiotherapist', 'rehabilitation'],
  rehabilitation: ['rehabilitation', 'physiotherapist'],
  musculoskeletal: ['musculoskeletal', 'physiotherapist'],
  post_treatment: ['post_treatment_care', 'nurse'],
  elderly_care: ['elderly_caregiver', 'nurse', 'doctor_specialist'],
  nutrition: ['nutritionist'],
  mental_health: ['mental_health'],
};

/** Only licensed doctors can issue prescriptions in this product. */
export const PRESCRIBING_ROLES: ProviderRole[] = ['doctor_general', 'doctor_specialist'];

export type DoctorAvailability = 'available_now' | 'today' | 'tomorrow' | 'offline';

export type ProviderReview = {
  id: Id;
  authorName: string;
  authorAvatarUrl: string;
  rating: number;
  comment: string;
  date: ISODateString;
};

export type ProviderService = {
  id: Id;
  name: string;
  description: string;
  price: number;
};

export type Provider = {
  id: Id;
  /** Professional display prefix, e.g. "BS.", "BS.CKI", "ĐD.", "KTV.", "CV." – demo data only. */
  title: string;
  firstName: string;
  lastName: string;
  portraitUrl: string;
  verified: boolean;
  role: ProviderRole;
  /** Headline expertise shown under the name, e.g. "Nội tổng quát", "Phục hồi sau đột quỵ". */
  expertise: string;
  qualifications: string[];
  experienceYears: number;
  languages: string[];
  rating: Rating;
  completedVisits: number;
  distanceKm: number;
  etaMinutes: number;
  /** Starting price for a home visit / session. */
  visitPrice: number;
  availability: DoctorAvailability;
  nextAvailableLabel: string;
  bio: string;
  interests: string[];
  services: ProviderService[];
  reviews: ProviderReview[];
  /** Patient-facing services this provider delivers. */
  serviceTypes: CareServiceType[];
  /** Concern categories this provider is well suited to – used by matching. */
  suitedFor: CareCategory[];
  /** Licensed to prescribe (doctors only). */
  canPrescribe: boolean;
};

/** "BS. Nguyễn Thu Hà" – title, family name, given name. */
export function providerDisplayName(provider: Pick<Provider, 'title' | 'firstName' | 'lastName'>): string {
  return `${provider.title} ${provider.lastName} ${provider.firstName}`.trim();
}

/** "BS. Thu Hà" – Vietnamese short form uses the given name. */
export function providerShortName(provider: Pick<Provider, 'title' | 'firstName'>): string {
  return `${provider.title} ${provider.firstName}`.trim();
}

export function providerRoleLabel(role: ProviderRole): string {
  return tLabel('labels.providerRole', role);
}

/** Compact role label for small cards, e.g. 'Điều dưỡng'. */
export function providerRoleShortLabel(role: ProviderRole): string {
  return tLabel('labels.providerRoleShort', role);
}

export function careServiceLabel(service: CareServiceType): string {
  return tLabel('labels.careService', service);
}

export function careServiceDescription(service: CareServiceType): string {
  return tLabel('labels.careServiceDescription', service);
}

export function availabilityLabel(availability: DoctorAvailability): string {
  return tLabel('labels.availability', availability);
}

export function isDoctor(provider: Pick<Provider, 'role'>): boolean {
  return PRESCRIBING_ROLES.includes(provider.role);
}
