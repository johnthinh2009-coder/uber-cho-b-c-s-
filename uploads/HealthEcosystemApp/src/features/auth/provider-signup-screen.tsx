import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { ScreenHeader } from '@/components/navigation/screen-header';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { providerRoleLabel, type ProviderRole } from '@/domain';
import { useI18n } from '@/i18n';
import { useAuthStore } from '@/store/auth-store';
import { gutter, useTheme } from '@/theme';

const ROLES: ProviderRole[] = [
  'doctor_general',
  'doctor_specialist',
  'nurse',
  'physiotherapist',
  'rehabilitation',
  'musculoskeletal',
  'elderly_caregiver',
  'post_treatment_care',
  'nutritionist',
  'mental_health',
];

const SPECIALTIES = ['Nội tổng quát', 'Nhi khoa', 'Tim mạch', 'Cơ xương khớp', 'Hô hấp', 'Lão khoa', 'Phục hồi chức năng', 'Dinh dưỡng', 'Sức khoẻ tinh thần'];
const AREAS = ['Quận 1', 'Quận 3', 'Quận 10', 'Bình Thạnh', 'Phú Nhuận', 'Gò Vấp', 'Thủ Đức'];

const TOTAL_STEPS = 4;

/** Uploads are simulated: we record that a document was attached, never a file. */
function UploadRow({ label, done, onPress }: { label: string; done: boolean; onPress: () => void }) {
  const { colors, radius } = useTheme();
  const { t } = useI18n();
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}. ${done ? t('auth.provider.uploaded') : t('auth.provider.upload')}`}
      scaleTo={0.98}
      style={[styles.upload, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
      <Icon name={done ? 'checkmark-circle' : 'cloud-upload-outline'} size={22} color={done ? colors.accent : colors.textSecondary} />
      <View style={styles.flex}>
        <Text variant="bodySmallStrong">{label}</Text>
        <Text variant="label" color="textSecondary">
          {done ? t('auth.provider.uploaded') : t('auth.provider.upload')}
        </Text>
      </View>
    </PressableScale>
  );
}

function Toggle({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { colors, radius } = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      scaleTo={0.97}
      style={[styles.toggle, { borderRadius: radius.pill, backgroundColor: selected ? colors.primary : colors.surface }]}>
      <Text variant="captionStrong" color={selected ? colors.onPrimary : colors.text}>
        {label}
      </Text>
    </PressableScale>
  );
}

export function ProviderSignUpScreen() {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const { t } = useI18n();
  const submit = useAuthStore((s) => s.submitApplication);

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [idFront, setIdFront] = useState(false);
  const [idBack, setIdBack] = useState(false);
  const [license, setLicense] = useState(false);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [role, setRole] = useState<ProviderRole | null>(null);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [years, setYears] = useState('');
  const [areas, setAreas] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggle = (list: string[], value: string, set: (next: string[]) => void) =>
    set(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);

  const canContinue = (() => {
    if (step === 1) return fullName.trim() && email.trim() && phone.trim();
    if (step === 2) return idFront && idBack;
    if (step === 3) return license && licenseNumber.trim();
    return Boolean(role) && specialties.length > 0 && areas.length > 0;
  })();

  const next = () => {
    if (!canContinue) {
      setErrors({ step: t('auth.required', { field: t(`auth.provider.step${step}` as 'auth.provider.step1').toLowerCase() }) });
      return;
    }
    setErrors({});
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      return;
    }
    submit({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      idFrontUploaded: idFront,
      idBackUploaded: idBack,
      licenseUploaded: license,
      licenseNumber: licenseNumber.trim(),
      role: role ?? 'doctor_general',
      specialties,
      yearsOfExperience: years.trim(),
      areas,
    });
    router.replace('/auth/provider/pending');
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScreenHeader
          title={t('auth.provider.title')}
          subtitle={t('auth.provider.subtitle', { step, total: TOTAL_STEPS })}
          onBack={step > 1 ? () => setStep(step - 1) : undefined}
        />

        <View style={styles.progress}>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <View
              key={i}
              style={[styles.progressBar, { backgroundColor: i < step ? colors.primary : colors.surfaceStrong, borderRadius: radius.pill }]}
            />
          ))}
        </View>

        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text variant="section">{t(`auth.provider.step${step}` as 'auth.provider.step1')}</Text>

          {step === 1 ? (
            <>
              <Field label={t('auth.fullName')} value={fullName} onChangeText={setFullName} icon="person-outline" />
              <Field label={t('auth.email')} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" icon="mail-outline" />
              <Field label={t('auth.phone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" icon="call-outline" />
            </>
          ) : null}

          {step === 2 ? (
            <>
              <UploadRow label={t('auth.provider.idFront')} done={idFront} onPress={() => setIdFront(true)} />
              <UploadRow label={t('auth.provider.idBack')} done={idBack} onPress={() => setIdBack(true)} />
              <Text variant="label" color="textTertiary">
                {t('auth.provider.uploadNote')}
              </Text>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <Field label={t('auth.provider.licenseNumber')} value={licenseNumber} onChangeText={setLicenseNumber} icon="document-text-outline" />
              <UploadRow label={t('auth.provider.licenseFile')} done={license} onPress={() => setLicense(true)} />
              <Text variant="label" color="textTertiary">
                {t('auth.provider.uploadNote')}
              </Text>
            </>
          ) : null}

          {step === 4 ? (
            <>
              <Text variant="bodySmallStrong">{t('auth.provider.roleQuestion')}</Text>
              <View style={styles.wrap}>
                {ROLES.map((item) => (
                  <Toggle key={item} label={providerRoleLabel(item)} selected={role === item} onPress={() => setRole(item)} />
                ))}
              </View>
              <Text variant="bodySmallStrong">{t('auth.provider.specialtyQuestion')}</Text>
              <View style={styles.wrap}>
                {SPECIALTIES.map((item) => (
                  <Toggle key={item} label={item} selected={specialties.includes(item)} onPress={() => toggle(specialties, item, setSpecialties)} />
                ))}
              </View>
              <Field label={t('auth.provider.experience')} value={years} onChangeText={setYears} keyboardType="number-pad" icon="ribbon-outline" />
              <Text variant="bodySmallStrong">{t('auth.provider.areasQuestion')}</Text>
              <View style={styles.wrap}>
                {AREAS.map((item) => (
                  <Toggle key={item} label={item} selected={areas.includes(item)} onPress={() => toggle(areas, item, setAreas)} />
                ))}
              </View>
            </>
          ) : null}

          {errors.step ? (
            <Text variant="caption" color="danger">
              {errors.step}
            </Text>
          ) : null}

          <Button
            label={step === TOTAL_STEPS ? t('auth.provider.submit') : t('auth.provider.next')}
            fullWidth
            size="lg"
            onPress={next}
            style={styles.cta}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  progress: { flexDirection: 'row', gap: 6, paddingHorizontal: gutter, paddingBottom: 12 },
  progressBar: { flex: 1, height: 4 },
  content: { paddingHorizontal: gutter, paddingBottom: 40, gap: 14 },
  upload: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  toggle: { paddingHorizontal: 14, height: 38, alignItems: 'center', justifyContent: 'center' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cta: { marginTop: 8 },
});
