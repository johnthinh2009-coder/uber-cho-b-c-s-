import type { ReactElement } from 'react';
import { FlatList, StyleSheet, type FlatListProps } from 'react-native';

import { gutter } from '@/theme';

type HorizontalListProps<T> = Omit<FlatListProps<T>, 'horizontal' | 'renderItem'> & {
  renderItem: (item: T, index: number) => ReactElement;
  /** Width of each item – enables snapping. */
  itemWidth?: number;
  gap?: number;
};

/** Edge-to-edge horizontal carousel with page gutters and optional snapping. */
export function HorizontalList<T>({ renderItem, itemWidth, gap = 12, contentContainerStyle, ...rest }: HorizontalListProps<T>) {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={itemWidth ? itemWidth + gap : undefined}
      snapToAlignment="start"
      contentContainerStyle={[styles.content, { gap }, contentContainerStyle]}
      renderItem={({ item, index }) => renderItem(item, index)}
      initialNumToRender={4}
      maxToRenderPerBatch={4}
      windowSize={5}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: gutter,
  },
});
