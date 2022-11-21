import React from 'react';
import { StyleSheet, View } from 'react-native';

type IProps = {
  size?: number;
  direction?: 'horizontal' | 'vertical' | 'both' | 'fill';
};

export const Spacer = ({ direction = 'vertical', size = 15 }: IProps) => {
  switch (direction) {
    case 'vertical':
      return <View style={{ height: size }} />;
    case 'horizontal':
      return <View style={{ width: size }} />;
    case 'fill':
      return <View style={styles.fill} />;
    default:
      return <View style={{ width: size, height: size }} />;
  }
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
