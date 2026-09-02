import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { localId } from './persist';

export type SetEntry = {
  id: string;
  kg: string;
  reps: string;
  done: boolean;
};

export type RoutineExercise = {
  id: string;
  exerciseId: string;
  name: string;
  muscle: string;
  sets: SetEntry[];
};

export type Routine = {
  id: string;
  title: string;
  exercises: RoutineExercise[];
  createdAt: string;
};

export type ActiveWorkout = {
  id: string;
  routineId: string | null;
  title: string;
  startedAt: string;
  exercises: RoutineExercise[];
};

export type FinishedWorkout = {
  id: string;
  title: string;
  finishedAt: string;
  durationSeconds: number;
  volumeKg: number;
  setCount: number;
  exerciseCount: number;
};

type GymState = {
  routines: Routine[];
  active: ActiveWorkout | null;
  history: FinishedWorkout[];

  createRoutine: (title: string, exercises: RoutineExercise[]) => Routine;
  updateRoutine: (id: string, patch: Partial<Pick<Routine, 'title' | 'exercises'>>) => void;
  deleteRoutine: (id: string) => void;

  startWorkout: (routine?: Routine) => void;
  addExerciseToActive: (exercise: { exerciseId: string; name: string; muscle: string }) => void;
  removeExerciseFromActive: (id: string) => void;
  moveExercise: (id: string, direction: -1 | 1) => void;
  addSet: (exerciseId: string) => void;
  updateSet: (exerciseId: string, setId: string, patch: Partial<Pick<SetEntry, 'kg' | 'reps' | 'done'>>) => void;
  removeSet: (exerciseId: string, setId: string) => void;
  finishWorkout: () => FinishedWorkout | null;
  discardWorkout: () => void;
};

export function emptySet(): SetEntry {
  return { id: localId('set'), kg: '', reps: '', done: false };
}

export function makeRoutineExercise(exercise: { exerciseId: string; name: string; muscle: string }): RoutineExercise {
  return { id: localId('rex'), ...exercise, sets: [emptySet()] };
}

function volumeOf(exercises: RoutineExercise[]): number {
  return exercises.reduce(
    (total, exercise) =>
      total +
      exercise.sets.reduce((sum, set) => (set.done ? sum + (Number(set.kg) || 0) * (Number(set.reps) || 0) : sum), 0),
    0,
  );
}

export const useGymStore = create<GymState>()(
  persist(
    (set, get) => ({
      routines: [],
      active: null,
      history: [],

      createRoutine: (title, exercises) => {
        const routine: Routine = { id: localId('rou'), title, exercises, createdAt: new Date().toISOString() };
        set({ routines: [routine, ...get().routines] });
        return routine;
      },

      updateRoutine: (id, patch) =>
        set({ routines: get().routines.map((routine) => (routine.id === id ? { ...routine, ...patch } : routine)) }),

      deleteRoutine: (id) => set({ routines: get().routines.filter((routine) => routine.id !== id) }),

      startWorkout: (routine) =>
        set({
          active: {
            id: localId('wk'),
            routineId: routine?.id ?? null,
            title: routine?.title ?? '',
            startedAt: new Date().toISOString(),
            exercises: routine
              ? routine.exercises.map((exercise) => ({
                  ...exercise,
                  id: localId('rex'),
                  sets: exercise.sets.map((s) => ({ ...s, id: localId('set'), done: false })),
                }))
              : [],
          },
        }),

      addExerciseToActive: (exercise) => {
        const active = get().active;
        if (!active) return;
        set({ active: { ...active, exercises: [...active.exercises, makeRoutineExercise(exercise)] } });
      },

      removeExerciseFromActive: (id) => {
        const active = get().active;
        if (!active) return;
        set({ active: { ...active, exercises: active.exercises.filter((exercise) => exercise.id !== id) } });
      },

      moveExercise: (id, direction) => {
        const active = get().active;
        if (!active) return;
        const index = active.exercises.findIndex((exercise) => exercise.id === id);
        const target = index + direction;
        if (index < 0 || target < 0 || target >= active.exercises.length) return;
        const exercises = [...active.exercises];
        const [moved] = exercises.splice(index, 1);
        exercises.splice(target, 0, moved!);
        set({ active: { ...active, exercises } });
      },

      addSet: (exerciseId) => {
        const active = get().active;
        if (!active) return;
        set({
          active: {
            ...active,
            exercises: active.exercises.map((exercise) =>
              exercise.id === exerciseId ? { ...exercise, sets: [...exercise.sets, emptySet()] } : exercise,
            ),
          },
        });
      },

      updateSet: (exerciseId, setId, patch) => {
        const active = get().active;
        if (!active) return;
        set({
          active: {
            ...active,
            exercises: active.exercises.map((exercise) =>
              exercise.id === exerciseId
                ? { ...exercise, sets: exercise.sets.map((s) => (s.id === setId ? { ...s, ...patch } : s)) }
                : exercise,
            ),
          },
        });
      },

      removeSet: (exerciseId, setId) => {
        const active = get().active;
        if (!active) return;
        set({
          active: {
            ...active,
            exercises: active.exercises.map((exercise) =>
              exercise.id === exerciseId ? { ...exercise, sets: exercise.sets.filter((s) => s.id !== setId) } : exercise,
            ),
          },
        });
      },

      finishWorkout: () => {
        const active = get().active;
        if (!active) return null;
        const setCount = active.exercises.reduce((sum, exercise) => sum + exercise.sets.filter((s) => s.done).length, 0);
        const finished: FinishedWorkout = {
          id: active.id,
          title: active.title || 'Buổi tập',
          finishedAt: new Date().toISOString(),
          durationSeconds: Math.max(1, Math.round((Date.now() - new Date(active.startedAt).getTime()) / 1000)),
          volumeKg: volumeOf(active.exercises),
          setCount,
          exerciseCount: active.exercises.length,
        };
        set({ history: [finished, ...get().history], active: null });
        return finished;
      },

      discardWorkout: () => set({ active: null }),
    }),
    { name: 'haven.gym', storage: createJSONStorage(() => AsyncStorage), version: 1 },
  ),
);
