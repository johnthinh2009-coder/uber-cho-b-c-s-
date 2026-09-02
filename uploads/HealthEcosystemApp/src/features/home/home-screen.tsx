import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, type Href } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { HScroll } from '@/components/ui/h-scroll';
import { Icon, type IconName } from '@/components/ui/icon';
import { IconBadge } from '@/components/ui/icon-badge';
import { PressableScale } from '@/components/ui/pressable-scale';
import { RemoteImage } from '@/components/ui/remote-image';
import { Screen } from '@/components/ui/screen';
import { SectionTitle } from '@/components/ui/section';
import { Text } from '@/components/ui/text';
import { QuickCircle } from '@/components/ui/tile';
import { ageFromDateOfBirth, relationshipLabel } from '@/domain';
import { useI18n } from '@/i18n';
import { CONTRACTORS } from '@/mocks/food';
import { useAuthStore } from '@/store/auth-store';
import { selectUnread, useChatStore } from '@/store/chat-store';
import { useFamilyStore } from '@/store/family-store';
import { totalsFor, useFoodLogStore } from '@/store/food-log-store';
import { useGymStore } from '@/store/gym-store';
import { dosesForToday, useReminderStore } from '@/store/reminder-store';
import { gutter, tabBarClearance, useTheme, type AccentTone } from '@/theme';
import { formatClock, todayKey } from '@/utils/date';

const SHORTCUTS: { key: string; icon: IconName; tone: AccentTone; href: Href }[] = [
  { key: 'homeDoctor', icon: 'medkit', tone: 'blue', href: '/care/match' },
  { key: 'homeNursing', icon: 'fitness', tone: 'green', href: '/care/providers?service=home_nursing' },
  { key: 'physiotherapy', icon: 'body', tone: 'purple', href: '/care/providers?service=physiotherapy' },
  { key: 'elderlyCare', icon: 'heart', tone: 'coral', href: '/care/providers?service=elderly_care' },
  { key: 'food', icon: 'restaurant', tone: 'orange', href: '/food' },
  { key: 'fitness', icon: 'barbell', tone: 'teal', href: '/fitness' },
  { key: 'medication', icon: 'alarm', tone: 'pink', href: '/medication' },
];

