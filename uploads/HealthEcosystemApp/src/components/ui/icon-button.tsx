import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

import { Icon, type IconName } from './icon';
import { PressableScale, type PressableScaleProps } from './pressable-scale';
import { Text } from './text';

type IconButtonProps = Omit<PressableScaleProps, 'children' | 'style'> & {
  icon: IconName;
  /** Required – icon-only controls must be labelled for screen readers. */
  accessibilityLabel: string;
  variant?: 'soft' | 'plain' | 'inverse' | 'primary' | 'outline';
  size?: number;
  iconSize?: number;
  color?: string;
  badge?: number;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({
  icon,
  accessibilityLabel,
  variant = 'soft',
  size = 44,
  iconSize = 22,
  color,
  badge,
  style,
  ...rest
}: IconButtonProps) {
  const { colors } = useTheme();
  const palette = {
    soft: { bg: colors.surface, fg: colors.text, border: 'transparent' },
    plain: { bg: 'transparent', fg: colors.text, border: 'transparent' },
    inverse: { bg: 'rgba(255,255,255,0.92)', fg: '#14201D', border: 'transparent' },
    primary: { bg: colors.primary, fg: colors.onPrimary, border: 'transparent' },
    outline: { bg: colors.background, fg: colors.text, border: colors.border },
  }[variant];

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      scaleTo={0.92}
      {...rest}
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: palette.bg,
          borderColor: palette.border,
          borderWidth: variant === 'outline' ? 1 : 0,
        },
        style,
      ]}>
      <Icon name={icon} size={iconSize} color={color ?? palette.fg} />
      {badge ? (
        <View style={[styles.badge, { backgroundColor: colors.danger, borderColor: colors.background }]}>
          <Text variant="label" color="textInverse" style={styles.badgeText}>
            {badge > 9 ? '9+' : badge}
          </Text>
        </View>
      ) : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 14,
  },
});
