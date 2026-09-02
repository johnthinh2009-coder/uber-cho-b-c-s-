import { ScrollView, StyleSheet, View } from 'react-native';

import { ListRow } from '@/components/ui/list-row';
import { Screen } from '@/components/ui/screen';
import { PageTitle, SectionTitle } from '@/components/ui/section';
import { StatGrid } from '@/components/ui/stat-metric-card';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { useProviderWorkspace } from '@/store/provider-workspace-store';
import { gutter, tabBarClearance, useTheme } from '@/theme';

/** Weekly totals for the professional. Demo figures only. */
const WEEK = {
  visits: 14,
  hours: 21,
  newPatients: 4,
  ratedFive: 11,
};

const RECENT = [
  { id: 'sum-1', name: 'Nguyễn Minh Anh', minutes: 40, when: 'Hôm qua · 16:05' },
  { id: 'sum-2', name: 'Lê Thị Lan', minutes: 45, when: 'Hôm qua · 09:30' },
  { id: 'sum-3', name: 'Trần Gia Hân', minutes: 30, when: 'Thứ ba · 14:00' },
];

export function ProviderSummaryScreen() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const tasks = useProviderWorkspace((s) => s.tasks);
  const doneTasks = tasks.filter((task) => task.done).length;
  const openTasks = tasks.length - doneTasks;

  const metrics = [
    { label: t('metrics.appointments'), value: String(WEEK.visits), color: colors.accents.blue },
    { label: t('metrics.tasksDone'), value: String(doneTasks), color: colors.accents.green },
    { label: t('metrics.tasksLeft'), value: String(openTasks), color: colors.accents.orange },
    { label: t('metrics.hours'), value: String(WEEK.hours), unit: 'h', color: colors.accents.teal },
  ];

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <PageTitle title={t('provider.summary.title')} subtitle={t('provider.summary.periodWeek')} />

        <StatGrid metrics={metrics} style={styles.grid} compact />

        <View style={styles.section}>
          <SectionTitle title={t('provider.summary.recent')} />
          <View style={styles.list}>
            {RECENT.map((item) => (
              <ListRow
                key={item.id}
                title={t('provider.summary.completedVisit', { name: item.name })}
                subtitle={item.when}
                icon="checkmark-circle-outline"
                trailing={<Text variant="bodySmallStrong">{t('provider.schedule.minutes', { minutes: item.minutes })}</Text>}
              />
            ))}
          </View>
        </View>

        <Text variant="caption" color="textTertiary" style={styles.note}>
          {t('provider.summary.note')}
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: tabBarClearance, gap: 20 },
  grid: { paddingHorizontal: gutter },
  section: { gap: 4 },
  list: { paddingHorizontal: gutter },
  note: { paddingHorizontal: gutter },
});
