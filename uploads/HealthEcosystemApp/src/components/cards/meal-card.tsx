import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { RemoteImage } from '@/components/ui/remote-image';
import { Text } from '@/components/ui/text';
import type { Meal } from '@/domain';
import { useI18n } from '@/i18n';
import { useTheme } from '@/theme';
import { formatRating } from '@/utils/format';

type MealCardProps = {
  meal: Meal;
  kitchenName?: string;
  onPress: (meal: Meal) => void;
  layout?: 'carousel' | 'row';
};

export const MEAL_CARD_WIDTH = 232;

/** A meal from a vetted kitchen: photo, name, kitchen, price and nutrition facts. */
export const MealCard = memo(function MealCard({ meal, kitchenName, onPress, layout = 'carousel' }: MealCardProps) {
  const { colors, radius } = useTheme();
  const { t } = useI18n();
  const kitchen = kitchenName ?? t('cards.kitchenFallback');
  const a11y = t('cards.mealA11y', { name: meal.name, kitchen, calories: meal.nutrition.calories });
  const meta = `${meal.nutrition.calories} kcal · ${meal.nutrition.proteinGrams}g ${t('units.protein')}`;

  if (layout === 'row') {
    return (
      <PressableScale onPress={() => onPress(meal)} accessibilityRole="button" accessibilityLabel={a11y} scaleTo={0.99} style={styles.row}>
        <RemoteImage uri={meal.imageUrl} style={styles.thumb} borderRadius={radius.md} fallbackIcon="restaurant-outline" />
        <View style={styles.rowText}>
          <Text variant="bodyStrong" numberOfLines={2}>
            {meal.name}
          </Text>
          <Text variant="caption" color="textSecondary" numberOfLines={1}>
            {kitchen}
          </Text>
          <View style={styles.metaRow}>
            <Icon name="star" size={13} color={colors.text} />
            <Text variant="caption" color="textSecondary" numberOfLines={1} style={styles.flex}>
              {formatRating(meal.rating.average)} · {meta}
            </Text>
          </View>
        </View>
      </PressableScale>
    );
  }

  return (
    <PressableScale
      onPress={() => onPress(meal)}
      accessibilityRole="button"
      accessibilityLabel={a11y}
      scaleTo={0.97}
      style={[styles.card, { width: MEAL_CARD_WIDTH }]}>
      <RemoteImage uri={meal.imageUrl} aspectRatio={16 / 10} borderRadius={radius.md} fallbackIcon="restaurant-outline" />
      <View style={styles.body}>
        <Text variant="bodySmallStrong" numberOfLines={1}>
          {meal.name}
        </Text>
        <Text variant="label" color="textSecondary" numberOfLines={1}>
          {kitchen}
        </Text>
        <View style={styles.metaRow}>
          <Icon name="star" size={12} color={colors.text} />
          <Text variant="label" color="textSecondary" numberOfLines={1} style={styles.flex}>
            {formatRating(meal.rating.average)} · {meta}
          </Text>
        </View>
      </View>
    </PressableScale>
  );
});

const styles = StyleSheet.create({
  card: { gap: 8 },
  body: { gap: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  thumb: { width: 72, height: 72 },
  rowText: { flex: 1, gap: 2 },
});
