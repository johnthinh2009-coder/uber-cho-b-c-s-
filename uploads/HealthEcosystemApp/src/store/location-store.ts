import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type DeliveryAddress = {
  /** Short label shown in the header, e.g. "Nguyễn Tất Thành". */
  label: string;
  /** Full line shown underneath. */
  line: string;
  source: 'current' | 'manual' | 'saved';
};

type LocationState = {
  hydrated: boolean;
  address: DeliveryAddress | null;
  setHydrated: () => void;
  setAddress: (address: DeliveryAddress) => void;
  clear: () => void;
};

/**
 * Delivery address for the food module.
 *
 * Device geolocation is deliberately NOT used: `expo-location` needs native
 * permissions that do not exist in the web preview, so "use my current
 * location" resolves to a fixed demo address instead of crashing the page.
 */
export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      hydrated: false,
      address: null,
      setHydrated: () => set({ hydrated: true }),
      setAddress: (address) => set({ address }),
      clear: () => set({ address: null }),
    }),
    {
      name: 'haven.location',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      partialize: (state) => ({ address: state.address }) as LocationState,
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);

/** What "Dùng vị trí hiện tại" resolves to in the demo. */
export const CURRENT_LOCATION: DeliveryAddress = {
  label: 'Nguyễn Tất Thành',
  line: 'Nguyễn Tất Thành, TP. Quy Nhơn, Gia Lai',
  source: 'current',
};

/** Mock suggestions for the manual address search. */
export const ADDRESS_SUGGESTIONS: DeliveryAddress[] = [
  { label: 'Nguyễn Tất Thành', line: 'Nguyễn Tất Thành, TP. Quy Nhơn, Gia Lai', source: 'manual' },
  { label: 'Huỳnh Mẫn Đạt', line: '22 Huỳnh Mẫn Đạt, P. Hải Cảng, TP. Quy Nhơn', source: 'manual' },
  { label: 'Nguyễn Đình Chiểu', line: '128/4 Nguyễn Đình Chiểu, P. Võ Thị Sáu, Quận 3, TP.HCM', source: 'manual' },
  { label: 'Phan Xích Long', line: '45 Phan Xích Long, Phường 2, Phú Nhuận, TP.HCM', source: 'manual' },
  { label: 'An Dương Vương', line: '160 An Dương Vương, P. Nguyễn Văn Cừ, TP. Quy Nhơn', source: 'manual' },
  { label: 'Lê Duẩn', line: '02 Lê Duẩn, P. Bến Nghé, Quận 1, TP.HCM', source: 'manual' },
];
