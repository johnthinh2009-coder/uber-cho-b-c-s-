import { create } from 'zustand';

import type { Appointment, AsyncStatus, CareRequest, CareServiceType, FamilyMember, HealthQuestionnaire, ProviderMatch } from '@/domain';
import { isActiveCareStatus } from '@/domain';
import { ageFromDateOfBirth } from '@/domain/people';
import { providerDisplayName } from '@/domain/provider';
import { HOME_ADDRESS } from '@/mocks/people';
import { PROVIDERS_BY_ID } from '@/mocks/providers';
import { services } from '@/services';

import { useActivityStore } from './activity-store';

export const emptyQuestionnaire: HealthQuestionnaire = {
  serviceType: 'home_doctor',
  mainConcern: '',
  category: 'general',
  bodyArea: 'not_sure',
  duration: 'few_days',
  severity: 'mild',
  existingConditions: [],
  mobility: 'fully_mobile',
  preferredTime: 'asap',
  addressId: HOME_ADDRESS.id,
  language: 'Tiếng Việt',
  notes: '',
};

type CareState = {
  status: AsyncStatus;
  appointments: Appointment[];
  requests: CareRequest[];
  /** Draft being built by the request flow. */
  draftPatient: FamilyMember | null;
  draftQuestionnaire: HealthQuestionnaire;
  matches: ProviderMatch[];
  matchStatus: AsyncStatus;
  load: () => Promise<void>;
  setDraftPatient: (patient: FamilyMember) => void;
  setDraftService: (serviceType: CareServiceType) => void;
  updateDraft: (patch: Partial<HealthQuestionnaire>) => void;
  resetDraft: () => void;
  runMatching: () => Promise<void>;
  submitRequest: (providerId: string) => Promise<CareRequest>;
  advance: (id: string) => Promise<CareRequest | undefined>;
  cancel: (id: string) => Promise<void>;
  rate: (id: string, rating: number) => Promise<void>;
};

export const useCareStore = create<CareState>((set, get) => ({
  status: 'idle',
  appointments: [],
  requests: [],
  draftPatient: null,
  draftQuestionnaire: emptyQuestionnaire,
  matches: [],
  matchStatus: 'idle',

  load: async () => {
    if (get().status === 'loading') return;
    set({ status: 'loading' });
    try {
      const [appointments, requests] = await Promise.all([services.care.listAppointments(), services.care.listForPatient()]);
      set({ appointments, requests, status: 'success' });
    } catch {
      set({ status: 'error' });
    }
  },

  setDraftPatient: (draftPatient) => set({ draftPatient }),
  setDraftService: (serviceType) => set((s) => ({ draftQuestionnaire: { ...s.draftQuestionnaire, serviceType } })),
  updateDraft: (patch) => set((s) => ({ draftQuestionnaire: { ...s.draftQuestionnaire, ...patch } })),
  resetDraft: () => set({ draftPatient: null, draftQuestionnaire: emptyQuestionnaire, matches: [], matchStatus: 'idle' }),

  runMatching: async () => {
    const { draftQuestionnaire, draftPatient } = get();
    set({ matchStatus: 'loading', matches: [] });
    try {
      const age = draftPatient ? ageFromDateOfBirth(draftPatient.dateOfBirth) : undefined;
      const matches = await services.providers.match(draftQuestionnaire, age);
      set({ matches, matchStatus: 'success' });
    } catch {
      set({ matchStatus: 'error' });
    }
  },

  submitRequest: async (providerId) => {
    const { draftPatient, draftQuestionnaire } = get();
    if (!draftPatient) throw new Error('Hãy chọn người cần khám trước');
    const request = await services.care.create({ patient: draftPatient, questionnaire: draftQuestionnaire, providerId });
    set((s) => ({ requests: [request, ...s.requests] }));
    const provider = PROVIDERS_BY_ID[providerId];
    await useActivityStore.getState().add({
      pillar: 'care',
      kind: 'doctor_booking',
      title: `Đã đặt ${provider ? providerDisplayName(provider) : 'chuyên gia y tế'}`,
      subtitle: `Khám tại nhà cho ${request.patient.name}`,
      at: request.createdAt,
      status: 'in_progress',
      amount: request.price,
      imageUrl: provider?.portraitUrl,
      href: `/care/visit/${request.id}`,
    });
    return request;
  },

  advance: async (id) => {
    const updated = await services.care.advance(id);
    set((s) => ({ requests: s.requests.map((r) => (r.id === id ? updated : r)) }));
    if (updated.status === 'MATCHED' || updated.status === 'VISIT_COMPLETED') {
      const appointments = await services.care.listAppointments();
      set({ appointments });
    }
    if (updated.status === 'VISIT_COMPLETED') {
      const provider = PROVIDERS_BY_ID[updated.providerId ?? ''];
      await useActivityStore.getState().add({
        pillar: 'care',
        kind: 'visit_completed',
        title: `Khám tại nhà với ${provider ? providerDisplayName(provider) : 'chuyên gia y tế'}`,
        subtitle: `${updated.patient.name} · Đã có tóm tắt buổi khám`,
        at: new Date().toISOString(),
        status: 'done',
        amount: updated.price,
        imageUrl: provider?.portraitUrl,
        href: `/care/visit/${updated.id}/summary`,
      });
    }
    return updated;
  },

  cancel: async (id) => {
    const updated = await services.care.cancel(id);
    set((s) => ({ requests: s.requests.map((r) => (r.id === id ? updated : r)) }));
    const appointments = await services.care.listAppointments();
    set({ appointments });
  },

  rate: async (id, rating) => {
    const updated = await services.care.rate(id, rating);
    set((s) => ({ requests: s.requests.map((r) => (r.id === id ? updated : r)) }));
  },
}));

export function selectActiveRequest(state: Pick<CareState, 'requests'>): CareRequest | undefined {
  return state.requests.find((r) => isActiveCareStatus(r.status));
}

export function selectUpcomingAppointments(state: Pick<CareState, 'appointments'>): Appointment[] {
  return state.appointments.filter((a) => a.status === 'upcoming').sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}
