import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ProviderCard } from '@/components/cards/provider-card';
import { ScreenHeader } from '@/components/navigation/screen-header';
import { Chip } from '@/components/ui/chip';
import { HScroll } from '@/components/ui/h-scroll';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { careServiceLabel, careServiceOrder, type CareServiceType, type Provider } from '@/domain';
import { useI18n } from '@/i18n';
import { PROVIDERS } from '@/mocks/providers';
import { gutter, useTheme } from '@/theme';

function isServiceType(value: string | undefined): value is CareServiceType {
  return !!value && (careServiceOrder as string[]).includes(value);
}

/**
 * Every professional who takes home visits, filtered by the service the person
 * needs. The role of each professional is always visible.
 */
export function ProvidersScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { colors, radius } = useTheme();
  const params = useLocalSearchParams<{ service?: string }>();

  const [service, setService] = useState<CareServiceType | null>(isServiceType(params.service) ? params.service : null);

  const providers = useMemo(() => {
    const list = service ? PROVIDERS.filter((p) => p.serviceTypes.includes(service)) : PROVIDERS;
    return [...list].sort((a, b) => a.distanceKm - b.distanceKm);
  }, [service]);

  const openProvider = (provider: Provider) => router.push(`/provider/${provider.id}`);

  return (
    <Screen>
      <ScreenHeader
        title={service ? careServiceLabel(service) : t('providers.title')}
        subtitle={t('providers.subtitle', { count: providers.length })}
      />
      <HScroll accessibilityLabel={t('services.careGroup')} contentContainerStyle={styles.filters}>
        <Chip label={t('providers.allServices')} selected={service === null} onPress={() => setService(null)} />
        {careServiceOrder.map((item) => (
          <Chip
            key={item}
            label={careServiceLabel(item)}
            selected={service === item}
            onPress={() => setService(service === item ? null : item)}
          />
        ))}
      </HScroll>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {providers.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
            <Text variant="bodyStrong">{t('providers.empty')}</Text>
            <Text variant="caption" color="textSecondary">
              {t('providers.emptyHint')}
            </Text>
          </View>
        ) : (
          providers.map((provider) => <ProviderCard key={provider.id} provider={provider} onPress={openProvider} layout="row" />)
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: { paddingHorizontal: gutter, gap: 8, paddingVertical: 12 },
  list: { paddingHorizontal: gutter, paddingBottom: 32, justifyContent: 'flex-start' },
  empty: { padding: 16, gap: 4 },
});
