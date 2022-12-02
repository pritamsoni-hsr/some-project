import { FlatList } from 'react-native-gesture-handler';

import { useNavigation } from '@react-navigation/native';
import { Button, Divider, ListItem } from '@ui-kitten/components';

import { Page, SidePadding, Text, View } from '@app/components';
import { IncomeType, useCategories } from 'common';

import { SpendCategories } from './data';

export const Categories = () => {
  const { navigate } = useNavigation();
  const response = useCategories();

  return (
    <Page>
      <FlatList
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 52 }}
        data={[...(response.data?.results || []), ...SpendCategories]}
        ItemSeparatorComponent={Divider}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ListItem
            accessoryLeft={<Text>{item.icon}</Text>}
            accessoryRight={<Text>{item.type === IncomeType.Income ? '+' : '-'}</Text>}
            description={item.subCategories.join(', ')}
            disabled={item.id.length === 10} // ids are first 10 char of md5 hash of lowercase name
            title={item.name}
          />
        )}
      />
      <View style={{ bottom: 20, position: 'absolute', left: 0, right: 0 }}>
        <SidePadding>
          <Button onPress={() => navigate('CategoryCreate')}>Add new</Button>
        </SidePadding>
      </View>
    </Page>
  );
};
