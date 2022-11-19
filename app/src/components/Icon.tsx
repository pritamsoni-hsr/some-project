import React from 'react';
import { StyleSheet, TouchableOpacityProps, ViewStyle } from 'react-native';

import { HeaderButtonProps } from '@react-navigation/elements';
import { IconProps, Icon as UiIcon } from '@ui-kitten/components';

import { useTheme } from '@app/hooks';

import Pressable from './Pressable';

type Props = Partial<{
  size: number;
  fill: string;
  default: boolean;
}>;

export const Icon = ({
  size = 20,
  onPress,
  ...props
}: Props & HeaderButtonProps & IconProps<TouchableOpacityProps>) => {
  const theme = useTheme();

  if (props.default) props.style = Icon.defaultStyle;

  const styles = StyleSheet.create({
    icon: {
      height: size,
      resizeMode: 'contain',
    },
    container: {
      borderWidth: 1,
      borderRadius: size,
      height: size * 1.5,
      width: props.default ? 'auto' : size * 1.5,
      justifyContent: 'center',
    },
  });

  return (
    <Pressable opaque style={styles.container} onPress={onPress}>
      <UiIcon fill={props.tintColor ?? theme.colors.primary} {...props} style={[styles.icon, props.style]} />
    </Pressable>
  );
};

Icon.defaultStyle = { marginHorizontal: 10, height: 20, width: 20 } as ViewStyle;
