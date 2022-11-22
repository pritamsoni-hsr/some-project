import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem } from 'react-native';

import { Divider, Spinner } from '@ui-kitten/components';
import { useRecoilValue } from 'recoil';

import { Error, ListEmptyComponent, Loader, Text } from '@app/components';
import { TransactionResponse as Transaction, useTransactions } from 'common';

import { selectedWallet } from '../state';
import { TxListItem, getHeaderIndexes, insertDateSeparator } from './TxListItem';

type Props = {
  // add transaction button is positioned absolute, pass offset to allow last list item to be interactive.
  bottomOffset: number;
};

export const TxList = (props: Props) => {
  const walletId = useRecoilValue(selectedWallet);
  const response = useTransactions({ walletId });

  const { fetchNextPage, hasNextPage } = response;

  const fetchNext = useCallback(() => hasNextPage && fetchNextPage(), [fetchNextPage, hasNextPage]);

  const renderItem: ListRenderItem<Transaction> = useCallback(params => <TxListItem {...params} />, []);

  const data = useMemo(() => {
    return insertDateSeparator(response.data?.pages.flatMap(item => item.results));
  }, [response.data?.pages]);

  const staticHeaders = useMemo(() => getHeaderIndexes(data), [data]);

  if (!walletId) return <Text>Please select or create a wallet to start</Text>;
  if (response.isLoading) return <Loader fill />;
  if (response.isError) return <Error />;

  return (
    <FlatList
      contentContainerStyle={{ paddingBottom: props.bottomOffset, flexGrow: 1 }}
      data={data}
      ItemSeparatorComponent={Divider}
      keyExtractor={item => item.id}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={response.isFetchingNextPage && <Spinner />}
      renderItem={renderItem}
      stickyHeaderIndices={staticHeaders}
      onEndReached={fetchNext}
      onEndReachedThreshold={0.2}
    />
  );
};
