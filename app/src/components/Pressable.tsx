import React from 'react';
import { Pressable as RNPressable, View, ViewProps } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { haptics } from '@app/utils';

const AnimatedButton = Animated.createAnimatedComponent(RNPressable);

type Props = {
  opaque?: boolean;
  highlightedOpacity?: number;
} & Pick<ViewProps, 'style'> &
  Omit<React.ComponentProps<typeof AnimatedButton>, 'style' | 'key' | 'onPressIn' | 'onPressOut'>;

const Pressable = (props: Props & $Children) => {
  const { highlightedOpacity = 0.2, children, style, ...otherProps } = props;

  const pressed = useSharedValue(0);

  const derivedStyles = useAnimatedStyle(() => {
    const isPressed = pressed.value === 1;

    const scale = withTiming(isPressed ? 0.96 : 1, { duration: 150, easing: Easing.cubic });

    const opacity = withTiming(isPressed ? highlightedOpacity : 1, { duration: 150, easing: Easing.cubic });

    return { opacity, transform: [{ scale }] };
  });

  const handlePressIn = () => (pressed.value = 1);

  const handlePressOut = () => (pressed.value = 0);

  return (
    <AnimatedButton
      accessibilityRole={'button'}
      style={[derivedStyles]}
      testID={'AnimatedButton'}
      onLongPress={haptics.light}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...otherProps}>
      <View style={style}>{children}</View>
    </AnimatedButton>
  );
};

export default Pressable;
