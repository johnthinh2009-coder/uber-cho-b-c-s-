import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { ListRow } from '@/components/ui/list-row';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Screen } from '@/components/ui/screen';
import { PageTitle } from '@/components/ui/section';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { useAuthStore } from '@/store/auth-store';
import { useFamilyStore } from '@/store/family-store';
import { toast } from '@/store/toast-store';
import { brand, gutter, tabBarClearance, useTheme } from '@/theme';

function QuickTile({ label, icon, color, onPress }: { label: string; icon: IconName; color: string; onPress: () => void }) {
  const { colors, radius } = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      scaleTo={0.97}
      style={[styles.quick, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
      <Icon name={icon} size={20} color={color} />
      <Text variant="bodySmallStrong" numberOfLines={1}>
        {label}
      </Text>
    </PressableScale>
  );
}

export function AccountScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useI18n();
  const customer = useAuthStore((s) => s.customer);
  const guest = useAuthStore((s) => s.guest);
  const signOut = useAuthStore((s) => s.signOut);
  const familyCount = useFamilyStore((s) => s.members.length);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <PageTitle
          title={customer?.fullName ?? t('home.guestName')}
          right={<Avatar uri={customer?.avatarUrl} name={customer?.fullName ?? 'Haven'} size={56} />}
        />

        {guest ? (
          <View style={styles.guestRow}>
            <Badge label={t('auth.continueGuest')} tone="warning" icon="person-outline" />
            <Button label={t('auth.signIn')} size="sm" onPress={() => router.push('/auth/sign-in')} />
          </View>
        ) : null}

        <View style={styles.quickRow}>
          <QuickTile label={t('account.quick.help')} icon="help-buoy-outline" color={colors.accents.blue} onPress={() => router.push('/account/help')} />
          <QuickTile label={t('account.quick.wallet')} icon="wallet-outline" color={colors.accents.green} onPress={() => router.push('/account/wallet')} />
        </View>
        <View style={styles.quickRow}>
          <QuickTile label={t('account.quick.profile')} icon="person-outline" color={colors.accents.purple} onPress={() => router.push('/account/profile')} />
          <QuickTile label={t('account.quick.family')} icon="people-outline" color={colors.accents.pink} onPress={() => router.push('/account/family')} />
        </View>

        <View style={styles.rows}>
          <ListRow
            title={t('account.rows.profile')}
            subtitle={t('account.rows.profileSub')}
            icon="person-outline"
            chevron
            onPress={() => router.push('/account/profile')}
          />
          <ListRow
            title={t('account.rows.family')}
            subtitle={t('account.rows.familySub', { count: familyCount })}
            icon="people-outline"
            chevron
            onPress={() => router.push('/account/family')}
          />
          <ListRow title={t('chat.title')} subtitle={t('chat.emptyHint')} icon="chatbubble-ellipses-outline" chevron onPress={() => router.push('/chat')} />
          <ListRow
            title={t('account.rows.wallet')}
            subtitle={t('account.rows.walletSub')}
            icon="wallet-outline"
            chevron
            onPress={() => router.push('/account/wallet')}
          />
          <ListRow
            title={t('account.rows.settings')}
            subtitle={t('account.rows.settingsSub')}
            icon="settings-outline"
            chevron
            onPress={() => router.push('/account/settings')}
          />
          <ListRow
            title={t('account.rows.help')}
            subtitle={t('account.rows.helpSub')}
            icon="help-buoy-outline"
            chevron
            onPress={() => router.push('/account/help')}
          />
        </View>

        <View style={styles.signOut}>
          <Button
            label={t('auth.signOut')}
            variant="soft"
            fullWidth
            onPress={() => {
              signOut();
              toast.show({ title: t('auth.signedOut'), tone: 'neutral' });
              router.replace('/welcome');
            }}
          />
        </View>

        <Text variant="label" color="textTertiary" align="center" style={styles.footer}>
          {t('account.footer', { brand: brand.name })}
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: tabBarClearance, gap: 12, justifyContent: 'flex-start' },
  guestRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingHorizontal: gutter },
  quickRow: { flexDirection: 'row', gap: 10, paddingHorizontal: gutter },
  quick: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, height: 56 },
  rows: { paddingHorizontal: gutter, marginTop: 8 },
  signOut: { paddingHorizontal: gutter, marginTop: 12 },
  footer: { marginTop: 16 },
});
