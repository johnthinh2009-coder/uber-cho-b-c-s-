import { useRouter, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Keyboard, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { EmptyState } from '@/components/feedback/empty-state';
import { ScreenHeader } from '@/components/navigation/screen-header';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { PressableScale } from '@/components/ui/pressable-scale';
import { RemoteImage } from '@/components/ui/remote-image';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { difficultyLabel, providerDisplayName, providerRoleLabel, type Pillar } from '@/domain';
import { useI18n } from '@/i18n';
import { CONTRACTORS_BY_ID } from '@/mocks/food';
import { services, type SearchResults } from '@/services';
import { gutter, pillarIcon, useTheme } from '@/theme';
import { formatDuration } from '@/utils/date';

type ResultRow = {
  id: string;
  pillar: Pillar;
  title: string;
  subtitle: string;
  imageUrl?: string;
  href: string;
};

type Translate = ReturnType<typeof useI18n>['t'];

function toRows(results: SearchResults, t: Translate): { title: string; rows: ResultRow[] }[] {
  const groups: { title: string; rows: ResultRow[] }[] = [
    {
      title: t('search.groups.services'),
      rows: results.services.map((s) => ({ id: s.id, pillar: s.pillar, title: s.title, subtitle: s.subtitle, href: s.href })),
    },
    {
      title: t('search.groups.providers'),
      rows: results.providers.map((p) => ({
        id: p.id,
        pillar: 'care',
        title: providerDisplayName(p),
        subtitle: `${providerRoleLabel(p.role)} · ${p.expertise}`,
        imageUrl: p.portraitUrl,
        href: `/provider/${p.id}`,
      })),
    },
    {
      title: t('search.groups.meals'),
      rows: results.meals.map((m) => ({
        id: m.id,
        pillar: 'food',
        title: m.name,
        subtitle: `${CONTRACTORS_BY_ID[m.contractorId]?.name ?? ''} · ${m.nutrition.calories} kcal · ${m.nutrition.proteinGrams}g`,
        imageUrl: m.imageUrl,
        href: `/food/meal/${m.id}`,
      })),
    },
    {
      title: t('search.groups.programs'),
      rows: results.programs.map((p) => ({
        id: p.id,
        pillar: 'fitness',
        title: p.title,
        subtitle: `${difficultyLabel(p.difficulty)} · ${formatDuration(p.durationMinutes)} · ${p.goal}`,
        imageUrl: p.heroUrl,
        href: `/fitness/program/${p.id}`,
      })),
    },
  ];
  return groups.filter((group) => group.rows.length > 0);
}

export function SearchScreen() {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const { t, tList } = useI18n();
  const [query, setQuery] = useState('');
  // Results are tagged with the query that produced them, so 'searching' and
  // 'no results' are derived instead of set synchronously inside the effect.
  const [resolved, setResolved] = useState<{ query: string; results: SearchResults } | null>(null);
  const trimmed = query.trim();

  useEffect(() => {
    if (!trimmed) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      const results = await services.search.search(trimmed);
      if (!cancelled) setResolved({ query: trimmed, results });
    }, 220);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmed]);

  const results = trimmed && resolved?.query === trimmed ? resolved.results : null;
  const searching = Boolean(trimmed) && !results;
  const groups = results ? toRows(results, t) : [];
  const open = (href: string) => {
    Keyboard.dismiss();
    router.push(href as Href);
  };

  return (
    <Screen>
      <ScreenHeader
        mode="close"
        right={query ? <IconButton icon="backspace-outline" accessibilityLabel={t('search.clearA11y')} size={40} onPress={() => setQuery('')} /> : null}
      />
      <View style={styles.inputWrap}>
        <View style={[styles.input, { backgroundColor: colors.surface, borderRadius: radius.pill, borderColor: colors.border }]}>
          <Icon name="search-outline" size={20} color={colors.textTertiary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('search.placeholder')}
            placeholderTextColor={colors.textTertiary}
            autoFocus
            returnKeyType="search"
            autoCorrect={false}
            accessibilityLabel={t('search.label')}
            style={[styles.textInput, { color: colors.text }]}
          />
          {searching ? <ActivityIndicator color={colors.textSecondary} /> : null}
        </View>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        {!query ? (
          <View style={styles.suggestions}>
            <Text variant="label" color="textTertiary" style={styles.gutter}>
              {t('search.tryFor')}
            </Text>
            <View style={[styles.chips, styles.gutter]}>
              {tList('search.suggestions').map((s) => (
                <Chip key={s} label={s} onPress={() => setQuery(s)} />
              ))}
            </View>
          </View>
        ) : null}

        {results && groups.length === 0 ? (
          <EmptyState icon="search-outline" title={t('search.noResults', { query: trimmed })} message={t('search.noResultsHint')} />
        ) : null}

        {groups.map((group) => (
          <View key={group.title} style={styles.group}>
            <Text variant="label" color="textTertiary" style={styles.gutter}>
              {group.title}
            </Text>
            {group.rows.map((row) => (
                <PressableScale
                  key={row.id}
                  onPress={() => open(row.href)}
                  accessibilityRole="button"
                  accessibilityLabel={`${row.title}, ${row.subtitle}`}
                  scaleTo={0.985}
                  style={[styles.row, styles.gutter]}>
                  {row.imageUrl ? (
                    <RemoteImage uri={row.imageUrl} style={styles.thumb} borderRadius={radius.md} />
                  ) : (
                    <View style={[styles.thumb, styles.iconThumb, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
                      <Icon name={pillarIcon(row.pillar)} size={22} color={colors.text} />
                    </View>
                  )}
                  <View style={styles.flex}>
                    <Text variant="bodyStrong" numberOfLines={1}>
                      {row.title}
                    </Text>
                    <Text variant="caption" color="textSecondary" numberOfLines={2}>
                      {row.subtitle}
                    </Text>
                  </View>
                  <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
                </PressableScale>
            ))}
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  inputWrap: { paddingHorizontal: gutter, paddingBottom: 12 },
  input: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 52, paddingHorizontal: 16, borderWidth: 1 },
  textInput: { flex: 1, fontSize: 16, fontWeight: '500', paddingVertical: 0 },
  content: { paddingBottom: 40, gap: 24, paddingTop: 8 },
  gutter: { paddingHorizontal: gutter },
  suggestions: { gap: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  group: { gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 8 },
  thumb: { width: 56, height: 56 },
  iconThumb: { alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1, gap: 2 },
});
