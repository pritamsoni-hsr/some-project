import React from 'react';
import { View } from 'react-native';

import { Spinner } from '@ui-kitten/components';

import { Spacer } from './Spacer';
import { Text } from './Text';

/**
 * generic data loader component to use when skeleton component is not available
 */
export const Loader = () => {
  return (
    <View style={{ alignItems: 'center' }}>
      <Spinner size={'giant'} />
      <Spacer size={10} />
      <Text center>Loading...</Text>
    </View>
  );
};
