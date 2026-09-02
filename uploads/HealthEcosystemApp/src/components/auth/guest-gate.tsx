import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { useI18n } from '@/i18n';
import { useAuthStore } from '@/store/auth-store';
import { toast } from '@/store/toast-store';

/**
 * Guest mode can browse public content. Anything that writes data – booking,
 * logging food, messaging, reminders – asks the visitor to sign in first.
 */
export function useGuestGate() {
  const router = useRouter();
  const { t } = useI18n();
  const guest = useAuthStore((s) => s.guest);
  const signedIn = useAuthStore((s) => s.signedIn);

  const requireAccount = useCallback(
    (action: () => void) => {
      if (signedIn) {
        action();
        return;
      }
      toast.show({ title: t('auth.guestBlockTitle'), message: t('auth.guestBlockBody'), tone: 'neutral' });
      router.push('/auth/sign-in');
    },
    [signedIn, router, t],
  );

  return { isGuest: guest && !signedIn, requireAccount };
}
