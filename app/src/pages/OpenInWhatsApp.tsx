import React, { useState } from 'react';
import { Linking } from 'react-native';

import { Button, Input } from '@ui-kitten/components';

import { Page, Spacer } from '@app/components';

const CountryCode = '91';

export const OpenInWhatsApp = () => {
  const [number, setNumber] = useState('');
  const onPress = () => {
    Linking.openURL(`http://wa.me/${CountryCode}${number}`);
  };
  return (
    <Page>
      <Spacer size={80} />
      <Input
        autoFocus
        keyboardType={'number-pad'}
        label={'Phone number'}
        maxLength={10}
        placeholder='phone number'
        returnKeyType={'done'}
        value={number}
        onChangeText={setNumber}
      />
      <Spacer />
      <Button disabled={number.length !== 10} onPress={onPress}>
        Send WhatsApp
      </Button>
    </Page>
  );
};
