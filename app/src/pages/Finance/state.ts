import { atom, selector } from 'recoil';

import { WalletResponse } from 'common/index';

export const selectedWallet = atom<WalletResponse | undefined>({
  key: 'Finance_selectedWallet',
  default: undefined,
});

export const selectedWalletId = selector({
  key: 'selectedWalletId',
  get(opts) {
    return opts.get(selectedWallet)?.id;
  },
  set(opts, newValue: string) {
    opts.set(selectedWallet, x => ({ ...x, id: newValue }));
  },
});
