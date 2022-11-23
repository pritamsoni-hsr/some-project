import React from 'react';
import { Pressable as RNPressable, View, ViewProps } from 'react-native';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { haptics } from '@app/utils';

const AnimatedButton = Animated.createAnimatedComponent(RNPressable);

type Props = {
  opaque?: boolean;
} & Pick<ViewProps, 'style'> &
  Omit<React.ComponentProps<typeof AnimatedButton>, 'style' | 'key' | 'onPressIn' | 'onPressOut'>;

const Pressable = (props: Props & $Children) => {
  const { children, style, ...otherProps } = props;

  const scale = useSharedValue(1);

  const derivedStyles = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0.96, 1, 1.05], [0.8, 1, 1], Extrapolate.CLAMP);
    return { opacity, transform: [{ scale: scale.value }] };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.96, { duration: 250, easing: Easing.cubic });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100, easing: Easing.cubic });
  };

  const handleLongPress = () => {
    haptics.light();
    scale.value = withTiming(1.05, { duration: 100, easing: Easing.cubic });
  };

  return (
    <AnimatedButton
      accessibilityRole={'button'}
      style={[derivedStyles]}
      testID={'AnimatedButton'}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...otherProps}>
      <View style={style}>{children}</View>
    </AnimatedButton>
  );
};

export default Pressable;
