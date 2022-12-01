import React from 'react';
import { StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { ListItem } from '@ui-kitten/components';

import { Text, View } from '@app/components';
import { TransactionResponse as Transaction } from 'common';

import { categoryName, getIcon } from './data';

export const TxListItem = React.memo(({ item: tx }: { item: Transaction }) => {
  const { navigate } = useNavigation();

  const toDetailPage = () => {
    navigate('TxDetail', { id: tx.id, item: tx });
  };

  // amount 0 is not valid to store in database so this value is safe to use here.
  if (tx.amount === 0 && tx.createdAt) {
    return (
      <View level={'1'} style={styles.dateHeader}>
        <Text>{tx.createdAt.toDateString()}</Text>
      </View>
    );
  }

  return (
    <ListItem
      accessoryLeft={params => (
        <Text {...params} style={styles.listIcon}>
          {getIcon(tx.category)}
        </Text>
      )}
      accessoryRight={() => (
        <View style={[styles.description]}>
          <Text size={13}>{tx.currencySymbol}</Text>
          <Text>{tx.amount}</Text>
        </View>
      )}
      description={categoryName(tx.category)}
      title={tx.note}
      onPress={toDetailPage}
    />
  );
});

TxListItem.displayName = 'TxListItem';

const dateHeader = (createdAt: Date): Transaction =>
  ({
    id: Math.random().toString(),
    amount: 0, // amount=0 to render header, see TxListItem
    createdAt,
  } as Transaction);

export const insertDateSeparator = (data: Transaction[] = []) =>
  data.reduce<Transaction[]>((res, cur) => {
    // array.at is not available on android.
    return res?.slice(-1)[0]?.createdAt.getDate() === cur?.createdAt.getDate()
      ? [...res, cur]
      : [...res, dateHeader(cur.createdAt), cur];
  }, []);

export const getHeaderIndexes = (data: Transaction[], startFrom = 0) => {
  return data.reduce<number[]>(
    (indexes, e, idx) => (e.amount === 0 ? [...indexes, idx + startFrom] : [...indexes]),
    [],
  );
};

const styles = StyleSheet.create({
  listIcon: {
    width: 40,
    fontSize: 30,
  },
  description: {
    display: 'flex',
    flexDirection: 'row',
  },
  dateHeader: {
    paddingTop: 18,
    paddingBottom: 6,
    paddingRight: 12,
    alignItems: 'flex-end',
  },
});