export function HomeScreen() {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const { t } = useI18n();

  const customer = useAuthStore((s) => s.customer);
  const guest = useAuthStore((s) => s.guest);
  const unread = useChatStore(selectUnread);
  const members = useFamilyStore((s) => s.members);
  const entries = useFoodLogStore((s) => s.entries);
  const reminders = useReminderStore((s) => s.reminders);
  const outcomes = useReminderStore((s) => s.outcomes);
  const history = useGymStore((s) => s.history);
  const active = useGymStore((s) => s.active);

  const doses = useMemo(() => dosesForToday(reminders, outcomes), [reminders, outcomes]);
  const dosesDone = doses.filter((dose) => dose.outcome === 'taken').length;
  const nextDose = doses.find((dose) => !dose.outcome);
  const totals = useMemo(() => totalsFor(entries, todayKey()), [entries]);
  const name = customer?.fullName.split(' ').pop() ?? '';

  const tasks = useMemo(() => {
    const list: { id: string; icon: IconName; tone: AccentTone; title: string; subtitle: string; href: Href }[] = [];
    if (nextDose) {
      list.push({
        id: 'dose',
        icon: 'alarm',
        tone: 'pink',
        title: nextDose.reminder.name,
        subtitle: `${nextDose.reminder.dose ? `${nextDose.reminder.dose} · ` : ''}${formatClock(nextDose.time)}`,
        href: '/medication',
      });
    }
    list.push(
      totals.count === 0
        ? { id: 'food', icon: 'restaurant', tone: 'orange', title: t('home.taskLogFood'), subtitle: t('home.taskLogFoodSub'), href: '/food' }
        : {
            id: 'food',
            icon: 'restaurant',
            tone: 'orange',
            title: t('home.taskFoodDone', { count: totals.count }),
            subtitle: `${totals.calories} kcal · ${totals.protein}g ${t('restaurants.protein').toLowerCase()}`,
            href: '/food/log',
          },
    );
    list.push({
      id: 'move',
      icon: 'barbell',
      tone: 'teal',
      title: active ? t('gym.inProgress') : history.length > 0 ? t('home.taskMoveDone') : t('home.taskMove'),
      subtitle: active ? t('gym.resume') : t('home.taskMoveSub'),
      href: '/fitness',
    });
    return list;
  }, [nextDose, totals, active, history.length, t]);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* A barely-there clinical wash behind the header, never a green screen */}
        <LinearGradient
          colors={[colors.primarySoft, colors.background]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.wash}
          pointerEvents="none"
        />
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text variant="label" color="textSecondary">
              {t('home.greetingLine')}
            </Text>
            <Text variant="pageTitle" numberOfLines={1} accessibilityRole="header">
              {guest ? t('home.guestName') : name || t('home.guestName')}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <PressableScale
              onPress={() => router.push('/chat')}
              accessibilityRole="button"
              accessibilityLabel={t('chat.openA11y')}
              scaleTo={0.94}
              style={[styles.headerButton, { backgroundColor: colors.surface }]}>
              <Icon name="chatbubble-ellipses" size={21} color={colors.accents.blue} />
              {unread > 0 ? <View style={[styles.dot, { backgroundColor: colors.accents.blue, borderColor: colors.background }]} /> : null}
            </PressableScale>
            <PressableScale
              onPress={() => router.push('/account')}
              accessibilityRole="button"
              accessibilityLabel={t('account.title')}
              scaleTo={0.94}>
              <Avatar uri={customer?.avatarUrl} name={customer?.fullName ?? 'Haven'} size={42} />
            </PressableScale>
          </View>
        </View>

        {/* Search */}
        <PressableScale
          onPress={() => router.push('/search')}
          accessibilityRole="search"
          accessibilityLabel={t('home.searchA11y')}
          scaleTo={0.98}
          style={[styles.search, { backgroundColor: colors.background, borderColor: colors.border, borderRadius: radius.pill }]}>
          <Icon name="search" size={20} color={colors.text} />
          <Text variant="body" color="textSecondary" numberOfLines={1} style={styles.flex}>
            {t('home.searchPlaceholder')}
          </Text>
        </PressableScale>

        {/* Colourful shortcuts */}
        <HScroll gap={4} accessibilityLabel={t('home.quickServices')}>
          {SHORTCUTS.map((item) => (
            <QuickCircle
              key={item.key}
              label={t(`home.quick.${item.key}` as 'home.quick.food')}
              icon={item.icon}
              tone={item.tone}
              onPress={() => router.push(item.href)}
            />
          ))}
        </HScroll>

        {/* Sắp tới */}
        <View style={styles.section}>
          <SectionTitle title={t('activity.upcoming')} onAction={() => router.push('/activity')} actionLabel={t('common.seeAll')} />
          <View style={styles.list}>
            {tasks.map((task) => (
              <PressableScale
                key={task.id}
                onPress={() => router.push(task.href)}
                accessibilityRole="button"
                accessibilityLabel={`${task.title}. ${task.subtitle}`}
                scaleTo={0.98}
                style={[styles.task, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
                <IconBadge icon={task.icon} tone={task.tone} size={44} shape="rounded" />
                <View style={styles.flex}>
                  <Text variant="bodyStrong" numberOfLines={1}>
                    {task.title}
                  </Text>
                  <Text variant="caption" color="textSecondary" numberOfLines={1}>
                    {task.subtitle}
                  </Text>
                </View>
                <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
              </PressableScale>
            ))}
          </View>
        </View>

        {/* Quán ăn dành cho bạn */}
        <View style={styles.section}>
          <SectionTitle
            title={t('home.restaurantsForYou')}
            subtitle={t('restaurants.subtitle')}
            onAction={() => router.push('/food')}
            actionLabel={t('common.seeAll')}
          />
          <HScroll gap={12}>
            {CONTRACTORS.map((restaurant) => (
              <PressableScale
                key={restaurant.id}
                onPress={() => router.push(`/food/restaurant/${restaurant.id}`)}
                accessibilityRole="button"
                accessibilityLabel={`${restaurant.name}. ${restaurant.tagline}`}
                scaleTo={0.97}
                style={styles.restaurant}>
                <RemoteImage uri={restaurant.heroUrl} aspectRatio={16 / 10} borderRadius={radius.lg} fallbackIcon="restaurant-outline" />
                <Text variant="bodySmallStrong" numberOfLines={1}>
                  {restaurant.name}
                </Text>
                <Text variant="label" color="textSecondary" numberOfLines={1}>
                  {restaurant.tagline}
                </Text>
              </PressableScale>
            ))}
          </HScroll>
        </View>

        {/* Thuốc hôm nay */}
        <View style={styles.section}>
          <SectionTitle title={t('home.medsToday')} onAction={() => router.push('/medication')} actionLabel={t('common.seeAll')} />
          <PressableScale
            onPress={() => router.push('/medication')}
            accessibilityRole="button"
            accessibilityLabel={t('home.medsToday')}
            scaleTo={0.98}
            style={[styles.wide, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
            <IconBadge icon="alarm" tone="pink" size={44} shape="rounded" />
            <View style={styles.flex}>
              <Text variant="bodyStrong">
                {doses.length === 0 ? t('meds.empty') : t('meds.doseCount', { done: dosesDone, total: doses.length })}
              </Text>
              <Text variant="caption" color="textSecondary" numberOfLines={1}>
                {nextDose ? t('meds.nextDose', { time: formatClock(nextDose.time) }) : t('meds.emptyHint')}
              </Text>
            </View>
            <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
          </PressableScale>
        </View>

        {/* Gia đình */}
        <View style={styles.section}>
          <SectionTitle title={t('pillars.family.label')} onAction={() => router.push('/account/family')} actionLabel={t('common.seeAll')} />
          <HScroll gap={10}>
            {members.map((member) => (
              <PressableScale
                key={member.id}
                onPress={() => router.push(`/account/family/${member.id}`)}
                accessibilityRole="button"
                accessibilityLabel={`${member.fullName}. ${member.note ?? ''}`}
                scaleTo={0.97}
                style={[styles.member, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
                <Avatar uri={member.avatarUrl} name={member.fullName} size={44} />
                <Text variant="bodySmallStrong" numberOfLines={1}>
                  {member.fullName}
                </Text>
                <Text variant="label" color="textSecondary" numberOfLines={1}>
                  {relationshipLabel(member.relationship)} · {t('family.ageYears', { age: ageFromDateOfBirth(member.dateOfBirth) })}
                </Text>
              </PressableScale>
            ))}
            <PressableScale
              onPress={() => router.push('/account/family/new')}
              accessibilityRole="button"
              accessibilityLabel={t('familyForm.add')}
              scaleTo={0.97}
              style={[styles.member, styles.memberAdd, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
              <IconBadge icon="add" tone="green" size={44} />
              <Text variant="bodySmallStrong" numberOfLines={2}>
                {t('familyForm.add').replace('+ ', '')}
              </Text>
            </PressableScale>
          </HScroll>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: tabBarClearance, gap: 22, justifyContent: 'flex-start' },
  wash: { position: 'absolute', top: 0, left: 0, right: 0, height: 220 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: gutter,
    paddingTop: 4,
  },
  headerText: { flex: 1, gap: 1 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerButton: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', top: 7, right: 7, width: 11, height: 11, borderRadius: 6, borderWidth: 2 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 52,
    paddingHorizontal: 18,
    marginHorizontal: gutter,
    borderWidth: 1,
  },
  section: { gap: 4 },
  list: { paddingHorizontal: gutter, gap: 10 },
  task: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  wide: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, marginHorizontal: gutter },
  restaurant: { width: 230, gap: 6 },
  member: { width: 152, padding: 14, gap: 6 },
  memberAdd: { justifyContent: 'center' },
  flex: { flex: 1 },
});
