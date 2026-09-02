import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ProviderCard } from '@/components/cards/provider-card';
import { ScreenHeader } from '@/components/navigation/screen-header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import {
  bodyAreaLabel,
  careCategoryLabel,
  careServiceLabel,
  type BodyArea,
  type CareCategory,
  type Provider,
} from '@/domain';
import { useI18n } from '@/i18n';
import { PROVIDERS } from '@/mocks/providers';
import { useFamilyStore } from '@/store/family-store';
import { gutter, useTheme } from '@/theme';

const CATEGORIES: CareCategory[] = ['general', 'pain', 'fever_illness', 'skin', 'mobility', 'chronic_support', 'follow_up'];
const AREAS: BodyArea[] = ['head', 'chest', 'abdomen', 'back', 'arms', 'legs', 'skin', 'whole_body', 'not_sure'];

/** Which concern maps to which professions – matching only, never a diagnosis. */
const CATEGORY_SERVICES: Record<CareCategory, string[]> = {
  general: ['home_doctor'],
  pain: ['musculoskeletal', 'physiotherapy', 'home_doctor'],
  fever_illness: ['home_doctor', 'home_nursing'],
  skin: ['home_doctor'],
  mobility: ['physiotherapy', 'rehabilitation', 'elderly_care'],
  chronic_support: ['home_doctor', 'home_nursing', 'nutrition'],
  follow_up: ['post_treatment', 'home_nursing', 'home_doctor'],
  other: ['home_doctor'],
};

type Answers = {
  category: CareCategory | null;
  area: BodyArea | null;
  atHome: boolean | null;
  forWhom: string | null;
};

function Option({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { colors, radius } = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      scaleTo={0.98}
      style={[
        styles.option,
        { borderRadius: radius.md, backgroundColor: selected ? colors.primary : colors.surface },
      ]}>
      <Text variant="bodySmallStrong" color={selected ? colors.onPrimary : colors.text} style={styles.flex}>
        {label}
      </Text>
      {selected ? <Icon name="checkmark" size={18} color={colors.onPrimary} /> : null}
    </PressableScale>
  );
}

export function MatchScreen() {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const { t } = useI18n();
  const members = useFamilyStore((s) => s.members);

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>({ category: null, area: null, atHome: null, forWhom: null });
  const total = 4;

  const results = useMemo(() => {
    if (!answers.category) return [];
    const wanted = CATEGORY_SERVICES[answers.category];
    return PROVIDERS.map((provider) => {
      const overlap = provider.serviceTypes.filter((service) => wanted.includes(service)).length;
      const suited = provider.suitedFor.includes(answers.category!) ? 1 : 0;
      const available = provider.availability === 'available_now' ? 1 : 0;
      const score = overlap * 3 + suited * 2 + available;
      const reasons = [
        overlap > 0 ? t('match.reasonService', { service: careServiceLabel(provider.serviceTypes[0]!) }) : null,
        suited ? t('match.reasonCategory', { category: careCategoryLabel(answers.category!).toLowerCase() }) : null,
        available ? t('cards.availableNow') : null,
      ].filter(Boolean) as string[];
      return { provider, score, reasons };
    })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [answers.category, t]);

  const canContinue =
    (step === 1 && answers.category) ||
    (step === 2 && answers.area) ||
    (step === 3 && answers.atHome !== null) ||
    (step === 4 && answers.forWhom);

  const openProvider = (provider: Provider) => router.push(`/provider/${provider.id}`);

  if (step > total) {
    return (
      <Screen>
        <ScreenHeader
          title={t('match.resultsTitle')}
          subtitle={t('match.resultsSub', { count: results.length })}
          onBack={() => setStep(total)}
        />
        <ScrollView contentContainerStyle={styles.results} showsVerticalScrollIndicator={false}>
          <View style={[styles.note, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
            <Text variant="bodySmallStrong">{t('match.noteTitle')}</Text>
            <Text variant="caption" color="textSecondary">
              {t('match.noteBody')}
            </Text>
          </View>

          {results.length === 0 ? (
            <View style={[styles.note, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
              <Text variant="bodyStrong">{t('match.empty')}</Text>
              <Text variant="caption" color="textSecondary">
                {t('match.emptyHint')}
              </Text>
            </View>
          ) : (
            results.map(({ provider, reasons }) => (
              <View key={provider.id} style={styles.result}>
                <ProviderCard provider={provider} onPress={openProvider} layout="row" />
                <View style={[styles.reasons, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
                  <Text variant="label" color="textTertiary">
                    {t('match.whyMatch')}
                  </Text>
                  {reasons.map((reason) => (
                    <View key={reason} style={styles.reasonRow}>
                      <Icon name="checkmark-circle" size={15} color={colors.accent} />
                      <Text variant="caption" color="textSecondary" style={styles.flex}>
                        {reason}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}

          <Button
            label={t('match.restart')}
            variant="soft"
            fullWidth
            onPress={() => {
              setAnswers({ category: null, area: null, atHome: null, forWhom: null });
              setStep(1);
            }}
          />
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader
        title={t('match.title')}
        subtitle={t('match.step', { step, total })}
        onBack={step > 1 ? () => setStep(step - 1) : undefined}
      />
      <View style={styles.progress}>
        {Array.from({ length: total }, (_, i) => (
          <View
            key={i}
            style={[styles.progressBar, { backgroundColor: i < step ? colors.primary : colors.surfaceStrong, borderRadius: radius.pill }]}
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text variant="section">{t(`match.q${step}` as 'match.q1')}</Text>

        {step === 1
          ? CATEGORIES.map((category) => (
              <Option
                key={category}
                label={careCategoryLabel(category)}
                selected={answers.category === category}
                onPress={() => setAnswers({ ...answers, category })}
              />
            ))
          : null}

        {step === 2
          ? AREAS.map((area) => (
              <Option key={area} label={bodyAreaLabel(area)} selected={answers.area === area} onPress={() => setAnswers({ ...answers, area })} />
            ))
          : null}

        {step === 3 ? (
          <>
            <Option label={t('match.atHomeYes')} selected={answers.atHome === true} onPress={() => setAnswers({ ...answers, atHome: true })} />
            <Option label={t('match.atHomeNo')} selected={answers.atHome === false} onPress={() => setAnswers({ ...answers, atHome: false })} />
          </>
        ) : null}

        {step === 4 ? (
          <>
            <Option label={t('match.forSelf')} selected={answers.forWhom === 'self'} onPress={() => setAnswers({ ...answers, forWhom: 'self' })} />
            {members.map((member) => (
              <Option
                key={member.id}
                label={member.fullName}
                selected={answers.forWhom === member.id}
                onPress={() => setAnswers({ ...answers, forWhom: member.id })}
              />
            ))}
          </>
        ) : null}

        <Button
          label={step === total ? t('match.seeResults') : t('match.next')}
          fullWidth
          size="lg"
          disabled={!canContinue}
          onPress={() => setStep(step + 1)}
          style={styles.cta}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  progress: { flexDirection: 'row', gap: 6, paddingHorizontal: gutter, paddingBottom: 12 },
  progressBar: { flex: 1, height: 4 },
  content: { paddingHorizontal: gutter, paddingBottom: 40, gap: 10, justifyContent: 'flex-start' },
  option: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, minHeight: 52 },
  cta: { marginTop: 12 },
  results: { paddingHorizontal: gutter, paddingBottom: 40, gap: 14, justifyContent: 'flex-start' },
  note: { padding: 14, gap: 4 },
  result: { gap: 6 },
  reasons: { padding: 12, gap: 4 },
  reasonRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  flex: { flex: 1 },
});
