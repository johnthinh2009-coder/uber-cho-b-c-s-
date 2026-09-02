import type { CartItem, FoodContractor, FoodOrder, Meal, MealCategory } from '@/domain';
import { computeSettlement } from '@/domain';
import { CONTRACTORS, CONTRACTORS_BY_ID, MEAL_CATEGORIES, MEALS, MEALS_BY_ID } from '@/mocks/food';
import { FOOD_ORDERS } from '@/mocks/orders';
import { formatTime } from '@/utils/date';

import type { FoodRepository, MealFilter } from '../repositories';
import { clone, delay, nextId } from './utils';

export class MockFoodRepository implements FoodRepository {
  private orders: FoodOrder[] = clone(FOOD_ORDERS);

  async categories(): Promise<MealCategory[]> {
    await delay(200);
    return MEAL_CATEGORIES;
  }

  async meals(filter: MealFilter = {}): Promise<Meal[]> {
    await delay(filter.query ? 250 : 400);
    const q = filter.query?.trim().toLowerCase();
    return MEALS.filter((meal) => {
      if (filter.categoryId && !meal.categoryIds.includes(filter.categoryId)) return false;
      if (filter.contractorId && meal.contractorId !== filter.contractorId) return false;
      if (filter.dietary?.length && !filter.dietary.every((label) => meal.dietary.includes(label))) return false;
      if (filter.maxCalories && meal.nutrition.calories > filter.maxCalories) return false;
      if (q) {
        const contractor = CONTRACTORS_BY_ID[meal.contractorId];
        const haystack = [meal.name, meal.description, contractor?.name ?? '', ...meal.ingredients, ...meal.dietary]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }

  async getMeal(id: string): Promise<Meal | undefined> {
    await delay(150);
    return MEALS_BY_ID[id];
  }

  async contractors(): Promise<FoodContractor[]> {
    await delay(250);
    return CONTRACTORS;
  }

  async getContractor(id: string): Promise<FoodContractor | undefined> {
    await delay(150);
    return CONTRACTORS_BY_ID[id];
  }

  async placeOrder(items: CartItem[], addressLabel: string): Promise<FoodOrder> {
    await delay(900);
    const meals = items.map((item) => ({ item, meal: MEALS_BY_ID[item.mealId] })).filter((x) => x.meal);
    const contractorId = meals[0]?.meal?.contractorId ?? CONTRACTORS[0]!.id;
    const contractor = CONTRACTORS_BY_ID[contractorId] ?? CONTRACTORS[0]!;
    const subtotal = Math.round(meals.reduce((sum, { item, meal }) => sum + (meal?.price ?? 0) * item.quantity, 0) * 100) / 100;
    const deliveryFee = subtotal >= 150_000 ? 0 : contractor.deliveryFee;
    const [minEta, maxEta] = contractor.deliveryMinutes;
    const order: FoodOrder = {
      id: nextId('order'),
      contractorId,
      items: meals.map(({ item, meal }) => ({ mealId: item.mealId, name: meal!.name, quantity: item.quantity, unitPrice: meal!.price })),
      subtotal,
      deliveryFee,
      total: Math.round((subtotal + deliveryFee) * 100) / 100,
      status: 'placed',
      placedAt: new Date().toISOString(),
      etaLabel: `Giao khoảng ${formatTime(new Date(Date.now() + minEta * 60_000))} – ${formatTime(new Date(Date.now() + maxEta * 60_000))}`,
      addressLabel,
      settlement: computeSettlement(subtotal, contractor.commissionRate, 'VND'),
    };
    this.orders = [order, ...this.orders];
    return clone(order);
  }

  async listOrders(): Promise<FoodOrder[]> {
    await delay(250);
    return clone(this.orders);
  }

  async getOrder(id: string): Promise<FoodOrder | undefined> {
    await delay(150);
    const order = this.orders.find((o) => o.id === id);
    return order ? clone(order) : undefined;
  }
}
