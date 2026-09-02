import { create } from 'zustand';

import type { AsyncStatus, Conversation } from '@/domain';
import { services } from '@/services';

import type { AppRole } from './session-store';

type MessagingState = {
  status: AsyncStatus;
  role: AppRole | null;
  conversations: Conversation[];
  load: (role: AppRole) => Promise<void>;
  refreshConversation: (id: string) => Promise<void>;
  send: (conversationId: string, senderId: string, text: string) => Promise<void>;
  markRead: (conversationId: string) => Promise<void>;
};

export const useMessagingStore = create<MessagingState>((set, get) => ({
  status: 'idle',
  role: null,
  conversations: [],

  load: async (role) => {
    if (get().status === 'loading' && get().role === role) return;
    set({ status: 'loading', role });
    try {
      const conversations = await services.messages.conversations(role);
      set({ conversations, status: 'success' });
    } catch {
      set({ status: 'error' });
    }
  },

  refreshConversation: async (id) => {
    const conversation = await services.messages.getConversation(id);
    if (!conversation) return;
    set((s) => ({ conversations: s.conversations.map((c) => (c.id === id ? conversation : c)) }));
  },

  send: async (conversationId, senderId, text) => {
    const message = await services.messages.send(conversationId, senderId, text);
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === conversationId ? { ...c, messages: [...c.messages, message], updatedAt: message.createdAt } : c,
      ),
    }));
    void services.messages.simulateReply(conversationId, senderId).then((reply) => {
      set((s) => ({
        conversations: s.conversations.map((c) =>
          c.id === conversationId ? { ...c, messages: [...c.messages, reply], updatedAt: reply.createdAt } : c,
        ),
      }));
    });
  },

  markRead: async (conversationId) => {
    await services.messages.markRead(conversationId);
    set((s) => ({ conversations: s.conversations.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c)) }));
  },
}));

export function selectUnreadCount(state: Pick<MessagingState, 'conversations'>): number {
  return state.conversations.reduce((sum, c) => sum + c.unreadCount, 0);
}
