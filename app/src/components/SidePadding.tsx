import { useTheme } from '@app/hooks';

import { View } from './View';

export const SidePadding = (props: $Children) => {
  const { styles } = useTheme();

  return <View style={styles.sides}>{props.children}</View>;
};
