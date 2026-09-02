import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';
import { initials } from '@/utils/format';

import { RemoteImage } from './remote-image';
import { Text } from './text';

type AvatarProps = {
  uri?: string;
  name: string;
  size?: number;
  /** Ring colour, e.g. a pillar hue, to show status or selection. */
  ringColor?: string;
  style?: StyleProp<ViewStyle>;
};

export function Avatar({ uri, name, size = 44, ringColor, style }: AvatarProps) {
  const { colors } = useTheme();
  const ring = ringColor ? { borderWidth: 2.5, borderColor: ringColor, padding: 2 } : null;

  return (
    <View style={[{ width: size, height: size, borderRadius: size / 2 }, ring, style]}>
      {uri ? (
        <RemoteImage uri={uri} style={styles.fill} borderRadius={size / 2} accessibilityLabel={name} />
      ) : (
        <View style={[styles.fill, styles.center, { backgroundColor: colors.primarySoft, borderRadius: size / 2 }]}>
          <Text variant="bodyStrong" color="primary" style={{ fontSize: size * 0.36 }}>
            {initials(name)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
});
