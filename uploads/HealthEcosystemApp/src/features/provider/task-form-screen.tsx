import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { ScreenHeader } from '@/components/navigation/screen-header';
import { Button } from '@/components/ui/button';
import { Field, SelectField } from '@/components/ui/field';
import { Screen } from '@/components/ui/screen';
import { useI18n } from '@/i18n';
import { useProviderWorkspace, type TaskPriority } from '@/store/provider-workspace-store';
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

function normaliseTime(input: string): string {
  const digits = input.replace(/[^\d]/g, '');
  if (!digits) return '';
  const hours = Math.min(23, Number(digits.slice(0, 2)));
  const minutes = Math.min(59, Number(digits.slice(2, 4) || '0'));
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/** Create or edit one to-do. Saved straight into the local workspace store. */
export function TaskFormScreen() {
  const router = useRouter();
  const { id, date } = useLocalSearchParams<{ id?: string; date?: string }>();
  const { t } = useI18n();

  const existing = useProviderWorkspace((s) => s.tasks.find((task) => task.id === id));
  const addTask = useProviderWorkspace((s) => s.addTask);
  const updateTask = useProviderWorkspace((s) => s.updateTask);
  const removeTask = useProviderWorkspace((s) => s.removeTask);

  const [title, setTitle] = useState(existing?.title ?? '');
  const [dateText, setDateText] = useState(fromIso(existing?.date ?? date ?? todayKey()));
  const [time, setTime] = useState(existing?.time ?? '');
  const [note, setNote] = useState(existing?.note ?? '');
  const [priority, setPriority] = useState<TaskPriority>(existing?.priority ?? 'normal');
  const [error, setError] = useState('');

  const submit = () => {
    if (!title.trim()) {
      setError(t('work.tasks.nameRequired'));
      return;
    }
    const payload = {
      title: title.trim(),
      date: toIso(dateText) || todayKey(),
      time: normaliseTime(time),
      note: note.trim(),
      priority,
    };
    if (existing) {
      updateTask(existing.id, payload);
      toast.show({ title: t('work.tasks.updated'), tone: 'success' });
    } else {
      addTask(payload);
      toast.show({ title: t('work.tasks.saved'), tone: 'success' });
    }
    router.back();
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScreenHeader title={existing ? t('work.tasks.editTitle') : t('work.tasks.addTitle')} mode="close" />
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <Field label={t('work.tasks.name')} value={title} onChangeText={setTitle} error={error} icon="checkbox-outline" />
          <Field label={t('work.tasks.date')} value={dateText} onChangeText={setDateText} placeholder="23/08/2026" icon="calendar-outline" />
          <Field label={t('work.tasks.time')} value={time} onChangeText={setTime} placeholder="08:30" keyboardType="number-pad" icon="time-outline" />
          <Field label={t('work.tasks.note')} value={note} onChangeText={setNote} multiline icon="document-text-outline" />
          <SelectField
            label={t('work.tasks.priority')}
            value={priority}
            onChange={setPriority}
            options={[
              { value: 'low' as const, label: t('work.tasks.priorityLow') },
              { value: 'normal' as const, label: t('work.tasks.priorityNormal') },
              { value: 'high' as const, label: t('work.tasks.priorityHigh') },
            ]}
          />

          <Button label={t('work.tasks.save')} fullWidth size="lg" onPress={submit} style={styles.cta} />

          {existing ? (
            <Button
              label={t('work.tasks.delete')}
              variant="danger"
              fullWidth
              onPress={() => {
                removeTask(existing.id);
                toast.show({ title: t('work.tasks.deleted'), tone: 'neutral' });
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
  cta: { marginTop: 8 },
});
