import { useRouter, type Href } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { HScroll } from '@/components/ui/h-scroll';
import { Icon, type IconName } from '@/components/ui/icon';
import { IconBadge } from '@/components/ui/icon-badge';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Screen } from '@/components/ui/screen';
import { PageTitle, SectionTitle } from '@/components/ui/section';
import { Text } from '@/components/ui/text';
import { Tile } from '@/components/ui/tile';
import { careServiceLabel, careServiceOrder, type CareServiceType } from '@/domain';
import { useI18n } from '@/i18n';
import { gutter, tabBarClearance, useTheme, type AccentTone } from '@/theme';

const CARE: Record<CareServiceType, { icon: IconName; tone: AccentTone }> = {
  home_doctor: { icon: 'medkit', tone: 'blue' },
  home_nursing: { icon: 'fitness', tone: 'green' },
  physiotherapy: { icon: 'body', tone: 'purple' },
  rehabilitation: { icon: 'accessibility', tone: 'teal' },
  musculoskeletal: { icon: 'walk', tone: 'orange' },
  post_treatment: { icon: 'pulse', tone: 'coral' },
  elderly_care: { icon: 'heart', tone: 'pink' },
  nutrition: { icon: 'nutrition', tone: 'green' },
  mental_health: { icon: 'leaf', tone: 'teal' },
};

const DAILY: { key: 'food' | 'fitness' | 'medication' | 'family'; icon: IconName; tone: AccentTone; href: Href }[] = [
  { key: 'food', icon: 'restaurant', tone: 'orange', href: '/food' },
  { key: 'fitness', icon: 'barbell', tone: 'teal', href: '/fitness' },
  { key: 'medication', icon: 'alarm', tone: 'pink', href: '/medication' },
  { key: 'family', icon: 'people', tone: 'purple', href: '/account/family' },
];

/** Everything the platform offers, grouped like a consumer super-app. */
export function ServicesScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { colors, radius } = useTheme();

  const top: { label: string; icon: IconName; tone: AccentTone; href: Href }[] = [
    { label: t('match.entry'), icon: 'search', tone: 'blue', href: '/care/match' },
    { label: t('restaurants.title'), icon: 'restaurant', tone: 'orange', href: '/food' },
    { label: t('gym.title'), icon: 'barbell', tone: 'teal', href: '/fitness' },
    { label: t('meds.title'), icon: 'alarm', tone: 'pink', href: '/medication' },
    { label: t('chat.title'), icon: 'chatbubble-ellipses', tone: 'green', href: '/chat' },
  ];

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <PageTitle title={t('services.title')} />

        <HScroll gap={4}>
          {top.map((item) => (
            <PressableScale
              key={item.label}
              onPress={() => router.push(item.href)}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              scaleTo={0.95}
              style={styles.topItem}>
              <IconBadge icon={item.icon} tone={item.tone} size={58} />
              <Text variant="label" align="center" numberOfLines={2} style={styles.topLabel}>
                {item.label}
              </Text>
            </PressableScale>
          ))}
        </HScroll>

        <PressableScale
          onPress={() => router.push('/care/match')}
          accessibilityRole="button"
          accessibilityLabel={`${t('match.entry')}. ${t('match.entrySub')}`}
          scaleTo={0.98}
          style={[styles.finder, { backgroundColor: colors.accentSurfaces.blue, borderRadius: radius.lg }]}>
          <IconBadge icon="search" tone="blue" size={46} shape="rounded" style={{ backgroundColor: colors.background }} />
          <View style={styles.flex}>
            <Text variant="bodyStrong">{t('match.entry')}</Text>
            <Text variant="caption" color="textSecondary">
              {t('match.entrySub')}
            </Text>
          </View>
          <Icon name="arrow-forward" size={20} color={colors.accents.blue} />
        </PressableScale>

        <View style={styles.group}>
          <SectionTitle title={t('services.careGroup')} subtitle={t('services.careGroupSub')} />
          <View style={styles.grid}>
            {careServiceOrder.map((service) => (
              <View key={service} style={styles.cell}>
                <Tile
                  label={careServiceLabel(service)}
                  icon={CARE[service].icon}
                  tone={CARE[service].tone}
                  onPress={() => router.push(`/care/providers?service=${service}`)}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.group}>
          <SectionTitle title={t('services.dailyGroup')} />
          <View style={styles.grid}>
            {DAILY.map((item) => (
              <View key={item.key} style={styles.cell}>
                <Tile label={t(`services.${item.key}`)} icon={item.icon} tone={item.tone} onPress={() => router.push(item.href)} />
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.note, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
          <Text variant="caption" color="textSecondary">
            {t('providers.prescribeNote')}
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: tabBarClearance, gap: 20, justifyContent: 'flex-start' },
  topItem: { width: 80, alignItems: 'center', gap: 8 },
  topLabel: { minHeight: 34 },
  finder: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, marginHorizontal: gutter },
  group: { gap: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: gutter, gap: 10 },
  cell: { width: '47.8%', flexGrow: 1 },
  note: { marginHorizontal: gutter, padding: 14 },
  flex: { flex: 1, gap: 2 },
});
