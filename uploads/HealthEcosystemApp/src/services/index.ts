import { MockActivityRepository } from './mock/mock-activity-repository';
import { MockCareRequestRepository } from './mock/mock-care-repository';
import { MockFitnessRepository } from './mock/mock-fitness-repository';
import { MockFoodRepository } from './mock/mock-food-repository';
import { MockMedicationRepository } from './mock/mock-medication-repository';
import { MockMessageRepository } from './mock/mock-message-repository';
import { MockPlanRepository } from './mock/mock-plan-repository';
import { MockProviderRepository } from './mock/mock-provider-repository';
import { MockSearchRepository } from './mock/mock-search-repository';

/**
 * Service container.
 *
 * This is the single place where concrete repository implementations are
 * chosen. Swap the mock classes for API-backed ones when a backend exists.
 */
export const services = {
  providers: new MockProviderRepository(),
  care: new MockCareRequestRepository(),
  food: new MockFoodRepository(),
  medication: new MockMedicationRepository(),
  fitness: new MockFitnessRepository(),
  plans: new MockPlanRepository(),
  messages: new MockMessageRepository(),
  activity: new MockActivityRepository(),
  search: new MockSearchRepository(),
};

export type Services = typeof services;

export type {
  ActivityRepository,
  CareRequestRepository,
  CreateCareRequestInput,
  FitnessRepository,
  FoodRepository,
  MealFilter,
  MedicationRepository,
  MessageRepository,
  PlanRepository,
  ProgramFilter,
  ProviderRepository,
  SearchRepository,
  SearchResults,
} from './repositories';
