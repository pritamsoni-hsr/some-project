import React from 'react';
import { StyleSheet } from 'react-native';

import { SidePadding } from './SidePadding';
import { Text } from './Text';
import { View } from './View';

// TODO: add placeholder graphics

export const ListEmptyComponent = ({ message = 'No results available' }: { message?: string }) => {
  return (
    <View style={styles.page}>
      <SidePadding>
        <Text>{message}</Text>
      </SidePadding>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
