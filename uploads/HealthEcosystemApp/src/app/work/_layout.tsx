import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/store/auth-store';
import { useTheme } from '@/theme';

/**
 * Provider workspace routes (tasks, notes, availability, visit details).
 * Customer accounts can never reach these screens – professional notes in
 * particular must stay private.
 */
export default function WorkLayout() {
  const { colors } = useTheme();
  const hydrated = useAuthStore((s) => s.hydrated);
  const role = useAuthStore((s) => s.role);
  const providerStatus = useAuthStore((s) => s.providerStatus);

  if (hydrated && (role !== 'provider' || providerStatus !== 'approved')) return <Redirect href="/home" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="tasks" />
      <Stack.Screen name="notes" />
      <Stack.Screen name="hours" />
      <Stack.Screen name="task/new" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="task/[id]" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="note/new" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="note/[id]" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="visit/[id]" />
    </Stack>
  );
}
