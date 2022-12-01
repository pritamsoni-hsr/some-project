import { useCallback, useMemo, useState } from 'react';
import { FlatList, ListRenderItem } from 'react-native';

import { Header } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import { Divider, ListItem } from '@ui-kitten/components';
import moment from 'moment';
import { useRecoilValue } from 'recoil';

import { Error, Icon, ListEmptyComponent, Loader, Page, Spinner, Text, View } from '@app/components';
import { useTransactions } from 'common';

import { selectedWalletId } from '../state';
import { categoryName } from './data';

type Props = {
  bottomOffset: number;
};

export const TxListCategoryDistribution = (props: Props) => {
  const walletId = useRecoilValue(selectedWalletId);

  const [selectedDate, setDate] = useState(new Date());

  const addMonth = useCallback((m: number) => {
    setDate(e => moment(e).add(m, 'months').toDate());
  }, []);

  const response = useTransactions({ walletId });

  const results = useMemo(() => response.data?.pages.flatMap(item => item.results), [response.data?.pages]);

  const data = useMemo(() => {
    const valueMap = results?.reduce<Record<string, number>>(
      (prev, curr) => ({ ...prev, [curr.category]: (prev[curr.category] ?? 0) + 1 }),
      {},
    );
    return Object.entries(valueMap ?? {});
  }, [results]);

  const renderItem: ListRenderItem<[string, number]> = useCallback(
    ({ item: [item, count] }) => {
      const share = `${(100 * count) / (results?.length || 1)}%`;
      return <TxCategoryItem share={share} title={item} />;
    },
    [results?.length],
  );

  if (!walletId)
    return (
      <Page>
        <Text>Please select or create a wallet to start</Text>
      </Page>
    );

  if (response.isLoading) return <Loader fill />;
  if (response.isError) return <Error />;

  return (
    <FlatList
      contentContainerStyle={{ paddingBottom: props.bottomOffset, flexGrow: 1 }}
      data={data}
      ItemSeparatorComponent={Divider}
      keyExtractor={([item]) => item}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={<Spinner animating={response.isFetchingNextPage} />}
      ListHeaderComponent={
        <Header
          headerLeft={() => <Icon default name={'chevron-left'} onPress={() => addMonth(-1)} />}
          headerRight={() => <Icon default name={'chevron-right'} onPress={() => addMonth(1)} />}
          headerShadowVisible={false}
          headerTitleAlign={'center'}
          title={moment(selectedDate).format('MMMM YYYY')}
        />
      }
      renderItem={renderItem}
      onEndReachedThreshold={0.2}
    />
  );
};

const TxCategoryItem = ({ share, title }: { share: string; title: string }) => {
  const { navigate } = useNavigation();
  return (
    <View style={{ position: 'relative' }}>
      <View
        pointerEvents={'none'}
        style={{
          height: '100%',
          width: share,
          backgroundColor: '#aa03',
          position: 'absolute',
          zIndex: 12,
        }}
      />
      <ListItem
        accessoryRight={() => <Icon name={'chevron-right'} />}
        description={
          share
          // CategoriesLabels[item].join(', ')
        }
        title={categoryName(title)}
        onPress={() =>
          navigate('Finance', {
            screen: 'TxByCategory',
            params: { id: title },
          })
        }
      />
    </View>
  );
};
