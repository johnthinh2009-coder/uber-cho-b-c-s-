import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { shadows, tabBarHeight, useTheme } from '@/theme';
import { haptics } from '@/utils/haptics';

export type TabConfig = {
  name: string;
  label: string;
  icon: IconName;
  iconActive: IconName;
};

type TabBarProps = BottomTabBarProps & {
  tabs: TabConfig[];
};

function TabItem({
  tab,
  focused,
  badge,
  onPress,
  onLongPress,
}: {
  tab: TabConfig;
  focused: boolean;
  badge?: string | number;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const color = focused ? colors.primary : colors.textTertiary;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={badge ? t('nav.tabBadge', { label: tab.label, count: badge }) : tab.label}
      onPress={() => {
        haptics.selection();
        onPress();
      }}
      onLongPress={onLongPress}
      style={styles.item}>
      <View style={[styles.iconWrap, focused ? { backgroundColor: colors.primarySoft } : null]}>
        <Icon name={focused ? tab.iconActive : tab.icon} size={22} color={color} />
        {badge ? (
          <View style={[styles.badge, { backgroundColor: colors.danger, borderColor: colors.tabBar }]}>
            <Text variant="tabLabel" color="textInverse" style={styles.badgeText}>
              {badge}
            </Text>
          </View>
        ) : null}
      </View>
      <Text
        variant="tabLabel"
        color={color}
        numberOfLines={2}
        maxFontSizeMultiplier={1.2}
        style={[styles.label, focused ? styles.labelActive : null]}>
        {tab.label}
      </Text>
    </Pressable>
  );
}

/**
 * Floating bottom tab bar: a white pill lifted off the bottom edge, four
 * destinations, always-visible labels, and the active item marked by a soft
 * grey chip behind its icon.
 */
export function TabBar({ state, descriptors, navigation, tabs }: TabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, Platform.OS === 'web' ? 14 : 10);

  return (
    <View pointerEvents="box-none" style={[styles.wrapper, { paddingBottom: bottom }]}>
      <View
        style={[
          styles.bar,
          shadows.floating,
          { backgroundColor: colors.tabBar, borderColor: colors.tabBarBorder, height: tabBarHeight },
        ]}>
        {state.routes.map((route, index) => {
          const tab = tabs.find((item) => item.name === route.name);
          if (!tab) return null;
          const { options } = descriptors[route.key]!;
          const focused = state.index === index;
          return (
            <TabItem
              key={route.key}
              tab={tab}
              focused={focused}
              badge={options.tabBarBadge}
              onPress={() => {
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
              }}
              onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'stretch',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 6,
  },
  iconWrap: {
    minWidth: 46,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
    lineHeight: 14,
  },
  labelActive: {
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: 4,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11,
    lineHeight: 13,
  },
});
