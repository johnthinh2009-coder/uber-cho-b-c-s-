import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useToastStore, type Toast } from '@/store/toast-store';
import { gutter, shadows, useTheme } from '@/theme';

const toneIcon: Record<Toast['tone'], IconName> = {
  neutral: 'information-circle',
  success: 'checkmark-circle',
  warning: 'alert-circle',
  danger: 'close-circle',
};

function ToastCard({ toast }: { toast: Toast }) {
  const { colors, radius } = useTheme();
  const dismiss = useToastStore((s) => s.dismiss);

  useEffect(() => {
    const timer = setTimeout(() => dismiss(toast.id), toast.durationMs);
    return () => clearTimeout(timer);
  }, [dismiss, toast.id, toast.durationMs]);

  const accent = {
    neutral: colors.primary,
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
  }[toast.tone];

  return (
    <Animated.View entering={FadeInUp.duration(220)} exiting={FadeOutUp.duration(180)}>
      <Pressable
        onPress={() => dismiss(toast.id)}
        accessibilityRole="alert"
        accessibilityLabel={`${toast.title}${toast.message ? `. ${toast.message}` : ''}`}
        style={[styles.card, shadows.floating, { backgroundColor: colors.text, borderRadius: radius.lg }]}>
        <Icon name={toneIcon[toast.tone]} size={22} color={accent} />
        <View style={styles.text}>
          <Text variant="bodySmallStrong" color={colors.background}>
            {toast.title}
          </Text>
          {toast.message ? (
            <Text variant="caption" color={colors.borderStrong}>
              {toast.message}
            </Text>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}

/** Mount once at the root. Renders stacked, auto-dismissing toasts. */
export function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);
  const insets = useSafeAreaInsets();
  if (toasts.length === 0) return null;
  return (
    <View style={[styles.host, { top: insets.top + 8 }]}>
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    pointerEvents: 'box-none',
    left: gutter,
    right: gutter,
    gap: 8,
    zIndex: 100,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  text: { flex: 1, gap: 1 },
});
