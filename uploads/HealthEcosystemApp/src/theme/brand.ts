/**
 * Brand configuration.
 *
 * Everything brand-specific (name, wordmark, tagline, currency, locale) lives
 * here so it can be swapped in one place when the final brand is decided.
 */
export const brand = {
  /** Temporary working name for the product. */
  name: 'Haven',
  /** Rendered wordmark text (kept as text – no logo asset needed for the demo). */
  wordmark: 'Haven',
  tagline: 'Ngôi nhà sức khoẻ của bạn',
  shortTagline: 'Sức khoẻ của bạn, kết nối trọn vẹn.',
  /** Fictional support contact for demo screens. */
  supportEmail: 'hotro@haven.example',
  /** Primary market: Vietnam. */
  market: {
    country: 'VN',
    city: 'Thành phố Hồ Chí Minh',
    locale: 'vi-VN',
  },
  /** Display currency for all mock prices. */
  currency: {
    code: 'VND',
    symbol: '₫',
    locale: 'vi-VN',
  },
} as const;

export type Brand = typeof brand;
