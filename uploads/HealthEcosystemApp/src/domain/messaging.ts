import type { Id, ISODateString } from './common';

export type MessageKind = 'text' | 'system' | 'attachment' | 'appointment' | 'visit';

export type Message = {
  id: Id;
  conversationId: Id;
  senderId: Id;
  kind: MessageKind;
  text: string;
  createdAt: ISODateString;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  /** Optional structured payload for system cards (appointment / visit). */
  meta?: {
    title?: string;
    subtitle?: string;
    href?: string;
    attachmentName?: string;
  };
};

export type ConversationParticipant = {
  id: Id;
  name: string;
  avatarUrl: string;
  role: 'patient' | 'provider' | 'support';
  subtitle?: string;
};

export type Conversation = {
  id: Id;
  participants: ConversationParticipant[];
  messages: Message[];
  unreadCount: number;
  updatedAt: ISODateString;
  /** Link to the care episode this thread belongs to, when any. */
  careRequestId?: Id;
};
