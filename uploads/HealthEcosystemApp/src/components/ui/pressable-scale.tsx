import { type ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { haptics } from '@/utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type PressableScaleProps = Omit<PressableProps, 'style' | 'children'> & {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Scale applied while pressed. */
  scaleTo?: number;
  /** Haptic played on press-in; `null` disables. */
  haptic?: 'selection' | 'light' | 'medium' | null;
  /** Dim slightly when pressed (useful on photographic surfaces). */
  dim?: boolean;
};

/**
 * Pressable with a subtle spring scale – the single press feedback used across
 * the app so interactions feel consistent. Only transform/opacity animate.
 */
export function PressableScale({
  children,
  style,
  scaleTo = 0.97,
  haptic = 'selection',
  dim = false,
  onPressIn,
  onPressOut,
  disabled,
  ...rest
}: PressableScaleProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
    opacity: opacity.get(),
  }));

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      onPressIn={(event) => {
        scale.set(withTiming(scaleTo, { duration: 110 }));
        if (dim) opacity.set(withTiming(0.88, { duration: 110 }));
        if (haptic) haptics[haptic]();
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.set(withSpring(1, { damping: 18, stiffness: 260 }));
        if (dim) opacity.set(withTiming(1, { duration: 160 }));
        onPressOut?.(event);
      }}
      style={[animatedStyle, disabled ? { opacity: 0.55 } : null, style]}>
      {children}
    </AnimatedPressable>
  );
}
