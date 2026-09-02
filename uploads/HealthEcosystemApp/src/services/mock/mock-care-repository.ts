import type { Appointment, CareRequest, ProviderRequestCard, VisitSummary } from '@/domain';
import { computeSettlement, nextCareStatus } from '@/domain';
import { ageFromDateOfBirth, fullName } from '@/domain/people';
import { APPOINTMENTS, CARE_COMMISSION_RATE, PAST_CARE_REQUEST, PROVIDER_REQUESTS, PROVIDER_REQUEST_DETAILS } from '@/mocks/care';
import { HOME_ADDRESS, PATIENT } from '@/mocks/people';
import { PROVIDERS_BY_ID } from '@/mocks/providers';

import type { CareRequestRepository, CreateCareRequestInput } from '../repositories';
import { clone, delay, nextId } from './utils';

const etaByStatus: Partial<Record<CareRequest['status'], (base: number) => number | undefined>> = {
  MATCHED: (base) => base,
  DOCTOR_EN_ROUTE: (base) => Math.max(4, Math.round(base * 0.6)),
  DOCTOR_ARRIVED: () => 0,
  VISIT_IN_PROGRESS: () => undefined,
  VISIT_COMPLETED: () => undefined,
};

export class MockCareRequestRepository implements CareRequestRepository {
  private patientRequests: CareRequest[] = [clone(PAST_CARE_REQUEST)];
  private providerRequests: Record<string, CareRequest> = clone(PROVIDER_REQUEST_DETAILS);
  private openCards: ProviderRequestCard[] = clone(PROVIDER_REQUESTS);
  private appointments: Appointment[] = clone(APPOINTMENTS);

  async create(input: CreateCareRequestInput): Promise<CareRequest> {
    await delay(600);
    const provider = PROVIDERS_BY_ID[input.providerId];
    const price = provider?.visitPrice ?? 500_000;
    const address = PATIENT.addresses.find((a) => a.id === input.questionnaire.addressId) ?? HOME_ADDRESS;
    const now = new Date().toISOString();
    const request: CareRequest = {
      id: nextId('care'),
      patient: {
        id: input.patient.id,
        name: fullName(input.patient),
        avatarUrl: input.patient.avatarUrl,
        relationship: input.patient.relationship,
        age: ageFromDateOfBirth(input.patient.dateOfBirth),
      },
      requestedById: PATIENT.id,
      questionnaire: input.questionnaire,
      address,
      status: 'REQUESTED',
      providerId: input.providerId,
      createdAt: now,
      scheduledFor: new Date(Date.now() + (provider?.etaMinutes ?? 25) * 60_000).toISOString(),
      etaMinutes: provider?.etaMinutes ?? 25,
      price,
      settlement: computeSettlement(price, CARE_COMMISSION_RATE, 'VND'),
      timeline: [{ id: nextId('evt'), status: 'REQUESTED', at: now }],
    };
    this.patientRequests = [request, ...this.patientRequests];
    return clone(request);
  }

  async getById(id: string): Promise<CareRequest | undefined> {
    await delay(150);
    const found = this.patientRequests.find((r) => r.id === id) ?? this.providerRequests[id];
    return found ? clone(found) : undefined;
  }

  async listForPatient(): Promise<CareRequest[]> {
    await delay(250);
    return clone(this.patientRequests);
  }

  async advance(id: string): Promise<CareRequest> {
    await delay(300);
    const request = this.find(id);
    const next = nextCareStatus(request.status);
    if (!next) return clone(request);
    request.status = next;
    const baseEta = PROVIDERS_BY_ID[request.providerId ?? '']?.etaMinutes ?? 25;
    const etaFn = etaByStatus[next];
    request.etaMinutes = etaFn ? etaFn(baseEta) : request.etaMinutes;
    request.timeline.push({ id: nextId('evt'), status: next, at: new Date().toISOString() });
    if (next === 'VISIT_COMPLETED' && request.providerId) {
      this.appointments = this.appointments.map((a) =>
        a.careRequestId === id ? { ...a, status: 'completed' } : a,
      );
    }
    if (next === 'MATCHED' && request.providerId) {
      this.appointments = [
        {
          id: nextId('appt'),
          kind: 'home_visit',
          providerId: request.providerId,
          patientName: request.patient.name,
          patientAvatarUrl: request.patient.avatarUrl,
          startsAt: request.scheduledFor,
          durationMinutes: 40,
          status: 'upcoming',
          reason: request.questionnaire.mainConcern,
          addressLabel: `${request.address.label} · ${request.address.line1}`,
          careRequestId: request.id,
        },
        ...this.appointments,
      ];
    }
    return clone(request);
  }

  async cancel(id: string): Promise<CareRequest> {
    await delay(300);
    const request = this.find(id);
    request.status = 'CANCELLED';
    request.timeline.push({ id: nextId('evt'), status: 'CANCELLED', at: new Date().toISOString() });
    this.appointments = this.appointments.map((a) => (a.careRequestId === id ? { ...a, status: 'cancelled' } : a));
    return clone(request);
  }

  async rate(id: string, rating: number): Promise<CareRequest> {
    await delay(250);
    const request = this.find(id);
    request.patientRating = rating;
    return clone(request);
  }

  async listAppointments(): Promise<Appointment[]> {
    await delay(300);
    return clone(this.appointments).sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  }

  async listOpenRequests(): Promise<ProviderRequestCard[]> {
    await delay(400);
    return clone(this.openCards);
  }

  async getProviderRequest(id: string): Promise<CareRequest | undefined> {
    await delay(200);
    const request = this.providerRequests[id];
    return request ? clone(request) : undefined;
  }

  async accept(id: string, providerId: string): Promise<CareRequest> {
    await delay(500);
    const request = this.find(id);
    request.providerId = providerId;
    request.status = 'MATCHED';
    request.etaMinutes = this.openCards.find((c) => c.careRequestId === id)?.travelMinutes ?? 15;
    request.timeline.push(
      { id: nextId('evt'), status: 'SEARCHING', at: new Date().toISOString() },
      { id: nextId('evt'), status: 'MATCHED', at: new Date().toISOString() },
    );
    this.openCards = this.openCards.filter((c) => c.careRequestId !== id);
    return clone(request);
  }

  async completeWithSummary(
    id: string,
    summary: Omit<VisitSummary, 'id' | 'careRequestId' | 'writtenAt'>,
  ): Promise<CareRequest> {
    await delay(400);
    const request = this.find(id);
    request.summary = { ...summary, id: nextId('vs'), careRequestId: id, writtenAt: new Date().toISOString() };
    return clone(request);
  }

  private find(id: string): CareRequest {
    const request = this.patientRequests.find((r) => r.id === id) ?? this.providerRequests[id];
    if (!request) throw new Error(`Care request ${id} not found`);
    return request;
  }
}
