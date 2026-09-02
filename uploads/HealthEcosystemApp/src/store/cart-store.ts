import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Meal } from '@/domain';

export type CartLine = {
  mealId: string;
  name: string;
  imageUrl: string;
  kitchen: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
};

export type CartTotals = { calories: number; protein: number; carbs: number; fat: number; items: number };

type CartState = {
  lines: CartLine[];
  add: (meal: Meal, kitchen: string) => void;
  decrease: (mealId: string) => void;
  remove: (mealId: string) => void;
  clear: () => void;
};

/** Order basket. Quantities and macros only – the product shows no prices. */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],

      add: (meal, kitchen) => {
        const existing = get().lines.find((line) => line.mealId === meal.id);
        if (existing) {
          set({ lines: get().lines.map((line) => (line.mealId === meal.id ? { ...line, quantity: line.quantity + 1 } : line)) });
          return;
        }
        set({
          lines: [
            ...get().lines,
            {
              mealId: meal.id,
              name: meal.name,
              imageUrl: meal.imageUrl,
              kitchen,
              calories: meal.nutrition.calories,
              protein: meal.nutrition.proteinGrams,
              carbs: meal.nutrition.carbsGrams,
              fat: meal.nutrition.fatGrams,
              quantity: 1,
            },
          ],
        });
      },

      decrease: (mealId) =>
        set({
          lines: get()
            .lines.map((line) => (line.mealId === mealId ? { ...line, quantity: line.quantity - 1 } : line))
            .filter((line) => line.quantity > 0),
        }),

      remove: (mealId) => set({ lines: get().lines.filter((line) => line.mealId !== mealId) }),

      clear: () => set({ lines: [] }),
    }),
    { name: 'haven.cart', storage: createJSONStorage(() => AsyncStorage), version: 1 },
  ),
);

export function cartTotals(lines: CartLine[]): CartTotals {
  return lines.reduce<CartTotals>(
    (sum, line) => ({
      calories: sum.calories + line.calories * line.quantity,
      protein: sum.protein + line.protein * line.quantity,
      carbs: sum.carbs + line.carbs * line.quantity,
      fat: sum.fat + line.fat * line.quantity,
      items: sum.items + line.quantity,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, items: 0 },
  );
}

export const selectCartCount = (state: CartState) => state.lines.reduce((sum, line) => sum + line.quantity, 0);
