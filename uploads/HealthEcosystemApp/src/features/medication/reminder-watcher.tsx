import { useEffect } from 'react';

import { t } from '@/i18n';
import { dosesForToday, useReminderStore } from '@/store/reminder-store';
import { toast } from '@/store/toast-store';
import { formatClock } from '@/utils/date';
import { haptics } from '@/utils/haptics';

const TICK_MS = 20_000;

/**
 * Alarm simulation.
 *
 * Native push notifications are deliberately NOT used: they would break the
 * web build and cannot fire in Expo Go anyway. Instead a light ticker checks
 * whether a dose is due and raises an in-app alert, which is what the demo
 * needs to show the behaviour.
 */
export function ReminderWatcher() {
  useEffect(() => {
    const check = () => {
      const { reminders, outcomes, announced, markAnnounced } = useReminderStore.getState();
      if (reminders.length === 0) return;

      const now = new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();

      for (const dose of dosesForToday(reminders, outcomes, now)) {
        const due = minutes >= dose.minutes && minutes - dose.minutes <= 5;
        if (!due || dose.outcome || announced.includes(dose.key)) continue;
        markAnnounced(dose.key);
        haptics.medium();
        toast.show({
          title: t('meds.dueTitle', { name: dose.reminder.name }),
          message: t('meds.dueBody', { dose: dose.reminder.dose || '—', time: formatClock(dose.time) }),
          tone: 'warning',
          durationMs: 6000,
        });
        break;
      }
    };

    check();
    const timer = setInterval(check, TICK_MS);
    return () => clearInterval(timer);
  }, []);

  return null;
}
