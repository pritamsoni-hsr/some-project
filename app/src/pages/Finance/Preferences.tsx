import React from 'react';

import { useNavigation } from '@react-navigation/native';
import { Button, Divider, ListItem } from '@ui-kitten/components';

import { Page, SidePadding, Spacer } from '@app/components';

import { useLogout } from '../Auth/useOAuth';

export const Preferences = () => {
  const { navigate } = useNavigation();

  return (
    <Page>
      <ListItem title={'Add new wallet'} onPress={() => navigate('WalletCreate')} />
      <Divider />
      <ListItem title={'Manage you wallets'} onPress={() => navigate('Wallets')} />
      <Divider />
      <ListItem title={'Manage your categories'} onPress={() => navigate('Categories')} />
      <Divider />
      <Spacer direction={'fill'} />
      <SidePadding>
        <LogoutButton />
      </SidePadding>
    </Page>
  );
};

const LogoutButton = () => {
  const { handleLogout } = useLogout();
  return <Button onPress={handleLogout}>Logout</Button>;
};
