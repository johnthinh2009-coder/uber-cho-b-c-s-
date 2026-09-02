import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';

import { TabBar, type TabConfig } from '@/components/navigation/tab-bar';
import { useI18n } from '@/i18n';
import { useAuthStore } from '@/store/auth-store';

/** Customer shell: four destinations, nothing more. */
export default function CustomerTabsLayout() {
  const { t } = useI18n();
  const hydrated = useAuthStore((s) => s.hydrated);
  const role = useAuthStore((s) => s.role);
  const signedIn = useAuthStore((s) => s.signedIn);
  const guest = useAuthStore((s) => s.guest);
  const providerStatus = useAuthStore((s) => s.providerStatus);

  if (hydrated && role === 'provider' && providerStatus === 'approved') return <Redirect href="/dashboard" />;
  if (hydrated && !signedIn && !guest) return <Redirect href="/welcome" />;

  const tabs: TabConfig[] = [
    { name: 'home', label: t('nav.patient.home'), icon: 'home-outline', iconActive: 'home' },
    { name: 'services', label: t('nav.patient.services'), icon: 'grid-outline', iconActive: 'grid' },
    { name: 'activity', label: t('nav.patient.activity'), icon: 'receipt-outline', iconActive: 'receipt' },
    { name: 'account', label: t('nav.patient.account'), icon: 'person-outline', iconActive: 'person' },
  ];

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} tabs={tabs} />}
      screenOptions={{ headerShown: false, lazy: true }}
      backBehavior="initialRoute"
      initialRouteName="home">
      <Tabs.Screen name="home" options={{ title: t('nav.patient.home') }} />
      <Tabs.Screen name="services" options={{ title: t('nav.patient.services') }} />
      <Tabs.Screen name="activity" options={{ title: t('nav.patient.activity') }} />
      <Tabs.Screen name="account" options={{ title: t('nav.patient.account') }} />
    </Tabs>
  );
}
