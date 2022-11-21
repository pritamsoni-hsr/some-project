import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@ui-kitten/components';
import * as EXUpdates from 'expo-updates';

import { SidePadding } from './SidePadding';
import { Text } from './Text';
import { View } from './View';

export default class ErrorBoundary extends React.Component<$Children, { hasError: boolean }> {
  constructor(props: $Children) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // TODO log to sentry
    console.warn(error, info);
  }

  static getDerivedStateFromError(error) {
    console.warn(error);
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.page}>
          <View style={styles.centered}>
            <Text style={styles.label} variant={'h4'}>
              Something went wrong.
            </Text>
          </View>
          <SidePadding>
            <Button onPress={EXUpdates.reloadAsync}>Tap here to go back</Button>
          </SidePadding>
        </SafeAreaView>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingBottom: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    paddingTop: 20,
  },
});
