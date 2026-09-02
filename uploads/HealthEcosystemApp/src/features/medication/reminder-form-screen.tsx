import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { ScreenHeader } from '@/components/navigation/screen-header';
import { Button } from '@/components/ui/button';
import { Field, SelectField } from '@/components/ui/field';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { useReminderStore, type AlarmSound, type AlarmVolume, type RepeatRule } from '@/store/reminder-store';
import { toast } from '@/store/toast-store';
import { gutter, useTheme } from '@/theme';

/** Normalises "8", "8:5", "08:05" → "08:05"; returns '' when unusable. */
function normaliseTime(input: string): string {
  const digits = input.replace(/[^\d]/g, '');
  if (digits.length === 0) return '';
  const hours = Number(digits.slice(0, 2));
  const minutes = Number(digits.slice(2, 4) || '0');
  if (Number.isNaN(hours) || hours > 23 || minutes > 59) return '';
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function ReminderFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { colors, radius } = useTheme();
  const { t } = useI18n();

  const existing = useReminderStore((s) => s.reminders.find((r) => r.id === id));
  const add = useReminderStore((s) => s.add);
  const update = useReminderStore((s) => s.update);
  const remove = useReminderStore((s) => s.remove);

  const [name, setName] = useState(existing?.name ?? '');
  const [dose, setDose] = useState(existing?.dose ?? '');
  const [times, setTimes] = useState<string[]>(existing?.times ?? ['08:00']);
  const [timeDraft, setTimeDraft] = useState('');
  const [repeat, setRepeat] = useState<RepeatRule>(existing?.repeat ?? 'daily');
  const [snooze, setSnooze] = useState(existing?.snoozeCount ?? 2);
  const [sound, setSound] = useState<AlarmSound>(existing?.sound ?? 'gentle');
  const [volume, setVolume] = useState<AlarmVolume>(existing?.volume ?? 'medium');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addTime = () => {
    const value = normaliseTime(timeDraft);
    if (!value || times.includes(value)) return;
    setTimes([...times, value].sort());
    setTimeDraft('');
  };

  const submit = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = t('meds.nameRequired');
    if (times.length === 0) next.times = t('meds.timeRequired');
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const payload = { name: name.trim(), dose: dose.trim(), times, repeat, snoozeCount: snooze, sound, volume };
    if (existing) update(existing.id, payload);
    else add(payload);
    toast.show({ title: t('meds.saved'), tone: 'success' });
    router.back();
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScreenHeader title={existing ? t('meds.editTitle') : t('meds.addTitle')} mode="close" />
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <Field label={t('meds.name')} value={name} onChangeText={setName} error={errors.name} icon="medical-outline" />
          <Field label={t('meds.dose')} value={dose} onChangeText={setDose} hint={t('meds.doseHint')} icon="eyedrop-outline" />

          <View style={styles.block}>
            <Text variant="label" color="textSecondary">
              {t('meds.times')}
            </Text>
            <View style={styles.timeRow}>
              {times.map((time) => (
                <PressableScale
                  key={time}
                  onPress={() => setTimes(times.filter((item) => item !== time))}
                  accessibilityRole="button"
                  accessibilityLabel={`${time}. ${t('common.remove')}`}
                  scaleTo={0.95}
                  style={[styles.timeChip, { backgroundColor: colors.surface, borderRadius: radius.pill }]}>
                  <Icon name="time-outline" size={15} color={colors.text} />
                  <Text variant="captionStrong">{time}</Text>
                  <Icon name="close" size={14} color={colors.textTertiary} />
                </PressableScale>
              ))}
            </View>
            <View style={styles.addTimeRow}>
              <View style={styles.flex}>
                <Field
                  label={t('meds.timePlaceholder')}
                  value={timeDraft}
                  onChangeText={setTimeDraft}
                  placeholder="20:00"
                  keyboardType="number-pad"
                  onSubmitEditing={addTime}
                  error={errors.times}
                />
              </View>
              <Button label={t('meds.addTime')} variant="soft" onPress={addTime} style={styles.addTimeButton} />
            </View>
          </View>

          <SelectField
            label={t('meds.repeat')}
            value={repeat}
            onChange={setRepeat}
            options={[
              { value: 'daily', label: t('meds.repeatDaily') },
              { value: 'weekdays', label: t('meds.repeatWeekdays') },
              { value: 'alternate', label: t('meds.repeatCustom') },
            ]}
          />

          <SelectField
            label={t('meds.snoozeCount')}
            value={String(snooze)}
            onChange={(value) => setSnooze(Number(value))}
            options={[
              { value: '0', label: '0' },
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
            ]}
          />
          <Text variant="label" color="textTertiary">
            {t('meds.snoozeHint', { count: snooze })}
          </Text>

          <SelectField
            label={t('meds.sound')}
            value={sound}
            onChange={setSound}
            options={[
              { value: 'gentle', label: t('meds.soundGentle') },
              { value: 'classic', label: t('meds.soundClassic') },
              { value: 'vibrate', label: t('meds.soundVibrate') },
            ]}
          />

          <SelectField
            label={t('meds.volume')}
            value={volume}
            onChange={setVolume}
            options={[
              { value: 'low', label: t('meds.volumeLow') },
              { value: 'medium', label: t('meds.volumeMedium') },
              { value: 'high', label: t('meds.volumeHigh') },
            ]}
          />

          <Button label={t('meds.save')} fullWidth size="lg" onPress={submit} style={styles.cta} />

          {existing ? (
            <Button
              label={t('meds.delete')}
              variant="danger"
              fullWidth
              onPress={() => {
                remove(existing.id);
                toast.show({ title: t('meds.deleted'), tone: 'neutral' });
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
  block: { gap: 8 },
  timeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, height: 36 },
  addTimeRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  addTimeButton: { height: 50 },
  cta: { marginTop: 8 },
});
