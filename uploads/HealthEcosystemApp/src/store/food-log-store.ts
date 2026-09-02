import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Meal } from '@/domain';
import { todayKey } from '@/utils/date';

import { localId } from './persist';

export type FoodLogEntry = {
  id: string;
  mealId: string;
  name: string;
  kitchen: string;
  imageUrl: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  /** Local date key "YYYY-MM-DD". */
  date: string;
  at: string;
};

export type NutritionTotals = { calories: number; protein: number; carbs: number; fat: number; count: number };

type FoodLogState = {
  entries: FoodLogEntry[];
  add: (meal: Meal, kitchen: string) => FoodLogEntry;
  remove: (id: string) => void;
  clearDay: (date: string) => void;
};

export const useFoodLogStore = create<FoodLogState>()(
  persist(
    (set, get) => ({
      entries: [],

      add: (meal, kitchen) => {
        const entry: FoodLogEntry = {
          id: localId('log'),
          mealId: meal.id,
          name: meal.name,
          kitchen,
          imageUrl: meal.imageUrl,
          calories: meal.nutrition.calories,
          protein: meal.nutrition.proteinGrams,
          carbs: meal.nutrition.carbsGrams,
          fat: meal.nutrition.fatGrams,
          date: todayKey(),
          at: new Date().toISOString(),
        };
        set({ entries: [entry, ...get().entries] });
        return entry;
      },

      remove: (id) => set({ entries: get().entries.filter((entry) => entry.id !== id) }),
      clearDay: (date) => set({ entries: get().entries.filter((entry) => entry.date !== date) }),
    }),
    { name: 'haven.foodlog', storage: createJSONStorage(() => AsyncStorage), version: 1 },
  ),
);

/** Totals for a day – used by Home, Activity and the food log screen. */
export function totalsFor(entries: FoodLogEntry[], date: string): NutritionTotals {
  return entries
    .filter((entry) => entry.date === date)
    .reduce<NutritionTotals>(
      (sum, entry) => ({
        calories: sum.calories + entry.calories,
        protein: sum.protein + entry.protein,
        carbs: sum.carbs + entry.carbs,
        fat: sum.fat + entry.fat,
        count: sum.count + 1,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 },
    );
}
