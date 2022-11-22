import React from 'react';
import { View } from 'react-native';

import { Spinner } from '@ui-kitten/components';

import { Spacer } from './Spacer';
import { Text } from './Text';

/**
 * generic data loader component to use when skeleton component is not available
 */
export const Loader = (props: { fill?: boolean }) => {
  return (
    <View style={{ alignItems: 'center', flex: props.fill ? 1 : 0 }}>
      <Spinner size={'giant'} />
      <Spacer size={10} />
      <Text center>Loading...</Text>
    </View>
  );
};
