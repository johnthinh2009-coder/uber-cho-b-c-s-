import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useGuestGate } from '@/components/auth/guest-gate';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Screen } from '@/components/ui/screen';
import { PageTitle, SectionTitle } from '@/components/ui/section';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { dosesForToday, useReminderStore } from '@/store/reminder-store';
import { toast } from '@/store/toast-store';
import { gutter, useTheme } from '@/theme';
import { formatClock } from '@/utils/date';

/** Reminders the person created themselves – no pre-made medicine templates. */
export function MedicationScreen() {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const { t } = useI18n();
  const { requireAccount } = useGuestGate();

  const reminders = useReminderStore((s) => s.reminders);
  const outcomes = useReminderStore((s) => s.outcomes);
  const setOutcome = useReminderStore((s) => s.setOutcome);

  const doses = useMemo(() => dosesForToday(reminders, outcomes), [reminders, outcomes]);
  const done = doses.filter((dose) => dose.outcome === 'taken').length;

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <PageTitle title={t('meds.title')} subtitle={t('meds.doseCount', { done, total: doses.length })} />

        <View style={styles.actions}>
          <Button
            label={t('meds.add')}
            fullWidth
            size="lg"
            onPress={() => requireAccount(() => router.push('/medication/new'))}
          />
        </View>

        <View style={styles.section}>
          <SectionTitle title={t('meds.today')} />
          <View style={styles.list}>
            {doses.length === 0 ? (
              <View style={[styles.empty, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
                <Text variant="bodyStrong">{t('meds.empty')}</Text>
                <Text variant="caption" color="textSecondary">
                  {t('meds.emptyHint')}
                </Text>
              </View>
            ) : (
              doses.map((dose) => (
                <View key={dose.key} style={[styles.dose, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
                  <View style={styles.doseHead}>
                    <View style={[styles.timeBadge, { backgroundColor: colors.background, borderRadius: radius.sm }]}>
                      <Text variant="captionStrong">{formatClock(dose.time)}</Text>
                    </View>
                    <View style={styles.flex}>
                      <Text variant="bodyStrong" numberOfLines={1}>
                        {dose.reminder.name}
                      </Text>
                      {dose.reminder.dose ? (
                        <Text variant="caption" color="textSecondary" numberOfLines={1}>
                          {dose.reminder.dose}
                        </Text>
                      ) : null}
                    </View>
                    <PressableScale
                      onPress={() => router.push(`/medication/${dose.reminder.id}`)}
                      accessibilityRole="button"
                      accessibilityLabel={`${t('common.edit')}: ${dose.reminder.name}`}
                      scaleTo={0.92}>
                      <Icon name="create-outline" size={20} color={colors.textSecondary} />
                    </PressableScale>
                  </View>

                  {dose.outcome ? (
                    <View style={styles.outcomeRow}>
                      <Icon
                        name={dose.outcome === 'taken' ? 'checkmark-circle' : 'close-circle'}
                        size={18}
                        color={dose.outcome === 'taken' ? colors.accent : colors.textTertiary}
                      />
                      <Text variant="caption" color={dose.outcome === 'taken' ? colors.accent : colors.textTertiary}>
                        {dose.outcome === 'taken' ? t('meds.taken') : t('meds.skipped')}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.buttons}>
                      <Button
                        label={t('meds.markTaken')}
                        size="sm"
                        onPress={() => {
                          setOutcome(dose.key, 'taken');
                          toast.show({ title: t('meds.taken'), tone: 'success' });
                        }}
                      />
                      <Button
                        label={t('meds.markSkipped')}
                        size="sm"
                        variant="soft"
                        onPress={() => setOutcome(dose.key, 'skipped')}
                      />
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        </View>

        {reminders.length > 0 ? (
          <View style={styles.section}>
            <SectionTitle title={t('meds.subtitle')} />
            <View style={styles.list}>
              {reminders.map((reminder) => (
                <PressableScale
                  key={reminder.id}
                  onPress={() => router.push(`/medication/${reminder.id}`)}
                  accessibilityRole="button"
                  accessibilityLabel={`${reminder.name}. ${reminder.times.join(', ')}`}
                  scaleTo={0.99}
                  style={styles.row}>
                  <View style={[styles.rowIcon, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
                    <Icon name="alarm-outline" size={20} color={colors.accents.teal} />
                  </View>
                  <View style={styles.flex}>
                    <Text variant="bodyStrong" numberOfLines={1}>
                      {reminder.name}
                    </Text>
                    <Text variant="caption" color="textSecondary" numberOfLines={1}>
                      {reminder.dose ? `${reminder.dose} · ` : ''}
                      {reminder.times.map(formatClock).join(', ')}
                    </Text>
                  </View>
                  <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
                </PressableScale>
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 40, gap: 18, justifyContent: 'flex-start' },
  actions: { paddingHorizontal: gutter },
  section: { gap: 4 },
  list: { paddingHorizontal: gutter, gap: 10 },
  empty: { padding: 16, gap: 4 },
  dose: { padding: 14, gap: 12 },
  doseHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  timeBadge: { paddingHorizontal: 10, height: 30, alignItems: 'center', justifyContent: 'center' },
  buttons: { flexDirection: 'row', gap: 8 },
  outcomeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
  rowIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1, gap: 2 },
});
