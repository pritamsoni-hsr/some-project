import { act, renderHook } from '@testing-library/react-hooks';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { getAppState } from '@app/state';
import { RecoilWrapper } from '@app/utils/wrapper';
import { api } from 'common/api';

import { useLogout } from './useOAuth';

describe('Test oauth hooks', () => {
  it('logout should clear the token from api and set app state loggedIn to false', async () => {
    const { result: loginAction } = renderHook(() => useSetRecoilState(getAppState.loggedIn));

    api.login('id-token');
    act(() => {
      loginAction.current(true); //set loggedIn to true
    });
    expect(api.isLoggedIn()).toEqual(true);

    const { result } = renderHook(() => useLogout(), {
      wrapper: RecoilWrapper,
    });
    act(() => {
      result.current.handleLogout();
    });

    const { result: state } = renderHook(() => useRecoilValue(getAppState.loggedIn));
    expect(state.current).toEqual(false);
    expect(api.isLoggedIn()).toEqual(false);
  });
});
