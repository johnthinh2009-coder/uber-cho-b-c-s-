import { tLabel } from '@/i18n';

import type { Id, ISODateString } from './common';

export type WorkoutCategoryId =
  | 'strength'
  | 'cardio'
  | 'calisthenics'
  | 'mobility'
  | 'flexibility'
  | 'functional'
  | 'walking'
  | 'running'
  | 'cycling'
  | 'core'
  | 'upper_body'
  | 'lower_body'
  | 'full_body'
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'no_equipment'
  | 'home'
  | 'gym';

export type WorkoutCategory = {
  id: WorkoutCategoryId;
  label: string;
  imageUrl: string;
  group: 'type' | 'target' | 'level' | 'setting';
};

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

/** Localised difficulty, e.g. 'Beginner' → 'Cơ bản'. */
export function difficultyLabel(difficulty: Difficulty): string {
  return tLabel('labels.difficulty', difficulty);
}

export type Equipment =
  | 'None'
  | 'Dumbbells'
  | 'Kettlebell'
  | 'Barbell'
  | 'Resistance band'
  | 'Mat'
  | 'Bench'
  | 'Pull-up bar'
  | 'Bike'
  | 'Rowing machine';

/** Localised equipment name, e.g. 'Dumbbells' → 'Tạ tay'. */
export function equipmentLabel(equipment: Equipment): string {
  return tLabel('labels.equipment', equipment);
}

export type Exercise = {
  id: Id;
  name: string;
  sets: number;
  /** Either a rep target or a timed hold. */
  reps?: number;
  durationSeconds?: number;
  restSeconds: number;
  instructions: string;
  targetMuscles: string[];
};

/** Provenance for a program – lets the content team cite sources later. */
export type EvidenceMeta = {
  author: string;
  reviewedBy?: string;
  sourceLabel: string;
  sourceUrl?: string;
  lastReviewed: ISODateString;
  disclaimer: string;
};

export type Program = {
  id: Id;
  title: string;
  heroUrl: string;
  categoryIds: WorkoutCategoryId[];
  difficulty: Difficulty;
  durationMinutes: number;
  equipment: Equipment[];
  targetMuscles: string[];
  goal: string;
  description: string;
  exercises: Exercise[];
  coachingNotes: string[];
  evidence: EvidenceMeta;
  estimatedCalories: number;
};

export type WorkoutSessionStatus = 'in_progress' | 'paused' | 'completed' | 'abandoned';

export type WorkoutSession = {
  id: Id;
  programId: Id;
  startedAt: ISODateString;
  completedAt?: ISODateString;
  currentExerciseIndex: number;
  status: WorkoutSessionStatus;
  elapsedSeconds: number;
};

export type ScheduledWorkout = {
  id: Id;
  programId: Id;
  /** "YYYY-MM-DD" */
  date: string;
  time: string;
  completed: boolean;
};
