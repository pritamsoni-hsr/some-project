import { useCallback } from 'react';
import { ListRenderItem, StyleSheet, View } from 'react-native';
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { Text } from '@app/components';
import { haptics } from '@app/utils';

const ITEM_HEIGHT = 30;
const SCALE = 5; // must be odd
const PICKER_HEIGHT = ITEM_HEIGHT * SCALE;
const CYLINDER_RADIUS = 90;

type Props<T extends string | number> = {
  data: T[];
  // selected?: T;
  onChange: (e: T) => void;
  // renderItem?: (e: T, idx: number) => React.ReactElement;
};

export const Picker = <T extends string | number>(props: Props<T>) => {
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll(event) {
      scrollY.value = event.contentOffset.y;
    },
  });

  useAnimatedReaction(
    // trigger haptics when active item changes
    () => {
      return Math.floor(scrollY.value / ITEM_HEIGHT);
    },
    (result, prev) => {
      if (props.data[result] !== undefined && result !== prev) {
        runOnJS(props.onChange)(props.data[result]);
        runOnJS(haptics)();
      }
    },
    [],
  );

  const renderItem: ListRenderItem<T> = useCallback(
    ({ item, index }) => {
      return (
        <PickerItemContainer idx={index} scrollY={scrollY}>
          <Text>{item}</Text>
        </PickerItemContainer>
      );
    },
    [scrollY],
  );

  return (
    <View style={styles.container}>
      <View style={styles.marker} />
      <Animated.FlatList
        // TODO: add initial index support, is broken because of useAnimatedReaction
        // initialScrollIndex={props.data.findIndex(e => e === props.selected)}
        contentContainerStyle={styles.wheel}
        data={props.data}
        renderItem={renderItem}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        onScroll={onScroll}
      />
    </View>
  );
};

const PickerItemContainer = ({
  idx,
  scrollY,
  children,
}: {
  idx: number;
  scrollY: SharedValue<number>;
  children: React.ReactNode;
}) => {
  const pickerItemStyles = useAnimatedStyle(() => {
    // credits @ionic-picker
    const pickerRotateFactor = -0.46;
    const selectedIndex = Math.floor(scrollY.value / ITEM_HEIGHT);
    const y = selectedIndex > -1 ? -(selectedIndex * ITEM_HEIGHT) : 0;

    const optOffset = idx * ITEM_HEIGHT + y;

    const rotateX = optOffset * pickerRotateFactor;

    if (Math.abs(rotateX) <= 90) {
      return {
        transform: [{ perspective: CYLINDER_RADIUS }, { rotateX: `${rotateX}deg` }],
      };
    }

    return { transform: [{ translateY: -9999 }] };
  });

  return <Animated.View style={[styles.itemContainer, pickerItemStyles]}>{children}</Animated.View>;
};

const styles = StyleSheet.create({
  container: {
    height: PICKER_HEIGHT,
    position: 'relative',
  },
  wheel: {
    paddingVertical: (PICKER_HEIGHT - ITEM_HEIGHT) / 2,
  },
  marker: {
    position: 'absolute',
    height: ITEM_HEIGHT,
    top: (PICKER_HEIGHT - ITEM_HEIGHT) / 2,
    left: 0,
    right: 0,
    backgroundColor: '#f003',
    borderRadius: 4,
  },
  itemContainer: {
    paddingHorizontal: 8,
    marginHorizontal: 20,
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
