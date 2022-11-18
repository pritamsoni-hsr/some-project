import React from 'react';
import { WebView } from 'react-native-webview';

import { StackScreenProps } from '@react-navigation/stack';

/**
 * page to render any web url within app
 */
const HTMLView = (props: StackScreenProps<AppRouting, 'HTMLView'>) => {
  const { uri } = props.route.params ?? {};
  return <WebView cacheEnabled decelerationRate={0.99} source={{ uri }} testID={'htmlView'} />;
};

export default HTMLView;
