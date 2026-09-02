import type { IconName } from '@/components/ui/icon';
import type { Pillar } from '@/domain/common';
import { t } from '@/i18n';

/**
 * Pillars group content (care, food, medication, fitness, family) but they no
 * longer carry a colour: the app is black / white / grey with one accent.
 * Only an icon and a localised label per pillar.
 */
export const pillarOrder: Pillar[] = ['care', 'food', 'medication', 'fitness', 'family'];

export const pillarIcons: Record<Pillar, IconName> = {
  care: 'medkit-outline',
  food: 'restaurant-outline',
  medication: 'flask-outline',
  fitness: 'walk-outline',
  family: 'people-outline',
};

export function pillarIcon(pillar: Pillar): IconName {
  return pillarIcons[pillar];
}

export function pillarLabel(pillar: Pillar): string {
  return t(`pillars.${pillar}.label`);
}

export function pillarShortLabel(pillar: Pillar): string {
  return t(`pillars.${pillar}.short`);
}
