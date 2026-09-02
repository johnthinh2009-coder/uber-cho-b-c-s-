import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme, type AccentTone } from '@/theme';

import type { IconName } from './icon';
import { IconBadge } from './icon-badge';
import { PressableScale } from './pressable-scale';
import { Text } from './text';

type TileProps = {
  label: string;
  icon: IconName;
  tone: AccentTone;
  onPress: () => void;
  /** Small note under the label, e.g. a short qualifier. */
  meta?: string;
  height?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

/** Grey tile with a vibrant icon badge – Services grid and Account shortcuts. */
export function Tile({ label, icon, tone, onPress, meta, height = 104, style, accessibilityLabel }: TileProps) {
  const { colors, radius } = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      scaleTo={0.97}
      style={[styles.base, { backgroundColor: colors.surface, borderRadius: radius.lg, minHeight: height }, style]}>
      <IconBadge icon={icon} tone={tone} size={40} shape="rounded" />
      <View style={styles.text}>
        <Text variant="bodySmallStrong" numberOfLines={2}>
          {label}
        </Text>
        {meta ? (
          <Text variant="label" color="textSecondary" numberOfLines={1}>
            {meta}
          </Text>
        ) : null}
      </View>
    </PressableScale>
  );
}

type QuickCircleProps = {
  label: string;
  icon: IconName;
  tone: AccentTone;
  onPress: () => void;
  width?: number;
};

/** Circular colourful shortcut with the label underneath (home row). */
export function QuickCircle({ label, icon, tone, onPress, width = 82 }: QuickCircleProps) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      scaleTo={0.94}
      style={[styles.quick, { width }]}>
      <IconBadge icon={icon} tone={tone} size={62} />
      <Text variant="label" align="center" numberOfLines={2} style={styles.quickLabel}>
        {label}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
    gap: 10,
  },
  text: { gap: 1 },
  quick: { alignItems: 'center', gap: 8 },
  quickLabel: { minHeight: 34 },
});
