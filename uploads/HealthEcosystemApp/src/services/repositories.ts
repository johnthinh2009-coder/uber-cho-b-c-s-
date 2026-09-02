import type {
  ActivityItem,
  AdherenceDay,
  Appointment,
  CareRequest,
  Conversation,
  CareServiceType,
  Provider,
  ProviderMatch,
  DoseStatus,
  FamilyMember,
  FoodContractor,
  FoodOrder,
  HealthQuestionnaire,
  Meal,
  MealCategory,
  MealCategoryId,
  Medication,
  MedicationDose,
  Message,
  PaymentMethod,
  Plan,
  PlanBenefit,
  PlanId,
  BillingCycle,
  Prescription,
  Program,
  ProviderRequestCard,
  ScheduledWorkout,
  Subscription,
  VisitSummary,
  WorkoutCategory,
  WorkoutCategoryId,
  DietaryLabel,
  CartItem,
  Relationship,
} from '@/domain';

/**
 * Repository contracts.
 *
 * Screens and stores only ever talk to these interfaces. The demo ships with
 * in-memory mock implementations; production implementations can be swapped
 * in via `services/index.ts` without touching UI code.
 */

export interface ProviderRepository {
  list(): Promise<Provider[]>;
  getById(id: string): Promise<Provider | undefined>;
  nearby(limit?: number): Promise<Provider[]>;
  /** Providers who deliver a given patient-facing service. */
  byService(serviceType: CareServiceType): Promise<Provider[]>;
  match(questionnaire: HealthQuestionnaire, patientAge?: number): Promise<ProviderMatch[]>;
  search(query: string): Promise<Provider[]>;
}

export type CreateCareRequestInput = {
  patient: FamilyMember;
  questionnaire: HealthQuestionnaire;
  providerId: string;
};

export interface CareRequestRepository {
  create(input: CreateCareRequestInput): Promise<CareRequest>;
  getById(id: string): Promise<CareRequest | undefined>;
  listForPatient(): Promise<CareRequest[]>;
  /** Moves the request one step forward in the state machine. */
  advance(id: string): Promise<CareRequest>;
  cancel(id: string): Promise<CareRequest>;
  rate(id: string, rating: number): Promise<CareRequest>;
  listAppointments(): Promise<Appointment[]>;
  // Provider side
  listOpenRequests(): Promise<ProviderRequestCard[]>;
  getProviderRequest(id: string): Promise<CareRequest | undefined>;
  accept(id: string, providerId: string): Promise<CareRequest>;
  completeWithSummary(id: string, summary: Omit<VisitSummary, 'id' | 'careRequestId' | 'writtenAt'>): Promise<CareRequest>;
}

export type MealFilter = {
  query?: string;
  categoryId?: MealCategoryId;
  dietary?: DietaryLabel[];
  contractorId?: string;
  maxCalories?: number;
};

export interface FoodRepository {
  categories(): Promise<MealCategory[]>;
  meals(filter?: MealFilter): Promise<Meal[]>;
  getMeal(id: string): Promise<Meal | undefined>;
  contractors(): Promise<FoodContractor[]>;
  getContractor(id: string): Promise<FoodContractor | undefined>;
  placeOrder(items: CartItem[], addressLabel: string): Promise<FoodOrder>;
  listOrders(): Promise<FoodOrder[]>;
  getOrder(id: string): Promise<FoodOrder | undefined>;
}

export interface MedicationRepository {
  list(): Promise<Medication[]>;
  add(medication: Omit<Medication, 'id'>): Promise<Medication>;
  update(id: string, patch: Partial<Medication>): Promise<Medication>;
  dosesForDate(date: string): Promise<MedicationDose[]>;
  setDoseStatus(id: string, status: DoseStatus, snoozedUntil?: string): Promise<MedicationDose>;
  adherence(): Promise<AdherenceDay[]>;
  prescriptions(): Promise<Prescription[]>;
  getPrescription(id: string): Promise<Prescription | undefined>;
  issuePrescription(prescription: Omit<Prescription, 'id' | 'issuedAt' | 'status'>): Promise<Prescription>;
  addPrescriptionToSchedule(id: string): Promise<{ prescription: Prescription; medications: Medication[] }>;
}

export type ProgramFilter = {
  query?: string;
  categoryId?: WorkoutCategoryId;
};

export interface FitnessRepository {
  categories(): Promise<WorkoutCategory[]>;
  programs(filter?: ProgramFilter): Promise<Program[]>;
  getProgram(id: string): Promise<Program | undefined>;
  scheduled(): Promise<ScheduledWorkout[]>;
  schedule(programId: string, date: string, time: string): Promise<ScheduledWorkout>;
  markScheduledComplete(programId: string): Promise<void>;
}

export interface PlanRepository {
  plans(): Promise<Plan[]>;
  benefits(): Promise<PlanBenefit[]>;
  subscription(): Promise<Subscription>;
  subscribe(planId: PlanId, billing: BillingCycle): Promise<Subscription>;
  paymentMethods(): Promise<PaymentMethod[]>;
  members(): Promise<FamilyMember[]>;
  addMember(member: { firstName: string; lastName: string; relationship: Relationship; dateOfBirth: string }): Promise<FamilyMember>;
  removeMember(id: string): Promise<void>;
}

export interface MessageRepository {
  conversations(role: 'patient' | 'provider'): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | undefined>;
  send(conversationId: string, senderId: string, text: string): Promise<Message>;
  markRead(conversationId: string): Promise<void>;
}

export interface ActivityRepository {
  list(): Promise<ActivityItem[]>;
  add(item: Omit<ActivityItem, 'id'>): Promise<ActivityItem>;
}

export type SearchResults = {
  providers: Provider[];
  meals: Meal[];
  programs: Program[];
  services: { id: string; title: string; subtitle: string; href: string; pillar: 'care' | 'food' | 'medication' | 'fitness' | 'family' }[];
};

export interface SearchRepository {
  search(query: string): Promise<SearchResults>;
}
