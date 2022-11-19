import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { StackScreenProps } from '@react-navigation/stack';

import { Text, View } from '@app/components';
import { useTheme } from '@app/hooks';

const NotFoundScreen = ({ navigation }: StackScreenProps<AppRouting, 'NotFound'>) => {
  const { spacing } = useTheme();
  // TODO navigate to page available irrespective of authentication status
  const onPress = () => navigation.replace('Login');
  return (
    <View style={[styles.container, { paddingHorizontal: spacing.gap }]}>
      <Text variant={'h4'}>Error 404.</Text>
      <Text>Resource you are looking for is not found.</Text>
      <TouchableOpacity style={styles.link} onPress={onPress}>
        <Text style={styles.linkText}>Go Back!</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NotFoundScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
