import { Image, type ImageContentFit, type ImageProps } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { PLACEHOLDER_BLURHASH } from '@/mocks/images';
import { useTheme } from '@/theme';

import { Icon, type IconName } from './icon';

export type RemoteImageProps = Omit<ImageProps, 'source' | 'style'> & {
  uri: string;
  /** Outer container style (size, radius). The image always fills it. */
  style?: StyleProp<ViewStyle>;
  aspectRatio?: number;
  borderRadius?: number;
  contentFit?: ImageContentFit;
  fallbackIcon?: IconName;
  /** Optional tint for the fallback surface, e.g. a pillar soft colour. */
  fallbackColor?: string;
};

/**
 * expo-image wrapper with a blurhash placeholder, cross-fade and a graceful
 * fallback when a remote image fails. Images never stretch – `cover` by
 * default – and the caller controls radius and aspect ratio.
 */
export function RemoteImage({
  uri,
  style,
  aspectRatio,
  borderRadius = 0,
  contentFit = 'cover',
  fallbackIcon = 'image-outline',
  fallbackColor,
  accessibilityLabel,
  ...rest
}: RemoteImageProps) {
  const { colors } = useTheme();
  const [failed, setFailed] = useState(false);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.skeleton, borderRadius },
        aspectRatio ? { aspectRatio } : null,
        style,
      ]}
      accessible={Boolean(accessibilityLabel)}
      accessibilityRole={accessibilityLabel ? 'image' : undefined}
      accessibilityLabel={accessibilityLabel}>
      {failed ? (
        <View style={[styles.fallback, { backgroundColor: fallbackColor ?? colors.surfaceStrong }]}>
          <Icon name={fallbackIcon} size={28} color={colors.textTertiary} />
        </View>
      ) : (
        <Image
          {...rest}
          source={{ uri }}
          placeholder={{ blurhash: PLACEHOLDER_BLURHASH }}
          placeholderContentFit="cover"
          contentFit={contentFit}
          transition={280}
          cachePolicy="memory-disk"
          recyclingKey={uri}
          onError={() => setFailed(true)}
          style={StyleSheet.absoluteFill}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  fallback: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
