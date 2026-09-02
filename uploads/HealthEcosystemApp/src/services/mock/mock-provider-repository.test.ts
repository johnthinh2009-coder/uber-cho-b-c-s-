import type { HealthQuestionnaire } from '@/domain';
import { PRESCRIBING_ROLES } from '@/domain';
import { PROVIDERS, PROVIDERS_BY_ID } from '@/mocks/providers';

import { MockProviderRepository, scoreProvider } from './mock-provider-repository';

const base: HealthQuestionnaire = {
  serviceType: 'home_doctor',
  mainConcern: 'Nổi mẩn đỏ ở cánh tay',
  category: 'skin',
  bodyArea: 'skin',
  duration: 'few_days',
  severity: 'mild',
  existingConditions: [],
  mobility: 'fully_mobile',
  preferredTime: 'asap',
  addressId: 'addr-home',
  language: 'Tiếng Việt',
  notes: '',
};

describe('care matching across the healthcare team', () => {
  it('ranks a suited doctor above an unrelated profession for a home doctor visit', () => {
    const derm = scoreProvider(PROVIDERS_BY_ID['prov-thu-trang']!, base);
    const nutritionist = scoreProvider(PROVIDERS_BY_ID['prov-khanh-linh']!, base);
    expect(derm.score).toBeGreaterThan(nutritionist.score);
    expect(derm.reason.details.join(' ')).toMatch(/về da/i);
  });

  it('adapts to the selected service: physiotherapy requests surface therapists, not doctors', async () => {
    const repo = new MockProviderRepository();
    const matches = await repo.match({ ...base, serviceType: 'physiotherapy', category: 'pain', bodyArea: 'back' });
    expect(matches.length).toBeGreaterThan(0);
    const top = PROVIDERS_BY_ID[matches[0]!.providerId]!;
    expect(['physiotherapist', 'rehabilitation', 'musculoskeletal']).toContain(top.role);
  });

  it('surfaces caregivers and nurses for elderly care', async () => {
    const repo = new MockProviderRepository();
    const matches = await repo.match({ ...base, serviceType: 'elderly_care', category: 'chronic_support' }, 74);
    const roles = matches.slice(0, 3).map((m) => PROVIDERS_BY_ID[m.providerId]!.role);
    expect(roles.some((r) => r === 'elderly_caregiver' || r === 'nurse' || r === 'doctor_specialist')).toBe(true);
  });

  it('boosts paediatric doctors for children', () => {
    const child = scoreProvider(PROVIDERS_BY_ID['prov-ngoc-mai']!, { ...base, category: 'fever_illness' }, 6);
    const adult = scoreProvider(PROVIDERS_BY_ID['prov-ngoc-mai']!, { ...base, category: 'fever_illness' }, 40);
    expect(child.score).toBeGreaterThan(adult.score);
    expect(child.reason.details).toContain('Chuyên khám cho trẻ em');
  });

  it('never phrases a match as a diagnosis', () => {
    PROVIDERS.forEach((provider) => {
      const match = scoreProvider(provider, base);
      expect(match.reason.headline).not.toMatch(/chẩn đoán|diagnos/i);
    });
  });

  it('only doctors can prescribe', () => {
    PROVIDERS.forEach((provider) => {
      expect(provider.canPrescribe).toBe(PRESCRIBING_ROLES.includes(provider.role));
    });
    expect(PROVIDERS.filter((p) => p.canPrescribe).length).toBeGreaterThan(0);
    expect(PROVIDERS.filter((p) => !p.canPrescribe).length).toBeGreaterThan(0);
  });

  it('covers the broader home-care team with Vietnamese naming conventions', () => {
    const roles = new Set(PROVIDERS.map((p) => p.role));
    ['doctor_general', 'doctor_specialist', 'nurse', 'physiotherapist', 'rehabilitation', 'musculoskeletal', 'elderly_caregiver', 'nutritionist', 'mental_health'].forEach(
      (role) => expect(roles.has(role as never)).toBe(true),
    );
    PROVIDERS.forEach((provider) => {
      expect(['BS.', 'BS.CKI', 'BS.CKII', 'ThS.BS', 'ThS.', 'ĐD.', 'KTV.', 'CV.', 'CG.', 'NV.']).toContain(provider.title);
      expect(provider.languages).toContain('Tiếng Việt');
    });
  });
});
