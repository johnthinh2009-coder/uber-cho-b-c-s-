import { create } from 'zustand';

import type { PatientProfile, ProviderProfile } from '@/domain';
import { PATIENT, PROVIDER } from '@/mocks/people';

export type AppRole = 'patient' | 'provider';

type SessionState = {
  /**
   * DEVELOPMENT ONLY.
   * The demo role switch swaps between the patient account (Nguyễn Minh Anh)
   * and the provider account (BS. Nguyễn Thu Hà, a doctor). This is not
   * authentication and must be replaced by real sign-in before production.
   */
  role: AppRole;
  patient: PatientProfile;
  provider: ProviderProfile;
  providerOnline: boolean;
  setRole: (role: AppRole) => void;
  setProviderOnline: (online: boolean) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  role: 'patient',
  patient: PATIENT,
  provider: PROVIDER,
  providerOnline: true,
  setRole: (role) => set({ role }),
  setProviderOnline: (providerOnline) => set({ providerOnline }),
}));

export const useRole = () => useSessionStore((s) => s.role);
export const usePatient = () => useSessionStore((s) => s.patient);
export const useProvider = () => useSessionStore((s) => s.provider);
