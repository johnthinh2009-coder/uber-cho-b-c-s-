import { Tabs } from 'expo-router/js-tabs';

import { TabBar, type TabConfig } from '@/components/navigation/tab-bar';
import { useI18n } from '@/i18n';

/** Three internal destinations, mirroring the reference workout app. */
export default function GymTabsLayout() {
  const { t } = useI18n();

  const tabs: TabConfig[] = [
    { name: 'home', label: t('gym.tabs.home'), icon: 'home-outline', iconActive: 'home' },
    { name: 'workout', label: t('gym.tabs.workout'), icon: 'barbell-outline', iconActive: 'barbell' },
    { name: 'profile', label: t('gym.tabs.profile'), icon: 'person-outline', iconActive: 'person' },
  ];

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} tabs={tabs} />}
      screenOptions={{ headerShown: false, lazy: true }}
      backBehavior="initialRoute"
      initialRouteName="home">
      <Tabs.Screen name="home" options={{ title: t('gym.tabs.home') }} />
      <Tabs.Screen name="workout" options={{ title: t('gym.tabs.workout') }} />
      <Tabs.Screen name="profile" options={{ title: t('gym.tabs.profile') }} />
    </Tabs>
  );
}
