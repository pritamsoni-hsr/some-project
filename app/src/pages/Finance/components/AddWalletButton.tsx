import React from 'react';

import { useNavigation } from '@react-navigation/native';

import { Icon } from '@app/components';

export const AddWalletButton = () => {
  const { navigate } = useNavigation();

  const onPress = () => {
    navigate('WalletDetail');
  };
  return <Icon name={'plus-circle-outline'} size={20} onPress={onPress} />;
};
