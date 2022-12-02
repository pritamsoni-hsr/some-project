import { FlatList } from 'react-native-gesture-handler';

import { Button, Divider, ListItem } from '@ui-kitten/components';

import { Page, SidePadding, View } from '@app/components';

import { CategoriesLabels } from './data';

export const Categories = () => {
  return (
    <Page>
      <FlatList
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 52 }}
        data={Object.entries(CategoriesLabels)}
        ItemSeparatorComponent={Divider}
        keyExtractor={([title]) => title}
        renderItem={({ item: [title, value] }) => (
          <ListItem key={title} description={value.join(', ')} title={title} />
        )}
      />
      <View style={{ bottom: 20, position: 'absolute', left: 0, right: 0 }}>
        <SidePadding>
          <Button>Add new</Button>
        </SidePadding>
      </View>
    </Page>
  );
};
