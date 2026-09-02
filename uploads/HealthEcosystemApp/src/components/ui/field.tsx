import { forwardRef } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/theme';

import { Icon, type IconName } from './icon';
import { PressableScale } from './pressable-scale';
import { Text } from './text';

type FieldProps = TextInputProps & {
  label: string;
  hint?: string;
  error?: string;
  icon?: IconName;
};

/** Labelled text input used by every form in the app. */
export const Field = forwardRef<TextInput, FieldProps>(function Field(
  { label, hint, error, icon, style, ...rest },
  ref,
) {
  const { colors, radius } = useTheme();
  return (
    <View style={styles.root}>
      <Text variant="label" color="textSecondary">
        {label}
      </Text>
      <View
        style={[
          styles.inputWrap,
          { backgroundColor: colors.surface, borderRadius: radius.md, borderColor: error ? colors.danger : 'transparent' },
        ]}>
        {icon ? <Icon name={icon} size={18} color={colors.textSecondary} /> : null}
        <TextInput
          ref={ref}
          placeholderTextColor={colors.textTertiary}
          accessibilityLabel={label}
          {...rest}
          style={[styles.input, { color: colors.text }, style]}
        />
      </View>
      {error ? (
        <Text variant="label" color="danger">
          {error}
        </Text>
      ) : hint ? (
        <Text variant="label" color="textTertiary">
          {hint}
        </Text>
      ) : null}
    </View>
  );
});

type SelectFieldProps<T extends string> = {
  label: string;
  value: T | null;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
};

/** Inline single-choice control – avoids native pickers that behave badly on web. */
export function SelectField<T extends string>({ label, value, options, onChange }: SelectFieldProps<T>) {
  const { colors, radius } = useTheme();
  return (
    <View style={styles.root}>
      <Text variant="label" color="textSecondary">
        {label}
      </Text>
      <View style={styles.options}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <PressableScale
              key={option.value}
              onPress={() => onChange(option.value)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`${label}: ${option.label}`}
              scaleTo={0.97}
              style={[
                styles.option,
                { borderRadius: radius.md, backgroundColor: selected ? colors.primary : colors.surface },
              ]}>
              <Text variant="bodySmallStrong" color={selected ? colors.onPrimary : colors.text}>
                {option.label}
              </Text>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, height: 50, borderWidth: 1 },
  input: { flex: 1, fontSize: 16, paddingVertical: 0 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: { paddingHorizontal: 14, height: 42, alignItems: 'center', justifyContent: 'center' },
});
