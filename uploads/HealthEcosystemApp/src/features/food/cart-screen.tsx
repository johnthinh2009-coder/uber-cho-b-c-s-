import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useGuestGate } from '@/components/auth/guest-gate';
import { ScreenHeader } from '@/components/navigation/screen-header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { RemoteImage } from '@/components/ui/remote-image';
import { Screen } from '@/components/ui/screen';
import { StatGrid } from '@/components/ui/stat-metric-card';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { MEALS_BY_ID } from '@/mocks/food';
import { cartTotals, useCartStore } from '@/store/cart-store';
import { useFoodLogStore } from '@/store/food-log-store';
import { toast } from '@/store/toast-store';
import { gutter, useTheme } from '@/theme';

/**
 * The basket. Totals are nutritional, never monetary – confirming an order
 * writes every line into the food log.
 */
export function CartScreen() {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const { t } = useI18n();
  const { requireAccount } = useGuestGate();

  const lines = useCartStore((s) => s.lines);
  const add = useCartStore((s) => s.add);
  const decrease = useCartStore((s) => s.decrease);
  const clear = useCartStore((s) => s.clear);
  const addToLog = useFoodLogStore((s) => s.add);

  const totals = cartTotals(lines);

  const macros = [
    { label: t('metrics.calories'), value: String(totals.calories), unit: 'kcal', color: colors.accents.orange },
    { label: t('metrics.protein'), value: String(totals.protein), unit: 'g', color: colors.accents.green },
    { label: t('metrics.carbs'), value: String(totals.carbs), unit: 'g', color: colors.accents.blue },
    { label: t('metrics.fat'), value: String(totals.fat), unit: 'g', color: colors.accents.purple },
  ];

  const confirm = () =>
    requireAccount(() => {
      let logged = 0;
      for (const line of lines) {
        const meal = MEALS_BY_ID[line.mealId];
        if (!meal) continue;
        for (let i = 0; i < line.quantity; i += 1) {
          addToLog(meal, line.kitchen);
          logged += 1;
        }
      }
      clear();
      toast.show({ title: t('restaurants.orderConfirmed', { count: logged }), tone: 'success' });
      router.replace('/food/log');
    });

  return (
    <Screen edges={['top', 'left', 'right']}>
      <ScreenHeader title={t('restaurants.cartTitle')} subtitle={t('restaurants.items', { count: totals.items })} mode="close" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {lines.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
            <Text variant="bodyStrong">{t('restaurants.cartEmpty')}</Text>
            <Text variant="caption" color="textSecondary">
              {t('restaurants.cartEmptyHint')}
            </Text>
          </View>
        ) : (
          <>
            <StatGrid metrics={macros} compact />

            {lines.map((line) => (
              <View key={line.mealId} style={styles.row}>
                <RemoteImage uri={line.imageUrl} style={styles.thumb} borderRadius={radius.md} fallbackIcon="restaurant-outline" />
                <View style={styles.rowText}>
                  <Text variant="bodyStrong" numberOfLines={2}>
                    {line.name}
                  </Text>
                  <Text variant="caption" color="textSecondary" numberOfLines={1}>
                    {line.kitchen}
                  </Text>
                  <Text variant="caption" color="textSecondary" numberOfLines={1}>
                    {line.calories * line.quantity} kcal · {line.protein * line.quantity}g {t('restaurants.protein').toLowerCase()}
                  </Text>
                </View>
                <View style={[styles.stepper, { backgroundColor: colors.surface, borderRadius: radius.pill }]}>
                  <PressableScale
                    onPress={() => decrease(line.mealId)}
                    accessibilityRole="button"
                    accessibilityLabel={`${t('common.remove')} ${line.name}`}
                    scaleTo={0.9}
                    style={styles.stepButton}>
                    <Icon name="remove" size={18} color={colors.text} />
                  </PressableScale>
                  <Text variant="bodySmallStrong">{line.quantity}</Text>
                  <PressableScale
                    onPress={() => {
                      const meal = MEALS_BY_ID[line.mealId];
                      if (meal) add(meal, line.kitchen);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`${t('restaurants.add')} ${line.name}`}
                    scaleTo={0.9}
                    style={styles.stepButton}>
                    <Icon name="add" size={18} color={colors.text} />
                  </PressableScale>
                </View>
              </View>
            ))}

            <Button label={t('restaurants.clearCart')} variant="ghost" fullWidth onPress={clear} />
          </>
        )}
      </ScrollView>

      {lines.length > 0 ? (
        <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <Button label={t('restaurants.confirmOrder')} variant="accent" size="lg" fullWidth icon="checkmark-circle" onPress={confirm} />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: gutter, paddingBottom: 24, gap: 12, justifyContent: 'flex-start' },
  empty: { padding: 16, gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  thumb: { width: 68, height: 68 },
  rowText: { flex: 1, gap: 2 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 8, height: 38 },
  stepButton: { width: 26, height: 26, alignItems: 'center', justifyContent: 'center' },
  footer: { paddingHorizontal: gutter, paddingTop: 12, paddingBottom: 22, borderTopWidth: StyleSheet.hairlineWidth },
});
