import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/** Who is using the app. Customers are never called "patients" outside a care encounter. */
export type AppRole = 'customer' | 'provider';

export type Gender = 'female' | 'male' | 'other';

export type CustomerAccount = {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: Gender;
  avatarUrl?: string;
};

export type ProviderApplication = {
  fullName: string;
  email: string;
  phone: string;
  /** Mock uploads – we only record that a file was picked, never a real document. */
  idFrontUploaded: boolean;
  idBackUploaded: boolean;
  licenseUploaded: boolean;
  licenseNumber: string;
  role: string;
  specialties: string[];
  yearsOfExperience: string;
  areas: string[];
};

export type ProviderStatus = 'none' | 'pending' | 'approved';

type AuthState = {
  hydrated: boolean;
  role: AppRole | null;
  /** Signed in with an account. */
  signedIn: boolean;
  /** Browsing without an account – public content only. */
  guest: boolean;
  customer: CustomerAccount | null;
  application: ProviderApplication | null;
  providerStatus: ProviderStatus;

  setHydrated: () => void;
  chooseRole: (role: AppRole) => void;
  signUpCustomer: (account: CustomerAccount) => void;
  signInCustomer: (identifier: string) => void;
  continueAsGuest: () => void;
  updateCustomer: (patch: Partial<CustomerAccount>) => void;
  submitApplication: (application: ProviderApplication) => void;
  /** Mock review outcome, triggered from the pending screen. */
  approveApplication: () => void;
  signOut: () => void;
};

export const DEMO_CUSTOMER: CustomerAccount = {
  fullName: 'Nguyễn Minh Anh',
  email: 'minhanh.nguyen@example.com',
  phone: '0903 482 117',
  dateOfBirth: '1990-04-12',
  gender: 'male',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      role: null,
      signedIn: false,
      guest: false,
      customer: null,
      application: null,
      providerStatus: 'none',

      setHydrated: () => set({ hydrated: true }),

      chooseRole: (role) => set({ role }),

      signUpCustomer: (account) => set({ role: 'customer', customer: account, signedIn: true, guest: false }),

      /** Demo sign-in: any known identifier signs the demo account in. */
      signInCustomer: (identifier) =>
        set({
          role: 'customer',
          signedIn: true,
          guest: false,
          customer:
            get().customer ??
            { ...DEMO_CUSTOMER, ...(identifier.includes('@') ? { email: identifier } : { phone: identifier }) },
        }),

      continueAsGuest: () => set({ role: 'customer', guest: true, signedIn: false }),

      updateCustomer: (patch) => set({ customer: { ...(get().customer ?? DEMO_CUSTOMER), ...patch } }),

      submitApplication: (application) =>
        set({ role: 'provider', application, providerStatus: 'pending', signedIn: true, guest: false }),

      approveApplication: () => set({ providerStatus: 'approved' }),

      signOut: () =>
        set({ role: null, signedIn: false, guest: false, customer: null, application: null, providerStatus: 'none' }),
    }),
    {
      name: 'haven.auth',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      partialize: (state) => ({
        role: state.role,
        signedIn: state.signedIn,
        guest: state.guest,
        customer: state.customer,
        application: state.application,
        providerStatus: state.providerStatus,
      }) as AuthState,
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);

export const useCustomer = () => useAuthStore((s) => s.customer);
