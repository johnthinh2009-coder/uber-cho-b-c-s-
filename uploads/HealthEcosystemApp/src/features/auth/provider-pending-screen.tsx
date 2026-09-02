import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { useAuthStore } from '@/store/auth-store';
import { toast } from '@/store/toast-store';
import { gutter, useTheme } from '@/theme';

/**
 * A professional cannot enter the marketplace until their practice documents
 * are reviewed. Approval is mocked so the demo can continue.
 */
export function ProviderPendingScreen() {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const { t, tList } = useI18n();
  const status = useAuthStore((s) => s.providerStatus);
  const approve = useAuthStore((s) => s.approveApplication);
  const signOut = useAuthStore((s) => s.signOut);
  const approved = status === 'approved';

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.badge, { backgroundColor: approved ? colors.accentSoft : colors.warningSoft, borderRadius: radius.pill }]}>
          <Icon name={approved ? 'checkmark-circle' : 'time-outline'} size={20} color={approved ? colors.accent : colors.warning} />
          <Text variant="captionStrong" color={approved ? colors.accent : colors.warning}>
            {approved ? t('auth.provider.approved') : t('auth.provider.pendingTitle')}
          </Text>
        </View>

        <Text variant="pageTitle" accessibilityRole="header">
          {approved ? t('auth.provider.approved') : t('auth.provider.pendingTitle')}
        </Text>
        <Text variant="body" color="textSecondary">
          {approved ? t('auth.provider.pendingNote') : t('auth.provider.pendingBody')}
        </Text>

        <View style={[styles.card, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
          <Text variant="bodyStrong">{t('auth.provider.pendingChecklist')}</Text>
          {tList('auth.provider.pendingItems').map((item) => (
            <View key={item} style={styles.row}>
              <Icon name="checkmark-circle" size={18} color={colors.accent} />
              <Text variant="bodySmall" style={styles.flex}>
                {item}
              </Text>
            </View>
          ))}
        </View>

        {approved ? (
          <Button label={t('auth.provider.enterApp')} fullWidth size="lg" onPress={() => router.replace('/dashboard')} />
        ) : (
          <Button
            label={t('auth.provider.simulateApproval')}
            variant="soft"
            fullWidth
            onPress={() => {
              approve();
              toast.show({ title: t('auth.provider.approved'), tone: 'success' });
            }}
          />
        )}

        <Button
          label={t('auth.signOut')}
          variant="ghost"
          fullWidth
          onPress={() => {
            signOut();
            router.replace('/welcome');
          }}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: gutter, paddingTop: 32, paddingBottom: 40, gap: 14 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 12, height: 32 },
  card: { padding: 16, gap: 10, marginTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  flex: { flex: 1 },
});
