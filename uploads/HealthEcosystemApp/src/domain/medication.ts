import { tLabel } from '@/i18n';

import type { Id, ISODateString } from './common';

export type MedicationRoute = 'Oral' | 'Topical' | 'Inhaled' | 'Injection' | 'Drops';

export type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export const weekdays: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Localised weekday abbreviation, e.g. 'Mon' → 'T2'. */
export function weekdayLabel(day: Weekday): string {
  return tLabel('labels.weekday', day);
}

export function routeLabel(route: MedicationRoute): string {
  return tLabel('labels.route', route);
}

export function doseStatusLabel(status: DoseStatus): string {
  return tLabel('labels.doseStatus', status);
}

export type MedicationSource =
  | { type: 'prescription'; prescriptionId: Id; doctorId: Id; doctorName: string }
  | { type: 'self' };

export type Medication = {
  id: Id;
  /** Which family member this medication belongs to. */
  patientId: Id;
  name: string;
  strength: string;
  dose: string;
  route: MedicationRoute;
  frequencyLabel: string;
  /** 24h times, e.g. "08:00". */
  times: string[];
  days: Weekday[];
  durationDays: number | null;
  startDate: ISODateString;
  instructions: string;
  source: MedicationSource;
  /** Presentational colour key so each medication is recognisable at a glance. */
  colorKey: 'plum' | 'pine' | 'apricot' | 'rose' | 'sky';
  isActive: boolean;
};

export type DoseStatus = 'scheduled' | 'taken' | 'skipped' | 'snoozed';

export type MedicationDose = {
  id: Id;
  medicationId: Id;
  /** Local date "YYYY-MM-DD". */
  date: string;
  time: string;
  status: DoseStatus;
  takenAt?: ISODateString;
  snoozedUntil?: string;
};

export type AdherenceDay = {
  date: string;
  taken: number;
  scheduled: number;
};

export type PrescriptionStatus = 'draft' | 'issued' | 'added_to_schedule' | 'expired';

export type PrescriptionItem = {
  id: Id;
  medicationName: string;
  strength: string;
  dose: string;
  route: MedicationRoute;
  frequencyLabel: string;
  times: string[];
  durationDays: number;
  instructions: string;
};

export type Prescription = {
  id: Id;
  patientId: Id;
  patientName: string;
  doctorId: Id;
  doctorName: string;
  careRequestId?: Id;
  issuedAt: ISODateString;
  status: PrescriptionStatus;
  items: PrescriptionItem[];
  notes: string;
};
