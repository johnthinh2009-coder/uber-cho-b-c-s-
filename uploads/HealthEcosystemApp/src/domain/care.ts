import { tLabel } from '@/i18n';

import type { Address, Id, ISODateString, Settlement } from './common';
import type { Relationship } from './people';
import type { CareServiceType } from './provider';

/**
 * Broad concern categories used ONLY to match a suitable provider.
 * These are not diagnoses and the app never presents them as such.
 */
export type CareCategory =
  | 'general'
  | 'pain'
  | 'fever_illness'
  | 'skin'
  | 'mobility'
  | 'chronic_support'
  | 'follow_up'
  | 'other';

/** Localised label for `CareCategory` values. */
export function careCategoryLabel(value: CareCategory): string {
  return tLabel('labels.careCategory', value);
}

export type BodyArea =
  | 'head'
  | 'chest'
  | 'abdomen'
  | 'back'
  | 'arms'
  | 'legs'
  | 'skin'
  | 'whole_body'
  | 'not_sure';

/** Localised label for `BodyArea` values. */
export function bodyAreaLabel(value: BodyArea): string {
  return tLabel('labels.bodyArea', value);
}

export type Duration = 'today' | 'few_days' | 'week_plus' | 'month_plus' | 'ongoing';

/** Localised label for `Duration` values. */
export function durationLabel(value: Duration): string {
  return tLabel('labels.duration', value);
}

export type Severity = 'mild' | 'moderate' | 'significant';

/** Localised label for `Severity` values. */
export function severityLabel(value: Severity): string {
  return tLabel('labels.severity', value);
}

export type Mobility = 'fully_mobile' | 'limited' | 'bed_bound';

/** Localised label for `Mobility` values. */
export function mobilityLabel(value: Mobility): string {
  return tLabel('labels.mobility', value);
}

export type PreferredTime = 'asap' | 'morning' | 'afternoon' | 'evening';

/** Localised label for `PreferredTime` values. */
export function preferredTimeLabel(value: PreferredTime): string {
  return tLabel('labels.preferredTime', value);
}

/**
 * Answers collected by the provider-matching form ("Thông tin tình trạng sức
 * khoẻ"). It exists only to find a suitable professional – never to diagnose.
 */
export type HealthQuestionnaire = {
  /** Which home-care service the person is asking for. */
  serviceType: CareServiceType;
  mainConcern: string;
  category: CareCategory;
  bodyArea: BodyArea;
  duration: Duration;
  severity: Severity;
  existingConditions: string[];
  mobility: Mobility;
  preferredTime: PreferredTime;
  addressId: Id;
  language: string;
  notes: string;
};

/**
 * Explicit state machine for a home visit. Transitions only move forward
 * (plus CANCELLED), which keeps both the patient and doctor UIs honest.
 */
export type CareRequestStatus =
  | 'REQUESTED'
  | 'SEARCHING'
  | 'MATCHED'
  | 'DOCTOR_EN_ROUTE'
  | 'DOCTOR_ARRIVED'
  | 'VISIT_IN_PROGRESS'
  | 'VISIT_COMPLETED'
  | 'CANCELLED';

export const careStatusOrder: CareRequestStatus[] = [
  'REQUESTED',
  'SEARCHING',
  'MATCHED',
  'DOCTOR_EN_ROUTE',
  'DOCTOR_ARRIVED',
  'VISIT_IN_PROGRESS',
  'VISIT_COMPLETED',
];

/** Localised label for `CareRequestStatus` values. */
export function careStatusLabel(value: CareRequestStatus): string {
  return tLabel('labels.careStatus', value);
}

export function nextCareStatus(status: CareRequestStatus): CareRequestStatus | null {
  const index = careStatusOrder.indexOf(status);
  if (index === -1 || index === careStatusOrder.length - 1) return null;
  return careStatusOrder[index + 1] ?? null;
}

export function isActiveCareStatus(status: CareRequestStatus): boolean {
  return status !== 'VISIT_COMPLETED' && status !== 'CANCELLED';
}

export type CareTimelineEvent = {
  id: Id;
  status: CareRequestStatus;
  at: ISODateString;
  note?: string;
};

export type MatchReason = {
  headline: string;
  details: string[];
};

export type ProviderMatch = {
  providerId: Id;
  score: number;
  reason: MatchReason;
};

export type CareRequest = {
  id: Id;
  /** Patient the visit is for (may be a family member). */
  patient: {
    id: Id;
    name: string;
    avatarUrl: string;
    relationship: Relationship;
    age: number;
  };
  requestedById: Id;
  questionnaire: HealthQuestionnaire;
  address: Address;
  status: CareRequestStatus;
  providerId?: Id;
  createdAt: ISODateString;
  scheduledFor: ISODateString;
  etaMinutes?: number;
  price: number;
  /** Internal – never rendered on patient screens. */
  settlement: Settlement;
  timeline: CareTimelineEvent[];
  summary?: VisitSummary;
  patientRating?: number;
};

export type VisitSummary = {
  id: Id;
  careRequestId: Id;
  providerId: Id;
  writtenAt: ISODateString;
  findings: string;
  advice: string;
  followUp: string;
  prescriptionId?: Id;
};

export type AppointmentKind = 'home_visit' | 'video' | 'clinic';

export type Appointment = {
  id: Id;
  kind: AppointmentKind;
  providerId: Id;
  patientName: string;
  patientAvatarUrl: string;
  startsAt: ISODateString;
  durationMinutes: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  reason: string;
  careRequestId?: Id;
  addressLabel: string;
};

/** A care request as seen in the provider marketplace – privacy-reduced. */
export type ProviderRequestCard = {
  careRequestId: Id;
  approximateArea: string;
  serviceType: CareServiceType;
  category: CareCategory;
  requestedFor: ISODateString;
  travelMinutes: number;
  distanceKm: number;
  estimatedEarnings: number;
  patientAgeBand: string;
  mobility: Mobility;
  matchNote: string;
  language: string;
};
