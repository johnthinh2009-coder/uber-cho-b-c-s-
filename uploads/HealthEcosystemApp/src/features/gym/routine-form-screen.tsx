import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { EXERCISES_BY_ID } from '@/mocks/exercises';
import { useGymStore } from '@/store/gym-store';
import { useRoutineDraft } from '@/store/routine-draft-store';
import { toast } from '@/store/toast-store';
import { gutter, useTheme } from '@/theme';

import { ExerciseThumb, GYM_BLUE, GymHeader, HeaderAction } from './gym-ui';

/** Build or edit a routine: title, ordered exercises, sets per exercise. */
export function RoutineFormScreen() {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const { t } = useI18n();

  const routineId = useRoutineDraft((s) => s.routineId);
  const title = useRoutineDraft((s) => s.title);
  const exercises = useRoutineDraft((s) => s.exercises);
  const setTitle = useRoutineDraft((s) => s.setTitle);
  const removeExercise = useRoutineDraft((s) => s.removeExercise);
  const move = useRoutineDraft((s) => s.move);

  const createRoutine = useGymStore((s) => s.createRoutine);
  const updateRoutine = useGymStore((s) => s.updateRoutine);

  const save = () => {
    const name = title.trim() || t('gym.createRoutine');
    if (routineId) updateRoutine(routineId, { title: name, exercises });
    else createRoutine(name, exercises);
    toast.show({ title: t('gym.savedRoutine'), tone: 'success' });
    router.back();
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <GymHeader
          title={t('gym.createRoutine')}
          left={<HeaderAction label={t('gym.cancel')} tone="muted" onPress={() => router.back()} />}
          right={<HeaderAction label={t('gym.save')} onPress={save} />}
        />

        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder={t('gym.routineTitle')}
            placeholderTextColor={colors.textTertiary}
            accessibilityLabel={t('gym.routineTitle')}
            style={[styles.titleInput, { color: colors.text, borderBottomColor: colors.border }]}
          />

          {exercises.length === 0 ? (
            <View style={styles.empty}>
              <Icon name="barbell-outline" size={44} color={colors.textTertiary} />
              <Text variant="body" color="textSecondary" align="center">
                {t('gym.routineEmpty')}
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              {exercises.map((exercise, index) => {
                const library = EXERCISES_BY_ID[exercise.exerciseId];
                return (
                  <View key={exercise.id} style={[styles.exercise, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
                    <ExerciseThumb exercise={{ equipment: library?.equipment ?? 'bodyweight' }} />
                    <View style={styles.flex}>
                      <Text variant="bodyStrong" numberOfLines={2}>
                        {exercise.name}
                      </Text>
                      <Text variant="caption" color="textSecondary">
                        {t('gym.setsDone', { count: exercise.sets.length })}
                      </Text>
                    </View>
                    <View style={styles.exerciseActions}>
                      <PressableScale onPress={() => move(index, -1)} accessibilityRole="button" accessibilityLabel={t('gym.moveUp')} scaleTo={0.9}>
                        <Icon name="chevron-up" size={20} color={colors.textSecondary} />
                      </PressableScale>
                      <PressableScale onPress={() => move(index, 1)} accessibilityRole="button" accessibilityLabel={t('gym.moveDown')} scaleTo={0.9}>
                        <Icon name="chevron-down" size={20} color={colors.textSecondary} />
                      </PressableScale>
                      <PressableScale
                        onPress={() => removeExercise(exercise.id)}
                        accessibilityRole="button"
                        accessibilityLabel={t('gym.removeExercise')}
                        scaleTo={0.9}>
                        <Icon name="close" size={20} color={colors.danger} />
                      </PressableScale>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          <PressableScale
            onPress={() => router.push('/fitness/exercise-picker?target=routine')}
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
  content: { paddingHorizontal: gutter, paddingBottom: 40, gap: 18, justifyContent: 'flex-start' },
  titleInput: { fontSize: 26, fontWeight: '700', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  empty: { alignItems: 'center', gap: 12, paddingVertical: 48 },
  list: { gap: 10 },
  exercise: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  exerciseActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 52 },
});
