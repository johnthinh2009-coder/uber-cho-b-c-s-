import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { RemoteImage } from '@/components/ui/remote-image';
import { Text } from '@/components/ui/text';
import { availabilityLabel, providerDisplayName, providerRoleShortLabel, type Provider } from '@/domain';
import { useI18n } from '@/i18n';
import { useTheme } from '@/theme';
import { formatDistance, formatRating } from '@/utils/format';

type ProviderCardProps = {
  provider: Provider;
  onPress: (provider: Provider) => void;
  /** 'carousel' = fixed-width tile (Home), 'row' = full-width list row. */
  layout?: 'carousel' | 'row';
};

export const PROVIDER_CARD_WIDTH = 164;

/**
 * A healthcare professional. The profession is always stated plainly – a
 * nurse or therapist is never presented as a doctor.
 */
export const ProviderCard = memo(function ProviderCard({ provider, onPress, layout = 'carousel' }: ProviderCardProps) {
  const { colors, radius } = useTheme();
  const { t } = useI18n();
  const name = providerDisplayName(provider);
  const role = providerRoleShortLabel(provider.role);
  const available = provider.availability === 'available_now';
  const a11y = t('cards.providerA11y', {
    name,
    role,
    expertise: provider.expertise,
    rating: formatRating(provider.rating.average),
  });

  const meta = `${formatRating(provider.rating.average)} · ${formatDistance(provider.distanceKm)} · ${
    available ? t('cards.availableNow') : availabilityLabel(provider.availability)
  }`;

  if (layout === 'row') {
    return (
      <PressableScale onPress={() => onPress(provider)} accessibilityRole="button" accessibilityLabel={a11y} scaleTo={0.99} style={styles.row}>
        <RemoteImage uri={provider.portraitUrl} style={styles.thumb} borderRadius={radius.md} fallbackIcon="person-outline" />
        <View style={styles.rowText}>
          <View style={styles.nameRow}>
            <Text variant="bodyStrong" numberOfLines={1} style={styles.flex}>
              {name}
            </Text>
            {provider.verified ? <Icon name="shield-checkmark" size={15} color={colors.accent} accessibilityLabel={t('common.verified')} /> : null}
          </View>
          <Text variant="caption" color="textSecondary" numberOfLines={1}>
            {role} · {provider.expertise}
          </Text>
          <View style={styles.metaRow}>
            <Icon name="star" size={13} color={colors.text} />
            <Text variant="caption" color="textSecondary" numberOfLines={1} style={styles.flex}>
              {meta}
            </Text>
          </View>
        </View>
        <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
      </PressableScale>
    );
  }

  return (
    <PressableScale
      onPress={() => onPress(provider)}
      accessibilityRole="button"
      accessibilityLabel={a11y}
      scaleTo={0.97}
      style={[styles.card, { width: PROVIDER_CARD_WIDTH }]}>
      <RemoteImage uri={provider.portraitUrl} aspectRatio={1} borderRadius={radius.md} fallbackIcon="person-outline" />
      <View style={styles.body}>
        <View style={styles.nameRow}>
          <Text variant="bodySmallStrong" numberOfLines={1} style={styles.flex}>
            {name}
          </Text>
          {provider.verified ? <Icon name="shield-checkmark" size={14} color={colors.accent} accessibilityLabel={t('common.verified')} /> : null}
        </View>
        <Text variant="label" color="textSecondary" numberOfLines={1}>
          {role}
        </Text>
        <View style={styles.metaRow}>
          <Icon name="star" size={12} color={colors.text} />
          <Text variant="label" color="textSecondary" numberOfLines={1} style={styles.flex}>
            {formatRating(provider.rating.average)} · {formatDistance(provider.distanceKm)}
          </Text>
        </View>
      </View>
    </PressableScale>
  );
});

const styles = StyleSheet.create({
  card: { gap: 8 },
  body: { gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  thumb: { width: 60, height: 60 },
  rowText: { flex: 1, gap: 2 },
});
