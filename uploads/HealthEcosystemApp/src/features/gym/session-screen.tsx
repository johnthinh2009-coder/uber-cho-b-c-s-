import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { EXERCISES_BY_ID } from '@/mocks/exercises';
import { useGymStore } from '@/store/gym-store';
import { toast } from '@/store/toast-store';
import { gutter, useTheme } from '@/theme';
import { formatSeconds } from '@/utils/date';

import { ExerciseThumb, GYM_BLUE, GymEmpty, GymHeader, HeaderAction } from './gym-ui';

/** A live workout: tick off sets, log kg and reps, finish and keep the record. */
export function SessionScreen() {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const { t } = useI18n();

  const active = useGymStore((s) => s.active);
  const updateSet = useGymStore((s) => s.updateSet);
  const addSet = useGymStore((s) => s.addSet);
  const removeSet = useGymStore((s) => s.removeSet);
  const removeExercise = useGymStore((s) => s.removeExerciseFromActive);
  const moveExercise = useGymStore((s) => s.moveExercise);
  const finishWorkout = useGymStore((s) => s.finishWorkout);
  const discardWorkout = useGymStore((s) => s.discardWorkout);

  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!active) return;
    const started = new Date(active.startedAt).getTime();
    const tick = () => setElapsed(Math.max(0, Math.round((Date.now() - started) / 1000)));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [active]);

  if (!active) {
    return (
      <Screen>
        <GymHeader title={t('gym.startWorkout')} left={<HeaderAction label={t('gym.cancel')} tone="muted" onPress={() => router.back()} />} />
        <GymEmpty title={t('gym.noHistory')} body={t('gym.noRoutinesHint')} />
      </Screen>
    );
  }

  const volume = active.exercises.reduce(
    (total, exercise) =>
      total + exercise.sets.reduce((sum, set) => (set.done ? sum + (Number(set.kg) || 0) * (Number(set.reps) || 0) : sum), 0),
    0,
  );
  const doneSets = active.exercises.reduce((sum, exercise) => sum + exercise.sets.filter((set) => set.done).length, 0);

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <GymHeader
          title={active.title || t('gym.emptyWorkoutTitle')}
          left={
            <HeaderAction
              label={t('gym.discard')}
              tone="muted"
              onPress={() => {
                discardWorkout();
                toast.show({ title: t('gym.workoutDiscarded'), tone: 'neutral' });
                router.back();
              }}
            />
          }
          right={
            <HeaderAction
              label={t('gym.finish')}
              onPress={() => {
                const finished = finishWorkout();
                if (finished) toast.show({ title: t('gym.workoutSaved'), tone: 'success' });
                router.replace('/fitness/profile');
              }}
            />
          }
        />

        <View style={styles.stats}>
          {[
            { label: t('gym.duration'), value: formatSeconds(elapsed) },
            { label: t('gym.volume'), value: `${volume} kg` },
            { label: t('gym.sets'), value: String(doneSets) },
          ].map((stat) => (
            <View key={stat.label} style={styles.stat}>
              <Text variant="label" color="textSecondary">
                {stat.label}
              </Text>
              <Text variant="bodyStrong">{stat.value}</Text>
            </View>
          ))}
        </View>

        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {active.exercises.length === 0 ? (
            <GymEmpty title={t('gym.routineEmpty')} />
          ) : (
            active.exercises.map((exercise, index) => {
              const library = EXERCISES_BY_ID[exercise.exerciseId];
              return (
                <View key={exercise.id} style={[styles.exercise, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
                  <View style={styles.exerciseHead}>
                    <ExerciseThumb exercise={{ equipment: library?.equipment ?? 'bodyweight' }} size={40} />
                    <Text variant="bodyStrong" numberOfLines={2} style={styles.flex}>
                      {exercise.name}
                    </Text>
                    <PressableScale onPress={() => moveExercise(exercise.id, -1)} accessibilityRole="button" accessibilityLabel={t('gym.moveUp')} scaleTo={0.9}>
                      <Icon name="chevron-up" size={18} color={colors.textSecondary} />
                    </PressableScale>
                    <PressableScale onPress={() => moveExercise(exercise.id, 1)} accessibilityRole="button" accessibilityLabel={t('gym.moveDown')} scaleTo={0.9}>
                      <Icon name="chevron-down" size={18} color={colors.textSecondary} />
                    </PressableScale>
                    <PressableScale onPress={() => removeExercise(exercise.id)} accessibilityRole="button" accessibilityLabel={t('gym.removeExercise')} scaleTo={0.9}>
                      <Icon name="close" size={18} color={colors.danger} />
                    </PressableScale>
                  </View>

                  <View style={styles.setHeader}>
                    <Text variant="label" color="textTertiary" style={styles.colSet}>
                      {t('gym.set')}
                    </Text>
                    <Text variant="label" color="textTertiary" style={styles.colInput}>
                      {t('gym.kg')}
                    </Text>
                    <Text variant="label" color="textTertiary" style={styles.colInput}>
                      {t('gym.reps')}
                    </Text>
                    <View style={styles.colCheck} />
                  </View>

                  {exercise.sets.map((set, setIndex) => (
                    <View key={set.id} style={styles.setRow}>
                      <Text variant="bodySmallStrong" style={styles.colSet}>
                        {setIndex + 1}
                      </Text>
                      <TextInput
                        value={set.kg}
                        onChangeText={(value) => updateSet(exercise.id, set.id, { kg: value })}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={colors.textTertiary}
                        accessibilityLabel={`${exercise.name} ${t('gym.set')} ${setIndex + 1} ${t('gym.kg')}`}
                        style={[styles.setInput, styles.colInput, { backgroundColor: colors.surfaceStrong, color: colors.text, borderRadius: radius.sm }]}
                      />
                      <TextInput
                        value={set.reps}
                        onChangeText={(value) => updateSet(exercise.id, set.id, { reps: value })}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={colors.textTertiary}
                        accessibilityLabel={`${exercise.name} ${t('gym.set')} ${setIndex + 1} ${t('gym.reps')}`}
                        style={[styles.setInput, styles.colInput, { backgroundColor: colors.surfaceStrong, color: colors.text, borderRadius: radius.sm }]}
                      />
                      <View style={styles.colCheck}>
                        <PressableScale
                          onPress={() => updateSet(exercise.id, set.id, { done: !set.done })}
                          accessibilityRole="button"
                          accessibilityState={{ selected: set.done }}
                          accessibilityLabel={`${t('gym.set')} ${setIndex + 1}`}
                          scaleTo={0.9}
                          style={[
                            styles.check,
                            { backgroundColor: set.done ? GYM_BLUE : 'transparent', borderColor: set.done ? GYM_BLUE : colors.borderStrong },
                          ]}>
                          <Icon name="checkmark" size={15} color={set.done ? '#FFFFFF' : colors.textTertiary} />
                        </PressableScale>
                        <PressableScale
                          onPress={() => removeSet(exercise.id, set.id)}
                          accessibilityRole="button"
                          accessibilityLabel={`${t('common.remove')} ${t('gym.set')} ${setIndex + 1}`}
                          scaleTo={0.9}>
                          <Icon name="remove-circle-outline" size={18} color={colors.textTertiary} />
                        </PressableScale>
                      </View>
                    </View>
                  ))}

                  <PressableScale
                    onPress={() => addSet(exercise.id)}
                    accessibilityRole="button"
                    accessibilityLabel={t('gym.addSet')}
                    scaleTo={0.98}
                    style={[styles.addSet, { backgroundColor: colors.surfaceStrong, borderRadius: radius.sm }]}>
                    <Text variant="bodySmallStrong" color={GYM_BLUE}>
                      {t('gym.addSet')}
                    </Text>
                  </PressableScale>
                </View>
              );
            })
          )}

          <PressableScale
            onPress={() => router.push('/fitness/exercise-picker?target=session')}
            accessibilityRole="button"
            accessibilityLabel={t('gym.addExercise')}
            scaleTo={0.98}
            style={[styles.addButton, { backgroundColor: GYM_BLUE, borderRadius: radius.md }]}>
            <Icon name="add" size={20} color="#FFFFFF" />
            <Text variant="button" color="#FFFFFF">
              {t('gym.addExercise').replace('+ ', '')}
            </Text>
          </PressableScale>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  stats: { flexDirection: 'row', paddingHorizontal: gutter, paddingBottom: 12, gap: 24 },
  stat: { gap: 2 },
  content: { paddingHorizontal: gutter, paddingBottom: 40, gap: 12, justifyContent: 'flex-start' },
  exercise: { padding: 12, gap: 8 },
  exerciseHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  setHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  setRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  colSet: { width: 28, textAlign: 'center' },
  colInput: { flex: 1, textAlign: 'center' },
  colCheck: { width: 68, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8 },
  setInput: { height: 40, fontSize: 15, paddingVertical: 0 },
  check: { width: 30, height: 30, borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  addSet: { height: 40, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 52 },
});
