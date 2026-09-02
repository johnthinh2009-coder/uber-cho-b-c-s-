import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { useGymStore } from '@/store/gym-store';
import { useRoutineDraft } from '@/store/routine-draft-store';
import { toast } from '@/store/toast-store';
import { gutter, tabBarClearance, useTheme } from '@/theme';

import { GYM_BLUE, GymEmpty } from './gym-ui';

/** Start a session, or manage the routines you built. */
export function GymWorkoutScreen() {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const { t } = useI18n();
  const routines = useGymStore((s) => s.routines);
  const active = useGymStore((s) => s.active);
  const startWorkout = useGymStore((s) => s.startWorkout);
  const deleteRoutine = useGymStore((s) => s.deleteRoutine);
  const resetDraft = useRoutineDraft((s) => s.reset);
  const loadDraft = useRoutineDraft((s) => s.loadFrom);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text variant="pageTitle" accessibilityRole="header" style={styles.title}>
          {t('gym.tabs.workout')}
        </Text>

        {active ? (
          <PressableScale
            onPress={() => router.push('/fitness/session')}
            accessibilityRole="button"
            accessibilityLabel={t('gym.resume')}
            scaleTo={0.98}
            style={[styles.resume, { backgroundColor: GYM_BLUE, borderRadius: radius.lg }]}>
            <Icon name="play" size={20} color="#FFFFFF" />
            <View style={styles.flex}>
              <Text variant="bodyStrong" color="#FFFFFF">
                {t('gym.inProgress')}
              </Text>
              <Text variant="caption" color="rgba(255,255,255,0.85)">
                {active.title || t('gym.emptyWorkoutTitle')}
              </Text>
            </View>
            <Icon name="chevron-forward" size={18} color="#FFFFFF" />
          </PressableScale>
        ) : (
          <PressableScale
            onPress={() => {
              startWorkout();
              router.push('/fitness/session');
            }}
            accessibilityRole="button"
            accessibilityLabel={t('gym.startEmpty')}
            scaleTo={0.98}
            style={[styles.startEmpty, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
            <Icon name="add" size={22} color={colors.text} />
            <Text variant="bodyStrong">{t('gym.startEmpty').replace('+ ', '')}</Text>
          </PressableScale>
        )}

        <Text variant="section" style={styles.sectionTitle}>
          {t('gym.routines')}
        </Text>

        <View style={styles.grid}>
          <PressableScale
            onPress={() => {
              resetDraft();
              router.push('/fitness/routine/new');
            }}
            accessibilityRole="button"
            accessibilityLabel={t('gym.newRoutine')}
            scaleTo={0.97}
            style={[styles.gridCard, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
            <Icon name="clipboard-outline" size={24} color={colors.text} />
            <Text variant="bodySmallStrong">{t('gym.newRoutine')}</Text>
          </PressableScale>
          <PressableScale
            onPress={() => {
              resetDraft();
              router.push('/fitness/exercise-picker?target=routine');
            }}
            accessibilityRole="button"
            accessibilityLabel={t('gym.exerciseLibrary')}
            scaleTo={0.97}
            style={[styles.gridCard, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
            <Icon name="search" size={24} color={colors.text} />
            <Text variant="bodySmallStrong">{t('gym.exerciseLibrary')}</Text>
          </PressableScale>
        </View>

        {routines.length === 0 ? (
          <GymEmpty title={t('gym.noRoutines')} body={t('gym.noRoutinesHint')} />
        ) : (
          <View style={styles.list}>
            {routines.map((routine) => (
              <View key={routine.id} style={[styles.routine, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
                <PressableScale
                  onPress={() => {
                    loadDraft(routine);
                    router.push(`/fitness/routine/${routine.id}`);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`${routine.title}. ${t('gym.exercises', { count: routine.exercises.length })}`}
                  scaleTo={0.99}
                  style={styles.routineHead}>
                  <View style={styles.flex}>
                    <Text variant="bodyStrong" numberOfLines={1}>
                      {routine.title}
                    </Text>
                    <Text variant="caption" color="textSecondary" numberOfLines={2}>
                      {routine.exercises.length > 0
                        ? routine.exercises.map((exercise) => exercise.name).join(', ')
                        : t('gym.routineEmpty')}
                    </Text>
                  </View>
                  <Icon name="create-outline" size={20} color={colors.textSecondary} />
                </PressableScale>

                <View style={styles.routineActions}>
                  <PressableScale
                    onPress={() => {
                      startWorkout(routine);
                      router.push('/fitness/session');
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`${t('gym.startWorkout')}: ${routine.title}`}
                    scaleTo={0.97}
                    style={[styles.startButton, { backgroundColor: GYM_BLUE, borderRadius: radius.md }]}>
                    <Text variant="bodySmallStrong" color="#FFFFFF">
                      {t('gym.startWorkout')}
                    </Text>
                  </PressableScale>
                  <PressableScale
                    onPress={() => {
                      deleteRoutine(routine.id);
                      toast.show({ title: t('gym.deletedRoutine'), tone: 'neutral' });
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`${t('common.remove')}: ${routine.title}`}
                    scaleTo={0.94}
                    style={[styles.deleteButton, { backgroundColor: colors.surfaceStrong, borderRadius: radius.md }]}>
                    <Icon name="trash-outline" size={18} color={colors.danger} />
                  </PressableScale>
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
  title: { paddingHorizontal: gutter, paddingTop: 8 },
  startEmpty: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, marginHorizontal: gutter },
  resume: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, marginHorizontal: gutter },
  sectionTitle: { paddingHorizontal: gutter, marginTop: 4 },
  grid: { flexDirection: 'row', gap: 10, paddingHorizontal: gutter },
  gridCard: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 24 },
  list: { paddingHorizontal: gutter, gap: 10 },
  routine: { padding: 14, gap: 12 },
  routineHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  routineActions: { flexDirection: 'row', gap: 8 },
  startButton: { flex: 1, height: 42, alignItems: 'center', justifyContent: 'center' },
  deleteButton: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1, gap: 2 },
});
