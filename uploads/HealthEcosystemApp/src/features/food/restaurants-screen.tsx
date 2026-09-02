import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Chip } from '@/components/ui/chip';
import { HScroll } from '@/components/ui/h-scroll';
import { Icon } from '@/components/ui/icon';
import { IconBadge } from '@/components/ui/icon-badge';
import { PressableScale } from '@/components/ui/pressable-scale';
import { RemoteImage } from '@/components/ui/remote-image';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { dietaryLabel, dietaryLabels, type DietaryLabel } from '@/domain';
import { useI18n } from '@/i18n';
import { CONTRACTORS, MEALS } from '@/mocks/food';
import { FOOD_CATEGORIES } from '@/mocks/food-categories';
import { totalsFor, useFoodLogStore } from '@/store/food-log-store';
import { useLocationStore } from '@/store/location-store';
import { gutter, tabBarClearance, useTheme } from '@/theme';
import { todayKey } from '@/utils/date';
import { formatRating } from '@/utils/format';

import { CartBar } from './cart-bar';

/** Food discovery: where you are, what you fancy, which kitchen. No prices. */
export function RestaurantsScreen() {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const { t } = useI18n();

  const [query, setQuery] = useState('');
  const [tag, setTag] = useState<DietaryLabel | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const address = useLocationStore((s) => s.address);
  const locationHydrated = useLocationStore((s) => s.hydrated);
  const askedRef = useRef(false);

  // First visit without a delivery address: open the picker straight away.
  useEffect(() => {
    if (!locationHydrated || address || askedRef.current) return;
    askedRef.current = true;
    router.push('/food/location');
  }, [locationHydrated, address, router]);

  const entries = useFoodLogStore((s) => s.entries);
  const totals = useMemo(() => totalsFor(entries, todayKey()), [entries]);

  const dishCount = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const meal of MEALS) counts[meal.contractorId] = (counts[meal.contractorId] ?? 0) + 1;
    return counts;
  }, []);

  const restaurants = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matcher = FOOD_CATEGORIES.find((c) => c.id === category)?.match;
    return CONTRACTORS.filter((restaurant) => {
      if (tag && !restaurant.tags.includes(tag)) return false;
      const menu = MEALS.filter((meal) => meal.contractorId === restaurant.id);
      if (matcher && !menu.some((meal) => matcher.some((needle) => meal.name.toLowerCase().includes(needle)))) return false;
      if (q && !restaurant.name.toLowerCase().includes(q) && !menu.some((meal) => meal.name.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [query, tag, category]);

  return (
    <Screen>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Delivery header – the whole block reopens the picker */}
        <PressableScale
          onPress={() => router.push('/food/location')}
          accessibilityRole="button"
          accessibilityLabel={`${t('restaurants.deliverTo')}: ${address?.line ?? t('restaurants.noAddressYet')}. ${t('restaurants.changeAddress')}`}
          scaleTo={0.99}
          style={styles.header}>
          <Icon name="location" size={20} color={colors.primary} />
          <View style={styles.flex}>
            <Text variant="label" color="textSecondary">
              {t('restaurants.deliverTo')}
            </Text>
            <Text variant="bodyStrong" numberOfLines={1}>
              {address?.line ?? t('restaurants.noAddressYet')}
            </Text>
          </View>
          <Icon name="chevron-down" size={20} color={colors.text} />
        </PressableScale>

        {/* Search */}
        <View style={styles.searchWrap}>
          <View style={[styles.search, { backgroundColor: colors.surface, borderRadius: radius.pill }]}>
            <Icon name="search" size={19} color={colors.textTertiary} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t('restaurants.searchPlaceholder')}
              placeholderTextColor={colors.textTertiary}
              accessibilityLabel={t('restaurants.searchPlaceholder')}
              style={[styles.searchInput, { color: colors.text }]}
            />
          </View>
        </View>

        {/* Category circles */}
        <HScroll gap={12}>
          {FOOD_CATEGORIES.map((item) => {
            const selected = category === item.id;
            return (
              <PressableScale
                key={item.id}
                onPress={() => setCategory(selected ? null : item.id)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={item.label}
                scaleTo={0.94}
                style={styles.category}>
                <RemoteImage
                  uri={item.imageUrl}
                  style={[styles.categoryImage, selected ? { borderColor: colors.accents.green, borderWidth: 2.5 } : null]}
                  borderRadius={34}
                  fallbackIcon="restaurant-outline"
                />
                <Text variant="label" align="center" numberOfLines={2} style={styles.categoryLabel}>
                  {item.label}
                </Text>
              </PressableScale>
            );
          })}
        </HScroll>

        {/* Dietary filter pills */}
        <HScroll>
          <Chip label={t('food.all')} selected={tag === null} onPress={() => setTag(null)} />
          {dietaryLabels.map((label) => (
            <Chip key={label} label={dietaryLabel(label)} selected={tag === label} onPress={() => setTag(tag === label ? null : label)} />
          ))}
        </HScroll>

        {/* Today's log shortcut */}
        <PressableScale
          onPress={() => router.push('/food/log')}
          accessibilityRole="button"
          accessibilityLabel={t('restaurants.logTitle')}
          scaleTo={0.98}
          style={[styles.summary, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
          <IconBadge icon="book" tone="orange" size={42} shape="rounded" />
          <View style={styles.flex}>
            <Text variant="bodyStrong">{t('restaurants.logTitle')}</Text>
            <Text variant="caption" color="textSecondary">
              {totals.calories} kcal · {totals.protein}g {t('restaurants.protein').toLowerCase()} · {t('restaurants.items', { count: totals.count })}
            </Text>
          </View>
          <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
        </PressableScale>

        {/* Restaurants */}
        <Text variant="section" style={styles.sectionTitle}>
          {t('restaurants.nearYou')}
        </Text>
        <View style={styles.list}>
          {restaurants.map((restaurant) => (
            <PressableScale
              key={restaurant.id}
              onPress={() => router.push(`/food/restaurant/${restaurant.id}`)}
              accessibilityRole="button"
              accessibilityLabel={`${restaurant.name}. ${restaurant.tagline}`}
              scaleTo={0.98}
              style={styles.card}>
              <RemoteImage uri={restaurant.heroUrl} aspectRatio={16 / 9} borderRadius={radius.lg} fallbackIcon="restaurant-outline" />
              <View style={styles.cardBody}>
                <Text variant="bodyStrong" numberOfLines={1}>
                  {restaurant.name}
                </Text>
                <Text variant="caption" color="textSecondary" numberOfLines={1}>
                  {restaurant.tagline}
                </Text>
                <View style={styles.metaRow}>
                  <Icon name="star" size={13} color={colors.accents.yellow} />
                  <Text variant="caption" color="textSecondary">
                    {formatRating(restaurant.rating.average)} · {t('restaurants.dishes', { count: dishCount[restaurant.id] ?? 0 })} ·{' '}
                    {restaurant.deliveryMinutes[0]}–{restaurant.deliveryMinutes[1]} {t('units.minute')}
                  </Text>
                </View>
              </View>
            </PressableScale>
          ))}
          {restaurants.length === 0 ? (
            <View style={[styles.empty, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
              <Text variant="bodyStrong">{t('food.empty')}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <CartBar bottom={tabBarClearance} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: tabBarClearance + 70, gap: 14, justifyContent: 'flex-start' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: gutter, paddingTop: 6 },
  searchWrap: { paddingHorizontal: gutter },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 48, paddingHorizontal: 16 },
  searchInput: { flex: 1, fontSize: 16, paddingVertical: 0 },
  category: { width: 76, alignItems: 'center', gap: 6 },
  categoryImage: { width: 68, height: 68 },
  categoryLabel: { minHeight: 32 },
  summary: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, marginHorizontal: gutter },
  sectionTitle: { paddingHorizontal: gutter, marginTop: 4 },
  list: { paddingHorizontal: gutter, gap: 18 },
  card: { gap: 8 },
  cardBody: { gap: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  empty: { padding: 16 },
  flex: { flex: 1 },
});
