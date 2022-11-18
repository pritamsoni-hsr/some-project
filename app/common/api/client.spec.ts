import 'isomorphic-fetch';

import { api } from './client';

const newResponse = async ({ data, status }: { data?: object; status: number } = { data: undefined, status: 200 }) => {
  const response = new Response(JSON.stringify(data), { status: status, statusText: 'status-text' });
  response.clone = jest.fn().mockReturnValue(data);
  response.json = jest.fn().mockReturnValue(data);
  return response;
};

describe('Client', () => {
  it('should not use token when instantiated', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(newResponse());
    await api.wallet.getWallets({ cursor: '90' });

    expect(api.isLoggedIn()).toEqual(false);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('?cursor=90'),
      expect.objectContaining({
        headers: { Authorization: undefined },
      }),
    );
  });

  it('should use token to make requests after login', async () => {
    api.login('id-token');
    jest.spyOn(global, 'fetch').mockResolvedValue(newResponse());
    await api.wallet.getWallets({ cursor: '90' });

    expect(api.isLoggedIn()).toEqual(true);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('?cursor=90'),
      expect.objectContaining({
        headers: { Authorization: 'Bearer id-token' },
      }),
    );
  });

  it('should remove token on logout', async () => {
    api.logout();
    jest.spyOn(global, 'fetch').mockResolvedValue(newResponse());
    await api.wallet.getWallets({ cursor: '90' });

    expect(api.isLoggedIn()).toEqual(false);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('?cursor=90'),
      expect.objectContaining({
        headers: { Authorization: undefined },
      }),
    );
  });
});

describe('Client automatic token refreshing', () => {
  it('test', async () => {
    api.login('invalid-token');

    const r = newResponse({ data: { abc: 'def' }, status: 401 });

    jest.spyOn(global, 'fetch').mockResolvedValue(r);

    try {
      await api.wallet.getWallets({});
    } catch (e) {
      expect(e).toBeDefined();
      // console.log(e, "error occurred")
    }
    expect(global.fetch).toHaveBeenCalledTimes(1);
    jest.spyOn(global, 'fetch').mockResolvedValue(r);

    // should try to refetch accessToken
    // expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
