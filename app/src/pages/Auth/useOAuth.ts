import { useCallback, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

import * as AppleAuthentication from 'expo-apple-authentication';
import { CodeChallengeMethod, Prompt, ResponseType } from 'expo-auth-session';
import { useAuthRequest } from 'expo-auth-session/build/providers/Google';
import { useSetRecoilState } from 'recoil';

import { getAppState } from '@app/state';
import { Providers, api, getErrorMessage } from 'common';
import { GoogleOAuthClientId, iOSClientId } from 'common/vars';

export const useGoogle = () => {
  const setLoggedIn = useSetRecoilState(getAppState.loggedIn());
  const [isExchangingToken, setExchangingToken] = useState(false);
  const [, response, promptAsync] = useAuthRequest(
    {
      clientId: GoogleOAuthClientId,
      codeChallengeMethod: CodeChallengeMethod.S256,
      iosClientId: iOSClientId,
      prompt: Prompt.SelectAccount,
      responseType: ResponseType.IdToken,
    },
    { useProxy: true, scheme: 'tnn' },
  );

  const onPress = async () => {
    await promptAsync({ showTitle: true, dismissButtonStyle: 'cancel', readerMode: false });
  };

  const exchangeIdToken = useCallback(
    async (token: string) => {
      try {
        setExchangingToken(true);
        const { accessToken } = await api.auth.exchangeToken({
          exchangeTokenRequest: { provider: Providers.Google, token },
        });
        api.login(accessToken);
        setLoggedIn(true);
      } catch (e) {
        const err = await getErrorMessage(e);
        Toast.show({ text1: 'Login failed', text2: `${err}` });
      } finally {
        setExchangingToken(false);
      }
    },
    [setLoggedIn],
  );

  useEffect(() => {
    if (response && response?.type === 'success' && response.params?.id_token) {
      exchangeIdToken(response.params.id_token);
    }
  }, [response, exchangeIdToken]);

  return { isExchangingToken, onPress };
};

export const useApple = () => {
  const setLoggedIn = useSetRecoilState(getAppState.loggedIn());
  const [isExchangingToken, setExchangingToken] = useState(false);
  const exchangeIdToken = useCallback(
    async (token: string) => {
      try {
        setExchangingToken(true);
        const { accessToken } = await api.auth.exchangeToken({
          exchangeTokenRequest: { provider: Providers.Apple, token },
        });
        api.login(accessToken);
        setLoggedIn(true);
      } catch (e) {
        const err = await getErrorMessage(e);
        Toast.show({ text1: 'Login failed', text2: `${err}` });
      } finally {
        setExchangingToken(false);
      }
    },
    [setLoggedIn],
  );

  const onPress = async () => {
    try {
      if (!(await AppleAuthentication.isAvailableAsync())) {
        Toast.show({ text1: 'Login with Apple is not available.' });
        return;
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      await exchangeIdToken(credential.identityToken);
      // signed in
    } catch (e) {
      if (e?.code === 'ERR_CANCELED') {
        return;
      }
      // log error
      Toast.show({ text1: 'something went wrong.' });
    }
  };

  return { isExchangingToken, onPress };
};

export const useLogout = () => {
  const setLoggedIn = useSetRecoilState(getAppState.loggedIn());

  const handleLogout = useCallback(() => {
    api.logout();
    setLoggedIn(false);
  }, [setLoggedIn]);
  return { handleLogout };
};
