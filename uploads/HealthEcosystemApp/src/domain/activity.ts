import type { Id, ISODateString, Pillar } from './common';

export type ActivityKind =
  | 'food_order'
  | 'doctor_booking'
  | 'visit_completed'
  | 'workout'
  | 'medication'
  | 'prescription'
  | 'plan';

export type ActivityItem = {
  id: Id;
  pillar: Pillar;
  kind: ActivityKind;
  title: string;
  subtitle: string;
  at: ISODateString;
  status: 'upcoming' | 'in_progress' | 'done' | 'cancelled';
  amount?: number;
  imageUrl?: string;
  /** Route to open for details. Typed loosely; screens validate. */
  href?: string;
};

export type TodayItemAction = {
  label: string;
  /** Action identifiers are resolved by the Today section. */
  type: 'navigate' | 'mark_taken' | 'start_workout' | 'track_order' | 'view_visit';
  href?: string;
  payloadId?: Id;
};

export type TodayItem = {
  id: Id;
  pillar: Pillar;
  time: string;
  sortKey: number;
  title: string;
  subtitle: string;
  done: boolean;
  action: TodayItemAction;
};
