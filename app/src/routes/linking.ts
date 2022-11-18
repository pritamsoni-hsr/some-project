import { LinkingOptions } from '@react-navigation/native';

const AppLinkingConfig: LinkingOptions<AppRouting> = {
  enabled: true,
  prefixes: ['tnn://', 'https://foodmesh.in'],
  config: {
    initialRouteName: 'Login',
    screens: {
      Root: '',
      Login: 'login',
      HTMLView: 'web-view',
      NotFound: '*',
    },
  },
};
export default AppLinkingConfig;
