import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { useNavigation } from '@react-navigation/native';
import { Button } from '@ui-kitten/components';
import { useRecoilState } from 'recoil';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { Error, Loader, Pressable, Row, SidePadding, Spacer, Text, View } from '@app/components';
import { Icon } from '@app/components';
import { WalletResponse, useWallets } from 'common';

import { selectedWallet } from '../state';

export const WalletCarousel = () => {
  const [wallet, setWallet] = useRecoilState(selectedWallet);
  const response = useWallets();
  const { navigate } = useNavigation();
  const toCreateWallet = () => navigate('WalletCreate');

  const scrollX = useSharedValue(0);

  const handleScroll = useAnimatedScrollHandler(event => {
    scrollX.value = event.contentOffset.x;
  });

  const txStyle = useAnimatedStyle(() => {
    return { transform: [{ translateX: scrollX.value }], zIndex: 12, position: 'absolute' };
  }, [scrollX]);

  const firstWallet = response.data?.results?.[0];

  useDeepCompareEffect(() => {
    firstWallet && setWallet(x => (x ? { ...x } : firstWallet));
  }, [setWallet, firstWallet, []]);

  if (response.isLoading) return <Loader />;
  if (response.isError) return <Error />;
  if (response.data?.results?.length === 0)
    return (
      <SidePadding>
        <Button onPress={toCreateWallet}>Create Wallet</Button>
      </SidePadding>
    );
  return (
    <Animated.ScrollView
      horizontal
      contentContainerStyle={styles.list}
      scrollEventThrottle={16}
      showsHorizontalScrollIndicator={false}
      onScroll={handleScroll}>
      <Animated.View style={txStyle}>
        <View level={'1'} style={{ padding: 6, borderTopRightRadius: 12, borderBottomRightRadius: 12 }}>
          <Icon name={'plus-circle-outline'} size={20} onPress={toCreateWallet} />
          <Spacer direction={'horizontal'} />
        </View>
      </Animated.View>
      <Spacer direction={'horizontal'} size={40} />

      {response.data.results.map(w => (
        <React.Fragment key={w.id}>
          <WalletCarouselItem key={w.id} isSelected={w.id === wallet?.id} selectWallet={setWallet} wallet={w} />
          <Spacer direction={'horizontal'} />
        </React.Fragment>
      ))}
    </Animated.ScrollView>
  );
};

type ItemProps = {
  wallet: WalletResponse;
  isSelected: boolean;
  selectWallet: (e: WalletResponse) => void;
};

const WalletCarouselItem = ({ wallet, isSelected, selectWallet }: ItemProps) => {
  return (
    <Pressable
      style={[styles.walletItem, { backgroundColor: isSelected ? '#f009' : '#040', borderWidth: isSelected ? 2 : 0 }]}
      onPress={() => selectWallet(wallet)}>
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
