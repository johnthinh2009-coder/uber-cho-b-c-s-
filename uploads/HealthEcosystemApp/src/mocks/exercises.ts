import type { IconName } from '@/components/ui/icon';

export type ExerciseEquipment = 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight' | 'kettlebell';

export type ExerciseMuscle =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'legs'
  | 'glutes'
  | 'core'
  | 'cardio';

export type LibraryExercise = {
  id: string;
  name: string;
  muscle: ExerciseMuscle;
  equipment: ExerciseEquipment;
  popular: boolean;
};

export const EQUIPMENT_ICONS: Record<ExerciseEquipment, IconName> = {
  barbell: 'barbell-outline',
  dumbbell: 'barbell-outline',
  machine: 'construct-outline',
  cable: 'git-network-outline',
  bodyweight: 'body-outline',
  kettlebell: 'fitness-outline',
};

/** Exercise library for building routines. Fictional demo content. */
export const EXERCISES: LibraryExercise[] = [
  { id: 'ex-bench-bb', name: 'Đẩy ngực nằm (tạ đòn)', muscle: 'chest', equipment: 'barbell', popular: true },
  { id: 'ex-bench-db', name: 'Đẩy ngực nằm (tạ tay)', muscle: 'chest', equipment: 'dumbbell', popular: true },
  { id: 'ex-incline-db', name: 'Đẩy ngực dốc (tạ tay)', muscle: 'chest', equipment: 'dumbbell', popular: false },
  { id: 'ex-cable-fly', name: 'Ép ngực cáp', muscle: 'chest', equipment: 'cable', popular: true },
  { id: 'ex-pushup', name: 'Hít đất', muscle: 'chest', equipment: 'bodyweight', popular: true },
  { id: 'ex-row-bb', name: 'Kéo tạ đòn (bent over row)', muscle: 'back', equipment: 'barbell', popular: true },
  { id: 'ex-lat-pulldown', name: 'Kéo xô', muscle: 'back', equipment: 'machine', popular: true },
  { id: 'ex-pullup', name: 'Hít xà', muscle: 'back', equipment: 'bodyweight', popular: true },
  { id: 'ex-seated-row', name: 'Kéo cáp ngồi', muscle: 'back', equipment: 'cable', popular: false },
  { id: 'ex-deadlift', name: 'Deadlift (tạ đòn)', muscle: 'glutes', equipment: 'barbell', popular: true },
  { id: 'ex-hip-thrust', name: 'Đẩy hông', muscle: 'glutes', equipment: 'barbell', popular: false },
  { id: 'ex-squat-bb', name: 'Squat với tạ đòn', muscle: 'legs', equipment: 'barbell', popular: true },
  { id: 'ex-leg-press', name: 'Đạp đùi', muscle: 'legs', equipment: 'machine', popular: true },
  { id: 'ex-lunge', name: 'Chùng chân bước đi', muscle: 'legs', equipment: 'dumbbell', popular: false },
  { id: 'ex-leg-curl', name: 'Cuốn đùi sau', muscle: 'legs', equipment: 'machine', popular: false },
  { id: 'ex-ohp', name: 'Đẩy vai đứng', muscle: 'shoulders', equipment: 'barbell', popular: true },
  { id: 'ex-lateral-raise', name: 'Nâng tạ ngang vai', muscle: 'shoulders', equipment: 'dumbbell', popular: true },
  { id: 'ex-face-pull', name: 'Face pull', muscle: 'shoulders', equipment: 'cable', popular: true },
  { id: 'ex-bicep-curl', name: 'Cuốn tay trước (tạ tay)', muscle: 'biceps', equipment: 'dumbbell', popular: true },
  { id: 'ex-hammer-curl', name: 'Cuốn tay búa', muscle: 'biceps', equipment: 'dumbbell', popular: false },
  { id: 'ex-tricep-pushdown', name: 'Đẩy tay sau bằng cáp', muscle: 'triceps', equipment: 'cable', popular: true },
  { id: 'ex-dips', name: 'Chống xà kép', muscle: 'triceps', equipment: 'bodyweight', popular: false },
  { id: 'ex-plank', name: 'Plank', muscle: 'core', equipment: 'bodyweight', popular: true },
  { id: 'ex-situp', name: 'Gập bụng', muscle: 'core', equipment: 'bodyweight', popular: false },
  { id: 'ex-kettlebell-swing', name: 'Kettlebell swing', muscle: 'core', equipment: 'kettlebell', popular: false },
  { id: 'ex-walk', name: 'Đi bộ nhanh', muscle: 'cardio', equipment: 'bodyweight', popular: true },
  { id: 'ex-row-machine', name: 'Máy chèo thuyền', muscle: 'cardio', equipment: 'machine', popular: false },
  { id: 'ex-cycling', name: 'Đạp xe tại chỗ', muscle: 'cardio', equipment: 'machine', popular: false },
];

export const EXERCISES_BY_ID: Record<string, LibraryExercise> = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));
