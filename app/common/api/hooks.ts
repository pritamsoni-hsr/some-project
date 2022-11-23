import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from './client';
import {
  CreateTransactionOperationRequest,
  CreateWalletOperationRequest,
  DeleteTransactionRequest,
  DeleteWalletRequest,
  GetTransactionsRequest,
  UpdateTransactionRequest,
  UpdateWalletRequest,
} from './openapi';

/**
 * Transaction
 */
export const useTransactions = (props: Partial<GetTransactionsRequest> = {}) => {
  return useInfiniteQuery(
    [props, 'useTransactions'],
    ({ pageParam }) => api.wallet.getTransactions({ walletId: props.walletId!, cursor: pageParam }),
    {
      getNextPageParam: lastPage => lastPage.next,
      enabled: !!props.walletId,
    },
  );
};

export const useTransaction = (id: string, walletId: string) => {
  return useQuery(['useTransaction', id, walletId], () => api.wallet.getTransaction({ id, walletId }), {
    enabled: !!walletId,
  });
};

export const useCreateTransaction = () => {
  const client = useQueryClient();
  return useMutation((req: CreateTransactionOperationRequest) => api.wallet.createTransaction(req), {
    onSuccess() {
      client.invalidateQueries();
    },
  });
};

export const useUpdateTransaction = () => {
  const client = useQueryClient();
  return useMutation((req: UpdateTransactionRequest) => api.wallet.updateTransaction(req), {
    onSuccess() {
      client.invalidateQueries();
    },
  });
};

export const useDeleteTransaction = () => {
  const client = useQueryClient();
  return useMutation((req: DeleteTransactionRequest) => api.wallet.deleteTransaction(req), {
    onSuccess() {
      client.invalidateQueries();
    },
  });
};

/**
 * Wallets
 */
export const useWallets = () => {
  return useQuery(['useWallets'], () => api.wallet.getWallets());
};

export const useWallet = (id: string) => {
  return useQuery(['useWallet', id], () => api.wallet.getWallet({ id }));
};

export const useCreateWallet = () => {
  const client = useQueryClient();
  return useMutation((req: CreateWalletOperationRequest) => api.wallet.createWallet(req), {
    onSuccess() {
      client.invalidateQueries();
    },
  });
};

export const useUpdateWallet = () => {
  const client = useQueryClient();
  return useMutation((req: UpdateWalletRequest) => api.wallet.updateWallet(req), {
    onSuccess() {
      client.invalidateQueries();
    },
  });
};

export const useDeleteWallet = () => {
  const client = useQueryClient();
  return useMutation((req: DeleteWalletRequest) => api.wallet.deleteWallet(req), {
    onSuccess() {
      client.invalidateQueries();
    },
  });
};
