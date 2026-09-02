import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Chip } from '@/components/ui/chip';
import { HScroll } from '@/components/ui/h-scroll';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { EXERCISES, type ExerciseEquipment, type ExerciseMuscle } from '@/mocks/exercises';
import { useGymStore } from '@/store/gym-store';
import { useRoutineDraft } from '@/store/routine-draft-store';
import { gutter, useTheme } from '@/theme';

import { ExerciseThumb, GYM_BLUE, GymHeader, HeaderAction } from './gym-ui';

const EQUIPMENT: ExerciseEquipment[] = ['barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'kettlebell'];
const MUSCLES: ExerciseMuscle[] = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'glutes', 'core', 'cardio'];

function normalise(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd');
}

/** Search, filter and multi-select exercises – the reference app's picker. */
export function ExercisePickerScreen() {
  const router = useRouter();
  const { target } = useLocalSearchParams<{ target?: string }>();
  const { colors, radius } = useTheme();
  const { t, tLabel } = useI18n();

  const addToDraft = useRoutineDraft((s) => s.addExercises);
  const addToActive = useGymStore((s) => s.addExerciseToActive);

  const [query, setQuery] = useState('');
  const [equipment, setEquipment] = useState<ExerciseEquipment | null>(null);
  const [muscle, setMuscle] = useState<ExerciseMuscle | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const results = useMemo(() => {
    const q = normalise(query.trim());
    return EXERCISES.filter((exercise) => {
      if (equipment && exercise.equipment !== equipment) return false;
      if (muscle && exercise.muscle !== muscle) return false;
      if (q && !normalise(exercise.name).includes(q) && !normalise(tLabel('labels.muscle', exercise.muscle)).includes(q)) return false;
      return true;
    });
  }, [query, equipment, muscle, tLabel]);

  const confirm = () => {
    if (selected.length === 0) {
      router.back();
      return;
    }
    if (target === 'session') {
      for (const id of selected) {
        const exercise = EXERCISES.find((item) => item.id === id);
        if (exercise) addToActive({ exerciseId: exercise.id, name: exercise.name, muscle: exercise.muscle });
      }
    } else {
      addToDraft(selected);
    }
    router.back();
  };

  return (
    <Screen>
      <GymHeader
        title={t('gym.addExerciseTitle')}
        left={<HeaderAction label={t('gym.cancel')} tone="muted" onPress={() => router.back()} />}
        right={<HeaderAction label={selected.length > 0 ? `${t('gym.save')} (${selected.length})` : t('gym.save')} onPress={confirm} />}
      />

      <View style={styles.searchWrap}>
        <View style={[styles.search, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
          <Icon name="search" size={18} color={colors.textTertiary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('gym.searchExercise')}
            placeholderTextColor={colors.textTertiary}
            accessibilityLabel={t('gym.searchExercise')}
            style={[styles.input, { color: colors.text }]}
          />
        </View>
      </View>

      <HScroll accessibilityLabel={t('gym.allEquipment')}>
        <Chip label={t('gym.allEquipment')} selected={equipment === null} onPress={() => setEquipment(null)} />
        {EQUIPMENT.map((item) => (
          <Chip
            key={item}
            label={tLabel('labels.equipmentType', item)}
            selected={equipment === item}
            onPress={() => setEquipment(equipment === item ? null : item)}
          />
        ))}
      </HScroll>

      <HScroll accessibilityLabel={t('gym.allMuscles')}>
        <Chip label={t('gym.allMuscles')} selected={muscle === null} onPress={() => setMuscle(null)} />
        {MUSCLES.map((item) => (
          <Chip
            key={item}
            label={tLabel('labels.muscle', item)}
            selected={muscle === item}
            onPress={() => setMuscle(muscle === item ? null : item)}
          />
        ))}
      </HScroll>

      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        <Text variant="label" color="textTertiary" style={styles.groupTitle}>
          {t('gym.popular')}
        </Text>
        {results.map((exercise) => {
          const isSelected = selected.includes(exercise.id);
          return (
            <PressableScale
              key={exercise.id}
              onPress={() => setSelected(isSelected ? selected.filter((id) => id !== exercise.id) : [...selected, exercise.id])}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${exercise.name}. ${tLabel('labels.muscle', exercise.muscle)}`}
              scaleTo={0.99}
              style={[styles.row, { borderBottomColor: colors.border }]}>
              <ExerciseThumb exercise={exercise} />
              <View style={styles.flex}>
                <Text variant="bodyStrong" numberOfLines={2}>
                  {exercise.name}
                </Text>
                <Text variant="caption" color="textSecondary">
                  {tLabel('labels.muscle', exercise.muscle)} · {tLabel('labels.equipmentType', exercise.equipment)}
                </Text>
              </View>
              <View
                style={[
                  styles.check,
                  { borderColor: isSelected ? GYM_BLUE : colors.borderStrong, backgroundColor: isSelected ? GYM_BLUE : 'transparent' },
                ]}>
                {isSelected ? <Icon name="checkmark" size={15} color="#FFFFFF" /> : null}
              </View>
            </PressableScale>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchWrap: { paddingHorizontal: gutter, paddingBottom: 10 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 46, paddingHorizontal: 14 },
  input: { flex: 1, fontSize: 16, paddingVertical: 0 },
  list: { paddingHorizontal: gutter, paddingBottom: 40, justifyContent: 'flex-start' },
  groupTitle: { paddingVertical: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  check: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1, gap: 2 },
});
