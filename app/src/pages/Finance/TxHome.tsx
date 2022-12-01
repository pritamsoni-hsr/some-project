import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { useNavigation } from '@react-navigation/native';
import { Button } from '@ui-kitten/components';
import { useRecoilValue } from 'recoil';

import { Icon, Page, Row, SidePadding, Spacer, Text, View } from '@app/components';

import { TxList } from './components/TxList';
import { TxListCategoryDistribution } from './components/TxListCategoryDistribution';
import { WalletCarousel } from './components/WalletCarousel';
import { selectedWallet } from './state';

export const TxHome = () => {
  const [showMonthly, setShowMonthly] = useState(true);

  const { navigate } = useNavigation();
  const toCreateTransaction = () => navigate('TxDetail');

  return (
    <Page>
      <View>
        {/* TODO: add animation to overview component */}
        <Animated.View>
          <Overview onPress={() => setShowMonthly(x => !x)} />
          <Spacer />
        </Animated.View>
        <WalletCarousel />
      </View>

      <Spacer />

      {showMonthly ? <TxListCategoryDistribution bottomOffset={52} /> : <TxList bottomOffset={52} />}

      <SidePadding>
        <Button style={styles.button} onPress={toCreateTransaction}>
          Add Transaction
        </Button>
      </SidePadding>
    </Page>
  );
};

const Overview = (props: { onPress: () => void }) => {
  const wallet = useRecoilValue(selectedWallet);

  if (!wallet) return null;

  return (
    <Row justifyContent={'center'}>
      <Icon name={'star'} onPress={props.onPress} />
      <Spacer direction={'horizontal'} />
      <Text size={32}>{wallet.currencySymbol}</Text>
      <Text size={32}>{wallet.value}</Text>
    </Row>
  );
};

const styles = StyleSheet.create({
  button: {
    bottom: 10,
    width: '100%',
    position: 'absolute',
    alignSelf: 'center',
  },
});
