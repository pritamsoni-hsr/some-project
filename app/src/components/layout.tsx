import { ViewStyle } from 'react-native';

import { View } from './View';

type RowProps = Partial<Pick<ViewStyle, 'justifyContent' | 'alignItems'>>;

export const Row = ({ alignItems = 'center', justifyContent = 'space-around', ...props }: $Children & RowProps) => {
  return <View {...props} style={[{ flexDirection: 'row', alignItems, justifyContent }]} />;
};

export const Column = (props: $Children) => {
  return <View {...props} />;
};
