import { ScrollView, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ListRow } from '@/components/ui/list-row';
import { Screen } from '@/components/ui/screen';
import { PageTitle } from '@/components/ui/section';
import { Text } from '@/components/ui/text';
import { fullName, providerRoleLabel } from '@/domain';
import { useI18n } from '@/i18n';
import { PROVIDERS_BY_ID } from '@/mocks/providers';
import { useAuthStore } from '@/store/auth-store';
import { useSessionStore } from '@/store/session-store';
import { brand, gutter, tabBarClearance, useTheme } from '@/theme';


export function ProviderAccountScreen() {
  const { colors, radius } = useTheme();
  const { t } = useI18n();
  const providerProfile = useSessionStore((s) => s.provider);
  const application = useAuthStore((s) => s.application);
  const displayName = application?.fullName ?? `${providerProfile.title} ${fullName(providerProfile)}`;
  const displayRole = application ? providerRoleLabel(application.role as typeof providerProfile.role) : providerRoleLabel(providerProfile.role);
  const provider = PROVIDERS_BY_ID[providerProfile.providerId];

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <PageTitle
          title={displayName}
          subtitle={displayRole}
          right={<Avatar uri={application ? undefined : providerProfile.avatarUrl} name={displayName} size={56} />}
        />

        <View style={styles.badges}>
          <Badge label={t('provider.account.verified')} icon="shield-checkmark" tone="accent" />
          {application && application.specialties.length > 0 ? <Badge label={application.specialties[0]!} /> : provider ? <Badge label={providerProfile.expertise} /> : null}
        </View>

        {provider ? (
          <View style={[styles.card, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
            <Text variant="bodyStrong">{t('provider.account.practice')}</Text>
            {(application ? [application.licenseNumber, ...application.specialties] : provider.qualifications).map((qualification) => (
              <Text key={qualification} variant="bodySmall" color="textSecondary">
                {qualification}
              </Text>
            ))}
          </View>
        ) : null}

        <View style={styles.rows}>
          <ListRow title={t('provider.account.practice')} subtitle={t('provider.account.practiceSub')} icon="ribbon-outline" />
          <ListRow title={t('provider.account.availability')} subtitle={t('provider.account.availabilitySub')} icon="map-outline" />
        </View>

        <Text variant="label" color="textTertiary" align="center" style={styles.footer}>
          {t('account.footer', { brand: brand.name })}
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: tabBarClearance, gap: 12 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: gutter },
  card: { padding: 16, gap: 6, marginHorizontal: gutter },
  rows: { paddingHorizontal: gutter },
  footer: { marginTop: 16 },
});
