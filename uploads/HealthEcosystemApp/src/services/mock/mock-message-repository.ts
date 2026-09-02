import type { Conversation, Message } from '@/domain';
import { CONVERSATIONS, PROVIDER_CONVERSATIONS } from '@/mocks/messaging';

import type { MessageRepository } from '../repositories';
import { clone, delay, nextId } from './utils';

const autoReplies = [
  'Cảm ơn bạn đã báo – tôi sẽ xem và phản hồi sớm.',
  'Tôi đã ghi nhận. Nếu có gì thay đổi trước đó, bạn nhắn tôi ở đây nhé.',
  'Nghe hợp lý đấy. Bạn theo dõi thêm, chúng ta sẽ xem lại ở lần khám tới.',
];

export class MockMessageRepository implements MessageRepository {
  private conversationsState: Conversation[] = clone(CONVERSATIONS);
  private providerConversationsState: Conversation[] = clone(PROVIDER_CONVERSATIONS);
  private replyIndex = 0;

  async conversations(role: 'patient' | 'provider'): Promise<Conversation[]> {
    await delay(300);
    const list = role === 'provider' ? this.providerConversationsState : this.conversationsState;
    return clone(list).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    await delay(150);
    const found = this.all().find((c) => c.id === id);
    return found ? clone(found) : undefined;
  }

  async send(conversationId: string, senderId: string, text: string): Promise<Message> {
    await delay(250);
    const conversation = this.all().find((c) => c.id === conversationId);
    if (!conversation) throw new Error(`Conversation ${conversationId} not found`);
    const message: Message = {
      id: nextId('msg'),
      conversationId,
      senderId,
      kind: 'text',
      text,
      createdAt: new Date().toISOString(),
      status: 'sent',
    };
    conversation.messages.push(message);
    conversation.updatedAt = message.createdAt;
    return clone(message);
  }

  /** Demo-only: fabricate a reply from the other participant. */
  async simulateReply(conversationId: string, senderId: string): Promise<Message> {
    await delay(1800);
    const conversation = this.all().find((c) => c.id === conversationId);
    if (!conversation) throw new Error(`Conversation ${conversationId} not found`);
    const other = conversation.participants.find((p) => p.id !== senderId) ?? conversation.participants[0]!;
    const text = autoReplies[this.replyIndex % autoReplies.length]!;
    this.replyIndex += 1;
    const message: Message = {
      id: nextId('msg'),
      conversationId,
      senderId: other.id,
      kind: 'text',
      text,
      createdAt: new Date().toISOString(),
      status: 'delivered',
    };
    conversation.messages.push(message);
    conversation.updatedAt = message.createdAt;
    return clone(message);
  }

  async markRead(conversationId: string): Promise<void> {
    const conversation = this.all().find((c) => c.id === conversationId);
    if (conversation) conversation.unreadCount = 0;
  }

  private all(): Conversation[] {
    return [...this.conversationsState, ...this.providerConversationsState];
  }
}
