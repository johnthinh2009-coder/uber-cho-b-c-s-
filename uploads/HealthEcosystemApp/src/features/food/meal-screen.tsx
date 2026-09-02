import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useGuestGate } from '@/components/auth/guest-gate';
import { EmptyState } from '@/components/feedback/empty-state';
import { ScreenHeader } from '@/components/navigation/screen-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RemoteImage } from '@/components/ui/remote-image';
import { Screen } from '@/components/ui/screen';
import { StatGrid } from '@/components/ui/stat-metric-card';
import { Text } from '@/components/ui/text';
import { allergenLabel, dietaryLabel } from '@/domain';
import { useI18n } from '@/i18n';
import { CONTRACTORS_BY_ID, MEALS_BY_ID } from '@/mocks/food';
import { useCartStore } from '@/store/cart-store';
import { useFoodLogStore } from '@/store/food-log-store';
import { toast } from '@/store/toast-store';
import { gutter, useTheme } from '@/theme';

/**
 * Dish detail. Nutrition is the headline – calories and macros stay highly
 * visible – and the primary action writes a real entry to the food log.
 */
export function MealScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, radius } = useTheme();
  const { t } = useI18n();
  const { requireAccount } = useGuestGate();
  const addToLog = useFoodLogStore((s) => s.add);
  const addToCart = useCartStore((s) => s.add);
  const meal = id ? MEALS_BY_ID[id] : undefined;

  if (!meal) {
    return (
      <Screen>
        <ScreenHeader />
        <EmptyState icon="restaurant-outline" title={t('notFound.title')} message={t('notFound.body')} />
      </Screen>
    );
  }

  const kitchen = CONTRACTORS_BY_ID[meal.contractorId];
  const macros = [
    { label: t('metrics.calories'), value: String(meal.nutrition.calories), unit: 'kcal', color: colors.accents.orange },
    { label: t('metrics.protein'), value: String(meal.nutrition.proteinGrams), unit: 'g', color: colors.accents.green },
    { label: t('metrics.carbs'), value: String(meal.nutrition.carbsGrams), unit: 'g', color: colors.accents.blue },
    { label: t('metrics.fat'), value: String(meal.nutrition.fatGrams), unit: 'g', color: colors.accents.purple },
  ];

  return (
    <Screen edges={['top', 'left', 'right']}>
      <ScreenHeader compactTitle={t('restaurants.mealDetail')} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <RemoteImage uri={meal.imageUrl} aspectRatio={16 / 10} borderRadius={radius.lg} fallbackIcon="restaurant-outline" />

        <View style={styles.head}>
          <Text variant="title">{meal.name}</Text>
          <Text variant="bodySmall" color="textSecondary">
            {kitchen?.name ?? t('cards.kitchenFallback')} · {meal.portion}
          </Text>
          <Text variant="body" color="textSecondary">
            {meal.description}
          </Text>
        </View>

        <View style={styles.tagRow}>
          {meal.dietary.map((label) => (
            <Badge key={label} label={dietaryLabel(label)} />
          ))}
        </View>

        <View style={styles.block}>
          <Text variant="section">{t('restaurants.nutrition')}</Text>
          <StatGrid metrics={macros} />
          <Text variant="caption" color="textSecondary">
            {t('restaurants.fibre')}: {meal.nutrition.fibreGrams} g
          </Text>
        </View>

        <View style={styles.block}>
          <Text variant="section">{t('restaurants.ingredients')}</Text>
          <Text variant="body" color="textSecondary">
            {meal.ingredients.join(' · ')}
          </Text>
          {meal.allergens.length > 0 ? (
            <View style={styles.tagRow}>
              {meal.allergens.map((allergen) => (
                <Badge key={allergen} label={allergenLabel(allergen)} tone="warning" />
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <Button
          label={t('restaurants.add')}
          icon="cart"
          variant="accent"
          size="lg"
          style={styles.flex}
          onPress={() =>
            requireAccount(() => {
              addToCart(meal, kitchen?.name ?? t('cards.kitchenFallback'));
              toast.show({ title: t('restaurants.addedToCart', { name: meal.name }), tone: 'success' });
            })
          }
        />
        <Button
          label={t('restaurants.addToLog')}
          icon="book-outline"
          variant="soft"
          size="lg"
          style={styles.flex}
          onPress={() =>
            requireAccount(() => {
              addToLog(meal, kitchen?.name ?? t('cards.kitchenFallback'));
              toast.show({ title: t('restaurants.added', { name: meal.name }), tone: 'success' });
            })
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: gutter, paddingBottom: 24, gap: 18, justifyContent: 'flex-start' },
  head: { gap: 6 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  block: { gap: 10 },
  footer: { flexDirection: 'row', gap: 10, paddingHorizontal: gutter, paddingTop: 12, paddingBottom: 20, borderTopWidth: StyleSheet.hairlineWidth },
  flex: { flex: 1 },
});
