/**
 * Colour system — neutral, high-contrast, healthcare.
 *
 * Black type on white, grey surfaces for grouping, and exactly ONE accent
 * (a deep, muted green) reserved for health-specific signals: verified
 * professionals, progress, confirmations. Actions are black, like a transit
 * app — the product must feel calm and trustworthy, never decorative.
 */
export type ColorScheme = 'light' | 'dark';

export type ThemeColors = {
  scheme: ColorScheme;
  /** Page canvas. */
  background: string;
  /** Grouped rows, tiles, chips – the grey blocks that carry the layout. */
  surface: string;
  /** Pressed / stronger grey. */
  surfaceStrong: string;
  /** Inverted block (dark cards, snackbars). */
  surfaceInverse: string;
  border: string;
  borderStrong: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  /** Primary action colour: black. */
  primary: string;
  primarySoft: string;
  onPrimary: string;
  /** The single health accent. */
  accent: string;
  accentSoft: string;
  onAccent: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  info: string;
  infoSoft: string;
  overlay: string;
  skeleton: string;
  /** Floating tab bar surface + its hairline. */
  tabBar: string;
  tabBarBorder: string;
  /** Page behind the phone frame on wide screens (web preview only). */
  canvas: string;
  /**
   * Vibrant accents. Colour lives in ICONS and their soft circular backgrounds –
   * never in large blocks of surface. Every accent has a matching soft tint.
   */
  accents: AccentPalette;
  accentSurfaces: AccentPalette;
};

export type AccentTone = 'blue' | 'green' | 'orange' | 'coral' | 'yellow' | 'purple' | 'teal' | 'pink';
export type AccentPalette = Record<AccentTone, string>;

export const lightColors: ThemeColors = {
  scheme: 'light',
  background: '#FFFFFF',
  /** Ultra-light clinical tint used for grouped surfaces. */
  surface: '#F5F7F7',
  surfaceStrong: '#E6EAEA',
  surfaceInverse: '#111111',
  border: '#E4E4E4',
  borderStrong: '#CFCFCF',
  text: '#000000',
  textSecondary: '#6B6B6B',
  textTertiary: '#8E8E8E',
  textInverse: '#FFFFFF',
  /** Medical green: primary calls to action, active navigation. */
  primary: '#0F8A6A',
  primarySoft: '#E7F4F0',
  onPrimary: '#FFFFFF',
  /** Medical blue: informational highlights and health shortcuts. */
  accent: '#1976D2',
  accentSoft: '#E6F0FB',
  onAccent: '#FFFFFF',
  success: '#0F8A6A',
  successSoft: '#E7F4F0',
  warning: '#8A5A00',
  warningSoft: '#FBF0DC',
  danger: '#B3261E',
  dangerSoft: '#FBE9E7',
  info: '#0B57D0',
  infoSoft: '#E8F0FE',
  overlay: 'rgba(0, 0, 0, 0.45)',
  skeleton: '#EDEDED',
  tabBar: '#FFFFFF',
  tabBarBorder: '#EAEAEA',
  canvas: '#E9E9E9',
  accents: {
    blue: '#1976D2',
    green: '#0F8A6A',
    orange: '#F79009',
    coral: '#F04438',
    yellow: '#E9A100',
    purple: '#7A5AF8',
    teal: '#06AED4',
    pink: '#EE46BC',
  },
  accentSurfaces: {
    blue: '#E6F0FB',
    green: '#E7F4F0',
    orange: '#FEF0DC',
    coral: '#FEE9E7',
    yellow: '#FDF3DA',
    purple: '#EFEBFE',
    teal: '#E0F6FB',
    pink: '#FDE9F7',
  },
};

export const darkColors: ThemeColors = {
  scheme: 'dark',
  background: '#000000',
  surface: '#1A1A1A',
  surfaceStrong: '#2A2A2A',
  surfaceInverse: '#FFFFFF',
  border: '#2E2E2E',
  borderStrong: '#454545',
  text: '#FFFFFF',
  textSecondary: '#A8A8A8',
  textTertiary: '#8A8A8A',
  textInverse: '#000000',
  primary: '#FFFFFF',
  primarySoft: '#1F1F1F',
  onPrimary: '#000000',
  accent: '#5CC5A0',
  accentSoft: '#12271F',
  onAccent: '#04140F',
  success: '#5CC5A0',
  successSoft: '#12271F',
  warning: '#E7B45A',
  warningSoft: '#2B2110',
  danger: '#F2857C',
  dangerSoft: '#2E1512',
  info: '#8AB4F8',
  infoSoft: '#12203A',
  overlay: 'rgba(0, 0, 0, 0.65)',
  skeleton: '#222222',
  tabBar: '#141414',
  tabBarBorder: '#262626',
  canvas: '#0A0A0A',
  accents: {
    blue: '#8AB4F8',
    green: '#5CC5A0',
    orange: '#E7A45A',
    coral: '#F2857C',
    yellow: '#E7C25A',
    purple: '#B9A0E8',
    teal: '#6FC9D2',
    pink: '#EE93B6',
  },
  accentSurfaces: {
    blue: '#12203A',
    green: '#12271F',
    orange: '#2B2110',
    coral: '#2E1512',
    yellow: '#2A2410',
    purple: '#221C3A',
    teal: '#0F2429',
    pink: '#2C1526',
  },
};
