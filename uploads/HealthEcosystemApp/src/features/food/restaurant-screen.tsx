import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useGuestGate } from '@/components/auth/guest-gate';
import { EmptyState } from '@/components/feedback/empty-state';
import { ScreenHeader } from '@/components/navigation/screen-header';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { RemoteImage } from '@/components/ui/remote-image';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { dietaryLabel, type Meal } from '@/domain';
import { useI18n } from '@/i18n';
import { CONTRACTORS_BY_ID, MEALS } from '@/mocks/food';
import { useCartStore } from '@/store/cart-store';
import { toast } from '@/store/toast-store';
import { gutter, useTheme } from '@/theme';
import { formatRating } from '@/utils/format';

import { CartBar } from './cart-bar';

/** A kitchen and its menu. Every dish shows macros and can be added to the basket. */
export function RestaurantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, radius } = useTheme();
  const { t } = useI18n();
  const { requireAccount } = useGuestGate();
  const addToCart = useCartStore((s) => s.add);
  const lines = useCartStore((s) => s.lines);

  const restaurant = id ? CONTRACTORS_BY_ID[id] : undefined;
  const menu = useMemo(() => MEALS.filter((meal) => meal.contractorId === id), [id]);

  if (!restaurant) {
    return (
      <Screen>
        <ScreenHeader />
        <EmptyState icon="restaurant-outline" title={t('notFound.title')} message={t('notFound.body')} />
      </Screen>
    );
  }

  const add = (meal: Meal) =>
    requireAccount(() => {
      addToCart(meal, restaurant.name);
      toast.show({ title: t('restaurants.addedToCart', { name: meal.name }), tone: 'success' });
    });

  const quantityOf = (mealId: string) => lines.find((line) => line.mealId === mealId)?.quantity ?? 0;

  return (
    <Screen>
      <ScreenHeader compactTitle={restaurant.name} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <RemoteImage uri={restaurant.heroUrl} aspectRatio={16 / 9} borderRadius={radius.lg} fallbackIcon="restaurant-outline" />

        <View style={styles.head}>
          <Text variant="title">{restaurant.name}</Text>
          <Text variant="body" color="textSecondary">
            {restaurant.tagline}
          </Text>
          <View style={styles.metaRow}>
            <Icon name="star" size={14} color={colors.accents.yellow} />
            <Text variant="bodySmall" color="textSecondary">
              {formatRating(restaurant.rating.average)} · {restaurant.deliveryMinutes[0]}–{restaurant.deliveryMinutes[1]}{' '}
              {t('units.minute')} · {restaurant.distanceKm} km
            </Text>
          </View>
          <View style={styles.tags}>
            <Badge label={t('restaurants.openNow')} tone="accent" icon="time-outline" />
            {restaurant.tags.map((tag) => (
              <Badge key={tag} label={dietaryLabel(tag)} />
            ))}
          </View>
        </View>

        <Text variant="section">{t('restaurants.menu')}</Text>

        <View style={styles.menu}>
          {menu.map((meal) => {
            const quantity = quantityOf(meal.id);
            return (
              <View key={meal.id} style={[styles.item, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
                <PressableScale
                  onPress={() => router.push(`/food/meal/${meal.id}`)}
                  accessibilityRole="button"
                  accessibilityLabel={`${meal.name}. ${meal.nutrition.calories} kcal`}
                  scaleTo={0.99}
                  style={styles.itemMain}>
                  <RemoteImage uri={meal.imageUrl} style={styles.thumb} borderRadius={radius.md} fallbackIcon="restaurant-outline" />
                  <View style={styles.itemText}>
                    <Text variant="bodyStrong" numberOfLines={2}>
                      {meal.name}
                    </Text>
                    <Text variant="caption" color="textSecondary" numberOfLines={2}>
                      {meal.description}
                    </Text>
                    <View style={styles.macros}>
                      <Text variant="label" color={colors.accents.orange}>
                        {meal.nutrition.calories} kcal
                      </Text>
                      <Text variant="label" color={colors.accents.green}>
                        {meal.nutrition.proteinGrams}g {t('restaurants.protein').toLowerCase()}
                      </Text>
                      <Text variant="label" color={colors.accents.blue}>
                        {meal.nutrition.carbsGrams}g {t('restaurants.carbs').toLowerCase()}
                      </Text>
                      <Text variant="label" color={colors.accents.purple}>
                        {meal.nutrition.fatGrams}g {t('restaurants.fat').toLowerCase()}
                      </Text>
                    </View>
                  </View>
                </PressableScale>

                <PressableScale
                  onPress={() => add(meal)}
                  accessibilityRole="button"
                  accessibilityLabel={`${t('restaurants.add')} ${meal.name}`}
                  scaleTo={0.9}
                  style={[styles.addButton, { backgroundColor: colors.accents.green }]}>
                  <Icon name="add" size={22} color="#FFFFFF" />
                  {quantity > 0 ? (
                    <View style={[styles.qty, { backgroundColor: colors.background, borderColor: colors.accents.green }]}>
                      <Text variant="label" color={colors.accents.green}>
                        {quantity}
                      </Text>
                    </View>
                  ) : null}
                </PressableScale>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <CartBar />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: gutter, paddingBottom: 100, gap: 16, justifyContent: 'flex-start' },
  head: { gap: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  menu: { gap: 10 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10 },
  itemMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: { width: 84, height: 84 },
  itemText: { flex: 1, gap: 3 },
  macros: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 2 },
  addButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  qty: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
