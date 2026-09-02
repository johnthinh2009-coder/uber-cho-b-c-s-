/**
 * Typography — one neutral system sans, weight does the hierarchy work.
 *
 * San Francisco on iOS, Roboto on Android, the platform UI font on web. No
 * decorative face, nothing below 12pt, and page titles are deliberately large
 * and tight so a screen announces itself the way a native app does.
 */
import { Platform, type TextStyle } from 'react-native';

/** Platform system font. `undefined` lets iOS/Android use their default UI face. */
export const systemFontFamily: string | undefined = Platform.select({
  web: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
  default: undefined,
});

export const fontFamilies = {
  sans: systemFontFamily,
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }) as string,
} as const;

export type TypeStyle = Pick<
  TextStyle,
  'fontFamily' | 'fontSize' | 'lineHeight' | 'letterSpacing' | 'fontWeight' | 'textTransform'
>;

const sans = (
  fontSize: number,
  lineHeight: number,
  fontWeight: NonNullable<TextStyle['fontWeight']>,
  letterSpacing = 0,
): TypeStyle => ({ fontFamily: systemFontFamily, fontSize, lineHeight, fontWeight, letterSpacing });

export const typeScale = {
  /** Screen title: "Trang chủ", "Hoạt động". One per screen. */
  pageTitle: sans(34, 40, '700', -0.8),
  /** Secondary large title (detail screens). */
  title: sans(26, 32, '700', -0.5),
  /** Section heading inside a screen. */
  section: sans(22, 28, '700', -0.4),
  sectionSmall: sans(19, 25, '700', -0.2),
  subheading: sans(17, 23, '600', -0.1),
  body: sans(16, 22, '400'),
  bodyStrong: sans(16, 22, '600'),
  bodySmall: sans(15, 20, '400'),
  bodySmallStrong: sans(15, 20, '600'),
  caption: sans(14, 19, '400'),
  captionStrong: sans(14, 19, '600'),
  label: sans(13, 17, '600'),
  tabLabel: sans(12, 15, '600'),
  button: sans(16, 20, '600'),
  buttonSmall: sans(15, 19, '600'),
} as const satisfies Record<string, TypeStyle>;

export type TypeVariant = keyof typeof typeScale;
