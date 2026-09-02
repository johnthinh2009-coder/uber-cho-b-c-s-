import { brand } from '@/theme/brand';

/**
 * Groups thousands with the Vietnamese separator: 1234567 → "1.234.567".
 * Implemented by hand so it behaves identically on Hermes, JSC and web.
 */
export function formatNumber(value: number, fractionDigits = 0): string {
  const fixed = Math.abs(value).toFixed(fractionDigits);
  const [whole = '0', fraction] = fixed.split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const sign = value < 0 ? '-' : '';
  return fraction ? `${sign}${grouped},${fraction}` : `${sign}${grouped}`;
}

/** "1.000.000 ₫" – whole đồng, thousands grouped with dots, symbol after. */
export function formatMoney(amount: number): string {
  return `${formatNumber(Math.round(amount))} ${brand.currency.symbol}`;
}

/** Compact money for tight spaces: "1,2 triệu ₫", "200 nghìn ₫". */
export function formatMoneyCompact(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    const text = Number.isInteger(millions) ? String(millions) : millions.toFixed(1).replace('.', ',');
    return `${text} triệu ₫`;
  }
  if (amount >= 1_000) return `${formatNumber(Math.round(amount / 1_000))} nghìn ₫`;
  return formatMoney(amount);
}

/** "400 m", "1,2 km", "12 km" */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${formatNumber(km, km < 10 ? 1 : 0)} km`;
}

/** Ratings use the Vietnamese decimal comma: "4,9". */
export function formatRating(value: number): string {
  return value.toFixed(1).replace('.', ',');
}

/** "412", "1,3k", "12k" */
export function formatCount(value: number): string {
  if (value >= 1000) {
    const k = value / 1000;
    const text = value >= 10_000 ? String(Math.round(k)) : k.toFixed(1).replace('.', ',');
    return `${text}k`;
  }
  return String(value);
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** "A, B và C" */
export function joinWithAnd(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} và ${items[items.length - 1]}`;
}
