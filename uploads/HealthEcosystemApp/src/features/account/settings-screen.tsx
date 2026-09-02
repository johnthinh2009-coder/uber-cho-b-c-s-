import Constants from 'expo-constants';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';

import { ScreenHeader } from '@/components/navigation/screen-header';
import { Chip } from '@/components/ui/chip';
import { ListRow } from '@/components/ui/list-row';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useI18n, useLocaleStore, type Locale } from '@/i18n';
import { gutter, useTheme, useThemeController } from '@/theme';

type NotificationKey = 'visit' | 'medication' | 'orders';

export function SettingsScreen() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const { preference, setPreference } = useThemeController();
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);

  const [notifications, setNotifications] = useState<Record<NotificationKey, boolean>>({
    visit: true,
    medication: true,
    orders: false,
  });

  const appearanceOptions = [
    { value: 'light', label: t('settings.appearanceLight') },
    { value: 'dark', label: t('settings.appearanceDark') },
    { value: 'system', label: t('settings.appearanceSystem') },
  ] as const;

  const languageOptions: { value: Locale; label: string }[] = [
    { value: 'vi', label: t('settings.vietnamese') },
    { value: 'en', label: t('settings.english') },
  ];

  const notificationRows: { key: NotificationKey; label: string }[] = [
    { key: 'visit', label: t('settings.notificationsVisit') },
    { key: 'medication', label: t('settings.notificationsMedication') },
    { key: 'orders', label: t('settings.notificationsOrders') },
  ];

  return (
    <Screen>
      <ScreenHeader title={t('settings.title')} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.block}>
          <Text variant="sectionSmall">{t('settings.appearance')}</Text>
          <View style={styles.chips}>
            {appearanceOptions.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                selected={preference === option.value}
                onPress={() => setPreference(option.value)}
              />
            ))}
          </View>
        </View>

        <View style={styles.block}>
          <Text variant="sectionSmall">{t('settings.language')}</Text>
          <View style={styles.chips}>
            {languageOptions.map((option) => (
              <Chip key={option.value} label={option.label} selected={locale === option.value} onPress={() => setLocale(option.value)} />
            ))}
          </View>
        </View>

        <View style={styles.block}>
          <Text variant="sectionSmall">{t('settings.notifications')}</Text>
          {notificationRows.map((row) => (
            <ListRow
              key={row.key}
              title={row.label}
              trailing={
                <Switch
                  value={notifications[row.key]}
                  onValueChange={(value) => setNotifications((prev) => ({ ...prev, [row.key]: value }))}
                  accessibilityLabel={row.label}
                  trackColor={{ true: colors.accent, false: colors.surfaceStrong }}
                />
              }
            />
          ))}
        </View>

        <View style={styles.block}>
          <Text variant="sectionSmall">{t('settings.privacy')}</Text>
          <Text variant="bodySmall" color="textSecondary">
            {t('settings.privacyBody')}
          </Text>
        </View>

        <Text variant="caption" color="textTertiary">
          {t('settings.version')} {Constants.expoConfig?.version ?? '0.1.0'}
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: gutter, paddingBottom: 40, gap: 24 },
  block: { gap: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
