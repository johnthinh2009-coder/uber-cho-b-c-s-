import type { Program, ScheduledWorkout, WorkoutCategory } from '@/domain';
import { PROGRAMS, PROGRAMS_BY_ID, SCHEDULED_WORKOUTS, WORKOUT_CATEGORIES } from '@/mocks/fitness';

import type { FitnessRepository, ProgramFilter } from '../repositories';
import { clone, delay, nextId } from './utils';

export class MockFitnessRepository implements FitnessRepository {
  private scheduledWorkouts: ScheduledWorkout[] = clone(SCHEDULED_WORKOUTS);

  async categories(): Promise<WorkoutCategory[]> {
    await delay(200);
    return WORKOUT_CATEGORIES;
  }

  async programs(filter: ProgramFilter = {}): Promise<Program[]> {
    await delay(filter.query ? 200 : 400);
    const q = filter.query?.trim().toLowerCase();
    return PROGRAMS.filter((program) => {
      if (filter.categoryId && !program.categoryIds.includes(filter.categoryId)) return false;
      if (q) {
        const haystack = [program.title, program.goal, program.description, ...program.targetMuscles, ...program.equipment]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }

  async getProgram(id: string): Promise<Program | undefined> {
    await delay(150);
    return PROGRAMS_BY_ID[id];
  }

  async scheduled(): Promise<ScheduledWorkout[]> {
    await delay(150);
    return clone(this.scheduledWorkouts);
  }

  async schedule(programId: string, date: string, time: string): Promise<ScheduledWorkout> {
    await delay(350);
    const created: ScheduledWorkout = { id: nextId('sched'), programId, date, time, completed: false };
    this.scheduledWorkouts = [...this.scheduledWorkouts, created];
    return clone(created);
  }

  async markScheduledComplete(programId: string): Promise<void> {
    await delay(150);
    this.scheduledWorkouts = this.scheduledWorkouts.map((s) =>
      s.programId === programId ? { ...s, completed: true } : s,
    );
  }
}
