import { TextStyle } from 'react-native';

import { TextProps, Text as UIText } from '@ui-kitten/components';

type Props = Partial<{
  size: number;
  /**
   * @description choose one of the predefined variants of text
   * @note adding this will override size.
   */
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'footnote';
  /**
   * @description override default font weight for selected variant
   * @note h1 default font weight is bold, but if can be changed to thin using this prop.
   */
  weight: 'default' | 'bold' | 'regular' | 'thin';
  color: 'primary' | 'secondary' | 'disabled' | 'help' | 'error' | 'invert';
  center: boolean;
}>;

export const Text = ({ size = 0, variant = 'body', weight = 'default', ...props }: TextProps & Props) => (
  <UIText
    {...props}
    accessible
    suppressHighlighting
    maxFontSizeMultiplier={1.2}
    minimumFontScale={0.8}
    style={[
      props.style,
      { textAlign: props.center ? 'center' : 'auto' },
      getFontVariant(variant),
      getFontWeight(weight),
      getFontSize(size),
    ]}
    testID={'text'}
  />
);

const getFontSize = (size: Required<Props['size']>): TextStyle => {
  if (size === 0) return;
  return { fontSize: size };
};

const getFontWeight = (weight: Required<Props['weight']>): TextStyle => {
  switch (weight) {
    case 'bold':
      return { fontWeight: '800' };
    case 'regular':
      return { fontWeight: '500' };
    case 'thin':
      return { fontWeight: '300' };
  }
  return;
};

const getFontVariant = (props: Required<Props['variant']>): TextStyle => {
  switch (props) {
    case 'h1':
      return { fontSize: 32, fontWeight: '800' };
    case 'h2':
      return { fontSize: 28, fontWeight: '800' };
    case 'h3':
      return { fontSize: 24, fontWeight: '700' };
    case 'h4':
      return { fontSize: 18, fontWeight: '600' };
    case 'h5':
      return { fontSize: 15, fontWeight: '600' };
    case 'h6':
      return { fontSize: 13, fontWeight: '500' };
    case 'body':
      return { fontSize: 15, fontWeight: '500' };
    case 'caption':
      return { fontSize: 13, fontWeight: '400' };
    case 'footnote':
      return { fontSize: 11, fontWeight: '400' };
  }
  return;
};
