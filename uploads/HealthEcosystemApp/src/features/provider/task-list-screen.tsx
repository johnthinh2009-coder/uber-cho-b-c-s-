import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ScreenHeader } from '@/components/navigation/screen-header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { tasksForDate, useProviderWorkspace, type TaskPriority, type WorkTask } from '@/store/provider-workspace-store';
import { gutter, hitSlop, useTheme } from '@/theme';
import { dateKey, formatClock, formatLongDate, todayKey } from '@/utils/date';

const PRIORITY_TONE: Record<TaskPriority, 'coral' | 'blue' | 'teal'> = { high: 'coral', normal: 'blue', low: 'teal' };

function shiftDay(key: string, days: number): string {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y!, (m ?? 1) - 1, d ?? 1);
  date.setDate(date.getDate() + days);
  return dateKey(date);
}

/** Tick list: active work on top, completed underneath, both tappable. */
export function TaskListScreen() {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const { t } = useI18n();

  const tasks = useProviderWorkspace((s) => s.tasks);
  const toggleTask = useProviderWorkspace((s) => s.toggleTask);
  const [day, setDay] = useState(todayKey());

  const { active, done } = useMemo(() => tasksForDate(tasks, day), [tasks, day]);

  const renderTask = (task: WorkTask) => (
    <View key={task.id} style={[styles.task, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
      <PressableScale
        onPress={() => toggleTask(task.id)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.done }}
        accessibilityLabel={`${task.done ? t('work.tasks.markActive') : t('work.tasks.markDone')}: ${task.title}`}
        scaleTo={0.9}
        hitSlop={hitSlop}
        style={[
          styles.checkbox,
          {
            borderColor: task.done ? colors.primary : colors.borderStrong,
            backgroundColor: task.done ? colors.primary : 'transparent',
          },
        ]}>
        {task.done ? <Icon name="checkmark" size={17} color={colors.onPrimary} /> : null}
      </PressableScale>

      <PressableScale
        onPress={() => router.push(`/work/task/${task.id}`)}
        accessibilityRole="button"
        accessibilityLabel={`${t('work.tasks.editTitle')}: ${task.title}`}
        scaleTo={0.99}
        style={styles.taskBody}>
        <Text variant="bodyStrong" numberOfLines={2} color={task.done ? 'textTertiary' : 'text'} style={task.done ? styles.doneText : undefined}>
          {task.title}
        </Text>
        <View style={styles.metaRow}>
          {task.time ? (
            <Text variant="label" color="textSecondary">
              {formatClock(task.time)}
            </Text>
          ) : null}
          <View style={[styles.priorityDot, { backgroundColor: colors.accents[PRIORITY_TONE[task.priority]] }]} />
          <Text variant="label" color="textSecondary" numberOfLines={1} style={styles.flex}>
            {t(`work.tasks.priority${task.priority === 'high' ? 'High' : task.priority === 'low' ? 'Low' : 'Normal'}` as 'work.tasks.priorityNormal')}
            {task.note ? ` · ${task.note}` : ''}
          </Text>
        </View>
      </PressableScale>
    </View>
  );

  return (
    <Screen>
      <ScreenHeader title={t('work.tasks.title')} subtitle={t('work.tasks.subtitle', { count: active.length })} />

      <View style={styles.dateBarWrap}>
        <View style={[styles.dateBar, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
          <PressableScale onPress={() => setDay(shiftDay(day, -1))} accessibilityRole="button" accessibilityLabel={t('work.prevDay')} scaleTo={0.9} style={styles.dateButton}>
            <Icon name="chevron-back" size={20} color={colors.text} />
          </PressableScale>
          <Text variant="bodyStrong" align="center" numberOfLines={1} style={styles.flex}>
            {day === todayKey() ? t('work.today') : formatLongDate(day)}
          </Text>
          <PressableScale onPress={() => setDay(shiftDay(day, 1))} accessibilityRole="button" accessibilityLabel={t('work.nextDay')} scaleTo={0.9} style={styles.dateButton}>
            <Icon name="chevron-forward" size={20} color={colors.text} />
          </PressableScale>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Button label={t('work.tasks.add')} fullWidth size="lg" onPress={() => router.push(`/work/task/new?date=${day}`)} />

        {active.length === 0 && done.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
            <Text variant="bodyStrong">{t('work.tasks.empty')}</Text>
            <Text variant="caption" color="textSecondary">
              {t('work.tasks.emptyHint')}
            </Text>
          </View>
        ) : null}

        {active.length > 0 ? (
          <View style={styles.group}>
            <Text variant="sectionSmall">{t('work.tasks.active')}</Text>
            {active.map(renderTask)}
          </View>
        ) : null}

        {done.length > 0 ? (
          <View style={styles.group}>
            <Text variant="sectionSmall" color="textSecondary">
              {t('work.tasks.completed')} ({done.length})
            </Text>
            {done.map(renderTask)}
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  dateBarWrap: { paddingHorizontal: gutter, paddingBottom: 12 },
  dateBar: { flexDirection: 'row', alignItems: 'center', padding: 4 },
  dateButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: gutter, paddingBottom: 40, gap: 16, justifyContent: 'flex-start' },
  group: { gap: 10 },
  empty: { padding: 16, gap: 4 },
  task: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  checkbox: { width: 28, height: 28, borderRadius: 9, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  taskBody: { flex: 1, gap: 4 },
  doneText: { textDecorationLine: 'line-through' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  flex: { flex: 1 },
});
