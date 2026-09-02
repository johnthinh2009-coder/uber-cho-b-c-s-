import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { useGuestGate } from '@/components/auth/guest-gate';
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
import { formatTime } from '@/utils/date';

/** Incoming on the left, yours on the right, composer pinned to the bottom. */
export function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, radius } = useTheme();
  const { t } = useI18n();
  const { requireAccount } = useGuestGate();
  const conversation = useChatStore((s) => s.conversations.find((c) => c.id === id));
  const send = useChatStore((s) => s.send);
  const markRead = useChatStore((s) => s.markRead);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (id) markRead(id);
  }, [id, markRead]);

  if (!conversation) {
    return (
      <Screen>
        <EmptyState icon="chatbubble-ellipses-outline" title={t('chat.empty')} message={t('chat.emptyHint')} />
      </Screen>
    );
  }

  const submit = () => {
    const text = draft;
    if (!text.trim()) return;
    requireAccount(() => {
      send(conversation.id, text);
      setDraft('');
      requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
    });
  };

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <IconButton icon="chevron-back" accessibilityLabel={t('a11y.goBack')} variant="plain" size={36} iconSize={22} onPress={() => router.back()} />
          <Avatar uri={conversation.avatarUrl} name={conversation.name} size={38} />
          <View style={styles.flex}>
            <Text variant="bodyStrong" numberOfLines={1}>
              {conversation.name}
            </Text>
            <Text variant="label" color="textSecondary" numberOfLines={1}>
              {conversation.role}
            </Text>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.messages}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}>
          {conversation.messages.map((message, index) => {
            const mine = message.from === 'me';
            const previous = conversation.messages[index - 1];
            const showAvatar = !mine && previous?.from !== 'them';
            return (
              <View key={message.id} style={[styles.messageRow, mine ? styles.rowMine : styles.rowTheirs]}>
                {!mine ? (
                  showAvatar ? (
                    <Avatar uri={conversation.avatarUrl} name={conversation.name} size={28} />
                  ) : (
                    <View style={styles.avatarSpacer} />
                  )
                ) : null}
                <View
                  style={[
                    styles.bubble,
                    {
                      backgroundColor: mine ? colors.accents.blue : colors.surface,
                      borderRadius: radius.xl,
                    },
                  ]}>
                  <Text variant="body" color={mine ? '#FFFFFF' : colors.text}>
                    {message.text}
                  </Text>
                  <Text variant="label" color={mine ? 'rgba(255,255,255,0.75)' : colors.textTertiary} style={styles.time}>
                    {formatTime(message.at)}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={[styles.composer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
          <PressableScale
            onPress={() => requireAccount(() => undefined)}
            accessibilityRole="button"
            accessibilityLabel={t('chat.attach')}
            scaleTo={0.9}
            style={styles.attach}>
            <Icon name="add-circle" size={28} color={colors.accents.blue} />
          </PressableScale>
          <View style={[styles.input, { backgroundColor: colors.surface, borderRadius: radius.pill }]}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder={t('chat.placeholder')}
              placeholderTextColor={colors.textTertiary}
              accessibilityLabel={t('chat.placeholder')}
              onSubmitEditing={submit}
              returnKeyType="send"
              style={[styles.textInput, { color: colors.text }]}
            />
          </View>
          <PressableScale
            onPress={submit}
            accessibilityRole="button"
            accessibilityLabel={t('chat.send')}
            scaleTo={0.9}
            style={styles.send}>
            <Icon name="send" size={24} color={draft.trim() ? colors.accents.blue : colors.textTertiary} />
          </PressableScale>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: gutter,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  messages: { paddingHorizontal: gutter, paddingVertical: 14, gap: 6, justifyContent: 'flex-start' },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, maxWidth: '100%' },
  rowMine: { justifyContent: 'flex-end' },
  rowTheirs: { justifyContent: 'flex-start' },
  avatarSpacer: { width: 28 },
  bubble: { maxWidth: '76%', paddingHorizontal: 14, paddingVertical: 9 },
  time: { marginTop: 2 },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: gutter,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  attach: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, height: 44, paddingHorizontal: 16, justifyContent: 'center' },
  textInput: { fontSize: 16, paddingVertical: 0 },
  send: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
});
