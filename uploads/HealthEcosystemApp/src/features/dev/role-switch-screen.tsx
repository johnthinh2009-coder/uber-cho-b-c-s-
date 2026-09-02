import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ScreenHeader } from '@/components/navigation/screen-header';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { fullName } from '@/domain/people';
import { providerRoleLabel } from '@/domain/provider';
import { useI18n } from '@/i18n';
import { useMessagingStore } from '@/store/messaging-store';
import { useSessionStore, type AppRole } from '@/store/session-store';
import { toast } from '@/store/toast-store';
import { gutter, useTheme } from '@/theme';
import { haptics } from '@/utils/haptics';

/**
 * DEVELOPMENT ONLY – demo role switch.
 * Swaps between the patient demo account and the doctor demo account so both
 * sides of the marketplace can be shown in one session. Not authentication.
 */
export function RoleSwitchScreen() {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const { t } = useI18n();
  const role = useSessionStore((s) => s.role);
  const patient = useSessionStore((s) => s.patient);
  const provider = useSessionStore((s) => s.provider);
  const setRole = useSessionStore((s) => s.setRole);

  const choose = (next: AppRole) => {
    haptics.medium();
    setRole(next);
    void useMessagingStore.getState().load(next);
    toast.show({ title: t(next === 'provider' ? 'dev.switchedToProvider' : 'dev.switchedToPatient'), tone: 'success' });
    // Opened as a modal from Account; when deep-linked there is nothing beneath to dismiss.
    if (router.canDismiss()) router.dismissAll();
    router.replace(next === 'provider' ? '/dashboard' : '/home');
  };

  const options: { role: AppRole; name: string; subtitle: string; avatar: string; description: string }[] = [
    {
      role: 'patient',
      name: fullName(patient),
      subtitle: t('dev.patientSubtitle'),
      avatar: patient.avatarUrl,
      description: t('dev.patientDescription'),
    },
    {
      role: 'provider',
      name: `${provider.title} ${fullName(provider)}`,
      subtitle: t('dev.providerSubtitle', { role: providerRoleLabel(provider.role) }),
      avatar: provider.avatarUrl,
      description: t('dev.providerDescription'),
    },
  ];

  return (
    <Screen>
      <ScreenHeader title={t('dev.title')} mode="close" />
      <View style={styles.body}>
        <View style={[styles.banner, { backgroundColor: colors.warningSoft, borderRadius: radius.lg }]}>
          <Icon name="construct-outline" size={20} color={colors.warning} />
          <View style={styles.flex}>
            <Text variant="bodySmallStrong" color="warning">
              {t('dev.bannerTitle')}
            </Text>
            <Text variant="caption" color="textSecondary">
              {t('dev.bannerBody')}
            </Text>
          </View>
        </View>

        {options.map((option) => {
          const active = option.role === role;
          return (
            <PressableScale
              key={option.role}
              onPress={() => choose(option.role)}
              accessibilityRole="button"
              accessibilityLabel={t('dev.useAccountA11y', { name: option.name, subtitle: option.subtitle })}
              accessibilityState={{ selected: active }}
              style={[
                styles.card,
                {
                  borderColor: active ? colors.primary : colors.border,
                  backgroundColor: active ? colors.primarySoft : colors.background,
                  borderRadius: radius.xl,
                },
              ]}>
              <Avatar uri={option.avatar} name={option.name} size={60} ringColor={active ? colors.primary : undefined} />
              <View style={styles.flex}>
                <View style={styles.row}>
                  <Text variant="subheading">{option.name}</Text>
                  {active ? <Badge label={t('common.current')} tone="accent" size="sm" /> : null}
                </View>
                <Text variant="caption" color="primary">
                  {option.subtitle}
                </Text>
                <Text variant="bodySmall" color="textSecondary" style={styles.description}>
                  {option.description}
                </Text>
              </View>
              <Icon name={active ? 'checkmark-circle' : 'chevron-forward'} size={22} color={active ? colors.primary : colors.textTertiary} />
            </PressableScale>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: gutter, paddingTop: 8, gap: 14 },
  banner: { flexDirection: 'row', gap: 12, padding: 14, alignItems: 'flex-start' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderWidth: 1.5 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  description: { marginTop: 4 },
  flex: { flex: 1 },
});
