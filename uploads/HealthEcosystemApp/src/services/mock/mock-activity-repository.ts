import type { ActivityItem } from '@/domain';
import { ACTIVITY_SEED } from '@/mocks/activity';

import type { ActivityRepository } from '../repositories';
import { clone, delay, nextId } from './utils';

export class MockActivityRepository implements ActivityRepository {
  private items: ActivityItem[] = clone(ACTIVITY_SEED);

  async list(): Promise<ActivityItem[]> {
    await delay(300);
    return clone(this.items).sort((a, b) => b.at.localeCompare(a.at));
  }

  async add(item: Omit<ActivityItem, 'id'>): Promise<ActivityItem> {
    const created: ActivityItem = { ...item, id: nextId('act') };
    this.items = [created, ...this.items];
    return clone(created);
  }
}
