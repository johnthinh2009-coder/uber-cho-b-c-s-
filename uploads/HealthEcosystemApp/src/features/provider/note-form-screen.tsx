import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { ScreenHeader } from '@/components/navigation/screen-header';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { useProviderWorkspace } from '@/store/provider-workspace-store';
import { toast } from '@/store/toast-store';
import { gutter } from '@/theme';
import { todayKey } from '@/utils/date';

function toIso(input: string): string {
  const match = input.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return '';
  const [, d, m, y] = match;
  return `${y}-${m!.padStart(2, '0')}-${d!.padStart(2, '0')}`;
}

function fromIso(iso: string): string {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return '';
  const [, y, m, d] = match;
  return `${d}/${m}/${y}`;
}

export function NoteFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { t } = useI18n();

  const existing = useProviderWorkspace((s) => s.notes.find((note) => note.id === id));
  const addNote = useProviderWorkspace((s) => s.addNote);
  const updateNote = useProviderWorkspace((s) => s.updateNote);
  const removeNote = useProviderWorkspace((s) => s.removeNote);

  const [title, setTitle] = useState(existing?.title ?? '');
  const [body, setBody] = useState(existing?.body ?? '');
  const [dateText, setDateText] = useState(fromIso(existing?.date ?? todayKey()));
  const [error, setError] = useState('');

  const submit = () => {
    if (!title.trim()) {
      setError(t('work.notes.titleRequired'));
      return;
    }
    const payload = { title: title.trim(), body: body.trim(), date: toIso(dateText) || todayKey() };
    if (existing) {
      updateNote(existing.id, payload);
      toast.show({ title: t('work.notes.updated'), tone: 'success' });
    } else {
      addNote(payload);
      toast.show({ title: t('work.notes.saved'), tone: 'success' });
    }
    router.back();
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScreenHeader title={existing ? t('work.notes.editTitle') : t('work.notes.addTitle')} mode="close" />
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <Field label={t('work.notes.noteTitle')} value={title} onChangeText={setTitle} error={error} icon="text-outline" />
          <Field label={t('work.notes.date')} value={dateText} onChangeText={setDateText} placeholder="23/08/2026" icon="calendar-outline" />
          <Field
            label={t('work.notes.body')}
            value={body}
            onChangeText={setBody}
            multiline
            numberOfLines={6}
            style={styles.body}
            icon="document-text-outline"
          />

          <Text variant="label" color="textTertiary">
            {t('work.notes.privateNote')}
          </Text>

          <Button label={t('work.notes.save')} fullWidth size="lg" onPress={submit} style={styles.cta} />

          {existing ? (
            <Button
              label={t('work.notes.delete')}
              variant="danger"
              fullWidth
              onPress={() => {
                removeNote(existing.id);
                toast.show({ title: t('work.notes.deleted'), tone: 'neutral' });
                router.back();
              }}
            />
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: gutter, paddingBottom: 40, gap: 16, justifyContent: 'flex-start' },
  body: { minHeight: 120, textAlignVertical: 'top' },
  cta: { marginTop: 8 },
});
