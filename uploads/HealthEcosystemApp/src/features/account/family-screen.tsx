import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useGuestGate } from '@/components/auth/guest-gate';
import { ScreenHeader } from '@/components/navigation/screen-header';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { ageFromDateOfBirth, relationshipLabel } from '@/domain';
import { useI18n } from '@/i18n';
import { useFamilyStore } from '@/store/family-store';
import { gutter, useTheme } from '@/theme';

/** The people you look after. Add, edit and remove – all saved on device. */
export function FamilyScreen() {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const { t } = useI18n();
  const { requireAccount } = useGuestGate();
  const members = useFamilyStore((s) => s.members);

  return (
    <Screen>
      <ScreenHeader title={t('family.title')} subtitle={t('family.subtitle')} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Button
          label={t('familyForm.add')}
          fullWidth
          size="lg"
          onPress={() => requireAccount(() => router.push('/account/family/new'))}
        />

        {members.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
            <Text variant="bodyStrong">{t('familyForm.empty')}</Text>
            <Text variant="caption" color="textSecondary">
              {t('familyForm.emptyHint')}
            </Text>
          </View>
        ) : (
          members.map((member) => (
            <PressableScale
              key={member.id}
              onPress={() => router.push(`/account/family/${member.id}`)}
              accessibilityRole="button"
              accessibilityLabel={`${member.fullName}. ${relationshipLabel(member.relationship)}`}
              scaleTo={0.99}
              style={[styles.card, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
              <Avatar uri={member.avatarUrl} name={member.fullName} size={48} />
              <View style={styles.flex}>
                <Text variant="bodyStrong" numberOfLines={1}>
                  {member.fullName}
                </Text>
                <Text variant="caption" color="textSecondary" numberOfLines={1}>
                  {relationshipLabel(member.relationship)} · {t('family.ageYears', { age: ageFromDateOfBirth(member.dateOfBirth) })}
                </Text>
                {member.note ? (
                  <Text variant="caption" color="textSecondary" numberOfLines={2}>
                    {member.note}
                  </Text>
                ) : null}
              </View>
              <Icon name="create-outline" size={20} color={colors.textSecondary} />
            </PressableScale>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: gutter, paddingBottom: 40, gap: 12, justifyContent: 'flex-start' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  empty: { padding: 16, gap: 4 },
  flex: { flex: 1, gap: 2 },
});
