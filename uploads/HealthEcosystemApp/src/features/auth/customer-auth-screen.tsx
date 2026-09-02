import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { ScreenHeader } from '@/components/navigation/screen-header';
import { Button } from '@/components/ui/button';
import { Field, SelectField } from '@/components/ui/field';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { useAuthStore, type Gender } from '@/store/auth-store';
import { toast } from '@/store/toast-store';
import { gutter, useTheme } from '@/theme';

/** ISO date from a dd/mm/yyyy string, or '' when incomplete. */
function toIsoDate(input: string): string {
  const match = input.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return '';
  const [, d, m, y] = match;
  return `${y}-${m!.padStart(2, '0')}-${d!.padStart(2, '0')}`;
}

export function CustomerAuthScreen({ mode }: { mode: 'signIn' | 'signUp' }) {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useI18n();
  const signIn = useAuthStore((s) => s.signInCustomer);
  const signUp = useAuthStore((s) => s.signUpCustomer);
  const continueAsGuest = useAuthStore((s) => s.continueAsGuest);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const genderOptions: { value: Gender; label: string }[] = [
    { value: 'female', label: t('labels.gender.female') },
    { value: 'male', label: t('labels.gender.male') },
    { value: 'other', label: t('labels.gender.other') },
  ];

  const submitSignIn = () => {
    if (!identifier.trim()) {
      setErrors({ identifier: t('auth.required', { field: t('auth.identifier').toLowerCase() }) });
      return;
    }
    signIn(identifier.trim());
    toast.show({ title: t('auth.welcomeBack'), tone: 'success' });
    router.replace('/home');
  };

  const submitSignUp = () => {
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = t('auth.required', { field: t('auth.fullName').toLowerCase() });
    if (!email.trim()) next.email = t('auth.required', { field: t('auth.email').toLowerCase() });
    else if (!email.includes('@')) next.email = t('auth.invalidEmail');
    if (!phone.trim()) next.phone = t('auth.required', { field: t('auth.phone').toLowerCase() });
    if (!password.trim()) next.password = t('auth.required', { field: t('auth.password').toLowerCase() });
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    signUp({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      dateOfBirth: toIsoDate(dob),
      gender: gender ?? 'other',
    });
    toast.show({ title: t('auth.accountCreated'), tone: 'success' });
    router.replace('/home');
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScreenHeader
          title={mode === 'signIn' ? t('auth.signInTitle') : t('auth.signUpTitle')}
          subtitle={mode === 'signIn' ? t('auth.signInSubtitle') : t('auth.signUpSubtitle')}
        />
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {mode === 'signIn' ? (
            <>
              <Field
                label={t('auth.identifier')}
                hint={t('auth.identifierHint')}
                error={errors.identifier}
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
                icon="person-outline"
              />
              <Field
                label={t('auth.password')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                icon="lock-closed-outline"
              />
              <Button label={t('auth.signIn')} fullWidth size="lg" onPress={submitSignIn} />
              <View style={styles.switchRow}>
                <Text variant="bodySmall" color="textSecondary">
                  {t('auth.noAccount')}
                </Text>
                <PressableScale onPress={() => router.push('/auth/sign-up')} accessibilityRole="button" accessibilityLabel={t('auth.signUp')}>
                  <Text variant="bodySmallStrong" color={colors.accents.blue}>
                    {t('auth.signUp')}
                  </Text>
                </PressableScale>
              </View>
            </>
          ) : (
            <>
              <Field label={t('auth.fullName')} value={fullName} onChangeText={setFullName} error={errors.fullName} icon="person-outline" />
              <Field
                label={t('auth.email')}
                value={email}
                onChangeText={setEmail}
                error={errors.email}
                autoCapitalize="none"
                keyboardType="email-address"
                icon="mail-outline"
              />
              <Field label={t('auth.phone')} value={phone} onChangeText={setPhone} error={errors.phone} keyboardType="phone-pad" icon="call-outline" />
              <Field label={t('auth.dateOfBirth')} value={dob} onChangeText={setDob} placeholder="12/04/1990" icon="calendar-outline" />
              <SelectField label={t('auth.gender')} value={gender} options={genderOptions} onChange={setGender} />
              <Field label={t('auth.password')} value={password} onChangeText={setPassword} error={errors.password} secureTextEntry icon="lock-closed-outline" />
              <Button label={t('auth.signUp')} fullWidth size="lg" onPress={submitSignUp} />
              <View style={styles.switchRow}>
                <Text variant="bodySmall" color="textSecondary">
                  {t('auth.haveAccount')}
                </Text>
                <PressableScale onPress={() => router.replace('/auth/sign-in')} accessibilityRole="button" accessibilityLabel={t('auth.signIn')}>
                  <Text variant="bodySmallStrong" color={colors.accents.blue}>
                    {t('auth.signIn')}
                  </Text>
                </PressableScale>
              </View>
            </>
          )}

          <View style={styles.guest}>
            <Button
              label={t('auth.continueGuest')}
              variant="soft"
              fullWidth
              onPress={() => {
                continueAsGuest();
                router.replace('/home');
              }}
            />
            <Text variant="label" color="textTertiary">
              {t('auth.guestNote')}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: gutter, paddingBottom: 40, gap: 16 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  guest: { gap: 8, marginTop: 12 },
});
