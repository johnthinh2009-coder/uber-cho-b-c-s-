import { useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { IconBadge } from '@/components/ui/icon-badge';
import { PressableScale } from '@/components/ui/pressable-scale';
import { RemoteImage } from '@/components/ui/remote-image';
import { Screen } from '@/components/ui/screen';
import { PageTitle, SectionTitle } from '@/components/ui/section';
import { StatGrid } from '@/components/ui/stat-metric-card';
import { Text } from '@/components/ui/text';
import { fullName, providerRoleLabel } from '@/domain';
import { useI18n } from '@/i18n';
import { useAuthStore } from '@/store/auth-store';
import { useCareStore } from '@/store/care-store';
import { tasksForDate, useProviderWorkspace } from '@/store/provider-workspace-store';
import { useSessionStore } from '@/store/session-store';
import { gutter, tabBarClearance, useTheme } from '@/theme';
import { formatTime, isToday, todayKey } from '@/utils/date';

/** Demo workload for the professional side. */
const VISITS_WEEK = 14;
const HOURS_WEEK = 21;

export function ProviderHomeScreen() {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const { t } = useI18n();
  const provider = useSessionStore((s) => s.provider);
  const application = useAuthStore((s) => s.application);
  const displayName = application?.fullName ?? `${provider.title} ${fullName(provider)}`;
  const displayRole = application ? providerRoleLabel(application.role as typeof provider.role) : providerRoleLabel(provider.role);
  const online = useSessionStore((s) => s.providerOnline);
  const setOnline = useSessionStore((s) => s.setProviderOnline);
  const appointments = useCareStore((s) => s.appointments);
  const tasks = useProviderWorkspace((s) => s.tasks);
  const load = useCareStore((s) => s.load);

  useEffect(() => {
    void load();
  }, [load]);

  const today = useMemo(
    () => appointments.filter((a) => a.status === 'upcoming' && isToday(a.startsAt)),
    [appointments],
  );
  const next = today[0];
  const openTasks = useMemo(() => tasksForDate(tasks, todayKey()).active.length, [tasks]);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <PageTitle
          title={t('provider.home.title')}
          subtitle={`${displayName} · ${displayRole}`}
          right={<Avatar uri={application ? undefined : provider.avatarUrl} name={displayName} size={52} />}
        />

        <View style={[styles.online, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
          <View style={styles.flex}>
            <Text variant="bodyStrong">{t('provider.home.onlineTitle')}</Text>
            <Text variant="caption" color="textSecondary">
              {online ? t('provider.home.online') : t('provider.home.offline')}
            </Text>
          </View>
          <Switch
            value={online}
            onValueChange={setOnline}
            accessibilityLabel={t('provider.home.onlineTitle')}
            trackColor={{ true: colors.accent, false: colors.surfaceStrong }}
          />
        </View>

        <StatGrid
          style={styles.stats}
          compact
          columns={2}
          metrics={[
            { label: t('metrics.appointments'), value: String(today.length), color: colors.accents.blue },
            { label: t('metrics.tasksLeft'), value: String(openTasks), color: colors.accents.orange },
            { label: t('metrics.visits'), value: String(VISITS_WEEK), color: colors.accents.green },
            { label: t('metrics.hours'), value: String(HOURS_WEEK), unit: 'h', color: colors.accents.teal },
          ]}
        />

        <PressableScale
          onPress={() => router.push('/schedule')}
          accessibilityRole="button"
          accessibilityLabel={t('provider.home.openSchedule')}
          scaleTo={0.98}
          style={[styles.scheduleCta, { backgroundColor: colors.primarySoft, borderRadius: radius.lg }]}>
          <IconBadge icon="calendar" tone="green" size={46} shape="rounded" style={{ backgroundColor: colors.background }} />
          <View style={styles.flex}>
            <Text variant="bodyStrong">{t('provider.home.openSchedule')}</Text>
            <Text variant="caption" color="textSecondary">
              {t('work.summaryLine', { visits: today.length, tasks: openTasks })}
            </Text>
          </View>
          <Icon name="chevron-forward" size={18} color={colors.primary} />
        </PressableScale>

        <View style={styles.section}>
          <SectionTitle title={t('provider.home.todayTitle')} />
          <View style={styles.list}>
            {next ? (
              <View style={[styles.visit, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
                <RemoteImage uri={next.patientAvatarUrl} style={styles.avatar} borderRadius={radius.md} fallbackIcon="person-outline" />
                <View style={styles.flex}>
                  <Text variant="bodyStrong" numberOfLines={1}>
                    {next.patientName}
                  </Text>
                  <Text variant="caption" color="textSecondary" numberOfLines={2}>
                    {next.reason}
                  </Text>
                  <Text variant="caption" color="textSecondary" numberOfLines={1}>
                    {next.addressLabel}
                  </Text>
                </View>
                <View style={styles.timeCol}>
                  <Text variant="bodyStrong">{formatTime(next.startsAt)}</Text>
                  <Text variant="label" color="textSecondary">
                    {t('provider.schedule.minutes', { minutes: next.durationMinutes })}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={[styles.visit, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
                <Icon name="calendar-outline" size={22} color={colors.textSecondary} />
                <Text variant="bodyStrong" style={styles.flex}>
                  {t('provider.home.noVisits')}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: tabBarClearance, gap: 16 },
  online: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, marginHorizontal: gutter },
  stats: { paddingHorizontal: gutter },
  scheduleCta: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, marginHorizontal: gutter },
  section: { gap: 4, marginTop: 8 },
  list: { paddingHorizontal: gutter, gap: 10 },
  visit: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  avatar: { width: 48, height: 48 },
  timeCol: { alignItems: 'flex-end', gap: 2 },
  flex: { flex: 1, gap: 2 },
});
