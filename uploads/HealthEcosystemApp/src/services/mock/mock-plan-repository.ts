import type { BillingCycle, FamilyMember, PaymentMethod, Plan, PlanBenefit, PlanId, Relationship, Subscription } from '@/domain';
import { IMAGES } from '@/mocks/images';
import { FAMILY_MEMBERS } from '@/mocks/people';
import { PAYMENT_METHODS, PLAN_BENEFITS, PLANS, SUBSCRIPTION } from '@/mocks/plans';
import { atDayOffset } from '@/utils/date';

import type { PlanRepository } from '../repositories';
import { clone, delay, nextId } from './utils';

const fallbackAvatars = [IMAGES.people.patient2, IMAGES.people.patient5, IMAGES.people.patient7, IMAGES.people.reviewer3];

export class MockPlanRepository implements PlanRepository {
  private subscriptionState: Subscription = clone(SUBSCRIPTION);
  private membersState: FamilyMember[] = clone(FAMILY_MEMBERS);

  async plans(): Promise<Plan[]> {
    await delay(250);
    return PLANS;
  }

  async benefits(): Promise<PlanBenefit[]> {
    await delay(150);
    return PLAN_BENEFITS;
  }

  async subscription(): Promise<Subscription> {
    await delay(200);
    return clone(this.subscriptionState);
  }

  async subscribe(planId: PlanId, billing: BillingCycle): Promise<Subscription> {
    await delay(1200);
    this.subscriptionState = {
      planId,
      billing,
      status: 'active',
      startedAt: new Date().toISOString(),
      renewsAt: atDayOffset(billing === 'annual' ? 365 : 30, '09:00'),
      memberIds: planId === 'family' ? this.membersState.map((m) => m.id) : [this.membersState[0]!.id],
    };
    return clone(this.subscriptionState);
  }

  async paymentMethods(): Promise<PaymentMethod[]> {
    await delay(150);
    return PAYMENT_METHODS;
  }

  async members(): Promise<FamilyMember[]> {
    await delay(200);
    return clone(this.membersState);
  }

  async addMember(member: {
    firstName: string;
    lastName: string;
    relationship: Relationship;
    dateOfBirth: string;
  }): Promise<FamilyMember> {
    await delay(500);
    const created: FamilyMember = {
      id: nextId('person'),
      firstName: member.firstName,
      lastName: member.lastName,
      relationship: member.relationship,
      dateOfBirth: member.dateOfBirth,
      avatarUrl: fallbackAvatars[this.membersState.length % fallbackAvatars.length]!,
      statusLine: 'Chưa có hoạt động',
      sharedConditions: [],
      allergies: [],
    };
    this.membersState = [...this.membersState, created];
    this.subscriptionState.memberIds = [...this.subscriptionState.memberIds, created.id];
    return clone(created);
  }

  async removeMember(id: string): Promise<void> {
    await delay(300);
    this.membersState = this.membersState.filter((m) => m.id !== id);
    this.subscriptionState.memberIds = this.subscriptionState.memberIds.filter((m) => m !== id);
  }
}
