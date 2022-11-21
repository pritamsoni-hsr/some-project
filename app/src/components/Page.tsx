import React from 'react';
import { StyleSheet } from 'react-native';

import { View } from './View';

export const Page = (props: $Children) => {
  return <View style={styles.page} {...props} />;
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
});
