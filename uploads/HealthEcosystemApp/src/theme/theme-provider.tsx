import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';

import { darkColors, lightColors, type ColorScheme, type ThemeColors } from './colors';
import { gutter, radius, shadows, spacing } from './layout';
import { fontFamilies, typeScale } from './typography';

export type Theme = {
  colors: ThemeColors;
  fonts: typeof fontFamilies;
  type: typeof typeScale;
  spacing: typeof spacing;
  radius: typeof radius;
  shadows: typeof shadows;
  gutter: number;
  isDark: boolean;
};

export type AppearancePreference = 'light' | 'dark' | 'system';

type ThemeController = {
  preference: AppearancePreference;
  setPreference: (preference: AppearancePreference) => void;
  scheme: ColorScheme;
};

function buildTheme(scheme: ColorScheme): Theme {
  return {
    colors: scheme === 'dark' ? darkColors : lightColors,
    fonts: fontFamilies,
    type: typeScale,
    spacing,
    radius,
    shadows,
    gutter,
    isDark: scheme === 'dark',
  };
}

const defaultTheme = buildTheme('light');

const ThemeContext = createContext<Theme>(defaultTheme);
const ThemeControllerContext = createContext<ThemeController>({
  preference: 'light',
  setPreference: () => undefined,
  scheme: 'light',
});

/**
 * The product is designed light-first (photography reads best on a clean
 * canvas and it suits older / stressed users). Dark tokens exist and can be
 * enabled from Settings; "system" follows the OS.
 */
export function ThemeProvider({
  children,
  initialPreference = 'light',
}: PropsWithChildren<{ initialPreference?: AppearancePreference }>) {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState<AppearancePreference>(initialPreference);

  const scheme: ColorScheme =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

  const theme = useMemo(() => buildTheme(scheme), [scheme]);
  const controller = useMemo<ThemeController>(
    () => ({ preference, setPreference, scheme }),
    [preference, scheme],
  );

  return (
    <ThemeControllerContext.Provider value={controller}>
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    </ThemeControllerContext.Provider>
  );
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

export function useThemeController(): ThemeController {
  return useContext(ThemeControllerContext);
}
