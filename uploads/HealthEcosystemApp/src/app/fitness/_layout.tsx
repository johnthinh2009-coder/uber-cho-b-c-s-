import { Stack } from 'expo-router';

import { useTheme } from '@/theme';

/**
 * The workout module is a focused sub-app, but it uses the SAME light theme as
 * the rest of Haven: white canvas, light grey cards, black type, blue actions.
 */
export default function FitnessLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="routine/new" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="routine/[id]" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="exercise-picker" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="session" options={{ animation: 'slide_from_bottom' }} />
    </Stack>
  );
}
