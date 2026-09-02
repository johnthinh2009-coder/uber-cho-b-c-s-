import { useRouter, type Href } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { RemoteImage } from '@/components/ui/remote-image';
import { Screen } from '@/components/ui/screen';
import { PageTitle, SectionTitle } from '@/components/ui/section';
import { StatGrid } from '@/components/ui/stat-metric-card';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { totalsFor, useFoodLogStore } from '@/store/food-log-store';
import { useGymStore } from '@/store/gym-store';
import { dosesForToday, useReminderStore } from '@/store/reminder-store';
import { gutter, tabBarClearance, useTheme } from '@/theme';
import { formatClock, formatRelativeDateTime, formatSeconds, todayKey } from '@/utils/date';

type Row = { id: string; icon: IconName; title: string; subtitle: string; imageUrl?: string; href?: Href };

/** Everything you have done and everything still due today. No amounts, no prices. */
export function ActivityScreen() {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const { t } = useI18n();

  const entries = useFoodLogStore((s) => s.entries);
  const reminders = useReminderStore((s) => s.reminders);
  const outcomes = useReminderStore((s) => s.outcomes);
  const history = useGymStore((s) => s.history);

  const today = todayKey();
  const totals = useMemo(() => totalsFor(entries, today), [entries, today]);
  const doses = useMemo(() => dosesForToday(reminders, outcomes), [reminders, outcomes]);
  const dosesDone = doses.filter((dose) => dose.outcome === 'taken').length;

  const upcoming: Row[] = useMemo(
    () =>
      doses
        .filter((dose) => !dose.outcome)
        .map((dose) => ({
          id: dose.key,
          icon: 'alarm-outline' as IconName,
          title: dose.reminder.name,
          subtitle: `${dose.reminder.dose ? `${dose.reminder.dose} · ` : ''}${formatClock(dose.time)}`,
          href: '/medication',
        })),
    [doses],
  );

  const past: Row[] = useMemo(() => {
    const food: Row[] = entries.map((entry) => ({
      id: entry.id,
      icon: 'restaurant-outline' as IconName,
      title: entry.name,
      subtitle: `${entry.kitchen} · ${formatRelativeDateTime(entry.at)} · ${entry.calories} kcal`,
      imageUrl: entry.imageUrl,
      href: '/food/log',
    }));
    const workouts: Row[] = history.map((workout) => ({
      id: workout.id,
      icon: 'barbell-outline' as IconName,
      title: workout.title,
      subtitle: `${formatRelativeDateTime(workout.finishedAt)} · ${formatSeconds(workout.durationSeconds)} · ${t('gym.setsDone', {
        count: workout.setCount,
      })}`,
      href: '/fitness',
    }));
    const takenDoses: Row[] = doses
      .filter((dose) => dose.outcome)
      .map((dose) => ({
        id: `${dose.key}-done`,
        icon: 'checkmark-circle-outline' as IconName,
        title: dose.reminder.name,
        subtitle: `${dose.outcome === 'taken' ? t('meds.taken') : t('meds.skipped')} · ${formatClock(dose.time)}`,
        href: '/medication',
      }));
    return [...food, ...workouts, ...takenDoses];
  }, [entries, history, doses, t]);

  const macros = [
    { label: t('metrics.calories'), value: String(totals.calories), unit: 'kcal', color: colors.accents.orange },
    { label: t('metrics.protein'), value: String(totals.protein), unit: 'g', color: colors.accents.green },
    { label: t('metrics.carbs'), value: String(totals.carbs), unit: 'g', color: colors.accents.blue },
    { label: t('metrics.fat'), value: String(totals.fat), unit: 'g', color: colors.accents.purple },
  ];

  const daily = [
    { label: t('metrics.doses'), value: `${dosesDone}/${doses.length}`, color: colors.accents.pink },
    { label: t('metrics.workouts'), value: String(history.length), color: colors.accents.teal },
  ];

  const renderRow = (row: Row) => (
    <PressableScale
      key={row.id}
      onPress={() => (row.href ? router.push(row.href) : undefined)}
      accessibilityRole="button"
      accessibilityLabel={`${row.title}. ${row.subtitle}`}
      scaleTo={0.99}
      style={styles.row}>
      {row.imageUrl ? (
        <RemoteImage uri={row.imageUrl} style={styles.thumb} borderRadius={radius.md} fallbackIcon={row.icon} />
      ) : (
        <View style={[styles.thumb, styles.thumbIcon, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
          <Icon name={row.icon} size={20} color={colors.textSecondary} />
        </View>
      )}
      <View style={styles.flex}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {row.title}
        </Text>
        <Text variant="caption" color="textSecondary" numberOfLines={2}>
          {row.subtitle}
        </Text>
      </View>
      <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
    </PressableScale>
  );

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <PageTitle title={t('activity.title')} />

        <View style={styles.section}>
          <SectionTitle title={t('activity.summaryTitle')} subtitle={t('activity.summarySub')} />
          <StatGrid metrics={macros} compact style={styles.grid} />
          <StatGrid metrics={daily} compact columns={2} style={styles.grid} />
        </View>

        <View style={styles.section}>
          <SectionTitle title={t('activity.upcoming')} />
          <View style={styles.list}>
            {upcoming.length === 0 ? (
              <View style={[styles.empty, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
                <Text variant="bodyStrong">{t('activity.emptyUpcoming')}</Text>
                <Text variant="caption" color="textSecondary">
                  {t('activity.emptyUpcomingHint')}
                </Text>
              </View>
            ) : (
              upcoming.map(renderRow)
            )}
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle title={t('activity.past')} />
          <View style={styles.list}>
            {past.length === 0 ? (
              <View style={[styles.empty, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
                <Text variant="bodyStrong">{t('restaurants.logEmpty')}</Text>
                <Text variant="caption" color="textSecondary">
                  {t('restaurants.logEmptyHint')}
                </Text>
              </View>
            ) : (
              past.map(renderRow)
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: tabBarClearance, gap: 22, justifyContent: 'flex-start' },
  section: { gap: 4 },
  grid: { paddingHorizontal: gutter, marginBottom: 8 },
  list: { paddingHorizontal: gutter },
  empty: { padding: 16, gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  thumb: { width: 48, height: 48 },
  thumbIcon: { alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1, gap: 2 },
});
