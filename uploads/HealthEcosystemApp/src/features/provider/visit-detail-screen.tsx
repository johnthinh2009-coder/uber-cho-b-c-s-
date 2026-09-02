import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/feedback/empty-state';
import { ScreenHeader } from '@/components/navigation/screen-header';
import { Badge } from '@/components/ui/badge';
import { RemoteImage } from '@/components/ui/remote-image';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { useCareStore } from '@/store/care-store';
import { gutter, useTheme } from '@/theme';
import { formatRelativeDateTime, formatTime } from '@/utils/date';

/** One scheduled visit, opened from the timeline. */
export function VisitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, radius } = useTheme();
  const { t } = useI18n();
  const appointments = useCareStore((s) => s.appointments);
  const load = useCareStore((s) => s.load);

  useEffect(() => {
    void load();
  }, [load]);

  const appointment = appointments.find((item) => item.id === id);

  if (!appointment) {
    return (
      <Screen>
        <ScreenHeader />
        <EmptyState icon="calendar-outline" title={t('notFound.title')} message={t('notFound.body')} />
      </Screen>
    );
  }

  const rows = [
    { label: t('work.time'), value: `${formatTime(appointment.startsAt)} · ${formatRelativeDateTime(appointment.startsAt)}` },
    { label: t('work.duration'), value: t('provider.schedule.minutes', { minutes: appointment.durationMinutes }) },
    { label: t('work.reason'), value: appointment.reason },
    { label: t('work.address'), value: appointment.addressLabel },
  ];

  return (
    <Screen>
      <ScreenHeader title={t('work.visitDetail')} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.identity}>
          <RemoteImage uri={appointment.patientAvatarUrl} style={styles.avatar} borderRadius={radius.lg} fallbackIcon="person-outline" />
          <View style={styles.flex}>
            <Text variant="label" color="textSecondary">
              {t('work.patient')}
            </Text>
            <Text variant="title" numberOfLines={2}>
              {appointment.patientName}
            </Text>
            <Badge label={t('work.homeVisit')} tone="accent" icon="home-outline" />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
          {rows.map((row) => (
            <View key={row.label} style={styles.row}>
              <Text variant="label" color="textSecondary">
                {row.label}
              </Text>
              <Text variant="body">{row.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: gutter, paddingBottom: 40, gap: 16, justifyContent: 'flex-start' },
  identity: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  avatar: { width: 88, height: 88 },
  card: { padding: 16, gap: 14 },
  row: { gap: 2 },
  flex: { flex: 1, gap: 4 },
});
