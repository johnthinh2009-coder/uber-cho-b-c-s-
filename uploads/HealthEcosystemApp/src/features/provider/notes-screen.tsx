import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ScreenHeader } from '@/components/navigation/screen-header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { IconBadge } from '@/components/ui/icon-badge';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { useProviderWorkspace } from '@/store/provider-workspace-store';
import { gutter, useTheme } from '@/theme';
import { formatDateWithYear } from '@/utils/date';

/** Private professional notes. Never rendered on any customer screen. */
export function NotesScreen() {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const { t } = useI18n();
  const notes = useProviderWorkspace((s) => s.notes);

  return (
    <Screen>
      <ScreenHeader title={t('work.notes.title')} subtitle={t('work.notes.subtitle')} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Button label={t('work.notes.add')} fullWidth size="lg" onPress={() => router.push('/work/note/new')} />

        <View style={[styles.privacy, { backgroundColor: colors.accentSurfaces.purple, borderRadius: radius.lg }]}>
          <Icon name="lock-closed" size={16} color={colors.accents.purple} />
          <Text variant="caption" color="textSecondary" style={styles.flex}>
            {t('work.notes.privateNote')}
          </Text>
        </View>

        {notes.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
            <Text variant="bodyStrong">{t('work.notes.empty')}</Text>
            <Text variant="caption" color="textSecondary">
              {t('work.notes.emptyHint')}
            </Text>
          </View>
        ) : (
          notes.map((note) => (
            <PressableScale
              key={note.id}
              onPress={() => router.push(`/work/note/${note.id}`)}
              accessibilityRole="button"
              accessibilityLabel={`${t('work.notes.editTitle')}: ${note.title}`}
              scaleTo={0.99}
              style={[styles.note, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
              <IconBadge icon="document-text" tone="purple" size={44} shape="rounded" />
              <View style={styles.flex}>
                <Text variant="bodyStrong" numberOfLines={1}>
                  {note.title}
                </Text>
                <Text variant="caption" color="textSecondary" numberOfLines={2}>
                  {note.body || t('work.notes.body')}
                </Text>
                <Text variant="label" color="textTertiary">
                  {formatDateWithYear(note.date)}
                </Text>
              </View>
              <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
            </PressableScale>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: gutter, paddingBottom: 40, gap: 12, justifyContent: 'flex-start' },
  privacy: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12 },
  empty: { padding: 16, gap: 4 },
  note: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  flex: { flex: 1, gap: 2 },
});
