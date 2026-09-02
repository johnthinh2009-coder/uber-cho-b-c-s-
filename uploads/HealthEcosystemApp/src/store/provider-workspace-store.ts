import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { localId } from './persist';

export type TaskPriority = 'low' | 'normal' | 'high';

export type WorkTask = {
  id: string;
  title: string;
  /** Local date key "YYYY-MM-DD". */
  date: string;
  /** 24h "HH:MM" or '' when the task has no fixed time. */
  time: string;
  note: string;
  priority: TaskPriority;
  done: boolean;
  completedAt?: string;
  createdAt: string;
};

export type TaskInput = Omit<WorkTask, 'id' | 'done' | 'completedAt' | 'createdAt'>;

export type WorkNote = {
  id: string;
  title: string;
  body: string;
  /** Local date key "YYYY-MM-DD". */
  date: string;
  updatedAt: string;
};

export type NoteInput = Omit<WorkNote, 'id' | 'updatedAt'>;

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export const DAY_ORDER: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export type TimeBlock = { id: string; start: string; end: string };
export type DaySchedule = { enabled: boolean; blocks: TimeBlock[] };
export type WorkingHours = Record<DayKey, DaySchedule>;

type WorkspaceState = {
  tasks: WorkTask[];
  notes: WorkNote[];
  /** `null` until the professional sets their availability up. */
  hours: WorkingHours | null;

  addTask: (input: TaskInput) => WorkTask;
  updateTask: (id: string, patch: Partial<TaskInput>) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;

  addNote: (input: NoteInput) => WorkNote;
  updateNote: (id: string, patch: Partial<NoteInput>) => void;
  removeNote: (id: string) => void;

  initialiseHours: () => void;
  setDayEnabled: (day: DayKey, enabled: boolean) => void;
  addBlock: (day: DayKey) => void;
  updateBlock: (day: DayKey, blockId: string, patch: Partial<Omit<TimeBlock, 'id'>>) => void;
  removeBlock: (day: DayKey, blockId: string) => void;
};

/** A sensible Vietnamese clinic week, used when availability is first set up. */
function defaultHours(): WorkingHours {
  const weekday = (): DaySchedule => ({
    enabled: true,
    blocks: [
      { id: localId('blk'), start: '08:00', end: '12:00' },
      { id: localId('blk'), start: '13:30', end: '18:00' },
    ],
  });
  return {
    mon: weekday(),
    tue: weekday(),
    wed: weekday(),
    thu: weekday(),
    fri: weekday(),
    sat: { enabled: true, blocks: [{ id: localId('blk'), start: '08:00', end: '12:00' }] },
    sun: { enabled: false, blocks: [] },
  };
}

/**
 * The professional's own workspace: their to-dos, private notes and the hours
 * they are willing to take visits. Entirely local to the device – notes in
 * particular are never exposed to customer screens.
 */
export const useProviderWorkspace = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      tasks: [],
      notes: [],
      hours: null,

      addTask: (input) => {
        const task: WorkTask = { ...input, id: localId('task'), done: false, createdAt: new Date().toISOString() };
        set({ tasks: [task, ...get().tasks] });
        return task;
      },

      updateTask: (id, patch) => set({ tasks: get().tasks.map((task) => (task.id === id ? { ...task, ...patch } : task)) }),

      toggleTask: (id) =>
        set({
          tasks: get().tasks.map((task) =>
            task.id === id
              ? { ...task, done: !task.done, completedAt: !task.done ? new Date().toISOString() : undefined }
              : task,
          ),
        }),

      removeTask: (id) => set({ tasks: get().tasks.filter((task) => task.id !== id) }),

      addNote: (input) => {
        const note: WorkNote = { ...input, id: localId('note'), updatedAt: new Date().toISOString() };
        set({ notes: [note, ...get().notes] });
        return note;
      },

      updateNote: (id, patch) =>
        set({
          notes: get().notes.map((note) => (note.id === id ? { ...note, ...patch, updatedAt: new Date().toISOString() } : note)),
        }),

      removeNote: (id) => set({ notes: get().notes.filter((note) => note.id !== id) }),

      initialiseHours: () => set({ hours: defaultHours() }),

      setDayEnabled: (day, enabled) => {
        const hours = get().hours;
        if (!hours) return;
        const existing = hours[day];
        set({
          hours: {
            ...hours,
            [day]: {
              enabled,
              blocks: enabled && existing.blocks.length === 0 ? [{ id: localId('blk'), start: '08:00', end: '12:00' }] : existing.blocks,
            },
          },
        });
      },

      addBlock: (day) => {
        const hours = get().hours;
        if (!hours) return;
        const blocks = [...hours[day].blocks, { id: localId('blk'), start: '13:30', end: '17:00' }];
        set({ hours: { ...hours, [day]: { ...hours[day], blocks } } });
      },

      updateBlock: (day, blockId, patch) => {
        const hours = get().hours;
        if (!hours) return;
        const blocks = hours[day].blocks.map((block) => (block.id === blockId ? { ...block, ...patch } : block));
        set({ hours: { ...hours, [day]: { ...hours[day], blocks } } });
      },

      removeBlock: (day, blockId) => {
        const hours = get().hours;
        if (!hours) return;
        const blocks = hours[day].blocks.filter((block) => block.id !== blockId);
        set({ hours: { ...hours, [day]: { ...hours[day], blocks } } });
      },
    }),
    { name: 'haven.provider.workspace', storage: createJSONStorage(() => AsyncStorage), version: 1 },
  ),
);

/** Tasks for one day, active first then completed. */
export function tasksForDate(tasks: WorkTask[], date: string) {
  const forDay = tasks.filter((task) => task.date === date);
  const byTime = (a: WorkTask, b: WorkTask) => (a.time || '99:99').localeCompare(b.time || '99:99');
  return {
    active: forDay.filter((task) => !task.done).sort(byTime),
    done: forDay.filter((task) => task.done).sort(byTime),
  };
}
