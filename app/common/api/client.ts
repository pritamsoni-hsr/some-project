// TODO: use encrypted storage
import Storage from '@react-native-async-storage/async-storage';

import { ApiBaseUrl } from '../vars';
import { AuthApi, Configuration, ConfigurationParameters, Middleware, WalletApi, WalletUtilsApi } from './openapi';

enum Keys {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
}

class APIClient {
  auth!: AuthApi;
  utils!: WalletUtilsApi;
  wallet!: WalletApi;

  constructor(private params: ConfigurationParameters) {
    this.load = this.load.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);

    this.load();
  }

  isLoggedIn() {
    return Boolean(this.params.accessToken);
  }

  login(token: string) {
    // this way the openapi spec should explicity contains info about authentication of endpoints
    this.params.accessToken = token;
    // handle refreshing token logic if access_token expires
    this.params.middleware = [refreshAccessTokenMiddleware];

    this.load();
    Storage.setItem(Keys.ACCESS_TOKEN, token);
  }

  logout() {
    this.params.accessToken = undefined;
    this.params.middleware = [];
    this.load();
    Storage.multiRemove([Keys.ACCESS_TOKEN, Keys.REFRESH_TOKEN]);
  }

  private load() {
    const config = new Configuration(this.params);
    this.auth = new AuthApi(config);
    this.utils = new WalletUtilsApi(config);
    this.wallet = new WalletApi(config);
  }

  checkAndLoadToken = async () => {
    try {
      const token = await Storage.getItem(Keys.ACCESS_TOKEN);
      if (!token) return false;

      api.login(token);
      return true;
    } catch {
      console.log('failed to get token locally, load from remote');
      return false;
    }
  };
}

export const api = new APIClient({
  basePath: ApiBaseUrl,
});

// exchange refresh token for a new pair of tokens, save them to disk and return accessToken
const refreshTokenPair = async (): Promise<string | undefined> => {
  try {
    const refreshToken = await Storage.getItem(Keys.REFRESH_TOKEN);
    if (!refreshToken) return undefined;
    const exchangeTokenResponse = await api.auth.refreshToken({ refreshTokenRequest: { refreshToken } });

    await Storage.multiSet([
      [Keys.ACCESS_TOKEN, exchangeTokenResponse.accessToken],
      [Keys.REFRESH_TOKEN, exchangeTokenResponse.refreshToken],
    ]);
    return exchangeTokenResponse.accessToken;
  } catch (e) {
    return undefined;
  }
};

const refreshAccessTokenMiddleware: Middleware = {
  post: async context => {
    const { response } = context;
    // if (!response) return response;
    if (!(response?.status === 401 && !context.init.triedRefreshingToken)) {
      return response;
    }

    context.init.triedRefreshingToken = true;

    const newAccessToken = await refreshTokenPair();

    if (!newAccessToken) return response;

    api.login(newAccessToken);
    context.init.triedRefreshingToken = false;

    return context.fetch(context.url, {
      ...context.init,
      headers: {
        ...context.init.headers,
        Authorization: `Bearer ${newAccessToken}`,
      },
    });
  },
};
