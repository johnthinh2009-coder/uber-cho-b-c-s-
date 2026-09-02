import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { Chip } from '@/components/ui/chip';
import { HScroll } from '@/components/ui/h-scroll';
import { Icon, type IconName } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { useAuthStore } from '@/store/auth-store';
import { useGymStore } from '@/store/gym-store';
import { gutter, tabBarClearance, useTheme } from '@/theme';
import { formatSeconds } from '@/utils/date';

type Metric = 'duration' | 'volume' | 'reps';

/** Training profile: totals, the metric switcher and the dashboard grid. */
export function GymProfileScreen() {
  const { colors, radius } = useTheme();
  const { t } = useI18n();
  const customer = useAuthStore((s) => s.customer);
  const history = useGymStore((s) => s.history);
  const [metric, setMetric] = useState<Metric>('duration');

  const totals = history.reduce(
    (sum, item) => ({
      duration: sum.duration + item.durationSeconds,
      volume: sum.volume + item.volumeKg,
      sets: sum.sets + item.setCount,
    }),
    { duration: 0, volume: 0, sets: 0 },
  );

  const metricValue =
    metric === 'duration' ? formatSeconds(totals.duration) : metric === 'volume' ? `${totals.volume} kg` : String(totals.sets);

  const dashboard: { key: string; label: string; icon: IconName }[] = [
    { key: 'statistics', label: t('gym.statistics'), icon: 'stats-chart-outline' },
    { key: 'exercises', label: t('gym.exerciseLibrary'), icon: 'barbell-outline' },
    { key: 'measures', label: t('gym.measures'), icon: 'body-outline' },
    { key: 'calendar', label: t('gym.calendar'), icon: 'calendar-outline' },
  ];

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text variant="pageTitle" accessibilityRole="header" style={styles.title}>
          {customer?.fullName ?? t('gym.profileTitle')}
        </Text>

        <View style={styles.identity}>
          <Avatar uri={customer?.avatarUrl} name={customer?.fullName ?? 'Haven'} size={72} />
          <View style={styles.identityStats}>
            {[
              { label: t('gym.workouts'), value: String(history.length) },
              { label: t('gym.sets'), value: String(totals.sets) },
              { label: t('gym.volume'), value: `${totals.volume}` },
            ].map((stat) => (
              <View key={stat.label} style={styles.identityStat}>
                <Text variant="bodyStrong">{stat.value}</Text>
                <Text variant="label" color="textSecondary">
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.chart, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
          {history.length === 0 ? (
            <>
              <Icon name="stats-chart-outline" size={40} color={colors.textTertiary} />
              <Text variant="body" color="textSecondary">
                {t('gym.noData')}
              </Text>
            </>
          ) : (
            <>
              <Text variant="pageTitle">{metricValue}</Text>
              <Text variant="caption" color="textSecondary">
                {t('gym.workouts')}: {history.length}
              </Text>
            </>
          )}
        </View>

        <HScroll>
          <Chip label={t('gym.duration')} selected={metric === 'duration'} onPress={() => setMetric('duration')} />
          <Chip label={t('gym.volume')} selected={metric === 'volume'} onPress={() => setMetric('volume')} />
          <Chip label={t('gym.sets')} selected={metric === 'reps'} onPress={() => setMetric('reps')} />
        </HScroll>

        <Text variant="section" style={styles.sectionTitle}>
          {t('gym.dashboard')}
        </Text>
        <View style={styles.grid}>
          {dashboard.map((item) => (
            <View key={item.key} style={[styles.gridCell, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
              <Icon name={item.icon} size={20} color={colors.text} />
              <Text variant="bodySmallStrong">{item.label}</Text>
            </View>
          ))}
        </View>

        <Text variant="section" style={styles.sectionTitle}>
          {t('gym.workouts')}
        </Text>
        <View style={styles.list}>
          {history.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
              <Icon name="barbell-outline" size={36} color={colors.textTertiary} />
              <Text variant="body" color="textSecondary">
                {t('gym.noHistory')}
              </Text>
            </View>
          ) : (
            history.map((workout) => (
              <View key={workout.id} style={[styles.card, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
                <Text variant="bodyStrong">{workout.title}</Text>
                <Text variant="caption" color="textSecondary">
                  {formatSeconds(workout.durationSeconds)} · {workout.volumeKg} kg · {t('gym.setsDone', { count: workout.setCount })}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: tabBarClearance, gap: 14, justifyContent: 'flex-start' },
  title: { paddingHorizontal: gutter, paddingTop: 8 },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: gutter },
  identityStats: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
  identityStat: { alignItems: 'center', gap: 2 },
  chart: { marginHorizontal: gutter, height: 180, alignItems: 'center', justifyContent: 'center', gap: 8 },
  sectionTitle: { paddingHorizontal: gutter, marginTop: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: gutter },
  gridCell: { width: '47.5%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16 },
  list: { paddingHorizontal: gutter, gap: 10 },
  card: { padding: 14, gap: 2 },
  emptyCard: { padding: 24, alignItems: 'center', gap: 10 },
});
