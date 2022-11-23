import React, { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Button } from '@ui-kitten/components';
import { useRecoilState } from 'recoil';

import { Error, Loader, Pressable, Row, Spacer, Text } from '@app/components';
import { WalletResponse, useWallets } from 'common';

import { selectedWallet } from '../state';
import { AddWalletButton } from './AddWalletButton';

export const WalletCarousel = () => {
  const response = useWallets();
  const navigation = useNavigation();

  const [walletId, setWalletId] = useRecoilState(selectedWallet);
  const firstWallet = response.data?.results?.[0];

  useEffect(() => {
    setWalletId(firstWallet?.id!);
  }, [setWalletId, firstWallet?.id]);

  if (response.isLoading) return <Loader />;
  if (response.isError) return <Error />;
  // no empty state, BE will ensure that user has atleast one wallet.

  return (
    <ScrollView horizontal contentContainerStyle={styles.list} showsHorizontalScrollIndicator={false}>
      <AddWalletButton />
      <Spacer direction={'horizontal'} />

      <Button onPress={() => navigation.navigate('Wallets')}>Manage</Button>
      <Spacer direction={'horizontal'} />

      {response.data.results?.map(w => (
        <React.Fragment key={w.id}>
          <WalletCarouselItem key={w.id} isSelected={w.id === walletId} selectWallet={setWalletId} wallet={w} />
          <Spacer direction={'horizontal'} />
        </React.Fragment>
      ))}
    </ScrollView>
  );
};

type ItemProps = {
  wallet: WalletResponse;
  isSelected: boolean;
  selectWallet: (e: string) => void;
};
const WalletCarouselItem = ({ wallet, isSelected, selectWallet }: ItemProps) => {
  return (
    <Pressable
      style={[styles.walletItem, { backgroundColor: isSelected ? '#f009' : '#040' }]}
      onPress={() => selectWallet(wallet.id)}>
      <Row justifyContent={'space-between'}>
        <Text>{wallet.name}</Text>
        <Text>{wallet.icon}</Text>
      </Row>
      <Spacer size={8} />
      <Row justifyContent={'flex-start'}>
        <Text>{wallet.currencySymbol} </Text>
      </Row>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingStart: 20,
    paddingVertical: 4,
    alignItems: 'center',
  },
  walletItem: {
    width: 140,
    height: 60,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});
