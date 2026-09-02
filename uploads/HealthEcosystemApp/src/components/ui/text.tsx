import { Text as RNText, StyleSheet, type TextProps as RNTextProps } from 'react-native';

import { useTheme, type ThemeColors, type TypeVariant } from '@/theme';

type ColorKey = keyof Pick<
  ThemeColors,
  'text' | 'textSecondary' | 'textTertiary' | 'textInverse' | 'primary' | 'danger' | 'success' | 'warning' | 'accent'
>;

export type TextProps = RNTextProps & {
  variant?: TypeVariant;
  /** Theme colour key, or any explicit colour string. */
  color?: ColorKey | (string & {});
  align?: 'left' | 'center' | 'right';
};

const colorKeys: ColorKey[] = [
  'text',
  'textSecondary',
  'textTertiary',
  'textInverse',
  'primary',
  'danger',
  'success',
  'warning',
  'accent',
];

export function Text({ variant = 'body', color = 'text', align, style, children, ...rest }: TextProps) {
  const { colors, type } = useTheme();
  const resolvedColor = (colorKeys as string[]).includes(color) ? colors[color as ColorKey] : color;

  return (
    <RNText
      maxFontSizeMultiplier={1.35}
      {...rest}
      style={[styles.base, type[variant], { color: resolvedColor }, align ? { textAlign: align } : null, style]}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
