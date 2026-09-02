import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { EmptyState } from '@/components/feedback/empty-state';
import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { useChatStore } from '@/store/chat-store';
import { gutter, useTheme } from '@/theme';
import { formatTimeAgo } from '@/utils/date';

/** Inbox in the shape people already know from their messaging app. */
export function ChatListScreen() {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const { t } = useI18n();
  const conversations = useChatStore((s) => s.conversations);
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) => c.name.toLowerCase().includes(q) || c.messages.some((m) => m.text.toLowerCase().includes(q)));
  }, [conversations, query]);

  return (
    <Screen>
      <View style={styles.header}>
        <IconButton icon="chevron-back" accessibilityLabel={t('a11y.goBack')} variant="soft" size={40} iconSize={20} onPress={() => router.back()} />
        <Text variant="title" accessibilityRole="header" style={styles.flex}>
          {t('chat.title')}
        </Text>
      </View>

      <View style={styles.searchWrap}>
        <View style={[styles.search, { backgroundColor: colors.surface, borderRadius: radius.pill }]}>
          <Icon name="search" size={18} color={colors.textTertiary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('chat.searchPlaceholder')}
            placeholderTextColor={colors.textTertiary}
            accessibilityLabel={t('chat.searchPlaceholder')}
            style={[styles.searchInput, { color: colors.text }]}
          />
        </View>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {visible.length === 0 ? (
          <EmptyState icon="chatbubble-ellipses-outline" title={t('chat.empty')} message={t('chat.emptyHint')} />
        ) : (
          visible.map((conversation) => {
            const last = conversation.messages[conversation.messages.length - 1];
            const unread = conversation.unread > 0;
            return (
              <PressableScale
                key={conversation.id}
                onPress={() => router.push(`/chat/${conversation.id}`)}
                accessibilityRole="button"
                accessibilityLabel={`${conversation.name}. ${last?.text ?? ''}`}
                scaleTo={0.99}
                style={styles.row}>
                <View>
                  <Avatar uri={conversation.avatarUrl} name={conversation.name} size={56} />
                  {unread ? (
                    <View style={[styles.unreadDot, { backgroundColor: colors.accents.blue, borderColor: colors.background }]} />
                  ) : null}
                </View>
                <View style={styles.flex}>
                  <Text variant={unread ? 'bodyStrong' : 'body'} numberOfLines={1}>
                    {conversation.name}
                  </Text>
                  <Text
                    variant={unread ? 'bodySmallStrong' : 'bodySmall'}
                    color={unread ? 'text' : 'textSecondary'}
                    numberOfLines={1}>
                    {last ? `${last.from === 'me' ? `${t('chat.you')}: ` : ''}${last.text}` : conversation.role}
                    {last ? ` · ${formatTimeAgo(last.at)}` : ''}
                  </Text>
                </View>
                {unread ? <View style={[styles.pill, { backgroundColor: colors.accents.blue }]} /> : null}
              </PressableScale>
            );
          })
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: gutter, minHeight: 52 },
  searchWrap: { paddingHorizontal: gutter, paddingVertical: 10 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 42, paddingHorizontal: 14 },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: 0 },
  content: { paddingHorizontal: gutter, paddingBottom: 40, justifyContent: 'flex-start' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  unreadDot: { position: 'absolute', right: -1, bottom: -1, width: 16, height: 16, borderRadius: 8, borderWidth: 2.5 },
  pill: { width: 12, height: 12, borderRadius: 6 },
  flex: { flex: 1, gap: 2 },
});
