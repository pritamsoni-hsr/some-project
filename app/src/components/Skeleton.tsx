import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { LinearGradient } from 'expo-linear-gradient';

type Props = Partial<{
  style: ViewStyle;
  height: number;
  color1: string;
  color2: string;
  borderRadius: number;
}>;

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
export const Skeleton = (props: Props) => {
  const { height = 10, borderRadius = 12, color1 = '#f5ededc9', color2 = '#b7acacbd' } = props;

  const gradientStartX = useSharedValue(0);

  useEffect(() => {
    gradientStartX.value = withRepeat(withTiming(1, { duration: 800, easing: Easing.ease }), -1, true);
    return () => {
      cancelAnimation(gradientStartX);
    };
  }, [gradientStartX]);

  const startGradient = useAnimatedProps(() => {
    return { x: gradientStartX.value, y: 0 };
  });

  return (
    <AnimatedLinearGradient
      colors={[color1, color2]}
      end={{ x: 1, y: 0 }}
      start={startGradient as Required<typeof startGradient>}
      style={[props.style, { borderRadius, height }]}
    />
  );
};
