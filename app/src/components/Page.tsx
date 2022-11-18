import React from 'react';
import { StyleSheet } from 'react-native';

import { Layout } from '@ui-kitten/components';

import { SidePadding } from './SidePadding';

export const Page = (props: $Children) => {
  return (
    <SidePadding>
      <Layout style={styles.page} {...props} />
    </SidePadding>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
});
