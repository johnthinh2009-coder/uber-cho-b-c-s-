import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { ScreenHeader } from '@/components/navigation/screen-header';
import { Button } from '@/components/ui/button';
import { Field, SelectField } from '@/components/ui/field';
import { Screen } from '@/components/ui/screen';
import { useI18n } from '@/i18n';
import { useAuthStore, type Gender } from '@/store/auth-store';
import { toast } from '@/store/toast-store';
import { gutter } from '@/theme';

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

/** Edit and save your own details. Written straight to local storage. */
export function ProfileEditScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const customer = useAuthStore((s) => s.customer);
  const updateCustomer = useAuthStore((s) => s.updateCustomer);

  const [fullName, setFullName] = useState(customer?.fullName ?? '');
  const [email, setEmail] = useState(customer?.email ?? '');
  const [phone, setPhone] = useState(customer?.phone ?? '');
  const [dob, setDob] = useState(customer?.dateOfBirth ? fromIsoDate(customer.dateOfBirth) : '');
  const [gender, setGender] = useState<Gender | null>(customer?.gender ?? null);

  const save = () => {
    updateCustomer({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      dateOfBirth: toIsoDate(dob) || (customer?.dateOfBirth ?? ''),
      gender: gender ?? 'other',
    });
    toast.show({ title: t('profileEdit.saved'), tone: 'success' });
    router.back();
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScreenHeader title={t('profileEdit.title')} mode="close" />
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <Field label={t('profile.name')} value={fullName} onChangeText={setFullName} icon="person-outline" />
          <Field label={t('profile.email')} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" icon="mail-outline" />
          <Field label={t('profile.phone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" icon="call-outline" />
          <Field label={t('auth.dateOfBirth')} value={dob} onChangeText={setDob} placeholder="12/04/1990" icon="calendar-outline" />
          <SelectField
            label={t('auth.gender')}
            value={gender}
            onChange={setGender}
            options={[
              { value: 'female' as const, label: t('labels.gender.female') },
              { value: 'male' as const, label: t('labels.gender.male') },
              { value: 'other' as const, label: t('labels.gender.other') },
            ]}
          />
          <Button label={t('profileEdit.save')} fullWidth size="lg" onPress={save} style={styles.cta} />
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
