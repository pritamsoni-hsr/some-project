import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem } from 'react-native';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Divider, Spinner } from '@ui-kitten/components';
import { useRecoilValue } from 'recoil';

import { Error, Loader, Text } from '@app/components';
import { TransactionResponse as Transaction, useTransactions } from 'common';

import { selectedWallet } from '../state';
import { TxListItem, getHeaderIndexes, insertDateSeparator } from './TxListItem';

export const TxList = () => {
  const walletId = useRecoilValue(selectedWallet);
  const response = useTransactions({ walletId });
  const bottomOffset = useBottomTabBarHeight();

  const { fetchNextPage, hasNextPage } = response;

  const fetchNext = useCallback(() => hasNextPage && fetchNextPage(), [fetchNextPage, hasNextPage]);

  const renderItem: ListRenderItem<Transaction> = useCallback(params => <TxListItem {...params} />, []);

  const data = useMemo(() => {
    return insertDateSeparator(response.data?.pages.flatMap(item => item.results));
  }, [response.data?.pages]);

  const staticHeaders = useMemo(() => getHeaderIndexes(data), [data]);

  if (!walletId) return <Text>Please select or create a wallet to start</Text>;
  if (response.isLoading) return <Loader />;
  if (response.isError) return <Error />;

  return (
    <FlatList
      contentContainerStyle={{ paddingBottom: bottomOffset }}
      data={data}
      ItemSeparatorComponent={Divider}
      keyExtractor={item => item.id}
      ListFooterComponent={response.isFetchingNextPage && <Spinner />}
      renderItem={renderItem}
      stickyHeaderIndices={staticHeaders}
      onEndReached={fetchNext}
      onEndReachedThreshold={0.2}
    />
  );
};
