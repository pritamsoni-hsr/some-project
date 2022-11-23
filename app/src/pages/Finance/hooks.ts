import { TransactionResponse as Transaction, useCurrencies, useWallets } from 'common';

export const useGetWalletById = (id: string) => {
  const response = useWallets();
  return response.data?.results.find(e => e.id === id);
};

export const useCurrencySymbols = () => {
  const { data } = useCurrencies();

  const getSymbol = (code: string) => {
    const currency = data?.[code];
    return currency?.symbol || code;
  };

  const getAmountPair = (tx: Transaction) => {
    return {
      amount: tx.amount,
      symbol: getSymbol(tx.currency),
    };
  };

  const renderAmount = (tx: Transaction) => {
    const amountPair = getAmountPair(tx);
    return `${amountPair.symbol} ${amountPair.amount}`;
  };

  return { getSymbol, renderAmount, getAmountPair };
};
