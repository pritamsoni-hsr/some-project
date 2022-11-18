import { Text as RNText } from 'react-native';

import { TextProps } from '@ui-kitten/components';

type Props = Partial<{
  size: number;
  /**
   * @description choose one of the predefined variants of text
   * @note adding this will override size.
   */
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption';

  center: boolean;
}>;

export const Text = (props: TextProps & Props) => (
  <RNText
    {...props}
    accessible
    suppressHighlighting
    maxFontSizeMultiplier={1.2}
    minimumFontScale={0.8}
    testID={'text'}
  />
);
