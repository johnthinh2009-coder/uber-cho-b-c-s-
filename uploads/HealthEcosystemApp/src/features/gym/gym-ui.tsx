import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { IconBadge } from '@/components/ui/icon-badge';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { EQUIPMENT_ICONS, type LibraryExercise } from '@/mocks/exercises';
import { useTheme, type AccentTone } from '@/theme';

/** The workout module's action colour – the shared Haven blue accent. */
export const GYM_BLUE = '#1A73E8';

export function GymHeader({
  title,
  left,
  right,
}: {
  title: string;
  left?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.side}>{left}</View>
      <Text variant="subheading" numberOfLines={1} accessibilityRole="header" style={styles.headerTitle}>
        {title}
      </Text>
      <View style={[styles.side, styles.right]}>{right}</View>
    </View>
  );
}

export function HeaderAction({ label, onPress, tone = 'accent', disabled }: { label: string; onPress: () => void; tone?: 'accent' | 'muted'; disabled?: boolean }) {
  const { colors } = useTheme();
  return (
    <PressableScale onPress={onPress} accessibilityRole="button" accessibilityLabel={label} disabled={disabled} scaleTo={0.95}>
      <Text variant="bodySmallStrong" color={disabled ? colors.textTertiary : tone === 'accent' ? GYM_BLUE : colors.textSecondary}>
        {label}
      </Text>
    </PressableScale>
  );
}

/** Circular exercise thumbnail, tinted by equipment so the list reads fast. */
const EQUIPMENT_TONES: Record<LibraryExercise['equipment'], AccentTone> = {
  barbell: 'blue',
  dumbbell: 'teal',
  machine: 'purple',
  cable: 'orange',
  bodyweight: 'green',
  kettlebell: 'coral',
};

export function ExerciseThumb({ exercise, size = 46 }: { exercise: Pick<LibraryExercise, 'equipment'>; size?: number }) {
  return <IconBadge icon={EQUIPMENT_ICONS[exercise.equipment]} tone={EQUIPMENT_TONES[exercise.equipment]} size={size} />;
}

export function GymCard({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { colors, radius } = useTheme();
  return <View style={[{ backgroundColor: colors.surface, borderRadius: radius.lg }, styles.card, style]}>{children}</View>;
}

export function GymEmpty({ icon = 'barbell-outline', title, body }: { icon?: 'barbell-outline' | 'stats-chart-outline'; title: string; body?: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.empty}>
      <Icon name={icon} size={40} color={colors.textTertiary} />
      <Text variant="bodyStrong" align="center">
        {title}
      </Text>
      {body ? (
        <Text variant="bodySmall" color="textSecondary" align="center">
          {body}
        </Text>
      ) : null}
    </View>
  );
}

export function useGymLabels() {
  const { t } = useI18n();
  return t;
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, minHeight: 52, gap: 12 },
  side: { minWidth: 64, flexDirection: 'row', alignItems: 'center' },
  right: { justifyContent: 'flex-end' },
  headerTitle: { flex: 1, textAlign: 'center' },
  thumb: { alignItems: 'center', justifyContent: 'center' },
  card: { padding: 16 },
  empty: { alignItems: 'center', gap: 10, paddingVertical: 40, paddingHorizontal: 24 },
});
