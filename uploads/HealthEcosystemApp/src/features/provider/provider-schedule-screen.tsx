import { useRouter, type Href } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { IconBadge } from '@/components/ui/icon-badge';
import { PressableScale } from '@/components/ui/pressable-scale';
import { RemoteImage } from '@/components/ui/remote-image';
import { Screen } from '@/components/ui/screen';
import { SectionTitle } from '@/components/ui/section';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { useCareStore } from '@/store/care-store';
import { tasksForDate, useProviderWorkspace } from '@/store/provider-workspace-store';
import { gutter, tabBarClearance, useTheme, type AccentTone } from '@/theme';
import { dateKey, formatLongDate, formatTime, todayKey } from '@/utils/date';

type TimelineEntry = {
  id: string;
  time: string;
  minutes: number;
  title: string;
  subtitle: string;
  kind: 'visit' | 'break' | 'task';
  imageUrl?: string;
  href?: Href;
};

function toMinutes(time: string): number {
  const [h = '0', m = '0'] = time.split(':');
  return Number(h) * 60 + Number(m);
}

function shiftDay(key: string, days: number): string {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y!, (m ?? 1) - 1, d ?? 1);
  date.setDate(date.getDate() + days);
  return dateKey(date);
}

/**
 * The professional's daily workspace: what is happening today, what still has
 * to be done, and shortcuts into notes and availability.
 */
