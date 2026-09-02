import { useEffect, type ReactNode } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';

import { deviceWidth, useTheme } from '@/theme';

/**
 * THIS IS A PHONE APP.
 *
 * On native this renders nothing extra. On web (Expo Web preview) the entire
 * app is clamped to a single phone-width column, centred on a neutral canvas,
 * so the product is always reviewed as a mobile app and never stretches into
 * a desktop website.
 */
export function MobileShell({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  const isWeb = Platform.OS === 'web';
  const isWide = isWeb && width > deviceWidth;

  useEffect(() => {
    if (!isWeb || typeof document === 'undefined') return;
    // Paint the browser chrome / overscroll area behind the phone column.
    document.body.style.backgroundColor = isWide ? colors.canvas : colors.background;
  }, [isWeb, isWide, colors.canvas, colors.background]);

  useEffect(() => {
    if (!isWeb || typeof document === 'undefined') return;
    const id = 'haven-hscroll-style';
    if (document.getElementById(id)) return;
    // Horizontal rows keep a visible, draggable scrollbar on the web preview.
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      [data-hscroll="1"] { scrollbar-width: thin; scrollbar-color: rgba(128,128,128,0.55) transparent; }
      [data-hscroll="1"]::-webkit-scrollbar { height: 6px; }
      [data-hscroll="1"]::-webkit-scrollbar-track { background: transparent; }
      [data-hscroll="1"]::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.55); border-radius: 3px; }
    `;
    document.head.appendChild(style);
  }, [isWeb]);

  if (!isWeb) return <>{children}</>;

  return (
    <View style={[styles.canvas, { backgroundColor: isWide ? colors.canvas : colors.background }]}>
      <View
        style={[
          styles.device,
          { backgroundColor: colors.background, maxWidth: deviceWidth },
          isWide ? { boxShadow: '0 0 44px rgba(0,0,0,0.16)' } : null,
        ]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  device: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
});
