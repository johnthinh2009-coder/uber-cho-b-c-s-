import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Relationship } from '@/domain';
import { IMAGES } from '@/mocks/images';

import { localId } from './persist';

export type FamilyGender = 'female' | 'male' | 'other';

export type FamilyPerson = {
  id: string;
  fullName: string;
  relationship: Relationship;
  dateOfBirth: string;
  gender: FamilyGender;
  avatarUrl?: string;
  /** Short line shown on the family list, e.g. what needs attention. */
  note?: string;
};

export type FamilyInput = Omit<FamilyPerson, 'id'>;

type FamilyState = {
  members: FamilyPerson[];
  add: (input: FamilyInput) => FamilyPerson;
  update: (id: string, patch: Partial<FamilyInput>) => void;
  remove: (id: string) => void;
};

const SEED: FamilyPerson[] = [
  {
    id: 'fam-gia-han',
    fullName: 'Trần Gia Hân',
    relationship: 'partner',
    dateOfBirth: '1993-02-18',
    gender: 'female',
    avatarUrl: IMAGES.people.giaHan,
    note: 'Có buổi tập tối nay',
  },
  {
    id: 'fam-hoang-nam',
    fullName: 'Nguyễn Hoàng Nam',
    relationship: 'child',
    dateOfBirth: '2019-06-03',
    gender: 'male',
    avatarUrl: IMAGES.people.hoangNam,
    note: 'Khám nhi vào thứ sáu',
  },
  {
    id: 'fam-ba-lan',
    fullName: 'Lê Thị Lan',
    relationship: 'parent',
    dateOfBirth: '1954-11-27',
    gender: 'female',
    avatarUrl: IMAGES.people.baLan,
    note: 'Đến hạn kiểm tra huyết áp',
  },
];

export const useFamilyStore = create<FamilyState>()(
  persist(
    (set, get) => ({
      members: SEED,

      add: (input) => {
        const member: FamilyPerson = { ...input, id: localId('fam') };
        set({ members: [...get().members, member] });
        return member;
      },

      update: (id, patch) =>
        set({ members: get().members.map((member) => (member.id === id ? { ...member, ...patch } : member)) }),

      remove: (id) => set({ members: get().members.filter((member) => member.id !== id) }),
    }),
    { name: 'haven.family', storage: createJSONStorage(() => AsyncStorage), version: 1 },
  ),
);
