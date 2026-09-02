import type { DeepPartial } from './types';
import type { Dictionary } from './vi';

/**
 * English – optional secondary language.
 *
 * This dictionary mirrors the structure of `vi.ts`; any missing key falls
 * back to Vietnamese at runtime, so translations can be added incrementally
 * without touching the UI.
 */
export const en: DeepPartial<Dictionary> = {
  common: {
    seeAll: 'See all',
    manage: 'Manage',
    back: 'Back',
    close: 'Close',
    backHome: 'Back to Home',
    goHome: 'Go to Home',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    done: 'Done',
    next: 'Next',
    retry: 'Try again',
    loading: 'Loading…',
    search: 'Search',
  },
  nav: {
    patient: { home: 'Home', services: 'Services', activity: 'Activity', account: 'Account' },
    provider: { home: 'Home', schedule: 'Schedule', summary: 'Summary', account: 'Account' },
  },
  pillars: {
    care: { label: 'Home healthcare', short: 'Care' },
    food: { label: 'Nutrition', short: 'Nutrition' },
    medication: { label: 'Medication', short: 'Meds' },
    fitness: { label: 'Movement', short: 'Movement' },
    family: { label: 'Family', short: 'Family' },
  },
  greeting: {
    night: 'Hello',
    morning: 'Good morning',
    noon: 'Good afternoon',
    afternoon: 'Good afternoon',
    evening: 'Good evening',
  },
  home: {
    searchPlaceholder: 'What do you need today?',
    meals: 'Meals that suit you',
    upcoming: 'Upcoming',
  },
  services: { title: 'Services' },
  activity: { title: 'Activity', upcoming: 'Upcoming', past: 'Past', summaryTitle: 'Health summary' },
  account: { title: 'Account' },
};
