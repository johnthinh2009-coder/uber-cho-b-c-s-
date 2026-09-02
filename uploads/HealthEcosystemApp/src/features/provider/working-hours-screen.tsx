import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';

import { ScreenHeader } from '@/components/navigation/screen-header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { TimePicker } from '@/components/ui/time-picker';
import { useI18n } from '@/i18n';
import { DAY_ORDER, useProviderWorkspace, type DayKey } from '@/store/provider-workspace-store';
import { toast } from '@/store/toast-store';
import { gutter, hitSlop, useTheme } from '@/theme';

/** When the professional is willing to take visits. Persisted per weekday. */
export function WorkingHoursScreen() {
  const { colors, radius } = useTheme();
  const { t, tLabel } = useI18n();

  const hours = useProviderWorkspace((s) => s.hours);
  const initialise = useProviderWorkspace((s) => s.initialiseHours);
  const setDayEnabled = useProviderWorkspace((s) => s.setDayEnabled);
  const addBlock = useProviderWorkspace((s) => s.addBlock);
  const updateBlock = useProviderWorkspace((s) => s.updateBlock);
  const removeBlock = useProviderWorkspace((s) => s.removeBlock);

  const [editing, setEditing] = useState<{ day: DayKey; blockId: string; field: 'start' | 'end' } | null>(null);

  if (!hours) {
    return (
      <Screen>
        <ScreenHeader title={t('work.hours.title')} subtitle={t('work.hours.subtitle')} />
        <View style={styles.emptyWrap}>
          <View style={[styles.empty, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
            <Icon name="time-outline" size={40} color={colors.textTertiary} />
            <Text variant="sectionSmall" align="center">
              {t('work.hours.empty')}
            </Text>
            <Text variant="bodySmall" color="textSecondary" align="center">
              {t('work.hours.emptyHint')}
            </Text>
            <Button
              label={t('work.hours.setup')}
              size="lg"
              onPress={() => {
                initialise();
                toast.show({ title: t('work.hours.saved'), tone: 'success' });
              }}
              style={styles.setupButton}
            />
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader title={t('work.hours.title')} subtitle={t('work.hours.subtitle')} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {DAY_ORDER.map((day) => {
          const schedule = hours[day];
          return (
            <View key={day} style={[styles.day, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
              <View style={styles.dayHead}>
                <View style={styles.flex}>
                  <Text variant="bodyStrong">{tLabel('labels.weekdayFull', day)}</Text>
                  <Text variant="caption" color="textSecondary">
                    {schedule.enabled ? t('work.hours.blocks', { count: schedule.blocks.length }) : t('work.hours.closed')}
                  </Text>
                </View>
                <Switch
                  value={schedule.enabled}
                  onValueChange={(value) => setDayEnabled(day, value)}
                  accessibilityLabel={`${tLabel('labels.weekdayFull', day)}: ${schedule.enabled ? t('work.hours.closed') : t('work.hours.dayOff')}`}
                  trackColor={{ true: colors.primary, false: colors.surfaceStrong }}
                />
              </View>

              {schedule.enabled ? (
                <View style={styles.blocks}>
                  {schedule.blocks.map((block) => {
                    const editingStart = editing?.blockId === block.id && editing.field === 'start';
                    const editingEnd = editing?.blockId === block.id && editing.field === 'end';
                    return (
                      <View key={block.id} style={[styles.block, { borderColor: colors.border, borderRadius: radius.md }]}>
                        <View style={styles.blockRow}>
                          <PressableScale
                            onPress={() => setEditing(editingStart ? null : { day, blockId: block.id, field: 'start' })}
                            accessibilityRole="button"
                            accessibilityLabel={`${t('work.hours.start')} ${block.start}`}
                            scaleTo={0.97}
                            style={[styles.timeChip, { backgroundColor: editingStart ? colors.primarySoft : colors.background, borderRadius: radius.sm }]}>
                            <Text variant="bodyStrong">{block.start}</Text>
                          </PressableScale>
                          <Text variant="body" color="textSecondary">
                            —
                          </Text>
                          <PressableScale
                            onPress={() => setEditing(editingEnd ? null : { day, blockId: block.id, field: 'end' })}
                            accessibilityRole="button"
                            accessibilityLabel={`${t('work.hours.end')} ${block.end}`}
                            scaleTo={0.97}
                            style={[styles.timeChip, { backgroundColor: editingEnd ? colors.primarySoft : colors.background, borderRadius: radius.sm }]}>
                            <Text variant="bodyStrong">{block.end}</Text>
                          </PressableScale>
                          <View style={styles.flex} />
                          <PressableScale
                            onPress={() => removeBlock(day, block.id)}
                            accessibilityRole="button"
                            accessibilityLabel={t('work.hours.removeBlock')}
                            scaleTo={0.9}
                            hitSlop={hitSlop}
                            style={styles.iconButton}>
                            <Icon name="trash-outline" size={18} color={colors.danger} />
                          </PressableScale>
                        </View>

                        {editingStart || editingEnd ? (
                          <View style={styles.picker}>
                            <TimePicker
                              label={editingStart ? t('work.hours.start') : t('work.hours.end')}
                              value={editingStart ? block.start : block.end}
                              onChange={(next) => updateBlock(day, block.id, editingStart ? { start: next } : { end: next })}
                            />
                          </View>
                        ) : null}
                      </View>
                    );
                  })}

                  <PressableScale
                    onPress={() => addBlock(day)}
                    accessibilityRole="button"
                    accessibilityLabel={`${t('work.hours.addBlock')} ${tLabel('labels.weekdayFull', day)}`}
                    scaleTo={0.98}
                    style={styles.addBlock}>
                    <Icon name="add" size={18} color={colors.primary} />
                    <Text variant="bodySmallStrong" color={colors.primary}>
                      {t('work.hours.addBlock').replace('+ ', '')}
                    </Text>
                  </PressableScale>
                </View>
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: gutter, paddingBottom: 40, gap: 12, justifyContent: 'flex-start' },
  emptyWrap: { paddingHorizontal: gutter, paddingTop: 12 },
  empty: { padding: 24, alignItems: 'center', gap: 10 },
  setupButton: { marginTop: 8 },
  day: { padding: 14, gap: 12 },
  dayHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  blocks: { gap: 10 },
  block: { borderWidth: 1, padding: 10, gap: 10 },
  blockRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  timeChip: { paddingHorizontal: 14, height: 42, alignItems: 'center', justifyContent: 'center', minWidth: 76 },
  picker: { paddingTop: 4 },
  addBlock: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 44 },
  iconButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1, gap: 2 },
});
