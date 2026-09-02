import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ScreenHeader } from '@/components/navigation/screen-header';
import { Avatar } from '@/components/ui/avatar';
import { IconButton } from '@/components/ui/icon-button';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { useAuthStore } from '@/store/auth-store';
import { gutter, useTheme } from '@/theme';
import { formatDateWithYear } from '@/utils/date';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.field}>
      <Text variant="label" color="textSecondary">
        {label}
      </Text>
      <Text variant="body">{value || '—'}</Text>
    </View>
  );
}

export function ProfileScreen() {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const { t, tLabel } = useI18n();
  const customer = useAuthStore((s) => s.customer);

  return (
    <Screen>
      <ScreenHeader
        title={t('profile.title')}
        right={<IconButton icon="create-outline" accessibilityLabel={t('profileEdit.edit')} size={40} iconSize={20} onPress={() => router.push('/account/edit')} />}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.identity}>
          <Avatar uri={customer?.avatarUrl} name={customer?.fullName ?? 'Haven'} size={64} />
          <View style={styles.flex}>
            <Text variant="subheading">{customer?.fullName ?? t('home.guestName')}</Text>
            <Text variant="caption" color="textSecondary">
              {customer?.phone ?? ''}
            </Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
          <Text variant="sectionSmall">{t('profile.personal')}</Text>
          <Field label={t('profile.name')} value={customer?.fullName ?? ''} />
          <Field label={t('profile.dateOfBirth')} value={customer?.dateOfBirth ? formatDateWithYear(customer.dateOfBirth) : ''} />
          <Field label={t('profile.phone')} value={customer?.phone ?? ''} />
          <Field label={t('profile.email')} value={customer?.email ?? ''} />
          <Field label={t('auth.gender')} value={customer ? tLabel('labels.gender', customer.gender) : ''} />
        </View>

        <Text variant="caption" color="textTertiary">
          {t('profile.note')}
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: gutter, paddingBottom: 40, gap: 16, justifyContent: 'flex-start' },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  card: { padding: 16, gap: 14 },
  field: { gap: 2 },
  flex: { flex: 1, gap: 2 },
});
