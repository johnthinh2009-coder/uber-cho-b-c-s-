import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { todayKey } from '@/utils/date';

import { localId } from './persist';

export type RepeatRule = 'daily' | 'weekdays' | 'alternate';
export type AlarmSound = 'gentle' | 'classic' | 'vibrate';
export type AlarmVolume = 'low' | 'medium' | 'high';
export type DoseOutcome = 'taken' | 'skipped';

export type Reminder = {
  id: string;
  name: string;
  dose: string;
  /** 24h times, e.g. "08:00". */
  times: string[];
  repeat: RepeatRule;
  snoozeCount: number;
  sound: AlarmSound;
  volume: AlarmVolume;
  createdAt: string;
};

export type ReminderInput = Omit<Reminder, 'id' | 'createdAt'>;

/** Key: `${reminderId}|${date}|${time}` so each dose is tracked once per day. */
export type DoseKey = string;

export const doseKey = (reminderId: string, date: string, time: string): DoseKey => `${reminderId}|${date}|${time}`;

type ReminderState = {
  reminders: Reminder[];
  outcomes: Record<DoseKey, DoseOutcome>;
  /** Doses already announced in this session, so the alarm fires once. */
  announced: DoseKey[];
  add: (input: ReminderInput) => Reminder;
  update: (id: string, patch: Partial<ReminderInput>) => void;
  remove: (id: string) => void;
  setOutcome: (key: DoseKey, outcome: DoseOutcome) => void;
  markAnnounced: (key: DoseKey) => void;
};

export const useReminderStore = create<ReminderState>()(
  persist(
    (set, get) => ({
      reminders: [],
      outcomes: {},
      announced: [],

      add: (input) => {
        const reminder: Reminder = { ...input, id: localId('rem'), createdAt: new Date().toISOString() };
        set({ reminders: [...get().reminders, reminder] });
        return reminder;
      },

      update: (id, patch) =>
        set({ reminders: get().reminders.map((reminder) => (reminder.id === id ? { ...reminder, ...patch } : reminder)) }),

      remove: (id) =>
        set({
          reminders: get().reminders.filter((reminder) => reminder.id !== id),
          outcomes: Object.fromEntries(Object.entries(get().outcomes).filter(([key]) => !key.startsWith(`${id}|`))),
        }),

      setOutcome: (key, outcome) => set({ outcomes: { ...get().outcomes, [key]: outcome } }),

      markAnnounced: (key) => set({ announced: [...get().announced, key] }),
    }),
    {
      name: 'haven.reminders',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      partialize: (state) => ({ reminders: state.reminders, outcomes: state.outcomes }) as ReminderState,
    },
  ),
);

export type ScheduledDose = {
  key: DoseKey;
  reminder: Reminder;
  time: string;
  minutes: number;
  outcome?: DoseOutcome;
};

function toMinutes(time: string): number {
  const [h = '0', m = '0'] = time.split(':');
  return Number(h) * 60 + Number(m);
}

/** Does this reminder run on the given date? */
export function runsOn(reminder: Reminder, date: Date): boolean {
  if (reminder.repeat === 'daily') return true;
  if (reminder.repeat === 'weekdays') {
    const day = date.getDay();
    return day >= 1 && day <= 5;
  }
  const created = new Date(reminder.createdAt);
  const days = Math.floor((date.getTime() - created.getTime()) / 86_400_000);
  return days % 2 === 0;
}

/** All doses due today, in time order. */
export function dosesForToday(reminders: Reminder[], outcomes: Record<DoseKey, DoseOutcome>, now = new Date()): ScheduledDose[] {
  const date = todayKey();
  return reminders
    .filter((reminder) => runsOn(reminder, now))
    .flatMap((reminder) =>
      reminder.times.map((time) => ({
        key: doseKey(reminder.id, date, time),
        reminder,
        time,
        minutes: toMinutes(time),
        outcome: outcomes[doseKey(reminder.id, date, time)],
      })),
    )
    .sort((a, b) => a.minutes - b.minutes);
}
