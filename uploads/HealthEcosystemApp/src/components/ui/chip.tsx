import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

import { Icon, type IconName } from './icon';
import { PressableScale } from './pressable-scale';
import { Text } from './text';

export type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

/** Filter pill: grey when idle, solid black when selected. */
export function Chip({ label, selected = false, onPress, icon, style, accessibilityLabel }: ChipProps) {
  const { colors, radius } = useTheme();

  const content = (
    <View
      style={[
        styles.base,
        {
          borderRadius: radius.pill,
          backgroundColor: selected ? colors.primary : colors.surface,
        },
      ]}>
      {icon ? <Icon name={icon} size={16} color={selected ? colors.onPrimary : colors.textSecondary} /> : null}
      <Text variant="captionStrong" color={selected ? colors.onPrimary : colors.text} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );

  if (!onPress) return <View style={style}>{content}</View>;

  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}
      scaleTo={0.96}
      style={style}>
      {content}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 38,
    paddingHorizontal: 14,
  },
});
