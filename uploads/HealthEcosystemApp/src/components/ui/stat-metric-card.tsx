import { StyleSheet, View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';

import { gutter, useTheme } from '@/theme';

import { Text } from './text';

export type StatMetric = {
  /** The number itself – always readable, never truncated. */
  value: string;
  /** Short unit, e.g. 'kcal', 'g', 'phút'. Optional. */
  unit?: string;
  /** SHORT label, e.g. 'Calo', 'Đạm'. Long names belong in headings, not here. */
  label: string;
  /** Accent colour for the value. */
  color?: string;
};

/**
 * One metric: big value, small unit beside it, short label underneath.
 *
 * The label sits on its own line so it is never squeezed against the unit and
 * never ellipsised – clipped metrics were the single worst readability bug in
 * the app.
 */
export function StatMetricCard({ metric, style, compact = false }: { metric: StatMetric; style?: StyleProp<ViewStyle>; compact?: boolean }) {
  const { colors, radius } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderRadius: radius.lg, paddingVertical: compact ? 12 : 16 }, style]}>
      <View style={styles.valueRow}>
        <Text variant={compact ? 'subheading' : 'title'} color={metric.color} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
          {metric.value}
        </Text>
        {metric.unit ? (
          <Text variant="caption" color="textSecondary" style={styles.unit}>
            {metric.unit}
          </Text>
        ) : null}
      </View>
      <Text variant="label" color="textSecondary" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85} style={styles.label}>
        {metric.label}
      </Text>
    </View>
  );
}

/**
 * Responsive metric grid: four across when there is room, otherwise a 2×2
 * grid. Readability always wins over fitting everything on one line.
 */
export function StatGrid({
  metrics,
  style,
  compact = false,
  columns,
}: {
  metrics: StatMetric[];
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
  columns?: 2 | 4;
}) {
  const { width } = useWindowDimensions();
  const available = Math.min(width, 430) - gutter * 2;
  // Four columns need ~84pt each to keep "Tinh bột" on one line.
  const perRow = columns ?? (metrics.length <= 2 ? metrics.length : available >= 360 && metrics.length === 4 ? 4 : 2);
  const basis = perRow === 4 ? '23.2%' : perRow === 2 ? '48.4%' : '100%';

  return (
    <View style={[styles.grid, style]}>
      {metrics.map((metric) => (
        <StatMetricCard key={metric.label} metric={metric} compact={compact} style={{ width: basis, flexGrow: 1 }} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, gap: 2 },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 3 },
  unit: { marginBottom: 1 },
  label: { textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
