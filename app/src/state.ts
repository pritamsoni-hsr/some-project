import { atom, selector } from 'recoil';

type AppState = Partial<{
  loggedIn: boolean;
  selectedTab: 'monthly' | 'all';
}>;

const appState = atom<AppState>({
  key: 'appState',
  default: {
    loggedIn: false,
  },
});

const getAppState = () => null;

getAppState.loggedIn =
  selector({
    key: 'appState_loggedIn',
    get(opts) {
      return opts.get(appState).loggedIn;
    },
    set(opts, newValue: boolean) {
      opts.set(appState, x => ({ ...x, loggedIn: newValue }));
    },
  });

export { getAppState };
