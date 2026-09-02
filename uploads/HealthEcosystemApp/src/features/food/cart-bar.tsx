import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { cartTotals, useCartStore } from '@/store/cart-store';
import { gutter, shadows, useTheme } from '@/theme';

/** Floating basket that follows you around the food module. */
export function CartBar({ bottom = 20 }: { bottom?: number }) {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const { t } = useI18n();
  const lines = useCartStore((s) => s.lines);
  const totals = cartTotals(lines);

  if (totals.items === 0) return null;

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom }]}>
      <PressableScale
        onPress={() => router.push('/food/cart')}
        accessibilityRole="button"
        accessibilityLabel={t('restaurants.cartCount', { count: totals.items })}
        scaleTo={0.98}
        style={[styles.bar, shadows.floating, { backgroundColor: colors.accents.green, borderRadius: radius.pill }]}>
        <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: radius.pill }]}>
          <Icon name="cart" size={18} color="#FFFFFF" />
          <Text variant="captionStrong" color="#FFFFFF">
            {totals.items}
          </Text>
        </View>
        <Text variant="button" color="#FFFFFF" style={styles.flex} numberOfLines={1}>
          {t('restaurants.cartTitle')}
        </Text>
        <Text variant="captionStrong" color="rgba(255,255,255,0.9)" numberOfLines={1}>
          {totals.calories} kcal · {totals.protein}g
        </Text>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'stretch' },
  bar: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 56, paddingHorizontal: 14, marginHorizontal: gutter },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, height: 30 },
  flex: { flex: 1 },
});
