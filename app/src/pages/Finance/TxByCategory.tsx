import { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';

import { StackScreenProps } from '@react-navigation/stack';
import { useRecoilValue } from 'recoil';

import { Error, Loader, SidePadding, Text, View } from '@app/components';
import { TransactionResponse, useTransactions } from 'common';

import { TxListItem } from './components/TxListItem';
import { categoryName } from './components/data';
import { selectedWalletId } from './state';

export const TxByCategory = (props: StackScreenProps<FinanceStack, 'TxByCategory'>) => {
  const { params } = props.route;

  const walletId = useRecoilValue(selectedWalletId);
  const response = useTransactions({ walletId });

  const renderItem: ListRenderItem<TransactionResponse> = useCallback(({ item }) => {
    return <TxListItem item={item} />;
  }, []);

  if (response.isLoading) return <Loader fill />;
  if (response.isError) return <Error />;

  const title = categoryName(params?.id);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        data={response.data?.pages?.flatMap(e => e.results)}
        ListHeaderComponent={
          <View level={'1'}>
            <SidePadding>
              <Text size={28}>{title}</Text>
            </SidePadding>
          </View>
        }
        renderItem={renderItem}
        stickyHeaderIndices={[0]}
      />
    </View>
  );
};
