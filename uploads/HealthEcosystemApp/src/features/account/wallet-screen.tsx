import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useGuestGate } from '@/components/auth/guest-gate';
import { ScreenHeader } from '@/components/navigation/screen-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field, SelectField } from '@/components/ui/field';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';
import { toast } from '@/store/toast-store';
import { useWalletStore, type CardBrand } from '@/store/wallet-store';
import { gutter, useTheme } from '@/theme';

const BRANDS: CardBrand[] = ['Visa', 'Mastercard', 'JCB', 'Momo', 'ZaloPay'];

/** Payment methods only – no amounts, no prices anywhere in the product. */
export function WalletScreen() {
  const { colors, radius } = useTheme();
  const { t } = useI18n();
  const { requireAccount } = useGuestGate();
  const cards = useWalletStore((s) => s.cards);
  const add = useWalletStore((s) => s.add);
  const remove = useWalletStore((s) => s.remove);
  const setDefault = useWalletStore((s) => s.setDefault);

  const [adding, setAdding] = useState(false);
  const [brand, setBrand] = useState<CardBrand>('Visa');
  const [last4, setLast4] = useState('');
  const [expiry, setExpiry] = useState('');

  const submit = () => {
    if (last4.trim().length < 4) return;
    add({ brand, last4: last4.trim().slice(-4), expiry: expiry.trim() || '—' });
    setLast4('');
    setExpiry('');
    setAdding(false);
    toast.show({ title: t('profileEdit.cardSaved'), tone: 'success' });
  };

  return (
    <Screen>
      <ScreenHeader title={t('wallet.title')} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text variant="section">{t('wallet.methods')}</Text>

        {cards.map((card) => (
          <View key={card.id} style={[styles.card, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
            <Icon name="card-outline" size={22} color={colors.text} />
            <View style={styles.flex}>
              <Text variant="bodyStrong">
                {card.brand} •••• {card.last4}
              </Text>
              <Text variant="caption" color="textSecondary">
                {card.expiry}
              </Text>
            </View>
            {card.isDefault ? (
              <Badge label={t('wallet.default')} size="sm" tone="accent" />
            ) : (
              <PressableScale
                onPress={() => setDefault(card.id)}
                accessibilityRole="button"
                accessibilityLabel={`${t('profileEdit.setDefault')}: ${card.brand}`}
                scaleTo={0.95}>
                <Text variant="label" color={colors.accents.blue}>
                  {t('profileEdit.setDefault')}
                </Text>
              </PressableScale>
            )}
            <PressableScale
              onPress={() => {
                remove(card.id);
                toast.show({ title: t('profileEdit.cardRemoved'), tone: 'neutral' });
              }}
              accessibilityRole="button"
              accessibilityLabel={`${t('profileEdit.removeCard')}: ${card.brand}`}
              scaleTo={0.92}>
              <Icon name="trash-outline" size={18} color={colors.danger} />
            </PressableScale>
          </View>
        ))}

        {adding ? (
          <View style={[styles.form, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
            <SelectField
              label={t('profileEdit.cardBrand')}
              value={brand}
              onChange={setBrand}
              options={BRANDS.map((value) => ({ value, label: value }))}
            />
            <Field label={t('profileEdit.cardNumber')} value={last4} onChangeText={setLast4} keyboardType="number-pad" maxLength={4} placeholder="4242" />
            <Field label={t('profileEdit.cardExpiry')} value={expiry} onChangeText={setExpiry} placeholder="09/28" />
            <View style={styles.formActions}>
              <Button label={t('common.save')} onPress={submit} />
              <Button label={t('common.cancel')} variant="soft" onPress={() => setAdding(false)} />
            </View>
          </View>
        ) : (
          <Button label={t('profileEdit.addCard')} variant="soft" fullWidth onPress={() => requireAccount(() => setAdding(true))} />
        )}

        <Text variant="caption" color="textTertiary">
          {t('wallet.note')}
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: gutter, paddingBottom: 40, gap: 12, justifyContent: 'flex-start' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  form: { padding: 16, gap: 14 },
  formActions: { flexDirection: 'row', gap: 8 },
  flex: { flex: 1, gap: 2 },
});
