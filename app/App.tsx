import React, { useMemo } from 'react';
import { LogBox, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableFreeze, enableScreens } from 'react-native-screens';
import Toast from 'react-native-toast-message';

import * as eva from '@eva-design/eva';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { ApplicationProvider, IconRegistry, Spinner } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { enableExpoCliLogging } from 'expo/build/logs/Logs';
import { RecoilRoot } from 'recoil';

import { ErrorBoundary } from '@app/components';
import { useAppState, useColorScheme, useTheme } from '@app/hooks';
import AppRoutes, { AppLinkingConfig, navigationRef } from '@app/routes';
import mapping from '@app/theme/mapping';
import { queryClient } from 'common/query';

enableScreens(true);
enableFreeze(true);
enableExpoCliLogging();

// another component so that recoil hooks can be used
const AppUI = () => {
  const { isAppReady } = useAppState();

  const scheme = useColorScheme();
  const evaTheme = useMemo(() => eva[scheme], [scheme]);

  if (!isAppReady) return null; // show loading animation with splash screen

  return (
    <ErrorBoundary>
      <ApplicationProvider {...eva} customMapping={mapping.customMapping} theme={evaTheme}>
        <IconRegistry icons={EvaIconsPack} />
        <Toast />
        <NavContainer dark={scheme === 'dark'} />
      </ApplicationProvider>
    </ErrorBoundary>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <SafeAreaProvider>
          <AppUI />
        </SafeAreaProvider>
      </RecoilRoot>
    </QueryClientProvider>
  );
}

const onStateChange = () => {};

const NavContainer = ({ dark = true }: { dark?: boolean }) => {
  const theme = useTheme();
  return (
    <NavigationContainer
      ref={navigationRef}
      fallback={<Spinner size={'large'} />}
      linking={AppLinkingConfig}
      theme={theme}
      onStateChange={onStateChange}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      <AppRoutes />
    </NavigationContainer>
  );
};

// avoid date related warning in state
LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);
