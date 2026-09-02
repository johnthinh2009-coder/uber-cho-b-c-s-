import { tLabel } from '@/i18n';

import type { Address, Id, ISODateString } from './common';
import type { ProviderRole } from './provider';

export type Relationship = 'self' | 'partner' | 'child' | 'parent' | 'other';

/** Localised relationship label, e.g. 'partner' → 'Vợ/chồng'. */
export function relationshipLabel(relationship: Relationship): string {
  return tLabel('labels.relationship', relationship);
}

export type Person = {
  id: Id;
  /** Given name(s), e.g. "Minh Anh". */
  firstName: string;
  /** Family name, e.g. "Nguyễn". */
  lastName: string;
  /** Familiar form used in sentences, e.g. "bà Lan" – defaults to the given name. */
  shortName?: string;
  avatarUrl: string;
  dateOfBirth: ISODateString;
};

export type FamilyMember = Person & {
  relationship: Relationship;
  /** Short health status line shown on family cards, e.g. "Medication 2/2 today". */
  statusLine: string;
  /** Conditions the member has chosen to share for matching – fictional demo data. */
  sharedConditions: string[];
  allergies: string[];
  bloodType?: string;
};

export type PatientProfile = Person & {
  email: string;
  phoneMasked: string;
  addresses: Address[];
  preferredLanguage: string;
  /** Members managed under the patient's plan (includes self as `relationship: 'self'`). */
  family: FamilyMember[];
};

export type ProviderProfile = Person & {
  providerId: Id;
  title: string;
  role: ProviderRole;
  expertise: string;
  isOnline: boolean;
};

/** Vietnamese order: family name first – "Nguyễn Minh Anh". */
export function fullName(person: Pick<Person, 'firstName' | 'lastName'>): string {
  return `${person.lastName} ${person.firstName}`.trim();
}

/** Familiar name for sentences: "bà Lan", "Hoàng Nam". */
export function shortName(person: Pick<Person, 'firstName' | 'shortName'>): string {
  return person.shortName ?? person.firstName;
}

export function ageFromDateOfBirth(dateOfBirth: ISODateString, now = new Date()): number {
  const dob = new Date(dateOfBirth);
  let age = now.getFullYear() - dob.getFullYear();
  const hasHadBirthday =
    now.getMonth() > dob.getMonth() ||
    (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate());
  if (!hasHadBirthday) age -= 1;
  return age;
}
