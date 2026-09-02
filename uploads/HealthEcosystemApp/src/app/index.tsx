import { Redirect } from 'expo-router';
import { View } from 'react-native';

import { useAuthStore } from '@/store/auth-store';

/**
 * Entry gate. Everyone starts at the role picker; after that the app routes to
 * the customer tabs, the provider tabs, or the pending-approval screen.
 */
export default function Index() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const role = useAuthStore((s) => s.role);
  const signedIn = useAuthStore((s) => s.signedIn);
  const guest = useAuthStore((s) => s.guest);
  const providerStatus = useAuthStore((s) => s.providerStatus);

  // Wait for persisted auth to load so we never flash the wrong screen.
  if (!hydrated) return <View />;

  if (role === 'provider') {
    if (providerStatus === 'approved') return <Redirect href="/dashboard" />;
    if (providerStatus === 'pending') return <Redirect href="/auth/provider/pending" />;
    return <Redirect href="/auth/provider/sign-up" />;
  }

  if (signedIn || guest) return <Redirect href="/home" />;
  return <Redirect href="/welcome" />;
}
