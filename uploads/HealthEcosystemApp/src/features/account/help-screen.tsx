import { ScrollView, StyleSheet, View } from 'react-native';

import { ScreenHeader } from '@/components/navigation/screen-header';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useI18n, type TranslationKey } from '@/i18n';
import { brand, gutter, useTheme } from '@/theme';

const FAQ: { q: TranslationKey; a: TranslationKey }[] = [
  { q: 'help.faq.q1', a: 'help.faq.a1' },
  { q: 'help.faq.q2', a: 'help.faq.a2' },
  { q: 'help.faq.q3', a: 'help.faq.a3' },
  { q: 'help.faq.q4', a: 'help.faq.a4' },
];

/** Plain answers to the questions people actually ask before booking care. */
export function HelpScreen() {
  const { colors, radius } = useTheme();
  const { t } = useI18n();

  return (
    <Screen>
      <ScreenHeader title={t('help.title')} subtitle={t('help.subtitle')} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {FAQ.map((item) => (
          <View key={item.q} style={[styles.card, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
            <Text variant="bodyStrong">{t(item.q)}</Text>
            <Text variant="bodySmall" color="textSecondary">
              {t(item.a)}
            </Text>
          </View>
        ))}

        <View style={styles.contact}>
          <Text variant="sectionSmall">{t('help.contactTitle')}</Text>
          <Text variant="body" color="textSecondary">
            {t('help.contactBody', { email: brand.supportEmail })}
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: gutter, paddingBottom: 40, gap: 12 },
  card: { padding: 16, gap: 8 },
  contact: { gap: 6, marginTop: 8 },
});
