import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist, type PersistOptions } from 'zustand/middleware';

/**
 * Local persistence for the demo.
 *
 * Everything the user creates – account, family members, food log, medication
 * reminders, routines, messages – is written to AsyncStorage so the app
 * behaves like a real product between reloads. No backend involved.
 */
export const storage = createJSONStorage(() => AsyncStorage);

export function persisted<T>(name: string, options?: Partial<PersistOptions<T, T>>) {
  return (config: Parameters<typeof persist<T>>[0]) =>
    persist(config, { name: `haven.${name}`, storage, version: 1, ...options } as PersistOptions<T, T>);
}

/** Small id helper – stable enough for local demo records. */
export function localId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
