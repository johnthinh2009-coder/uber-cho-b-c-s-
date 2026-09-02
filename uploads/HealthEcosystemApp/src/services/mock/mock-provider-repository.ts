import type { CareServiceType, HealthQuestionnaire, Provider, ProviderMatch } from '@/domain';
import { careServiceLabel, careServiceRoles } from '@/domain';
import { PROVIDERS } from '@/mocks/providers';

import type { ProviderRepository } from '../repositories';
import { delay } from './utils';

/** Plain-language description of the concern type, used in match reasons. */
const categoryHint: Record<HealthQuestionnaire['category'], string> = {
  general: 'chăm sóc sức khoẻ chung',
  pain: 'đau nhức và vận động',
  fever_illness: 'bệnh cấp tính',
  skin: 'các vấn đề về da',
  mobility: 'hỗ trợ vận động',
  chronic_support: 'hỗ trợ bệnh mạn tính',
  follow_up: 'tái khám',
  other: 'chăm sóc sức khoẻ chung',
};

/**
 * Deterministic demo matching. The selected service type decides which
 * professions are eligible; availability, distance, language, patient age and
 * concern category refine the order. No clinical inference – this only helps
 * find a suitable professional, it never diagnoses.
 */
export function scoreProvider(provider: Provider, questionnaire: HealthQuestionnaire, patientAge?: number): ProviderMatch {
  let score = 0;
  const details: string[] = [];
  const serviceType: CareServiceType = questionnaire.serviceType;

  if (provider.serviceTypes.includes(serviceType)) {
    score += 45;
    details.push(`Nhận dịch vụ ${careServiceLabel(serviceType).toLowerCase()}`);
  } else if (careServiceRoles[serviceType].includes(provider.role)) {
    score += 20;
  }
  if (provider.suitedFor.includes(questionnaire.category)) {
    score += 20;
    details.push(`Có kinh nghiệm về ${categoryHint[questionnaire.category]}`);
  }
  if (provider.availability === 'available_now') {
    score += 18;
    details.push('Sẵn sàng ngay lúc này');
  } else if (provider.availability === 'today') {
    score += 10;
    details.push('Nhận ca hôm nay');
  }
  if (provider.distanceKm <= 2.5) {
    score += 12;
    details.push(`Cách bạn ${provider.etaMinutes} phút`);
  } else if (provider.distanceKm <= 4.5) {
    score += 6;
  }
  if (provider.languages.includes(questionnaire.language)) {
    score += 6;
    if (questionnaire.language !== 'Tiếng Việt') details.push(`Nói được ${questionnaire.language}`);
  }
  if (patientAge !== undefined && patientAge < 16 && provider.expertise.includes('Nhi khoa')) {
    score += 20;
    details.unshift('Chuyên khám cho trẻ em');
  }
  if (patientAge !== undefined && patientAge >= 65 && provider.serviceTypes.includes('elderly_care')) {
    score += 12;
    details.unshift('Quen chăm sóc người cao tuổi');
  }
  if (questionnaire.mobility !== 'fully_mobile' && (provider.serviceTypes.includes('rehabilitation') || provider.role === 'nurse')) {
    score += 6;
  }
  score += Math.round(provider.rating.average * 2);

  const headline =
    score >= 80
      ? 'Rất phù hợp với dịch vụ bạn chọn và đang sẵn sàng ở gần bạn.'
      : score >= 55
        ? 'Phù hợp với nhu cầu chăm sóc bạn mô tả.'
        : 'Có thể hỗ trợ nhu cầu chăm sóc chung.';

  return { providerId: provider.id, score, reason: { headline, details: details.slice(0, 3) } };
}

export class MockProviderRepository implements ProviderRepository {
  async list(): Promise<Provider[]> {
    await delay(350);
    return PROVIDERS;
  }

  async getById(id: string): Promise<Provider | undefined> {
    await delay(200);
    return PROVIDERS.find((p) => p.id === id);
  }

  async nearby(limit = 6): Promise<Provider[]> {
    await delay(400);
    return [...PROVIDERS].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, limit);
  }

  async byService(serviceType: CareServiceType): Promise<Provider[]> {
    await delay(300);
    return PROVIDERS.filter((p) => p.serviceTypes.includes(serviceType)).sort((a, b) => a.distanceKm - b.distanceKm);
  }

  async match(questionnaire: HealthQuestionnaire, patientAge?: number): Promise<ProviderMatch[]> {
    await delay(1400);
    return PROVIDERS.map((provider) => scoreProvider(provider, questionnaire, patientAge))
      .filter((match) => match.score >= 45)
      .sort((a, b) => b.score - a.score);
  }

  async search(query: string): Promise<Provider[]> {
    await delay(250);
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PROVIDERS.filter(
      (p) =>
        `${p.lastName} ${p.firstName}`.toLowerCase().includes(q) ||
        p.expertise.toLowerCase().includes(q) ||
        p.interests.some((i) => i.toLowerCase().includes(q)),
    );
  }
}
