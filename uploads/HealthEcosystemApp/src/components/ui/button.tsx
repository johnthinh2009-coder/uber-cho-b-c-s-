import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { radius as radii, useTheme } from '@/theme';

import { Icon, type IconName } from './icon';
import { PressableScale, type PressableScaleProps } from './pressable-scale';
import { Text } from './text';

/** `primary` is black, like a transit app. `accent` is reserved for health confirmations. */
export type ButtonVariant = 'primary' | 'secondary' | 'soft' | 'ghost' | 'accent' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<PressableScaleProps, 'children' | 'style'> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconRight?: IconName;
  loading?: boolean;
  fullWidth?: boolean;
  /** Square-ish corners read as "app", fully round reads as "marketing". */
  rounded?: boolean;
  style?: StyleProp<ViewStyle>;
};

const sizeStyles: Record<ButtonSize, { height: number; paddingHorizontal: number; iconSize: number }> = {
  sm: { height: 38, paddingHorizontal: 14, iconSize: 17 },
  md: { height: 48, paddingHorizontal: 20, iconSize: 19 },
  lg: { height: 54, paddingHorizontal: 24, iconSize: 20 },
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  fullWidth = false,
  rounded = false,
  style,
  disabled,
  ...rest
}: ButtonProps) {
  const { colors } = useTheme();

  const palette = (() => {
    switch (variant) {
      case 'primary':
        return { bg: colors.primary, fg: colors.onPrimary, border: 'transparent' };
      case 'secondary':
        return { bg: colors.background, fg: colors.text, border: colors.borderStrong };
      case 'soft':
        return { bg: colors.surface, fg: colors.text, border: 'transparent' };
      case 'ghost':
        return { bg: 'transparent', fg: colors.text, border: 'transparent' };
      case 'accent':
        return { bg: colors.accent, fg: colors.onAccent, border: 'transparent' };
      case 'danger':
        return { bg: colors.dangerSoft, fg: colors.danger, border: 'transparent' };
    }
  })();

  const dimensions = sizeStyles[size];
  const isDisabled = disabled || loading;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      haptic="light"
      disabled={isDisabled}
      scaleTo={0.97}
      {...rest}
      style={[
        styles.base,
        {
          height: dimensions.height,
          paddingHorizontal: dimensions.paddingHorizontal,
          backgroundColor: palette.bg,
          borderColor: palette.border,
          borderRadius: rounded ? radii.pill : radii.md,
          borderWidth: variant === 'secondary' ? 1 : 0,
          opacity: isDisabled ? 0.5 : 1,
        },
        fullWidth ? styles.fullWidth : null,
        style,
      ]}>
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={palette.fg} />
        ) : (
          <>
            {icon ? <Icon name={icon} size={dimensions.iconSize} color={palette.fg} /> : null}
            <Text variant={size === 'sm' ? 'buttonSmall' : 'button'} color={palette.fg} numberOfLines={1}>
              {label}
            </Text>
            {iconRight ? <Icon name={iconRight} size={dimensions.iconSize} color={palette.fg} /> : null}
          </>
        )}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
