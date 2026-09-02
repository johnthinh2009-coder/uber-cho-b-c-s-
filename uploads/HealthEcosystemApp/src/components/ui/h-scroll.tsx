import type { ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { gutter } from '@/theme';

/** RN Web maps `dataSet` to data-* attributes; native ignores the prop. */
const webScrollbarTag = Platform.OS === 'web' ? ({ dataSet: { hscroll: '1' } } as object) : {};

type HScrollProps = {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  gap?: number;
  /** Set false when the row is already inside a padded container. */
  gutters?: boolean;
  accessibilityLabel?: string;
};

/**
 * Horizontal row of chips / cards.
 *
 * On web the scrollbar stays visible so it is obvious the row scrolls and can
 * be dragged; on device it is a normal swipe. Content is never clipped –
 * items keep their intrinsic width.
 */
export function HScroll({ children, contentContainerStyle, gap = 8, gutters = true, accessibilityLabel }: HScrollProps) {
  return (
    <ScrollView
      horizontal
      accessibilityLabel={accessibilityLabel}
      showsHorizontalScrollIndicator={Platform.OS === 'web'}
      persistentScrollbar
      // Tagged so the web build can paint a slim, always-visible scrollbar.
      {...webScrollbarTag}
      style={styles.scroll}
      contentContainerStyle={[styles.content, { gap }, gutters ? { paddingHorizontal: gutter } : null, contentContainerStyle]}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // A horizontal row must hug its content; without this it stretches to fill
  // the remaining vertical space of a column parent and centres the chips.
  scroll: { flexGrow: 0, flexShrink: 0 },
  content: { alignItems: 'center' },
});
