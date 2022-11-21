import { atom } from 'recoil';

export const selectedWallet = atom<string>({
  key: 'Finance_selectedWallet',
  default: '',
});
