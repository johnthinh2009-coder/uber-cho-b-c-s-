import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { gutter, useTheme } from '@/theme';

import { Icon } from './icon';
import { PressableScale } from './pressable-scale';
import { Text } from './text';

type PageTitleProps = {
  title: string;
  subtitle?: string;
  /** Rendered on the right, e.g. an avatar or icon button. */
  right?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** The single large title at the top of a tab screen. */
export function PageTitle({ title, subtitle, right, style }: PageTitleProps) {
  return (
    <View style={[styles.page, style]}>
      <View style={styles.pageText}>
        <Text variant="pageTitle" accessibilityRole="header" numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="bodySmall" color="textSecondary" style={styles.pageSubtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  /** Shows the round arrow control on the right. */
  onAction?: () => void;
  actionLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/** Section heading with the optional round "go" control, as in the reference app. */
export function SectionTitle({ title, subtitle, onAction, actionLabel, style }: SectionTitleProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.section, style]}>
      <View style={styles.sectionText}>
        <Text variant="section" accessibilityRole="header" numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" color="textSecondary" numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {onAction ? (
        <PressableScale
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionLabel ?? title}
          scaleTo={0.92}
          style={[styles.action, { backgroundColor: colors.surface }]}>
          <Icon name="arrow-forward" size={18} color={colors.text} />
        </PressableScale>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: gutter,
    paddingTop: 8,
    paddingBottom: 12,
  },
  pageText: { flex: 1, gap: 2 },
  pageSubtitle: { marginTop: 2 },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: gutter,
    paddingBottom: 10,
  },
  sectionText: { flex: 1, gap: 2 },
  action: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
