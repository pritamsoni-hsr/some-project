import React, { ReactElement } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

const MARGIN = 2;

export const Grid = <T extends { id?: string }>({
  itemsPerColumn = 4,
  ...props
}: {
  data: T[];
  renderItem: (item: T) => ReactElement;
  itemsPerColumn?: number;
}) => {
  const { width: deviceWidth } = useWindowDimensions();
  const cardWidth = (deviceWidth - 30) / itemsPerColumn;

  return (
    <View style={[styles.grid, { width: itemsPerColumn * (cardWidth + MARGIN * 2) }]}>
      {props?.data?.map(item => (
        <View key={item.id} style={[styles.gridItem, { width: cardWidth }]}>
          {props.renderItem(item)}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    alignSelf: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  gridItem: {
    margin: MARGIN,
    padding: 1,
    backgroundColor: '#f004',
  },
});
