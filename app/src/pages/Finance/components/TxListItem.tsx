import React from 'react';
import { StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { ListItem } from '@ui-kitten/components';
import { useRecoilValue } from 'recoil';

import { Text, View } from '@app/components';
import { TransactionResponse as Transaction } from 'common';

import { DefaultCategoryData, IncomeTypeIcon } from '../data';
import { useGetWalletById } from '../hooks';
import { selectedWallet } from '../state';
import { renderAmount } from '../utils';

export const TxListItem = React.memo(({ item: tx }: { item: Transaction }) => {
  const { navigate } = useNavigation();

  const walletId = useRecoilValue(selectedWallet);
  const wallet = useGetWalletById(walletId);

  const toDetailPage = () => {
    navigate('CreateTransaction', { id: tx.id, item: tx });
  };

  if (!wallet) return null;

  // amount 0 is not valid to store in database so this value is safe to use here.
  if (tx.amount === 0 && tx.createdAt) {
    return (
      <View style={styles.dateHeader} level={'1'}>
        <Text>{tx.createdAt.toDateString()}</Text>
      </View>
    );
  }

  return (
    <ListItem
      accessoryLeft={params => (
        <Text {...params} style={styles.listIcon}>
          {getIcon(tx)}
        </Text>
      )}
      accessoryRight={() => (
        <View style={[styles.description]}>
          <Text size={13}>{renderAmount(tx, wallet)}</Text>
        </View>
      )}
      description={tx.category}
      title={tx.note}
      onPress={toDetailPage}
    />
  );
});

const getIcon = (tx: Transaction) => {
  if (!tx.isDebit) return IncomeTypeIcon.Income;
  if (tx.more.transferTo) return IncomeTypeIcon.Transfer;
  return DefaultCategoryData.find(e => e.id === tx.category || e.id === 'Misc')?.icon;
};

const dateHeader = (createdAt: Date): Transaction =>
  ({
    id: Math.random().toString(),
    amount: 0, // amount=0 to render header, see TxListItem
    createdAt,
  } as Transaction);

export const insertDateSeparator = (data: Transaction[] = []) =>
  data.reduce<Transaction[]>(
    (res, cur) =>
      res.at(-1)?.createdAt.getDate() === cur?.createdAt.getDate()
        ? [...res, cur]
        : [...res, dateHeader(cur.createdAt), cur],
    [],
  );

export const getHeaderIndexes = (data: Transaction[]) => {
  return data.reduce<number[]>((indexes, e, idx) => (e.amount === 0 ? [...indexes, idx] : [...indexes]), []);
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
