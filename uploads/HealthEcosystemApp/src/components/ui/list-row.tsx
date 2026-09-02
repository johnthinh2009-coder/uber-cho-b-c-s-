import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

import { Icon, type IconName } from './icon';
import { PressableScale } from './pressable-scale';
import { Text } from './text';

type ListRowProps = {
  title: string;
  subtitle?: string;
  icon?: IconName;
  /** Replaces the icon, e.g. an avatar or thumbnail. */
  leading?: ReactNode;
  /** Replaces the chevron, e.g. a value, switch or badge. */
  trailing?: ReactNode;
  chevron?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * The workhorse row: optional icon, title, quiet subtitle. Rows sit directly
 * on the page (no card chrome) and are separated by whitespace, like the
 * reference app's account list.
 */
export function ListRow({
  title,
  subtitle,
  icon,
  leading,
  trailing,
  chevron = false,
  onPress,
  accessibilityLabel,
  style,
}: ListRowProps) {
  const { colors } = useTheme();

  const content = (
    <View style={[styles.row, style]}>
      {leading ?? (icon ? <Icon name={icon} size={22} color={colors.text} style={styles.icon} /> : null)}
      <View style={styles.text}>
        <Text variant="bodyStrong" numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" color="textSecondary" numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing ?? (chevron ? <Icon name="chevron-forward" size={18} color={colors.textTertiary} /> : null)}
    </View>
  );

  if (!onPress) return content;

  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (subtitle ? `${title}. ${subtitle}` : title)}
      scaleTo={0.99}>
      {content}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    minHeight: 52,
    paddingVertical: 8,
  },
  icon: { width: 24, textAlign: 'center' },
  text: { flex: 1, gap: 1 },
});
