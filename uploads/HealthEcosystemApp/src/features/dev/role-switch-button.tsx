import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Text } from '@/components/ui/text';
import { fullName } from '@/domain/people';
import { useI18n } from '@/i18n';
import { useSessionStore } from '@/store/session-store';
import { useTheme } from '@/theme';

/** DEVELOPMENT ONLY – shortcut to the demo account switch. */
export function RoleSwitchButton() {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const { t } = useI18n();
  const role = useSessionStore((s) => s.role);
  const patient = useSessionStore((s) => s.patient);
  const provider = useSessionStore((s) => s.provider);
  const hint =
    role === 'provider'
      ? t('dev.switchButtonHintProvider', { name: fullName(patient) })
      : t('dev.switchButtonHintPatient', { name: `${provider.title} ${fullName(provider)}` });

  return (
    <PressableScale
      onPress={() => router.push('/dev/role-switch')}
      accessibilityRole="button"
      accessibilityLabel={t('dev.switchButton')}
      style={[styles.row, { backgroundColor: colors.warningSoft, borderRadius: radius.xl }]}>
      <Icon name="swap-horizontal" size={22} color={colors.warning} />
      <View style={styles.flex}>
        <Text variant="bodyStrong">{t('dev.switchButton')}</Text>
        <Text variant="caption" color="textSecondary">
          {hint}
        </Text>
      </View>
      <Icon name="chevron-forward" size={18} color={colors.warning} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  flex: { flex: 1, gap: 1 },
});
