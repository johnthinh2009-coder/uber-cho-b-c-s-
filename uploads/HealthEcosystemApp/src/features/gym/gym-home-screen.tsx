import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Screen } from '@/components/ui/screen';
import { StatGrid } from '@/components/ui/stat-metric-card';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { useGymStore } from '@/store/gym-store';
import { useRoutineDraft } from '@/store/routine-draft-store';
import { gutter, tabBarClearance, useTheme } from '@/theme';
import { formatRelativeDateTime, formatSeconds } from '@/utils/date';

import { GYM_BLUE, GymEmpty } from './gym-ui';

/** Feed: what you have done, and the fastest way to start the next session. */
export function GymHomeScreen() {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const { t } = useI18n();
  const history = useGymStore((s) => s.history);
  const routines = useGymStore((s) => s.routines);
  const active = useGymStore((s) => s.active);
  const startWorkout = useGymStore((s) => s.startWorkout);
  const resetDraft = useRoutineDraft((s) => s.reset);

  // Clock reads are impure in render, so totals are derived from the data itself.
  const totalVolume = useMemo(() => history.reduce((sum, item) => sum + item.volumeKg, 0), [history]);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text variant="pageTitle" accessibilityRole="header">
            {t('gym.title')}
          </Text>
          <PressableScale
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel={t('common.backHome')}
            scaleTo={0.94}
            style={[styles.exit, { backgroundColor: colors.surface, borderRadius: radius.pill }]}>
            <Icon name="close" size={20} color={colors.text} />
          </PressableScale>
        </View>

        <StatGrid
          style={styles.stats}
          columns={2}
          metrics={[
            { label: t('metrics.workouts'), value: String(history.length), color: colors.accents.teal },
            { label: t('metrics.volume'), value: String(totalVolume), unit: 'kg', color: colors.accents.blue },
            { label: t('metrics.routines'), value: String(routines.length), color: colors.accents.purple },
          ]}
        />

        <View style={styles.actions}>
          <PressableScale
            onPress={() => {
              if (!active) startWorkout();
              router.push('/fitness/session');
            }}
            accessibilityRole="button"
            accessibilityLabel={active ? t('gym.resume') : t('gym.startEmpty')}
            scaleTo={0.98}
            style={[styles.primary, { backgroundColor: GYM_BLUE, borderRadius: radius.md }]}>
            <Icon name={active ? 'play' : 'add'} size={20} color="#FFFFFF" />
            <Text variant="button" color="#FFFFFF">
              {active ? t('gym.resume') : t('gym.startEmpty').replace('+ ', '')}
            </Text>
          </PressableScale>
          <PressableScale
            onPress={() => {
              resetDraft();
              router.push('/fitness/routine/new');
            }}
            accessibilityRole="button"
            accessibilityLabel={t('gym.newRoutine')}
            scaleTo={0.98}
            style={[styles.secondary, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
            <Icon name="clipboard-outline" size={20} color={colors.text} />
            <Text variant="button">{t('gym.newRoutine')}</Text>
          </PressableScale>
        </View>

        <Text variant="section" style={styles.sectionTitle}>
          {t('gym.history')}
        </Text>

        {history.length === 0 ? (
          <GymEmpty title={t('gym.noHistory')} body={t('gym.noRoutinesHint')} />
        ) : (
          <View style={styles.list}>
            {history.map((workout) => (
              <View key={workout.id} style={[styles.card, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
                <Text variant="bodyStrong" numberOfLines={1}>
                  {workout.title}
                </Text>
                <Text variant="caption" color="textSecondary">
                  {formatRelativeDateTime(workout.finishedAt)}
                </Text>
                <View style={styles.cardStats}>
                  <Text variant="caption" color="textSecondary">
                    {t('gym.duration')}: {formatSeconds(workout.durationSeconds)}
                  </Text>
                  <Text variant="caption" color="textSecondary">
                    {t('gym.volume')}: {workout.volumeKg} kg
                  </Text>
                  <Text variant="caption" color="textSecondary">
                    {t('gym.setsDone', { count: workout.setCount })}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: tabBarClearance, gap: 14, justifyContent: 'flex-start' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: gutter, paddingTop: 8 },
  exit: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  stats: { paddingHorizontal: gutter },
  actions: { paddingHorizontal: gutter, gap: 10 },
  primary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 52 },
  secondary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 52 },
  sectionTitle: { paddingHorizontal: gutter, marginTop: 6 },
  list: { paddingHorizontal: gutter, gap: 10 },
  card: { padding: 14, gap: 4 },
  cardStats: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 4 },
});
