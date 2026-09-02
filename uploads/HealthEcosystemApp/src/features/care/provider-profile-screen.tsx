import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/feedback/empty-state';
import { ScreenHeader } from '@/components/navigation/screen-header';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { RemoteImage } from '@/components/ui/remote-image';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import {
  availabilityLabel,
  careServiceLabel,
  isDoctor,
  providerDisplayName,
  providerRoleLabel,
} from '@/domain';
import { useI18n } from '@/i18n';
import { PROVIDERS_BY_ID } from '@/mocks/providers';
import { gutter, useTheme } from '@/theme';
import { formatTimeAgo } from '@/utils/date';
import { formatDistance, formatRating } from '@/utils/format';

/**
 * Professional portfolio. Shows credentials, what they treat, prices and real
 * patient reviews. Sensitive verification documents are never shown publicly –
 * only the fact that the practice record was checked.
 */
export function ProviderProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, radius } = useTheme();
  const { t } = useI18n();
  const provider = id ? PROVIDERS_BY_ID[id] : undefined;

  if (!provider) {
    return (
      <Screen>
        <ScreenHeader />
        <EmptyState icon="person-outline" title={t('notFound.title')} message={t('notFound.body')} />
      </Screen>
    );
  }

  const stats = [
    { label: t('providers.experience', { years: provider.experienceYears }), icon: 'ribbon-outline' as const },
    { label: t('providers.visits', { count: provider.completedVisits.toLocaleString('vi-VN') }), icon: 'home-outline' as const },
    { label: formatDistance(provider.distanceKm), icon: 'location-outline' as const },
  ];

  return (
    <Screen>
      <ScreenHeader compactTitle={providerRoleLabel(provider.role)} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.identity}>
          <RemoteImage uri={provider.portraitUrl} style={styles.portrait} borderRadius={radius.lg} fallbackIcon="person-outline" />
          <View style={styles.identityText}>
            <Text variant="title" numberOfLines={2}>
              {providerDisplayName(provider)}
            </Text>
            <Text variant="bodySmall" color="textSecondary" numberOfLines={2}>
              {providerRoleLabel(provider.role)} · {provider.expertise}
            </Text>
            <View style={styles.ratingRow}>
              <Icon name="star" size={15} color={colors.text} />
              <Text variant="bodySmallStrong">{formatRating(provider.rating.average)}</Text>
              <Text variant="caption" color="textSecondary">
                {t('providers.reviewsCount', { count: provider.rating.count })}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.badges}>
          {provider.verified ? <Badge label={t('providers.verifiedNote')} icon="shield-checkmark" tone="accent" /> : null}
          <Badge label={availabilityLabel(provider.availability)} icon="time-outline" />
          {isDoctor(provider) ? <Badge label={t('providers.canPrescribe')} icon="document-text-outline" /> : null}
        </View>

        <View style={styles.stats}>
          {stats.map((stat) => (
            <View key={stat.label} style={[styles.stat, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
              <Icon name={stat.icon} size={18} color={colors.textSecondary} />
              <Text variant="label" numberOfLines={2} align="center">
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.block}>
          <Text variant="section">{t('providers.about')}</Text>
          <Text variant="body" color="textSecondary">
            {provider.bio}
          </Text>
          <View style={styles.tagRow}>
            {provider.serviceTypes.map((service) => (
              <Badge key={service} label={careServiceLabel(service)} />
            ))}
          </View>
        </View>

        <View style={styles.block}>
          <Text variant="section">{t('providers.servicesTitle')}</Text>
          {provider.services.map((service) => (
            <View key={service.id} style={styles.serviceRow}>
              <View style={styles.flex}>
                <Text variant="bodyStrong">{service.name}</Text>
                <Text variant="caption" color="textSecondary">
                  {service.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.block}>
          <Text variant="section">{t('providers.languages')}</Text>
          <Text variant="body" color="textSecondary">
            {provider.languages.join(' · ')}
          </Text>
        </View>

        <View style={styles.block}>
          <Text variant="section">{t('providers.reviewsTitle')}</Text>
          {provider.reviews.map((review) => (
            <View key={review.id} style={[styles.review, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
              <View style={styles.reviewHead}>
                <RemoteImage uri={review.authorAvatarUrl} style={styles.reviewAvatar} borderRadius={18} fallbackIcon="person-outline" />
                <View style={styles.flex}>
                  <Text variant="bodySmallStrong">{review.authorName}</Text>
                  <Text variant="label" color="textSecondary">
                    {formatTimeAgo(review.date)}
                  </Text>
                </View>
                <View style={styles.ratingRow}>
                  <Icon name="star" size={13} color={colors.text} />
                  <Text variant="label">{formatRating(review.rating)}</Text>
                </View>
              </View>
              <Text variant="bodySmall" color="textSecondary">
                {review.comment}
              </Text>
            </View>
          ))}
        </View>

        {!isDoctor(provider) ? (
          <Text variant="caption" color="textTertiary" style={styles.note}>
            {t('providers.prescribeNote')}
          </Text>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: gutter, paddingBottom: 40, gap: 22 },
  identity: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  portrait: { width: 104, height: 116 },
  identityText: { flex: 1, gap: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, alignItems: 'center', gap: 6, paddingVertical: 14, paddingHorizontal: 8 },
  block: { gap: 10 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  serviceRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  review: { padding: 14, gap: 8 },
  reviewHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reviewAvatar: { width: 36, height: 36 },
  note: { marginTop: -8 },
  flex: { flex: 1 },
});
