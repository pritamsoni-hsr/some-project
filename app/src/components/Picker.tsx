import { useCallback } from 'react';
import { ListRenderItem, StyleSheet } from 'react-native';
import Animated, {
  Extrapolate,
  SharedValue,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import _ from 'lodash';

import { Text, View } from '@app/components';

const ITEM_HEIGHT = 30;
const SCALE = 5; // must be odd
const PICKER_HEIGHT = ITEM_HEIGHT * SCALE;

const CYLINDER_RADIUS = 100;
const numberOfItems = 20;
const theta = (2 * Math.PI) / numberOfItems;

const d = _.range(0, numberOfItems);

export const Picker = () => {
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll(event) {
      scrollY.value = event.contentOffset.y;
    },
  });

  const renderItem: ListRenderItem<number> = useCallback(
    ({ item, index }) => {
      return <PickerItemContainer idx={index} item={item} scrollY={scrollY} />;
    },
    [scrollY],
  );

  return (
    <View style={styles.container}>
      <View style={styles.marker} />
      <Animated.FlatList
        contentContainerStyle={styles.wheel}
        data={d}
        renderItem={renderItem}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        onScroll={onScroll}
      />
    </View>
  );
};

const PickerItemContainer = ({ item, idx, scrollY }: { item: number; idx: number; scrollY: SharedValue<number> }) => {
  const container = useAnimatedStyle(() => {
    // const fromCenter = scrollY.value / ITEM_HEIGHT + SCALE / 2 - idx;
    // const t = interpolate(scrollY.value, [0, (2 * Math.PI * CYLINDER_RADIUS) / 8], [0, 360 / 8], {
    //   extrapolateLeft: Extrapolate.EXTEND,
    //   extrapolateRight: Extrapolate.IDENTITY,
    // });

    const fromCenter = Math.floor(scrollY.value / ITEM_HEIGHT) - idx;

    const getPerspective = (e: number) => {
      return CYLINDER_RADIUS * Math.cos(theta * e);
    };

    const scale = interpolate(fromCenter, [-2, 0, 2], [0.8, 1, 0.8], Extrapolate.EXTEND);
    const rotateX = interpolate(
      fromCenter,
      [-2, -1, 0, 1, 2],
      [-2 * theta, -theta, 0, theta, 2 * theta],
      Extrapolate.EXTEND,
    );
    const perspective = interpolate(
      fromCenter,
      [-2, -1, 0, 1, 2],
      [getPerspective(2), getPerspective(1), 1, getPerspective(1), getPerspective(2)],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{ scale }, { perspective }, { rotateX: `${rotateX}rad` }],
    };
  });

  return (
    <View style={styles.itemContainer}>
      <Animated.View style={[styles.common, container]}>
        <Text>random number {item}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: PICKER_HEIGHT,
    backgroundColor: '#fff3',
    position: 'relative',
  },
  wheel: {
    paddingVertical: (PICKER_HEIGHT - ITEM_HEIGHT) / 2,
  },
  marker: {
    top: (PICKER_HEIGHT - ITEM_HEIGHT) / 2,
    position: 'absolute',
    height: ITEM_HEIGHT,
    backgroundColor: '#f004',
    left: 0,
    right: 0,
  },
  common: {
    borderRadius: 2,
    paddingHorizontal: 8,
    backgroundColor: '#f00',
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
  },
});
