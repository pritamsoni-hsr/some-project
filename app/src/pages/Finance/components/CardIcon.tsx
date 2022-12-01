import React from 'react';
import { StyleSheet } from 'react-native';

import { Pressable, Text } from '@app/components';
import { useTheme } from '@app/hooks';

type Props<T = { id: string; icon: string; name: string }> = {
  width?: number;
  selected: boolean;
  onPress: (e: T) => void;
} & T;

export const CardIcon = ({ ...props }: Props) => {
  const { theme } = useTheme();
  const backgroundColor = theme[props.selected ? 'background-basic-color-4' : 'background-basic-color-1'];

  const handlePress = () => props.onPress(props);
  return (
    <Pressable key={props.name} style={[styles.card, { backgroundColor }]} onPress={handlePress}>
      <Text size={40} style={styles.icon}>
        {props.icon}
      </Text>
      <Text center ellipsizeMode={'tail'} numberOfLines={1} style={styles.label} variant={'footnote'}>
        {props.name}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    aspectRatio: 1,
    borderRadius: 0,
  },
  icon: {
    marginVertical: 5,
    alignSelf: 'center',
  },
  label: {
    textTransform: 'capitalize',
  },
});
