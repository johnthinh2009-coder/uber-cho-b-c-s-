import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { useAuthStore } from '@/store/auth-store';
import { brand, gutter, useTheme } from '@/theme';

/** First screen of the app: which side of the ecosystem are you on? */
export function WelcomeScreen() {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const { t } = useI18n();
  const chooseRole = useAuthStore((s) => s.chooseRole);

  const options = [
    {
      role: 'customer' as const,
      icon: 'person-outline' as const,
      accent: colors.accents.blue,
      title: t('auth.customerRole'),
      body: t('auth.customerRoleBody'),
      href: '/auth/sign-in' as const,
    },
    {
      role: 'provider' as const,
      icon: 'medkit-outline' as const,
      accent: colors.accents.green,
      title: t('auth.providerRole'),
      body: t('auth.providerRoleBody'),
      href: '/auth/provider/sign-up' as const,
    },
  ];

  return (
    <Screen>
      <View style={styles.root}>
        <View style={styles.head}>
          <Text variant="title">{brand.name}</Text>
          <Text variant="pageTitle" accessibilityRole="header">
            {t('auth.welcomeTitle')}
          </Text>
          <Text variant="body" color="textSecondary">
            {t('auth.welcomeBody')}
          </Text>
        </View>

        <View style={styles.options}>
          {options.map((option) => (
            <PressableScale
              key={option.role}
              onPress={() => {
                chooseRole(option.role);
                router.push(option.href);
              }}
              accessibilityRole="button"
              accessibilityLabel={`${option.title}. ${option.body}`}
              scaleTo={0.98}
              style={[styles.option, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
              <View style={[styles.iconWrap, { backgroundColor: colors.background, borderRadius: radius.md }]}>
                <Icon name={option.icon} size={24} color={option.accent} />
              </View>
              <View style={styles.optionText}>
                <Text variant="subheading">{option.title}</Text>
                <Text variant="caption" color="textSecondary">
                  {option.body}
                </Text>
              </View>
              <Icon name="chevron-forward" size={20} color={colors.textTertiary} />
            </PressableScale>
          ))}
        </View>

        <Text variant="label" color="textTertiary" align="center">
          {t('account.footer', { brand: brand.name })}
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: gutter, paddingTop: 32, paddingBottom: 24, gap: 28 },
  head: { gap: 8 },
  options: { gap: 12, flex: 1 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  iconWrap: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  optionText: { flex: 1, gap: 3 },
});
