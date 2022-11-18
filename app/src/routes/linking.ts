import { LinkingOptions } from '@react-navigation/native';

const AppLinkingConfig: LinkingOptions<AppRouting> = {
  enabled: true,
  prefixes: ['tnn://', 'https://foodmesh.in'],
  config: {
    initialRouteName: 'Login',
    screens: {
      Root: '',
      Login: 'login',
      WebViewUrl: 'web-view-url',
      NotFound: '*',
    },
  },
};
export default AppLinkingConfig;
