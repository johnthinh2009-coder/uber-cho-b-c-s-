import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { IMAGES } from '@/mocks/images';
import { atDayOffset } from '@/utils/date';

import { localId } from './persist';

export type ChatMessage = {
  id: string;
  from: 'me' | 'them';
  text: string;
  at: string;
};

export type Conversation = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  messages: ChatMessage[];
  unread: number;
};

type ChatState = {
  conversations: Conversation[];
  send: (conversationId: string, text: string) => void;
  markRead: (conversationId: string) => void;
};

const SEED: Conversation[] = [
  {
    id: 'conv-thu-ha',
    name: 'BS. Nguyễn Thu Hà',
    role: 'Bác sĩ đa khoa',
    avatarUrl: IMAGES.providers.thuHa,
    unread: 1,
    messages: [
      { id: 'm1', from: 'them', text: 'Chào bạn, buổi khám chiều nay mình sẽ đến lúc 15:00 nhé.', at: atDayOffset(0, '09:12') },
      { id: 'm2', from: 'me', text: 'Dạ vâng, em ở nhà cả chiều ạ.', at: atDayOffset(0, '09:20') },
      { id: 'm3', from: 'them', text: 'Bạn chuẩn bị sẵn thuốc đang dùng để mình rà soát cùng nhé.', at: atDayOffset(0, '09:22') },
    ],
  },
  {
    id: 'conv-lan-anh',
    name: 'ĐD. Võ Lan Anh',
    role: 'Điều dưỡng',
    avatarUrl: IMAGES.providers.lanAnh,
    unread: 0,
    messages: [
      { id: 'm1', from: 'them', text: 'Vết thương của bác đã khô hơn nhiều rồi ạ.', at: atDayOffset(-1, '16:40') },
      { id: 'm2', from: 'me', text: 'Cảm ơn chị, tuần sau chị ghé lại giúp em nhé.', at: atDayOffset(-1, '17:02') },
    ],
  },
  {
    id: 'conv-khanh-linh',
    name: 'CG. Bùi Khánh Linh',
    role: 'Chuyên gia dinh dưỡng',
    avatarUrl: IMAGES.providers.khanhLinh,
    unread: 0,
    messages: [
      { id: 'm1', from: 'them', text: 'Thực đơn tuần này bạn nhớ thêm rau xanh vào bữa tối nhé.', at: atDayOffset(-2, '11:05') },
    ],
  },
];

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: SEED,

      send: (conversationId, text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const message: ChatMessage = { id: localId('msg'), from: 'me', text: trimmed, at: new Date().toISOString() };
        set({
          conversations: get().conversations.map((conversation) =>
            conversation.id === conversationId
              ? { ...conversation, messages: [...conversation.messages, message] }
              : conversation,
          ),
        });
      },

      markRead: (conversationId) =>
        set({
          conversations: get().conversations.map((conversation) =>
            conversation.id === conversationId ? { ...conversation, unread: 0 } : conversation,
          ),
        }),
    }),
    { name: 'haven.chat', storage: createJSONStorage(() => AsyncStorage), version: 1 },
  ),
);

export const selectUnread = (state: ChatState) => state.conversations.reduce((sum, c) => sum + c.unread, 0);
