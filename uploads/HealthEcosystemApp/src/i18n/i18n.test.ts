import { t, tLabel, tList, useLocaleStore } from './index';

describe('i18n', () => {
  afterEach(() => {
    useLocaleStore.getState().setLocale('vi');
  });

  it('defaults to Vietnamese', () => {
    expect(useLocaleStore.getState().locale).toBe('vi');
    expect(t('nav.patient.home')).toBe('Trang chủ');
    expect(t('nav.provider.schedule')).toBe('Lịch làm việc');
  });

  it('interpolates parameters', () => {
    expect(t('home.medsTodaySub', { done: 2, total: 3 })).toBe('2/3 liều đã uống');
    expect(t('common.forPerson', { name: 'Hoàng Nam' })).toBe('Cho Hoàng Nam');
  });

  it('translates enum-like labels and lists', () => {
    expect(tLabel('labels.relationship', 'partner')).toBe('Vợ/chồng');
    expect(tLabel('labels.dietary', 'High Protein')).toBe('Giàu đạm');
    expect(tLabel('labels.difficulty', 'Beginner')).toBe('Nhẹ nhàng');
    expect(tLabel('labels.providerRole', 'nurse')).toBe('Điều dưỡng tại nhà');
    expect(tLabel('labels.careService', 'rehabilitation')).toBe('Phục hồi chức năng');
    expect(tList('search.suggestions').length).toBeGreaterThan(3);
  });

  it('falls back to Vietnamese for keys missing in English', () => {
    useLocaleStore.getState().setLocale('en');
    expect(t('nav.patient.home')).toBe('Home');
    expect(t('medication.markTaken')).toBe('Đánh dấu đã uống');
  });
});
