import { tLabel } from '@/i18n';

import type { Id, ISODateString, Rating, Settlement } from './common';

export type DietaryLabel =
  | 'High Protein'
  | 'Low Calorie'
  | 'Balanced'
  | 'Vegetarian'
  | 'Vegan'
  | 'Gluten Free'
  | 'Low Carb'
  | 'High Fibre'
  | 'Dairy Free';

export const dietaryLabels: DietaryLabel[] = [
  'High Protein',
  'Low Calorie',
  'Balanced',
  'Vegetarian',
  'Vegan',
  'Gluten Free',
  'Low Carb',
  'High Fibre',
  'Dairy Free',
];

export type MealCategoryId =
  | 'high_protein'
  | 'low_calorie'
  | 'balanced'
  | 'vegetarian'
  | 'vegan'
  | 'gluten_free'
  | 'low_carb'
  | 'high_fibre';

export type MealCategory = {
  id: MealCategoryId;
  label: DietaryLabel;
  imageUrl: string;
  description: string;
};

export type Allergen = 'Nuts' | 'Dairy' | 'Eggs' | 'Fish' | 'Shellfish' | 'Soy' | 'Gluten' | 'Sesame';

/** Localised dietary label, e.g. 'High Protein' → 'Giàu protein'. */
export function dietaryLabel(label: DietaryLabel): string {
  return tLabel('labels.dietary', label);
}

export function allergenLabel(allergen: Allergen): string {
  return tLabel('labels.allergen', allergen);
}

export type Nutrition = {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fibreGrams?: number;
};

export type FoodContractor = {
  id: Id;
  name: string;
  heroUrl: string;
  logoUrl: string;
  tagline: string;
  rating: Rating;
  deliveryMinutes: [number, number];
  deliveryFee: number;
  distanceKm: number;
  /** Internal commission rate for settlement – never shown to customers. */
  commissionRate: number;
  tags: DietaryLabel[];
};

export type Meal = {
  id: Id;
  name: string;
  contractorId: Id;
  imageUrl: string;
  price: number;
  nutrition: Nutrition;
  portion: string;
  ingredients: string[];
  allergens: Allergen[];
  dietary: DietaryLabel[];
  categoryIds: MealCategoryId[];
  prepMinutes: number;
  rating: Rating;
  description: string;
  /** Shown as "Popular" / "New" etc. – purely presentational. */
  badge?: string;
};

export type CartItem = {
  mealId: Id;
  quantity: number;
  note?: string;
};

export type FoodOrderStatus = 'placed' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';

/** Localised label for `FoodOrderStatus` values. */
export function foodOrderStatusLabel(value: FoodOrderStatus): string {
  return tLabel('labels.foodOrderStatus', value);
}

export type FoodOrder = {
  id: Id;
  contractorId: Id;
  items: { mealId: Id; name: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: FoodOrderStatus;
  placedAt: ISODateString;
  etaLabel: string;
  addressLabel: string;
  /** Internal – per-order settlement with the contractor. */
  settlement: Settlement;
};