export function ProviderScheduleScreen() {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const { t } = useI18n();

  const appointments = useCareStore((s) => s.appointments);
  const loadCare = useCareStore((s) => s.load);
  const tasks = useProviderWorkspace((s) => s.tasks);
  const notes = useProviderWorkspace((s) => s.notes);
  const hours = useProviderWorkspace((s) => s.hours);

  const [day, setDay] = useState(todayKey());

  useEffect(() => {
    void loadCare();
  }, [loadCare]);

  const dayTasks = useMemo(() => tasksForDate(tasks, day), [tasks, day]);

  const timeline = useMemo(() => {
    const entries: TimelineEntry[] = appointments
      .filter((appointment) => dateKey(new Date(appointment.startsAt)) === day && appointment.status !== 'cancelled')
      .map((appointment) => ({
        id: appointment.id,
        time: formatTime(appointment.startsAt),
        minutes: toMinutes(formatTime(appointment.startsAt)),
        title: appointment.patientName,
        subtitle: `${t('work.homeVisit')} · ${appointment.reason}`,
        kind: 'visit' as const,
        imageUrl: appointment.patientAvatarUrl,
        href: `/work/visit/${appointment.id}` as Href,
      }));

    for (const task of dayTasks.active) {
      if (!task.time) continue;
      entries.push({
        id: task.id,
        time: task.time,
        minutes: toMinutes(task.time),
        title: task.title,
        subtitle: task.note || t('work.tasks.title'),
        kind: 'task',
        href: '/work/tasks',
      });
    }

    if (entries.length > 0) {
      entries.push({
        id: 'lunch',
        time: '12:00',
        minutes: toMinutes('12:00'),
        title: t('work.lunch'),
        subtitle: '12:00 – 13:30',
        kind: 'break',
      });
    }

    return entries.sort((a, b) => a.minutes - b.minutes);
  }, [appointments, day, dayTasks.active, t]);

  const visitCount = timeline.filter((entry) => entry.kind === 'visit').length;
  const isToday = day === todayKey();

  const quickActions: { key: string; label: string; icon: IconName; tone: AccentTone; href: Href; meta: string }[] = [
    {
      key: 'tasks',
      label: t('work.tasks.title'),
      icon: 'checkbox',
      tone: 'blue',
      href: '/work/tasks',
      meta: t('work.tasks.subtitle', { count: dayTasks.active.length }),
    },
    {
      key: 'notes',
      label: t('work.notes.title'),
      icon: 'document-text',
      tone: 'purple',
      href: '/work/notes',
      meta: `${notes.length}`,
    },
    {
      key: 'hours',
      label: t('work.hours.title'),
      icon: 'time',
      tone: 'green',
      href: '/work/hours',
      meta: hours ? t('work.hours.subtitle') : t('work.hours.empty'),
    },
  ];

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text variant="pageTitle" accessibilityRole="header">
            {t('work.title')}
          </Text>
          <Text variant="bodySmall" color="textSecondary">
            {t('work.summaryLine', { visits: visitCount, tasks: dayTasks.active.length })}
          </Text>
        </View>

        {/* Date navigation */}
        <View style={[styles.dateBar, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
          <PressableScale
            onPress={() => setDay(shiftDay(day, -1))}
            accessibilityRole="button"
            accessibilityLabel={t('work.prevDay')}
            scaleTo={0.9}
            style={styles.dateButton}>
            <Icon name="chevron-back" size={20} color={colors.text} />
          </PressableScale>
          <PressableScale
            onPress={() => setDay(todayKey())}
            accessibilityRole="button"
            accessibilityLabel={t('work.today')}
            scaleTo={0.98}
            style={styles.dateLabel}>
            <Text variant="bodyStrong" numberOfLines={1} align="center">
              {isToday ? t('work.todayLabel', { date: formatLongDate(day).replace(/^[^,]+,\s*/, '') }) : formatLongDate(day)}
            </Text>
          </PressableScale>
          <PressableScale
            onPress={() => setDay(shiftDay(day, 1))}
            accessibilityRole="button"
            accessibilityLabel={t('work.nextDay')}
            scaleTo={0.9}
            style={styles.dateButton}>
            <Icon name="chevron-forward" size={20} color={colors.text} />
          </PressableScale>
        </View>

        {/* Timeline */}
        <View style={styles.section}>
          <SectionTitle title={t('work.timeline')} />
          <View style={styles.list}>
            {timeline.length === 0 ? (
              <View style={[styles.empty, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
                <Text variant="bodyStrong">{t('work.emptyTimeline')}</Text>
                <Text variant="caption" color="textSecondary">
                  {t('work.emptyTimelineHint')}
                </Text>
              </View>
            ) : (
              timeline.map((entry) => {
                const body = (
                  <>
                    <View style={styles.timeCol}>
                      <Text variant="bodySmallStrong">{entry.time}</Text>
                    </View>
                    <View style={[styles.rail, { backgroundColor: entry.kind === 'break' ? colors.borderStrong : colors.primary }]} />
                    {entry.imageUrl ? (
                      <RemoteImage uri={entry.imageUrl} style={styles.avatar} borderRadius={radius.md} fallbackIcon="person-outline" />
                    ) : (
                      <IconBadge
                        icon={entry.kind === 'break' ? 'cafe' : 'checkbox'}
                        tone={entry.kind === 'break' ? 'orange' : 'blue'}
                        size={44}
                        shape="rounded"
                      />
                    )}
                    <View style={styles.flex}>
                      <Text variant="bodyStrong" numberOfLines={1}>
                        {entry.title}
                      </Text>
                      <Text variant="caption" color="textSecondary" numberOfLines={2}>
                        {entry.subtitle}
                      </Text>
                    </View>
                    {entry.href ? <Icon name="chevron-forward" size={18} color={colors.textTertiary} /> : null}
                  </>
                );

                if (!entry.href) {
                  return (
                    <View key={entry.id} style={styles.entry}>
                      {body}
                    </View>
                  );
                }
                return (
                  <PressableScale
                    key={entry.id}
                    onPress={() => router.push(entry.href!)}
                    accessibilityRole="button"
                    accessibilityLabel={`${entry.time} ${entry.title}. ${entry.subtitle}`}
                    scaleTo={0.99}
                    style={styles.entry}>
                    {body}
                  </PressableScale>
                );
              })
            )}
          </View>
        </View>

        {/* Quick actions */}
        <View style={styles.section}>
          <SectionTitle title={t('work.quickActions')} />
          <View style={styles.list}>
            {quickActions.map((action) => (
              <PressableScale
                key={action.key}
                onPress={() => router.push(action.href)}
                accessibilityRole="button"
                accessibilityLabel={`${action.label}. ${action.meta}`}
                scaleTo={0.98}
                style={[styles.action, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
                <IconBadge icon={action.icon} tone={action.tone} size={46} shape="rounded" />
                <View style={styles.flex}>
                  <Text variant="bodyStrong">{action.label}</Text>
                  <Text variant="caption" color="textSecondary" numberOfLines={1}>
                    {action.meta}
                  </Text>
                </View>
                <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
              </PressableScale>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: tabBarClearance, gap: 18, justifyContent: 'flex-start' },
  header: { paddingHorizontal: gutter, paddingTop: 6, gap: 2 },
  dateBar: { flexDirection: 'row', alignItems: 'center', marginHorizontal: gutter, padding: 6 },
  dateButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  dateLabel: { flex: 1, minHeight: 44, justifyContent: 'center' },
  section: { gap: 4 },
  list: { paddingHorizontal: gutter, gap: 10 },
  empty: { padding: 16, gap: 4 },
  entry: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  timeCol: { width: 44 },
  rail: { width: 3, alignSelf: 'stretch', borderRadius: 2, minHeight: 44 },
  avatar: { width: 44, height: 44 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  flex: { flex: 1, gap: 2 },
});
