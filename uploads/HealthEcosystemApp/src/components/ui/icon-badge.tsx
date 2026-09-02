import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme, type AccentTone } from '@/theme';

import { Icon, type IconName } from './icon';

type IconBadgeProps = {
  icon: IconName;
  tone: AccentTone;
  /** Outer size of the circle / rounded square. */
  size?: number;
  /** 'circle' for shortcuts, 'rounded' for list rows and tiles. */
  shape?: 'circle' | 'rounded';
  style?: StyleProp<ViewStyle>;
};

/**
 * A vibrant icon on its own soft tinted background.
 *
 * This is where colour lives in the product: surfaces stay white/grey, and
 * each service, category or row gets a recognisable accent.
 */
export function IconBadge({ icon, tone, size = 56, shape = 'circle', style }: IconBadgeProps) {
  const { colors, radius } = useTheme();
  return (
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: shape === 'circle' ? size / 2 : radius.md,
          backgroundColor: colors.accentSurfaces[tone],
        },
        style,
      ]}>
      <Icon name={icon} size={Math.round(size * 0.46)} color={colors.accents[tone]} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
});
