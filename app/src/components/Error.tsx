import React from 'react';
import { StyleSheet } from 'react-native';

import { Text } from './Text';
import { View } from './View';

const defaultErrMessage = `
Something went wrong. We got notified of this issue.
Please try again later.
`.trim();

export const Error = ({ message = defaultErrMessage }: { message?: string }) => {
  return (
    <View style={styles.page}>
      <Text>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
