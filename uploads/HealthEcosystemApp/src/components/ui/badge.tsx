import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

import { Icon, type IconName } from './icon';
import { Text } from './text';

export type BadgeTone = 'neutral' | 'accent' | 'warning' | 'danger' | 'info' | 'dark' | 'light';

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
  icon?: IconName;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
};

/** Small status marker. Never used for promotions – only for facts. */
export function Badge({ label, tone = 'neutral', icon, size = 'md', style }: BadgeProps) {
  const { colors, radius } = useTheme();
  const palette = (() => {
    switch (tone) {
      case 'accent':
        return { bg: colors.accentSoft, fg: colors.accent };
      case 'warning':
        return { bg: colors.warningSoft, fg: colors.warning };
      case 'danger':
        return { bg: colors.dangerSoft, fg: colors.danger };
      case 'info':
        return { bg: colors.infoSoft, fg: colors.info };
      case 'dark':
        return { bg: colors.surfaceInverse, fg: colors.textInverse };
      case 'light':
        return { bg: colors.background, fg: colors.text };
      case 'neutral':
      default:
        return { bg: colors.surface, fg: colors.textSecondary };
    }
  })();

  return (
    <View
      style={[
        styles.base,
        size === 'sm' ? styles.sm : styles.md,
        { backgroundColor: palette.bg, borderRadius: radius.sm },
        style,
      ]}>
      {icon ? <Icon name={icon} size={size === 'sm' ? 12 : 14} color={palette.fg} /> : null}
      <Text variant={size === 'sm' ? 'label' : 'captionStrong'} color={palette.fg} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
  },
  sm: { paddingHorizontal: 6, height: 22 },
  md: { paddingHorizontal: 8, height: 26 },
});
