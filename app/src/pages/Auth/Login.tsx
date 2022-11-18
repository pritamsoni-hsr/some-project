import React from 'react';
import { StyleSheet } from 'react-native';

import { Button } from '@ui-kitten/components';
import * as AppleAuthentication from 'expo-apple-authentication';

import { Spacer, Text, View } from '@app/components';
import { useTheme } from '@app/hooks';

import { useApple, useGoogle } from './useOAuth';

const Login = () => {
  const theme = useTheme();
  const { onPress: continueWithApple } = useApple();
  const { onPress: continueWithGoogle } = useGoogle();

  // TODO: use `isExchangingToken` to disable navigation and show loading indicator
  return (
    <View style={[styles.page, theme.styles.sides]}>
      <Text variant={'h1'} weight={'thin'}>
        Welcome to the App
      </Text>
      <View style={styles.buttonGroup}>
        <Button onPress={continueWithGoogle}>Continue With Google</Button>
        <Spacer />
        <AppleAuthentication.AppleAuthenticationButton
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
          cornerRadius={5}
          style={styles.appleButton}
          onPress={continueWithApple}
        />
      </View>
      <Text variant={'footnote'}>By continuing you agree to our terms and conditions.</Text>
      <Spacer size={20} />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingBottom: 48,
    justifyContent: 'flex-end',
  },
  buttonGroup: {
    paddingBottom: 24,
  },
  appleButton: {
    height: 44,
  },
});

export default Login;
