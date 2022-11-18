import React, { useMemo } from 'react';
import { LogBox, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableFreeze, enableScreens } from 'react-native-screens';
import Toast from 'react-native-toast-message';

import * as eva from '@eva-design/eva';
import { NavigationContainer, Theme } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { ApplicationProvider, IconRegistry, Spinner } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { enableExpoCliLogging } from 'expo/build/logs/Logs';
import { RecoilRoot } from 'recoil';

import { useAppState, useColorScheme, useTheme } from '@app/hooks';
import AppRoutes, { navigationRef } from '@app/routes';
import AppLinkingConfig from '@app/routes/linking';
import mapping from '@app/theme/mapping';
import { queryClient } from 'common/query';

enableScreens(true);
enableFreeze(true);
enableExpoCliLogging();

export default function App() {
  const { isAppReady } = useAppState();

  const scheme = useColorScheme();
  const evaTheme = useMemo(() => eva[scheme], [scheme]);

  if (!isAppReady) return null; // show loading animation with splash screen

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ApplicationProvider {...eva} customMapping={mapping.customMapping} theme={evaTheme}>
          <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />
          <IconRegistry icons={EvaIconsPack} />
          <Toast />
          <RecoilRoot>
            <NavContainer />
          </RecoilRoot>
        </ApplicationProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

const NavContainer = ({}: { theme?: Theme }) => {
  const theme = useTheme();
  return (
    <NavigationContainer
      ref={navigationRef}
      fallback={<Spinner size={'large'} />}
      linking={AppLinkingConfig}
      theme={theme}
      onStateChange={onStateChange}>
      <AppRoutes />
    </NavigationContainer>
  );
};

const onStateChange = () => {};

// avoid date related warning in state
LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);
