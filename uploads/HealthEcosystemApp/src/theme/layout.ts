import { Platform, type ViewStyle } from 'react-native';

/** 4pt spacing scale. */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  giant: 56,
} as const;

/** Horizontal page gutter used by every screen. */
export const gutter = 16;

export const radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 26,
  pill: 999,
} as const;

/** Minimum touch target (WCAG / platform HIG). */
export const touchTarget = 44;

export const hitSlop = { top: 8, bottom: 8, left: 8, right: 8 } as const;

/** Height of the floating bottom tab bar, excluding the safe-area inset. */
export const tabBarHeight = 66;

/** Space a scroll view must leave so the floating bar never covers content. */
export const tabBarClearance = tabBarHeight + 28;

/**
 * This is a phone app. On a wide viewport (web preview) the whole app is
 * clamped to one phone-sized column instead of stretching into a website.
 */
export const deviceWidth = 430;

type ShadowStyle = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

function shadow(opacity: number, radiusPx: number, y: number, elevation: number): ShadowStyle {
  return Platform.select<ShadowStyle>({
    android: { elevation },
    default: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: y },
      shadowOpacity: opacity,
      shadowRadius: radiusPx,
    },
  }) as ShadowStyle;
}

export const shadows = {
  none: {} as ShadowStyle,
  soft: shadow(0.05, 8, 3, 2),
  card: shadow(0.08, 14, 6, 4),
  floating: shadow(0.14, 20, 8, 10),
} as const;
