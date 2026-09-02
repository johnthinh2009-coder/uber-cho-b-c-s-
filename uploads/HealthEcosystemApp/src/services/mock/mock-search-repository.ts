import { dietaryLabel, difficultyLabel, providerRoleLabel } from '@/domain';
import { t } from '@/i18n';
import { PROGRAMS } from '@/mocks/fitness';
import { CONTRACTORS_BY_ID, MEALS } from '@/mocks/food';
import { PROVIDERS } from '@/mocks/providers';

import type { SearchRepository, SearchResults } from '../repositories';
import { delay } from './utils';

/** Built lazily so the labels follow the active locale. */
function services(): SearchResults['services'] {
  return [
    { id: 'svc-providers', title: t('search.services.providers.title'), subtitle: t('search.services.providers.subtitle'), href: '/care/providers', pillar: 'care' },
    { id: 'svc-medication', title: t('search.services.medication.title'), subtitle: t('search.services.medication.subtitle'), href: '/medication', pillar: 'medication' },
    { id: 'svc-food', title: t('search.services.food.title'), subtitle: t('search.services.food.subtitle'), href: '/food', pillar: 'food' },
    { id: 'svc-fitness', title: t('search.services.fitness.title'), subtitle: t('search.services.fitness.subtitle'), href: '/fitness', pillar: 'fitness' },
    { id: 'svc-family', title: t('search.services.family.title'), subtitle: t('search.services.family.subtitle'), href: '/account/family', pillar: 'family' },
    { id: 'svc-activity', title: t('search.services.activity.title'), subtitle: t('search.services.activity.subtitle'), href: '/activity', pillar: 'care' },
  ];
}

/** Accent-insensitive, case-insensitive matching so "pho" finds "Phở". */
function normalise(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\u0111/g, 'd');
}

export class MockSearchRepository implements SearchRepository {
  async search(query: string): Promise<SearchResults> {
    await delay(300);
    const q = normalise(query.trim());
    if (!q) return { providers: [], meals: [], programs: [], services: [] };
    const includes = (...parts: string[]) => normalise(parts.join(' ')).includes(q);
    return {
      providers: PROVIDERS.filter((p) => includes(p.lastName, p.firstName, p.expertise, providerRoleLabel(p.role), ...p.interests, ...p.languages)).slice(0, 5),
      meals: MEALS.filter((m) => includes(m.name, m.description, CONTRACTORS_BY_ID[m.contractorId]?.name ?? '', ...m.dietary.map(dietaryLabel), ...m.ingredients)).slice(0, 6),
      programs: PROGRAMS.filter((p) => includes(p.title, p.goal, difficultyLabel(p.difficulty), ...p.targetMuscles, ...p.categoryIds.map((c) => c.replace('_', ' ')))).slice(0, 6),
      services: services().filter((s) => includes(s.title, s.subtitle)).slice(0, 5),
    };
  }
}
