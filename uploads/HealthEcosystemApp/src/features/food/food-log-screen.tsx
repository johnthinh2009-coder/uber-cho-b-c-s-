import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ScreenHeader } from '@/components/navigation/screen-header';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { RemoteImage } from '@/components/ui/remote-image';
import { Screen } from '@/components/ui/screen';
import { StatGrid } from '@/components/ui/stat-metric-card';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { totalsFor, useFoodLogStore } from '@/store/food-log-store';
import { toast } from '@/store/toast-store';
import { gutter, useTheme } from '@/theme';
import { formatTime, todayKey } from '@/utils/date';

/** What the person actually ate today, with running macro totals. */
export function FoodLogScreen() {
  const { colors, radius } = useTheme();
  const { t } = useI18n();
  const entries = useFoodLogStore((s) => s.entries);
  const remove = useFoodLogStore((s) => s.remove);

  const today = todayKey();
  const todayEntries = useMemo(() => entries.filter((entry) => entry.date === today), [entries, today]);
  const totals = useMemo(() => totalsFor(entries, today), [entries, today]);

  const macros = [
    { label: t('metrics.calories'), value: String(totals.calories), unit: 'kcal', color: colors.accents.orange },
    { label: t('metrics.protein'), value: String(totals.protein), unit: 'g', color: colors.accents.green },
    { label: t('metrics.carbs'), value: String(totals.carbs), unit: 'g', color: colors.accents.blue },
    { label: t('metrics.fat'), value: String(totals.fat), unit: 'g', color: colors.accents.purple },
  ];

  return (
    <Screen>
      <ScreenHeader title={t('restaurants.logTitle')} subtitle={t('restaurants.logToday')} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <StatGrid metrics={macros} compact />

        {todayEntries.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
            <Text variant="bodyStrong">{t('restaurants.logEmpty')}</Text>
            <Text variant="caption" color="textSecondary">
              {t('restaurants.logEmptyHint')}
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {todayEntries.map((entry) => (
              <View key={entry.id} style={styles.row}>
                <RemoteImage uri={entry.imageUrl} style={styles.thumb} borderRadius={radius.md} fallbackIcon="restaurant-outline" />
                <View style={styles.rowText}>
                  <Text variant="bodyStrong" numberOfLines={1}>
                    {entry.name}
                  </Text>
                  <Text variant="caption" color="textSecondary" numberOfLines={1}>
                    {entry.kitchen} · {formatTime(entry.at)}
                  </Text>
                  <Text variant="caption" color="textSecondary">
                    {entry.calories} kcal · {entry.protein}g {t('restaurants.protein').toLowerCase()} · {entry.carbs}g{' '}
                    {t('restaurants.carbs').toLowerCase()} · {entry.fat}g {t('restaurants.fat').toLowerCase()}
                  </Text>
                </View>
                <PressableScale
                  onPress={() => {
                    remove(entry.id);
                    toast.show({ title: t('restaurants.removed'), tone: 'neutral' });
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`${t('restaurants.remove')}: ${entry.name}`}
                  scaleTo={0.92}
                  style={[styles.removeButton, { backgroundColor: colors.surface }]}>
                  <Icon name="trash-outline" size={18} color={colors.danger} />
                </PressableScale>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: gutter, paddingBottom: 40, gap: 16, justifyContent: 'flex-start' },
  empty: { padding: 16, gap: 4 },
  list: { gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  thumb: { width: 64, height: 64 },
  rowText: { flex: 1, gap: 2 },
  removeButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
