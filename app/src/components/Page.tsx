import React from 'react';
import { StyleSheet } from 'react-native';

import { SidePadding } from './SidePadding';
import { View } from './View';

export const Page = (props: $Children) => {
  return (
    <SidePadding>
      <View style={styles.page} {...props} />
    </SidePadding>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
});
