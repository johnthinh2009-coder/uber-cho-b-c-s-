import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ScreenHeader } from '@/components/navigation/screen-header';
import { Icon } from '@/components/ui/icon';
import { IconBadge } from '@/components/ui/icon-badge';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { ADDRESS_SUGGESTIONS, CURRENT_LOCATION, useLocationStore, type DeliveryAddress } from '@/store/location-store';
import { toast } from '@/store/toast-store';
import { gutter, useTheme } from '@/theme';

/**
 * Delivery address picker.
 *
 * "Use my current location" is mocked to a fixed address – no native
 * geolocation call – so the web preview can never crash on a permission API.
 */
export function LocationScreen() {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const { t } = useI18n();
  const address = useLocationStore((s) => s.address);
  const setAddress = useLocationStore((s) => s.setAddress);

  const [mode, setMode] = useState<'choose' | 'search'>('choose');
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ADDRESS_SUGGESTIONS;
    return ADDRESS_SUGGESTIONS.filter((item) => item.line.toLowerCase().includes(q) || item.label.toLowerCase().includes(q));
  }, [query]);

  const choose = (next: DeliveryAddress) => {
    setAddress(next);
    toast.show({ title: t('restaurants.addressSaved'), message: next.line, tone: 'success' });
    router.back();
  };

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScreenHeader
          title={mode === 'choose' ? t('restaurants.chooseAddress') : t('restaurants.searchAddress')}
          subtitle={mode === 'choose' ? t('restaurants.chooseAddressHint') : undefined}
          mode="close"
          onBack={mode === 'search' ? () => setMode('choose') : undefined}
        />

        {mode === 'choose' ? (
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <PressableScale
              onPress={() => choose(CURRENT_LOCATION)}
              accessibilityRole="button"
              accessibilityLabel={`${t('restaurants.useCurrent')}. ${CURRENT_LOCATION.line}`}
              scaleTo={0.98}
              style={[styles.option, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
              <IconBadge icon="navigate" tone="blue" size={44} shape="rounded" />
              <View style={styles.flex}>
                <Text variant="bodyStrong">{t('restaurants.useCurrent')}</Text>
                <Text variant="caption" color="textSecondary">
                  {t('restaurants.useCurrentHint')}
                </Text>
              </View>
              <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
            </PressableScale>

            <PressableScale
              onPress={() => setMode('search')}
              accessibilityRole="button"
              accessibilityLabel={`${t('restaurants.enterOther')}. ${t('restaurants.enterOtherHint')}`}
              scaleTo={0.98}
              style={[styles.option, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
              <IconBadge icon="search" tone="green" size={44} shape="rounded" />
              <View style={styles.flex}>
                <Text variant="bodyStrong">{t('restaurants.enterOther')}</Text>
                <Text variant="caption" color="textSecondary">
                  {t('restaurants.enterOtherHint')}
                </Text>
              </View>
              <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
            </PressableScale>

            {address ? (
              <View style={styles.block}>
                <Text variant="label" color="textTertiary">
                  {t('restaurants.deliverTo')}
                </Text>
                <View style={[styles.current, { borderColor: colors.primary, borderRadius: radius.lg }]}>
                  <Icon name="location" size={18} color={colors.primary} />
                  <Text variant="bodySmall" style={styles.flex}>
                    {address.line}
                  </Text>
                  <Icon name="checkmark-circle" size={20} color={colors.primary} />
                </View>
              </View>
            ) : null}
          </ScrollView>
        ) : (
          <>
            <View style={styles.searchWrap}>
              <View style={[styles.search, { backgroundColor: colors.surface, borderRadius: radius.pill }]}>
                <Icon name="search" size={19} color={colors.textTertiary} />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder={t('restaurants.addressPlaceholder')}
                  placeholderTextColor={colors.textTertiary}
                  accessibilityLabel={t('restaurants.addressPlaceholder')}
                  autoFocus
                  style={[styles.searchInput, { color: colors.text }]}
                />
              </View>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
              <Text variant="label" color="textTertiary">
                {t('restaurants.suggestions')}
              </Text>
              {results.map((item) => (
                <PressableScale
                  key={item.line}
                  onPress={() => choose(item)}
                  accessibilityRole="button"
                  accessibilityLabel={item.line}
                  scaleTo={0.99}
                  style={styles.suggestion}>
                  <Icon name="location-outline" size={20} color={colors.textSecondary} />
                  <View style={styles.flex}>
                    <Text variant="bodyStrong" numberOfLines={1}>
                      {item.label}
                    </Text>
                    <Text variant="caption" color="textSecondary" numberOfLines={2}>
                      {item.line}
                    </Text>
                  </View>
                </PressableScale>
              ))}
            </ScrollView>
          </>
        )}
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: gutter, paddingBottom: 40, gap: 12, justifyContent: 'flex-start' },
  option: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14 },
  block: { gap: 8, marginTop: 8 },
  current: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderWidth: 1.5 },
  searchWrap: { paddingHorizontal: gutter, paddingBottom: 12 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 48, paddingHorizontal: 16 },
  searchInput: { flex: 1, fontSize: 16, paddingVertical: 0 },
  suggestion: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
});
