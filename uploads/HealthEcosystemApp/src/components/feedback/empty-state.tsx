import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/theme';

type EmptyStateProps = {
  icon?: IconName;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'neutral' | 'danger';
  style?: StyleProp<ViewStyle>;
};

/** Shared empty / error state – always says what to do next. */
export function EmptyState({ icon = 'leaf-outline', title, message, actionLabel, onAction, tone = 'neutral', style }: EmptyStateProps) {
  const { colors } = useTheme();
  const accent = tone === 'danger' ? colors.danger : colors.text;
  const accentSoft = tone === 'danger' ? colors.dangerSoft : colors.surface;
  return (
    <View style={[styles.root, style]}>
      <View style={[styles.iconWrap, { backgroundColor: accentSoft }]}>
        <Icon name={icon} size={28} color={accent} />
      </View>
      <Text variant="sectionSmall" align="center">
        {title}
      </Text>
      {message ? (
        <Text variant="body" color="textSecondary" align="center" style={styles.message}>
          {message}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} variant={tone === 'danger' ? 'secondary' : 'primary'} style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    gap: 8,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  message: { maxWidth: 320 },
  action: { marginTop: 12 },
});
