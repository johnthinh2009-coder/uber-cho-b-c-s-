import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';

import { TabBar, type TabConfig } from '@/components/navigation/tab-bar';
import { useI18n } from '@/i18n';
import { useAuthStore } from '@/store/auth-store';

/**
 * Provider Mode shell – for every healthcare profession on the platform
 * (doctor, nurse, physiotherapist, rehabilitation, caregiver, nutrition,
 * mental health), not doctors only. Reachable only once the practice
 * documents have been approved.
 */
export default function ProviderTabsLayout() {
  const { t } = useI18n();
  const hydrated = useAuthStore((s) => s.hydrated);
  const role = useAuthStore((s) => s.role);
  const providerStatus = useAuthStore((s) => s.providerStatus);

  if (hydrated && role !== 'provider') return <Redirect href="/home" />;
  if (hydrated && providerStatus !== 'approved') return <Redirect href="/auth/provider/pending" />;

  const tabs: TabConfig[] = [
    { name: 'dashboard', label: t('nav.provider.home'), icon: 'home-outline', iconActive: 'home' },
    { name: 'schedule', label: t('nav.provider.schedule'), icon: 'calendar-outline', iconActive: 'calendar' },
    { name: 'summary', label: t('nav.provider.summary'), icon: 'stats-chart-outline', iconActive: 'stats-chart' },
    { name: 'profile', label: t('nav.provider.account'), icon: 'person-outline', iconActive: 'person' },
  ];

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} tabs={tabs} />}
      screenOptions={{ headerShown: false, lazy: true }}
      backBehavior="initialRoute"
      initialRouteName="dashboard">
      <Tabs.Screen name="dashboard" options={{ title: t('nav.provider.home') }} />
      <Tabs.Screen name="schedule" options={{ title: t('nav.provider.schedule') }} />
      <Tabs.Screen name="summary" options={{ title: t('nav.provider.summary') }} />
      <Tabs.Screen name="profile" options={{ title: t('nav.provider.account') }} />
    </Tabs>
  );
}
