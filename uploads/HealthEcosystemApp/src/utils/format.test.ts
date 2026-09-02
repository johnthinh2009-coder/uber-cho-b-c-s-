import { formatCount, formatDistance, formatMoney, formatMoneyCompact, formatNumber, formatRating, initials, joinWithAnd } from './format';

describe('Vietnamese formatters', () => {
  it('formats đồng with dot thousands separators and the symbol after the amount', () => {
    expect(formatMoney(1_000_000)).toBe('1.000.000 ₫');
    expect(formatMoney(200_000)).toBe('200.000 ₫');
    expect(formatMoney(800_000)).toBe('800.000 ₫');
    expect(formatMoney(65_000)).toBe('65.000 ₫');
    expect(formatMoney(0)).toBe('0 ₫');
  });

  it('formats compact money for tight spaces', () => {
    expect(formatMoneyCompact(1_200_000)).toBe('1,2 triệu ₫');
    expect(formatMoneyCompact(2_000_000)).toBe('2 triệu ₫');
    expect(formatMoneyCompact(200_000)).toBe('200 nghìn ₫');
  });

  it('uses the decimal comma for fractions', () => {
    expect(formatNumber(1234.5, 1)).toBe('1.234,5');
    expect(formatRating(4.9)).toBe('4,9');
  });

  it('formats distances in metres under one kilometre', () => {
    expect(formatDistance(0.4)).toBe('400 m');
    expect(formatDistance(1.2)).toBe('1,2 km');
    expect(formatDistance(12)).toBe('12 km');
  });

  it('abbreviates large counts', () => {
    expect(formatCount(412)).toBe('412');
    expect(formatCount(1280)).toBe('1,3k');
    expect(formatCount(12_000)).toBe('12k');
  });

  it('builds initials from the given name and joins lists with và', () => {
    expect(initials('Nguyễn Minh Anh')).toBe('MA');
    expect(initials('Trần Gia Hân')).toBe('GH');
    expect(joinWithAnd(['Gia Hân', 'Hoàng Nam'])).toBe('Gia Hân và Hoàng Nam');
  });
});
