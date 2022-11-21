import { useWallets } from 'common';

export const useGetWalletById = (id: string) => {
  const response = useWallets();
  return response.data?.results.find(e => e.id === id);
};
