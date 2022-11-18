import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { StackScreenProps } from '@react-navigation/stack';

import { View as Layout, Text } from '@app/components';

const NotFoundScreen = ({ navigation }: StackScreenProps<AppRouting, 'NotFound'>) => {
  // TODO navigate to page available irrespective of authentication status
  const onPress = () => navigation.replace('Login');
  return (
    <Layout style={styles.container}>
      <Text variant={'h4'}>Error 404.</Text>
      <Text>Resource you are looking for is not found.</Text>
      <TouchableOpacity style={styles.link} onPress={onPress}>
        <Text style={styles.linkText}>Go Back!</Text>
      </TouchableOpacity>
    </Layout>
  );
};

export default NotFoundScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff0',
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
