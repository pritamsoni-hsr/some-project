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
const SCALE = 10; // must be even
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
    <View style={{ height: PICKER_HEIGHT, backgroundColor: '#fff3', position: 'relative' }}>
      <View
        style={{
          top: (PICKER_HEIGHT - ITEM_HEIGHT) / 2,
          position: 'absolute',
          height: ITEM_HEIGHT,
          backgroundColor: '#f004',
          left: 0,
          right: 0,
        }}
      />
      <Animated.FlatList
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
    const activeItem = Math.floor(scrollY.value / ITEM_HEIGHT);
    const fromCenter = activeItem + SCALE / 2 - idx;

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

  const styles = StyleSheet.create({
    common: {
      paddingHorizontal: 10,
      borderRadius: 4,
      backgroundColor: '#f00',
      //
    },
  });
  return (
    <View style={{ alignItems: 'center', height: ITEM_HEIGHT, justifyContent: 'center' }}>
      <Animated.View style={[styles.common, container]}>
        <Text>random number {item}</Text>
      </Animated.View>
    </View>
  );
};
