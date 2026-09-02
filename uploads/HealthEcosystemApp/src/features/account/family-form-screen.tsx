import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { ScreenHeader } from '@/components/navigation/screen-header';
import { Button } from '@/components/ui/button';
import { Field, SelectField } from '@/components/ui/field';
import { Screen } from '@/components/ui/screen';
import { relationshipLabel, type Relationship } from '@/domain';
import { useI18n } from '@/i18n';
import { useFamilyStore, type FamilyGender } from '@/store/family-store';
import { toast } from '@/store/toast-store';
import { gutter } from '@/theme';

const RELATIONSHIPS: Relationship[] = ['partner', 'child', 'parent', 'other'];

function toIsoDate(input: string): string {
  const match = input.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return '';
  const [, d, m, y] = match;
  return `${y}-${m!.padStart(2, '0')}-${d!.padStart(2, '0')}`;
}

function fromIsoDate(iso: string): string {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return '';
  const [, y, m, d] = match;
  return `${d}/${m}/${y}`;
}

/** Add or edit a person you look after. Saved locally, appears immediately. */
export function FamilyFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { t } = useI18n();

  const existing = useFamilyStore((s) => s.members.find((member) => member.id === id));
  const add = useFamilyStore((s) => s.add);
  const update = useFamilyStore((s) => s.update);
  const remove = useFamilyStore((s) => s.remove);

  const [fullName, setFullName] = useState(existing?.fullName ?? '');
  const [relationship, setRelationship] = useState<Relationship | null>(existing?.relationship ?? null);
  const [dob, setDob] = useState(existing ? fromIsoDate(existing.dateOfBirth) : '');
  const [gender, setGender] = useState<FamilyGender | null>(existing?.gender ?? null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = t('auth.required', { field: t('familyForm.name').toLowerCase() });
    if (!relationship) next.relationship = t('auth.required', { field: t('familyForm.relationship').toLowerCase() });
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const payload = {
      fullName: fullName.trim(),
      relationship: relationship!,
      dateOfBirth: toIsoDate(dob) || '1990-01-01',
      gender: gender ?? 'other',
    };

    if (existing) {
      update(existing.id, payload);
      toast.show({ title: t('familyForm.updated'), tone: 'success' });
    } else {
      add(payload);
      toast.show({ title: t('familyForm.saved', { name: payload.fullName }), tone: 'success' });
    }
    router.back();
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScreenHeader title={existing ? t('familyForm.editTitle') : t('familyForm.addTitle')} mode="close" />
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <Field label={t('familyForm.name')} value={fullName} onChangeText={setFullName} error={errors.fullName} icon="person-outline" />
          <SelectField
            label={t('familyForm.relationship')}
            value={relationship}
            onChange={setRelationship}
            options={RELATIONSHIPS.map((value) => ({ value, label: relationshipLabel(value) }))}
          />
          {errors.relationship ? null : null}
          <Field label={t('familyForm.dateOfBirth')} value={dob} onChangeText={setDob} placeholder="18/02/1993" icon="calendar-outline" />
          <SelectField
            label={t('familyForm.gender')}
            value={gender}
            onChange={setGender}
            options={[
              { value: 'female' as const, label: t('labels.gender.female') },
              { value: 'male' as const, label: t('labels.gender.male') },
              { value: 'other' as const, label: t('labels.gender.other') },
            ]}
          />

          <Button label={t('familyForm.save')} fullWidth size="lg" onPress={submit} style={styles.cta} />

          {existing ? (
            <Button
              label={t('familyForm.remove')}
              variant="danger"
              fullWidth
              onPress={() => {
                remove(existing.id);
                toast.show({ title: t('familyForm.removed'), tone: 'neutral' });
                router.back();
              }}
            />
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: gutter, paddingBottom: 40, gap: 16, justifyContent: 'flex-start' },
  cta: { marginTop: 8 },
});
