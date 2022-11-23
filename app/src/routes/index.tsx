import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useRecoilValue } from 'recoil';

import * as Pages from '@app/pages';
import { getAppState } from '@app/state';

import AppLinkingConfig from './linking';

const Stack = createStackNavigator<AppRouting>();

const AppRoutes = () => {
  const isLoggedIn = useRecoilValue(getAppState.loggedIn);

  return (
    <Stack.Navigator
      screenOptions={{ title: '', headerShown: true, headerShadowVisible: false, headerBackTitleVisible: false }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen component={FinanceApp} name={'Finance'} options={{ headerShown: false }} />
          <Stack.Screen component={Pages.Preferences} name={'Preferences'} options={{ title: 'Preferences' }} />
          <Stack.Group>
            <Stack.Screen
              component={Pages.Finance.Transaction}
              name={'CreateTransaction'}
              options={params => ({
                headerRight: () => <Pages.Finance.Transaction.Header {...params} />,
              })}
            />
            <Stack.Screen component={Pages.Finance.WalletDetail} name={'WalletDetail'} />
            <Stack.Screen component={Pages.Finance.WalletList} name={'Wallets'} />
          </Stack.Group>
        </>
      ) : (
        <Stack.Screen component={Pages.Login} name={'Login'} />
      )}

      <Stack.Screen
        component={Pages.OpenInWhatsApp}
        name={'OpenInWhatsApp'}
        options={{ headerShown: true, title: 'Send WhatsApp' }}
      />
      <Stack.Screen
        component={Pages.HTMLView}
        name={'HTMLView'}
        options={param => ({ title: param.route.params?.title || 'Web View' })}
      />
      <Stack.Screen component={Pages.NotFound} name={'NotFound'} />
    </Stack.Navigator>
  );
};

const FinanceAppTabs = createBottomTabNavigator<FinanceRouting>();

const FinanceApp = () => {
  return (
    <FinanceAppTabs.Navigator
      screenOptions={{
        headerTitle: '',
        headerShadowVisible: false,
        tabBarStyle: { borderTopWidth: 0, elevation: 0, shadowOpacity: 0 },
      }}>
      <FinanceAppTabs.Screen component={Pages.Finance.List} name={'Transactions'} />
      <FinanceAppTabs.Screen component={Pages.Finance.Preferences} name={'Preferences'} />
    </FinanceAppTabs.Navigator>
  );
};

export const navigationRef = React.createRef<NavigationContainerRef<AppRouting>>();

/** utility to navigate from anywhere in the app */
export const navigate = (name: keyof AppRouting, params) => {
  navigationRef.current?.navigate(name, params);
};

export { AppLinkingConfig };

export default AppRoutes;
