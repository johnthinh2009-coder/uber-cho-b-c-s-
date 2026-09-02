import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

import { HScroll } from './h-scroll';
import { Icon } from './icon';
import { PressableScale } from './pressable-scale';
import { Text } from './text';

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

function parse(value: string): { hour: string; minute: string } {
  const [h = '08', m = '00'] = value.split(':');
  return { hour: h.padStart(2, '0'), minute: m.padStart(2, '0') };
}

/**
 * Time picker built from plain buttons.
 *
 * A native date/time module would need platform code that does not exist in
 * the web preview, so hours and minutes are chosen from generous touch
 * targets that behave identically everywhere.
 */
export function TimePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  const { colors, radius } = useTheme();
  const { hour, minute } = parse(value);

  const step = (deltaMinutes: number) => {
    const total = (Number(hour) * 60 + Number(minute) + deltaMinutes + 1440) % 1440;
    const h = String(Math.floor(total / 60)).padStart(2, '0');
    const m = String(total % 60).padStart(2, '0');
    onChange(`${h}:${m}`);
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text variant="label" color="textSecondary">
          {label}
        </Text>
        <View style={styles.stepper}>
          <PressableScale
            onPress={() => step(-15)}
            accessibilityRole="button"
            accessibilityLabel={`${label} -15`}
            scaleTo={0.9}
            style={[styles.stepButton, { backgroundColor: colors.surface, borderRadius: radius.pill }]}>
            <Icon name="remove" size={18} color={colors.text} />
          </PressableScale>
          <Text variant="subheading" style={styles.value}>
            {hour}:{minute}
          </Text>
          <PressableScale
            onPress={() => step(15)}
            accessibilityRole="button"
            accessibilityLabel={`${label} +15`}
            scaleTo={0.9}
            style={[styles.stepButton, { backgroundColor: colors.surface, borderRadius: radius.pill }]}>
            <Icon name="add" size={18} color={colors.text} />
          </PressableScale>
        </View>
      </View>

      <HScroll gutters={false} gap={6}>
        {HOURS.map((h) => {
          const selected = h === hour;
          return (
            <PressableScale
              key={h}
              onPress={() => onChange(`${h}:${minute}`)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`${label} ${h} giờ`}
              scaleTo={0.92}
              style={[
                styles.cell,
                { borderRadius: radius.md, backgroundColor: selected ? colors.primary : colors.surface },
              ]}>
              <Text variant="bodySmallStrong" color={selected ? colors.onPrimary : colors.text}>
                {h}
              </Text>
            </PressableScale>
          );
        })}
      </HScroll>

      <View style={styles.minuteRow}>
        {MINUTES.map((m) => {
          const selected = m === minute;
          return (
            <PressableScale
              key={m}
              onPress={() => onChange(`${hour}:${m}`)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`${label} ${m} phút`}
              scaleTo={0.95}
              style={[
                styles.minuteCell,
                { borderRadius: radius.md, backgroundColor: selected ? colors.primary : colors.surface },
              ]}>
              <Text variant="bodySmallStrong" color={selected ? colors.onPrimary : colors.text}>
                :{m}
              </Text>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 10 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  value: { minWidth: 66, textAlign: 'center' },
  cell: { width: 48, height: 44, alignItems: 'center', justifyContent: 'center' },
  minuteRow: { flexDirection: 'row', gap: 8 },
  minuteCell: { flex: 1, height: 44, alignItems: 'center', justifyContent: 'center' },
});
