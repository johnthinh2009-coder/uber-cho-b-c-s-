import type { IconName } from '@/components/ui/icon';
import type { CareServiceType } from '@/domain';

import { IMAGES } from './images';

export type CareServiceCard = {
  id: CareServiceType;
  icon: IconName;
  imageUrl: string;
  /** Typical starting price shown as "từ …". */
  fromPrice: number;
  /** Shown on the Home "Dịch vụ nổi bật" row. */
  featured: boolean;
};

/**
 * The home-care services patients can request. Labels and descriptions are
 * localised through `careServiceLabel()` / `careServiceDescription()`.
 */
export const CARE_SERVICES: CareServiceCard[] = [
  { id: 'home_doctor', icon: 'medical', imageUrl: IMAGES.care.doctorsInPark, fromPrice: 550_000, featured: true },
  { id: 'home_nursing', icon: 'bandage', imageUrl: IMAGES.care.nurseVaccination, fromPrice: 250_000, featured: true },
  { id: 'physiotherapy', icon: 'body', imageUrl: IMAGES.care.physiotherapy, fromPrice: 420_000, featured: true },
  { id: 'rehabilitation', icon: 'walk', imageUrl: IMAGES.care.backTherapy, fromPrice: 500_000, featured: true },
  { id: 'musculoskeletal', icon: 'fitness', imageUrl: IMAGES.fitness.taiChiElder, fromPrice: 420_000, featured: false },
  { id: 'post_treatment', icon: 'pulse', imageUrl: IMAGES.care.caregiverElder, fromPrice: 280_000, featured: false },
  { id: 'elderly_care', icon: 'heart', imageUrl: IMAGES.care.elderlyCoupleLaughing, fromPrice: 280_000, featured: true },
  { id: 'nutrition', icon: 'nutrition', imageUrl: IMAGES.care.tastingFood, fromPrice: 350_000, featured: true },
  { id: 'mental_health', icon: 'leaf', imageUrl: IMAGES.care.calmParkPath, fromPrice: 380_000, featured: false },
];

export const CARE_SERVICES_BY_ID: Record<string, CareServiceCard> = Object.fromEntries(CARE_SERVICES.map((s) => [s.id, s]));
