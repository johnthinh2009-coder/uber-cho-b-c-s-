import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { localId } from './persist';

export type CardBrand = 'Visa' | 'Mastercard' | 'JCB' | 'Momo' | 'ZaloPay';

export type PaymentCard = {
  id: string;
  brand: CardBrand;
  last4: string;
  expiry: string;
  isDefault: boolean;
};

type WalletState = {
  cards: PaymentCard[];
  add: (card: Omit<PaymentCard, 'id' | 'isDefault'>) => void;
  remove: (id: string) => void;
  setDefault: (id: string) => void;
};

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      cards: [
        { id: 'card-visa', brand: 'Visa', last4: '4242', expiry: '09/28', isDefault: true },
        { id: 'card-momo', brand: 'Momo', last4: '8117', expiry: '—', isDefault: false },
      ],

      add: (card) =>
        set({ cards: [...get().cards, { ...card, id: localId('card'), isDefault: get().cards.length === 0 }] }),

      remove: (id) => {
        const remaining = get().cards.filter((card) => card.id !== id);
        if (remaining.length > 0 && !remaining.some((card) => card.isDefault)) remaining[0]!.isDefault = true;
        set({ cards: remaining });
      },

      setDefault: (id) => set({ cards: get().cards.map((card) => ({ ...card, isDefault: card.id === id })) }),
    }),
    { name: 'haven.wallet', storage: createJSONStorage(() => AsyncStorage), version: 1 },
  ),
);
