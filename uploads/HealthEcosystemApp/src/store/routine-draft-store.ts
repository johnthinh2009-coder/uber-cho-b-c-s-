import { create } from 'zustand';

import { EXERCISES_BY_ID } from '@/mocks/exercises';

import { makeRoutineExercise, type Routine, type RoutineExercise } from './gym-store';

type RoutineDraftState = {
  routineId: string | null;
  title: string;
  exercises: RoutineExercise[];
  reset: () => void;
  loadFrom: (routine: Routine) => void;
  setTitle: (title: string) => void;
  addExercises: (exerciseIds: string[]) => void;
  removeExercise: (id: string) => void;
  move: (index: number, direction: -1 | 1) => void;
};

/**
 * Draft held outside the screen so the exercise picker can push straight into
 * it – no state syncing inside effects.
 */
export const useRoutineDraft = create<RoutineDraftState>((set, get) => ({
  routineId: null,
  title: '',
  exercises: [],

  reset: () => set({ routineId: null, title: '', exercises: [] }),

  loadFrom: (routine) => set({ routineId: routine.id, title: routine.title, exercises: routine.exercises }),

  setTitle: (title) => set({ title }),

  addExercises: (exerciseIds) =>
    set({
      exercises: [
        ...get().exercises,
        ...exerciseIds
          .map((id) => EXERCISES_BY_ID[id])
          .filter((exercise): exercise is NonNullable<typeof exercise> => Boolean(exercise))
          .map((exercise) => makeRoutineExercise({ exerciseId: exercise.id, name: exercise.name, muscle: exercise.muscle })),
      ],
    }),

  removeExercise: (id) => set({ exercises: get().exercises.filter((exercise) => exercise.id !== id) }),

  move: (index, direction) => {
    const target = index + direction;
    const exercises = [...get().exercises];
    if (target < 0 || target >= exercises.length) return;
    const [moved] = exercises.splice(index, 1);
    exercises.splice(target, 0, moved!);
    set({ exercises });
  },
}));
