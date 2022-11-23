import { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Divider, ListItem } from '@ui-kitten/components';

import { Error, ListEmptyComponent, Loader, Page, Text } from '@app/components';
import { WalletResponse, useWallets } from 'common';

const ListWalletItem = ({ item, onPress }: { item: WalletResponse; onPress: () => void }) => {
  return (
    <ListItem
      accessoryLeft={() => (
        <Text center style={{ width: 40 }}>
          {item.icon}
        </Text>
      )}
      accessoryRight={() => (
        <Text center style={{ width: 50 }}>
          {item.currency}
        </Text>
      )}
      description={item.category}
      title={item.name}
      onPress={onPress}
    />
  );
};

const List = () => {
  const { navigate } = useNavigation();
  const response = useWallets();

  const toDetailScreen = useCallback(
    (item: WalletResponse) => () => navigate('WalletDetail', { id: item.id, item }),
    [navigate],
  );

  const renderItem: ListRenderItem<WalletResponse> = useCallback(
    ({ item }) => <ListWalletItem item={item} onPress={toDetailScreen(item)} />,
    [toDetailScreen],
  );

  if (response.isLoading) return <Loader fill />;
  if (response.isError) return <Error />;

  return (
    <FlatList
      contentContainerStyle={{ flexGrow: 1 }}
      data={response.data?.results}
      ItemSeparatorComponent={Divider}
      ListEmptyComponent={ListEmptyComponent}
      renderItem={renderItem}
    />
  );
};

export const WalletList = () => {
  return (
    <Page>
      <List />
    </Page>
  );
};
