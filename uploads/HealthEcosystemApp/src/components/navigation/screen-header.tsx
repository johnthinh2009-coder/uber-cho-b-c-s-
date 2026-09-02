import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { IconButton } from '@/components/ui/icon-button';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { gutter } from '@/theme';

type ScreenHeaderProps = {
  /** Large title rendered under the bar (native detail-screen pattern). */
  title?: string;
  subtitle?: string;
  /** Compact title inside the bar instead of a large one. */
  compactTitle?: string;
  mode?: 'back' | 'close' | 'none';
  right?: ReactNode;
  onBack?: () => void;
};

/** Detail-screen header: a round back control, then a large title. */
export function ScreenHeader({ title, subtitle, compactTitle, mode = 'back', right, onBack }: ScreenHeaderProps) {
  const router = useRouter();
  const { t } = useI18n();

  const goBack = () => {
    if (onBack) return onBack();
    if (router.canGoBack()) router.back();
    else router.replace('/home');
  };

  return (
    <View style={styles.root}>
      <View style={styles.bar}>
        {mode !== 'none' ? (
          <IconButton
            icon={mode === 'close' ? 'close' : 'chevron-back'}
            accessibilityLabel={mode === 'close' ? t('a11y.close') : t('a11y.goBack')}
            variant="soft"
            size={40}
            iconSize={20}
            onPress={goBack}
          />
        ) : (
          <View style={styles.spacer} />
        )}
        {compactTitle ? (
          <Text variant="subheading" numberOfLines={1} accessibilityRole="header" style={styles.compact}>
            {compactTitle}
          </Text>
        ) : (
          <View style={styles.flex} />
        )}
        {right}
      </View>
      {title ? (
        <View style={styles.titles}>
          <Text variant="pageTitle" accessibilityRole="header" numberOfLines={3}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="bodySmall" color="textSecondary">
              {subtitle}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { paddingHorizontal: gutter, gap: 10 },
  bar: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48 },
  spacer: { width: 40 },
  compact: { flex: 1 },
  flex: { flex: 1 },
  titles: { gap: 4, paddingBottom: 4 },
});
